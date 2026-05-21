import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import { supabase } from '@/shared/api';

export const signInSchema = z.object({
  email: z.email('Invalid email'),
  password: z.string().min(6, 'Min 6 characters'),
});

export type SignInValues = z.infer<typeof signInSchema>;

export const useSignIn = () =>
  useMutation({
    mutationFn: async (values: SignInValues) => {
      const { data, error } = await supabase.auth.signInWithPassword(values);

      if (error) throw error;

      return data;
    },
  });
