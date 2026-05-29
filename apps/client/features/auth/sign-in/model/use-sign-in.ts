import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import { supabase } from '@/shared/api';

export const signInSchema = z.object({
  email: z.email('validation.emailInvalid'),
  password: z.string().min(8, 'validation.passwordMin'),
});

export type SignInValues = z.infer<typeof signInSchema>;

export const useSignIn = () => {
  return useMutation({
    mutationFn: async (values: SignInValues) => {
      const { data, error } = await supabase.auth.signInWithPassword(values);

      if (error) throw error;

      return data;
    },
  });
};
