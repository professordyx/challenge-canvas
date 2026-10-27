# Architecture rules
- Administrative access is stored in public.user_roles and enforced by database RLS; UI visibility is not an authorization boundary.
- API telemetry is collected server-side through the shared monitoring helper for each provider attempt, without prompts, generated content, credentials, or raw provider error bodies.
- Dashboard totals are aggregated in a permission-checked database function; request history is paginated separately so totals are never limited by page size.