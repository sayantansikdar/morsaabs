import type { Metadata } from 'next'
import Link from 'next/link'
import { CalendarDays, Clock3, ArrowRight } from 'lucide-react'
import { PageHeader } from '@/components/layout/page-header'
import { Badge } from '@/components/ui/royal'
import { postsByDate } from '@/content/blog'
import { pageMeta } from '@/lib/seo'
import { formatDate } from '@/lib/site'

export const metadata: Metadata = pageMeta({
  title: 'The Journal — Royal Recipes & Indian Kitchen Craft',
  description:
    'Our chefs on dum pukht, the tomato that decides your paneer butter masala, the Hakka origins of Indo-Chinese food, the Mughal spice box, and eating well around Dwarka Mor.',
  path: '/blog',
  keywords: [
    'Indian cooking blog',
    'royal recipes Mughlai',
    'dum pukht technique',
    'paneer butter masala recipe tips',
    'Indo-Chinese history',
    'Dwarka Mor food guide',
  ],
})

export default function BlogIndexPage() {
  const [lead, ...rest] = postsByDate

  return (
    <>
      <PageHeader
        eyebrow="The Journal"
        title="Royal recipes and kitchen craft"
        lede="Five long reads from our kitchen — the techniques behind the menu, and the ingredients that decide everything."
        trail={[{ name: 'Journal', href: '/blog' }]}
      />

      <section className="py-16 sm:py-24">
        <div className="container-royal">
          {/* Lead article */}
          <article className="group relative overflow-hidden rounded-3xl border border-gold-400/25 bg-card p-7 transition-all duration-300 hover:border-gold-400/60 hover:shadow-royal sm:p-10">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="maroon">Latest</Badge>
              <Badge tone="gold">{lead.category}</Badge>
            </div>

            <h2 className="mt-5 font-display text-display-sm font-bold leading-tight text-foreground">
              <Link
                href={`/blog/${lead.slug}`}
                className="rounded after:absolute after:inset-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {lead.title}
              </Link>
            </h2>

            <p className="measure mt-4 leading-relaxed text-muted-foreground">{lead.excerpt}</p>

            <p className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{lead.author}</span>
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="size-4" aria-hidden="true" />
                <time dateTime={lead.publishedAt}>{formatDate(lead.publishedAt)}</time>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock3 className="size-4" aria-hidden="true" />
                <span className="tnum">{lead.readingMinutes} min read</span>
              </span>
            </p>
          </article>

          {/* The rest */}
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {rest.map((post) => (
              <article
                key={post.slug}
                className="group relative flex flex-col rounded-2xl border border-gold-400/20 bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-gold-400/60 hover:shadow-royal"
              >
                <Badge tone="gold" className="self-start">
                  {post.category}
                </Badge>

                <h2 className="mt-4 font-display text-xl font-bold leading-snug text-foreground">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="rounded after:absolute after:inset-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {post.title}
                  </Link>
                </h2>

                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {post.excerpt}
                </p>

                <p className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-border pt-4 text-xs text-muted-foreground">
                  <span>{post.author}</span>
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays className="size-3.5" aria-hidden="true" />
                    <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock3 className="size-3.5" aria-hidden="true" />
                    <span className="tnum">{post.readingMinutes} min</span>
                  </span>
                </p>
              </article>
            ))}
          </div>

          <div className="mt-12 rounded-2xl border border-gold-400/25 bg-muted/50 p-6 text-center">
            <p className="text-muted-foreground">
              Hungry after all that reading?{' '}
              <Link
                href="/menu"
                className="inline-flex items-center gap-1 font-semibold text-maroon-700 underline underline-offset-4 dark:text-gold-300"
              >
                Look at the menu
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
