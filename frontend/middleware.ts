import { NextResponse } from 'next/server'
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

/**
 * Clerk session middleware.
 *
 * `/admin` is protected here as a first line: an unauthenticated request is
 * bounced to sign-in before any page code runs. This is *not* the authorisation
 * check — being signed in is not the same as being staff. The allowlist test
 * lives in lib/admin-auth and is re-applied by the admin layout and by every
 * server action, because middleware cannot express "is this user on the list"
 * without a database round trip on every request.
 *
 * When Clerk is not configured the middleware is a passthrough instead of
 * running Clerk at all: `clerkMiddleware()` throws "Missing publishableKey" on
 * every request without keys, which takes down the entire public site — CI
 * caught exactly that. Passing through is safe because it grants nothing:
 * getAdminActor() independently refuses when Clerk is unconfigured, so /admin
 * stays closed either way.
 */

const isAdminRoute = createRouteMatcher(['/admin(.*)'])

const clerkConfigured = Boolean(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY
)

export default clerkConfigured
  ? clerkMiddleware(async (auth, request) => {
      if (isAdminRoute(request)) await auth.protect()
    })
  : () => NextResponse.next()

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
    // Clerk's auto-proxy endpoints must not be swallowed by the matcher above.
    '/__clerk/:path*',
  ],
}
