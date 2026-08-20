import { listReservations } from '@/lib/db/queries'
import { StatusSelect } from '../_components/status-select'
import { EmptyState, PageHeading, Table } from '../_components/ui'
import { requireAdminOrNull } from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'

export default async function AdminReservationsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; all?: string }>
}) {
  // Resource-level gate. The layout's refusal only hides the UI; without this
  // the page still runs and its rows travel in the RSC payload. See
  // requireAdminOrNull.
  if (!(await requireAdminOrNull())) return null

  const params = await searchParams
  const showPast = params.all === '1'

  const rows = await listReservations({
    // Default to today onwards: yesterday's bookings are not work.
    fromDate: showPast ? undefined : new Date().toISOString().slice(0, 10),
  })

  return (
    <div className="space-y-6">
      <PageHeading
        title="Reservations"
        subtitle={
          showPast
            ? `${rows.length} bookings, including past dates.`
            : `${rows.length} upcoming ${rows.length === 1 ? 'booking' : 'bookings'}.`
        }
      />

      <nav aria-label="Filter by date" className="flex gap-2">
        <a
          href="/admin/reservations"
          aria-current={!showPast ? 'page' : undefined}
          className={`rounded-full border px-3 py-1 text-sm transition-colors ${
            !showPast
              ? 'border-foreground bg-foreground text-background'
              : 'border-border text-muted-foreground hover:border-foreground/40'
          }`}
        >
          Upcoming
        </a>
        <a
          href="/admin/reservations?all=1"
          aria-current={showPast ? 'page' : undefined}
          className={`rounded-full border px-3 py-1 text-sm transition-colors ${
            showPast
              ? 'border-foreground bg-foreground text-background'
              : 'border-border text-muted-foreground hover:border-foreground/40'
          }`}
        >
          All dates
        </a>
      </nav>

      {rows.length === 0 ? (
        <EmptyState
          title="No reservations"
          body="Table bookings made on the website appear here, soonest first."
        />
      ) : (
        <Table head={['Reference', 'Guest', 'When', 'Guests', 'Occasion', 'Status']}>
          {rows.map((booking) => (
            <tr key={booking.id} className="border-t border-border">
              <td className="px-4 py-3 font-mono text-xs">{booking.reference}</td>
              <td className="px-4 py-3">
                <div className="font-medium">{booking.name}</div>
                <a
                  href={`tel:+91${booking.phone}`}
                  className="text-xs text-muted-foreground underline underline-offset-2"
                >
                  {booking.phone}
                </a>
              </td>
              <td className="px-4 py-3 text-sm">
                {new Date(`${booking.date}T00:00:00`).toLocaleDateString('en-IN', {
                  weekday: 'short',
                  day: 'numeric',
                  month: 'short',
                })}{' '}
                <span className="text-muted-foreground">{booking.time}</span>
              </td>
              <td className="px-4 py-3 tabular-nums">{booking.guests}</td>
              <td className="px-4 py-3 text-sm text-muted-foreground">
                {booking.occasion || '—'}
              </td>
              <td className="px-4 py-3">
                <StatusSelect
                  kind="reservation"
                  id={booking.id}
                  value={booking.status}
                  label={`Status for booking ${booking.reference}`}
                />
              </td>
            </tr>
          ))}
        </Table>
      )}
    </div>
  )
}
