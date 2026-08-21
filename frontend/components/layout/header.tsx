'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, Phone, Search, ShoppingBag, X, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/shared/theme-toggle'
import { SiteSearch, useSearchHotkey } from '@/components/shared/site-search'
import { useCart } from '@/components/cart-provider'
import { primaryNav, serviceNav } from '@/lib/nav'
import { site } from '@/lib/site'
import { track } from '@/lib/analytics'
import { cn } from '@/lib/utils'
import { BrandLogo } from '@/components/layout/brand-logo'

export function Header() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = React.useState(false)
  const [menuOpen, setMenuOpen] = React.useState(false)
  const [searchOpen, setSearchOpen] = React.useState(false)
  const { count, hydrated } = useCart()

  useSearchHotkey(React.useCallback(() => setSearchOpen(true), []))

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close the drawer on navigation — otherwise it hangs over the new page.
  React.useEffect(() => setMenuOpen(false), [pathname])

  // The drawer is a modal surface: the page behind it must not scroll.
  React.useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`)

  return (
    <>
      <header
        data-print="hide"
        className={cn(
          // Feature 31 — sticky on every viewport, not just desktop.
          'fixed inset-x-0 top-0 z-50 transition-all duration-300',
          scrolled
            ? 'border-b border-gold-400/25 bg-background/92 shadow-royal backdrop-blur-md supports-[backdrop-filter]:bg-background/80'
            : 'bg-gradient-to-b from-maroon-950/55 to-transparent'
        )}
      >
        <div className="container-royal flex h-[var(--header-h)] items-center justify-between gap-3">
          {/* Wordmark */}
          <Link
            href="/"
            className="group flex shrink-0 items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {/* The badge carries the wordmark, so it stands alone — repeating
                "Morsaab's" beside it would set the name twice. */}
            <BrandLogo
              className={cn(
                'h-11 w-auto transition-transform duration-300 group-hover:scale-[1.03] sm:h-12',
                scrolled ? '' : 'drop-shadow-[0_1px_6px_rgba(0,0,0,0.35)]'
              )}
              title={`${site.name} — home`}
            />
          </Link>

          {/* Desktop navigation */}
          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {primaryNav.map((item) => (
                <li key={item.href} className="relative">
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? 'page' : undefined}
                    className={cn(
                      'relative inline-flex min-h-11 items-center rounded-full px-3.5 text-sm font-semibold transition-colors',
                      scrolled
                        ? 'text-foreground/85 hover:text-maroon-700 dark:hover:text-gold-300'
                        : 'text-sand-100/90 hover:text-white',
                      isActive(item.href) && (scrolled ? 'text-maroon-700 dark:text-gold-300' : 'text-gold-300')
                    )}
                  >
                    {item.label}
                    {isActive(item.href) && (
                      <motion.span
                        layoutId="nav-underline"
                        className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-gold-400"
                        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                      />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Actions */}
          <div className="flex shrink-0 items-center gap-1.5">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search the menu and site"
              title="Search (⌘K)"
              className={cn(
                'grid size-11 cursor-pointer place-items-center rounded-full border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                scrolled
                  ? 'border-gold-400/40 text-gold-600 hover:bg-gold-400/15 dark:text-gold-300'
                  : 'border-white/25 text-sand-50 hover:bg-white/15'
              )}
            >
              <Search className="size-5" aria-hidden="true" />
            </button>

            <Link
              href="/order"
              aria-label={
                hydrated && count > 0
                  ? `Your order — ${count} ${count === 1 ? 'item' : 'items'}`
                  : 'Your order'
              }
              className={cn(
                'relative grid size-11 cursor-pointer place-items-center rounded-full border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                scrolled
                  ? 'border-gold-400/40 text-gold-600 hover:bg-gold-400/15 dark:text-gold-300'
                  : 'border-white/25 text-sand-50 hover:bg-white/15'
              )}
            >
              <ShoppingBag className="size-5" aria-hidden="true" />
              {hydrated && count > 0 && (
                <span className="tnum absolute -right-0.5 -top-0.5 grid min-w-5 place-items-center rounded-full bg-maroon-600 px-1 text-[0.65rem] font-bold text-white">
                  {count > 99 ? '99+' : count}
                </span>
              )}
            </Link>

            <ThemeToggle
              className={cn(!scrolled && 'border-white/25 text-sand-50 hover:bg-white/15')}
            />

            <Button
              asChild
              variant="gold"
              size="sm"
              className="ml-1 hidden xl:inline-flex"
              onClick={() => track('cta_click', { location: 'header', action: 'reserve' })}
            >
              <Link href="/reserve">Book Table</Link>
            </Button>

            {/* Mobile drawer trigger */}
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-drawer"
              className={cn(
                'grid size-11 cursor-pointer place-items-center rounded-full border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:hidden',
                scrolled
                  ? 'border-gold-400/40 text-gold-600 hover:bg-gold-400/15 dark:text-gold-300'
                  : 'border-white/25 text-sand-50 hover:bg-white/15'
              )}
            >
              <Menu className="size-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      <MobileDrawer open={menuOpen} onClose={() => setMenuOpen(false)} isActive={isActive} />
      <SiteSearch open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  )
}

/* --------------------------------------------------- Mobile slide-out ---- */

function MobileDrawer({
  open,
  onClose,
  isActive,
}: {
  open: boolean
  onClose: () => void
  isActive: (href: string) => boolean
}) {
  const panelRef = React.useRef<HTMLDivElement>(null)

  // Focus moves into the drawer when it opens, and Escape closes it.
  React.useEffect(() => {
    if (!open) return
    const previous = document.activeElement as HTMLElement | null
    panelRef.current?.querySelector<HTMLElement>('a, button')?.focus()

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
      if (e.key !== 'Tab' || !panelRef.current) return
      // Simple focus trap: cycle within the panel while it is open.
      const focusables = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])'
      )
      if (focusables.length === 0) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      previous?.focus()
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-[90] bg-maroon-950/70 backdrop-blur-sm lg:hidden"
            aria-hidden="true"
          />
          <motion.div
            ref={panelRef}
            id="mobile-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 380, damping: 40 }}
            className="fixed inset-y-0 right-0 z-[91] flex w-[min(22rem,88vw)] flex-col border-l border-gold-400/30 bg-background shadow-royal-lg lg:hidden"
          >
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <span className="font-display text-lg font-bold text-foreground">Menu</span>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close navigation menu"
                className="grid size-11 cursor-pointer place-items-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <X className="size-5" aria-hidden="true" />
              </button>
            </div>

            <nav aria-label="Mobile" className="flex-1 overflow-y-auto overscroll-contain px-3 py-4">
              <ul className="space-y-1">
                {primaryNav.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={isActive(item.href) ? 'page' : undefined}
                      className={cn(
                        'flex min-h-14 items-center justify-between gap-3 rounded-xl px-4 transition-colors',
                        isActive(item.href)
                          ? 'bg-gold-400/15 text-maroon-700 dark:text-gold-300'
                          : 'text-foreground hover:bg-muted'
                      )}
                    >
                      <span>
                        <span className="block font-semibold">{item.label}</span>
                        {item.description && (
                          <span className="block text-xs text-muted-foreground">{item.description}</span>
                        )}
                      </span>
                      <ChevronRight className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>

              <p className="px-4 pb-2 pt-6 text-[0.7rem] font-semibold uppercase tracking-widest text-muted-foreground">
                Our Services
              </p>
              <ul className="space-y-1">
                {serviceNav.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="flex min-h-12 items-center rounded-xl px-4 text-sm text-foreground/85 transition-colors hover:bg-muted"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="space-y-2 border-t border-border p-4">
              <Button asChild variant="gold" size="lg" className="w-full">
                <Link href="/reserve">Book a Table</Link>
              </Button>
              <Button asChild variant="primary" size="lg" className="w-full">
                <Link href="/order">Order Online</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full">
                <a href={`tel:${site.phone}`} onClick={() => track('call_click', { location: 'drawer' })}>
                  <Phone aria-hidden="true" />
                  {site.phoneDisplay}
                </a>
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

/* ------------------------------------------------------------- Crest ---- */

/** The house crest: a domed jharokha arch over a lamp. */
export function Crest({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M6 35V19C6 11.8 12 6 20 3c8 3 14 8.8 14 16v16" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13 35V21a7 7 0 0 1 14 0v14" strokeLinecap="round" />
      <circle cx="20" cy="22" r="2.6" fill="currentColor" stroke="none" />
      <path d="M20 3v-2M3 35h34" strokeLinecap="round" />
    </svg>
  )
}
