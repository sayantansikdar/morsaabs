/**
 * Form submission plumbing.
 *
 * Three deployment shapes, in order of preference:
 *
 * 1. Node host (Vercel/Lambda) — posts to our own route handlers under
 *    /api/*, which forward to FastAPI. Same origin, no CORS.
 * 2. Static host (GitHub Pages) with NEXT_PUBLIC_API_BASE set — posts straight
 *    to the backend origin. The backend must allow this site in its CORS
 *    config, since there is no server of ours in between.
 * 3. Static host with no backend configured — there is genuinely nowhere to
 *    send the submission, so we say so and hand over a phone number rather
 *    than showing a spinner and dropping the booking on the floor.
 */

import { getAttribution } from './analytics'

/** Set when the build was produced with STATIC_EXPORT=1. */
export const IS_STATIC_BUILD = process.env.NEXT_PUBLIC_STATIC_EXPORT === '1'

const API_BASE = (process.env.NEXT_PUBLIC_API_BASE ?? '').replace(/\/$/, '')

/** True when a submission has nowhere to go and the UI must offer a fallback. */
export const SUBMISSIONS_UNAVAILABLE = IS_STATIC_BUILD && API_BASE === ''

export type SubmitResult =
  /** `checkoutUrl` is set only when paying online: the caller must redirect to it. */
  | { ok: true; reference: string; checkoutUrl?: string | null }
  | { ok: false; error: string; unavailable?: boolean }

const PHONE_FALLBACK =
  'Online booking is not connected on this site yet. Please call +91 92119 97724 — someone picks up during opening hours.'

export async function submitForm(
  endpoint: 'reservations' | 'orders' | 'contact',
  payload: Record<string, unknown>
): Promise<SubmitResult> {
  if (SUBMISSIONS_UNAVAILABLE) {
    return { ok: false, unavailable: true, error: PHONE_FALLBACK }
  }

  const url = API_BASE ? `${API_BASE}/api/${endpoint}` : `/api/${endpoint}`

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...payload,
        attribution: getAttribution(),
        submittedAt: new Date().toISOString(),
      }),
    })

    const data = (await response.json().catch(() => ({}))) as {
      reference?: string
      error?: string
      checkoutUrl?: string | null
    }

    if (!response.ok) {
      return {
        ok: false,
        error:
          data.error ??
          'We could not send that just now. Please try again, or call us on +91 92119 97724.',
      }
    }

    return { ok: true, reference: data.reference ?? 'PENDING', checkoutUrl: data.checkoutUrl ?? null }
  } catch {
    return {
      ok: false,
      error:
        'Your connection dropped before we could send this. Check your network and try again — or call us on +91 92119 97724.',
    }
  }
}
