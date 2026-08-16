import { NextResponse } from 'next/server'

/**
 * Shared handler for the three form endpoints.
 *
 * When BACKEND_API_URL points at the FastAPI service the submission is
 * forwarded there. Without it the submission is accepted and logged, so the
 * site is deployable on its own while the backend is being wired up — the
 * response shape is identical either way.
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

  if (!backend) {
    console.info(`[${path}] accepted without backend`, { reference })
    return NextResponse.json({ reference, forwarded: false }, { status: 201 })
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
