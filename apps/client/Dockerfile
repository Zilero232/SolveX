# syntax=docker/dockerfile:1
#
# Chatovo web client — static Next.js export served by Caddy.
#
# The build context MUST be the monorepo root, because the client depends on
# the `@chatovo/schemas` and `@chatovo/server` (type-only) workspace packages.
# Build from the repo root with:
#   docker build -f apps/client/Dockerfile -t chatovo-web .
#
# This image both serves the static site and reverse-proxies /api to the
# server container — so it is the only public-facing container (ports 80/443).
#
# The NEXT_PUBLIC_* values are baked into the static bundle at build time and
# must be passed as build args (they are not secrets — they ship to the browser).

# ---- Build stage: produce the static export ----
FROM oven/bun:1.3.14 AS build
WORKDIR /app

# NEXT_PUBLIC_* values, supplied by CI via --build-arg.
ARG NEXT_PUBLIC_API_URL=/api
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
ARG NEXT_PUBLIC_LIVEKIT_URL
# Expose them to `next build` as environment variables.
ENV NODE_ENV=production \
    NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL} \
    NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL} \
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=${NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY} \
    NEXT_PUBLIC_LIVEKIT_URL=${NEXT_PUBLIC_LIVEKIT_URL}

# Install dependencies. Copy manifests first so the install layer is cached
# and only re-runs when a package.json / lockfile changes.
COPY package.json bun.lock ./
COPY apps/client/package.json ./apps/client/package.json
COPY apps/server/package.json ./apps/server/package.json
COPY packages/schemas/package.json ./packages/schemas/package.json
RUN bun install --frozen-lockfile --ignore-scripts

# Copy the source needed to build the client.
COPY packages/schemas ./packages/schemas
COPY apps/server ./apps/server
COPY apps/client ./apps/client

# Produce the static export -> apps/client/out
RUN bun --filter @chatovo/client build

# ---- Runtime stage: Caddy serving the static files ----
FROM caddy:2-alpine AS runner

# Caddy site config (serves static files + proxies /api).
COPY deploy/Caddyfile /etc/caddy/Caddyfile

# The static export from the build stage.
COPY --from=build /app/apps/client/out /srv/www

EXPOSE 80 443
