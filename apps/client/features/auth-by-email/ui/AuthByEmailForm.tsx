'use client';

import { useBoolean } from '@siberiacancode/reactuse';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';

import { authSchema, useAuthByEmail } from '../model/use-auth-by-email';
import { authByEmailFormStyles as s } from './AuthByEmailForm.styles';

export const AuthByEmailForm = () => {
  const [isSignup, toggleSignup] = useBoolean(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const mutation = useAuthByEmail();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const parsed = authSchema.safeParse({ email, password });

    if (!parsed.success) {
      const fieldErrors: { email?: string; password?: string } = {};

      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as 'email' | 'password';
        fieldErrors[key] = issue.message;
      }

      setErrors(fieldErrors);

      return;
    }

    setErrors({});

    mutation.mutate(
      { mode: isSignup ? 'signup' : 'signin', values: parsed.data },
      {
        onSuccess: () => {
          if (isSignup) {
            toast.success('Account created', { description: 'Check email if confirmation is on.' });
          }
        },
        onError: (err: Error) => toast.error(err.message),
      },
    );
  };

  return (
    <form onSubmit={onSubmit} className={s.form}>
      <div className={s.field}>
        <Label htmlFor="auth-email">Email</Label>
        <Input
          id="auth-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.currentTarget.value)}
        />
        {errors.email ? <p className={s.error}>{errors.email}</p> : null}
      </div>

      <div className={s.field}>
        <Label htmlFor="auth-password">Password</Label>
        <Input
          id="auth-password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.currentTarget.value)}
        />
        {errors.password ? <p className={s.error}>{errors.password}</p> : null}
      </div>

      <Button type="submit" disabled={mutation.isPending} className={s.submit}>
        {mutation.isPending ? <Loader2 className={s.submitSpinner} /> : null}
        {isSignup ? 'Sign up' : 'Sign in'}
      </Button>

      <button type="button" onClick={() => toggleSignup()} className={s.toggle}>
        {isSignup ? 'Have account? Sign in' : 'No account? Sign up'}
      </button>
    </form>
  );
};
