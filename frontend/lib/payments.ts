/**
 * Stripe Checkout for online orders.
 *
 * The order is written to Postgres *before* a payment is created, and the
 * amount charged is read back from that row. The browser never influences the
 * price: it posts a cart, the server re-prices every line against `menu_items`
 * (see persistOrder), and this module charges whatever the row says. A crafted
 * request can therefore change what is ordered, but not what it costs.
 *
 * The order id travels in `client_reference_id` and the metadata, which is how
 * the webhook finds the row again without trusting anything in the redirect.
 */

import 'server-only'
import { eq } from 'drizzle-orm'
import { getDb } from './db'
import { orders, orderItems } from './db/schema'
import { getStripe, toStripeAmount } from './stripe'
import { SITE_URL } from './site'

export async function createCheckoutSession(orderId: number): Promise<string> {
  const db = getDb()
  const stripe = getStripe()

  const [order] = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1)
  if (!order) throw new Error(`Order ${orderId} does not exist.`)
  if (order.paymentStatus === 'paid') {
    throw new Error(`Order ${order.reference} has already been paid.`)
  }

  const lines = await db.select().from(orderItems).where(eq(orderItems.orderId, orderId))
  if (lines.length === 0) throw new Error(`Order ${order.reference} has no items.`)

  const session = await stripe.checkout.sessions.create(
    {
      mode: 'payment',
      // Stripe emails the receipt here; it is also prefilled at checkout.
      customer_email: undefined,
      client_reference_id: String(order.id),
      metadata: { orderId: String(order.id), reference: order.reference },
      line_items: [
        ...lines.map((line) => ({
          quantity: line.quantity,
          price_data: {
            currency: 'inr',
            unit_amount: toStripeAmount(line.unitPrice),
            product_data: { name: line.name },
          },
        })),
        // Modelled as its own line so the customer sees what they are paying
        // for, and so the total matches the order row exactly.
        ...(order.deliveryFee > 0
          ? [
              {
                quantity: 1,
                price_data: {
                  currency: 'inr' as const,
                  unit_amount: toStripeAmount(order.deliveryFee),
                  product_data: { name: 'Delivery' },
                },
              },
            ]
          : []),
      ],
      success_url: `${SITE_URL}/thank-you?type=order&ref=${order.reference}&paid=1`,
      cancel_url: `${SITE_URL}/order?cancelled=${order.reference}`,
      // A guest who wanders off should not hold a session open indefinitely.
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
    },
    {
      // Retrying this call for the same order must not create a second
      // payment page — Stripe returns the original session instead.
      idempotencyKey: `order-${order.id}-checkout`,
    }
  )

  await db
    .update(orders)
    .set({ stripeSessionId: session.id, updatedAt: new Date() })
    .where(eq(orders.id, order.id))

  if (!session.url) throw new Error('Stripe did not return a checkout URL.')
  return session.url
}

/**
 * Marks an order paid. Called only from the verified webhook.
 *
 * Idempotent: Stripe retries a webhook until it gets a 2xx, and the same event
 * can arrive more than once, so paying an already-paid order is a no-op rather
 * than a second write.
 */
export async function markOrderPaid(input: {
  orderId: number
  paymentIntentId: string | null
}) {
  const db = getDb()

  const [order] = await db
    .select()
    .from(orders)
    .where(eq(orders.id, input.orderId))
    .limit(1)

  // Null rather than throw: a missing order is permanent, and the caller must
  // be able to tell it apart from a transient fault. Throwing here produced a
  // 500, which Stripe treats as "retry" — so an event naming an order that no
  // longer exists would be redelivered for days.
  if (!order) return null
  if (order.paymentStatus === 'paid') return order

  const [updated] = await db
    .update(orders)
    .set({
      paymentStatus: 'paid',
      stripePaymentIntentId: input.paymentIntentId,
      // A paid order is confirmed by definition; staff should not have to
      // acknowledge a payment that already cleared.
      status: order.status === 'pending' ? 'confirmed' : order.status,
      updatedAt: new Date(),
    })
    .where(eq(orders.id, input.orderId))
    .returning()

  return updated
}

/** Records a failed or expired payment without touching the order's own status. */
export async function markPaymentFailed(orderId: number) {
  const db = getDb()
  await db
    .update(orders)
    .set({ paymentStatus: 'failed', updatedAt: new Date() })
    .where(eq(orders.id, orderId))
}
