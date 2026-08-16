import { site } from '@/lib/site'

export type Faq = { id: string; question: string; answer: string }

/**
 * Five questions, answered the way we would answer them on the phone.
 * Also fed to the FAQPage JSON-LD so they can win a rich result.
 */
export const faqs: Faq[] = [
  {
    id: 'pure-veg',
    question: 'Is the kitchen genuinely pure vegetarian?',
    answer:
      "Yes — completely. No eggs, no meat stock, no shared fryers, and no exceptions for any dish on the menu including the pizzas, pastas and desserts. Jain and no-onion-no-garlic preparations are cooked in separate pans by a separate section, so just tell us when you order.",
  },
  {
    id: 'delivery-time',
    question: 'How long does home delivery actually take?',
    answer: `${site.promise.delivery}. We run our own riders with insulated bags rather than pooling orders through an aggregator, and you get the rider's phone number by SMS the moment your order leaves the kitchen. Outside 5 km we will still deliver, but we will tell you upfront that it will take closer to an hour.`,
  },
  {
    id: 'reservation',
    question: 'Do I need to book a table, and how fast is it confirmed?',
    answer: `Walk-ins are welcome and usually fine on weekdays. For Friday to Sunday evenings, and for any group of six or more, book ahead. ${site.promise.reservation} — a real person calls you, not an automated message. We hold booked tables for fifteen minutes past the reservation time.`,
  },
  {
    id: 'catering',
    question: 'Can you cater a wedding or a large private event?',
    answer:
      'We cater from 30 guests up to 800, with live chaat, dosa and tandoor counters. Per-plate pricing starts at ₹449 and includes chafing dishes, serving staff at one per 25 guests, and transport within Delhi NCR. We need 7 days notice under 100 guests and 21 days above that. The first-floor banquet hall is also available for 120 seated or 180 standing.',
  },
  {
    id: 'payment',
    question: 'What payment methods do you accept?',
    answer: `UPI (GPay, PhonePe, Paytm), all major credit and debit cards including Amex, digital wallets, and cash. Catering and banquet invoices can also be settled by net banking or NEFT. Card and UPI payment is accepted at the door for cash-on-delivery orders too.`,
  },
]
