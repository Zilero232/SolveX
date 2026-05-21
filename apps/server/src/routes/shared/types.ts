import type { AuthVars } from '../../middleware/auth';

/** Hono context env shared by every authenticated router. */
export type Env = {
  Variables: AuthVars;
};
