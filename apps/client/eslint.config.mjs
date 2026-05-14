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

      'style/padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: '*', next: 'return' },
        { blankLine: 'always', prev: ['const', 'let'], next: '*' },
        { blankLine: 'any', prev: ['const', 'let'], next: ['const', 'let'] },
        { blankLine: 'always', prev: ['const', 'let'], next: 'if' },
        { blankLine: 'always', prev: 'if', next: '*' },
        { blankLine: 'always', prev: 'block-like', next: '*' },
      ],
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
