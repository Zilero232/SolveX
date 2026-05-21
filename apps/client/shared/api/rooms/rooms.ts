import { api } from '../http';
import type { CreateRoomRequest, Room } from '@chatovo/schemas/rooms';

export const listRooms = async (): Promise<Room[]> => {
  const res = await api.rooms.$get();

  if (!res.ok) throw new Error(`Failed to list rooms: ${res.status}`);

  return res.json();
};

export const createRoom = async (input: CreateRoomRequest): Promise<Room> => {
  const res = await api.rooms.$post({ json: input });

  if (!res.ok) {
    const err = (await res.json().catch(() => null)) as { error?: string } | null;

    throw new Error(err?.error ?? `Failed to create room: ${res.status}`);
  }

  return res.json();
};

export const getRoom = async (id: string): Promise<Room> => {
  const res = await api.rooms[':id'].$get({ param: { id } });

  if (!res.ok) {
    const err = (await res.json().catch(() => null)) as { error?: string } | null;

    throw new Error(err?.error ?? `Failed to get room: ${res.status}`);
  }

  return res.json();
};

export const deleteRoom = async (id: string): Promise<void> => {
  const res = await api.rooms[':id'].$delete({ param: { id } });

  if (!res.ok) {
    const err = (await res.json().catch(() => null)) as { error?: string } | null;

    throw new Error(err?.error ?? `Failed to delete room: ${res.status}`);
  }
};
