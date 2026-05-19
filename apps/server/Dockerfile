# syntax=docker/dockerfile:1
#
# Chatovo API server — Hono on the Bun runtime.
#
# The build context MUST be the monorepo root, because the server depends on the
# `@chatovo/schemas` workspace package. Build from the repo root with:
#   docker build -f apps/server/Dockerfile -t chatovo-server .
#
# Bun runs the TypeScript source directly, so there is no separate compile step —
# we only install dependencies and generate the Prisma client.

# ---- Base ----
# Pin Bun to the version used in development to keep the runtime reproducible.
FROM oven/bun:1.3.14 AS base
WORKDIR /app

# ---- Dependencies ----
# Copy only the manifests first so Docker can cache the install layer
# and skip reinstalling when only source code changes.
FROM base AS deps
COPY package.json bun.lock ./
COPY apps/server/package.json ./apps/server/package.json
COPY packages/schemas/package.json ./packages/schemas/package.json
# `bun install` triggers the server's `postinstall` (prisma generate); the schema
# is not copied yet, so disable lifecycle scripts here and run generate later.
RUN bun install --frozen-lockfile --ignore-scripts

# ---- Runtime ----
FROM base AS runner
ENV NODE_ENV=production

# Bring in the installed node_modules from the deps stage.
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/server/node_modules ./apps/server/node_modules

# Copy the source needed at runtime.
COPY package.json bun.lock ./
COPY packages/schemas ./packages/schemas
COPY apps/server ./apps/server

WORKDIR /app/apps/server

# Generate the Prisma client now that the schema is present.
RUN bunx prisma generate

EXPOSE 4000

# Hono reads PORT from the environment (defaults to 4000). The container is run
# with an env file supplying DATABASE_URL, SUPABASE_*, LIVEKIT_*, CORS_ORIGINS.
CMD ["bun", "src/index.ts"]
