import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, ShieldCheck, Check, CalendarDays, Clock3 } from 'lucide-react'
import { SectionHeading, Badge, CornerFiligree } from '@/components/ui/royal'
import { Button } from '@/components/ui/button'
import { stories } from '@/content/stories'
import { postsByDate } from '@/content/blog'
import { media } from '@/content/media'
import { site, formatDate } from '@/lib/site'

/** Feature 6 — case studies, teased on the home page. */
export function StoriesTeaser() {
  return (
    <section id="stories" aria-labelledby="stories-title" className="py-20 sm:py-28">
      <div className="container-royal">
        <SectionHeading
          id="stories-title"
          eyebrow="Event Stories"
          title="What happens when we cater"
          lede="Three events, three different problems, and what we actually did about them."
        />

        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {stories.map((story) => (
            <article
              key={story.slug}
              className="group flex flex-col rounded-2xl border border-gold-400/20 bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-gold-400/60 hover:shadow-royal"
            >
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="maroon">{story.eventType}</Badge>
                <Badge tone="muted">
                  <span className="tnum">{story.guests}</span> guests
                </Badge>
              </div>

              <h3 className="mt-4 font-display text-xl font-bold leading-snug text-foreground">
                <Link
                  href={`/stories#${story.slug}`}
                  className="rounded after:absolute after:inset-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {story.title}
                </Link>
              </h3>

              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                {story.summary}
              </p>

              <dl className="mt-5 grid grid-cols-2 gap-3 border-t border-border pt-5">
                {story.metrics.slice(0, 2).map((m) => (
                  <div key={m.label}>
                    <dt className="text-xs text-muted-foreground">{m.label}</dt>
                    <dd className="tnum mt-0.5 font-display text-lg font-bold text-maroon-700 dark:text-gold-300">
                      {m.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </article>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Button asChild variant="outline" size="lg">
            <Link href="/stories">
              Read the full case studies
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

/** Feature 49 — the journal, teased with the three most recent posts. */
export function BlogTeaser() {
  const featured = postsByDate.slice(0, 3)

  return (
    <section
      id="journal"
      aria-labelledby="journal-title"
      className="relative overflow-hidden py-20 sm:py-28"
    >
      <div aria-hidden="true" className="absolute inset-0 bg-muted/40" />

      <div className="container-royal relative">
        <SectionHeading
          id="journal-title"
          eyebrow="The Journal"
          title="Royal recipes, kitchen craft"
          lede="Our chefs write about how the food is actually made — the techniques, the arguments, and the ingredients that decide everything."
        />

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {featured.map((post) => (
            <article
              key={post.slug}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-gold-400/20 bg-card transition-all duration-300 hover:-translate-y-1 hover:border-gold-400/60 hover:shadow-royal"
            >
              <div className="p-6">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone="gold">{post.category}</Badge>
                </div>

                <h3 className="mt-4 font-display text-xl font-bold leading-snug text-foreground">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="rounded after:absolute after:inset-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {post.title}
                  </Link>
                </h3>

                <p className="mt-3 line-clamp-4 text-sm leading-relaxed text-muted-foreground">
                  {post.excerpt}
                </p>

                <p className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-border pt-4 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays className="size-3.5" aria-hidden="true" />
                    <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock3 className="size-3.5" aria-hidden="true" />
                    <span className="tnum">{post.readingMinutes} min read</span>
                  </span>
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Button asChild variant="outline" size="lg">
            <Link href="/blog">
              Read the journal
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

/** Feature 60 — the quality and taste guarantee. */
export function GuaranteeSection() {
  return (
    <section aria-labelledby="guarantee-title" className="py-20 sm:py-28">
      <div className="container-royal">
        <div className="relative overflow-hidden rounded-3xl border border-gold-400/40 bg-royal-800 text-sand-100">
          <div aria-hidden="true" className="absolute inset-0 bg-jaali text-gold-300" />
          <CornerFiligree className="left-4 top-4 text-gold-300/50" />
          <CornerFiligree className="right-4 top-4 -scale-x-100 text-gold-300/50" />

          <div className="relative grid gap-10 p-8 sm:p-12 lg:grid-cols-[1.3fr_1fr] lg:items-center">
            <div>
              <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-gold-300">
                <ShieldCheck className="size-4" aria-hidden="true" />
                Our promise
              </p>
              <h2
                id="guarantee-title"
                className="font-display text-display-sm font-bold text-sand-50"
              >
                {site.guarantee.title}
              </h2>
              <p className="measure mt-5 leading-relaxed text-sand-200">
                {site.guarantee.statement}
              </p>

              <ul className="mt-7 space-y-3">
                {site.guarantee.points.map((point) => (
                  <li key={point} className="flex items-start gap-3 text-sm">
                    <Check className="mt-0.5 size-4 shrink-0 text-gold-300" aria-hidden="true" />
                    <span className="text-sand-200">{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative mx-auto w-full max-w-xs">
              <div className="overflow-hidden rounded-2xl border border-gold-400/40">
                <Image
                  src={media.kitchenPass.src}
                  alt={media.kitchenPass.alt}
                  width={media.kitchenPass.width}
                  height={media.kitchenPass.height}
                  sizes="(min-width: 1024px) 22rem, 80vw"
                  className="h-auto w-full object-cover"
                />
              </div>
              <p className="mt-4 text-center text-xs text-sand-300">
                Chef Ramesh tastes every gravy before service opens.
              </p>
            </div>
          </div>
        </div>

        {/* Feature 59 — payment methods, also stated on the page itself. */}
        <div className="mt-10 rounded-2xl border border-gold-400/25 bg-card p-6">
          <h3 className="font-display text-lg font-bold text-foreground">
            Payment methods we accept
          </h3>
          <ul className="mt-4 flex flex-wrap gap-2">
            {site.payments.map((method) => (
              <li
                key={method}
                className="rounded-full border border-gold-400/30 bg-muted px-4 py-2 text-sm font-medium text-foreground/85"
              >
                {method}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-muted-foreground">
            Cash-on-delivery orders can also be settled by UPI or card at the door — our
            riders carry a machine.
          </p>
        </div>
      </div>
    </section>
  )
}
