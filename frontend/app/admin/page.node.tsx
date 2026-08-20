import Link from 'next/link'
import { getDashboardStats } from '@/lib/db/queries'
import { formatPrice } from '@/lib/site'
import { requireAdminOrNull } from '@/lib/admin-auth'

/**
 * Overview. Deliberately answers "what needs me right now?" rather than showing
 * vanity totals — the first three cards are work queues, and each links
 * straight into the filtered list.
 */

// Live operational data; never serve a cached copy of it.
export const dynamic = 'force-dynamic'

export default async function AdminOverview() {
  // Resource-level gate. The layout's refusal only hides the UI; without this
  // the page still runs and its rows travel in the RSC payload. See
  // requireAdminOrNull.
  if (!(await requireAdminOrNull())) return null

  const stats = await getDashboardStats()

  const queues = [
    {
      label: 'Orders awaiting confirmation',
      value: stats.pendingOrders,
      href: '/admin/orders?status=pending',
      urgent: stats.pendingOrders > 0,
    },
    {
      label: 'Reservations to confirm',
      value: stats.upcomingReservations,
      href: '/admin/reservations?status=pending',
      urgent: stats.upcomingReservations > 0,
    },
    {
      label: 'Unread messages',
      value: stats.newMessages,
      href: '/admin/messages',
      urgent: stats.newMessages > 0,
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-semibold">Overview</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Everything waiting on the restaurant right now.
        </p>
      </div>

      <section aria-labelledby="queues-heading">
        <h2 id="queues-heading" className="sr-only">
          Work queues
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {queues.map((queue) => (
            <Link
              key={queue.href}
              href={queue.href}
              className="rounded-xl border border-border bg-card p-5 transition-colors hover:border-foreground/30"
            >
              <div
                className={`font-display text-4xl font-semibold tabular-nums ${
                  queue.urgent ? 'text-foreground' : 'text-muted-foreground'
                }`}
              >
                {queue.value}
              </div>
              <div className="mt-1 text-sm text-muted-foreground">{queue.label}</div>
            </Link>
          ))}
        </div>
      </section>

      <section aria-labelledby="totals-heading">
        <h2 id="totals-heading" className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Totals
        </h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-3">
          <Stat label="Customers" value={String(stats.customers)} />
          <Stat label="Dishes on the menu" value={String(stats.dishes)} href="/admin/menu" />
          <Stat
            label="Revenue from completed orders"
            value={formatPrice(stats.completedRevenue)}
          />
        </div>
      </section>
    </div>
  )
}

function Stat({ label, value, href }: { label: string; value: string; href?: string }) {
  const body = (
    <>
      <div className="font-display text-2xl font-semibold tabular-nums">{value}</div>
      <div className="mt-1 text-sm text-muted-foreground">{label}</div>
    </>
  )

  return href ? (
    <Link
      href={href}
      className="rounded-xl border border-border bg-card p-5 transition-colors hover:border-foreground/30"
    >
      {body}
    </Link>
  ) : (
    <div className="rounded-xl border border-border bg-card p-5">{body}</div>
  )
}
