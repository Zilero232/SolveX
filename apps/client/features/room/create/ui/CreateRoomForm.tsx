'use client';

import { createRoomInputSchema } from '@chatovo/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useCreateRoom, useEnterRoom } from '@/entities/room/room';
import { FormField, Input, Row, Stack, SubmitButton } from '@/shared/ui';
import type { CreateRoomRequest } from '@chatovo/schemas';

const DEFAULT_VALUES: CreateRoomRequest = { name: '', isPrivate: false };

type CreateRoomFormProps = {
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
    <Stack as="form" gap="3" onSubmit={onSubmit}>
      <FormField htmlFor="create-room-name" label={t('nameLabel')} error={errors.name?.message}>
        <Input
          autoComplete="off"
          id="create-room-name"
          placeholder={t('namePlaceholder')}
          {...register('name')}
        />
      </FormField>

      {isPrivate && (
        <FormField
          htmlFor="create-room-password"
          label={t('passwordLabel')}
          error={errors.password?.message}
        >
          <Input
            autoComplete="new-password"
            id="create-room-password"
            placeholder={t('passwordPlaceholder')}
            type="password"
            {...register('password')}
          />
        </FormField>
      )}

      <Row as="label" gap="2">
        <input className="size-4 accent-primary" type="checkbox" {...register('isPrivate')} />
        <span>{t('privateLabel')}</span>
      </Row>

      <SubmitButton disabled={!name?.trim()} isPending={isPending} variant="secondary">
        {t('submit')}
      </SubmitButton>
    </Stack>
  );
};
