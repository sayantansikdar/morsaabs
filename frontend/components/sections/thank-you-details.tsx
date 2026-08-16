'use client'

import * as React from 'react'
import { useSearchParams } from 'next/navigation'
import { Phone, Instagram } from 'lucide-react'
import { SuccessPanel, ThankYouBanner } from '@/components/shared/form-parts'
import { CopyButton } from '@/components/shared/copy-button'
import { Button } from '@/components/ui/button'
import { site, formatPrice } from '@/lib/site'
import { track } from '@/lib/analytics'

/**
 * Reads the submission details out of the query string so the confirmation is
 * specific rather than generic, and fires the conversion event once.
 */
export function ThankYouDetails() {
  const params = useSearchParams()
  const type = params.get('type') ?? 'message'
  const reference = params.get('ref') ?? undefined
  const name = params.get('name') ?? ''

  React.useEffect(() => {
    track('conversion', { conversion_type: type, transaction_id: reference })
    // Fire once per confirmation, not on every re-render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const greeting = name ? `Thank you, ${name}.` : 'Thank you.'

  const content = {
    reservation: {
      title: `${greeting} Your table is requested.`,
      promise: `${site.promise.reservation}. If you booked outside service hours we will call as soon as we open at ${site.hours.opens.replace(':00', '')} AM.`,
      detail: (() => {
        const date = params.get('date')
        const time = params.get('time')
        const guests = params.get('guests')
        if (!date) return null
        return `${guests} ${guests === '1' ? 'guest' : 'guests'} · ${new Date(`${date}T00:00:00`).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })} at ${time}`
      })(),
      primary: { label: 'See the menu', href: '/menu' },
      secondary: { label: 'How to find us', href: '/contact' },
    },
    order: {
      title: `${greeting} Your order is in.`,
      promise:
        params.get('mode') === 'takeaway'
          ? 'We are cooking now — it will be sealed and waiting at the counter in 20–25 minutes.'
          : `${site.promise.delivery}. You will get the rider's number by SMS the moment it leaves the kitchen.`,
      detail: params.get('total') ? `Total ${formatPrice(Number(params.get('total')))}` : null,
      primary: { label: 'Order something else', href: '/menu' },
      secondary: { label: 'Read the journal', href: '/blog' },
    },
    message: {
      title: `${greeting} Your message is with us.`,
      promise:
        params.get('subject') === 'catering' || params.get('subject') === 'banquet'
          ? `${site.promise.enquiry}. Farah handles these personally and will come back with a costed menu, not a brochure.`
          : 'We answer general messages the same day. Anything urgent is faster by phone.',
      detail: null,
      primary: { label: 'Read event stories', href: '/stories' },
      secondary: { label: 'See the menu', href: '/menu' },
    },
  }[type] ?? {
    title: greeting,
    promise: 'We have received it and will be in touch shortly.',
    detail: null,
    primary: { label: 'Back to the menu', href: '/menu' },
    secondary: { label: 'Contact us', href: '/contact' },
  }

  return (
    <SuccessPanel
      title={content.title}
      reference={reference}
      promise={content.promise}
      primary={content.primary}
      secondary={content.secondary}
    >
      {content.detail && (
        <p className="mt-4">
          <ThankYouBanner>{content.detail}</ThankYouBanner>
        </p>
      )}

      {reference && (
        <div className="mx-auto mt-6 max-w-sm">
          <p className="text-sm text-muted-foreground">
            Quote this reference if you call about it:
          </p>
          <div className="mt-2">
            <CopyButton value={reference} label="reference number" variant="code" />
          </div>
        </div>
      )}

      <div className="mt-8 flex flex-wrap justify-center gap-3 border-t border-border pt-8">
        <Button asChild variant="outline" size="sm">
          <a href={`tel:${site.phone}`} onClick={() => track('call_click', { location: 'thank_you' })}>
            <Phone aria-hidden="true" />
            {site.phoneDisplay}
          </a>
        </Button>
        <Button asChild variant="outline" size="sm">
          <a href={site.social.instagram} target="_blank" rel="noopener noreferrer">
            <Instagram aria-hidden="true" />
            Follow us
          </a>
        </Button>
      </div>
    </SuccessPanel>
  )
}
