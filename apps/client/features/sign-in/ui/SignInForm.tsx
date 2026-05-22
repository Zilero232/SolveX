'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button, Input, Label, PasswordInput } from '@/shared/ui';
import { type SignInValues, signInSchema, useSignIn } from '../model/use-sign-in';
import { signInFormStyles as s } from './SignInForm.styles';

const DEFAULT_VALUES: SignInValues = { email: '', password: '' };

export const SignInForm = () => {
  const { isPending, mutate } = useSignIn();

  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: DEFAULT_VALUES,
  });

  const onSubmit = handleSubmit((values) => {
    mutate(values, {
      onSuccess: () => toast.success('Signed in'),
      onError: (err: Error) => toast.error(err.message),
    });
  });

  return (
    <form className={s.form} onSubmit={onSubmit}>
      <div className={s.field}>
        <Label htmlFor="signin-email">Email</Label>
        <Input autoComplete="email" id="signin-email" type="email" {...register('email')} />
        {errors.email && <p className={s.error}>{errors.email.message}</p>}
      </div>

      <div className={s.field}>
        <Label htmlFor="signin-password">Password</Label>
        <PasswordInput
          autoComplete="current-password"
          id="signin-password"
          {...register('password')}
        />
        {errors.password && <p className={s.error}>{errors.password.message}</p>}
      </div>

      <Button className={s.submit} disabled={isPending} type="submit">
        {isPending && <Loader2 className={s.submitSpinner} />}
        Sign in
      </Button>
    </form>
  );
};
