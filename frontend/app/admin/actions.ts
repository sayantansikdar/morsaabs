'use server'

/**
 * Server actions for the dashboard.
 *
 * Each one re-checks the admin actor. The layout gate stops someone *seeing*
 * the dashboard; it does nothing to stop a crafted POST to a server action,
 * which is a public endpoint by construction. Authorisation therefore lives
 * here as well, not only in the layout.
 *
 * Inputs are validated with Zod rather than trusted: a server action receives
 * whatever the client sends, exactly like a route handler.
 */

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { getAdminActor } from '@/lib/admin-auth'
import {
  updateMenuItem,
  createMenuItem,
  deleteMenuItem,
  setOrderStatus,
  setReservationStatus,
  setMessageStatus,
  updateCustomerNotes,
} from '@/lib/db/mutations'

export type ActionResult = { ok: true } | { ok: false; error: string }

async function actor() {
  const found = await getAdminActor()
  if (!found) throw new Error('Not authorised.')
  return found
}

/** Wraps an action so a thrown error becomes a message the UI can render. */
async function run(fn: () => Promise<void>): Promise<ActionResult> {
  try {
    await fn()
    return { ok: true }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Something went wrong.'
    // Never leak an internal error string to the client for an auth failure.
    return { ok: false, error: message === 'Not authorised.' ? message : 'Could not save that change. Please try again.' }
  }
}

/* ------------------------------------------------------------------- menu -- */

const priceSchema = z
  .number({ invalid_type_error: 'Enter the price in rupees.' })
  .int('Prices are whole rupees — no paise.')
  .min(1, 'A price must be at least ₹1.')
  .max(100000, 'That price looks wrong. Check it before saving.')

const menuItemPatchSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().trim().min(2).max(160).optional(),
  price: priceSchema.optional(),
  description: z.string().trim().max(500).optional(),
  spice: z.number().int().min(0).max(3).optional(),
  chefSpecial: z.boolean().optional(),
  bestseller: z.boolean().optional(),
  jain: z.boolean().optional(),
  vegan: z.boolean().optional(),
  isAvailable: z.boolean().optional(),
  imageUrl: z.string().url('That does not look like a valid image URL.').nullable().optional(),
  imageAlt: z.string().trim().max(300).nullable().optional(),
})

export async function updateMenuItemAction(
  input: z.input<typeof menuItemPatchSchema>
): Promise<ActionResult> {
  return run(async () => {
    const who = await actor()
    const { id, ...patch } = menuItemPatchSchema.parse(input)
    await updateMenuItem(who, id, patch)
    revalidatePath('/admin/menu')
    // The public menu is rendered from the same data.
    revalidatePath('/menu')
  })
}

const newMenuItemSchema = z.object({
  categoryId: z.number().int().positive(),
  name: z.string().trim().min(2, 'Give the dish a name.').max(160),
  price: priceSchema,
  description: z.string().trim().max(500).default(''),
  spice: z.number().int().min(0).max(3).default(0),
})

export async function createMenuItemAction(
  input: z.input<typeof newMenuItemSchema>
): Promise<ActionResult> {
  return run(async () => {
    const who = await actor()
    await createMenuItem(who, newMenuItemSchema.parse(input))
    revalidatePath('/admin/menu')
    revalidatePath('/menu')
  })
}

export async function deleteMenuItemAction(id: number): Promise<ActionResult> {
  return run(async () => {
    const who = await actor()
    await deleteMenuItem(who, z.number().int().positive().parse(id))
    revalidatePath('/admin/menu')
    revalidatePath('/menu')
  })
}

/* ------------------------------------------------------ operational status -- */

const orderStatuses = [
  'pending',
  'confirmed',
  'preparing',
  'out_for_delivery',
  'completed',
  'cancelled',
] as const

export async function setOrderStatusAction(
  id: number,
  status: (typeof orderStatuses)[number]
): Promise<ActionResult> {
  return run(async () => {
    const who = await actor()
    await setOrderStatus(who, z.number().int().positive().parse(id), z.enum(orderStatuses).parse(status))
    revalidatePath('/admin/orders')
    revalidatePath('/admin')
  })
}

const reservationStatuses = [
  'pending',
  'confirmed',
  'seated',
  'completed',
  'no_show',
  'cancelled',
] as const

export async function setReservationStatusAction(
  id: number,
  status: (typeof reservationStatuses)[number]
): Promise<ActionResult> {
  return run(async () => {
    const who = await actor()
    await setReservationStatus(
      who,
      z.number().int().positive().parse(id),
      z.enum(reservationStatuses).parse(status)
    )
    revalidatePath('/admin/reservations')
    revalidatePath('/admin')
  })
}

const messageStatuses = ['new', 'read', 'replied', 'archived'] as const

export async function setMessageStatusAction(
  id: number,
  status: (typeof messageStatuses)[number]
): Promise<ActionResult> {
  return run(async () => {
    const who = await actor()
    await setMessageStatus(
      who,
      z.number().int().positive().parse(id),
      z.enum(messageStatuses).parse(status)
    )
    revalidatePath('/admin/messages')
    revalidatePath('/admin')
  })
}

export async function updateCustomerNotesAction(
  id: number,
  notes: string
): Promise<ActionResult> {
  return run(async () => {
    const who = await actor()
    await updateCustomerNotes(
      who,
      z.number().int().positive().parse(id),
      z.string().trim().max(2000).parse(notes)
    )
    revalidatePath('/admin/customers')
  })
}
