import { z } from 'zod'

/**
 * Feature 46 — every message says what is wrong *and* what to do about it.
 * "Invalid input" tells a guest nothing; "Enter a 10-digit mobile number
 * starting with 6, 7, 8 or 9" tells them exactly what to fix.
 */

const name = z
  .string()
  .trim()
  .min(2, 'Enter your name — at least two characters.')
  .max(80, 'That name is too long for our system. Please shorten it to 80 characters.')

const email = z
  .string()
  .trim()
  .min(1, 'Enter an email address so we can reply.')
  .email('That email address is missing an @ or a domain — check it and try again.')
  .max(160, 'That email address is too long.')

/** Indian mobile numbers: ten digits, starting 6–9. Spaces and +91 are tolerated. */
const phone = z
  .string()
  .trim()
  .min(1, 'Enter a phone number — we call to confirm.')
  .transform((v) => v.replace(/[\s\-()]/g, '').replace(/^(\+?91)/, ''))
  .pipe(
    z
      .string()
      .regex(
        /^[6-9]\d{9}$/,
        'Enter a 10-digit Indian mobile number starting with 6, 7, 8 or 9.'
      )
  )

export const contactSchema = z.object({
  name,
  email,
  phone,
  subject: z.enum(['general', 'catering', 'banquet', 'feedback', 'careers'], {
    errorMap: () => ({ message: 'Choose what your message is about.' }),
  }),
  message: z
    .string()
    .trim()
    .min(10, 'Tell us a little more — at least 10 characters so we can help properly.')
    .max(2000, 'That message is over 2,000 characters. Please trim it or call us instead.'),
  consent: z.literal(true, {
    errorMap: () => ({ message: 'Please tick this so we know we may reply to you.' }),
  }),
})
export type ContactInput = z.input<typeof contactSchema>

export const reservationSchema = z.object({
  name,
  phone,
  email: z.union([z.literal(''), email]).optional(),
  date: z
    .string()
    .min(1, 'Pick the date you would like to come in.')
    .refine((v) => {
      const picked = new Date(`${v}T00:00:00`)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      return picked >= today
    }, 'That date has passed — pick today or a date in the future.'),
  time: z
    .string()
    .min(1, 'Choose a time between 11:00 AM and 10:30 PM.')
    .refine((v) => v >= '11:00' && v <= '22:30', 'We seat between 11:00 AM and 10:30 PM. Pick a time in that window.'),
  guests: z.coerce
    .number({ invalid_type_error: 'Enter how many people are coming.' })
    .int('Enter a whole number of guests.')
    .min(1, 'At least one guest.')
    .max(20, 'For 20 or more, our banquet team handles the booking — call us on +91 92119 97724.'),
  occasion: z.string().trim().max(60).optional(),
  notes: z.string().trim().max(500, 'Please keep notes under 500 characters.').optional(),
})
export type ReservationInput = z.input<typeof reservationSchema>

export const orderSchema = z.object({
  name,
  phone,
  mode: z.enum(['delivery', 'takeaway'], {
    errorMap: () => ({ message: 'Choose delivery or takeaway.' }),
  }),
  address: z.string().trim().max(300).optional(),
  landmark: z.string().trim().max(120).optional(),
  time: z.string().optional(),
  notes: z.string().trim().max(400, 'Please keep instructions under 400 characters.').optional(),
  // 'stripe' is paying online now; the rest are settled on delivery or pickup.
  payment: z.enum(['upi', 'card', 'cash', 'stripe'], {
    errorMap: () => ({ message: 'Choose how you would like to pay.' }),
  }),
}).refine(
  (data) => data.mode !== 'delivery' || (data.address?.trim().length ?? 0) >= 10,
  {
    path: ['address'],
    message: 'We need a full delivery address — house or shop number, street and area.',
  }
)
export type OrderInput = z.input<typeof orderSchema>

/** Flattens a ZodError into the { field: message } shape the forms render. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {}
  for (const issue of error.issues) {
    const key = issue.path.join('.')
    if (key && !out[key]) out[key] = issue.message
  }
  return out
}
