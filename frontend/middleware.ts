import { NextResponse } from 'next/server'
import { clerkMiddleware } from '@clerk/nextjs/server'

/**
 * Clerk session middleware — session resolution only.
 *
 * It deliberately does *not* guard /admin. Clerk's own guidance is now to keep
 * authorisation out of middleware, because path matching can diverge from how
 * Next actually routes a request and leave a protected resource reachable
 * (`createRouteMatcher` is deprecated for exactly this reason). In practice it
 * also returned a bare 404 for signed-out visitors instead of sending them to
 * sign-in, which is a dead end rather than a door.
 *
 * The real gate is resource-based and unchanged: the admin layout resolves the
 * actor through lib/admin-auth (signed in AND on ADMIN_USER_IDS), and every
 * server action re-checks it, since no middleware can protect a POST it does
 * not see.
 *
 * When Clerk is unconfigured this is a passthrough rather than running Clerk at
 * all: clerkMiddleware() throws "Missing publishableKey" on every request
 * without keys, which 500s the whole public site. Passing through grants
 * nothing — getAdminActor() refuses independently in that state.
 */

const clerkConfigured = Boolean(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY
)

export default clerkConfigured ? clerkMiddleware() : () => NextResponse.next()

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
    // Clerk's auto-proxy endpoints must not be swallowed by the matcher above.
    '/__clerk/:path*',
  ],
}
