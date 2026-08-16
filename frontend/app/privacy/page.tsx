import type { Metadata } from 'next'
import { LegalLayout, type LegalSection } from '@/components/layout/legal-layout'
import { ConsentControls } from '@/components/shared/consent-controls'
import { pageMeta } from '@/lib/seo'
import { site, fullAddress } from '@/lib/site'

export const metadata: Metadata = pageMeta({
  title: 'Privacy Policy',
  description:
    'What Morsaab’s collects when you order, book a table or send a message, why we collect it, how long we keep it, and how to have it deleted.',
  path: '/privacy',
})

const sections: LegalSection[] = [
  {
    id: 'who-we-are',
    heading: 'Who we are',
    paragraphs: [
      `${site.legalName} operates this website and the restaurant at ${fullAddress}. In data-protection terms we are the data fiduciary for the information described here.`,
      `If you want to reach a person about any of this, email ${site.email} or call ${site.phoneDisplay} during opening hours.`,
    ],
  },
  {
    id: 'what-we-collect',
    heading: 'What we collect, and when',
    paragraphs: [
      'We only collect information you type into a form, plus a small amount of anonymous usage data if you allow it. We do not buy data about you from anyone else.',
    ],
    list: [
      'Reservations: your name, phone number, optional email, and the date, time, party size and any dietary notes you give us.',
      'Orders: your name, phone number, and — for delivery — your address and any landmark or delivery instructions.',
      'Messages: your name, email, phone number, the subject you pick and what you write.',
      'Feedback: the thumbs up or down you tap, and the optional note that follows it.',
      'Analytics (only with consent): pages viewed, approximate city, device type, and which links and buttons were used. Your IP address is truncated before it is stored.',
    ],
  },
  {
    id: 'why',
    heading: 'Why we use it',
    list: [
      'To take, confirm and deliver your order or booking — this is the main reason, and it is a contractual necessity.',
      'To call you back if something on your order is unavailable or an address is unclear.',
      'To answer catering and banquet enquiries with an accurate quote.',
      'To understand which dishes and pages people look for, so the menu and the site get better. This runs on your consent and you can withdraw it below.',
      'To meet our legal obligations — tax records, food safety records, and any invoice we have to keep.',
    ],
  },
  {
    id: 'cookies',
    heading: 'Cookies and similar technologies',
    paragraphs: [
      'The site sets no analytics or advertising cookies until you accept them. Google Analytics loads in consent mode with storage denied, meaning the first page view is measured without cookies and without anything that identifies you.',
      'Two things are stored on your device regardless, because the site cannot work without them: your theme choice and your cookie decision. Both are kept in your browser’s local storage, never sent to us, and cleared when you clear site data. Your order basket is kept the same way so it survives a reload.',
      'Campaign parameters (utm_source and similar) are kept in session storage and disappear when you close the tab.',
    ],
  },
  {
    id: 'sharing',
    heading: 'Who else sees it',
    paragraphs: [
      'We do not sell your data and we do not share it for anyone else’s marketing. It is seen by:',
    ],
    list: [
      'Our own staff — the kitchen, the floor manager and the rider handling your order.',
      'Google Analytics, if you have consented to analytics.',
      'Our hosting and infrastructure providers, who process data on our instructions and cannot use it for their own purposes.',
      'Anyone we are legally required to disclose to — a court order, a tax authority, or a food-safety inspection.',
    ],
  },
  {
    id: 'retention',
    heading: 'How long we keep it',
    list: [
      'Reservation and order records: 24 months, so we can look up a past visit if you ask us to.',
      'Contact messages: 12 months after the conversation ends.',
      'Catering and banquet contracts and invoices: 8 years, as tax law requires.',
      'Analytics data: 14 months, then automatically deleted by Google.',
      'Feedback notes: 12 months, and they are separated from your contact details as soon as we have acted on them.',
    ],
  },
  {
    id: 'your-rights',
    heading: 'Your rights',
    paragraphs: [
      'You can ask us for a copy of what we hold about you, ask us to correct it, or ask us to delete it. You can also withdraw consent for analytics at any time using the control at the bottom of this page.',
      `Write to ${site.email} with "Data request" in the subject line. We will respond within 30 days. We may ask you to confirm the phone number used for a booking, so we do not hand your information to somebody else.`,
      'If you are not satisfied with how we handle it, you can complain to the Data Protection Board of India.',
    ],
  },
  {
    id: 'children',
    heading: 'Children',
    paragraphs: [
      'The site is not aimed at children and we do not knowingly collect data from anyone under 18. Bookings are made by adults. If you believe a child has given us their details, email us and we will delete them.',
    ],
  },
  {
    id: 'security',
    heading: 'Security',
    paragraphs: [
      'The site is served over HTTPS. Submissions travel encrypted, and access to booking records is limited to staff who need it to do their job. No system is perfect, and we will tell affected people promptly if something goes wrong.',
      'We never ask for your card details, your PIN or a one-time password over the phone, by email or on this site. Payment happens in person or through your own UPI app.',
    ],
  },
  {
    id: 'changes',
    heading: 'Changes to this policy',
    paragraphs: [
      'When we change this document we update the date at the top. If a change materially affects how we use your data, we will say so on the site rather than quietly editing the page.',
    ],
  },
]

export default function PrivacyPage() {
  return (
    <>
      <LegalLayout
        eyebrow="Legal"
        title="Privacy Policy"
        lede="What we collect when you order, book or write to us — in plain language, with no clauses designed to be skipped."
        path="/privacy"
        sections={sections}
      />

      <section className="pb-20">
        <div className="container-royal">
          <div className="mx-auto max-w-3xl">
            <ConsentControls />
          </div>
        </div>
      </section>
    </>
  )
}
