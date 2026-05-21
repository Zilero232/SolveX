import { RoomServiceClient } from 'livekit-server-sdk';
import { env } from '../../lib/env';
import type { RoomParticipant, RoomsParticipantsSnapshot } from '@chatovo/schemas/livekit';

/**
 * In-memory presence store for LiveKit rooms.
 *
 * LiveKit webhooks keep this up to date in real time; SSE subscribers receive
 * a fresh snapshot on every change. The store lives only in this process —
 * acceptable for a single-instance server. Scaling horizontally would require
 * moving this to Redis pub/sub.
 */

type Listener = (snapshot: RoomsParticipantsSnapshot) => void;

// roomId -> (identity -> participant). Map keeps identities unique per room.
const rooms = new Map<string, Map<string, RoomParticipant>>();
const listeners = new Set<Listener>();

const roomService = new RoomServiceClient(
  env.LIVEKIT_URL,
  env.LIVEKIT_API_KEY,
  env.LIVEKIT_API_SECRET,
);

const buildSnapshot = (): RoomsParticipantsSnapshot => {
  const result: RoomsParticipantsSnapshot['rooms'] = {};

  for (const [roomId, participants] of rooms) {
    if (participants.size > 0) result[roomId] = [...participants.values()];
  }

  return { rooms: result };
};

const emit = () => {
  const snapshot = buildSnapshot();

  for (const listener of listeners) listener(snapshot);
};

export const getSnapshot = buildSnapshot;

export const subscribe = (listener: Listener): (() => void) => {
  listeners.add(listener);

  return () => listeners.delete(listener);
};

export const addParticipant = (roomId: string, participant: RoomParticipant) => {
  let participants = rooms.get(roomId);

  if (!participants) {
    participants = new Map();
    rooms.set(roomId, participants);
  }

  participants.set(participant.identity, participant);
  emit();
};

export const removeParticipant = (roomId: string, identity: string) => {
  const participants = rooms.get(roomId);

  if (!participants) return;

  participants.delete(identity);

  if (participants.size === 0) rooms.delete(roomId);

  emit();
};

export const clearRoom = (roomId: string) => {
  if (rooms.delete(roomId)) emit();
};

/**
 * Reconciles the in-memory store with LiveKit's actual state for one room.
 *
 * Webhooks can be missed (server restart, network blip); this pulls the source
 * of truth. Called lazily when a room is first observed and on server boot.
 */
export const syncRoom = async (roomId: string) => {
  try {
    const live = await roomService.listParticipants(roomId);
    const participants = new Map<string, RoomParticipant>(
      live.map((p) => [p.identity, { identity: p.identity, name: p.name || p.identity }]),
    );

    if (participants.size > 0) rooms.set(roomId, participants);
    else rooms.delete(roomId);
  } catch {
    // listParticipants throws when the room has no active session — treat as empty.
    rooms.delete(roomId);
  }

  emit();
};
