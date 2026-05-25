'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useFieldError } from '@/entities/app/locale';
import { Button, Input, Label, PasswordInput } from '@/shared/ui';
import { type SignInValues, signInSchema, useSignIn } from '../model/use-sign-in';
import { signInFormStyles as s } from './SignInForm.styles';

const DEFAULT_VALUES: SignInValues = { email: '', password: '' };

export const SignInForm = () => {
  const t = useTranslations('auth');
  const fieldError = useFieldError('auth');
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
      onSuccess: () => toast.success(t('signedIn')),
      onError: (err: Error) => toast.error(err.message),
    });
  });

  return (
    <form className={s.form} onSubmit={onSubmit}>
      <div className={s.field}>
        <Label htmlFor="signin-email">{t('fields.email')}</Label>
        <Input autoComplete="email" id="signin-email" type="email" {...register('email')} />
        {errors.email && <p className={s.error}>{fieldError(errors.email)}</p>}
      </div>

      <div className={s.field}>
        <Label htmlFor="signin-password">{t('fields.password')}</Label>
        <PasswordInput
          autoComplete="current-password"
          id="signin-password"
          {...register('password')}
        />
        {errors.password && <p className={s.error}>{fieldError(errors.password)}</p>}
      </div>

      <Button className={s.submit} disabled={isPending} type="submit">
        {isPending && <Loader2 className={s.submitSpinner} />}
        {t('signIn')}
      </Button>
    </form>
  );
};
