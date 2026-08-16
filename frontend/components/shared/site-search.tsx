'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, CornerDownLeft, Flame, Crown, X } from 'lucide-react'
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { allMenuItems } from '@/content/menu'
import { posts } from '@/content/blog'
import { services } from '@/content/services'
import { formatPrice } from '@/lib/site'
import { track } from '@/lib/analytics'
import { cn } from '@/lib/utils'

type Result = {
  id: string
  title: string
  subtitle: string
  href: string
  group: 'Dishes' | 'Services' | 'Journal' | 'Pages'
  price?: number
  spice?: number
  chefSpecial?: boolean
}

/** Everything searchable, built once at module scope. */
const INDEX: Result[] = [
  ...allMenuItems.map((item) => ({
    id: `dish-${item.name}`,
    title: item.name,
    subtitle: `${item.category} · ${item.description}`,
    href: `/menu?q=${encodeURIComponent(item.name)}#${item.categorySlug}`,
    group: 'Dishes' as const,
    price: item.price,
    spice: item.spice,
    chefSpecial: item.chefSpecial,
  })),
  ...services.map((s) => ({
    id: `service-${s.slug}`,
    title: s.name,
    subtitle: s.short,
    href: `/services/${s.slug}`,
    group: 'Services' as const,
  })),
  ...posts.map((p) => ({
    id: `post-${p.slug}`,
    title: p.title,
    subtitle: p.excerpt,
    href: `/blog/${p.slug}`,
    group: 'Journal' as const,
  })),
  { id: 'page-menu', title: 'Full Menu', subtitle: 'Every dish, all nine sections', href: '/menu', group: 'Pages' },
  { id: 'page-reserve', title: 'Book a Table', subtitle: 'Confirmed by call within 15 minutes', href: '/reserve', group: 'Pages' },
  { id: 'page-order', title: 'Order Online', subtitle: 'Delivery in 35–45 minutes', href: '/order', group: 'Pages' },
  { id: 'page-about', title: 'Our Story', subtitle: 'The kitchen and the people in it', href: '/about', group: 'Pages' },
  { id: 'page-gallery', title: 'Gallery', subtitle: 'The room, before and after', href: '/gallery', group: 'Pages' },
  { id: 'page-stories', title: 'Event Stories', subtitle: 'Catering and banquet case studies', href: '/stories', group: 'Pages' },
  { id: 'page-faq', title: 'Questions', subtitle: 'The five we are asked most', href: '/faq', group: 'Pages' },
  { id: 'page-contact', title: 'Contact & Directions', subtitle: 'Rama Park Road, Uttam Nagar', href: '/contact', group: 'Pages' },
]

/** Token-prefix match, ranked so title hits beat description hits. */
function search(query: string): Result[] {
  const q = query.trim().toLowerCase()
  if (q.length < 2) return []
  const terms = q.split(/\s+/)

  return INDEX.map((entry) => {
    const title = entry.title.toLowerCase()
    const subtitle = entry.subtitle.toLowerCase()
    let score = 0

    for (const term of terms) {
      if (title === term) score += 100
      else if (title.startsWith(term)) score += 50
      else if (title.includes(term)) score += 25
      else if (subtitle.includes(term)) score += 8
      else return null // every term must match somewhere
    }
    if (entry.group === 'Dishes') score += 4 // dishes are what people search for
    return { entry, score }
  })
    .filter((r): r is { entry: Result; score: number } => r !== null)
    .sort((a, b) => b.score - a.score)
    .slice(0, 12)
    .map((r) => r.entry)
}

export function SiteSearch({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const router = useRouter()
  const [query, setQuery] = React.useState('')
  const [active, setActive] = React.useState(0)
  const listId = React.useId()

  const results = React.useMemo(() => search(query), [query])

  React.useEffect(() => setActive(0), [query])

  React.useEffect(() => {
    if (!open) {
      // Reset when the panel closes so the next open starts clean.
      const t = setTimeout(() => setQuery(''), 180)
      return () => clearTimeout(t)
    }
  }, [open])

  // Report what people looked for and whether we had it (feature 19).
  React.useEffect(() => {
    if (query.trim().length < 3) return
    const t = setTimeout(() => track('site_search', { search_term: query, results: results.length }), 700)
    return () => clearTimeout(t)
  }, [query, results.length])

  const go = React.useCallback(
    (href: string) => {
      onOpenChange(false)
      router.push(href)
    },
    [onOpenChange, router]
  )

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (results.length === 0) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((i) => (i + 1) % results.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((i) => (i - 1 + results.length) % results.length)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      go(results[active].href)
    }
  }

  const grouped = results.reduce<Record<string, Result[]>>((acc, r) => {
    ;(acc[r.group] ??= []).push(r)
    return acc
  }, {})

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        hideClose
        className="top-[12%] max-w-2xl translate-y-0 p-0"
        aria-label="Search the site"
      >
        <DialogTitle className="sr-only">Search Morsaab’s</DialogTitle>
        <DialogDescription className="sr-only">
          Search dishes, services, journal posts and pages. Use arrow keys to move
          through results and Enter to open one.
        </DialogDescription>

        <div className="flex items-center gap-3 border-b border-border px-5">
          <Search className="size-5 shrink-0 text-gold-500" aria-hidden="true" />
          {/* eslint-disable-next-line jsx-a11y/no-autofocus -- the dialog exists to receive this input */}
          <input
            autoFocus
            type="search"
            role="combobox"
            aria-expanded={results.length > 0}
            aria-controls={listId}
            aria-autocomplete="list"
            aria-label="Search dishes, services and pages"
            placeholder="Search paneer, dosa, lassi, catering…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            className="min-h-14 w-full bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground/70 [&::-webkit-search-cancel-button]:hidden"
          />
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            aria-label="Close search"
            className="grid size-11 shrink-0 cursor-pointer place-items-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>

        <div className="max-h-[min(28rem,55dvh)] overflow-y-auto p-2" id={listId} role="listbox">
          {query.trim().length < 2 ? (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">
              <p className="mb-4">Try a dish, a section or a service.</p>
              <div className="flex flex-wrap justify-center gap-2">
                {['Paneer', 'Dosa', 'Thali', 'Lassi', 'Catering'].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setQuery(s)}
                    className="cursor-pointer rounded-full border border-gold-400/40 px-3 py-1.5 text-xs font-semibold text-gold-700 transition-colors hover:bg-gold-400/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring dark:text-gold-300"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="px-4 py-10 text-center">
              <p className="font-display text-lg text-foreground">Nothing matched “{query}”</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Try a shorter word, or{' '}
                <Link href="/menu" className="underline underline-offset-4" onClick={() => onOpenChange(false)}>
                  browse the full menu
                </Link>
                .
              </p>
            </div>
          ) : (
            Object.entries(grouped).map(([group, items]) => (
              <div key={group} className="mb-1">
                <p className="px-3 pb-1 pt-3 text-[0.7rem] font-semibold uppercase tracking-widest text-muted-foreground">
                  {group}
                </p>
                {items.map((r) => {
                  const index = results.indexOf(r)
                  const isActive = index === active
                  return (
                    <button
                      key={r.id}
                      type="button"
                      role="option"
                      aria-selected={isActive}
                      onMouseEnter={() => setActive(index)}
                      onClick={() => go(r.href)}
                      className={cn(
                        'flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors',
                        isActive ? 'bg-gold-400/15' : 'hover:bg-muted'
                      )}
                    >
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-2">
                          <span className="truncate font-semibold text-foreground">{r.title}</span>
                          {r.chefSpecial && (
                            <Crown className="size-3.5 shrink-0 text-gold-500" aria-label="Chef's special" />
                          )}
                          {typeof r.spice === 'number' && r.spice >= 3 && (
                            <Flame className="size-3.5 shrink-0 text-maroon-600" aria-label="Fiery" />
                          )}
                        </span>
                        <span className="mt-0.5 block truncate text-sm text-muted-foreground">
                          {r.subtitle}
                        </span>
                      </span>
                      {r.price != null && (
                        <span className="tnum shrink-0 font-semibold text-maroon-700 dark:text-gold-300">
                          {formatPrice(r.price)}
                        </span>
                      )}
                      {isActive && (
                        <CornerDownLeft className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                      )}
                    </button>
                  )
                })}
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

/** Registers ⌘K / Ctrl-K and "/" as shortcuts for opening search. */
export function useSearchHotkey(onOpen: () => void) {
  React.useEffect(() => {
    function handler(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null
      const typing =
        target?.tagName === 'INPUT' ||
        target?.tagName === 'TEXTAREA' ||
        target?.isContentEditable
      if (typing) return

      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || e.key === '/') {
        e.preventDefault()
        onOpen()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onOpen])
}
