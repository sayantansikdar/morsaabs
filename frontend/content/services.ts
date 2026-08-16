import { site } from '@/lib/site'

export type Service = {
  slug: string
  name: string
  short: string
  /** Used as the page <h1> lede and the OG description. */
  summary: string
  icon: 'utensils' | 'bag' | 'bike' | 'chefhat' | 'crown'
  responsePromise: string
  priceNote: string
  highlights: string[]
  /** Long-form body, rendered as paragraphs. */
  body: string[]
  inclusions: { title: string; detail: string }[]
  cta: { label: string; href: string }
}

export const services: Service[] = [
  {
    slug: 'dine-in',
    name: 'Dine-In',
    short: 'Ninety covers under carved arches, seven days a week.',
    summary:
      'Ninety covers across two floors, arched alcoves for couples, long tables for families, and a kitchen you can watch through the pass.',
    icon: 'utensils',
    responsePromise: site.promise.reservation,
    priceNote: 'No cover charge · Reservations free',
    highlights: ['90 covers over two floors', 'Fully air-conditioned', 'High chairs & baby changing', 'Free Wi-Fi'],
    body: [
      'The ground floor is built for the ordinary weeknight — quick thalis, dosas off the griddle, a coffee while you wait for a takeaway. The mezzanine is quieter, with six arched alcoves that seat four each, and it is where most anniversary dinners end up.',
      'We hold tables for fifteen minutes past a booking. Beyond that we release them, because on a Saturday evening there is always a family waiting at the door. If you are running late, one call to the restaurant keeps your table.',
      'Every table is laid with a printed menu, but the QR menu is the one we keep current — daily specials go up there by 11 AM.',
    ],
    inclusions: [
      { title: 'Seating', detail: '90 covers · tables of 2, 4, 6 and one 12-seat banquet table' },
      { title: 'Accessibility', detail: 'Step-free ground floor entry, accessible washroom' },
      { title: 'Parking', detail: 'Street parking on Rama Park Road; valet on Friday–Sunday evenings' },
      { title: 'Timing', detail: `${site.hours.display}, ${site.hours.days.toLowerCase()}` },
    ],
    cta: { label: 'Book a Table', href: '/reserve' },
  },
  {
    slug: 'takeaway',
    name: 'Takeaway',
    short: 'Order ahead, collect hot, skip the queue entirely.',
    summary:
      'Call or order online, and your food is packed, sealed and waiting at the counter at the time you asked for it.',
    icon: 'bag',
    responsePromise: 'Ready for collection in 20–25 minutes',
    priceNote: 'No packing charge on orders above ₹499',
    highlights: ['Ready in 20–25 min', 'Sealed & tamper-evident', 'Gravy packed separately', 'Counter pickup, no queue'],
    body: [
      'Takeaway is packed differently from delivery. Gravies travel in leak-proof containers, breads go into a paper sleeve rather than plastic so they do not steam and go limp, and anything fried is packed vented.',
      'Tell us the collection time when you order and we time the cooking backwards from it. Food that sits under a lamp for twenty minutes is not food we want to hand you.',
    ],
    inclusions: [
      { title: 'Packaging', detail: 'Food-grade, microwave-safe, tamper-evident seals' },
      { title: 'Cutlery', detail: 'Provided on request — we do not add it by default' },
      { title: 'Payment', detail: 'Pay online in advance or at the counter on collection' },
      { title: 'Bulk orders', detail: '10+ portions need 90 minutes notice' },
    ],
    cta: { label: 'Start a Takeaway Order', href: '/order?mode=takeaway' },
  },
  {
    slug: 'home-delivery',
    name: 'Home Delivery',
    short: 'Hot at your door across Uttam Nagar and Dwarka Mor.',
    summary:
      'Insulated-bag delivery across a 5 km radius covering Uttam Nagar, Mohan Garden, Dwarka Mor, Bindapur and Matiala.',
    icon: 'bike',
    responsePromise: site.promise.delivery,
    priceNote: 'Free above ₹399 · ₹29 below',
    highlights: [site.promise.deliveryShort, 'Free above ₹399', 'Live rider contact', 'Insulated hot-bags'],
    body: [
      'We deliver ourselves within 5 km rather than handing everything to an aggregator, because the difference between a 35-minute biryani and a 70-minute one is the whole dish. Our riders carry insulated bags and run three drops maximum per trip.',
      'Delivery area: Uttam Nagar, Mohan Garden, Rama Park, Bindapur, Matiala, Dwarka Mor, Nawada and Janakpuri West. Outside that we will still take the order but we will tell you honestly that it will take an hour.',
      'You get the rider’s number by SMS the moment the order leaves the kitchen.',
    ],
    inclusions: [
      { title: 'Radius', detail: '5 km — Uttam Nagar, Mohan Garden, Dwarka Mor, Bindapur, Matiala' },
      { title: 'Minimum order', detail: '₹199' },
      { title: 'Delivery fee', detail: 'Free above ₹399, otherwise ₹29 flat' },
      { title: 'Payment', detail: 'UPI, card on delivery, or cash' },
    ],
    cta: { label: 'Order for Delivery', href: '/order?mode=delivery' },
  },
  {
    slug: 'catering',
    name: 'Catering',
    short: 'Live counters and full menus, from 30 guests to 800.',
    summary:
      'Off-site catering for weddings, corporate offsites, housewarmings and society events — with live chaat, dosa and tandoor counters.',
    icon: 'chefhat',
    responsePromise: site.promise.enquiry,
    priceNote: 'From ₹449 per plate · 30 guests minimum',
    highlights: ['30 to 800 guests', 'Live counters', 'Jain & no-onion-garlic menus', 'FSSAI licensed'],
    body: [
      'We have catered everything from a 30-person mundan to an 800-guest wedding at a farmhouse on Najafgarh Road. The kitchen scales; the standard does not change.',
      'Every catering menu is costed per plate with no hidden service charge. What you are quoted includes chafing dishes, serving staff at one per 25 guests, disposable or crockery service, and transport within Delhi NCR.',
      'Jain, satvik and no-onion-no-garlic menus are not an afterthought — they are cooked in separate pans by a separate section, and we will walk you through exactly how before you book.',
    ],
    inclusions: [
      { title: 'Guest range', detail: '30 minimum, 800 comfortable, more on request' },
      { title: 'Notice', detail: '7 days for under 100 guests, 21 days above' },
      { title: 'Staffing', detail: '1 server per 25 guests, 1 supervisor per event' },
      { title: 'Included', detail: 'Chafing dishes, transport within NCR, setup and clearing' },
    ],
    cta: { label: 'Request a Catering Quote', href: '/contact?service=catering' },
  },
  {
    slug: 'banquet',
    name: 'Banquet Hall',
    short: 'The first-floor durbar hall, yours for the evening.',
    summary:
      'Our first-floor hall seats 120 for a sit-down dinner or holds 180 standing, with its own entrance, sound system and projector.',
    icon: 'crown',
    responsePromise: 'Site visit arranged within 24 hours',
    priceNote: 'From ₹899 per plate · Hall rental waived above 80 guests',
    highlights: ['120 seated / 180 standing', 'Private entrance', 'Projector & PA system', 'Decor partners on call'],
    body: [
      'The banquet floor was built to look like a durbar hall and it does the job — carved arches, brass sconces, a deep maroon and gold scheme that photographs well without any extra decor.',
      'It comes with its own street entrance and staircase, so a private function never mixes with the restaurant downstairs. There is a 4K projector, a six-speaker PA, and a small green room behind the stage.',
      'Hall rental is waived entirely when you cross 80 guests on a food package. Below that it is ₹15,000 for a four-hour slot.',
    ],
    inclusions: [
      { title: 'Capacity', detail: '120 seated dinner · 180 standing reception · 60 theatre-style' },
      { title: 'Slots', detail: 'Lunch 12–4 PM, Dinner 7–11 PM, four hours each' },
      { title: 'Included', detail: 'Projector, PA system, basic stage, green room, parking coordination' },
      { title: 'Decor', detail: 'Bring your own or use our partner florist and lighting team' },
    ],
    cta: { label: 'Enquire About the Hall', href: '/contact?service=banquet' },
  },
]

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug)
}
