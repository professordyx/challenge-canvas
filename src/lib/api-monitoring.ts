export type ApiSummary = {
  total: number; errors: number; avg_ms: number; input_tokens: number; output_tokens: number; token_reports: number;
  daily: { day: string; requests: number; errors: number }[];
};
export function successRate(total: number, errors: number): number | null {
  return total > 0 ? ((total - errors) / total) * 100 : null;
}