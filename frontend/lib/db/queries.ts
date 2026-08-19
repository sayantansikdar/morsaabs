/**
 * Read queries for the public site and the admin dashboard.
 *
 * Everything here is server-only — these run in server components, route
 * handlers and server actions. Never import this into a client component: it
 * would pull the database driver and the connection string into the browser
 * bundle.
 */

import 'server-only'
import { and, asc, desc, eq, gte, ilike, or, sql, count } from 'drizzle-orm'
import { getDb } from './index'
import {
  menuCategories,
  menuItems,
  orders,
  orderItems,
  reservations,
  customers,
  contactMessages,
  type MenuItemRow,
} from './schema'

/* ------------------------------------------------------------------- menu -- */

export type MenuCategoryWithItems = {
  id: number
  slug: string
  name: string
  blurb: string
  sortOrder: number
  isActive: boolean
  items: MenuItemRow[]
}

/**
 * The full carte, ordered as it appears on the menu page.
 *
 * `includeUnavailable` is what separates the two audiences: the public menu
 * hides dishes that are 86'd, the dashboard must still show them so they can be
 * switched back on.
 */
export async function getMenu({
  includeUnavailable = false,
}: { includeUnavailable?: boolean } = {}): Promise<MenuCategoryWithItems[]> {
  const db = getDb()

  const rows = await db
    .select({
      category: menuCategories,
      item: menuItems,
    })
    .from(menuCategories)
    .leftJoin(menuItems, eq(menuItems.categoryId, menuCategories.id))
    .where(includeUnavailable ? undefined : eq(menuCategories.isActive, true))
    .orderBy(asc(menuCategories.sortOrder), asc(menuItems.sortOrder), asc(menuItems.id))

  const byId = new Map<number, MenuCategoryWithItems>()

  for (const { category, item } of rows) {
    let entry = byId.get(category.id)
    if (!entry) {
      entry = {
        id: category.id,
        slug: category.slug,
        name: category.name,
        blurb: category.blurb,
        sortOrder: category.sortOrder,
        isActive: category.isActive,
        items: [],
      }
      byId.set(category.id, entry)
    }
    // leftJoin yields a null item for an empty category.
    if (item && (includeUnavailable || item.isAvailable)) entry.items.push(item)
  }

  return [...byId.values()]
}

export async function getMenuItem(id: number): Promise<MenuItemRow | undefined> {
  const db = getDb()
  const [row] = await db.select().from(menuItems).where(eq(menuItems.id, id)).limit(1)
  return row
}

export async function listCategories() {
  const db = getDb()
  return db.select().from(menuCategories).orderBy(asc(menuCategories.sortOrder))
}

/* ----------------------------------------------------------------- orders -- */

export type OrderStatus = typeof orders.$inferSelect.status

export async function listOrders({
  status,
  search,
  limit = 50,
  offset = 0,
}: {
  status?: OrderStatus
  search?: string
  limit?: number
  offset?: number
} = {}) {
  const db = getDb()

  const filters = [
    status ? eq(orders.status, status) : undefined,
    search
      ? or(
          ilike(orders.name, `%${search}%`),
          ilike(orders.phone, `%${search}%`),
          ilike(orders.reference, `%${search}%`)
        )
      : undefined,
  ].filter(Boolean)

  return db
    .select()
    .from(orders)
    .where(filters.length ? and(...filters) : undefined)
    .orderBy(desc(orders.createdAt))
    .limit(limit)
    .offset(offset)
}

/** An order with its line items — what the detail drawer renders. */
export async function getOrder(id: number) {
  const db = getDb()
  const [order] = await db.select().from(orders).where(eq(orders.id, id)).limit(1)
  if (!order) return undefined

  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, id))
  return { ...order, items }
}

/* ----------------------------------------------------------- reservations -- */

export type ReservationStatus = typeof reservations.$inferSelect.status

export async function listReservations({
  status,
  fromDate,
  search,
  limit = 50,
  offset = 0,
}: {
  status?: ReservationStatus
  /** ISO date (YYYY-MM-DD); defaults to showing upcoming bookings only. */
  fromDate?: string
  search?: string
  limit?: number
  offset?: number
} = {}) {
  const db = getDb()

  const filters = [
    status ? eq(reservations.status, status) : undefined,
    fromDate ? gte(reservations.date, fromDate) : undefined,
    search
      ? or(
          ilike(reservations.name, `%${search}%`),
          ilike(reservations.phone, `%${search}%`),
          ilike(reservations.reference, `%${search}%`)
        )
      : undefined,
  ].filter(Boolean)

  return db
    .select()
    .from(reservations)
    .where(filters.length ? and(...filters) : undefined)
    .orderBy(asc(reservations.date), asc(reservations.time))
    .limit(limit)
    .offset(offset)
}

/* -------------------------------------------------------------- customers -- */

/**
 * The CRM list: every customer with their lifetime order count and spend.
 *
 * Aggregated in SQL rather than in JS — pulling every order into memory to count
 * them would fall over the first busy month.
 */
export async function listCustomers({
  search,
  limit = 50,
  offset = 0,
}: { search?: string; limit?: number; offset?: number } = {}) {
  const db = getDb()

  return db
    .select({
      id: customers.id,
      name: customers.name,
      phone: customers.phone,
      email: customers.email,
      notes: customers.notes,
      createdAt: customers.createdAt,
      orderCount: sql<number>`count(distinct ${orders.id})::int`,
      totalSpend: sql<number>`coalesce(sum(distinct ${orders.total}), 0)::int`,
      lastOrderAt: sql<Date | null>`max(${orders.createdAt})`,
    })
    .from(customers)
    .leftJoin(orders, eq(orders.customerId, customers.id))
    .where(
      search
        ? or(ilike(customers.name, `%${search}%`), ilike(customers.phone, `%${search}%`))
        : undefined
    )
    .groupBy(customers.id)
    .orderBy(desc(sql`max(${orders.createdAt})`))
    .limit(limit)
    .offset(offset)
}

export async function getCustomerHistory(customerId: number) {
  const db = getDb()

  const [customer] = await db
    .select()
    .from(customers)
    .where(eq(customers.id, customerId))
    .limit(1)
  if (!customer) return undefined

  const [customerOrders, customerReservations] = await Promise.all([
    db
      .select()
      .from(orders)
      .where(eq(orders.customerId, customerId))
      .orderBy(desc(orders.createdAt)),
    db
      .select()
      .from(reservations)
      .where(eq(reservations.customerId, customerId))
      .orderBy(desc(reservations.date)),
  ])

  return { customer, orders: customerOrders, reservations: customerReservations }
}

/* ---------------------------------------------------------- contact inbox -- */

export async function listContactMessages({ limit = 50, offset = 0 } = {}) {
  const db = getDb()
  return db
    .select()
    .from(contactMessages)
    .orderBy(desc(contactMessages.createdAt))
    .limit(limit)
    .offset(offset)
}

/* ------------------------------------------------------------ dashboard --- */

/** The counters on the dashboard landing page. One round trip, not six. */
export async function getDashboardStats() {
  const db = getDb()

  const [
    [pendingOrders],
    [upcomingReservations],
    [newMessages],
    [customerTotal],
    [dishTotal],
    [revenue],
  ] = await Promise.all([
    db.select({ n: count() }).from(orders).where(eq(orders.status, 'pending')),
    db
      .select({ n: count() })
      .from(reservations)
      .where(
        and(
          eq(reservations.status, 'pending'),
          gte(reservations.date, new Date().toISOString().slice(0, 10))
        )
      ),
    db.select({ n: count() }).from(contactMessages).where(eq(contactMessages.status, 'new')),
    db.select({ n: count() }).from(customers),
    db.select({ n: count() }).from(menuItems),
    db
      .select({ total: sql<number>`coalesce(sum(${orders.total}), 0)::int` })
      .from(orders)
      .where(eq(orders.status, 'completed')),
  ])

  return {
    pendingOrders: pendingOrders.n,
    upcomingReservations: upcomingReservations.n,
    newMessages: newMessages.n,
    customers: customerTotal.n,
    dishes: dishTotal.n,
    completedRevenue: revenue.total,
  }
}
