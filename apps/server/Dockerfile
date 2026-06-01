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
# Bun's --frozen-lockfile validates the on-disk workspace topology against the
# lockfile, so every workspace member in bun.lock must have its manifest
# present — even those not used by this image.
COPY apps/client/package.json ./apps/client/package.json
COPY apps/tauri/package.json ./apps/tauri/package.json
# `bun install` triggers the server's `postinstall` (prisma generate); the schema
# is not copied yet, so disable lifecycle scripts here and run generate later.
RUN bun install --frozen-lockfile --ignore-scripts

# ---- Runtime ----
FROM base AS runner
ENV NODE_ENV=production

# Bring the fully installed monorepo (root + every workspace's node_modules)
# from the deps stage. Bun workspaces nest dependencies under each package's
# own node_modules — for example packages/schemas declares `zod`, so it lives
# in packages/schemas/node_modules/zod and must be present at runtime.
# Copying the whole tree is the simplest way to keep the resolution graph intact.
COPY --from=deps /app /app

# Overlay the actual source on top of the deps stage's manifest-only layout.
COPY packages/schemas ./packages/schemas
COPY apps/server ./apps/server

WORKDIR /app/apps/server

# Generate the Prisma client now that the schema is present.
# prisma.config.ts resolves DIRECT_URL via prisma/config's env() helper, which
# throws if the variable is unset. `prisma generate` does not actually connect
# to the database, so a placeholder value is enough to satisfy the loader.
RUN DIRECT_URL="postgresql://placeholder" bunx prisma generate

EXPOSE 4000

# Hono reads PORT from the environment (defaults to 4000). The container is run
# with an env file supplying DATABASE_URL, BETTER_AUTH_*, GOOGLE_*, LIVEKIT_*,
# CORS_ORIGINS, UPLOADS_DIR.
CMD ["bun", "src/index.ts"]
