import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { ArrowRight, Check, Clock, Phone } from 'lucide-react'
import { PageHeader } from '@/components/layout/page-header'
import { Button } from '@/components/ui/button'
import { Badge, GiltRule, ArchFrame } from '@/components/ui/royal'
import { JsonLd } from '@/components/shared/json-ld'
import { services, getService } from '@/content/services'
import { media } from '@/content/media'
import { serviceSchema } from '@/lib/schema'
import { pageMeta } from '@/lib/seo'
import { site } from '@/lib/site'

/** Feature 52 — one statically generated page per service. */
export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const service = getService(slug)
  if (!service) return pageMeta({ title: 'Service not found', description: '', path: '/services', noIndex: true })

  return pageMeta({
    title: `${service.name} in Uttam Nagar — ${service.priceNote.split('·')[0].trim()}`,
    description: service.summary,
    path: `/services/${service.slug}`,
    keywords: [
      `${service.name.toLowerCase()} Uttam Nagar`,
      `${service.name.toLowerCase()} Dwarka Mor`,
      `veg ${service.name.toLowerCase()} New Delhi`,
    ],
  })
}

const HERO_IMAGE = {
  'dine-in': 'interiorArches',
  takeaway: 'thali',
  'home-delivery': 'delivery',
  catering: 'cateringCounter',
  banquet: 'banquetHall',
} as const satisfies Record<string, keyof typeof media>

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const service = getService(slug)
  if (!service) notFound()

  const image = media[HERO_IMAGE[service.slug as keyof typeof HERO_IMAGE]]
  const others = services.filter((s) => s.slug !== service.slug)

  return (
    <>
      <JsonLd data={serviceSchema(service)} />

      <PageHeader
        eyebrow="Our Services"
        title={service.name}
        lede={service.summary}
        // Feature 5 — the full trail, three levels deep.
        trail={[
          { name: 'Services', href: '/services' },
          { name: service.name, href: `/services/${service.slug}` },
        ]}
      >
        <div className="flex flex-wrap gap-2">
          {service.highlights.map((h) => (
            <Badge key={h} tone="gold">
              {h}
            </Badge>
          ))}
        </div>
      </PageHeader>

      <section className="py-16 sm:py-24">
        <div className="container-royal">
          <div className="grid gap-12 lg:grid-cols-[1.35fr_1fr] lg:gap-16">
            <div>
              {/* Feature 8 — the promise, first thing on the page. */}
              <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-gold-400/30 bg-card p-5">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-royal-700 text-sand-50">
                  <Clock className="size-5" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-widest text-gold-600 dark:text-gold-300">
                    Our promise
                  </p>
                  <p className="mt-0.5 font-display text-lg font-bold text-foreground">
                    {service.responsePromise}
                  </p>
                </div>
              </div>

              <div className="measure mt-10 space-y-5 leading-relaxed text-muted-foreground">
                {service.body.map((paragraph) => (
                  <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                ))}
              </div>

              <GiltRule />

              <h2 className="font-display text-2xl font-bold text-foreground">
                What’s included
              </h2>
              <dl className="mt-6 grid gap-4 sm:grid-cols-2">
                {service.inclusions.map((inc) => (
                  <div key={inc.title} className="rounded-xl border border-gold-400/20 bg-card p-5">
                    <dt className="flex items-center gap-2 font-semibold text-foreground">
                      <Check
                        className="size-4 shrink-0 text-royal-600 dark:text-royal-300"
                        aria-hidden="true"
                      />
                      {inc.title}
                    </dt>
                    <dd className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                      {inc.detail}
                    </dd>
                  </div>
                ))}
              </dl>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Button asChild variant="gold" size="lg">
                  <Link href={service.cta.href}>
                    {service.cta.label}
                    <ArrowRight aria-hidden="true" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <a href={`tel:${site.phone}`}>
                    <Phone aria-hidden="true" />
                    {site.phoneDisplay}
                  </a>
                </Button>
              </div>
            </div>

            <aside className="space-y-6">
              <ArchFrame className="aspect-[3/4] w-full" cusped>
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(min-width: 1024px) 32vw, 90vw"
                  className="object-cover"
                />
              </ArchFrame>

              <div className="rounded-2xl border border-gold-400/25 bg-card p-6">
                <p className="text-xs font-semibold uppercase tracking-widest text-gold-600 dark:text-gold-300">
                  Pricing
                </p>
                <p className="mt-2 font-display text-xl font-bold text-foreground">
                  {service.priceNote}
                </p>
                <p className="mt-3 text-sm text-muted-foreground">
                  All prices include taxes. We do not add a service charge.
                </p>
              </div>

              {/* Feature 3 — cross-links to the other four services. */}
              <nav aria-label="Other services" className="rounded-2xl border border-gold-400/25 bg-card p-6">
                <h2 className="font-display text-lg font-bold text-foreground">
                  Our other services
                </h2>
                <ul className="mt-4 space-y-1">
                  {others.map((other) => (
                    <li key={other.slug}>
                      <Link
                        href={`/services/${other.slug}`}
                        className="flex min-h-12 items-center justify-between gap-3 rounded-lg px-3 text-sm transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <span className="font-medium text-foreground">{other.name}</span>
                        <ArrowRight className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </aside>
          </div>
        </div>
      </section>
    </>
  )
}
