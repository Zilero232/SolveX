import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import { authClient } from '@/shared/api';

export const signInSchema = z.object({
  email: z.email('validation.emailInvalid'),
  password: z.string().min(8, 'validation.passwordMin'),
});

export type SignInValues = z.infer<typeof signInSchema>;

export const useSignIn = () => {
  return useMutation({
    mutationFn: async (values: SignInValues) => {
      const { data, error } = await authClient.signIn.email(values);

      if (error) throw new Error(error.message ?? 'Sign in failed');

      return data;
    },
  });
};
