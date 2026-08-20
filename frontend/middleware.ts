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
 * Not applied under `output: export` — a static host has no middleware — which
 * is another reason the real checks are in the app, not here.
 */

const isAdminRoute = createRouteMatcher(['/admin(.*)'])

export default clerkMiddleware(async (auth, request) => {
  if (isAdminRoute(request)) await auth.protect()
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
    // Clerk's auto-proxy endpoints must not be swallowed by the matcher above.
    '/__clerk/:path*',
  ],
}
