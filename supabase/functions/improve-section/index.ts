import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { callClaude } from "../_shared/anthropic.ts";

const MAX_BODY_BYTES = 64 * 1024;
const MAX_LABEL = 200;
const MAX_KEY = 100;
const MAX_TEXT = 8000;


const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const aiUnavailableMessage =
  "O serviço de IA está temporariamente sobrecarregado. Tente novamente em alguns instantes.";
const aiCreditsExhaustedMessage =
  "Os créditos da chave Gemini foram esgotados. Acesse https://ai.studio/projects para recarregar ou atualize a chave Gemini_API_KEY nas configurações do projeto. / Los créditos de Gemini se agotaron: recarga en https://ai.studio/projects o actualiza la clave Gemini_API_KEY.";

const jsonResponse = (body: Record<string, unknown>) =>
  new Response(JSON.stringify(body), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    // --- Auth check ---
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return jsonResponse({ error: "Unauthorized" });
    }
    const sb = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
    );
    const { data: userData, error: userErr } = await sb.auth.getUser(
      authHeader.replace("Bearer ", ""),
    );
    if (userErr || !userData?.user) {
      return jsonResponse({ error: "Unauthorized" });
    }

    // --- Body size + parse ---
    const raw = await req.text();
    if (raw.length > MAX_BODY_BYTES) {
      return jsonResponse({ error: "Payload too large" });
    }
    let parsed: any;
    try { parsed = JSON.parse(raw); } catch {
      return jsonResponse({ error: "Invalid JSON" });
    }
    const { sectionKey, sectionLabel, currentText, language } = parsed ?? {};
    if (typeof sectionKey !== "string" || sectionKey.length === 0 || sectionKey.length > MAX_KEY) {
      return jsonResponse({ error: "Invalid sectionKey" });
    }
    if (typeof sectionLabel !== "string" || sectionLabel.length === 0 || sectionLabel.length > MAX_LABEL) {
      return jsonResponse({ error: "Invalid sectionLabel" });
    }
    if (typeof currentText !== "string" || currentText.length === 0 || currentText.length > MAX_TEXT) {
      return jsonResponse({ error: "Invalid currentText" });
    }
    if (language !== "pt" && language !== "es") {
      return jsonResponse({ error: "Invalid language" });
    }

    const lang = language === "es" ? "español" : "português brasileiro";

    const systemPrompt = "Você é um consultor especialista em problem framing e inovação estratégica. Seu trabalho é melhorar textos de seções de um Challenge Canvas, tornando-os mais claros, completos, estratégicos e acionáveis. Responda sempre em " + lang + ". Retorne APENAS o texto melhorado, sem explicações adicionais. IMPORTANTE: NÃO use formatação Markdown (sem cerquilha, asteriscos, travessões, blocos de código, etc). Retorne texto puro com quebras de linha simples para separar parágrafos.";
    const userPrompt = `Melhore o seguinte texto da seção "${sectionLabel}" de um Challenge Canvas:\n\n"${currentText}"\n\nRetorne apenas o texto melhorado, mais completo e estratégico.`;

    const result = await callClaude({ system: systemPrompt, user: userPrompt, stream: true });
    if (!result.response) {
      return jsonResponse({ error: result.error ?? aiUnavailableMessage, fallback: true });
    }
    const response = result.response;

    // Transform Gemini SSE format to OpenAI-compatible SSE format for the frontend
    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();
    const encoder = new TextEncoder();

    (async () => {
      try {
        const reader = response.body!.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          let newlineIdx: number;
          while ((newlineIdx = buffer.indexOf("\n")) !== -1) {
            const line = buffer.slice(0, newlineIdx).trim();
            buffer = buffer.slice(newlineIdx + 1);

            if (!line.startsWith("data: ")) continue;
            const jsonStr = line.slice(6);
            if (jsonStr === "[DONE]") continue;

            try {
              const parsed = JSON.parse(jsonStr);
              const text = parsed.type === "content_block_delta" ? parsed.delta?.text : undefined;
              if (text) {
                const sseChunk = `data: ${JSON.stringify({
                  choices: [{ delta: { content: text } }],
                })}\n\n`;
                await writer.write(encoder.encode(sseChunk));
              }
            } catch {
              // partial JSON, skip
            }
          }
        }
        await writer.write(encoder.encode("data: [DONE]\n\n"));
      } catch (e) {
        console.error("Stream transform error:", e);
      } finally {
        await writer.close();
      }
    })();

    return new Response(readable, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("improve-section error:", e);
    return jsonResponse({
      error: e instanceof Error ? e.message : aiUnavailableMessage,
      fallback: true,
    });
  }
});
