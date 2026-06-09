DROP POLICY IF EXISTS "Owners can create shares" ON public.challenge_shares;
CREATE POLICY "Owners can create shares" ON public.challenge_shares
FOR INSERT TO authenticated
WITH CHECK (
  auth.uid() = owner_id
  AND EXISTS (
    SELECT 1 FROM public.challenges
    WHERE challenges.id = challenge_shares.challenge_id
      AND challenges.user_id = auth.uid()
  )
);