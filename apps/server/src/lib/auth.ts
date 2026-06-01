import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { bearer, oneTimeToken } from 'better-auth/plugins';
import { allowedOrigins } from '../config/cors';
import { env } from './env';
import { prisma } from './prisma';

export type UserRole = 'admin' | 'user';

export const auth = betterAuth({
  baseURL: env.BETTER_AUTH_URL,
  basePath: '/auth',
  secret: env.BETTER_AUTH_SECRET,
  trustedOrigins: allowedOrigins,
  account: {
    storeStateStrategy: 'database',
    skipStateCookieCheck: true,
  },
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
  },
  user: {
    additionalFields: {
      role: {
        type: 'string',
        required: false,
        defaultValue: 'user',
        input: false,
      },
      verified: {
        type: 'boolean',
        required: false,
        defaultValue: false,
        input: false,
      },
    },
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          await prisma.profile.create({
            data: { userId: user.id, displayName: user.name },
          });
        },
      },
    },
  },
  plugins: [bearer(), oneTimeToken()],
  database: prismaAdapter(prisma, { provider: 'postgresql' }),
});
