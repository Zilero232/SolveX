import { TrackSource, WebhookReceiver } from 'livekit-server-sdk';
import { match } from 'ts-pattern';
import { env } from '../../../lib/env';
import {
  addParticipant,
  clearRoom,
  isMicMuted,
  parseParticipantMeta,
  patchParticipant,
  removeParticipant,
  syncRoom,
} from '../presence';
import type { Handler } from 'hono';
import type { Env } from '../../shared/types';

const webhookReceiver = new WebhookReceiver(env.LIVEKIT_API_KEY, env.LIVEKIT_API_SECRET);

// Not bearer-authed: LiveKit signs the body with the API secret. Registered as
// a plain POST route (not OpenAPI) because the body must be read raw.
export const webhookHandler: Handler<Env> = async (c) => {
  const body = await c.req.text();
  const authHeader = c.req.header('Authorization');

  let event: Awaited<ReturnType<typeof webhookReceiver.receive>>;

  try {
    event = await webhookReceiver.receive(body, authHeader);
  } catch {
    return c.json({ error: 'Invalid webhook signature' }, 401);
  }

  // room.name carries our roomId — tokens are issued with `room: room.id`.
  // Every presence event is room-scoped, so without it there is nothing to do.
  const roomId = event.room?.name;

  if (!roomId) return c.json({ ok: true }, 200);

  const participant = event.participant;
  const track = event.track;
  const isMicTrack = track?.source === TrackSource.MICROPHONE;

  await match(event.event)
    .with('participant_joined', () => {
      if (participant) {
        addParticipant(roomId, {
          identity: participant.identity,
          name: participant.name || participant.identity,
          micMuted: isMicMuted(participant.tracks),
          deafened: participant.attributes?.deafened === 'true',
          ...parseParticipantMeta(participant.metadata),
        });
      }
    })
    .with('participant_left', () => {
      if (participant) removeParticipant(roomId, participant.identity);
    })
    // LiveKit does NOT emit `track_muted` / `track_unmuted` webhooks — only the
    // publish lifecycle. Live mute toggles arrive via the explicit
    // POST /livekit/mic-state endpoint from the client instead.
    .with('track_published', () => {
      if (participant && isMicTrack && track) {
        patchParticipant(roomId, participant.identity, { micMuted: track.muted });
      }
    })
    .with('track_unpublished', () => {
      if (participant && isMicTrack) {
        patchParticipant(roomId, participant.identity, { micMuted: true });
      }
    })
    .with('room_finished', () => clearRoom(roomId))
    // Reconcile in case participant_joined events were missed before boot.
    .with('room_started', () => syncRoom(roomId))
    .otherwise(() => undefined);

  return c.json({ ok: true }, 200);
};
