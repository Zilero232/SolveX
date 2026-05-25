'use client';

import { createRoomInputSchema } from '@chatovo/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useCreateRoom, useEnterRoom } from '@/entities/room/room';
import { Button, Input, Label } from '@/shared/ui';
import { createRoomFormStyles as s } from './CreateRoomForm.styles';
import type { CreateRoomRequest } from '@chatovo/schemas';

const DEFAULT_VALUES: CreateRoomRequest = { name: '', isPrivate: false };

type CreateRoomFormProps = {
  // Fired once the room is created — lets a host dialog close itself.
  onCreated?: () => void;
};

export const CreateRoomForm = ({ onCreated }: CreateRoomFormProps) => {
  const t = useTranslations('createRoom');
  const createMutation = useCreateRoom();
  const enterMutation = useEnterRoom();

  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
    watch,
  } = useForm<CreateRoomRequest>({
    resolver: zodResolver(createRoomInputSchema),
    mode: 'onChange',
    defaultValues: DEFAULT_VALUES,
  });

  const isPrivate = watch('isPrivate');
  const name = watch('name');
  const isPending = createMutation.isPending || enterMutation.isPending;

  const onSubmit = handleSubmit((values) => {
    createMutation.mutate(values, {
      onSuccess: (room) => {
        toast.success(t('created'), { description: `"${room.name}"` });
        reset(DEFAULT_VALUES);
        onCreated?.();
        enterMutation.mutate(
          { roomId: room.id, password: values.isPrivate ? values.password : undefined },
          { onError: (err: Error) => toast.error(err.message) },
        );
      },
      onError: (err: Error) => toast.error(err.message),
    });
  });

  return (
    <form className={s.form} onSubmit={onSubmit}>
      <div className={s.field}>
        <Label htmlFor="create-room-name">{t('nameLabel')}</Label>
        <Input
          autoComplete="off"
          id="create-room-name"
          placeholder={t('namePlaceholder')}
          {...register('name')}
        />
        {errors.name && <p className={s.error}>{errors.name.message}</p>}
      </div>

      {isPrivate && (
        <div className={s.field}>
          <Label htmlFor="create-room-password">{t('passwordLabel')}</Label>
          <Input
            autoComplete="new-password"
            id="create-room-password"
            placeholder={t('passwordPlaceholder')}
            type="password"
            {...register('password')}
          />
          {errors.password && <p className={s.error}>{errors.password.message}</p>}
        </div>
      )}

      <label className={s.checkboxRow}>
        <input className={s.checkbox} type="checkbox" {...register('isPrivate')} />
        <span>{t('privateLabel')}</span>
      </label>

      <Button disabled={isPending || !name?.trim()} type="submit" variant="secondary">
        {isPending && <Loader2 className={s.spinner} />}
        {t('submit')}
      </Button>
    </form>
  );
};
