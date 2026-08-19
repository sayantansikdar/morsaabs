/**
 * Database schema (Postgres via Drizzle).
 *
 * Mirrors the Zod shapes in `lib/validation.ts` — the forms and the tables must
 * agree, so field names and constraints are kept deliberately identical.
 *
 * Money: prices are integer **rupees**, exactly as the menu has always stored
 * them (`price: 349`). Restaurants here never price in fractional rupees, and
 * keeping the unit unchanged means the existing rendering keeps working. Stripe
 * wants minor units, so multiply by 100 at that boundary only — see
 * `toStripeAmount()` below. Never use a float for money.
 *
 * Not to be confused with `lib/schema.ts`, which is the JSON-LD/SEO schema.
 */

import {
  pgTable,
  pgEnum,
  serial,
  integer,
  text,
  varchar,
  boolean,
  timestamp,
  date,
  jsonb,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

/* ------------------------------------------------------------------ enums -- */

export const orderModeEnum = pgEnum('order_mode', ['delivery', 'takeaway'])
export const paymentMethodEnum = pgEnum('payment_method', ['upi', 'card', 'cash', 'stripe'])

/** Mirrors how the kitchen actually works, not a generic CRUD lifecycle. */
export const orderStatusEnum = pgEnum('order_status', [
  'pending', // submitted, nobody has looked yet
  'confirmed', // called back and accepted
  'preparing',
  'out_for_delivery',
  'completed',
  'cancelled',
])

export const paymentStatusEnum = pgEnum('payment_status', [
  'unpaid',
  'paid',
  'refunded',
  'failed',
])

export const reservationStatusEnum = pgEnum('reservation_status', [
  'pending',
  'confirmed',
  'seated',
  'completed',
  'no_show',
  'cancelled',
])

export const contactSubjectEnum = pgEnum('contact_subject', [
  'general',
  'catering',
  'banquet',
  'feedback',
  'careers',
])

export const contactStatusEnum = pgEnum('contact_status', ['new', 'read', 'replied', 'archived'])

/* ------------------------------------------------------------------- menu -- */

export const menuCategories = pgTable(
  'menu_categories',
  {
    id: serial('id').primaryKey(),
    slug: varchar('slug', { length: 80 }).notNull(),
    name: varchar('name', { length: 120 }).notNull(),
    blurb: text('blurb').notNull().default(''),
    /** Display order on the menu page; lower comes first. */
    sortOrder: integer('sort_order').notNull().default(0),
    isActive: boolean('is_active').notNull().default(true),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex('menu_categories_slug_idx').on(t.slug)]
)

export const menuItems = pgTable(
  'menu_items',
  {
    id: serial('id').primaryKey(),
    categoryId: integer('category_id')
      .notNull()
      .references(() => menuCategories.id, { onDelete: 'cascade' }),

    name: varchar('name', { length: 160 }).notNull(),
    /** Integer rupees. See the money note at the top of this file. */
    price: integer('price').notNull(),
    description: text('description').notNull().default(''),

    /** 0 = not spiced, 1 = mild, 2 = medium, 3 = fiery. Matches SpiceLevel. */
    spice: integer('spice').notNull().default(0),
    chefSpecial: boolean('chef_special').notNull().default(false),
    bestseller: boolean('bestseller').notNull().default(false),
    jain: boolean('jain').notNull().default(false),
    vegan: boolean('vegan').notNull().default(false),
    /** Allergen list, e.g. ['Dairy', 'Nuts']. */
    contains: jsonb('contains').$type<string[]>().notNull().default([]),

    /** Dish photography, uploaded through the admin dashboard. */
    imageUrl: text('image_url'),
    imageAlt: text('image_alt'),

    /** Lets staff 86 a dish without deleting it and losing its history. */
    isAvailable: boolean('is_available').notNull().default(true),
    sortOrder: integer('sort_order').notNull().default(0),

    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index('menu_items_category_idx').on(t.categoryId)]
)

/* -------------------------------------------------------------- customers -- */

/**
 * The CRM spine. Phone is the identity: it is the one field every order and
 * reservation carries, and it is how the restaurant already recognises people.
 * Stored as the bare 10-digit number the Zod transform produces.
 */
export const customers = pgTable(
  'customers',
  {
    id: serial('id').primaryKey(),
    phone: varchar('phone', { length: 10 }).notNull(),
    name: varchar('name', { length: 80 }).notNull(),
    email: varchar('email', { length: 160 }),
    /** Staff-only notes: allergies, regular table, "always calls ahead". */
    notes: text('notes'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex('customers_phone_idx').on(t.phone)]
)

/* ----------------------------------------------------------------- orders -- */

export const orders = pgTable(
  'orders',
  {
    id: serial('id').primaryKey(),
    /** Human-facing reference shown on the thank-you page, e.g. MRS-4F2A9C. */
    reference: varchar('reference', { length: 20 }).notNull(),

    customerId: integer('customer_id').references(() => customers.id, { onDelete: 'set null' }),

    // Denormalised contact details: an order must stay readable exactly as it
    // was placed even if the customer record is later edited or removed.
    name: varchar('name', { length: 80 }).notNull(),
    phone: varchar('phone', { length: 10 }).notNull(),

    mode: orderModeEnum('mode').notNull(),
    address: text('address'),
    landmark: varchar('landmark', { length: 120 }),
    /** Requested slot, free text from the form ("ASAP", "19:30"). */
    requestedTime: varchar('requested_time', { length: 40 }),
    notes: text('notes'),

    paymentMethod: paymentMethodEnum('payment_method').notNull(),
    paymentStatus: paymentStatusEnum('payment_status').notNull().default('unpaid'),
    /** Set only for Stripe payments; used to reconcile webhooks. */
    stripeSessionId: text('stripe_session_id'),
    stripePaymentIntentId: text('stripe_payment_intent_id'),

    /**
     * Integer rupees. Always recomputed server-side from the current menu
     * price of each line — never taken from the client, which would let a
     * crafted request set its own prices.
     */
    subtotal: integer('subtotal').notNull().default(0),
    discount: integer('discount').notNull().default(0),
    promoCode: varchar('promo_code', { length: 40 }),
    deliveryFee: integer('delivery_fee').notNull().default(0),
    total: integer('total').notNull().default(0),

    status: orderStatusEnum('status').notNull().default('pending'),

    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex('orders_reference_idx').on(t.reference),
    index('orders_status_idx').on(t.status),
    index('orders_created_idx').on(t.createdAt),
    index('orders_customer_idx').on(t.customerId),
  ]
)

/**
 * Line items snapshot the dish name and price at the time of ordering — an
 * admin editing a price later must never rewrite what a past customer paid.
 */
export const orderItems = pgTable(
  'order_items',
  {
    id: serial('id').primaryKey(),
    orderId: integer('order_id')
      .notNull()
      .references(() => orders.id, { onDelete: 'cascade' }),
    /** Nullable: the dish may be deleted from the menu later. */
    menuItemId: integer('menu_item_id').references(() => menuItems.id, { onDelete: 'set null' }),

    name: varchar('name', { length: 160 }).notNull(),
    unitPrice: integer('unit_price').notNull(),
    quantity: integer('quantity').notNull(),
    lineTotal: integer('line_total').notNull(),
  },
  (t) => [index('order_items_order_idx').on(t.orderId)]
)

/* ----------------------------------------------------------- reservations -- */

export const reservations = pgTable(
  'reservations',
  {
    id: serial('id').primaryKey(),
    reference: varchar('reference', { length: 20 }).notNull(),

    customerId: integer('customer_id').references(() => customers.id, { onDelete: 'set null' }),

    name: varchar('name', { length: 80 }).notNull(),
    phone: varchar('phone', { length: 10 }).notNull(),
    email: varchar('email', { length: 160 }),

    /** Calendar date only — a booking is for a day, not an instant. */
    date: date('date').notNull(),
    /** 24h "HH:MM", matching the form's 11:00–22:30 window. */
    time: varchar('time', { length: 5 }).notNull(),
    guests: integer('guests').notNull(),
    occasion: varchar('occasion', { length: 60 }),
    notes: text('notes'),

    status: reservationStatusEnum('status').notNull().default('pending'),

    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex('reservations_reference_idx').on(t.reference),
    index('reservations_date_idx').on(t.date),
    index('reservations_status_idx').on(t.status),
    index('reservations_customer_idx').on(t.customerId),
  ]
)

/* -------------------------------------------------------- contact inbox --- */

export const contactMessages = pgTable(
  'contact_messages',
  {
    id: serial('id').primaryKey(),
    customerId: integer('customer_id').references(() => customers.id, { onDelete: 'set null' }),

    name: varchar('name', { length: 80 }).notNull(),
    email: varchar('email', { length: 160 }).notNull(),
    phone: varchar('phone', { length: 10 }).notNull(),
    subject: contactSubjectEnum('subject').notNull(),
    message: text('message').notNull(),

    status: contactStatusEnum('status').notNull().default('new'),

    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index('contact_messages_status_idx').on(t.status)]
)

/* ------------------------------------------------------------ audit trail -- */

/**
 * Who changed what. A dashboard that can rewrite prices needs this: without it
 * a wrong price has no author and no previous value to restore.
 */
export const adminAuditLog = pgTable(
  'admin_audit_log',
  {
    id: serial('id').primaryKey(),
    /** Clerk user id of the admin who acted. */
    actorId: varchar('actor_id', { length: 80 }).notNull(),
    actorEmail: varchar('actor_email', { length: 160 }),
    action: varchar('action', { length: 40 }).notNull(), // create | update | delete
    entity: varchar('entity', { length: 40 }).notNull(), // menu_item | order | ...
    entityId: varchar('entity_id', { length: 40 }).notNull(),
    /** Before/after payload, enough to explain or undo the change. */
    changes: jsonb('changes').$type<Record<string, unknown>>(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index('admin_audit_entity_idx').on(t.entity, t.entityId)]
)

/* -------------------------------------------------------------- relations -- */

export const menuCategoriesRelations = relations(menuCategories, ({ many }) => ({
  items: many(menuItems),
}))

export const menuItemsRelations = relations(menuItems, ({ one }) => ({
  category: one(menuCategories, {
    fields: [menuItems.categoryId],
    references: [menuCategories.id],
  }),
}))

export const customersRelations = relations(customers, ({ many }) => ({
  orders: many(orders),
  reservations: many(reservations),
  messages: many(contactMessages),
}))

export const ordersRelations = relations(orders, ({ one, many }) => ({
  customer: one(customers, { fields: [orders.customerId], references: [customers.id] }),
  items: many(orderItems),
}))

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, { fields: [orderItems.orderId], references: [orders.id] }),
  menuItem: one(menuItems, { fields: [orderItems.menuItemId], references: [menuItems.id] }),
}))

export const reservationsRelations = relations(reservations, ({ one }) => ({
  customer: one(customers, { fields: [reservations.customerId], references: [customers.id] }),
}))

/* ------------------------------------------------------------------ types -- */

export type MenuCategoryRow = typeof menuCategories.$inferSelect
export type NewMenuCategory = typeof menuCategories.$inferInsert
export type MenuItemRow = typeof menuItems.$inferSelect
export type NewMenuItem = typeof menuItems.$inferInsert
export type CustomerRow = typeof customers.$inferSelect
export type OrderRow = typeof orders.$inferSelect
export type NewOrder = typeof orders.$inferInsert
export type OrderItemRow = typeof orderItems.$inferSelect
export type ReservationRow = typeof reservations.$inferSelect
export type NewReservation = typeof reservations.$inferInsert
export type ContactMessageRow = typeof contactMessages.$inferSelect

/** Rupees → paise. Stripe charges in minor units; nothing else should. */
export function toStripeAmount(rupees: number): number {
  return Math.round(rupees * 100)
}
