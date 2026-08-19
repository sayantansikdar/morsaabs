import { listOrders, type OrderStatus } from '@/lib/db/queries'
import { formatPrice } from '@/lib/site'
import { StatusSelect } from '../_components/status-select'
import { EmptyState, PageHeading, Table } from '../_components/ui'

export const dynamic = 'force-dynamic'

const STATUSES: OrderStatus[] = [
  'pending',
  'confirmed',
  'preparing',
  'out_for_delivery',
  'completed',
  'cancelled',
]

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>
}) {
  const params = await searchParams
  const status = STATUSES.includes(params.status as OrderStatus)
    ? (params.status as OrderStatus)
    : undefined

  const rows = await listOrders({ status, search: params.q })

  return (
    <div className="space-y-6">
      <PageHeading
        title="Orders"
        subtitle={`${rows.length} ${rows.length === 1 ? 'order' : 'orders'}${status ? ` with status “${status.replace(/_/g, ' ')}”` : ''}.`}
      />

      <FilterBar current={status} basePath="/admin/orders" statuses={STATUSES} />

      {rows.length === 0 ? (
        <EmptyState
          title="No orders yet"
          body="Orders placed through the website appear here the moment they are submitted."
        />
      ) : (
        <Table head={['Reference', 'Customer', 'Type', 'Total', 'Placed', 'Status']}>
          {rows.map((order) => (
            <tr key={order.id} className="border-t border-border">
              <td className="px-4 py-3 font-mono text-xs">{order.reference}</td>
              <td className="px-4 py-3">
                <div className="font-medium">{order.name}</div>
                <a
                  href={`tel:+91${order.phone}`}
                  className="text-xs text-muted-foreground underline underline-offset-2"
                >
                  {order.phone}
                </a>
              </td>
              <td className="px-4 py-3 text-sm capitalize">{order.mode}</td>
              <td className="px-4 py-3 tabular-nums">{formatPrice(order.total)}</td>
              <td className="px-4 py-3 text-sm text-muted-foreground">
                {order.createdAt.toLocaleString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </td>
              <td className="px-4 py-3">
                <StatusSelect
                  kind="order"
                  id={order.id}
                  value={order.status}
                  label={`Status for order ${order.reference}`}
                />
              </td>
            </tr>
          ))}
        </Table>
      )}
    </div>
  )
}

function FilterBar({
  current,
  basePath,
  statuses,
}: {
  current?: string
  basePath: string
  statuses: readonly string[]
}) {
  return (
    <nav aria-label="Filter by status" className="flex flex-wrap gap-2">
      <FilterLink href={basePath} active={!current} label="All" />
      {statuses.map((status) => (
        <FilterLink
          key={status}
          href={`${basePath}?status=${status}`}
          active={current === status}
          label={status.replace(/_/g, ' ')}
        />
      ))}
    </nav>
  )
}

function FilterLink({
  href,
  active,
  label,
}: {
  href: string
  active: boolean
  label: string
}) {
  return (
    <a
      href={href}
      aria-current={active ? 'page' : undefined}
      className={`rounded-full border px-3 py-1 text-sm capitalize transition-colors ${
        active
          ? 'border-foreground bg-foreground text-background'
          : 'border-border text-muted-foreground hover:border-foreground/40'
      }`}
    >
      {label}
    </a>
  )
}
