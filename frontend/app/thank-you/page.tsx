import { Suspense } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHeader } from '@/components/layout/page-header'
import { ThankYouDetails } from '@/components/sections/thank-you-details'
import { RoyalLoader } from '@/components/ui/royal'
import { Button } from '@/components/ui/button'
import { pageMeta } from '@/lib/seo'

/**
 * Feature 4 — the dedicated post-submission page.
 *
 * noindex: it is a per-visitor confirmation, not a landing page, and indexing
 * it would put stray reference numbers into search results. It is also the
 * natural conversion goal to configure in GA4.
 */
export const metadata: Metadata = pageMeta({
  title: 'Thank You',
  description: 'Your request has reached the restaurant.',
  path: '/thank-you',
  noIndex: true,
})

export default function ThankYouPage() {
  return (
    <>
      <PageHeader
        eyebrow="Received"
        title="Thank you"
        lede="It has reached the restaurant — here is what happens next."
        trail={[{ name: 'Thank You', href: '/thank-you' }]}
      />

      <section className="py-14 sm:py-20">
        <div className="container-royal max-w-3xl">
          <Suspense fallback={<RoyalLoader label="Fetching your confirmation…" />}>
            <ThankYouDetails />
          </Suspense>

          {/* Feature 3 — keep the visitor moving rather than dead-ending. */}
          <nav aria-label="Where to next" className="mt-12">
            <h2 className="text-center font-display text-xl font-bold text-foreground">
              While you wait
            </h2>
            <ul className="mt-6 grid gap-4 sm:grid-cols-3">
              {[
                { href: '/menu', title: 'The full menu', body: 'Seventy dishes across nine sections.' },
                { href: '/blog', title: 'The journal', body: 'How the food is actually made.' },
                { href: '/gallery', title: 'The gallery', body: 'The room, before and after.' },
              ].map((card) => (
                <li key={card.href}>
                  <Link
                    href={card.href}
                    className="group flex h-full flex-col rounded-2xl border border-gold-400/20 bg-card p-5 transition-all duration-300 hover:-translate-y-1 hover:border-gold-400/60 hover:shadow-royal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <span className="font-display text-lg font-bold text-foreground">
                      {card.title}
                    </span>
                    <span className="mt-1.5 text-sm text-muted-foreground">{card.body}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-10 text-center">
            <Button asChild variant="outline" size="lg">
              <Link href="/">Back to the home page</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
