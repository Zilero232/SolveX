'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useFieldError } from '@/entities/locale';
import { Button, Input, Label, PasswordInput } from '@/shared/ui';
import { type SignUpValues, signUpSchema, useSignUp } from '../model/use-sign-up';
import { signUpFormStyles as s } from './SignUpForm.styles';

const DEFAULT_VALUES: SignUpValues = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
};

export const SignUpForm = () => {
  const t = useTranslations('auth');
  const fieldError = useFieldError('auth');
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
      onSuccess: () => toast.success(t('accountCreated')),
      onError: (err: Error) => toast.error(err.message),
    });
  });

  return (
    <form className={s.form} onSubmit={onSubmit}>
      <div className={s.field}>
        <Label htmlFor="signup-name">{t('fields.name')}</Label>
        <Input autoComplete="name" id="signup-name" type="text" {...register('name')} />
        {errors.name && <p className={s.error}>{fieldError(errors.name)}</p>}
      </div>

      <div className={s.field}>
        <Label htmlFor="signup-email">{t('fields.email')}</Label>
        <Input autoComplete="email" id="signup-email" type="email" {...register('email')} />
        {errors.email && <p className={s.error}>{fieldError(errors.email)}</p>}
      </div>

      <div className={s.field}>
        <Label htmlFor="signup-password">{t('fields.password')}</Label>
        <PasswordInput autoComplete="new-password" id="signup-password" {...register('password')} />
        {errors.password && <p className={s.error}>{fieldError(errors.password)}</p>}
      </div>

      <div className={s.field}>
        <Label htmlFor="signup-confirm-password">{t('fields.confirmPassword')}</Label>
        <PasswordInput
          autoComplete="new-password"
          id="signup-confirm-password"
          {...register('confirmPassword')}
        />
        {errors.confirmPassword && <p className={s.error}>{fieldError(errors.confirmPassword)}</p>}
      </div>

      <Button className={s.submit} disabled={isPending} type="submit">
        {isPending && <Loader2 className={s.submitSpinner} />}
        {t('signUp')}
      </Button>
    </form>
  );
};
