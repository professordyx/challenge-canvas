import { monitoredFetch, recordApiUsage } from './api-monitoring.ts';
// Shared Anthropic (Claude) helper. Tries the requested model first, then falls back.
export const CLAUDE_MODELS = ["claude-sonnet-5-5", "claude-sonnet-4-5"];

export const msgs = {
  credits:
    "Os créditos da API da Anthropic acabaram. Recarregue em console.anthropic.com. / Los créditos de la API de Anthropic se agotaron. Recarga en console.anthropic.com.",
  rate:
    "Limite de uso da IA atingido. Tente novamente em alguns instantes. / Límite de uso de la IA alcanzado. Inténtalo de nuevo en unos instantes.",
  auth:
    "A chave da Anthropic é inválida. Atualize a chave anthropic_challenge_canvas. / La clave de Anthropic no es válida. Actualiza la clave anthropic_challenge_canvas.",
  generic: "Erro no serviço de IA. / Error en el servicio de IA.",
};

export async function callClaude(opts: {
  system: string;
  user: string;
  stream: boolean;
  maxTokens?: number;
  userId: string;
  operation: 'improve-section' | 'evaluate-canvas';
}): Promise<{ response?: Response; model?: string; error?: string }> {
  const key = Deno.env.get("anthropic_challenge_canvas");
  if (!key) {
    await recordApiUsage({ userId: opts.userId, provider: 'anthropic', operation: opts.operation, model: CLAUDE_MODELS[0] }, { success: false, duration_ms: 0, error_code: 'missing_key', error_message: 'Chave não configurada / Clave no configurada' });
    return { error: msgs.auth };
  }
  let lastStatus = 0;
  let lastBody = "";
  for (const model of CLAUDE_MODELS) {
    const r = await monitoredFetch({ userId: opts.userId, provider: 'anthropic', operation: opts.operation, model }, "https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model,
        max_tokens: opts.maxTokens ?? 4096,
        system: opts.system,
        stream: opts.stream,
        messages: [{ role: "user", content: opts.user }],
      }),
    });
    if (r.ok) return { response: r, model };
    lastStatus = r.status;
    lastBody = await r.text();
    console.error(`Anthropic ${model} error:`, r.status);
    // Only fall back when the model itself is unavailable
    if (r.status !== 404 && !lastBody.includes("not_found")) break;
  }
  const lower = lastBody.toLowerCase();
  if (lower.includes("credit balance")) return { error: msgs.credits };
  if (lastStatus === 401 || lastStatus === 403) return { error: msgs.auth };
  if (lastStatus === 429 || lastStatus === 529) return { error: msgs.rate };
  return { error: msgs.generic };
}
