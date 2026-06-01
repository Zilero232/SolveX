import { z } from 'zod';

const clientSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().min(1).default('http://localhost:4000'),
  NEXT_PUBLIC_LIVEKIT_URL: z.string().min(1),
  NEXT_PUBLIC_APP_VERSION: z.string().min(1).default('0.0.0'),
});

const parsed = clientSchema.safeParse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_LIVEKIT_URL: process.env.NEXT_PUBLIC_LIVEKIT_URL,
  NEXT_PUBLIC_APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION,
});

if (!parsed.success) {
  console.error('Invalid client env:', z.treeifyError(parsed.error));

  throw new Error('Missing or invalid client env. See .env.example.');
}

export const env = parsed.data;
