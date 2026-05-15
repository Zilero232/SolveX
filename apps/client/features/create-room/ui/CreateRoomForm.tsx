'use client';

import type { CreateRoomInput, CreateRoomRawInput } from '@solvex/schemas/rooms';

import { zodResolver } from '@hookform/resolvers/zod';
import { createRoomInputSchema } from '@solvex/schemas/rooms';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { useCreateRoom, useEnterRoom } from '@/entities/room';
import { Button, Input, Label } from '@/shared/ui';

import { createRoomFormStyles as s } from './CreateRoomForm.styles';

const DEFAULT_VALUES: CreateRoomRawInput = { name: '', isPrivate: false };

export const CreateRoomForm = () => {
  const createMutation = useCreateRoom();
  const enterMutation = useEnterRoom();

  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
    watch,
  } = useForm<CreateRoomRawInput, unknown, CreateRoomInput>({
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
        toast.success('Room created', { description: `"${room.name}"` });
        reset(DEFAULT_VALUES);
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
        <Label htmlFor="create-room-name">New room name</Label>
        <Input
          autoComplete="off"
          id="create-room-name"
          placeholder="team standup"
          {...register('name')}
        />
        {errors.name ? <p className={s.error}>{errors.name.message}</p> : null}
      </div>

      {isPrivate ? (
        <div className={s.field}>
          <Label htmlFor="create-room-password">Password</Label>
          <Input
            autoComplete="new-password"
            id="create-room-password"
            placeholder="Min 4 chars"
            type="password"
            {...register('password')}
          />
          {errors.password ? <p className={s.error}>{errors.password.message}</p> : null}
        </div>
      ) : null}

      <label className={s.checkboxRow}>
        <input className={s.checkbox} type="checkbox" {...register('isPrivate')} />
        <span>Private (password required to join)</span>
      </label>

      <Button disabled={isPending || !name?.trim()} type="submit" variant="secondary">
        {isPending ? <Loader2 className={s.spinner} /> : null}
        Create room
      </Button>
    </form>
  );
};
