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

interface FieldErrors {
  name?: string;
  password?: string;
}

export const CreateRoomForm = () => {
  const createMutation = useCreateRoom();
  const enterMutation = useEnterRoom();

  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isPrivate, togglePrivate] = useBoolean(false);

  const isPending = createMutation.isPending || enterMutation.isPending;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const parsed = createRoomInputSchema.safeParse({
      name,
      isPrivate,
      password: isPrivate ? password : undefined,
    });

    if (!parsed.success) {
      const next: FieldErrors = {};

      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof FieldErrors;

        next[key] = issue.message;
      }

      setErrors(next);

      return;
    }

    setErrors({});

    createMutation.mutate(parsed.data, {
      onSuccess: (room) => {
        toast.success('Room created', { description: `"${room.name}"` });
        setName('');
        setPassword('');
        togglePrivate(false);
        enterMutation.mutate(
          { roomId: room.id, password: isPrivate ? password : undefined },
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
          placeholder="team standup"
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
        />
        {errors.name ? <p className={s.error}>{errors.name}</p> : null}
      </div>

      <label className={s.checkboxRow}>
        <input
          checked={isPrivate}
          className={s.checkbox}
          type="checkbox"
          onChange={(e) => togglePrivate(e.currentTarget.checked)}
        />
        <span>Private (password required to join)</span>
      </label>

      {isPrivate ? (
        <div className={s.field}>
          <Label htmlFor="create-room-password">Password</Label>
          <Input
            autoComplete="new-password"
            id="create-room-password"
            placeholder="Min 4 chars"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
          />
          {errors.password ? <p className={s.error}>{errors.password}</p> : null}
        </div>
      ) : null}

      <Button disabled={isPending || !name.trim()} type="submit" variant="secondary">
        {isPending ? <Loader2 className={s.spinner} /> : null}
        Create room
      </Button>
    </form>
  );
};
