import Link from 'next/link'
import type { Metadata } from 'next'
import { getAdminActor, isClerkConfigured } from '@/lib/admin-auth'

/**
 * Admin shell.
 *
 * The gate is here rather than in each page so a new page under /admin is
 * protected by default — the failure mode of per-page checks is the page
 * someone forgets to annotate.
 *
 * Note this is defence in depth, not the only lock: server actions re-check the
 * actor themselves, because a layout cannot protect a POST.
 */

export const metadata: Metadata = {
  title: 'Dashboard',
  // The dashboard must never be indexed or previewed in search results.
  robots: { index: false, follow: false, nocache: true },
}

const NAV = [
  { href: '/admin', label: 'Overview' },
  { href: '/admin/menu', label: 'Menu & prices' },
  { href: '/admin/orders', label: 'Orders' },
  { href: '/admin/reservations', label: 'Reservations' },
  { href: '/admin/customers', label: 'Customers' },
  { href: '/admin/messages', label: 'Messages' },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const actor = await getAdminActor()

  if (!actor) return <AccessDenied clerkReady={isClerkConfigured()} />

  return (
    <div className="min-h-dvh bg-muted/30">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3">
          <Link href="/admin" className="font-display text-lg font-semibold">
            Morsaab&rsquo;s <span className="text-muted-foreground">· Dashboard</span>
          </Link>

          <nav aria-label="Dashboard sections" className="flex flex-wrap gap-1">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="ms-auto flex items-center gap-3 text-sm text-muted-foreground">
            <span className="hidden sm:inline">{actor.email ?? actor.id}</span>
            <Link href="/" className="underline underline-offset-4 hover:text-foreground">
              View site
            </Link>
          </div>
        </div>
      </header>

      <main id="main" className="mx-auto max-w-7xl px-4 py-8">
        {children}
      </main>
    </div>
  )
}

/**
 * Deliberately explicit about *why* access failed, because the two causes have
 * completely different fixes — and neither message reveals anything useful to
 * someone who is not an admin.
 */
function AccessDenied({ clerkReady }: { clerkReady: boolean }) {
  return (
    <div className="grid min-h-dvh place-items-center bg-muted/30 px-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
        <h1 className="font-display text-2xl font-semibold">Staff access only</h1>

        {clerkReady ? (
          <>
            <p className="mt-3 text-sm text-muted-foreground">
              Sign in with an authorised staff account to reach the dashboard. If you
              are signed in and still seeing this, your account has not been added to
              the admin list yet.
            </p>
            <Link
              href="/sign-in"
              className="mt-6 inline-flex items-center justify-center rounded-lg bg-foreground px-5 py-2.5 text-sm font-semibold text-background transition-opacity hover:opacity-90"
            >
              Sign in
            </Link>
          </>
        ) : (
          <p className="mt-3 text-sm text-muted-foreground">
            Authentication is not configured on this deployment, so the dashboard is
            closed. Set the Clerk keys and <code className="text-xs">ADMIN_USER_IDS</code>{' '}
            to enable it.
          </p>
        )}

        <Link
          href="/"
          className="mt-6 block text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
        >
          Back to the site
        </Link>
      </div>
    </div>
  )
}
