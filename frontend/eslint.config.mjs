import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { FlatCompat } from '@eslint/eslintrc'

const compat = new FlatCompat({ baseDirectory: dirname(fileURLToPath(import.meta.url)) })

/**
 * Flat config rather than `next lint`, which is deprecated in Next 15.5 and
 * prompts interactively when no config exists — which would hang CI.
 *
 * `core-web-vitals` carries the rules that catch the mistakes that actually
 * cost us here: raw <img> instead of next/image, <a> for internal navigation,
 * and missing alt text.
 */
const config = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    rules: {
      // The codebase is deliberate about unused args in callback signatures;
      // flag genuine dead variables but allow the _-prefixed convention.
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrors: 'none' },
      ],
      // Decorative apostrophes and quotes read fine in JSX here.
      'react/no-unescaped-entities': 'off',
    },
  },
  {
    ignores: ['.next/**', 'out/**', 'node_modules/**', 'next-env.d.ts'],
  },
]

export default config
