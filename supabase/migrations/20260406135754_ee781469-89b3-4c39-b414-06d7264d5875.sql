
-- Create challenge_shares table
CREATE TABLE public.challenge_shares (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  challenge_id UUID NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL,
  shared_with_id UUID NOT NULL,
  permission TEXT NOT NULL DEFAULT 'viewer' CHECK (permission IN ('viewer', 'editor')),
  shared_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (challenge_id, shared_with_id)
);

-- Enable RLS
ALTER TABLE public.challenge_shares ENABLE ROW LEVEL SECURITY;

-- Owner can see all shares for their challenges
CREATE POLICY "Owners can view shares" ON public.challenge_shares
  FOR SELECT USING (auth.uid() = owner_id);

-- Shared users can see their own share records
CREATE POLICY "Shared users can view their shares" ON public.challenge_shares
  FOR SELECT USING (auth.uid() = shared_with_id);

-- Owner can create shares
CREATE POLICY "Owners can create shares" ON public.challenge_shares
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

-- Owner can update shares (change permission)
CREATE POLICY "Owners can update shares" ON public.challenge_shares
  FOR UPDATE USING (auth.uid() = owner_id);

-- Owner can delete shares (revoke)
CREATE POLICY "Owners can delete shares" ON public.challenge_shares
  FOR DELETE USING (auth.uid() = owner_id);

-- Allow shared users to view the challenge itself
CREATE POLICY "Shared users can view shared challenges" ON public.challenges
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.challenge_shares
      WHERE challenge_shares.challenge_id = challenges.id
        AND challenge_shares.shared_with_id = auth.uid()
    )
  );

-- Allow editors to update shared challenges
CREATE POLICY "Editors can update shared challenges" ON public.challenges
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.challenge_shares
      WHERE challenge_shares.challenge_id = challenges.id
        AND challenge_shares.shared_with_id = auth.uid()
        AND challenge_shares.permission = 'editor'
    )
  );

-- Function to find user by email for sharing
CREATE OR REPLACE FUNCTION public.find_user_by_email(lookup_email TEXT)
RETURNS TABLE(user_id UUID, display_name TEXT, avatar_url TEXT)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT p.user_id, p.display_name, p.avatar_url
  FROM public.profiles p
  JOIN auth.users u ON u.id = p.user_id
  WHERE u.email = lookup_email
  LIMIT 1;
$$;

-- Enable realtime for shares
ALTER PUBLICATION supabase_realtime ADD TABLE public.challenge_shares;
