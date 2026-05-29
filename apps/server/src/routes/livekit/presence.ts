import { participantMetadataSchema, safeJsonParse } from '@chatovo/schemas';
import { RoomServiceClient, TrackSource } from 'livekit-server-sdk';
import { env } from '../../lib/env';
import type { RoomParticipant, RoomsParticipantsSnapshot } from '@chatovo/schemas';
import type { ParticipantInfo, TrackInfo } from 'livekit-server-sdk';

type Listener = (snapshot: RoomsParticipantsSnapshot) => void;

const rooms = new Map<string, Map<string, RoomParticipant>>();
const listeners = new Set<Listener>();

// Lobby presence: per-user connection counter. A user opens N tabs → counter
// goes to N; closing N-1 keeps them online; closing the last evicts them.
const lobbyConnections = new Map<string, number>();

const roomService = new RoomServiceClient(
  env.LIVEKIT_URL,
  env.LIVEKIT_API_KEY,
  env.LIVEKIT_API_SECRET,
);

export const parseParticipantMeta = (
  metadata: string | undefined,
): Pick<RoomParticipant, 'verified' | 'profileUrl' | 'avatarUrl' | 'bannerColor'> => {
  const { verified, profileUrl, avatarUrl, bannerColor } = participantMetadataSchema.parse(
    safeJsonParse(metadata),
  );

  return { verified, profileUrl, avatarUrl, bannerColor };
};

// Mic counts as live only if an unmuted microphone track is published.
// No track published yet → effectively silent for the room.
export const isMicMuted = (tracks: TrackInfo[] | undefined): boolean => {
  const mic = tracks?.find((track) => track.source === TrackSource.MICROPHONE);

  return !mic || mic.muted;
};

const buildSnapshot = (): RoomsParticipantsSnapshot => {
  const result: RoomsParticipantsSnapshot['rooms'] = {};

  for (const [roomId, participants] of rooms) {
    if (participants.size > 0) result[roomId] = [...participants.values()];
  }

  return { rooms: result, lobbyOnline: lobbyConnections.size };
};

export const addLobbyConnection = (userId: string) => {
  const current = lobbyConnections.get(userId) ?? 0;
  const isNewUser = current === 0;

  lobbyConnections.set(userId, current + 1);

  if (isNewUser) emit();
};

export const removeLobbyConnection = (userId: string) => {
  const current = lobbyConnections.get(userId);

  if (!current) return;

  if (current <= 1) {
    lobbyConnections.delete(userId);
    emit();

    return;
  }

  lobbyConnections.set(userId, current - 1);
};

const emit = () => {
  const snapshot = buildSnapshot();

  for (const listener of listeners) listener(snapshot);
};

export const getSnapshot = buildSnapshot;

export const subscribe = (listener: Listener): (() => void) => {
  listeners.add(listener);

  return () => {
    return listeners.delete(listener);
  };
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

// Mic-only update — caller already knows the participant's identity from the
// webhook payload; we only flip the flag and broadcast.
export const setParticipantMicMuted = (roomId: string, identity: string, micMuted: boolean) => {
  const participants = rooms.get(roomId);
  const current = participants?.get(identity);

  if (!current || current.micMuted === micMuted) return;

  participants?.set(identity, { ...current, micMuted });

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

const toRoomParticipant = (p: ParticipantInfo): RoomParticipant => {
  return {
    identity: p.identity,
    name: p.name || p.identity,
    micMuted: isMicMuted(p.tracks),
    ...parseParticipantMeta(p.metadata),
  };
};

// Reconciles the in-memory store with LiveKit's actual state — webhooks can be
// missed (server restart, network blip). Called lazily and on server boot.
export const syncRoom = async (roomId: string) => {
  try {
    const live = await roomService.listParticipants(roomId);
    const participants = new Map<string, RoomParticipant>(
      live.map((p) => [p.identity, toRoomParticipant(p)]),
    );

    if (participants.size > 0) rooms.set(roomId, participants);
    else rooms.delete(roomId);
  } catch {
    rooms.delete(roomId);
  }

  emit();
};
