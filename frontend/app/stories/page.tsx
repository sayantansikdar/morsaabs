import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Target, TrendingUp, Wrench } from 'lucide-react'
import { PageHeader } from '@/components/layout/page-header'
import { Badge, GiltRule } from '@/components/ui/royal'
import { Button } from '@/components/ui/button'
import { stories } from '@/content/stories'
import { pageMeta } from '@/lib/seo'
import { site } from '@/lib/site'

export const metadata: Metadata = pageMeta({
  title: 'Event Catering — Weddings, Offsites and Society Events up to 800 Guests',
  description:
    'How we plan three different kinds of event: a large wedding without the buffet queue, an offsite where the Jain menu is not an afterthought, and a society mela served in shifts.',
  path: '/stories',
  keywords: [
    'wedding catering case study Delhi',
    'corporate catering Gurugram Jain menu',
    'society event catering Uttam Nagar',
    'large event catering New Delhi',
  ],
})

export default function StoriesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Event Catering"
        title="How we plan an event"
        lede="Three kinds of event, three genuinely different problems, and how each one is planned and staffed."
        trail={[{ name: 'Event Stories', href: '/stories' }]}
      />

      <section className="py-16 sm:py-24">
        <div className="container-royal space-y-16">
          {stories.map((story) => (
            <article
              key={story.slug}
              id={story.slug}
              className="scroll-mt-28 overflow-hidden rounded-3xl border border-gold-400/25 bg-card"
            >
              <header className="border-b border-border p-7 sm:p-10">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone="maroon">{story.eventType}</Badge>
                  <Badge tone="muted">{story.scale}</Badge>
                </div>

                <h2 className="mt-5 font-display text-display-sm font-bold leading-tight text-foreground">
                  {story.title}
                </h2>
                <p className="measure mt-4 leading-relaxed text-muted-foreground">{story.summary}</p>

                {/* Headline metrics */}
                <dl className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {story.metrics.map((metric) => (
                    <div
                      key={metric.label}
                      className="rounded-xl border border-gold-400/25 bg-muted/50 p-4 text-center"
                    >
                      <dt className="text-xs text-muted-foreground">{metric.label}</dt>
                      <dd className="tnum mt-1 font-display text-2xl font-bold text-maroon-700 dark:text-gold-300">
                        {metric.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </header>

              <div className="grid gap-8 p-7 sm:p-10 lg:grid-cols-3">
                <section aria-label="The problem">
                  <h3 className="flex items-center gap-2 font-display text-lg font-bold text-foreground">
                    <Target className="size-4 text-maroon-600 dark:text-maroon-300" aria-hidden="true" />
                    The problem
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {story.challenge}
                  </p>
                </section>

                <section aria-label="What we did">
                  <h3 className="flex items-center gap-2 font-display text-lg font-bold text-foreground">
                    <Wrench className="size-4 text-gold-600 dark:text-gold-300" aria-hidden="true" />
                    What we did
                  </h3>
                  <ul className="mt-3 space-y-2.5">
                    {story.approach.map((step) => (
                      <li key={step} className="flex gap-2.5 text-sm leading-relaxed text-muted-foreground">
                        <span
                          aria-hidden="true"
                          className="mt-2 size-1.5 shrink-0 rotate-45 bg-gold-400"
                        />
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                <section aria-label="The thinking">
                  <h3 className="flex items-center gap-2 font-display text-lg font-bold text-foreground">
                    <TrendingUp className="size-4 text-royal-600 dark:text-royal-300" aria-hidden="true" />
                    The thinking
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {story.outcome}
                  </p>
                </section>
              </div>

            </article>
          ))}

          <GiltRule />

          <div className="rounded-3xl border border-gold-400/30 bg-card p-8 text-center sm:p-12">
            <h2 className="font-display text-display-sm font-bold text-foreground">
              Planning something?
            </h2>
            <p className="measure mx-auto mt-3 text-muted-foreground">
              {site.promise.enquiry}. Tell us the date, the headcount and the constraints,
              and we will come back with a costed menu rather than a brochure.
            </p>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild variant="gold" size="lg">
                <Link href="/contact?service=catering">
                  Request a catering quote
                  <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/services/banquet">See the banquet hall</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
