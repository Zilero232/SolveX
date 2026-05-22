import { PrismaPg } from '@prisma/adapter-pg';
import { match } from 'ts-pattern';
import { Prisma, PrismaClient } from '../../generated';
import { env } from './env';
import { ConflictError, NotFoundError } from './errors';

// `model` is the operation's model name as Prisma reports it (e.g. "Room"),
// or undefined for raw queries — used to phrase a readable error message.
type PrismaModel = string | undefined;

const label = (model: PrismaModel) => model ?? 'Resource';

// Maps a known Prisma request error to a domain error by its code. Codes we
// don't translate yield `undefined` and bubble up unchanged. To handle a new
// Prisma code across every model, add one `.with(...)` arm below.
// Prisma error code reference: https://prisma.io/docs/orm/reference/error-reference
const mapPrismaError = (
  error: Prisma.PrismaClientKnownRequestError,
  model: PrismaModel,
): Error | undefined =>
  match(error.code)
    .with('P2002', () => new ConflictError(`${label(model)} already exists`))
    .with('P2025', () => new NotFoundError(`${label(model)} not found`))
    .otherwise(() => undefined);

const createClient = () => {
  const adapter = new PrismaPg({ connectionString: env.DATABASE_URL });

  const client = new PrismaClient({
    adapter,
    log: env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

  // Translate raw Prisma error codes into domain errors, so handlers and the
  // global onError handler never branch on Prisma internals.
  return client.$extends({
    query: {
      $allModels: {
        async $allOperations({ model, args, query }) {
          try {
            return await query(args);
          } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
              const mapped = mapPrismaError(error, model);

              if (mapped) throw mapped;
            }

            throw error;
          }
        },
      },
    },
  });
};

type GlobalForPrisma = { prisma?: ReturnType<typeof createClient> };
const globalForPrisma = globalThis as unknown as GlobalForPrisma;

export const prisma = globalForPrisma.prisma ?? createClient();

if (env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
