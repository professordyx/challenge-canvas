import { reserveUsage, type UsageLease } from "../_shared/plan-access.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { callClaude } from "../_shared/anthropic.ts";

const MAX_BODY_BYTES = 160 * 1024;
const MAX_TRANSCRIPT = 120_000;
const MAX_TITLE = 500;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const CANVAS_KEYS = [
  "strategic_context",
  "problem",
  "impact",
  "stakeholders",
  "challenge_statement",
  "success_metrics",
  "constraints",
  "resources",
  "hypotheses",
  "solution_approach",
  "governance",
  "deliverables",
] as const;

function json(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function cleanPlainText(value: unknown): string {
  if (typeof value !== "string") return "";
  return value
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/__(.*?)__/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .trim();
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

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

    const raw = await req.text();
    if (raw.length > MAX_BODY_BYTES) return json({ error: "Payload too large" }, 413);

    let parsed: any;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return json({ error: "Invalid JSON" }, 400);
    }

    const { transcript, language, title, challengeId } = parsed ?? {};
    if (typeof transcript !== "string" || transcript.trim().length < 10 || transcript.length > MAX_TRANSCRIPT) {
      return json({ error: "Invalid transcript" }, 400);
    }
    if (language !== "pt" && language !== "es" && language !== "en") {
      return json({ error: "Invalid language" }, 400);
    }
    if (title !== undefined && (typeof title !== "string" || title.length > MAX_TITLE)) {
      return json({ error: "Invalid title" }, 400);
    }
    if (typeof challengeId !== "string" || !UUID_RE.test(challengeId)) {
      return json({ error: "Invalid challengeId" }, 400);
    }

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

    const reservation = await reserveUsage(userId, "fill-canvas", parsed.environment, language);
    if (reservation instanceof Response) return reservation;
    usageLease = reservation;

    const lang = language === "es" ? "español" : language === "en" ? "English" : "português brasileiro";
    const systemPrompt = `Você é um especialista em Challenge Canvas e problem framing estratégico.
Leia a transcrição da entrevista e extraia informações para preencher os 12 campos do Challenge Canvas em ${lang}.

REGRAS OBRIGATÓRIAS:
1. Retorne APENAS um objeto JSON válido contendo exatamente estas 12 chaves:
${CANVAS_KEYS.join(", ")}.
2. Cada valor deve ser texto simples (plain text), SEM qualquer formatação Markdown (sem asteriscos, sem negrito, sem hashtags, sem blocos de código).
3. NUNCA invente ou suponha dados que não estejam na entrevista. Se a entrevista não trouxer informação suficiente para um campo, devolva string vazia "" nesse campo.
4. Seja objetivo, claro e fiel ao que foi dito na entrevista, preservando números, prazos, stakeholders e restrições mencionados.
5. Não inclua nenhum texto fora do JSON.`;

    const userPrompt = `${title ? `Título do desafio: ${title}\n\n` : ""}Transcrição da entrevista:\n${transcript.trim()}`;

    const result = await callClaude({
      system: systemPrompt,
      user: userPrompt,
      stream: false,
      maxTokens: 4096,
      userId,
      operation: "fill-canvas",
    });

    if (!result.response) {
      return json({ error: result.error, fallback: true });
    }

    const data = await result.response.json();
    const content = (data.content ?? [])
      .filter((b: any) => b.type === "text")
      .map((b: any) => b.text)
      .join("")
      .trim();

    let extracted: Record<string, unknown>;
    try {
      const cleaned = content.replace(/```json\n?/gi, "").replace(/```\n?/g, "").trim();
      const start = cleaned.indexOf("{");
      const end = cleaned.lastIndexOf("}");
      const slice = start >= 0 && end > start ? cleaned.slice(start, end + 1) : cleaned;
      extracted = JSON.parse(slice);
    } catch {
      return json({
        error: "Não foi possível estruturar os campos a partir da transcrição. / No se pudieron estructurar los campos desde la transcripción. / Could not structure the fields from the transcript.",
        fallback: true,
      });
    }

    const fields: Record<string, string> = {};
    for (const key of CANVAS_KEYS) {
      fields[key] = cleanPlainText(extracted?.[key]);
    }

    usageSucceeded = true;
    return json({ fields });
  } catch (e) {
    console.error("fill-canvas error:", e);
    return json({ error: e instanceof Error ? e.message : "Unknown error", fallback: true });
  } finally {
    if (usageLease) await usageLease.finish(usageSucceeded);
  }
});