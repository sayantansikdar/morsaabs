import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'
import { breadcrumbSchema } from '@/lib/schema'
import { JsonLd } from '@/components/shared/json-ld'
import { cn } from '@/lib/utils'

export type Crumb = { name: string; href: string }

/**
 * Feature 5 — breadcrumbs for interior pages, with the matching BreadcrumbList
 * schema emitted alongside so the trail can appear in the search result too.
 *
 * The last crumb is the current page: it is plain text with aria-current rather
 * than a link to where the visitor already is.
 */
export function Breadcrumbs({ trail, className }: { trail: Crumb[]; className?: string }) {
  const full: Crumb[] = [{ name: 'Home', href: '/' }, ...trail]

  return (
    <>
      <JsonLd data={breadcrumbSchema(full)} />
      <nav aria-label="Breadcrumb" className={cn('w-full', className)}>
        <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm text-muted-foreground">
          {full.map((crumb, i) => {
            const isLast = i === full.length - 1
            return (
              <li key={crumb.href} className="flex items-center gap-1.5">
                {i > 0 && (
                  <ChevronRight className="size-3.5 shrink-0 opacity-60" aria-hidden="true" />
                )}
                {isLast ? (
                  <span aria-current="page" className="font-semibold text-foreground">
                    {crumb.name}
                  </span>
                ) : (
                  <Link
                    href={crumb.href}
                    className="inline-flex items-center gap-1 rounded transition-colors hover:text-maroon-700 hover:underline hover:underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring dark:hover:text-gold-300"
                  >
                    {i === 0 && <Home className="size-3.5" aria-hidden="true" />}
                    {crumb.name}
                  </Link>
                )}
              </li>
            )
          })}
        </ol>
      </nav>
    </>
  )
}
