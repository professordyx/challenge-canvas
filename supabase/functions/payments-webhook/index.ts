import { createClient } from 'npm:@supabase/supabase-js@2';
import { verifyWebhook, paymentEnvironment, requiredEnv } from '../_shared/paddle.ts';

Deno.serve(async (req) => {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });
  let event;
  let env;
  try {
    env = paymentEnvironment(new URL(req.url).searchParams.get('env'));
    event = await verifyWebhook(req, env);
  } catch {
    return new Response('Invalid webhook signature', { status: 400 });
  }
  try {
    if (!['subscription.created', 'subscription.updated', 'subscription.canceled'].includes(event.eventType)) {
      return Response.json({ received: true });
    }
    const data = event.data as any;
    const admin = createClient(requiredEnv('SUPABASE_URL'), requiredEnv('SUPABASE_SERVICE_ROLE_KEY'));
    const { data: existing, error: readError } = await admin.from('subscriptions')
      .select('user_id,product_id,price_id,current_period_end').eq('paddle_subscription_id', data.id).eq('environment', env).maybeSingle();
    if (readError) throw readError;
    const userId = existing?.user_id ?? data.customData?.userId;
    if (typeof userId !== 'string' || !/^[0-9a-f-]{36}$/i.test(userId)) throw new Error('Missing account');
    const item = data.items?.find((i: any) => i.price?.importMeta?.externalId === 'challenge_canvas_premium_monthly');
    const productId = item?.product?.importMeta?.externalId ?? existing?.product_id;
    const priceId = item?.price?.importMeta?.externalId ?? existing?.price_id;
    if (productId !== 'challenge_canvas_premium' || priceId !== 'challenge_canvas_premium_monthly') throw new Error('Unknown catalog item');
    const { error } = await admin.rpc('apply_subscription_event', {
      p_event_id: event.eventId, p_environment: env, p_occurred_at: event.occurredAt,
      p_subscription: {
        user_id: userId, paddle_subscription_id: data.id, paddle_customer_id: data.customerId,
        product_id: productId, price_id: priceId, status: data.status,
        current_period_start: data.currentBillingPeriod?.startsAt ?? null,
        current_period_end: data.currentBillingPeriod?.endsAt ?? existing?.current_period_end ?? null,
        cancel_at_period_end: data.scheduledChange?.action === 'cancel',
      },
    });
    if (error) throw error;
    return Response.json({ received: true });
  } catch {
    console.error('Payment event could not be applied');
    return new Response('Payment event processing failed', { status: 500 });
  }
});
