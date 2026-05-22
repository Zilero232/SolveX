import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import { supabase } from '@/shared/api';

// Validation messages are i18n keys under the `auth` namespace, resolved by
// the form via useTranslations — a zod schema is built outside React and so
// can't translate them itself.
export const signUpSchema = z
  .object({
    name: z.string().trim().min(2, 'validation.nameMin').max(32, 'validation.nameMax'),
    email: z.email('validation.emailInvalid').trim().toLowerCase(),
    password: z.string().min(8, 'validation.passwordMin'),
    confirmPassword: z.string(),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: 'validation.passwordsMismatch',
    path: ['confirmPassword'],
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
