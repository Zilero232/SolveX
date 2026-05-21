import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import { supabase } from '@/shared/api';

export const signUpSchema = z.object({
  name: z.string().trim().min(2, 'Min 2 characters').max(32, 'Max 32 characters'),
  email: z.email('Invalid email'),
  password: z.string().min(6, 'Min 6 characters'),
});

export type SignUpValues = z.infer<typeof signUpSchema>;

export const useSignUp = () =>
  useMutation({
    mutationFn: async ({ email, password, name }: SignUpValues) => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        // Stored in user_metadata; the server reads it when issuing LiveKit tokens.
        options: { data: { display_name: name } },
      });

      if (error) throw error;

      return data;
    },
  });
