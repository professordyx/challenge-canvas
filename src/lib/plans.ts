/** Shared product rules; enforcement must also run on the server before activation. */
export const PLAN_RULES = {
  free: { canvases: 1, evaluations: 1, infographics: 1, recording: false, assistant: false },
  premium: { canvases: Infinity, evaluations: Infinity, infographics: Infinity, recording: true, assistant: true },
} as const;
export const PREMIUM_MONTHLY_USD = 5;
export function hasSubscriptionAccess(sub: { status: string; current_period_end: string | null } | null, now = Date.now()) {
  if (!sub) return false;
  const end = sub.current_period_end ? Date.parse(sub.current_period_end) : null;
  if (sub.status === 'active' || sub.status === 'trialing' || sub.status === 'past_due') return end === null || end > now;
  return sub.status === 'canceled' && end !== null && end > now;
}