# Architecture rules
- Administrative access is stored in public.user_roles and enforced by database RLS; UI visibility is not an authorization boundary.
- API telemetry is collected server-side through the shared monitoring helper for each provider attempt, without prompts, generated content, credentials, or raw provider error bodies.
- Dashboard totals are aggregated in a permission-checked database function; request history is paginated separately so totals are never limited by page size.
- Canvas edits are debounced and serialized per challenge through src/lib/autosave.ts so typing and AI streaming do not flood the database or overwrite newer edits.
- Product plan constants live in src/lib/plans.ts; checkout and server enforcement must be activated together so users are not locked out before subscriptions are available.
- Billing subscriptions and quotas are environment-scoped; live billing remains disabled until seller verification, while signed payment events are applied atomically with event ordering to prevent duplicate or stale access changes.