CREATE TABLE public.api_model_prices (
 model text PRIMARY KEY,
 input_per_mtok numeric NOT NULL DEFAULT 0,
 output_per_mtok numeric NOT NULL DEFAULT 0,
 per_image numeric NOT NULL DEFAULT 0,
 updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.api_model_prices TO authenticated;
GRANT ALL ON public.api_model_prices TO service_role;
ALTER TABLE public.api_model_prices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage prices" ON public.api_model_prices FOR ALL TO authenticated
 USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.api_usage_by_user(since_at timestamptz, provider_filter text DEFAULT NULL, operation_filter text DEFAULT NULL, status_filter text DEFAULT NULL)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE result jsonb;
BEGIN
 IF NOT public.has_role(auth.uid(), 'admin') THEN RAISE EXCEPTION 'forbidden' USING ERRCODE = '42501'; END IF;
 WITH l AS (
  SELECT l.*, CASE WHEN NOT l.success THEN 0
   WHEN COALESCE(p.per_image,0) > 0 THEN p.per_image + COALESCE(l.input_tokens,0) * p.input_per_mtok / 1000000
   ELSE (COALESCE(l.input_tokens,0) * COALESCE(p.input_per_mtok,0) + COALESCE(l.output_tokens,0) * COALESCE(p.output_per_mtok,0)) / 1000000 END AS cost
  FROM public.api_usage_logs l LEFT JOIN public.api_model_prices p ON p.model = l.model
  WHERE l.created_at >= since_at
   AND (provider_filter IS NULL OR l.provider = provider_filter)
   AND (operation_filter IS NULL OR l.operation = operation_filter)
   AND (status_filter IS NULL OR l.success = (status_filter = 'success'))
 ), u AS (
  SELECT l.user_id, au.email::text AS email, count(*)::int AS calls, count(*) FILTER (WHERE NOT l.success)::int AS errors,
   COALESCE(sum(l.input_tokens),0)::bigint AS input_tokens, COALESCE(sum(l.output_tokens),0)::bigint AS output_tokens, round(sum(l.cost),4) AS cost
  FROM l LEFT JOIN auth.users au ON au.id = l.user_id GROUP BY l.user_id, au.email
 )
 SELECT jsonb_build_object(
  'cost_total', COALESCE((SELECT round(sum(cost),4) FROM l),0),
  'cost_anthropic', COALESCE((SELECT round(sum(cost),4) FROM l WHERE provider='anthropic'),0),
  'cost_gemini', COALESCE((SELECT round(sum(cost),4) FROM l WHERE provider='gemini'),0),
  'unpriced_models', COALESCE((SELECT jsonb_agg(DISTINCT l.model) FROM l WHERE NOT EXISTS (SELECT 1 FROM public.api_model_prices p WHERE p.model=l.model)),'[]'::jsonb),
  'users', COALESCE((SELECT jsonb_agg(to_jsonb(u) ORDER BY u.cost DESC, u.calls DESC) FROM u),'[]'::jsonb)
 ) INTO result;
 RETURN result;
END $$;
REVOKE ALL ON FUNCTION public.api_usage_by_user(timestamptz, text, text, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.api_usage_by_user(timestamptz, text, text, text) TO authenticated;

CREATE OR REPLACE FUNCTION public.api_user_emails(user_ids uuid[])
RETURNS TABLE(user_id uuid, email text) LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
BEGIN
 IF NOT public.has_role(auth.uid(), 'admin') THEN RAISE EXCEPTION 'forbidden' USING ERRCODE = '42501'; END IF;
 RETURN QUERY SELECT au.id, au.email::text FROM auth.users au WHERE au.id = ANY(user_ids);
END $$;
REVOKE ALL ON FUNCTION public.api_user_emails(uuid[]) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.api_user_emails(uuid[]) TO authenticated;