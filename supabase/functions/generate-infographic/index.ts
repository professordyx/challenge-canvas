import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.95.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { canvas, title, language, challengeId } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

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

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-pro-image-preview",
        messages: [{ role: "user", content: prompt }],
        modalities: ["image", "text"],
      }),
    });

    if (!response.ok) {
      const status = response.status;
      if (status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (status === 402) {
        return new Response(JSON.stringify({ error: "Payment required." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI image error:", status, t);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!imageUrl) {
      throw new Error("No image generated");
    }

    // Store in Supabase Storage
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Decode base64 and upload
    const base64Data = imageUrl.replace(/^data:image\/\w+;base64,/, "");
    const binaryData = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));
    const fileName = `infographics/${challengeId}-${Date.now()}.png`;

    const { error: uploadError } = await supabase.storage
      .from("canvas-assets")
      .upload(fileName, binaryData, { contentType: "image/png", upsert: true });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      // Return base64 as fallback
      return new Response(JSON.stringify({ imageUrl }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: publicUrl } = supabase.storage.from("canvas-assets").getPublicUrl(fileName);

    return new Response(JSON.stringify({ imageUrl: publicUrl.publicUrl }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-infographic error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
