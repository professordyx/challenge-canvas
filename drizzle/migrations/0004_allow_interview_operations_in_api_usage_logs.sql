ALTER TABLE public.api_usage_logs
DROP CONSTRAINT IF EXISTS api_usage_logs_operation_check;

ALTER TABLE public.api_usage_logs
ADD CONSTRAINT api_usage_logs_operation_check
CHECK (operation IN ('improve-section', 'evaluate-canvas', 'generate-infographic', 'transcribe-interview', 'fill-canvas'));