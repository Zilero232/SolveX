import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import { supabase } from '@/shared/api';

// Validation messages are i18n keys under the `auth` namespace, resolved by
// the form via useTranslations — a zod schema is built outside React and so
// can't translate them itself.
export const signInSchema = z.object({
  email: z.email('validation.emailInvalid'),
  password: z.string().min(8, 'validation.passwordMin'),
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
