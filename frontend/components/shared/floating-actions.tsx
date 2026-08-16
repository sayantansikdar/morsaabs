'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUp, MessageCircle, Phone, X, CalendarCheck, ShoppingBag, Mail } from 'lucide-react'
import { site } from '@/lib/site'
import { track } from '@/lib/analytics'
import { useCart } from '@/components/cart-provider'
import { cn } from '@/lib/utils'

/**
 * Feature 24 — scroll-back-to-top.
 *
 * It sits above the sticky mobile CTA bar so the two never overlap, and it
 * moves focus to the top landmark rather than only scrolling, so a keyboard
 * user actually ends up at the top of the page.
 */
export function BackToTop() {
  const [visible, setVisible] = React.useState(false)

  React.useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          data-print="hide"
          initial={{ opacity: 0, scale: 0.8, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 12 }}
          transition={{ duration: 0.18 }}
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' })
            document.getElementById('top')?.focus({ preventScroll: true })
          }}
          aria-label="Back to top of page"
          className="fixed bottom-[calc(env(safe-area-inset-bottom)+5.5rem)] left-5 z-40 grid size-12 cursor-pointer place-items-center rounded-full border border-gold-400/40 bg-card text-gold-600 shadow-royal transition-colors hover:bg-gold-400/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring dark:text-gold-300 md:bottom-8"
        >
          <ArrowUp className="size-5" aria-hidden="true" />
        </motion.button>
      )}
    </AnimatePresence>
  )
}

/**
 * Feature 40 — the floating contact button. Expands into a small speed dial so
 * one tap reaches a human by whichever channel the guest prefers.
 */
export function FloatingContact() {
  const [open, setOpen] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    function onClickAway(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onClickAway)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onClickAway)
    }
  }, [open])

  const actions = [
    {
      label: `Call ${site.phoneDisplay}`,
      short: 'Call us',
      href: `tel:${site.phone}`,
      icon: Phone,
      event: 'call_click',
    },
    {
      label: 'Chat on WhatsApp',
      short: 'WhatsApp',
      href: `https://wa.me/${site.phone.replace('+', '')}?text=${encodeURIComponent("Hello Morsaab's, I'd like to ask about ")}`,
      icon: MessageCircle,
      event: 'whatsapp_click',
      external: true,
    },
    {
      label: `Email ${site.email}`,
      short: 'Email',
      href: `mailto:${site.email}`,
      icon: Mail,
      event: 'email_click',
    },
  ]

  return (
    <div ref={ref} data-print="hide" className="fixed bottom-[calc(env(safe-area-inset-bottom)+5.5rem)] right-5 z-40 md:bottom-8">
      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.18 }}
            className="mb-3 space-y-2"
          >
            {actions.map((action, i) => (
              <motion.li
                key={action.href}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.045 }}
                className="flex justify-end"
              >
                <a
                  href={action.href}
                  {...(action.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  onClick={() => {
                    track(action.event, { location: 'floating_contact' })
                    setOpen(false)
                  }}
                  className="flex min-h-11 items-center gap-2.5 rounded-full border border-gold-400/40 bg-card px-4 text-sm font-semibold text-foreground shadow-royal transition-colors hover:bg-gold-400/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <action.icon className="size-4 text-gold-600 dark:text-gold-300" aria-hidden="true" />
                  <span>{action.short}</span>
                  <span className="sr-only">{action.label}</span>
                </a>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? 'Close contact options' : 'Contact us'}
        className="grid size-14 cursor-pointer place-items-center rounded-full bg-royal-700 text-sand-50 shadow-royal-lg transition-all hover:bg-royal-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={open ? 'close' : 'open'}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {open ? (
              <X className="size-6" aria-hidden="true" />
            ) : (
              <MessageCircle className="size-6" aria-hidden="true" />
            )}
          </motion.span>
        </AnimatePresence>
      </button>
    </div>
  )
}

/**
 * Feature 9 — sticky mobile CTA bar.
 *
 * Hidden on the pages where it would compete with the page's own primary
 * action, and it reserves its own height on <body> so nothing ends up trapped
 * underneath it.
 */
export function StickyMobileCTA() {
  const pathname = usePathname()
  const { count, subtotal, hydrated } = useCart()

  const hiddenOn = ['/order', '/reserve', '/thank-you', '/contact']
  const hidden = hiddenOn.some((p) => pathname.startsWith(p))

  if (hidden) return null

  return (
    <div
      data-print="hide"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-gold-400/30 bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden"
    >
      <div className="grid grid-cols-3 gap-2 p-2.5">
        <a
          href={`tel:${site.phone}`}
          onClick={() => track('call_click', { location: 'sticky_bar' })}
          className="flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-xl border border-gold-400/40 text-xs font-semibold text-foreground transition-colors hover:bg-gold-400/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Phone className="size-4 text-gold-600 dark:text-gold-300" aria-hidden="true" />
          Call
        </a>
        <Link
          href="/reserve"
          onClick={() => track('cta_click', { location: 'sticky_bar', action: 'reserve' })}
          className="flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-xl bg-royal-700 text-xs font-semibold text-sand-50 transition-colors hover:bg-royal-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <CalendarCheck className="size-4" aria-hidden="true" />
          Book Table
        </Link>
        <Link
          href="/order"
          onClick={() => track('cta_click', { location: 'sticky_bar', action: 'order' })}
          className="relative flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-xl bg-maroon-700 text-xs font-semibold text-sand-50 transition-colors hover:bg-maroon-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ShoppingBag className="size-4" aria-hidden="true" />
          {hydrated && count > 0 ? (
            <span className="tnum">₹{subtotal.toLocaleString('en-IN')}</span>
          ) : (
            'Order Now'
          )}
          {hydrated && count > 0 && (
            <span className="tnum absolute right-1.5 top-1.5 grid min-w-4 place-items-center rounded-full bg-gold-400 px-1 text-[0.6rem] font-bold text-maroon-950">
              {count}
            </span>
          )}
        </Link>
      </div>
    </div>
  )
}

/** Feature 32 — the skip link, visible only when it has focus. */
export function SkipLink() {
  return (
    <a
      href="#main"
      className={cn(
        'sr-only z-[100] focus:not-sr-only focus:fixed focus:left-4 focus:top-4',
        'focus:rounded-full focus:bg-maroon-700 focus:px-5 focus:py-3 focus:font-semibold focus:text-sand-50 focus:shadow-royal-lg focus:outline-none focus:ring-2 focus:ring-gold-400'
      )}
    >
      Skip to main content
    </a>
  )
}
