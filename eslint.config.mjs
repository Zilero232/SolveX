import { eslint } from '@siberiacancode/eslint';

export default eslint(
  {
    typescript: true,
  },
  {
    ignores: ['**/node_modules', '**/dist', '**/.next', '**/out', '**/generated', 'apps/tauri'],
  },
);
