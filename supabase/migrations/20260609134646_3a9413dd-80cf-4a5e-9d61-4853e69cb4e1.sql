
-- 1. Storage policies for canvas-assets
DROP POLICY IF EXISTS "Authenticated users can upload canvas assets" ON storage.objects;
DROP POLICY IF EXISTS "Public read access for canvas assets" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their canvas assets" ON storage.objects;

CREATE POLICY "Users can upload to their own canvas folder"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'canvas-assets'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can update their own canvas files"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'canvas-assets'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete their own canvas files"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'canvas-assets'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- 2. Remove challenge_shares from realtime publication
ALTER PUBLICATION supabase_realtime DROP TABLE public.challenge_shares;

-- 3. Lock down SECURITY DEFINER function execution
REVOKE EXECUTE ON FUNCTION public.find_user_by_email(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.find_user_by_email(text) TO authenticated;
