import { eslint } from '@siberiacancode/eslint';

export default eslint(
  {
    typescript: true,
    jsonc: true
  },
  {
    ignores: ['**/node_modules', '**/dist', '**/.next', '**/out', '**/generated', 'apps/tauri'],
  },
);
