# Self-hosted LiveKit for Chatovo

This folder contains the LiveKit server config template for running our own
LiveKit SFU on the Chatovo VPS, instead of paying for LiveKit Cloud.

The LiveKit container itself is declared in the root `docker-compose.yml`
(`livekit` service). This folder holds:

| File           | Purpose                                                |
|----------------|--------------------------------------------------------|
| `livekit.yaml` | Server config template — copied to the VPS by hand     |
| `README.md`    | This file                                              |

For end-to-end deployment instructions (firewall, DNS, Caddy, env vars),
see `docs/deploy.md` → section "Self-hosted LiveKit".

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
