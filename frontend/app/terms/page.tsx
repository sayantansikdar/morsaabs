import type { Metadata } from 'next'
import { LegalLayout, type LegalSection } from '@/components/layout/legal-layout'
import { pageMeta } from '@/lib/seo'
import { site, fullAddress } from '@/lib/site'

export const metadata: Metadata = pageMeta({
  title: 'Terms of Service',
  description:
    'The terms covering orders, table reservations, catering contracts, the banquet hall, cancellations and our quality guarantee at Morsaab’s.',
  path: '/terms',
})

const sections: LegalSection[] = [
  {
    id: 'about',
    heading: 'About these terms',
    paragraphs: [
      `These terms apply when you order food, book a table, or engage ${site.legalName} for catering or a banquet, whether through this website, by phone, or in person at ${fullAddress}.`,
      'Using the site or placing an order means you accept them. If something here does not work for your situation, call us — most of it is negotiable in advance and none of it in arrears.',
    ],
  },
  {
    id: 'orders',
    heading: 'Orders, delivery and takeaway',
    list: [
      'Minimum order for delivery is ₹199. Delivery is free above ₹399 and ₹29 below that.',
      'We deliver within roughly 5 km of the restaurant. Outside that we may accept the order but will tell you the realistic time before you commit.',
      'Delivery within 35–45 minutes is a genuine target and what we hit the large majority of the time. It is not a guarantee, and it does not survive weather, road closures or a Diwali evening — we will call you if we are going to be late.',
      'Prices on the menu include taxes. We do not add a service charge, and any delivery fee is shown before you confirm.',
      'Payment is due on delivery or collection, by UPI, card or cash. We do not take card details over the phone.',
      'If an item is unavailable we call you before cooking anything, and you can substitute or remove it.',
    ],
  },
  {
    id: 'reservations',
    heading: 'Table reservations',
    list: [
      'A reservation request is not confirmed until we call you back — usually within 15 minutes during service hours.',
      'We hold a booked table for 15 minutes past the reservation time. After that it may be released, because someone is usually waiting.',
      'Bookings for 20 or more are handled by our banquet team and may need a deposit.',
      'Please tell us about allergies and dietary requirements when you book, not on arrival — separate-pan cooking needs planning.',
      'There is no charge for a reservation and no charge for cancelling one. A phone call is appreciated.',
    ],
  },
  {
    id: 'catering',
    heading: 'Catering and banquet bookings',
    list: [
      'Catering starts at 30 guests. We need 7 days’ notice under 100 guests and 21 days above that.',
      'A signed quote and a 30% advance confirm the date. The balance falls due on the event day.',
      'The quoted per-plate price includes chafing dishes, serving staff at one per 25 guests, transport within Delhi NCR, setup and clearing. Anything else is itemised separately, in writing, before you sign.',
      'Final headcount is due 72 hours before the event. We cook to that number; increases after it are subject to what the kitchen can absorb.',
      'Cancellation more than 14 days out: the advance is refunded in full less any deposit already paid to a third-party supplier on your behalf. Between 14 and 7 days: half the advance is retained. Inside 7 days: the advance is retained, because the raw material has been bought and the staff rostered.',
      'Banquet hall rental is ₹15,000 for a four-hour slot, waived entirely on food packages above 80 guests.',
    ],
  },
  {
    id: 'guarantee',
    heading: 'Our quality guarantee',
    paragraphs: [
      site.guarantee.statement,
      'This is not a legal formality — it is how the floor manager is instructed to behave. Raise it with any member of staff and it will be honoured without a debate.',
    ],
  },
  {
    id: 'food-safety',
    heading: 'Food, allergens and dietary requirements',
    list: [
      'The kitchen is entirely vegetarian. No eggs, no meat, no shared fryers.',
      'Allergen information on the menu is given in good faith. The kitchen handles dairy, gluten, nuts, soy and sesame, so we cannot promise the absence of traces for a severe allergy.',
      'If you have a severe allergy, tell us before you order and speak to a manager. We would rather turn a dish down than take a risk with it.',
      'Jain, satvik and no-onion-no-garlic preparations are cooked in separate pans by a separate section. Please ask when ordering.',
    ],
  },
  {
    id: 'website',
    heading: 'Using this website',
    list: [
      'The content, photographs, recipes and writing on this site belong to us. You are welcome to link to any page. Please do not republish substantial extracts without asking.',
      'Menu prices and availability can change. The site is kept current, but the price confirmed on your order is what applies.',
      'Reviews and feedback you submit may be quoted publicly in anonymised form. Tell us if you would rather they were not.',
      'Do not use the forms to send abuse, spam or anything unlawful. We block and report where necessary.',
    ],
  },
  {
    id: 'liability',
    heading: 'Liability',
    paragraphs: [
      'Nothing here limits our liability for death or personal injury caused by our negligence, for fraud, or for anything else that cannot lawfully be limited — including our obligations under the Consumer Protection Act 2019 and food safety law.',
      'Beyond that, our liability in connection with an order is limited to the value of that order, and in connection with a catering contract to the value of that contract.',
      'We are not liable for delays caused by events outside our reasonable control — weather, road closures, civic restrictions or a power failure.',
    ],
  },
  {
    id: 'law',
    heading: 'Governing law and disputes',
    paragraphs: [
      'These terms are governed by the laws of India, and the courts of Delhi have jurisdiction.',
      `Before anything reaches a court, please talk to us. Email ${site.email} or call ${site.phoneDisplay} and ask for the manager. Nearly everything is resolvable in one conversation.`,
    ],
  },
]

export default function TermsPage() {
  return (
    <LegalLayout
      eyebrow="Legal"
      title="Terms of Service"
      lede="What you can expect from us, and what we need from you — for orders, bookings, catering and the banquet hall."
      path="/terms"
      sections={sections}
    />
  )
}
