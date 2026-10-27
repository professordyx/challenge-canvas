export function classifyApiError(status: number, body: string): { code: string; message: string } {
  const text = body.toLowerCase();
  if (text.includes('credit balance') || text.includes('prepayment credits') || text.includes('credits are depleted')) {
    return { code: 'credits_exhausted', message: 'Créditos esgotados / Créditos agotados' };
  }
  if (status === 401 || status === 403) return { code: 'authentication_error', message: 'Credencial inválida ou acesso negado / Credencial inválida o acceso denegado' };
  if (status === 429) return { code: 'rate_limit', message: 'Limite de uso atingido / Límite de uso alcanzado' };
  if (status === 404) return { code: 'model_unavailable', message: 'Modelo indisponível / Modelo no disponible' };
  if (status >= 500) return { code: 'provider_unavailable', message: 'Serviço indisponível / Servicio no disponible' };
  return { code: 'provider_error', message: 'Erro na solicitação à API / Error en la solicitud a la API' };
}

export function tokenCount(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0 ? Math.floor(value) : null;
}