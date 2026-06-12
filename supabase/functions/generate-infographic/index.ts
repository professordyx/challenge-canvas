import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const MAX_BODY_BYTES = 64 * 1024;
const MAX_TITLE = 500;
const MAX_FIELD = 5000;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    // --- Auth ---
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const authClient = createClient(supabaseUrl, anonKey);
    const { data: userData, error: userErr } = await authClient.auth.getUser(
      authHeader.replace("Bearer ", ""),
    );
    if (userErr || !userData?.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const userId = userData.user.id;

    // --- Body size + parse ---
    const raw = await req.text();
    if (raw.length > MAX_BODY_BYTES) {
      return new Response(JSON.stringify({ error: "Payload too large" }), {
        status: 413, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    let parsed: any;
    try { parsed = JSON.parse(raw); } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { canvas, title, language, challengeId } = parsed ?? {};
    if (!canvas || typeof canvas !== "object" || Array.isArray(canvas)) {
      return new Response(JSON.stringify({ error: "Invalid canvas" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (typeof title !== "string" || title.length === 0 || title.length > MAX_TITLE) {
      return new Response(JSON.stringify({ error: "Invalid title" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (language !== "pt" && language !== "es") {
      return new Response(JSON.stringify({ error: "Invalid language" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (typeof challengeId !== "string" || !UUID_RE.test(challengeId)) {
      return new Response(JSON.stringify({ error: "Invalid challengeId" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    for (const [k, v] of Object.entries(canvas)) {
      if (v != null && (typeof v !== "string" || v.length > MAX_FIELD)) {
        return new Response(JSON.stringify({ error: `Invalid field: ${k}` }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // --- Verify the challenge belongs to (or is shared with) the authenticated user ---
    const admin = createClient(supabaseUrl, serviceRoleKey);
    const { data: challenge, error: chErr } = await admin
      .from("challenges")
      .select("id, user_id")
      .eq("id", challengeId)
      .maybeSingle();
    if (chErr || !challenge) {
      return new Response(JSON.stringify({ error: "Challenge not found" }), {
        status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (challenge.user_id !== userId) {
      const { data: share } = await admin
        .from("challenge_shares")
        .select("permission")
        .eq("challenge_id", challengeId)
        .eq("shared_with_id", userId)
        .maybeSingle();
      if (!share) {
        return new Response(JSON.stringify({ error: "Forbidden" }), {
          status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    const GEMINI_API_KEY = Deno.env.get("Gemini_API_KEY");
    if (!GEMINI_API_KEY) throw new Error("Gemini_API_KEY is not configured");

    const lang = language === "es" ? "español" : "português brasileiro";

    const canvasText = Object.entries(canvas)
      .filter(([_, v]) => v)
      .map(([key, value]) => `- ${key}: ${value}`)
      .join("\n");

    const prompt = `Crie um infográfico visual e profissional em ${lang} que resuma o seguinte Challenge Canvas intitulado "${title}". 

O infográfico deve ter estilo ilustrado, colorido, com ícones, setas e conexões visuais entre os elementos. Use um layout moderno com a declaração do desafio em destaque no topo. Inclua:

- A declaração do desafio como título principal
- Os stakeholders envolvidos com ícones de pessoas
- O problema atual e impacto no negócio
- As restrições e recursos disponíveis
- Os critérios de sucesso e entregáveis
- Setas conectando os elementos de forma lógica
- Cores vibrantes (laranja, azul, verde) com fundo claro

Dados do canvas:
${canvasText}

Gere a imagem como um infográfico profissional no estilo editorial ilustrado.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-image-preview:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: {
            responseModalities: ["TEXT", "IMAGE"],
          },
        }),
      }
    );

    if (!response.ok) {
      const status = response.status;
      const t = await response.text().catch(() => "");
      console.error("Gemini image error:", status, t);
      const msg = status === 429
        ? "O serviço de geração de imagens está temporariamente sobrecarregado. Tente novamente em alguns instantes."
        : "Não foi possível gerar o infográfico no momento.";
      return new Response(JSON.stringify({ error: msg, fallback: true }), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();

    const parts = data.candidates?.[0]?.content?.parts || [];
    const imagePart = parts.find((p: any) => p.inlineData);

    if (!imagePart?.inlineData) {
      throw new Error("No image generated");
    }

    const base64Data = imagePart.inlineData.data;
    const mimeType = imagePart.inlineData.mimeType || "image/png";

    const binaryData = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));
    const ext = mimeType.includes("png") ? "png" : "jpg";
    const fileName = `infographics/${challengeId}-${Date.now()}.${ext}`;

    const uploadRes = await fetch(
      `${supabaseUrl}/storage/v1/object/canvas-assets/${fileName}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${serviceRoleKey}`,
          "Content-Type": mimeType,
          "x-upsert": "true",
        },
        body: binaryData,
      }
    );

    if (!uploadRes.ok) {
      console.error("Upload error:", await uploadRes.text());
      const imageUrl = `data:${mimeType};base64,${base64Data}`;
      return new Response(JSON.stringify({ imageUrl }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const publicUrl = `${supabaseUrl}/storage/v1/object/public/canvas-assets/${fileName}`;

    return new Response(JSON.stringify({ imageUrl: publicUrl }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-infographic error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error", fallback: true }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
