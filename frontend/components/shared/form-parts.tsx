'use client'

import * as React from 'react'
import Link from 'next/link'
import { AlertTriangle, CheckCircle2, PartyPopper } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

/**
 * The error summary shown after a failed submit.
 *
 * Focus moves here rather than to the first bad field, so a screen-reader user
 * hears how many problems there are before being dropped into one of them.
 * Each entry links to its field; inline errors stay put as well.
 */
export const ErrorSummary = React.forwardRef<
  HTMLDivElement,
  { errors: Record<string, string>; labels: Record<string, string> }
>(({ errors, labels }, ref) => {
  const entries = Object.entries(errors)
  if (entries.length === 0) return null

  return (
    <div
      ref={ref}
      tabIndex={-1}
      role="alert"
      className="mb-6 rounded-2xl border-2 border-maroon-600 bg-maroon-50 p-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring dark:bg-maroon-950/50"
    >
      <p className="flex items-center gap-2 font-display text-lg font-bold text-maroon-800 dark:text-maroon-200">
        <AlertTriangle className="size-5 shrink-0" aria-hidden="true" />
        {entries.length === 1
          ? 'There is one thing to fix'
          : `There are ${entries.length} things to fix`}
      </p>
      <ul className="mt-3 space-y-1.5">
        {entries.map(([field, message]) => (
          <li key={field}>
            <a
              href={`#${field}`}
              onClick={(e) => {
                e.preventDefault()
                const el = document.getElementById(field)
                el?.focus()
                el?.scrollIntoView({ block: 'center', behavior: 'smooth' })
              }}
              className="text-sm font-medium text-maroon-800 underline underline-offset-4 hover:text-maroon-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring dark:text-maroon-200"
            >
              <span className="font-semibold">{labels[field] ?? field}:</span> {message}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
})
ErrorSummary.displayName = 'ErrorSummary'

/** Feature 35 — the interactive success state. */
export function SuccessPanel({
  title,
  reference,
  promise,
  children,
  primary,
  secondary,
  className,
}: {
  title: string
  reference?: string
  promise: string
  children?: React.ReactNode
  primary?: { label: string; href: string }
  secondary?: { label: string; href: string }
  className?: string
}) {
  const headingRef = React.useRef<HTMLHeadingElement>(null)

  // Move focus to the confirmation so the outcome is announced, and so a
  // keyboard user's next Tab starts from here rather than the old form.
  React.useEffect(() => {
    headingRef.current?.focus()
  }, [])

  return (
    <div
      role="status"
      className={cn(
        'relative overflow-hidden rounded-3xl border-2 border-royal-500/60 bg-card p-8 text-center sm:p-12',
        className
      )}
    >
      <div aria-hidden="true" className="absolute inset-0 bg-jaali text-royal-500" />

      <div className="relative">
        <span
          aria-hidden="true"
          className="mx-auto grid size-16 place-items-center rounded-full bg-royal-600 text-sand-50"
        >
          <CheckCircle2 className="size-9" />
        </span>

        <h2
          ref={headingRef}
          tabIndex={-1}
          className="mt-6 font-display text-display-sm font-bold text-foreground focus:outline-none"
        >
          {title}
        </h2>

        {reference && (
          <p className="mt-3 inline-flex items-center gap-2 rounded-full border border-gold-400/50 bg-gold-400/10 px-4 py-2">
            <span className="text-sm text-muted-foreground">Reference</span>
            <code className="tnum font-mono font-bold text-maroon-700 dark:text-gold-200">
              {reference}
            </code>
          </p>
        )}

        <p className="measure mx-auto mt-4 leading-relaxed text-muted-foreground">{promise}</p>

        {children}

        {(primary || secondary) && (
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            {primary && (
              <Button asChild variant="gold" size="lg">
                <Link href={primary.href}>{primary.label}</Link>
              </Button>
            )}
            {secondary && (
              <Button asChild variant="outline" size="lg">
                <Link href={secondary.href}>{secondary.label}</Link>
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

/** Small celebratory strip used on the thank-you page. */
export function ThankYouBanner({ children }: { children: React.ReactNode }) {
  return (
    <p className="inline-flex items-center gap-2 rounded-full border border-gold-400/50 bg-gold-400/10 px-5 py-2.5 text-sm font-semibold text-maroon-700 dark:text-gold-200">
      <PartyPopper className="size-4" aria-hidden="true" />
      {children}
    </p>
  )
}

/** Generates a short human-readable reference for a submission. */
export function makeReference(prefix: string): string {
  const now = new Date()
  const stamp = `${now.getFullYear().toString().slice(2)}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`
  const random = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `${prefix}-${stamp}-${random}`
}
