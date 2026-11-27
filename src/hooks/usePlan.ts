import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { getPaddleEnvironment } from '@/lib/paddle';
import { PLAN_RULES } from '@/lib/plans';
export interface PlanState {
 premium: boolean; enabled: boolean; usage: { canvases: number; evaluations: number; infographics: number }; resets_at: string;
 subscription: { status: string; current_period_end: string | null; cancel_at_period_end: boolean } | null;
}
export function usePlan() {
 const { user } = useAuth();
 const environment = getPaddleEnvironment();
 const query = useQuery({ queryKey: ['plan', user?.id, environment], enabled: !!user, queryFn: async () => {
   const { data, error } = await supabase.rpc('get_plan_usage', { p_environment: environment });
   if (error) throw error;
   return data as unknown as PlanState;
 }, staleTime: 10000, refetchOnWindowFocus: true });
 const allowed = (feature: keyof typeof PLAN_RULES.free) => {
   if (!query.data) return false;
   if (!query.data.enabled || query.data.premium) return true;
   if (feature === 'recording' || feature === 'assistant') return false;
   return query.data.usage[feature] < PLAN_RULES.free[feature];
 };
 return { ...query, environment, allowed };
}
