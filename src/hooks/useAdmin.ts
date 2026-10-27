import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export function useAdmin() {
  const { user } = useAuth();
  const query = useQuery({
    queryKey: ['admin-access', user?.id], enabled: Boolean(user),
    queryFn: async () => {
      if (!user) return false;
      const { data, error } = await supabase.rpc('has_role', { _user_id: user.id, _role: 'admin' });
      if (error) throw error;
      return data === true;
    },
    staleTime: 60_000,
  });
  return { isAdmin: Boolean(user) && query.data === true, loading: Boolean(user) && query.isPending, error: query.error, retry: query.refetch };
}