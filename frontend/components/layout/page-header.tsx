import { Breadcrumbs, type Crumb } from '@/components/shared/breadcrumbs'

/**
 * The standard interior-page opener: a durbar band carrying the breadcrumb
 * trail, the h1 and an optional lede.
 */
export function PageHeader({
  eyebrow,
  title,
  lede,
  trail,
  children,
}: {
  eyebrow?: string
  title: string
  lede?: string
  trail: Crumb[]
  children?: React.ReactNode
}) {
  return (
    <section className="relative overflow-hidden border-b border-gold-400/25 bg-maroon-950">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-durbar" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-jaali text-gold-300" />

      {/* Arcade silhouette along the bottom edge. */}
      <svg
        aria-hidden="true"
        viewBox="0 0 1200 80"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-10 w-full text-gold-400/20"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        {Array.from({ length: 12 }).map((_, i) => (
          <path key={i} d={`M${i * 100 + 6},80 L${i * 100 + 6},46 C${i * 100 + 6},22 ${i * 100 + 28},8 ${i * 100 + 50},8 C${i * 100 + 72},8 ${i * 100 + 94},22 ${i * 100 + 94},46 L${i * 100 + 94},80`} />
        ))}
      </svg>

      <div className="container-royal relative py-10 sm:py-14">
        <Breadcrumbs trail={trail} className="mb-7 [&_a]:text-sand-300 [&_a:hover]:text-gold-300 [&_span]:text-sand-100 [&_svg]:text-sand-400" />

        {eyebrow && (
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-gold-300">
            {eyebrow}
          </p>
        )}

        <h1 className="text-display-md font-bold text-sand-50">{title}</h1>

        {lede && (
          <p className="measure mt-5 text-base leading-relaxed text-sand-200/90 sm:text-lg">
            {lede}
          </p>
        )}

        {children && <div className="mt-7">{children}</div>}
      </div>
    </section>
  )
}
