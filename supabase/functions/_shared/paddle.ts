import { Environment, Paddle } from 'npm:@paddle/paddle-node-sdk';
export type PaddleEnv = 'sandbox' | 'live';
export function paymentEnvironment(value: unknown): PaddleEnv {
  if (value === undefined || value === null) return 'live';
  if (value !== 'sandbox' && value !== 'live') throw new Error('Invalid environment');
  return value;
}
export function requiredEnv(key: string): string {
  const value = Deno.env.get(key);
  if (!value) throw new Error('Payment configuration unavailable');
  return value;
}
function connectionKey(env: PaddleEnv) {
  return requiredEnv(env === 'sandbox' ? 'PADDLE_SANDBOX_API_KEY' : 'PADDLE_LIVE_API_KEY');
}
const GATEWAY = 'https://connector-gateway.lovable.dev/paddle';
export function getPaddleClient(env: PaddleEnv) {
  return new Paddle(connectionKey(env), {
    environment: GATEWAY as unknown as Environment,
    customHeaders: { 'X-Connection-Api-Key': connectionKey(env), 'Lovable-API-Key': requiredEnv('LOVABLE_API_KEY') },
  });
}
export function gatewayFetch(env: PaddleEnv, path: string) {
  return fetch(`${GATEWAY}${path}`, { headers: { 'X-Connection-Api-Key': connectionKey(env), 'Lovable-API-Key': requiredEnv('LOVABLE_API_KEY') } });
}
export async function verifyWebhook(req: Request, env: PaddleEnv) {
  const signature = req.headers.get('paddle-signature');
  if (!signature) throw new Error('Missing signature');
  const body = await req.text();
  if (body.length > 256 * 1024) throw new Error('Payload too large');
  const secret = requiredEnv(env === 'sandbox' ? 'PAYMENTS_SANDBOX_WEBHOOK_SECRET' : 'PAYMENTS_LIVE_WEBHOOK_SECRET');
  return await getPaddleClient(env).webhooks.unmarshal(body, secret, signature);
}
