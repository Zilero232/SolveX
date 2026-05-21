'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button, Input, Label } from '@/shared/ui';
import { type SignUpValues, signUpSchema, useSignUp } from '../model/use-sign-up';
import { signUpFormStyles as s } from './SignUpForm.styles';

const DEFAULT_VALUES: SignUpValues = { name: '', email: '', password: '' };

export const SignUpForm = () => {
  const { isPending, mutate } = useSignUp();

  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: DEFAULT_VALUES,
  });

  const onSubmit = handleSubmit((values) => {
    mutate(values, {
      onSuccess: () =>
        toast.success('Account created', { description: 'Check email if confirmation is on.' }),
      onError: (err: Error) => toast.error(err.message),
    });
  });

  return (
    <form className={s.form} onSubmit={onSubmit}>
      <div className={s.field}>
        <Label htmlFor="signup-name">Name</Label>
        <Input autoComplete="name" id="signup-name" type="text" {...register('name')} />
        {errors.name && <p className={s.error}>{errors.name.message}</p>}
      </div>

      <div className={s.field}>
        <Label htmlFor="signup-email">Email</Label>
        <Input autoComplete="email" id="signup-email" type="email" {...register('email')} />
        {errors.email && <p className={s.error}>{errors.email.message}</p>}
      </div>

      <div className={s.field}>
        <Label htmlFor="signup-password">Password</Label>
        <Input
          autoComplete="new-password"
          id="signup-password"
          type="password"
          {...register('password')}
        />
        {errors.password && <p className={s.error}>{errors.password.message}</p>}
      </div>

      <Button className={s.submit} disabled={isPending} type="submit">
        {isPending && <Loader2 className={s.submitSpinner} />}
        Sign up
      </Button>
    </form>
  );
};
