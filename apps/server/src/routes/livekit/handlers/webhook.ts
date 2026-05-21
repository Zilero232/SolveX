import { WebhookReceiver } from 'livekit-server-sdk';
import { match } from 'ts-pattern';
import { env } from '../../../lib/env';
import { addParticipant, clearRoom, removeParticipant, syncRoom } from '../presence';
import type { Handler } from 'hono';
import type { Env } from '../../shared/types';

const webhookReceiver = new WebhookReceiver(env.LIVEKIT_API_KEY, env.LIVEKIT_API_SECRET);

/**
 * Receives LiveKit server webhooks and updates the in-memory presence store.
 *
 * Not bearer-authed — LiveKit signs the body with the API secret, which
 * WebhookReceiver verifies. Registered as a plain POST route (not OpenAPI):
 * the body is read raw, so it must not go through zod-openapi validation.
 */
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

  await match(event.event)
    .with('participant_joined', () => {
      if (participant) {
        addParticipant(roomId, {
          identity: participant.identity,
          name: participant.name || participant.identity,
        });
      }
    })
    .with('participant_left', () => {
      if (participant) removeParticipant(roomId, participant.identity);
    })
    .with('room_finished', () => clearRoom(roomId))
    // Reconcile in case participant_joined events were missed before boot.
    .with('room_started', () => syncRoom(roomId))
    // Other event types (track_published, egress, etc.) don't affect presence.
    .otherwise(() => {});

  return c.json({ ok: true }, 200);
};
