/**
 * Small presentational pieces shared across the dashboard pages.
 *
 * Server components — they render markup and nothing else, so they carry no
 * client bundle cost.
 */

export function PageHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div>
      <h1 className="font-display text-3xl font-semibold">{title}</h1>
      {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
    </div>
  )
}

export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-xl border border-dashed border-border bg-card/50 p-10 text-center">
      <p className="font-medium">{title}</p>
      <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">{body}</p>
    </div>
  )
}

/** Wide tables scroll inside their own container rather than the page. */
export function Table({
  head,
  children,
}: {
  head: readonly string[]
  children: React.ReactNode
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-card">
      <table className="w-full min-w-[46rem] text-left">
        <thead>
          <tr className="text-xs uppercase tracking-wide text-muted-foreground">
            {head.map((cell) => (
              <th key={cell} scope="col" className="px-4 py-3 font-semibold">
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  )
}
