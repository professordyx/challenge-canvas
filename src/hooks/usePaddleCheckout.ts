import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { getPaddleEnvironment, initializePaddle } from '@/lib/paddle';
export function usePaddleCheckout() {
 const { user } = useAuth();
 const [loading, setLoading] = useState(false);
 const openCheckout = async () => {
  if (!user || loading) return;
  setLoading(true);
  try {
   const { data, error } = await supabase.functions.invoke('payment-account', { body: { action: 'price', environment: getPaddleEnvironment() } });
   if (error || !data?.paddleId) throw new Error('Checkout unavailable');
   const paddle = await initializePaddle();
   paddle.Checkout.open({ items: [{ priceId: data.paddleId, quantity: 1 }], customer: user.email ? { email: user.email } : undefined, customData: { userId: user.id }, settings: { displayMode: 'overlay', successUrl: `${window.location.origin}/subscription?checkout=success`, allowLogout: false, variant: 'one-page' } });
  } finally { setLoading(false); }
 };
 const openPortal = async () => {
  if (!user || loading) return;
  const tab = window.open('about:blank', '_blank');
  if (tab) tab.opener = null;
  setLoading(true);
  try {
   const { data, error } = await supabase.functions.invoke('payment-account', { body: { action: 'portal', environment: getPaddleEnvironment() } });
   if (error || !data?.url || new URL(data.url).protocol !== 'https:') throw new Error('Portal unavailable');
   if (tab) tab.location.href = data.url; else window.location.assign(data.url);
  } catch (error) { tab?.close(); throw error; }
  finally { setLoading(false); }
 };
 return { loading, openCheckout, openPortal };
}
