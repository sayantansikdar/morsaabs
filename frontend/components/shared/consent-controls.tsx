'use client'

import * as React from 'react'
import { ShieldCheck, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  ACCEPT_ALL,
  REJECT_ALL,
  readConsent,
  writeConsent,
  resetConsent,
  CONSENT_EVENT,
  type ConsentState,
} from '@/lib/consent'
import { formatDate } from '@/lib/site'

/**
 * Feature 56 — consent management.
 *
 * Withdrawing consent has to be as easy as giving it, so this shows the current
 * decision, when it was made, and lets it be changed or cleared outright.
 */
export function ConsentControls() {
  const [consent, setConsent] = React.useState<ConsentState | null>(null)
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setConsent(readConsent())
    setMounted(true)

    const onChange = (e: Event) => setConsent((e as CustomEvent).detail ?? null)
    window.addEventListener(CONSENT_EVENT, onChange)
    return () => window.removeEventListener(CONSENT_EVENT, onChange)
  }, [])

  return (
    <div id="cookie-settings" className="scroll-mt-28 rounded-3xl border border-gold-400/30 bg-card p-6 sm:p-8">
      <h2 className="flex items-center gap-2.5 font-display text-2xl font-bold text-foreground">
        <ShieldCheck className="size-6 text-gold-600 dark:text-gold-300" aria-hidden="true" />
        Your cookie choices
      </h2>

      <p className="measure mt-3 text-muted-foreground">
        Change your mind at any time. Withdrawing consent stops analytics immediately —
        it does not need you to email anyone.
      </p>

      <div className="mt-6 rounded-xl bg-muted/60 p-4" aria-live="polite">
        {!mounted ? (
          <div className="skeleton h-5 w-64 rounded" />
        ) : consent ? (
          <p className="text-sm text-muted-foreground">
            Current setting:{' '}
            <span className="font-semibold text-foreground">
              {consent.analytics ? 'Analytics allowed' : 'Analytics declined'}
            </span>
            , chosen on{' '}
            <time dateTime={consent.decidedAt} className="font-medium text-foreground">
              {formatDate(consent.decidedAt.slice(0, 10))}
            </time>
            .
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">
            You have not made a choice yet, so nothing beyond the strictly necessary is
            running.
          </p>
        )}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Button variant="primary" onClick={() => setConsent(writeConsent(ACCEPT_ALL))}>
          Allow analytics
        </Button>
        <Button variant="outline" onClick={() => setConsent(writeConsent(REJECT_ALL))}>
          Decline analytics
        </Button>
        <Button
          variant="ghost"
          onClick={() => {
            resetConsent()
            setConsent(null)
          }}
        >
          <RotateCcw aria-hidden="true" />
          Clear my choice
        </Button>
      </div>

      <p className="mt-5 text-sm text-muted-foreground">
        Strictly necessary storage — your theme, your basket and this decision itself —
        stays either way, because the site cannot work without it. Clearing your browser’s
        site data removes all of it.
      </p>
    </div>
  )
}
