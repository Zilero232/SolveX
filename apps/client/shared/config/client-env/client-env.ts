import { z } from 'zod';

const clientSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.url(),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(1),
  // Absolute URL of the Hono API — http://localhost:4000 in dev,
  // https://api.chatovo.ru in production (its own subdomain, see Caddyfile).
  NEXT_PUBLIC_API_URL: z.string().min(1).default('http://localhost:4000'),
  NEXT_PUBLIC_LIVEKIT_URL: z.string().min(1),
});

const parsed = clientSchema.safeParse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_LIVEKIT_URL: process.env.NEXT_PUBLIC_LIVEKIT_URL,
});

if (!parsed.success) {
  console.error('Invalid client env:', z.treeifyError(parsed.error));

  throw new Error('Missing or invalid client env. See .env.example.');
}

export const env = parsed.data;
