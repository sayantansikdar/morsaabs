/**
 * Single source of truth for every NAP (name/address/phone) detail on the site.
 * Local SEO depends on these strings being byte-identical across the page copy,
 * the JSON-LD schema and the Google Business Profile — so nothing hardcodes them.
 */

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ?? 'https://www.morsaabs.com'

/**
 * Subpath the site is served from — '' on a domain root, '/morsaabs' on
 * GitHub Pages.
 *
 * next/link, next/image and the file-convention icons get basePath applied
 * automatically. Anything we hand-write as an absolute path does not, so it
 * has to go through this.
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

/** Prefixes a root-relative path with the deployment's basePath. */
export function asset(path: string): string {
  return `${BASE_PATH}${path.startsWith('/') ? path : `/${path}`}`
}

export const site = {
  name: "Morsaab's",
  nameDevanagari: 'मोरसाब्स',
  legalName: "Morsaab's Restaurant",
  tagline: 'A Royal Taste of India',
  description:
    "Royal North Indian and Indo-Chinese vegetarian dining near Dwarka Mor, Uttam Nagar, New Delhi. Dine-in, takeaway, home delivery, catering and banquet.",
  url: SITE_URL,

  phone: '+919211997724',
  phoneDisplay: '+91 92119 97724',
  email: 'hello@morsaabs.com',
  reservationEmail: 'reservations@morsaabs.com',

  address: {
    street: 'I-47 & 48, Mohan Garden Extension, Block-I, Gali No. 4',
    road: 'Rama Park Road',
    locality: 'Uttam Nagar',
    landmark: 'Near Dwarka Mor Metro Station',
    region: 'Delhi',
    postalCode: '110059',
    country: 'IN',
    countryName: 'India',
  },

  geo: { latitude: 28.6244466, longitude: 77.0367727 },

  maps: {
    place:
      "https://www.google.com/maps/place/Morsaab's/@28.6244513,77.0341978,17z/data=!3m1!4b1!4m6!3m5!1s0x390d05d3521db1bf:0xbf86e89a4a8461eb!8m2!3d28.6244466!4d77.0367727!16s%2Fg%2F11x_4yfv04",
    directions:
      'https://www.google.com/maps/dir/?api=1&destination=28.6244466,77.0367727&destination_place_id=ChIJv7EdUtMFDTkR62KESprohr8',
    embed:
      'https://www.google.com/maps?q=28.6244466,77.0367727&hl=en&z=17&output=embed',
    reviews:
      "https://www.google.com/maps/place/Morsaab's/@28.6244513,77.0341978,17z/data=!4m6!3m5!1s0x390d05d3521db1bf:0xbf86e89a4a8461eb!9m1!1b1",
  },

  hours: {
    opens: '11:00',
    closes: '23:00',
    display: '11:00 AM – 11:00 PM',
    days: 'Open all seven days',
  },

  /** Feature 8 — the response-time promise, stated once and reused everywhere. */
  promise: {
    delivery: 'Delivered in 35–45 minutes within 5 km',
    deliveryShort: '35–45 min delivery',
    reservation: 'Table confirmed by call within 15 minutes',
    reservationShort: '15 min confirmation',
    enquiry: 'Catering and banquet enquiries answered within 2 hours',
    enquiryShort: '2 hour reply',
  },

  /** Feature 60 — formal quality & taste guarantee. */
  guarantee: {
    title: 'The Morsaab’s Royal Assurance',
    statement:
      'Every dish leaves our kitchen pure vegetarian, cooked to order in separate pans, and seasoned by a chef who tastes it first. If a dish does not meet the standard we promise, tell us within 30 minutes of delivery or before you leave the table and we will remake it or take it off your bill — no argument, no paperwork.',
    points: [
      '100% pure vegetarian kitchen — no eggs, no shared oil, no exceptions',
      'Cooked to order; nothing reheated from a holding tray',
      'FSSAI-licensed kitchen with daily temperature and oil-quality logs',
      'Remake or refund if a dish falls short of the standard',
    ],
  },

  payments: [
    'UPI (GPay, PhonePe, Paytm)',
    'Credit & Debit Cards (Visa, Mastercard, RuPay, Amex)',
    'Digital Wallets (Paytm, Amazon Pay)',
    'Cash',
    'Net Banking (catering & banquet invoices)',
  ],

  social: {
    instagram: 'https://www.instagram.com/morsaabs',
    facebook: 'https://www.facebook.com/morsaabs',
    twitter: 'https://twitter.com/morsaabs',
  },

  rating: { value: 4.8, count: 71 },

  /** Feature 29 — a copyable launch offer code. */
  offer: {
    code: 'ROYAL15',
    description: '15% off your first online order above ₹599',
    validTill: '2026-12-31',
  },

  /** Feature 48 — replace with the token from Search Console before launch. */
  googleSiteVerification:
    process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ?? 'google-site-verification-token-placeholder',
  gaMeasurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? '',
} as const

export const fullAddress = `${site.address.street}, ${site.address.road}, ${site.address.locality}, New ${site.address.region} – ${site.address.postalCode}`

/** Last content review — surfaced in the footer (feature 38). */
export const LAST_UPDATED = '2026-08-16'

export function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

export function formatPrice(paise: number): string {
  return `₹${paise.toLocaleString('en-IN')}`
}
