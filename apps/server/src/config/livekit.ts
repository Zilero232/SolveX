// The webhook is signed by LiveKit and the SSE stream authorizes via a query
// token (EventSource cannot send headers) — both bypass the bearer middleware.
export const PUBLIC_LIVEKIT_PATHS = ['/livekit/webhook', '/livekit/presence'];

// Lifetime of the LiveKit AccessToken (room-join JWT) minted in the token
// handler. The grant only needs to be valid long enough to establish the
// connection — LiveKit keeps the participant in the room after the token
// expires, so 1 hour is a generous join window without long-lived credentials.
export const TOKEN_TTL_SECONDS = 60 * 60;

// Keepalive cadence for the lobby presence SSE stream. A diagnostic run with no
// ping confirmed the stream is dropped after ~15-20s of silence (idle timeout).
// Ping at 8s — well inside that window, with room to spare if a single ping is lost.
export const PRESENCE_PING_INTERVAL_MS = 8_000;
