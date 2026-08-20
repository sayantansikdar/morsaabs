/**
 * Database client.
 *
 * Neon's serverless driver talks over HTTP rather than a TCP pool, which is what
 * makes it safe in a serverless function: there is no connection to leak between
 * invocations and no pool to exhaust under burst traffic.
 *
 * `DATABASE_URL` is deliberately not read at module scope. The public site is
 * still built as a static export in CI, where no database exists — touching the
 * env at import time would fail every build. `getDb()` resolves lazily and
 * throws only if something actually tries to query without a configured URL.
 */

import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from './schema'

export type Database = ReturnType<typeof createClient>

function createClient(url: string) {
  return drizzle(neon(url), { schema })
}

let cached: Database | undefined

export function getDb(): Database {
  if (cached) return cached

  const url = process.env.DATABASE_URL
  if (!url) {
    throw new Error(
      'DATABASE_URL is not set. Add the Neon connection string to .env.local ' +
        '(local) or the Vercel project environment (deployed).'
    )
  }

  cached = createClient(url)
  return cached
}

/** True when a database is configured — lets callers degrade instead of throwing. */
export function isDatabaseConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL)
}

export * from './schema'
