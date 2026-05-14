import { eslint } from '@siberiacancode/eslint';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default eslint(
  {
    typescript: true,
    react: true,
    next: true,
    jsxA11y: true,
    stylistic: {
      quotes: 'single',
      semi: true,
      indent: 2,
    },
    tailwind: {
      settings: {
        entryPoint: path.join(__dirname, 'app/globals.css'),
        tsconfig: path.join(__dirname, 'tsconfig.json'),
      },
    },
  },
  {
    ignores: ['.next/**', 'out/**', 'generated/**', 'next-env.d.ts'],
  },
  {
    rules: {
      'node/prefer-global/process': 'off',
      'siberiacancode-tailwind/no-unknown-classes': 'off',
      'style/jsx-quotes': ['error', 'prefer-double'],
      'style/comma-dangle': ['error', 'always-multiline'],
    },
  },
  {
    files: ['shared/ui/**', 'scripts/**'],
    rules: {
      'ts/no-use-before-define': 'off',
      'no-console': 'off',
      'style/max-len': 'off',
    },
  },
);
