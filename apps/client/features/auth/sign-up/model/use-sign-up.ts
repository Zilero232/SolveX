import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import { authClient } from '@/shared/api';

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

export const useSignUp = () => {
  return useMutation({
    mutationFn: async ({ email, password, name }: SignUpValues) => {
      const { data, error } = await authClient.signUp.email({ email, password, name });

      if (error) throw new Error(error.message ?? 'Sign up failed');

      return data;
    },
  });
};
