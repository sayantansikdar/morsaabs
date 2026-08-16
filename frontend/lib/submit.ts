/**
 * Form submission plumbing.
 *
 * Posts to our own route handlers, which forward to the FastAPI backend when
 * BACKEND_API_URL is configured and otherwise accept the submission so the site
 * still works standalone on Vercel. Campaign attribution rides along with every
 * submission so marketing can tell which channel produced the booking.
 */

import { getAttribution } from './analytics'

export type SubmitResult =
  | { ok: true; reference: string }
  | { ok: false; error: string }

export async function submitForm(
  endpoint: 'reservations' | 'orders' | 'contact',
  payload: Record<string, unknown>
): Promise<SubmitResult> {
  try {
    const response = await fetch(`/api/${endpoint}`, {
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
    }

    if (!response.ok) {
      return {
        ok: false,
        error:
          data.error ??
          'We could not send that just now. Please try again, or call us on +91 92119 97724.',
      }
    }

    return { ok: true, reference: data.reference ?? 'PENDING' }
  } catch {
    return {
      ok: false,
      error:
        'Your connection dropped before we could send this. Check your network and try again — or call us on +91 92119 97724.',
    }
  }
}
