import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../generated';
import { env } from './env';

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

const createClient = () => {
  const adapter = new PrismaPg({ connectionString: env.DATABASE_URL });

  return new PrismaClient({
    adapter,
    log: env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });
};

export const prisma = globalForPrisma.prisma ?? createClient();

if (env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
