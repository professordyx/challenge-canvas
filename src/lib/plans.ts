/** Shared product rules; enforcement must also run on the server before activation. */
export const PLAN_RULES = {
  free: { canvases: 1, evaluations: 1, infographics: 1, recording: false, assistant: false },
  premium: { canvases: Infinity, evaluations: Infinity, infographics: Infinity, recording: true, assistant: true },
} as const;
export const PREMIUM_MONTHLY_USD = 5;