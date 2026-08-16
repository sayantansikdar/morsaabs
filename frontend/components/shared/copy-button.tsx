'use client'

import * as React from 'react'
import { Check, Copy } from 'lucide-react'
import { toast } from 'sonner'
import { track } from '@/lib/analytics'
import { cn } from '@/lib/utils'

/**
 * Feature 29 — copy-to-clipboard for discount codes and the phone number.
 *
 * The confirmation is announced in a live region as well as shown, and the
 * button reverts after two seconds. `navigator.clipboard` needs a secure
 * context, so there is a `execCommand` fallback for plain-http previews.
 */
export function CopyButton({
  value,
  label,
  copiedLabel = 'Copied',
  className,
  variant = 'inline',
}: {
  value: string
  label: string
  copiedLabel?: string
  className?: string
  variant?: 'inline' | 'code'
}) {
  const [copied, setCopied] = React.useState(false)

  React.useEffect(() => {
    if (!copied) return
    const t = setTimeout(() => setCopied(false), 2000)
    return () => clearTimeout(t)
  }, [copied])

  async function copy() {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(value)
      } else {
        const el = document.createElement('textarea')
        el.value = value
        el.setAttribute('readonly', '')
        el.style.position = 'fixed'
        el.style.opacity = '0'
        document.body.appendChild(el)
        el.select()
        document.execCommand('copy')
        document.body.removeChild(el)
      }
      setCopied(true)
      toast.success(`${copiedLabel}: ${value}`)
      track('copy_click', { value_label: label })
    } catch {
      toast.error('Could not copy — please select and copy manually.')
    }
  }

  if (variant === 'code') {
    return (
      <div
        className={cn(
          'flex items-center gap-3 rounded-xl border-2 border-dashed border-gold-400/60 bg-gold-400/10 p-2 pl-4',
          className
        )}
      >
        <code className="flex-1 font-mono text-lg font-bold tracking-[0.18em] text-maroon-700 dark:text-gold-200">
          {value}
        </code>
        <button
          type="button"
          onClick={copy}
          className="flex min-h-11 cursor-pointer items-center gap-2 rounded-lg bg-maroon-700 px-4 text-sm font-semibold text-sand-50 transition-colors hover:bg-maroon-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {copied ? (
            <Check className="size-4" aria-hidden="true" />
          ) : (
            <Copy className="size-4" aria-hidden="true" />
          )}
          <span>{copied ? copiedLabel : 'Copy'}</span>
          <span className="sr-only">{copied ? `${label} copied` : `Copy ${label}`}</span>
        </button>
        <span aria-live="polite" className="sr-only">
          {copied ? `${label} copied to clipboard` : ''}
        </span>
      </div>
    )
  }

  return (
    <>
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? `${label} copied` : `Copy ${label}`}
        className={cn(
          'inline-flex min-h-11 cursor-pointer items-center gap-1.5 rounded-lg px-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          className
        )}
      >
        {copied ? (
          <Check className="size-4 text-royal-600 dark:text-royal-300" aria-hidden="true" />
        ) : (
          <Copy className="size-4" aria-hidden="true" />
        )}
        <span>{copied ? copiedLabel : 'Copy'}</span>
      </button>
      <span aria-live="polite" className="sr-only">
        {copied ? `${label} copied to clipboard` : ''}
      </span>
    </>
  )
}
