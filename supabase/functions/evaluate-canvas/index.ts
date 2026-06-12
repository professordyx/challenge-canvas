import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const MAX_BODY_BYTES = 64 * 1024;
const MAX_TITLE = 500;
const MAX_FIELD = 5000;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    // --- Auth check ---
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const sb = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
    );
    const { data: userData, error: userErr } = await sb.auth.getUser(
      authHeader.replace("Bearer ", ""),
    );
    if (userErr || !userData?.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // --- Body size limit ---
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

    const { canvas, title, language } = parsed ?? {};
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
    for (const [k, v] of Object.entries(canvas)) {
      if (v != null && (typeof v !== "string" || v.length > MAX_FIELD)) {
        return new Response(JSON.stringify({ error: `Invalid field: ${k}` }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    const GEMINI_API_KEY = Deno.env.get("Gemini_API_KEY");
    if (!GEMINI_API_KEY) throw new Error("Gemini_API_KEY is not configured");

    const lang = language === "es" ? "español" : "português brasileiro";

    const canvasText = Object.entries(canvas)
      .map(([key, value]) => `**${key}**: ${value || "(vazio)"}`)
      .join("\n");

    const systemPrompt = `Você é um avaliador especialista em Challenge Canvas e problem framing estratégico. Avalie o canvas abaixo e retorne uma análise em ${lang} no seguinte formato JSON:

{
  "score": <número de 0 a 100>,
  "level": "<fraco|adequado|estratégico>",
  "summary": "<resumo geral da avaliação em 2-3 frases>",
  "sections": {
    "<section_key>": {
      "score": <0-100>,
      "feedback": "<feedback específico para esta seção>"
    }
  },
  "recommendations": ["<recomendação 1>", "<recomendação 2>", ...]
}

Retorne APENAS o JSON válido, sem markdown code blocks.`;

    const userPrompt = `Título do Desafio: ${title}\n\nCanvas:\n${canvasText}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            { role: "user", parts: [{ text: systemPrompt + "\n\n" + userPrompt }] },
          ],
        }),
      }
    );

    if (!response.ok) {
      const status = response.status;
      if (status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("Gemini error:", status, t);
      throw new Error("Gemini API error");
    }

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    let evaluation;
    try {
      const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      evaluation = JSON.parse(cleaned);
    } catch {
      evaluation = { score: 0, level: "fraco", summary: content, sections: {}, recommendations: [] };
    }

    return new Response(JSON.stringify(evaluation), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("evaluate-canvas error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
