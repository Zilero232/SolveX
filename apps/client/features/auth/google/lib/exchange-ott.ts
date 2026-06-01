import { authClient } from '@/shared/api';

export const exchangeOtt = async (ott: string): Promise<void> => {
  const { error } = await authClient.oneTimeToken.verify({ token: ott });

  if (error) throw new Error(error.message ?? 'Sign-in could not be completed');
};
