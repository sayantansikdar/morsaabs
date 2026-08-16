import { Suspense } from 'react'
import type { Metadata } from 'next'
import Image from 'next/image'
import { Clock, MapPin, Phone, Users } from 'lucide-react'
import { PageHeader } from '@/components/layout/page-header'
import { ReservationForm } from '@/components/forms/reservation-form'
import { ArchFrame, RoyalLoader } from '@/components/ui/royal'
import { media } from '@/content/media'
import { pageMeta } from '@/lib/seo'
import { site, fullAddress } from '@/lib/site'

export const metadata: Metadata = pageMeta({
  title: 'Book a Table — Confirmed by Call in 15 Minutes',
  description:
    'Reserve a table at Morsaab’s, Rama Park Road, Uttam Nagar. Ninety covers, arched alcoves on the mezzanine, open 11 AM–11 PM daily. A real person calls to confirm within 15 minutes.',
  path: '/reserve',
  keywords: [
    'book table Uttam Nagar restaurant',
    'restaurant reservation Dwarka Mor',
    'table booking veg restaurant Delhi',
  ],
})

export default function ReservePage() {
  return (
    <>
      <PageHeader
        eyebrow="Reservations"
        title="Book a Table"
        lede={`${site.promise.reservation}. Walk-ins are welcome too — weekdays are rarely a problem.`}
        trail={[{ name: 'Book a Table', href: '/reserve' }]}
      />

      <section className="py-14 sm:py-20">
        <div className="container-royal">
          <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:gap-14">
            <div className="rounded-3xl border border-gold-400/25 bg-card p-6 sm:p-8">
              <Suspense fallback={<RoyalLoader label="Opening the reservation book…" />}>
                <ReservationForm />
              </Suspense>
            </div>

            <aside className="space-y-6">
              <ArchFrame className="aspect-[4/5] w-full" cusped>
                <Image
                  src={media.interiorArches.src}
                  alt={media.interiorArches.alt}
                  fill
                  sizes="(min-width: 1024px) 32vw, 90vw"
                  className="object-cover"
                />
              </ArchFrame>

              <div className="space-y-4 rounded-2xl border border-gold-400/25 bg-card p-6">
                <h2 className="font-display text-lg font-bold text-foreground">
                  Worth knowing
                </h2>

                {[
                  {
                    Icon: Clock,
                    title: 'Hours',
                    body: `${site.hours.display}, ${site.hours.days.toLowerCase()}. Last kitchen order 10:30 PM.`,
                  },
                  {
                    Icon: Users,
                    title: 'Large groups',
                    body: 'Up to 20 online. For more, our banquet floor seats 120 — call and ask for Vikram.',
                  },
                  {
                    Icon: MapPin,
                    title: 'Finding us',
                    body: fullAddress,
                  },
                  {
                    Icon: Phone,
                    title: 'Prefer to call?',
                    body: site.phoneDisplay,
                  },
                ].map((row) => (
                  <div key={row.title} className="flex gap-3 border-t border-border pt-4 first:border-0 first:pt-0">
                    <row.Icon
                      className="mt-0.5 size-4 shrink-0 text-gold-600 dark:text-gold-300"
                      aria-hidden="true"
                    />
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-foreground">{row.title}</h3>
                      <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">
                        {row.body}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  )
}
