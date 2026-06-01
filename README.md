<div align="center">

# Chatovo

**Real-time voice rooms — in the browser and on the desktop.**

A modern, Discord-inspired messenger built around private voice rooms and crisp video. One codebase, two platforms, zero friction.

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
![Status](https://img.shields.io/badge/status-active-success.svg)
![Stack](https://img.shields.io/badge/stack-Next.js%20%7C%20Hono%20%7C%20Tauri%20%7C%20LiveKit-black.svg)
![Runtime](https://img.shields.io/badge/runtime-Bun-fbf0df.svg)

[Website](https://chatovo.ru) · [Report a bug](../../issues) · [Request a feature](../../issues)

</div>

---

## About

**Chatovo** is a real-time communication app where conversations happen in *rooms*, not in endless chat threads. Spin up a room in one click, share the link with friends, and start talking. Voice and video work out of the box.

Three ideas hold it together:

- **Rooms over channels.** Each room is its own little world — public, private, or password-protected. No noisy server lists, no nested categories.
- **One experience, everywhere.** Open Chatovo in any modern browser or install the native desktop build. The UI, the rooms, the accounts — all the same.
- **Fast, quiet, focused.** Designed to fade into the background while you talk. Crisp audio, low-latency video, and an interface that gets out of the way.

## Features

- **Instant voice & video rooms** — low-latency WebRTC over a LiveKit SFU backbone.
- **Private password-protected rooms** — only those who know the password can join.
- **One-click sign-in** via Google or classic email + password — better-auth under the hood.
- **Lightweight desktop app on Tauri** — a native binary, not a bundled browser. Ships with auto-updates.
- **A single, consistent UI** across web and desktop — designed to feel calm rather than crowded.
- **Self-hostable** — one `docker-compose.yml`, automatic TLS from Let's Encrypt.
- **i18n out of the box** — English and Russian via `next-intl`.

## Tech stack

| Layer | Technologies |
|---|---|
| **Web client** | Next.js 16, React 19, Tailwind CSS 4, Radix UI, TanStack Query, React Hook Form + Zod, ts-pattern, remeda, next-intl |
| **Desktop client** | Tauri 2 (Rust), plugins: updater / deep-link / opener / os / process |
| **API server** | Hono on Bun, OpenAPI + Swagger UI, Prisma 7, PostgreSQL |
| **Realtime / media** | LiveKit SFU (WebRTC), `@livekit/components-react`, server-issued JWTs |
| **Auth / DB** | better-auth (Bearer tokens), self-hosted PostgreSQL |
| **Infra** | Docker Compose, Caddy (HTTPS + reverse proxy), GitHub Actions, GHCR |
| **Tooling** | Biome (lint + format), React Compiler, TypeScript 5.8, Bun workspaces |

The frontend follows [Feature-Sliced Design](docs/fsd.md) with one deliberate tweak: the `pages/` layer is renamed to `views/` to avoid clashing with the Next.js Pages Router.

## Repository layout

A Bun-workspaces monorepo:

```text
chatovo/
├── apps/
│   ├── client/          # Next.js web client (FSD: app/views/widgets/features/entities/shared)
│   ├── server/          # Hono API on Bun + Prisma
│   └── tauri/           # Tauri desktop wrapper (Rust)
├── packages/
│   └── schemas/         # Shared Zod schemas (used by both client and server)
├── infra/
│   ├── caddy/           # Caddyfiles for prod and dev (HTTPS, reverse proxy)
│   └── livekit/         # SFU configs
├── docs/
│   ├── fsd.md           # Frontend architecture guide
│   └── style.md         # Code style guide
├── docker-compose.yml       # Production stack (web + server + livekit)
└── docker-compose.dev.yml   # Local SFU + Caddy for dev
```

## Quick start

### Prerequisites

- [**Bun**](https://bun.sh) ≥ 1.1
- **Node.js** ≥ 20 (needed by a few dev tools)
- **Docker** + Docker Compose — for the local LiveKit SFU and Caddy
- **Rust** + Tauri system dependencies — only if you're building the desktop app ([see Tauri prerequisites](https://tauri.app/start/prerequisites/))
- A **PostgreSQL** database (the dev `docker-compose.dev.yml` ships one) and either **LiveKit Cloud** or a local SFU

### Install

```bash
git clone https://github.com/zilero232/chatovo.git
cd chatovo
bun install
```

### Environment variables

Copy the templates and fill them in:

```bash
cp apps/server/.env.example apps/server/.env
cp apps/client/.env.example apps/client/.env
```

What you need to provide:

- **Auth** — `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL` and `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` (server)
- **LiveKit** — `LIVEKIT_URL`, `LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET` (server) and `NEXT_PUBLIC_LIVEKIT_URL` (client)
- **Postgres** — `DATABASE_URL` and `DIRECT_URL` (same value for a self-hosted single instance)
- **Uploads** — `UPLOADS_DIR` for avatars and chat attachments served under `/uploads`
- **CORS** — `CORS_ORIGINS` for the allowed web origins

> ⚠️ **Heads up:** `prisma generate` will throw without `DIRECT_URL` — `prisma.config.ts` requires it. Without it, `bun install` (postinstall) and any CI/Docker build will break.

### Database

```bash
# Push the current schema to the dev DB and regenerate the client
bun --filter @chatovo/server db:push

# Or use proper migrations
bun --filter @chatovo/server db:migrate
```

### Running in dev

**Option 1 — one command (recommended):**

```bash
# Brings up LiveKit SFU + Caddy in Docker, then starts server and client
bun dev:full
```

Open `https://chatovo.localhost` — traffic goes through Caddy, just like in production. On the first visit, accept the locally-issued self-signed certificate.

**Option 2 — split into pieces:**

```bash
bun dev:livekit    # terminal 1: LiveKit + Caddy in Docker
bun dev            # terminal 2: server (:4000) and client (:3000)
```

Or even more granular:

```bash
bun dev:server     # only the Hono API
bun dev:client     # only the Next.js client
```

> ⚠️ **Hot reload is client-only.** The server runs under `bun --hot`, but modules are **not** swapped on the fly when you edit `apps/server/*` — you need a full dev-server restart to see changes.

### Desktop (Tauri)

```bash
bun tauri:dev      # run the desktop build in dev mode
bun tauri:build    # build a release binary
```

The app version is taken **only** from the root `package.json` — the four `version` fields under `apps/tauri/*` stay pinned at `0.0.0`, and CI rewrites them at build time.

### Lint & format

```bash
bun lint           # biome check across the whole monorepo
bun lint:fix       # auto-fix what's safe
bun format         # formatting only
```

## Deployment

The production stack lives in `docker-compose.yml` and runs three containers:

- **web** — static Next.js export served by Caddy (HTTPS, proxies `/api` and the LiveKit WebSocket)
- **server** — Hono API on Bun
- **livekit** — self-hosted LiveKit SFU in `network_mode: host` (required so WebRTC media ports work without Docker NAT)

CI builds the `web` and `server` images and pushes them to GHCR (`ghcr.io/zilero232/chatovo-*`). The VPS only **pulls** them — no builds run on the production host.

```bash
# On the VPS, in the directory that holds .env and livekit.yaml:
docker compose pull && docker compose up -d
docker compose logs -f
```

Desktop releases (Windows / macOS / Linux) are built by GitHub Actions on every `v*` tag push via `tauri-action`, signed with the key stored in secrets, and published to GitHub Releases. Installed clients learn about updates through `@tauri-apps/plugin-updater`.

## Roadmap

- [x] Voice & video rooms
- [x] Private password-protected rooms
- [x] Web + desktop from one codebase
- [x] Google & email sign-in
- [x] Desktop client auto-updates
- [ ] Text chat alongside voice
- [ ] Screen sharing
- [ ] Push-to-talk and global hotkeys
- [ ] Mobile clients

## Contributing

Bug reports, feature ideas, and pull requests are welcome. For larger changes, open an issue first so we can talk through the approach. Small fixes can go straight to a PR.

Before committing, run `bun lint:fix` — the repo is set up with Biome.

## License

Chatovo is free software, released under the **GNU General Public License v3.0** (GPL-3.0).

You are free to:

- **Use** the software for any purpose
- **Study** how it works and modify it
- **Share** copies with anyone
- **Share your modifications** with the community

Under one condition: any distribution of Chatovo, or of any derivative work based on it, **must remain under the same GPL-3.0 license** and ship with its full source code. That's the "copyleft" guarantee — it keeps Chatovo free for everyone, forever.

> This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
>
> This program is distributed in the hope that it will be useful, but **WITHOUT ANY WARRANTY**; without even the implied warranty of **MERCHANTABILITY** or **FITNESS FOR A PARTICULAR PURPOSE**. See the GNU General Public License for more details.

The full license text is available in [LICENSE](LICENSE) and at <https://www.gnu.org/licenses/gpl-3.0.html>.

---

<div align="center">

Made with care by <a href="mailto:alexandr.artemev.me@gmail.com">Alexandr Artemev</a>

</div>
