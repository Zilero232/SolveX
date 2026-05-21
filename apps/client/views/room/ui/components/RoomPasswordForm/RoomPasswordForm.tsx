'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
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
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<PasswordValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { password: '' },
  });

  const submit = handleSubmit(({ password }) => onSubmit(password));

  const fieldError = errors.password?.message ?? error;

  return (
    <div className={s.root}>
      <form className={s.box} onSubmit={submit}>
        <p className={s.text}>Enter password for "{displayName}"</p>
        <div className={s.field}>
          <Label htmlFor="room-password">Password</Label>
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
          Join
        </Button>
      </form>
    </div>
  );
};
