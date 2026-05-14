import { eslint } from '@siberiacancode/eslint';

export default eslint({
  typescript: true,
}, {
  ignores: ['generated/**', 'dist/**', 'prisma/migrations/**'],
}, {
  rules: {
    'node/prefer-global/process': 'off',
    'e18e/ban-dependencies': 'off',
  },
});
