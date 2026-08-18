'use client'

import * as React from 'react'
import { site } from '@/lib/site'
import { CONSENT_EVENT, readConsent, type ConsentState } from '@/lib/consent'

/**
 * Datadog Real User Monitoring.
 *
 * The SDK is imported dynamically inside the effect so it compiles to its own
 * async chunk — RUM never blocks first paint and stays out of the initial JS
 * budget. It boots with tracking consent tied to the same cookie decision that
 * gates Google Analytics: until the visitor accepts, RUM collects nothing and
 * writes no cookies, and `setTrackingConsent` flips it live the moment they
 * choose. With no application ID or client token set it does nothing at all.
 */

// Module-scoped so a remount — or React re-invoking effects in dev — can never
// initialise RUM twice.
let started = false

export function DatadogRum() {
  const { applicationId, clientToken } = site.datadog

  React.useEffect(() => {
    if (!applicationId || !clientToken || started) return
    started = true

    let removeConsentListener: (() => void) | undefined

    import('@datadog/browser-rum').then(({ datadogRum }) => {
      datadogRum.init({
        applicationId,
        clientToken,
        site: site.datadog.site,
        service: site.datadog.service,
        env: site.datadog.env,
        ...(site.datadog.version ? { version: site.datadog.version } : {}),
        sessionSampleRate: site.datadog.sessionSampleRate,
        sessionReplaySampleRate: site.datadog.replaySampleRate,
        trackingConsent: readConsent()?.analytics ? 'granted' : 'not-granted',
        // Form fields are masked in any Session Replay recording.
        defaultPrivacyLevel: 'mask-user-input',
        trackUserInteractions: true,
        trackResources: true,
        trackLongTasks: true,
      })

      const onConsentChange = (event: Event) => {
        const detail = (event as CustomEvent<ConsentState | null>).detail
        datadogRum.setTrackingConsent(detail?.analytics ? 'granted' : 'not-granted')
      }
      window.addEventListener(CONSENT_EVENT, onConsentChange)
      removeConsentListener = () => window.removeEventListener(CONSENT_EVENT, onConsentChange)
    })

    return () => removeConsentListener?.()
  }, [applicationId, clientToken])

  return null
}
