
-- Create storage bucket for canvas assets
INSERT INTO storage.buckets (id, name, public) VALUES ('canvas-assets', 'canvas-assets', true);

-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload canvas assets"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'canvas-assets');

-- Public read access
CREATE POLICY "Public read access for canvas assets"
ON storage.objects FOR SELECT
USING (bucket_id = 'canvas-assets');

-- Users can update their own uploads
CREATE POLICY "Users can update their canvas assets"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'canvas-assets');
