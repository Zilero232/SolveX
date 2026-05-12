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
  const [room, setRoom] = useState('');
  const enter = useEnterRoom();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    enter.mutate({ room }, { onError: (err: Error) => toast.error(err.message) });
  };

  return (
    <form onSubmit={onSubmit} className={s.form}>
      <div className={s.field}>
        <Label htmlFor="join-room-name">Room name</Label>
        <Input
          id="join-room-name"
          placeholder="my-room"
          autoComplete="off"
          value={room}
          onChange={(e) => setRoom(e.currentTarget.value)}
        />
      </div>
      <Button type="submit" disabled={enter.isPending || !room.trim()}>
        {enter.isPending ? <Loader2 className={s.spinner} /> : null}
        Join room
      </Button>
    </form>
  );
};
