import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { classifyApiError, tokenCount } from './telemetry-data.ts';

type Context = { userId: string; provider: 'anthropic' | 'gemini'; operation: 'improve-section' | 'evaluate-canvas' | 'generate-infographic'; model: string };
type Outcome = { success: boolean; http_status?: number; duration_ms: number; input_tokens?: number | null; output_tokens?: number | null; error_code?: string; error_message?: string };

export async function recordApiUsage(context: Context, outcome: Outcome) {
  try {
    const url = Deno.env.get('SUPABASE_URL');
    const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!url || !key) { console.error('API telemetry configuration unavailable'); return; }
    const { error } = await createClient(url, key).from('api_usage_logs').insert({
      user_id: context.userId, provider: context.provider, operation: context.operation, model: context.model, ...outcome,
    });
    if (error) console.error('API telemetry write failed', error.code);
  } catch { console.error('API telemetry write failed'); }
}

// Observes the provider response, including streamed usage and errors, without retaining content.
export async function monitoredFetch(context: Context, url: string, init: RequestInit): Promise<Response> {
  const start = Date.now();
  let response: Response;
  try { response = await fetch(url, init); }
  catch (error) {
    await recordApiUsage(context, { success: false, duration_ms: Date.now() - start, error_code: 'network_error', error_message: 'Falha de conexão / Fallo de conexión' });
    throw error;
  }
  if (!response.ok) {
    const error = classifyApiError(response.status, await response.clone().text());
    await recordApiUsage(context, { success: false, http_status: response.status, duration_ms: Date.now() - start, error_code: error.code, error_message: error.message });
    return response;
  }
  if (!response.headers.get('content-type')?.includes('text/event-stream')) {
    let data;
    try { data = await response.clone().json(); } catch { /* recorded as invalid response below */ }
    const valid = context.provider === 'gemini'
      ? data?.candidates?.some((candidate: any) => candidate.content?.parts?.some((part: any) => part.inlineData?.data))
      : data?.content?.some((block: any) => block.type === 'text');
    await recordApiUsage(context, {
      success: Boolean(valid), http_status: response.status, duration_ms: Date.now() - start,
      input_tokens: tokenCount(data?.usage?.input_tokens ?? data?.usageMetadata?.promptTokenCount),
      output_tokens: tokenCount(data?.usage?.output_tokens ?? data?.usageMetadata?.candidatesTokenCount),
      ...(valid ? {} : { error_code: 'invalid_response', error_message: 'Resposta sem conteúdo esperado / Respuesta sin contenido esperado' }),
    });
    return response;
  }
  const reader = response.body?.getReader();
  if (!reader) {
    await recordApiUsage(context, { success: false, http_status: response.status, duration_ms: Date.now() - start, error_code: 'empty_stream', error_message: 'Resposta vazia / Respuesta vacía' });
    return response;
  }
  let inputTokens: number | null = null;
  let outputTokens: number | null = null;
  let ended = false;
  let streamError = false;
  let buffer = '';
  let recorded = false;
  const decoder = new TextDecoder();
  const finish = async () => {
    if (recorded) return;
    recorded = true;
    await recordApiUsage(context, { success: ended && !streamError, http_status: response.status, duration_ms: Date.now() - start,
      input_tokens: inputTokens, output_tokens: outputTokens,
      ...(ended && !streamError ? {} : { error_code: 'stream_error', error_message: 'Resposta interrompida / Respuesta interrumpida' }),
    });
  };
  const stream = new ReadableStream<Uint8Array>({
    async pull(controller) {
      try {
        const { done, value } = await reader.read();
        if (done) { await finish(); controller.close(); return; }
        buffer += decoder.decode(value, { stream: true });
        let index: number;
        while ((index = buffer.indexOf('\n')) >= 0) {
          const line = buffer.slice(0, index).trim(); buffer = buffer.slice(index + 1);
          if (!line.startsWith('data:')) continue;
          try {
            const event = JSON.parse(line.slice(5).trim());
            if (event.type === 'message_start') inputTokens = tokenCount(event.message?.usage?.input_tokens);
            if (event.type === 'message_delta') outputTokens = tokenCount(event.usage?.output_tokens);
            if (event.type === 'message_stop') ended = true;
            if (event.type === 'error') streamError = true;
          } catch { /* Non-JSON keepalive. */ }
        }
        controller.enqueue(value);
      } catch (error) { streamError = true; await finish(); controller.error(error); }
    },
    async cancel() { streamError = true; await reader.cancel(); await finish(); },
  });
  return new Response(stream, { status: response.status, headers: response.headers });
}