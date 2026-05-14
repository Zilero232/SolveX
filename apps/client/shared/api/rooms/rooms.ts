import type { CreateRoomInput, Room } from './rooms.schema';

import { api } from '../http';

export const listRooms = async (): Promise<Room[]> => {
  const res = await api.api.rooms.$get();

  if (!res.ok) throw new Error(`Failed to list rooms: ${res.status}`);

  return res.json();
};

export const createRoom = async (input: CreateRoomInput): Promise<Room> => {
  const res = await api.api.rooms.$post({ json: input });

  if (!res.ok) {
    const err = (await res.json().catch(() => null)) as { error?: string } | null;

    throw new Error(err?.error ?? `Failed to create room: ${res.status}`);
  }

  return res.json();
};

export const deleteRoom = async (id: string): Promise<void> => {
  const res = await api.api.rooms[':id'].$delete({ param: { id } });

  if (!res.ok) {
    const err = (await res.json().catch(() => null)) as { error?: string } | null;

    throw new Error(err?.error ?? `Failed to delete room: ${res.status}`);
  }
};
