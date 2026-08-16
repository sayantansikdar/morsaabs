/**
 * Analytics events and UTM attribution (features 19 + 34).
 *
 * `track` is a no-op until the visitor has granted analytics consent, because
 * gtag itself is loaded in denied Consent Mode — calls made before consent are
 * queued cookielessly by Google rather than dropped, which is what we want.
 */

import { readConsent } from './consent'

type GtagArgs = [command: string, ...rest: unknown[]]

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: GtagArgs) => void
  }
}

export function track(event: string, params: Record<string, unknown> = {}) {
  if (typeof window === 'undefined') return
  window.gtag?.('event', event, { ...params, ...getAttribution() })
}

export function pageview(url: string, measurementId: string) {
  if (typeof window === 'undefined' || !measurementId) return
  window.gtag?.('config', measurementId, { page_path: url })
}

/* ---------------------------------------------------------------- UTM ---- */

export const UTM_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'gclid',
  'fbclid',
] as const

export type UtmParams = Partial<Record<(typeof UTM_KEYS)[number], string>>

const ATTRIBUTION_KEY = 'morsaabs.attribution.v1'

/** Reads campaign params out of a URL (or the current location). */
export function parseUtm(search?: string): UtmParams {
  if (typeof window === 'undefined' && !search) return {}
  const params = new URLSearchParams(search ?? window.location.search)
  const out: UtmParams = {}
  for (const key of UTM_KEYS) {
    const value = params.get(key)
    if (value) out[key] = value.slice(0, 120)
  }
  return out
}

/**
 * First-touch attribution: the campaign that brought someone to the site is
 * the one credited for the order, even if they browse for ten minutes first.
 * Stored in sessionStorage so it dies with the tab and never becomes a
 * long-lived identifier.
 */
export function captureAttribution(): UtmParams {
  if (typeof window === 'undefined') return {}
  const existing = getAttribution()
  if (Object.keys(existing).length > 0) return existing

  const fresh = parseUtm()
  if (Object.keys(fresh).length === 0) {
    // No campaign params — record the referrer so direct/organic is still known.
    const ref = document.referrer
    if (ref && !ref.includes(window.location.host)) {
      const record = { utm_source: new URL(ref).hostname, utm_medium: 'referral' }
      persist(record)
      return record
    }
    return {}
  }
  persist(fresh)
  return fresh
}

function persist(value: UtmParams) {
  try {
    window.sessionStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(value))
  } catch {
    /* storage blocked — attribution is best-effort */
  }
}

export function getAttribution(): UtmParams {
  if (typeof window === 'undefined') return {}
  try {
    const raw = window.sessionStorage.getItem(ATTRIBUTION_KEY)
    return raw ? (JSON.parse(raw) as UtmParams) : {}
  } catch {
    return {}
  }
}

/** Appends the current campaign params to an outbound link. */
export function withUtm(href: string, extra: UtmParams = {}): string {
  const params = { ...getAttribution(), ...extra }
  if (Object.keys(params).length === 0) return href
  try {
    const url = new URL(href, typeof window === 'undefined' ? 'https://morsaabs.com' : window.location.origin)
    for (const [k, v] of Object.entries(params)) if (v) url.searchParams.set(k, v)
    return url.origin === 'https://morsaabs.com' && !href.startsWith('http')
      ? `${url.pathname}${url.search}`
      : url.toString()
  } catch {
    return href
  }
}

/** Builds a campaign-tagged URL — used when generating links for print or ads. */
export function buildUtmUrl(
  base: string,
  { source, medium, campaign, term, content }: {
    source: string
    medium: string
    campaign: string
    term?: string
    content?: string
  }
): string {
  const url = new URL(base)
  url.searchParams.set('utm_source', source)
  url.searchParams.set('utm_medium', medium)
  url.searchParams.set('utm_campaign', campaign)
  if (term) url.searchParams.set('utm_term', term)
  if (content) url.searchParams.set('utm_content', content)
  return url.toString()
}

export function hasAnalyticsConsent(): boolean {
  return readConsent()?.analytics === true
}
