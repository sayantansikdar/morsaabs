/**
 * Stripe client.
 *
 * Lazy for the same reason the database client is: the secret key is read when
 * a payment is actually taken, not at import, so a build or a deployment
 * without Stripe configured still works and the rest of the site is unaffected.
 */

import 'server-only'
import Stripe from 'stripe'

let client: Stripe | null = null

export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY)
}

export function getStripe(): Stripe {
  if (client) return client

  const key = process.env.STRIPE_SECRET_KEY
  if (!key) {
    throw new Error(
      'STRIPE_SECRET_KEY is not set. Online payments are unavailable until it is.'
    )
  }

  client = new Stripe(key, {
    // Pinned deliberately: Stripe changes response shapes between versions, and
    // an implicit upgrade should never arrive by surprise in production.
    apiVersion: '2026-07-29.dahlia',
    typescript: true,
    appInfo: { name: "Morsaab's", url: 'https://morsaabs.vercel.app' },
  })

  return client
}

/**
 * Rupees (integer) to the smallest currency unit Stripe bills in.
 *
 * INR is a two-decimal currency, so ₹349 is 34900 paise. Money is stored as
 * whole rupees everywhere else, and this is the only place that changes — do
 * the conversion at the boundary, never earlier.
 */
export function toStripeAmount(rupees: number): number {
  if (!Number.isInteger(rupees) || rupees < 0) {
    throw new Error(`Refusing to charge a non-integer or negative amount: ${rupees}`)
  }
  return rupees * 100
}
