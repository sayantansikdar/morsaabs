/**
 * Writes. Server-only, same as queries.
 *
 * Every mutation that changes something a customer can see takes an `actor`
 * and records the before/after in `admin_audit_log`. A dashboard that can
 * rewrite prices without leaving a trail is how a wrong price becomes
 * unexplainable a week later.
 */

import 'server-only'
import { eq } from 'drizzle-orm'
import { getDb } from './index'
import {
  menuCategories,
  menuItems,
  orders,
  reservations,
  contactMessages,
  customers,
  adminAuditLog,
  type NewMenuItem,
} from './schema'

export type Actor = { id: string; email?: string | null }

/** Fields an admin may change on a dish. Deliberately excludes id/timestamps. */
export type MenuItemPatch = Partial<
  Pick<
    NewMenuItem,
    | 'categoryId'
    | 'name'
    | 'price'
    | 'description'
    | 'spice'
    | 'chefSpecial'
    | 'bestseller'
    | 'jain'
    | 'vegan'
    | 'contains'
    | 'imageUrl'
    | 'imageAlt'
    | 'isAvailable'
    | 'sortOrder'
  >
>

async function audit(
  actor: Actor,
  action: 'create' | 'update' | 'delete',
  entity: string,
  entityId: string | number,
  changes?: Record<string, unknown>
) {
  const db = getDb()
  await db.insert(adminAuditLog).values({
    actorId: actor.id,
    actorEmail: actor.email ?? null,
    action,
    entity,
    entityId: String(entityId),
    changes: changes ?? null,
  })
}

/** Narrows a full row to just the keys being changed, for the audit "before". */
function pick<T extends object>(row: T, keys: readonly string[]): Record<string, unknown> {
  const out: Record<string, unknown> = {}
  for (const key of keys) {
    if (key in row) out[key] = (row as Record<string, unknown>)[key]
  }
  return out
}

/* -------------------------------------------------------------- menu CRUD -- */

export async function updateMenuItem(actor: Actor, id: number, patch: MenuItemPatch) {
  const db = getDb()

  const [before] = await db.select().from(menuItems).where(eq(menuItems.id, id)).limit(1)
  if (!before) throw new Error(`Dish ${id} does not exist.`)

  const [after] = await db
    .update(menuItems)
    .set({ ...patch, updatedAt: new Date() })
    .where(eq(menuItems.id, id))
    .returning()

  await audit(actor, 'update', 'menu_item', id, {
    before: pick(before, Object.keys(patch)),
    after: pick(after, Object.keys(patch)),
  })

  return after
}

export async function createMenuItem(
  actor: Actor,
  values: MenuItemPatch & { categoryId: number; name: string; price: number }
) {
  const db = getDb()
  const [created] = await db.insert(menuItems).values(values).returning()
  await audit(actor, 'create', 'menu_item', created.id, { after: values })
  return created
}

/**
 * Deleting a dish is destructive and breaks nothing else only because
 * order_items snapshot the name and price. Prefer `isAvailable: false` for
 * anything that might come back on the menu.
 */
export async function deleteMenuItem(actor: Actor, id: number) {
  const db = getDb()
  const [before] = await db.select().from(menuItems).where(eq(menuItems.id, id)).limit(1)
  if (!before) return

  await db.delete(menuItems).where(eq(menuItems.id, id))
  await audit(actor, 'delete', 'menu_item', id, { before })
}

export async function updateCategory(
  actor: Actor,
  id: number,
  patch: Partial<{ name: string; blurb: string; sortOrder: number; isActive: boolean }>
) {
  const db = getDb()
  const [before] = await db
    .select()
    .from(menuCategories)
    .where(eq(menuCategories.id, id))
    .limit(1)
  if (!before) throw new Error(`Category ${id} does not exist.`)

  const [after] = await db
    .update(menuCategories)
    .set({ ...patch, updatedAt: new Date() })
    .where(eq(menuCategories.id, id))
    .returning()

  await audit(actor, 'update', 'menu_category', id, {
    before: pick(before, Object.keys(patch)),
    after: pick(after, Object.keys(patch)),
  })

  return after
}

/* ------------------------------------------------------ operational status -- */

export async function setOrderStatus(
  actor: Actor,
  id: number,
  status: typeof orders.$inferSelect.status
) {
  const db = getDb()
  const [before] = await db.select().from(orders).where(eq(orders.id, id)).limit(1)
  if (!before) throw new Error(`Order ${id} does not exist.`)

  const [after] = await db
    .update(orders)
    .set({ status, updatedAt: new Date() })
    .where(eq(orders.id, id))
    .returning()

  await audit(actor, 'update', 'order', id, {
    before: { status: before.status },
    after: { status: after.status },
  })

  return after
}

export async function setReservationStatus(
  actor: Actor,
  id: number,
  status: typeof reservations.$inferSelect.status
) {
  const db = getDb()
  const [before] = await db.select().from(reservations).where(eq(reservations.id, id)).limit(1)
  if (!before) throw new Error(`Reservation ${id} does not exist.`)

  const [after] = await db
    .update(reservations)
    .set({ status, updatedAt: new Date() })
    .where(eq(reservations.id, id))
    .returning()

  await audit(actor, 'update', 'reservation', id, {
    before: { status: before.status },
    after: { status: after.status },
  })

  return after
}

export async function setMessageStatus(
  actor: Actor,
  id: number,
  status: typeof contactMessages.$inferSelect.status
) {
  const db = getDb()
  const [after] = await db
    .update(contactMessages)
    .set({ status, updatedAt: new Date() })
    .where(eq(contactMessages.id, id))
    .returning()

  await audit(actor, 'update', 'contact_message', id, { after: { status } })
  return after
}

/* --------------------------------------------------------------- customers -- */

export async function updateCustomerNotes(actor: Actor, id: number, notes: string) {
  const db = getDb()
  const [after] = await db
    .update(customers)
    .set({ notes, updatedAt: new Date() })
    .where(eq(customers.id, id))
    .returning()

  await audit(actor, 'update', 'customer', id, { after: { notes } })
  return after
}

/**
 * Finds or creates the customer behind an order or booking, keyed on phone.
 *
 * Called from the public submission path, not the dashboard, which is why it
 * takes no actor and writes no audit row — the customer is acting, not staff.
 */
export async function upsertCustomer(input: {
  phone: string
  name: string
  email?: string | null
}) {
  const db = getDb()

  const [existing] = await db
    .select()
    .from(customers)
    .where(eq(customers.phone, input.phone))
    .limit(1)

  if (existing) {
    // Keep the freshest name/email we have been given.
    const [updated] = await db
      .update(customers)
      .set({
        name: input.name || existing.name,
        email: input.email ?? existing.email,
        updatedAt: new Date(),
      })
      .where(eq(customers.id, existing.id))
      .returning()
    return updated
  }

  const [created] = await db
    .insert(customers)
    .values({ phone: input.phone, name: input.name, email: input.email ?? null })
    .returning()
  return created
}
