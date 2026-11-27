import { createClient } from 'npm:@supabase/supabase-js@2';
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { gatewayFetch, getPaddleClient, paymentEnvironment, requiredEnv } from '../_shared/paddle.ts';
const json = (value: object, status = 200) => new Response(JSON.stringify(value), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);
  try {
    const token = req.headers.get('authorization')?.replace(/^Bearer /, '');
    if (!token) return json({ error: 'Unauthorized' }, 401);
    const auth = createClient(requiredEnv('SUPABASE_URL'), requiredEnv('SUPABASE_ANON_KEY'));
    const { data: { user }, error: authError } = await auth.auth.getUser(token);
    if (authError || !user) return json({ error: 'Unauthorized' }, 401);
    const raw = await req.text();
    if (raw.length > 2048) return json({ error: 'Payload too large' }, 413);
    const body = JSON.parse(raw);
    const env = paymentEnvironment(body.environment);
    const admin = createClient(requiredEnv('SUPABASE_URL'), requiredEnv('SUPABASE_SERVICE_ROLE_KEY'));
    if (body.action === 'price') {
      const { data: settings, error: settingsError } = await admin.from('billing_settings').select('enabled').eq('environment', env).single();
      if (settingsError || !settings?.enabled) return json({ error: 'Payments are not available yet' }, 409);
      const { data: subs, error: subsError } = await admin.from('subscriptions').select('status,current_period_end').eq('user_id',user.id).eq('environment',env);
      if (subsError) throw subsError;
      if (subs?.some((s) => ['active','trialing','past_due'].includes(s.status) || (s.status==='canceled' && s.current_period_end && Date.parse(s.current_period_end)>Date.now()))) return json({ error: 'You already have a subscription' }, 409);
      const response = await gatewayFetch(env, '/prices?external_id=challenge_canvas_premium_monthly');
      if (!response.ok) throw new Error('Price unavailable');
      const result = await response.json();
      const price = result.data?.find((p: any) => p.status === 'active');
      if (!price || price.unit_price?.amount !== '500' || price.unit_price?.currency_code !== 'USD' || price.billing_cycle?.interval !== 'month' || price.billing_cycle?.frequency !== 1) throw new Error('Invalid subscription price');
      return json({ paddleId: price.id });
    }
    if (body.action === 'portal') {
      const { data: subscription, error } = await admin.from('subscriptions').select('paddle_customer_id,paddle_subscription_id').eq('user_id',user.id).eq('environment',env).order('created_at',{ascending:false}).limit(1).maybeSingle();
      if (error || !subscription) return json({ error: 'Subscription not found' }, 404);
      const portal = await getPaddleClient(env).customerPortalSessions.create(subscription.paddle_customer_id, [subscription.paddle_subscription_id]);
      return json({ url: portal.urls.general.overview });
    }
    return json({ error: 'Invalid action' }, 400);
  } catch {
    return json({ error: 'Could not complete your payment request. Please try again.' }, 500);
  }
});
