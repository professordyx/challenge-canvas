CREATE TABLE public.support_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL DEFAULT '',
  summary text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_support_conversations_user_updated
  ON public.support_conversations (user_id, updated_at DESC);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.support_conversations TO authenticated;
GRANT ALL ON public.support_conversations TO service_role;

ALTER TABLE public.support_conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own support conversations"
  ON public.support_conversations FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users create own support conversations"
  ON public.support_conversations FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own support conversations"
  ON public.support_conversations FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users delete own support conversations"
  ON public.support_conversations FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins read all support conversations"
  ON public.support_conversations FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE TRIGGER update_support_conversations_updated_at
  BEFORE UPDATE ON public.support_conversations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.support_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES public.support_conversations(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('user', 'assistant')),
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_support_messages_conv_created
  ON public.support_messages (conversation_id, created_at ASC);

GRANT SELECT, INSERT ON public.support_messages TO authenticated;
GRANT ALL ON public.support_messages TO service_role;

ALTER TABLE public.support_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own support messages"
  ON public.support_messages FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.support_conversations c
      WHERE c.id = support_messages.conversation_id
        AND c.user_id = auth.uid()
    )
  );

CREATE POLICY "Users insert own support messages"
  ON public.support_messages FOR INSERT TO authenticated
  WITH CHECK (
    role = 'user'
    AND EXISTS (
      SELECT 1 FROM public.support_conversations c
      WHERE c.id = support_messages.conversation_id
        AND c.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins read all support messages"
  ON public.support_messages FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE TABLE public.support_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_number integer GENERATED ALWAYS AS IDENTITY,
  user_id uuid NOT NULL,
  conversation_id uuid NOT NULL REFERENCES public.support_conversations(id) ON DELETE CASCADE,
  subject text NOT NULL,
  summary text NOT NULL,
  transcript_excerpt text NOT NULL,
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_support_requests_conv_created
  ON public.support_requests (conversation_id, created_at DESC);

CREATE INDEX idx_support_requests_status_created
  ON public.support_requests (status, created_at DESC);

GRANT SELECT ON public.support_requests TO authenticated;
GRANT UPDATE (status, updated_at) ON public.support_requests TO authenticated;
GRANT ALL ON public.support_requests TO service_role;

ALTER TABLE public.support_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own support requests"
  ON public.support_requests FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins read all support requests"
  ON public.support_requests FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins update support requests"
  ON public.support_requests FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE TRIGGER update_support_requests_updated_at
  BEFORE UPDATE ON public.support_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

ALTER PUBLICATION supabase_realtime ADD TABLE public.support_messages;

ALTER TABLE public.api_usage_logs
  DROP CONSTRAINT IF EXISTS api_usage_logs_operation_check;

ALTER TABLE public.api_usage_logs
  ADD CONSTRAINT api_usage_logs_operation_check
  CHECK (operation = ANY (ARRAY[
    'improve-section'::text,
    'evaluate-canvas'::text,
    'generate-infographic'::text,
    'transcribe-interview'::text,
    'fill-canvas'::text,
    'support-chat'::text
  ]));

CREATE OR REPLACE FUNCTION public.api_monitoring_summary(
  since_at timestamp with time zone,
  provider_filter text DEFAULT NULL::text,
  operation_filter text DEFAULT NULL::text,
  status_filter text DEFAULT NULL::text
)
RETURNS jsonb
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE result jsonb;
BEGIN
 IF NOT public.has_role(auth.uid(), 'admin') THEN RAISE EXCEPTION 'Forbidden' USING ERRCODE = '42501'; END IF;
 IF since_at IS NULL
   OR (provider_filter IS NOT NULL AND provider_filter NOT IN ('anthropic','gemini'))
   OR (operation_filter IS NOT NULL AND operation_filter NOT IN ('improve-section','evaluate-canvas','generate-infographic','transcribe-interview','fill-canvas','support-chat'))
   OR (status_filter IS NOT NULL AND status_filter NOT IN ('success','error'))
 THEN RAISE EXCEPTION 'Invalid filters'; END IF;
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
END $function$;