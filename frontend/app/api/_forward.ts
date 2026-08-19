import { NextResponse } from 'next/server'
import { ZodError } from 'zod'
import { isDatabaseConfigured } from '@/lib/db'
import {
  persistOrder,
  persistReservation,
  persistContactMessage,
} from '@/lib/db/submissions'

/**
 * Shared handler for the three form endpoints.
 *
 * Where a submission goes, in order:
 *
 * 1. Postgres, when DATABASE_URL is set. This is the source of truth the
 *    dashboard reads, so it must succeed — a booking that is not stored is a
 *    booking nobody will honour, and the guest is told to call instead.
 * 2. The FastAPI service, if BACKEND_API_URL is set. Kept so the existing
 *    backend keeps receiving traffic during the migration; a failure there is
 *    logged but does not fail the request once the row is safely in Postgres.
 * 3. Neither configured — accepted and logged, so the site still runs standalone.
 */
export async function forward(
  request: Request,
  path: 'reservations' | 'orders' | 'contact',
  prefix: string
) {
  let body: Record<string, unknown>
  try {
    body = (await request.json()) as Record<string, unknown>
  } catch {
    return NextResponse.json({ error: 'Malformed request body.' }, { status: 400 })
  }

  const reference = makeReference(prefix)
  const backend = process.env.BACKEND_API_URL?.replace(/\/$/, '')

  let stored = false
  if (isDatabaseConfigured()) {
    try {
      if (path === 'orders') await persistOrder(body, reference)
      else if (path === 'reservations') await persistReservation(body, reference)
      else await persistContactMessage(body)
      stored = true
    } catch (error) {
      // A validation failure is the sender's fault and is safe to report as 400;
      // anything else is ours, and the guest gets a number to call.
      if (error instanceof ZodError) {
        console.warn(`[${path}] rejected invalid submission`, error.issues)
        return NextResponse.json(
          { error: 'Some of those details were not valid. Please check the form and try again.' },
          { status: 400 }
        )
      }
      console.error(`[${path}] could not be stored`, error)
      return NextResponse.json(
        { error: 'We could not save that just now. Please call us on +91 92119 97724.' },
        { status: 503 }
      )
    }
  }

  if (!backend) {
    if (!stored) console.info(`[${path}] accepted without storage`, { reference })
    return NextResponse.json({ reference, forwarded: false, stored }, { status: 201 })
  }

  // Already safely stored: the upstream is now a nice-to-have, not a gate.
  if (stored) {
    void fetch(`${backend}/api/${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...body, reference }),
      signal: AbortSignal.timeout(9000),
    }).catch((error) => console.error(`[${path}] mirror to backend failed`, error))

    return NextResponse.json({ reference, forwarded: true, stored }, { status: 201 })
  }

  try {
    const upstream = await fetch(`${backend}/api/${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...body, reference }),
      // A guest is waiting on this response; do not hang on a cold Lambda.
      signal: AbortSignal.timeout(9000),
    })

    if (!upstream.ok) {
      console.error(`[${path}] upstream ${upstream.status}`, await upstream.text().catch(() => ''))
      return NextResponse.json(
        { error: 'Our booking system did not accept that. Please call us on +91 92119 97724.' },
        { status: 502 }
      )
    }

    return NextResponse.json({ reference, forwarded: true }, { status: 201 })
  } catch (error) {
    console.error(`[${path}] upstream unreachable`, error)
    return NextResponse.json(
      { error: 'We could not reach our booking system. Please call us on +91 92119 97724.' },
      { status: 502 }
    )
  }
}

function makeReference(prefix: string): string {
  const now = new Date()
  const stamp = `${now.getFullYear().toString().slice(2)}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`
  const random = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `${prefix}-${stamp}-${random}`
}
