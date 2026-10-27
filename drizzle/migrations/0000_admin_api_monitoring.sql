CREATE TYPE public.app_role AS ENUM ('admin', 'user');
CREATE TABLE public.user_roles (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
 role public.app_role NOT NULL,
 UNIQUE(user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT EXISTS(SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role) $$;
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;
CREATE POLICY "Users read own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());
INSERT INTO public.user_roles(user_id, role) SELECT id, 'admin'::public.app_role FROM auth.users WHERE id = '32f970f9-67c6-4ec6-8124-9d20f9f240c2';
CREATE TABLE public.api_usage_logs (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 created_at timestamptz NOT NULL DEFAULT now(),
 user_id uuid NOT NULL,
 provider text NOT NULL CHECK (provider IN ('anthropic', 'gemini')),
 operation text NOT NULL CHECK (operation IN ('improve-section', 'evaluate-canvas', 'generate-infographic')),
 model text NOT NULL,
 success boolean NOT NULL,
 http_status integer,
 duration_ms integer NOT NULL DEFAULT 0,
 input_tokens integer,
 output_tokens integer,
 error_code text,
 error_message text
);
GRANT SELECT ON public.api_usage_logs TO authenticated;
GRANT ALL ON public.api_usage_logs TO service_role;
ALTER TABLE public.api_usage_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read API logs" ON public.api_usage_logs FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE INDEX api_usage_logs_created_at_idx ON public.api_usage_logs(created_at DESC);
CREATE INDEX api_usage_logs_provider_idx ON public.api_usage_logs(provider, created_at DESC);
