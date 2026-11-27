import { reserveUsage, type UsageLease } from "../_shared/plan-access.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { monitoredFetch, recordApiUsage } from "../_shared/api-monitoring.ts";

const MAX_AUDIO_BYTES = 20 * 1024 * 1024;
const INLINE_THRESHOLD_BYTES = 12 * 1024 * 1024;
const MODEL = "gemini-2.5-flash";
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const ALLOWED_MIME = new Set([
  "audio/webm", "audio/mp4", "audio/m4a", "audio/x-m4a",
  "audio/mpeg", "audio/mp3", "audio/wav", "audio/x-wav",
  "audio/ogg", "audio/aac", "audio/flac",
]);

const msgs = {
  credits:
    "Os créditos da API do Gemini acabaram. Recarregue sua conta Google AI. / Los créditos de la API de Gemini se agotaron. Recarga tu cuenta de Google AI. / Gemini API credits ran out. Top up your Google AI account.",
  rate:
    "Limite de uso do Gemini atingido. Tente novamente em alguns instantes. / Límite de uso de Gemini alcanzado. Inténtalo de nuevo en unos instantes. / Gemini usage limit reached. Try again shortly.",
  auth:
    "A chave do Gemini é inválida ou não está configurada. / La clave de Gemini no es válida o no está configurada. / The Gemini key is invalid or not configured.",
  tooLarge:
    "O áudio excede o limite de 20 MB. / El audio supera el límite de 20 MB. / The audio exceeds the 20 MB limit.",
  badType:
    "Formato de áudio não suportado. Use mp3, m4a, wav, ogg ou webm. / Formato de audio no compatible. Usa mp3, m4a, wav, ogg o webm. / Unsupported audio format. Use mp3, m4a, wav, ogg or webm.",
  empty:
    "Não foi possível identificar fala no áudio. / No se pudo identificar voz en el audio. / Could not detect speech in the audio.",
  generic:
    "Não foi possível transcrever a entrevista no momento. / No se pudo transcribir la entrevista en este momento. / Could not transcribe the interview right now.",
};

function json(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function normalizeMime(rawType: string, fileName?: string): string {
  const base = rawType.split(";")[0].trim().toLowerCase();
  if (base === "video/webm") return "audio/webm";
  if (base === "audio/x-m4a" || base === "audio/m4a") return "audio/mp4";
  if (base === "audio/mp3") return "audio/mpeg";
  if (base === "audio/x-wav") return "audio/wav";
  if (ALLOWED_MIME.has(base)) return base;
  const ext = fileName?.split(".").pop()?.toLowerCase();
  if (ext === "mp3") return "audio/mpeg";
  if (ext === "m4a" || ext === "mp4") return "audio/mp4";
  if (ext === "wav") return "audio/wav";
  if (ext === "webm") return "audio/webm";
  if (ext === "ogg") return "audio/ogg";
  return "";
}

function bytesToBase64(bytes: Uint8Array): string {
  let binary = "";
  const chunk = 8192;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

async function uploadToGeminiFiles(bytes: Uint8Array, mimeType: string, apiKey: string) {
  const uploadRes = await fetch(
    `https://generativelanguage.googleapis.com/upload/v1beta/files?uploadType=media&key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": mimeType },
      body: bytes,
    },
  );
  if (!uploadRes.ok) {
    const errBody = await uploadRes.text();
    return { errorStatus: uploadRes.status, errorBody: errBody };
  }
  const uploaded = await uploadRes.json();
  const file = uploaded?.file;
  if (!file?.uri || !file?.name) {
    return { errorStatus: 502, errorBody: "Missing file uri" };
  }
  let state = file.state;
  for (let i = 0; i < 15 && state === "PROCESSING"; i++) {
    await new Promise((r) => setTimeout(r, 1000));
    const check = await fetch(`https://generativelanguage.googleapis.com/v1beta/${file.name}?key=${apiKey}`);
    if (check.ok) {
      const info = await check.json();
      state = info?.state ?? "ACTIVE";
    }
  }
  return { fileUri: file.uri as string, fileName: file.name as string };
}

function mapGeminiError(status: number, body: string): string {
  const lower = body.toLowerCase();
  if (lower.includes("credit") || lower.includes("prepayment") || lower.includes("depleted") || lower.includes("billing")) {
    return msgs.credits;
  }
  if (status === 401 || status === 403) return msgs.auth;
  if (status === 429) return msgs.rate;
  return msgs.generic;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  let uploadedFileName: string | null = null;
  const GEMINI_API_KEY = Deno.env.get("Gemini_API_KEY");

  let usageLease: UsageLease | undefined;
  let usageSucceeded = false;

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) return json({ error: "Unauthorized" }, 401);

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    const authClient = createClient(supabaseUrl, anonKey);
    const { data: userData, error: userErr } = await authClient.auth.getUser(authHeader.replace("Bearer ", ""));
    if (userErr || !userData?.user) return json({ error: "Unauthorized" }, 401);
    const userId = userData.user.id;

    let form: FormData;
    try {
      form = await req.formData();
    } catch {
      return json({ error: "Invalid multipart form data" }, 400);
    }

    const challengeId = form.get("challengeId");
    const language = form.get("language");
    const audio = form.get("audio");

    if (typeof challengeId !== "string" || !UUID_RE.test(challengeId)) {
      return json({ error: "Invalid challengeId" }, 400);
    }
    if (language !== "pt" && language !== "es" && language !== "en") {
      return json({ error: "Invalid language" }, 400);
    }
    if (!(audio instanceof Blob)) {
      return json({ error: "Audio file is required" }, 400);
    }
    if (audio.size === 0) return json({ error: msgs.empty, fallback: true });
    if (audio.size > MAX_AUDIO_BYTES) return json({ error: msgs.tooLarge, fallback: true });

    const fileName = audio instanceof File ? audio.name : undefined;
    const mimeType = normalizeMime(audio.type || "", fileName);
    if (!mimeType) return json({ error: msgs.badType, fallback: true });

    const admin = createClient(supabaseUrl, serviceRoleKey);
    const { data: challenge, error: chErr } = await admin
      .from("challenges")
      .select("id, user_id")
      .eq("id", challengeId)
      .maybeSingle();
    if (chErr || !challenge) return json({ error: "Challenge not found" }, 404);

    if (challenge.user_id !== userId) {
      const { data: share } = await admin
        .from("challenge_shares")
        .select("permission")
        .eq("challenge_id", challengeId)
        .eq("shared_with_id", userId)
        .maybeSingle();
      if (!share || share.permission !== "editor") return json({ error: "Forbidden" }, 403);
    }

    const reservation = await reserveUsage(userId, "transcribe-interview", form.get("environment"), language);
    if (reservation instanceof Response) return reservation;
    usageLease = reservation;

    if (!GEMINI_API_KEY) {
      await recordApiUsage(
        { userId, provider: "gemini", operation: "transcribe-interview", model: MODEL },
        { success: false, duration_ms: 0, error_code: "missing_key", error_message: "Chave não configurada / Clave no configurada" },
      );
      return json({ error: msgs.auth, fallback: true });
    }

    const bytes = new Uint8Array(await audio.arrayBuffer());
    const langLabel = language === "es" ? "español" : language === "en" ? "English" : "português brasileiro";
    const prompt = `Transcreva fielmente esta entrevista em ${langLabel}, em texto simples (sem Markdown, sem títulos e sem comentários extras). Quando houver mais de uma pessoa falando, separe as falas com quebras de linha indicando o falante de forma simples (ex.: Entrevistador: / Entrevistado:). Preserve números, métricas, nomes e termos técnicos ditos no áudio. Retorne apenas a transcrição.`;

    let audioPart: Record<string, unknown>;
    if (bytes.byteLength <= INLINE_THRESHOLD_BYTES) {
      audioPart = { inlineData: { mimeType, data: bytesToBase64(bytes) } };
    } else {
      const up = await uploadToGeminiFiles(bytes, mimeType, GEMINI_API_KEY);
      if ("errorStatus" in up) {
        await recordApiUsage(
          { userId, provider: "gemini", operation: "transcribe-interview", model: MODEL },
          { success: false, http_status: up.errorStatus, duration_ms: 0, error_code: "upload_error", error_message: "Falha no envio do áudio / Fallo al subir el audio" },
        );
        return json({ error: mapGeminiError(up.errorStatus, up.errorBody), fallback: true });
      }
      uploadedFileName = up.fileName;
      audioPart = { fileData: { mimeType, fileUri: up.fileUri } };
    }

    const response = await monitoredFetch(
      { userId, provider: "gemini", operation: "transcribe-interview", model: MODEL },
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }, audioPart] }],
        }),
      },
    );

    if (!response.ok) {
      const errBody = await response.text();
      console.error("Gemini transcribe error:", response.status);
      return json({ error: mapGeminiError(response.status, errBody), fallback: true });
    }

    const data = await response.json();
    const parts = data?.candidates?.[0]?.content?.parts ?? [];
    const transcript = parts
      .filter((p: any) => typeof p?.text === "string")
      .map((p: any) => p.text)
      .join("\n")
      .trim();

    if (!transcript) return json({ error: msgs.empty, fallback: true });
    usageSucceeded = true;
    return json({ transcript });
  } catch (e) {
    console.error("transcribe-interview error:", e);
    return json({ error: msgs.generic, fallback: true });
  } finally {
    if (usageLease) await usageLease.finish(usageSucceeded);
    if (uploadedFileName && GEMINI_API_KEY) {
      fetch(`https://generativelanguage.googleapis.com/v1beta/${uploadedFileName}?key=${GEMINI_API_KEY}`, {
        method: "DELETE",
      }).catch(() => {});
    }
  }
});