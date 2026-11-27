DROP POLICY IF EXISTS billing_settings_read ON public.billing_settings;

REVOKE ALL ON public.billing_settings FROM anon;

CREATE POLICY billing_settings_admin_read
  ON public.billing_settings
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));