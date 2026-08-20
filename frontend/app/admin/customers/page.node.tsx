import { listCustomers } from '@/lib/db/queries'
import { formatPrice } from '@/lib/site'
import { EmptyState, PageHeading, Table } from '../_components/ui'
import { requireAdminOrNull } from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'

/**
 * The CRM list. Ordered by most recent order, because the useful question is
 * "who has been in lately", not "who registered first".
 */
export default async function AdminCustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  // Resource-level gate. The layout's refusal only hides the UI; without this
  // the page still runs and its rows travel in the RSC payload. See
  // requireAdminOrNull.
  if (!(await requireAdminOrNull())) return null

  const { q } = await searchParams
  const rows = await listCustomers({ search: q })

  return (
    <div className="space-y-6">
      <PageHeading
        title="Customers"
        subtitle="Built automatically from orders and bookings — matched on phone number."
      />

      <form method="get" className="flex gap-2">
        <input
          type="search"
          name="q"
          defaultValue={q ?? ''}
          placeholder="Search by name or phone"
          aria-label="Search customers"
          className="w-full max-w-sm rounded-md border border-border bg-background px-3 py-2 text-sm"
        />
        <button
          type="submit"
          className="rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-muted"
        >
          Search
        </button>
      </form>

      {rows.length === 0 ? (
        <EmptyState
          title={q ? 'Nobody matched that search' : 'No customers yet'}
          body={
            q
              ? 'Try a different name or phone number.'
              : 'A customer record is created the first time someone orders or books a table.'
          }
        />
      ) : (
        <Table head={['Name', 'Phone', 'Orders', 'Lifetime spend', 'Last order']}>
          {rows.map((customer) => (
            <tr key={customer.id} className="border-t border-border">
              <td className="px-4 py-3">
                <div className="font-medium">{customer.name}</div>
                {customer.email && (
                  <div className="text-xs text-muted-foreground">{customer.email}</div>
                )}
              </td>
              <td className="px-4 py-3">
                <a
                  href={`tel:+91${customer.phone}`}
                  className="text-sm underline underline-offset-2"
                >
                  {customer.phone}
                </a>
              </td>
              <td className="px-4 py-3 tabular-nums">{customer.orderCount}</td>
              <td className="px-4 py-3 tabular-nums">{formatPrice(customer.totalSpend)}</td>
              <td className="px-4 py-3 text-sm text-muted-foreground">
                {customer.lastOrderAt
                  ? new Date(customer.lastOrderAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })
                  : '—'}
              </td>
            </tr>
          ))}
        </Table>
      )}
    </div>
  )
}
