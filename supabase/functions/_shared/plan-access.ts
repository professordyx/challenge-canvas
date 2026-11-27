import { createClient } from 'npm:@supabase/supabase-js@2';
import { requiredEnv, paymentEnvironment } from './paddle.ts';
export type UsageLease = { finish: (success: boolean) => Promise<void> };
export async function reserveUsage(userId: string, operation: string, environment: unknown, language: string): Promise<UsageLease | Response> {
  const admin = createClient(requiredEnv('SUPABASE_URL'), requiredEnv('SUPABASE_SERVICE_ROLE_KEY'));
  const env = paymentEnvironment(environment);
  const { data: ticket, error } = await admin.rpc('reserve_plan_usage', { p_user: userId, p_operation: operation, p_environment: env });
  if (error) {
    const upgrade = error.message.includes('PREMIUM_REQUIRED') || error.message.includes('MONTHLY_LIMIT');
    const messages = { pt: 'Este recurso exige Premium ou a franquia mensal já foi utilizada.', es: 'Esta función requiere Premium o ya se utilizó el límite mensual.', en: 'This feature requires Premium or your monthly allowance has been used.' };
    return new Response(JSON.stringify({ error: upgrade ? messages[language as keyof typeof messages] ?? messages.en : 'Could not check plan access', upgrade }), { status: upgrade ? 200 : 503, headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' } });
  }
  return { finish: async (success) => {
    const { error } = await admin.from('plan_usage').update({ state: success ? 'completed' : 'failed' }).eq('id', ticket);
    if (error) console.error('Could not finalize plan usage');
  } };
}
