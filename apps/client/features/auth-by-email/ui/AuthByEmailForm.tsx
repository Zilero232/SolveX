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
  const mutation = useAuthByEmail();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isSignup, toggleSignup] = useBoolean(false);

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
    <form className={s.form} onSubmit={onSubmit}>
      <div className={s.field}>
        <Label htmlFor="auth-email">Email</Label>
        <Input
          autoComplete="email"
          id="auth-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.currentTarget.value)}
        />
        {errors.email ? <p className={s.error}>{errors.email}</p> : null}
      </div>

      <div className={s.field}>
        <Label htmlFor="auth-password">Password</Label>
        <Input
          autoComplete="current-password"
          id="auth-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.currentTarget.value)}
        />
        {errors.password ? <p className={s.error}>{errors.password}</p> : null}
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
