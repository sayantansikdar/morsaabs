'use client'

import * as React from 'react'
import Script from 'next/script'
import { usePathname, useSearchParams } from 'next/navigation'
import { pageview } from '@/lib/analytics'
import { readConsent, applyConsent } from '@/lib/consent'

/**
 * Feature 19 — Google Analytics 4.
 *
 * gtag boots with Consent Mode v2 set to denied, so the first page view is
 * measured cookielessly and nothing personal is stored until the visitor
 * accepts. `afterInteractive` keeps the tag off the critical path.
 */
export function Analytics({ measurementId }: { measurementId: string }) {
  if (!measurementId) return null

  return (
    <>
      <Script
        id="ga-consent-default"
        strategy="afterInteractive"
        // Consent defaults must be queued *before* the GA library loads.
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;
            gtag('consent', 'default', {
              ad_storage: 'denied',
              ad_user_data: 'denied',
              ad_personalization: 'denied',
              analytics_storage: 'denied',
              functionality_storage: 'granted',
              security_storage: 'granted',
              wait_for_update: 500
            });
            gtag('js', new Date());
            gtag('config', '${measurementId}', {
              send_page_view: false,
              anonymize_ip: true
            });
          `,
        }}
      />
      <Script
        id="ga-lib"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
      />
      <React.Suspense fallback={null}>
        <PageviewReporter measurementId={measurementId} />
      </React.Suspense>
    </>
  )
}

/**
 * App Router does not fire a page view on client navigation, so we send one
 * ourselves whenever the path or query changes.
 *
 * useSearchParams needs a Suspense boundary to avoid opting the whole tree
 * out of static rendering — hence the wrapper above.
 */
function PageviewReporter({ measurementId }: { measurementId: string }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Re-apply a stored decision on every fresh load.
  React.useEffect(() => {
    const stored = readConsent()
    if (stored) applyConsent(stored)
  }, [])

  React.useEffect(() => {
    const qs = searchParams.toString()
    pageview(qs ? `${pathname}?${qs}` : pathname, measurementId)
  }, [pathname, searchParams, measurementId])

  return null
}
