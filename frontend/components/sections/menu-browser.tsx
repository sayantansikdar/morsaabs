'use client'

import * as React from 'react'
import { useSearchParams } from 'next/navigation'
import { Search, X, Printer, Flame, Crown, Leaf } from 'lucide-react'
import { DishCard } from '@/components/shared/dish-card'
import { Button } from '@/components/ui/button'
import { menu as bundledMenu, type MenuCategory } from '@/content/menu'
import { track } from '@/lib/analytics'
import { cn } from '@/lib/utils'

type Filter = 'all' | 'chefSpecial' | 'vegan' | 'mild'

const FILTERS: { id: Filter; label: string; icon?: typeof Crown }[] = [
  { id: 'all', label: 'Everything' },
  { id: 'chefSpecial', label: 'Chef’s picks', icon: Crown },
  { id: 'vegan', label: 'Vegan', icon: Leaf },
  { id: 'mild', label: 'Not spicy', icon: Flame },
]

/**
 * The full carte, with an in-page filter.
 *
 * Filtering happens on already-rendered data, so results are instant and the
 * page still ships every dish in the server HTML for crawlers.
 */
export function MenuBrowser({ menu = bundledMenu }: { menu?: MenuCategory[] } = {}) {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') ?? ''

  const [query, setQuery] = React.useState(initialQuery)
  const [filter, setFilter] = React.useState<Filter>('all')
  const inputRef = React.useRef<HTMLInputElement>(null)

  const q = query.trim().toLowerCase()

  const filtered = React.useMemo(
    () =>
      menu
        .map((category) => ({
          ...category,
          items: category.items.filter((item) => {
            if (q && !`${item.name} ${item.description}`.toLowerCase().includes(q)) return false
            if (filter === 'chefSpecial' && !item.chefSpecial) return false
            if (filter === 'vegan' && !item.vegan) return false
            if (filter === 'mild' && item.spice > 1) return false
            return true
          }),
        }))
        .filter((category) => category.items.length > 0),
    // `menu` belongs here now that it arrives as a prop — it used to be a
    // module import that could never change, and omitting it would show a
    // stale carte after an edit.
    [menu, q, filter]
  )

  const total = filtered.reduce((n, c) => n + c.items.length, 0)
  const isFiltering = q.length > 0 || filter !== 'all'

  React.useEffect(() => {
    if (q.length < 3) return
    const t = setTimeout(() => track('menu_filter', { search_term: q, results: total }), 700)
    return () => clearTimeout(t)
  }, [q, total])

  return (
    <>
      {/* Controls. Sticks below the header so filters stay reachable while
          scrolling a long menu, and is dropped entirely from print. */}
      <div
        data-print="hide"
        className="sticky top-[var(--header-h)] z-30 border-b border-gold-400/20 bg-background/95 py-4 backdrop-blur-md"
      >
        <div className="container-royal space-y-3">
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-gold-500"
              aria-hidden="true"
            />
            <label htmlFor="menu-search" className="sr-only">
              Search the menu
            </label>
            <input
              id="menu-search"
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search paneer, dosa, chilli, lassi…"
              className="min-h-12 w-full rounded-full border border-input bg-card pl-12 pr-12 text-base text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-ring [&::-webkit-search-cancel-button]:hidden"
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery('')
                  inputRef.current?.focus()
                }}
                aria-label="Clear search"
                className="absolute right-1.5 top-1/2 grid size-10 -translate-y-1/2 cursor-pointer place-items-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div role="group" aria-label="Filter dishes" className="flex flex-wrap gap-2">
              {FILTERS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFilter(f.id)}
                  aria-pressed={filter === f.id}
                  className={cn(
                    'inline-flex min-h-11 cursor-pointer items-center gap-1.5 rounded-full border px-4 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                    filter === f.id
                      ? 'border-maroon-700 bg-maroon-700 text-sand-50'
                      : 'border-gold-400/35 text-foreground/85 hover:border-gold-400 hover:bg-gold-400/10'
                  )}
                >
                  {f.icon && <f.icon className="size-3.5" aria-hidden="true" />}
                  {f.label}
                </button>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                track('menu_print')
                window.print()
              }}
            >
              <Printer aria-hidden="true" />
              Print menu
            </Button>
          </div>

          {/* Result count, announced when it changes. */}
          <p aria-live="polite" className="text-sm text-muted-foreground">
            {isFiltering ? (
              <>
                Showing <span className="tnum font-semibold text-foreground">{total}</span>{' '}
                {total === 1 ? 'dish' : 'dishes'}
                {q && <> matching “{query}”</>}
                {total === 0 && ' — try a shorter word.'}
              </>
            ) : (
              <>
                <span className="tnum font-semibold text-foreground">{total}</span> dishes
                across {menu.length} sections
              </>
            )}
          </p>
        </div>
      </div>

      {/* Category jump links */}
      <nav aria-label="Menu sections" data-print="hide" className="border-b border-border py-4">
        <div className="container-royal">
          <ul className="flex flex-wrap gap-2">
            {menu.map((category) => {
              const available = filtered.some((c) => c.slug === category.slug)
              return (
                <li key={category.slug}>
                  <a
                    href={`#${category.slug}`}
                    aria-disabled={!available}
                    className={cn(
                      'inline-flex min-h-10 items-center rounded-full border px-3.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                      available
                        ? 'border-gold-400/30 text-foreground/85 hover:border-gold-400 hover:bg-gold-400/10'
                        : 'pointer-events-none border-border text-muted-foreground/40'
                    )}
                  >
                    {category.name}
                  </a>
                </li>
              )
            })}
          </ul>
        </div>
      </nav>

      <div className="container-royal py-12">
        {filtered.length === 0 ? (
          <div className="py-20 text-center">
            <p className="font-display text-2xl font-bold text-foreground">
              Nothing matched that
            </p>
            <p className="measure mx-auto mt-3 text-muted-foreground">
              Try a shorter word — “paneer” rather than “paneer butter masala” — or clear
              the filters to see everything.
            </p>
            <Button
              variant="primary"
              className="mt-6"
              onClick={() => {
                setQuery('')
                setFilter('all')
              }}
            >
              Show the whole menu
            </Button>
          </div>
        ) : (
          <div className="space-y-16">
            {filtered.map((category) => (
              <section
                key={category.slug}
                id={category.slug}
                aria-labelledby={`${category.slug}-title`}
                data-print="category"
                className="scroll-mt-40"
              >
                <div className="mb-8">
                  <h2
                    id={`${category.slug}-title`}
                    className="font-display text-display-sm font-bold text-foreground"
                  >
                    {category.name}
                  </h2>
                  <p className="measure mt-2 text-muted-foreground">{category.blurb}</p>
                  <div aria-hidden="true" className="rule-gilt mt-5" />
                </div>

                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {category.items.map((item) => (
                    <DishCard key={item.name} item={item} categorySlug={category.slug} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
