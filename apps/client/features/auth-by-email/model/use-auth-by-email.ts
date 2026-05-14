import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';

import { supabase } from '@/shared/api';

export const authSchema = z.object({
  email: z.email('Invalid email'),
  password: z.string().min(6, 'Min 6 characters'),
});

export type AuthFormValues = z.infer<typeof authSchema>;
export type AuthMode = 'signin' | 'signup';

export const useAuthByEmail = () =>
  useMutation({
    mutationFn: async ({ mode, values }: { mode: AuthMode; values: AuthFormValues }) => {
      const { data, error } =
        mode === 'signin'
          ? await supabase.auth.signInWithPassword(values)
          : await supabase.auth.signUp(values);

      if (error) throw error;

      return data;
    },
  });
