import { Suspense } from 'react'
import type { Metadata } from 'next'
import { PageHeader } from '@/components/layout/page-header'
import { ContactForm } from '@/components/forms/contact-form'
import { LocationSection } from '@/components/sections/location'
import { FaqSection } from '@/components/sections/faq'
import { RoyalLoader } from '@/components/ui/royal'
import { CopyButton } from '@/components/shared/copy-button'
import { pageMeta } from '@/lib/seo'
import { site } from '@/lib/site'

export const metadata: Metadata = pageMeta({
  title: 'Contact & Directions — Rama Park Road, Uttam Nagar, New Delhi',
  description: `Call ${site.phoneDisplay}, email ${site.email}, or find us at Rama Park Road, Uttam Nagar — 7 minutes from Dwarka Mor metro. Catering and banquet enquiries answered within 2 hours.`,
  path: '/contact',
  keywords: [
    'Morsaabs contact number',
    'restaurant address Uttam Nagar',
    'directions Dwarka Mor restaurant',
    'catering enquiry New Delhi',
  ],
})

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Get in Touch"
        title="Contact Us"
        lede="Call during service hours and someone picks up. Everything else comes to this form, and we answer catering and banquet enquiries within two hours."
        trail={[{ name: 'Contact', href: '/contact' }]}
      />

      <section className="py-14 sm:py-20">
        <div className="container-royal">
          <div className="grid gap-10 lg:grid-cols-[1.25fr_1fr] lg:gap-14">
            <div className="rounded-3xl border border-gold-400/25 bg-card p-6 sm:p-8">
              <h2 className="font-display text-2xl font-bold text-foreground">
                Send us a message
              </h2>
              <p className="mt-2 text-muted-foreground">
                Everything marked with an asterisk is required.
              </p>
              <div className="mt-8">
                <Suspense fallback={<RoyalLoader label="Preparing the form…" />}>
                  <ContactForm />
                </Suspense>
              </div>
            </div>

            <aside className="space-y-4">
              <div className="rounded-2xl border border-gold-400/25 bg-card p-6">
                <h2 className="font-display text-lg font-bold text-foreground">
                  Reach a person directly
                </h2>

                <dl className="mt-5 space-y-5">
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-widest text-gold-600 dark:text-gold-300">
                      Phone
                    </dt>
                    <dd className="mt-1 flex flex-wrap items-center gap-2">
                      <a
                        href={`tel:${site.phone}`}
                        className="tnum rounded font-display text-xl font-bold text-maroon-700 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring dark:text-gold-300"
                      >
                        {site.phoneDisplay}
                      </a>
                      <CopyButton value={site.phoneDisplay} label="phone number" />
                    </dd>
                  </div>

                  <div className="border-t border-border pt-5">
                    <dt className="text-xs font-semibold uppercase tracking-widest text-gold-600 dark:text-gold-300">
                      General enquiries
                    </dt>
                    <dd className="mt-1 flex flex-wrap items-center gap-2">
                      <a
                        href={`mailto:${site.email}`}
                        className="break-anywhere rounded font-medium text-foreground underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        {site.email}
                      </a>
                      <CopyButton value={site.email} label="email address" />
                    </dd>
                  </div>

                  <div className="border-t border-border pt-5">
                    <dt className="text-xs font-semibold uppercase tracking-widest text-gold-600 dark:text-gold-300">
                      Reservations
                    </dt>
                    <dd className="mt-1">
                      <a
                        href={`mailto:${site.reservationEmail}`}
                        className="break-anywhere rounded font-medium text-foreground underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        {site.reservationEmail}
                      </a>
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="rounded-2xl border border-gold-400/25 bg-card p-6">
                <h2 className="font-display text-lg font-bold text-foreground">
                  How quickly we reply
                </h2>
                <ul className="mt-4 space-y-3 text-sm">
                  {[
                    ['Phone during service hours', 'Immediately'],
                    ['Reservation requests', 'Within 15 minutes'],
                    ['Catering & banquet', 'Within 2 hours'],
                    ['General messages', 'Same day'],
                  ].map(([what, when]) => (
                    <li key={what} className="flex justify-between gap-4 border-b border-border pb-3 last:border-0 last:pb-0">
                      <span className="text-muted-foreground">{what}</span>
                      <span className="shrink-0 font-semibold text-foreground">{when}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <LocationSection />
      <FaqSection className="bg-muted/40 py-20 sm:py-28" />
    </>
  )
}
