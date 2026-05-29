'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { useFieldError } from '@/entities/app/locale';
import { FormField, Input, Row, Stack, SubmitButton } from '@/shared/ui';
import { passwordSchema } from './RoomPasswordForm.styles';
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

  const fieldError = passwordError(errors.password) ?? error;

  return (
    <Row justify="center" align="center" className="h-full p-6">
      <Stack
        as="form"
        align="center"
        gap="4"
        className="glass w-full max-w-sm rounded-2xl p-8 shadow-glow-violet"
        onSubmit={submit}
      >
        <p className="text-center text-foreground/85 text-sm">
          {t('title', { name: displayName })}
        </p>

        <FormField htmlFor="room-password" label={t('label')} error={fieldError} className="w-full">
          <Input
            disabled={isSubmitting}
            id="room-password"
            type="password"
            {...register('password')}
          />
        </FormField>

        <SubmitButton className="w-full" isPending={isSubmitting}>
          {t('join')}
        </SubmitButton>
      </Stack>
    </Row>
  );
};
