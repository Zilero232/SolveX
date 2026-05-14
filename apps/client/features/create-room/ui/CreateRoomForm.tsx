'use client';

import { useBoolean } from '@siberiacancode/reactuse';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { useCreateRoom, useEnterRoom } from '@/entities/room';
import { createRoomInputSchema } from '@/shared/api';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';

import { createRoomFormStyles as s } from './CreateRoomForm.styles';

export const CreateRoomForm = () => {
  const createMutation = useCreateRoom();
  const enterMutation = useEnterRoom();

  const [name, setName] = useState('');
  const [nameError, setNameError] = useState<string | null>(null);
  const [isPrivate, togglePrivate] = useBoolean(false);

  const isPending = createMutation.isPending || enterMutation.isPending;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const parsed = createRoomInputSchema.safeParse({ name, isPrivate });

    if (!parsed.success) {
      setNameError(parsed.error.issues[0]?.message ?? 'Invalid name');

      return;
    }

    setNameError(null);

    createMutation.mutate(parsed.data, {
      onSuccess: (room) => {
        toast.success('Room created', { description: `"${room.name}"` });
        setName('');
        togglePrivate(false);
        enterMutation.mutate(
          { room: room.name },
          { onError: (err: Error) => toast.error(err.message) },
        );
      },
      onError: (err: Error) => toast.error(err.message),
    });
  };

  return (
    <form className={s.form} onSubmit={onSubmit}>
      <div className={s.field}>
        <Label htmlFor="create-room-name">New room name</Label>
        <Input
          autoComplete="off"
          id="create-room-name"
          placeholder="team-standup"
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
        />
        {nameError ? <p className={s.error}>{nameError}</p> : null}
      </div>

      <label className={s.checkboxRow}>
        <input
          checked={isPrivate}
          className={s.checkbox}
          type="checkbox"
          onChange={(e) => togglePrivate(e.currentTarget.checked)}
        />
        <span>Private (only you can see)</span>
      </label>

      <Button disabled={isPending || !name.trim()} type="submit" variant="secondary">
        {isPending ? <Loader2 className={s.spinner} /> : null}
        Create room
      </Button>
    </form>
  );
};
