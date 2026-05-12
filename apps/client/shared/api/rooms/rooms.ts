import { supabase } from '../supabase';
import type { CreateRoomInput, Room } from './rooms.schema';

const TABLE = 'rooms';

export const listRooms = async (): Promise<Room[]> => {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);

  return (data ?? []) as Room[];
};

export const createRoom = async (input: CreateRoomInput, userId: string): Promise<Room> => {
  const { data, error } = await supabase
    .from(TABLE)
    .insert({ name: input.name, is_private: input.isPrivate, created_by: userId })
    .select()
    .single();

  if (error) throw new Error(error.message);

  return data as Room;
};

export const deleteRoom = async (id: string): Promise<void> => {
  const { error } = await supabase.from(TABLE).delete().eq('id', id);

  if (error) throw new Error(error.message);
};
