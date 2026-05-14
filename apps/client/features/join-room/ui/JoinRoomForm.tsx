'use client';

import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { useEnterRoom } from '@/entities/room';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';

import { joinRoomFormStyles as s } from './JoinRoomForm.styles';

export const JoinRoomForm = () => {
  const enter = useEnterRoom();

  const [room, setRoom] = useState('');

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    enter.mutate({ room }, { onError: (err: Error) => toast.error(err.message) });
  };

  return (
    <form className={s.form} onSubmit={onSubmit}>
      <div className={s.field}>
        <Label htmlFor="join-room-name">Room name</Label>
        <Input
          autoComplete="off"
          id="join-room-name"
          placeholder="my-room"
          value={room}
          onChange={(e) => setRoom(e.currentTarget.value)}
        />
      </div>
      <Button disabled={enter.isPending || !room.trim()} type="submit">
        {enter.isPending ? <Loader2 className={s.spinner} /> : null}
        Join room
      </Button>
    </form>
  );
};
