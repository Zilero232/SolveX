import { queryClient, supabase } from '@/shared/api';
import { QUERY_KEYS } from '@/shared/constants';

export const subscribeAuth = () => {
  const { data } = supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'INITIAL_SESSION') return;

    queryClient.setQueryData(QUERY_KEYS.session(), session);
  });

  return () => {
    data.subscription.unsubscribe();
  };
};
