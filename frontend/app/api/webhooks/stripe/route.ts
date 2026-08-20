import { NextResponse } from 'next/server'
import type Stripe from 'stripe'
import { getStripe, isStripeConfigured } from '@/lib/stripe'
import { markOrderPaid, markPaymentFailed } from '@/lib/payments'
import { isDatabaseConfigured } from '@/lib/db'

/**
 * Stripe webhook.
 *
 * This endpoint is public and its URL will be known, so the signature check is
 * the only thing separating Stripe from anyone who wants to mark their own
 * order paid. Two things it depends on:
 *
 *  - the *raw* body. Signatures are computed over the exact bytes Stripe sent,
 *    so the payload is read with request.text() and never JSON.parse'd first.
 *  - STRIPE_WEBHOOK_SECRET. Without it there is nothing to verify against, so
 *    the endpoint refuses rather than trusting the request.
 *
 * Handlers are idempotent because Stripe retries until it receives a 2xx and
 * may deliver the same event more than once.
 */

// Signature verification needs the unbuffered body, so this must not be static.
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  if (!isStripeConfigured() || !process.env.STRIPE_WEBHOOK_SECRET) {
    console.error('[stripe-webhook] received an event but Stripe is not configured')
    return NextResponse.json({ error: 'Stripe is not configured.' }, { status: 503 })
  }
  if (!isDatabaseConfigured()) {
    // 503 rather than 200: Stripe should retry once the database is back,
    // instead of the payment being silently forgotten.
    console.error('[stripe-webhook] no database configured; asking Stripe to retry')
    return NextResponse.json({ error: 'Database unavailable.' }, { status: 503 })
  }

  const signature = request.headers.get('stripe-signature')
  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header.' }, { status: 400 })
  }

  const payload = await request.text()

  let event: Stripe.Event
  try {
    event = getStripe().webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (error) {
    // Either a forgery or a secret mismatch. Both are 400, and neither should
    // say which — an attacker learns nothing from the response.
    console.error('[stripe-webhook] signature verification failed', error)
    return NextResponse.json({ error: 'Invalid signature.' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object
        const orderId = orderIdFrom(session)
        if (!orderId) break

        // `complete` with payment_status 'paid' is the only state that means
        // money actually moved; async methods can complete while still pending.
        if (session.payment_status === 'paid') {
          const updated = await markOrderPaid({
            orderId,
            paymentIntentId:
              typeof session.payment_intent === 'string' ? session.payment_intent : null,
          })
          // Acknowledged either way: a payment for an order that no longer
          // exists needs a human, not another delivery attempt.
          if (updated) console.info(`[stripe-webhook] order ${orderId} paid`)
          else console.error(`[stripe-webhook] paid event for unknown order ${orderId}`)
        }
        break
      }

      // Delayed methods (some UPI and bank debits) settle after checkout.
      case 'checkout.session.async_payment_succeeded': {
        const session = event.data.object
        const orderId = orderIdFrom(session)
        if (orderId) {
          const updated = await markOrderPaid({
            orderId,
            paymentIntentId:
              typeof session.payment_intent === 'string' ? session.payment_intent : null,
          })
          if (!updated) console.error(`[stripe-webhook] async payment for unknown order ${orderId}`)
        }
        break
      }

      case 'checkout.session.async_payment_failed':
      case 'checkout.session.expired': {
        const orderId = orderIdFrom(event.data.object)
        if (orderId) await markPaymentFailed(orderId)
        break
      }

      default:
        // Everything else is acknowledged so Stripe stops retrying it.
        break
    }
  } catch (error) {
    // A 500 tells Stripe to retry, which is what we want for a transient
    // database failure — the alternative is a paid order left marked unpaid.
    console.error(`[stripe-webhook] handling ${event.type} failed`, error)
    return NextResponse.json({ error: 'Handler failed.' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}

/** The order id we attached when creating the session. */
function orderIdFrom(session: Stripe.Checkout.Session): number | null {
  const raw = session.metadata?.orderId ?? session.client_reference_id
  const parsed = Number(raw)
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null
}
