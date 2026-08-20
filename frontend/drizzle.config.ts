import { config } from 'dotenv'
import { defineConfig } from 'drizzle-kit'

// Next.js reads .env.local on its own; drizzle-kit runs outside Next, so it has
// to be loaded explicitly. .env.local wins, matching Next's own precedence.
config({ path: ['.env.local', '.env'] })

/**
 * Migrations are generated into lib/db/migrations and applied with
 * `npm run db:migrate`. Generated SQL is committed so a schema change is
 * reviewable in a diff rather than applied invisibly at deploy time.
 */
export default defineConfig({
  schema: './lib/db/schema.ts',
  out: './lib/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL ?? '',
  },
  verbose: true,
  strict: true,
})
