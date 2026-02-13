import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.95.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { canvas, title, language, challengeId } = await req.json();
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
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`,
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
      if (status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("Gemini image error:", status, t);
      throw new Error("Gemini API error");
    }

    const data = await response.json();
    
    // Find image part in response
    const parts = data.candidates?.[0]?.content?.parts || [];
    const imagePart = parts.find((p: any) => p.inlineData);
    
    if (!imagePart?.inlineData) {
      throw new Error("No image generated");
    }

    const base64Data = imagePart.inlineData.data;
    const mimeType = imagePart.inlineData.mimeType || "image/png";

    // Store in Supabase Storage
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const binaryData = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));
    const ext = mimeType.includes("png") ? "png" : "jpg";
    const fileName = `infographics/${challengeId}-${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("canvas-assets")
      .upload(fileName, binaryData, { contentType: mimeType, upsert: true });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      const imageUrl = `data:${mimeType};base64,${base64Data}`;
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
