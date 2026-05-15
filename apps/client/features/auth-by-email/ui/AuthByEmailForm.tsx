'use client';

import type { z } from 'zod';

import { zodResolver } from '@hookform/resolvers/zod';
import { useBoolean } from '@siberiacancode/reactuse';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button, Input, Label } from '@/shared/ui';

import { authSchema, useAuthByEmail } from '../model/use-auth-by-email';
import { authByEmailFormStyles as s } from './AuthByEmailForm.styles';

type FormValues = z.infer<typeof authSchema>;

const DEFAULT_VALUES: FormValues = { email: '', password: '' };

export const AuthByEmailForm = () => {
  const mutation = useAuthByEmail();

  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<FormValues>({
    resolver: zodResolver(authSchema),
    defaultValues: DEFAULT_VALUES,
  });
  const [isSignup, toggleSignup] = useBoolean(false);

  const onSubmit = handleSubmit((values) => {
    mutation.mutate(
      { mode: isSignup ? 'signup' : 'signin', values },
      {
        onSuccess: () => {
          if (isSignup) {
            toast.success('Account created', { description: 'Check email if confirmation is on.' });
          }
        },
        onError: (err: Error) => toast.error(err.message),
      },
    );
  });

  return (
    <form className={s.form} onSubmit={onSubmit}>
      <div className={s.field}>
        <Label htmlFor="auth-email">Email</Label>
        <Input autoComplete="email" id="auth-email" type="email" {...register('email')} />
        {errors.email ? <p className={s.error}>{errors.email.message}</p> : null}
      </div>

      <div className={s.field}>
        <Label htmlFor="auth-password">Password</Label>
        <Input
          autoComplete="current-password"
          id="auth-password"
          type="password"
          {...register('password')}
        />
        {errors.password ? <p className={s.error}>{errors.password.message}</p> : null}
      </div>

      <Button className={s.submit} disabled={mutation.isPending} type="submit">
        {mutation.isPending ? <Loader2 className={s.submitSpinner} /> : null}
        {isSignup ? 'Sign up' : 'Sign in'}
      </Button>

      <button className={s.toggle} type="button" onClick={() => toggleSignup()}>
        {isSignup ? 'Have account? Sign in' : 'No account? Sign up'}
      </button>
    </form>
  );
};
