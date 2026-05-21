# Self-hosted LiveKit for Chatovo

This folder contains the LiveKit server config template for running our own
LiveKit SFU on the Chatovo VPS, instead of paying for LiveKit Cloud.

The production LiveKit container is declared in the root `docker-compose.yml`
(`livekit` service). This folder holds:

| File           | Purpose                                                |
|----------------|--------------------------------------------------------|
| `livekit.yaml` | Production config TEMPLATE — copied to the VPS by hand |
| `README.md`    | This file                                              |

The local-dev setup lives in the repo root, next to the main compose file:
`docker-compose.dev.yml` (runs LiveKit alone) and `livekit.dev.yaml` (its
config, with throwaway keys committed in plain text). See "Local development".

For end-to-end deployment instructions (firewall, DNS, Caddy, env vars),
see `infra/caddy/README.md` → section "Self-hosted LiveKit".

## Quick reference

Generate API key + secret. The official `livekit/generate` image is an
interactive deployment wizard (not what we want — it tries to scaffold its
own docker-compose), so just generate two random strings yourself:

```bash
# API Key — any string, conventionally prefixed with "API"
echo "API$(openssl rand -hex 8)"

# API Secret — must be at least 32 chars
openssl rand -base64 36
```

PowerShell equivalent (no openssl needed):

```powershell
"API" + -join ((48..57)+(65..90)+(97..122) | Get-Random -Count 12 | % {[char]$_})
-join ((48..57)+(65..90)+(97..122) | Get-Random -Count 48 | % {[char]$_})
```

Required firewall ports on the VPS:

| Port           | Proto | Purpose                                  |
|----------------|-------|------------------------------------------|
| 443            | tcp   | HTTPS — Caddy proxies WSS to LiveKit     |
| 7881           | tcp   | TURN/TCP fallback (LiveKit listens here) |
| 50000-50100    | udp   | WebRTC media (RTP)                       |

Port 7880 (signalling) does NOT need to be open publicly — Caddy talks to it
on localhost. Same for the UDP media range when serving entirely through TCP
fallback, but UDP is strongly recommended for voice latency.

## Local development

For everyday UI work you can point the local API at LiveKit Cloud or the
production SFU and skip this. But **webhooks won't reach `localhost`** — the
remote LiveKit cannot POST to your machine — so the live presence panel
(see below) stays empty. To exercise the full webhook → SSE → UI chain
locally, run your own LiveKit (compose file in the repo root):

```bash
docker compose -f docker-compose.dev.yml up
```

Then put the local-LiveKit values in `apps/server/.env`:

```bash
LIVEKIT_URL=ws://localhost:7880
LIVEKIT_API_KEY=devkey
LIVEKIT_API_SECRET=devsecret_devsecret_devsecret_32
```

and in `apps/client/.env`:

```bash
NEXT_PUBLIC_LIVEKIT_URL=ws://localhost:7880
```

The dev config (`livekit.dev.yaml`) ships with throwaway keys committed in
plain text — fine, because it never runs in production. Its `webhook` block
already points at `host.docker.internal:4000`, so once `bun dev` is running
the API receives presence events. Run `bun dev` and the LiveKit container
in parallel.

Why a separate compose file: the production `livekit` service uses
`network_mode: host`, which does not work on Docker Desktop (Windows/macOS).
The dev file uses a normal bridge network with published ports instead.

## Live presence (webhooks)

The channels panel shows who is currently in each voice room in real time.
This is driven by LiveKit **webhooks**, not polling:

1. LiveKit POSTs `participant_joined` / `participant_left` / `room_finished`
   events to the API's `/livekit/webhook` route.
2. The API keeps an in-memory presence store and pushes every change to
   connected clients over Server-Sent Events (`/livekit/presence`).
3. The client opens one SSE stream for the whole app — no per-room polling.

To enable it, the `webhook` block in `livekit.yaml` must be filled in:

```yaml
webhook:
  api_key: APIxxxxxxxxxxxx          # one of the keys: entries above
  urls:
    - https://api.chatovo.ru/livekit/webhook
```

The `api_key` selects which secret LiveKit signs the webhook body with; the
API verifies that signature, so `/livekit/webhook` needs no bearer token. The
URL must be reachable from the LiveKit container — use the public API domain.

If the `webhook` block is omitted, voice calls still work; the channels panel
just won't show live participant lists.

## Migrating from LiveKit Cloud → self-hosted

Only env vars change. No code changes:

```diff
- LIVEKIT_URL=wss://<project>.livekit.cloud
+ LIVEKIT_URL=wss://livekit.chatovo.ru
- LIVEKIT_API_KEY=<cloud-key>
+ LIVEKIT_API_KEY=<self-hosted-key from livekit.yaml>
- LIVEKIT_API_SECRET=<cloud-secret>
+ LIVEKIT_API_SECRET=<self-hosted-secret from livekit.yaml>
```

Same change in `NEXT_PUBLIC_LIVEKIT_URL` on the client side (rebuild required —
this value is baked into the bundle at `next build` time).
