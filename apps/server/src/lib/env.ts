import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(4000),

  DATABASE_URL: z.string().url(),
  DIRECT_URL: z.string().url().optional(),

  BETTER_AUTH_SECRET: z.string().min(1),
  BETTER_AUTH_URL: z.string().url(),

  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),

  LIVEKIT_API_KEY: z.string().min(1),
  LIVEKIT_API_SECRET: z.string().min(1),
  LIVEKIT_URL: z.string().url(),

  // Public origin where uploaded files are served from (e.g. https://api.chatovo.ru).
  // Used to build absolute URLs stored in the DB and returned to clients.
  PUBLIC_FILES_URL: z.string().url().default('http://localhost:4000'),

  // Filesystem directory where uploaded files (avatars, chat attachments) are
  // written. Served back under /uploads. In Docker this is a mounted volume.
  UPLOADS_DIR: z.string().default('./uploads'),

  // Comma-separated list of allowed CORS origins (web client domains).
  // Tauri origins are always allowed and don't need to be listed here.
  CORS_ORIGINS: z.string().default('http://localhost:3000'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment:', z.treeifyError(parsed.error));
  process.exit(1);
}

export const env = parsed.data;
