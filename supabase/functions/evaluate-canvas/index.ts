import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { canvas, title, language } = await req.json();
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
