/**
 * Cookie consent (features 22 + 56).
 *
 * Nothing that is not strictly necessary runs before the visitor chooses.
 * Google Analytics boots in Consent Mode v2 with everything denied, and we
 * send a `consent update` only when the visitor opts in — so the first page
 * view is measured without cookies and no personal data leaves the browser
 * until they say yes.
 */

export const CONSENT_KEY = 'morsaabs.consent.v1'
export const CONSENT_EVENT = 'morsaabs:consent-change'

export type ConsentState = {
  necessary: true
  analytics: boolean
  marketing: boolean
  /** ISO timestamp of the decision — kept as the record of consent. */
  decidedAt: string
  version: 1
}

export const ACCEPT_ALL: Omit<ConsentState, 'decidedAt'> = {
  necessary: true,
  analytics: true,
  marketing: true,
  version: 1,
}

export const REJECT_ALL: Omit<ConsentState, 'decidedAt'> = {
  necessary: true,
  analytics: false,
  marketing: false,
  version: 1,
}

export function readConsent(): ConsentState | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(CONSENT_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as ConsentState
    return parsed?.version === 1 ? parsed : null
  } catch {
    // Private browsing or a corrupted value — treat as "not yet decided".
    return null
  }
}

export function writeConsent(choice: Omit<ConsentState, 'decidedAt'>): ConsentState {
  const state: ConsentState = { ...choice, decidedAt: new Date().toISOString() }
  try {
    window.localStorage.setItem(CONSENT_KEY, JSON.stringify(state))
  } catch {
    /* Storage unavailable — the banner will simply ask again next visit. */
  }
  window.dispatchEvent(new CustomEvent<ConsentState>(CONSENT_EVENT, { detail: state }))
  applyConsent(state)
  return state
}

/** Push the decision into Google Consent Mode. */
export function applyConsent(state: ConsentState) {
  if (typeof window === 'undefined') return
  const w = window as typeof window & { gtag?: (...args: unknown[]) => void }
  w.gtag?.('consent', 'update', {
    analytics_storage: state.analytics ? 'granted' : 'denied',
    ad_storage: state.marketing ? 'granted' : 'denied',
    ad_user_data: state.marketing ? 'granted' : 'denied',
    ad_personalization: state.marketing ? 'granted' : 'denied',
  })
}

/** Clears the stored decision so the banner reappears (used by the privacy page). */
export function resetConsent() {
  try {
    window.localStorage.removeItem(CONSENT_KEY)
  } catch {
    /* nothing to clear */
  }
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: null }))
}
