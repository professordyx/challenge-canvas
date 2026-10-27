export type ApiSummary = {
  total: number; errors: number; avg_ms: number; input_tokens: number; output_tokens: number; token_reports: number;
  daily: { day: string; requests: number; errors: number }[];
};
export function successRate(total: number, errors: number): number | null {
  return total > 0 ? ((total - errors) / total) * 100 : null;
}
export type ModelPrice = { model: string; input_per_mtok: number; output_per_mtok: number; per_image: number };
export type UserUsage = { user_id: string; email: string | null; calls: number; errors: number; input_tokens: number; output_tokens: number; cost: number };
export type CostSummary = { cost_total: number; cost_anthropic: number; cost_gemini: number; unpriced_models: string[]; users: UserUsage[] };

/** Estimated US$ cost of one call. Mirrors public.api_usage_by_user. */
export function estimateCost(row: { success: boolean; input_tokens: number | null; output_tokens: number | null }, price?: ModelPrice | null): number | null {
  if (!price) return null;
  if (!row.success) return 0;
  const input = (row.input_tokens ?? 0) * Number(price.input_per_mtok) / 1_000_000;
  if (Number(price.per_image) > 0) return Number(price.per_image) + input;
  return input + (row.output_tokens ?? 0) * Number(price.output_per_mtok) / 1_000_000;
}
