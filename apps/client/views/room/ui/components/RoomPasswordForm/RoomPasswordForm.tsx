'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { useFieldError } from '@/entities/locale';
import { Button, Input, Label } from '@/shared/ui';
import { passwordSchema, roomPasswordFormStyles as s } from './RoomPasswordForm.styles';
import type { z } from 'zod';
import type { RoomPasswordFormProps } from './RoomPasswordForm.types';

type PasswordValues = z.infer<typeof passwordSchema>;

export const RoomPasswordForm = ({
  displayName,
  error,
  isSubmitting,
  onSubmit,
}: RoomPasswordFormProps) => {
  const t = useTranslations('room.password');
  const passwordError = useFieldError('room.password');

  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<PasswordValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { password: '' },
  });

  const submit = handleSubmit(({ password }) => onSubmit(password));

  // The validation error is an i18n key; the server `error` is already text.
  const fieldError = passwordError(errors.password) ?? error;

  return (
    <div className={s.root}>
      <form className={s.box} onSubmit={submit}>
        <p className={s.text}>{t('title', { name: displayName })}</p>
        <div className={s.field}>
          <Label htmlFor="room-password">{t('label')}</Label>
          <Input
            disabled={isSubmitting}
            id="room-password"
            type="password"
            {...register('password')}
          />
          {fieldError && <p className={s.error}>{fieldError}</p>}
        </div>
        <Button disabled={isSubmitting} type="submit">
          {isSubmitting && <Loader2 className={s.spinner} />}
          {t('join')}
        </Button>
      </form>
    </div>
  );
};
