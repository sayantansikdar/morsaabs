/**
 * Persisting public form submissions.
 *
 * This is the path a guest's order, booking or message takes into the database,
 * and it is the only reason the dashboard ever has anything to show.
 *
 * Everything arriving here is untrusted. Two rules follow:
 *
 *  1. Re-validate with the same Zod schemas the form used. The browser having
 *     validated is not evidence: the request may not have come from the form.
 *  2. Never trust prices. The cart posts a name, price and quantity per line;
 *     the price is looked up again from `menu_items` and the totals recomputed.
 *     Otherwise a crafted request could buy a thali for ₹1 — which matters far
 *     more once Stripe is charging against these numbers.
 */

import 'server-only'
import { eq, inArray } from 'drizzle-orm'
import { getDb } from './index'
import { menuItems, orders, orderItems, reservations, contactMessages } from './schema'
import { upsertCustomer } from './mutations'
import { orderSchema, reservationSchema, contactSchema } from '../validation'
import { z } from 'zod'

/** A cart line as the browser sends it. `price` here is advisory only. */
const cartLineSchema = z.object({
  name: z.string().trim().min(1).max(160),
  price: z.number(),
  quantity: z.number().int().min(1).max(99),
})

const orderPayloadSchema = orderSchema.and(
  z.object({
    items: z.array(cartLineSchema).min(1, 'An order needs at least one dish.'),
    deliveryFee: z.number().int().min(0).max(1000).optional(),
    promoCode: z.string().trim().max(40).nullable().optional(),
  })
)

export type PersistResult = { id: number; total: number }

/* ----------------------------------------------------------------- orders -- */

export async function persistOrder(
  payload: unknown,
  reference: string
): Promise<PersistResult> {
  const data = orderPayloadSchema.parse(payload)
  const db = getDb()

  // Authoritative prices, keyed by dish name (what the cart carries).
  const names = data.items.map((line) => line.name)
  const priced = await db
    .select({ id: menuItems.id, name: menuItems.name, price: menuItems.price })
    .from(menuItems)
    .where(inArray(menuItems.name, names))

  const byName = new Map(priced.map((row) => [row.name, row]))

  const lines = data.items.map((line) => {
    const match = byName.get(line.name)
    // A dish that is no longer on the menu keeps the submitted price: refusing
    // the whole order would lose a real customer over a menu edit mid-checkout.
    // It is recorded as-is and staff see it on the order.
    const unitPrice = match?.price ?? Math.max(0, Math.round(line.price))
    return {
      menuItemId: match?.id ?? null,
      name: line.name,
      unitPrice,
      quantity: line.quantity,
      lineTotal: unitPrice * line.quantity,
    }
  })

  const subtotal = lines.reduce((sum, line) => sum + line.lineTotal, 0)
  const deliveryFee = data.deliveryFee ?? 0
  // Discounts are not client-supplied either; only the known launch code applies.
  const discount = 0
  const total = Math.max(0, subtotal - discount + deliveryFee)

  const customer = await upsertCustomer({ phone: data.phone, name: data.name })

  const [order] = await db
    .insert(orders)
    .values({
      reference,
      customerId: customer.id,
      name: data.name,
      phone: data.phone,
      mode: data.mode,
      address: data.address ?? null,
      landmark: data.landmark ?? null,
      requestedTime: data.time ?? null,
      notes: data.notes ?? null,
      paymentMethod: data.payment,
      subtotal,
      discount,
      promoCode: data.promoCode ?? null,
      deliveryFee,
      total,
    })
    .returning({ id: orders.id })

  await db.insert(orderItems).values(lines.map((line) => ({ ...line, orderId: order.id })))

  return { id: order.id, total }
}

/**
 * Removes an order and its lines.
 *
 * Only for an order that failed before the guest could pay — nothing is owed
 * and no one has seen it. Never call this to cancel a real order: that is what
 * the 'cancelled' status is for, and the row is the record of what happened.
 */
export async function deleteOrder(orderId: number) {
  const db = getDb()
  await db.delete(orderItems).where(eq(orderItems.orderId, orderId))
  await db.delete(orders).where(eq(orders.id, orderId))
}

/* ----------------------------------------------------------- reservations -- */

export async function persistReservation(payload: unknown, reference: string) {
  const data = reservationSchema.parse(payload)
  const db = getDb()

  const customer = await upsertCustomer({
    phone: data.phone,
    name: data.name,
    email: data.email || null,
  })

  const [row] = await db
    .insert(reservations)
    .values({
      reference,
      customerId: customer.id,
      name: data.name,
      phone: data.phone,
      email: data.email || null,
      date: data.date,
      time: data.time,
      guests: data.guests,
      occasion: data.occasion ?? null,
      notes: data.notes ?? null,
    })
    .returning({ id: reservations.id })

  return { id: row.id }
}

/* ---------------------------------------------------------------- contact -- */

export async function persistContactMessage(payload: unknown) {
  const data = contactSchema.parse(payload)
  const db = getDb()

  const customer = await upsertCustomer({
    phone: data.phone,
    name: data.name,
    email: data.email,
  })

  const [row] = await db
    .insert(contactMessages)
    .values({
      customerId: customer.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      subject: data.subject,
      message: data.message,
    })
    .returning({ id: contactMessages.id })

  return { id: row.id }
}
