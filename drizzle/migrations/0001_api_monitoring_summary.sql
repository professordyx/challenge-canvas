CREATE OR REPLACE FUNCTION public.api_monitoring_summary(since_at timestamptz, provider_filter text DEFAULT NULL, operation_filter text DEFAULT NULL, status_filter text DEFAULT NULL)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE result jsonb;
BEGIN
 IF NOT public.has_role(auth.uid(), 'admin') THEN RAISE EXCEPTION 'Forbidden' USING ERRCODE = '42501'; END IF;
 IF since_at IS NULL OR provider_filter IS NOT NULL AND provider_filter NOT IN ('anthropic','gemini') OR operation_filter IS NOT NULL AND operation_filter NOT IN ('improve-section','evaluate-canvas','generate-infographic') OR status_filter IS NOT NULL AND status_filter NOT IN ('success','error') THEN RAISE EXCEPTION 'Invalid filters'; END IF;
 WITH filtered AS (
 SELECT * FROM public.api_usage_logs WHERE created_at >= since_at
 AND (provider_filter IS NULL OR provider = provider_filter)
 AND (operation_filter IS NULL OR operation = operation_filter)
 AND (status_filter IS NULL OR success = (status_filter = 'success'))
 ), daily AS (
 SELECT to_char(created_at AT TIME ZONE 'UTC','YYYY-MM-DD') AS day, count(*) AS requests, count(*) FILTER (WHERE NOT success) AS errors FROM filtered GROUP BY 1 ORDER BY 1
 )
 SELECT jsonb_build_object('total',count(*),'errors',count(*) FILTER (WHERE NOT success),'avg_ms',coalesce(round(avg(duration_ms)),0),'input_tokens',coalesce(sum(input_tokens),0),'output_tokens',coalesce(sum(output_tokens),0),'token_reports',count(*) FILTER (WHERE input_tokens IS NOT NULL OR output_tokens IS NOT NULL),'daily',coalesce((SELECT jsonb_agg(daily) FROM daily),'[]'::jsonb)) INTO result FROM filtered;
 RETURN result;
END $$;
REVOKE ALL ON FUNCTION public.api_monitoring_summary(timestamptz,text,text,text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.api_monitoring_summary(timestamptz,text,text,text) TO authenticated;