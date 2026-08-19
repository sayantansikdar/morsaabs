/**
 * Admin authorisation.
 *
 * Two separate questions, and both must be yes:
 *   1. Is this a signed-in Clerk user?      (authentication)
 *   2. Is that user on the admin allowlist? (authorisation)
 *
 * Signing up must never grant dashboard access — Clerk sign-up is open by
 * default, so without step 2 anyone on the internet could create an account and
 * start editing prices. The allowlist is `ADMIN_USER_IDS`, a comma-separated
 * list of Clerk user ids.
 *
 * Everything here fails closed: unset env, misconfigured Clerk, or any error
 * results in "not an admin" rather than an accidental grant.
 */

import 'server-only'
import { auth, currentUser } from '@clerk/nextjs/server'

export type AdminActor = { id: string; email?: string | null }

export function isClerkConfigured(): boolean {
  return Boolean(
    process.env.CLERK_SECRET_KEY && process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  )
}

function adminIds(): string[] {
  return (process.env.ADMIN_USER_IDS ?? '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean)
}

/**
 * Local-only escape hatch so the dashboard can be built and tested before Clerk
 * keys exist.
 *
 * The production check is on NODE_ENV, which Next sets to 'production' in every
 * real build — this cannot be switched on by setting an env var on the host.
 */
function devBypassActive(): boolean {
  return process.env.NODE_ENV !== 'production' && process.env.ADMIN_DEV_BYPASS === '1'
}

/**
 * Returns the admin actor, or null if the caller is not an authorised admin.
 * Never throws: callers decide what a refusal looks like.
 */
export async function getAdminActor(): Promise<AdminActor | null> {
  if (devBypassActive()) {
    return { id: 'dev-bypass', email: 'dev@localhost' }
  }

  // No Clerk, no admin. In production this is the only correct answer.
  if (!isClerkConfigured()) return null

  try {
    const { userId } = await auth()
    if (!userId) return null

    const allowed = adminIds()
    // An empty allowlist grants nobody. Failing open here would hand the
    // dashboard to every signed-up user the moment the env var went missing.
    if (allowed.length === 0 || !allowed.includes(userId)) return null

    const user = await currentUser()
    return {
      id: userId,
      email: user?.primaryEmailAddress?.emailAddress ?? null,
    }
  } catch {
    return null
  }
}

/** True when the caller is a signed-in, allowlisted admin. */
export async function isAdmin(): Promise<boolean> {
  return (await getAdminActor()) !== null
}
