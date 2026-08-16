'use client'

import * as React from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { Cookie } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ACCEPT_ALL, REJECT_ALL, readConsent, writeConsent, CONSENT_EVENT } from '@/lib/consent'

/**
 * Features 22 + 56 — a small, non-intrusive consent bar.
 *
 * It anchors to the bottom-left rather than blocking the page, gives Accept and
 * Decline equal visual weight (a "reject" that is harder to find is not a real
 * choice), and never appears again once a decision is stored.
 */
export function CookieBanner() {
  const [visible, setVisible] = React.useState(false)

  React.useEffect(() => {
    // Delay slightly so the banner does not compete with first paint.
    const t = setTimeout(() => setVisible(readConsent() === null), 900)

    // The privacy page can clear the decision and bring this back.
    const onChange = (e: Event) => {
      const detail = (e as CustomEvent).detail
      setVisible(detail === null)
    }
    window.addEventListener(CONSENT_EVENT, onChange)
    return () => {
      clearTimeout(t)
      window.removeEventListener(CONSENT_EVENT, onChange)
    }
  }, [])

  function decide(choice: typeof ACCEPT_ALL | typeof REJECT_ALL) {
    writeConsent(choice)
    setVisible(false)
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
          role="region"
          aria-label="Cookie preferences"
          data-print="hide"
          className="fixed bottom-[calc(env(safe-area-inset-bottom)+5rem)] left-4 right-4 z-[45] mx-auto max-w-md rounded-2xl border border-gold-400/40 bg-card p-4 shadow-royal-lg md:bottom-6 md:left-6 md:right-auto md:mx-0"
        >
          <div className="flex gap-3">
            <Cookie className="mt-0.5 size-5 shrink-0 text-gold-600 dark:text-gold-300" aria-hidden="true" />
            <div className="min-w-0">
              <p className="text-sm leading-relaxed text-foreground">
                We use a few cookies to see which dishes people look for. Nothing loads
                until you choose.{' '}
                <Link
                  href="/privacy"
                  className="font-semibold underline underline-offset-4 hover:text-maroon-700 dark:hover:text-gold-300"
                >
                  Privacy Policy
                </Link>
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button size="sm" variant="primary" onClick={() => decide(ACCEPT_ALL)}>
                  Accept
                </Button>
                <Button size="sm" variant="outline" onClick={() => decide(REJECT_ALL)}>
                  Decline
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
