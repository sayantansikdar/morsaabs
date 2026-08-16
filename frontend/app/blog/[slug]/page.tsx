import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CalendarDays, Clock3, ArrowRight, ArrowLeft, Info } from 'lucide-react'
import { PageHeader } from '@/components/layout/page-header'
import { Badge, GiltRule } from '@/components/ui/royal'
import { Button } from '@/components/ui/button'
import { JsonLd } from '@/components/shared/json-ld'
import { posts, getPost, postsByDate, type Block } from '@/content/blog'
import { articleSchema } from '@/lib/schema'
import { pageMeta } from '@/lib/seo'
import { formatDate } from '@/lib/site'

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) {
    return pageMeta({ title: 'Post not found', description: '', path: '/blog', noIndex: true })
  }

  return pageMeta({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
    keywords: post.tags,
    type: 'article',
    publishedTime: post.publishedAt,
    modifiedTime: post.updatedAt,
  })
}

/** Turns a heading into a stable anchor id. */
const anchor = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 60)

function renderBlock(block: Block, i: number) {
  switch (block.type) {
    case 'h2':
      return (
        <h2
          key={i}
          id={anchor(block.text)}
          className="mt-12 scroll-mt-28 font-display text-2xl font-bold text-foreground sm:text-3xl"
        >
          {block.text}
        </h2>
      )
    case 'h3':
      return (
        <h3
          key={i}
          id={anchor(block.text)}
          className="mt-8 scroll-mt-28 font-display text-xl font-bold text-foreground"
        >
          {block.text}
        </h3>
      )
    case 'ul':
      return (
        <ul key={i} className="mt-5 space-y-2.5">
          {block.items.map((li) => (
            <li key={li} className="flex gap-3 leading-relaxed text-muted-foreground">
              <span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 rotate-45 bg-gold-400" />
              <span>{li}</span>
            </li>
          ))}
        </ul>
      )
    case 'ol':
      return (
        <ol key={i} className="mt-5 space-y-3">
          {block.items.map((li, n) => (
            <li key={li} className="flex gap-3 leading-relaxed text-muted-foreground">
              <span
                aria-hidden="true"
                className="tnum grid size-6 shrink-0 place-items-center rounded-full bg-maroon-700 text-xs font-bold text-sand-50"
              >
                {n + 1}
              </span>
              <span>{li}</span>
            </li>
          ))}
        </ol>
      )
    case 'quote':
      return (
        <figure key={i} className="my-10 border-l-4 border-gold-400 pl-6">
          <blockquote className="font-display text-xl italic leading-relaxed text-foreground">
            “{block.text}”
          </blockquote>
          {block.cite && (
            <figcaption className="mt-3 text-sm text-muted-foreground">— {block.cite}</figcaption>
          )}
        </figure>
      )
    case 'callout':
      return (
        <aside
          key={i}
          className="my-8 rounded-2xl border border-gold-400/40 bg-gold-400/10 p-5"
        >
          <p className="flex items-center gap-2 font-display text-base font-bold text-foreground">
            <Info className="size-4 shrink-0 text-gold-600 dark:text-gold-300" aria-hidden="true" />
            {block.title}
          </p>
          <p className="mt-2 leading-relaxed text-muted-foreground">{block.text}</p>
        </aside>
      )
    default:
      return (
        <p key={i} className="mt-5 leading-relaxed text-muted-foreground">
          {block.text}
        </p>
      )
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) notFound()

  const index = postsByDate.findIndex((p) => p.slug === post.slug)
  const previous = postsByDate[index + 1]
  const next = postsByDate[index - 1]
  const related = postsByDate.filter((p) => p.slug !== post.slug && p.category === post.category).slice(0, 2)

  const headings = post.body.filter((b) => b.type === 'h2') as Extract<Block, { type: 'h2' }>[]

  return (
    <>
      <JsonLd data={articleSchema(post)} />

      <PageHeader
        eyebrow={post.category}
        title={post.title}
        trail={[
          { name: 'Journal', href: '/blog' },
          { name: post.title, href: `/blog/${post.slug}` },
        ]}
      >
        <p className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-sand-300">
          <span className="font-medium text-sand-100">{post.author}</span>
          <span>{post.authorRole}</span>
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="size-4" aria-hidden="true" />
            <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock3 className="size-4" aria-hidden="true" />
            <span className="tnum">{post.readingMinutes} min read</span>
          </span>
        </p>
      </PageHeader>

      <article className="py-14 sm:py-20">
        <div className="container-royal">
          <div className="grid gap-12 lg:grid-cols-[1fr_16rem] lg:gap-14">
            <div className="measure">
              <p className="font-display text-xl leading-relaxed text-foreground">
                {post.excerpt}
              </p>
              <GiltRule className="my-8" />

              {post.body.map(renderBlock)}

              {/* Feature 38 — per-article last-updated. */}
              <p className="mt-12 rounded-xl bg-muted/60 p-4 text-sm text-muted-foreground">
                Last updated{' '}
                <time dateTime={post.updatedAt} className="font-medium text-foreground">
                  {formatDate(post.updatedAt)}
                </time>
                . Written by {post.author}, {post.authorRole}.
              </p>

              <ul className="mt-6 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <li key={tag}>
                    <Badge tone="muted">#{tag}</Badge>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contents + onward links */}
            <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
              {headings.length > 0 && (
                <nav
                  aria-label="On this page"
                  className="rounded-2xl border border-gold-400/25 bg-card p-5"
                >
                  <h2 className="font-display text-base font-bold text-foreground">
                    On this page
                  </h2>
                  <ul className="mt-3 space-y-1">
                    {headings.map((h) => (
                      <li key={h.text}>
                        <a
                          href={`#${anchor(h.text)}`}
                          className="block rounded px-2 py-2 text-sm leading-snug text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          {h.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              )}

              {related.length > 0 && (
                <nav
                  aria-label="Related reading"
                  className="rounded-2xl border border-gold-400/25 bg-card p-5"
                >
                  <h2 className="font-display text-base font-bold text-foreground">
                    More on {post.category}
                  </h2>
                  <ul className="mt-3 space-y-3">
                    {related.map((r) => (
                      <li key={r.slug}>
                        <Link
                          href={`/blog/${r.slug}`}
                          className="block rounded text-sm font-medium leading-snug text-foreground underline-offset-4 transition-colors hover:text-maroon-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring dark:hover:text-gold-300"
                        >
                          {r.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              )}

              <div className="rounded-2xl border border-gold-400/30 bg-muted/60 p-5">
                <p className="font-display text-base font-bold text-foreground">
                  Taste it instead of reading about it
                </p>
                <Button asChild variant="primary" size="sm" className="mt-4 w-full">
                  <Link href="/menu">See the menu</Link>
                </Button>
                <Button asChild variant="outline" size="sm" className="mt-2 w-full">
                  <Link href="/reserve">Book a table</Link>
                </Button>
              </div>
            </aside>
          </div>

          {/* Previous / next */}
          <nav
            aria-label="More posts"
            className="mt-16 grid gap-4 border-t border-border pt-8 sm:grid-cols-2"
          >
            {previous ? (
              <Link
                href={`/blog/${previous.slug}`}
                className="group rounded-2xl border border-gold-400/20 bg-card p-5 transition-colors hover:border-gold-400/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  <ArrowLeft className="size-3.5" aria-hidden="true" />
                  Previous
                </span>
                <span className="mt-2 block font-display font-bold leading-snug text-foreground">
                  {previous.title}
                </span>
              </Link>
            ) : (
              <span />
            )}

            {next && (
              <Link
                href={`/blog/${next.slug}`}
                className="group rounded-2xl border border-gold-400/20 bg-card p-5 text-right transition-colors hover:border-gold-400/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:col-start-2"
              >
                <span className="flex items-center justify-end gap-1.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Next
                  <ArrowRight className="size-3.5" aria-hidden="true" />
                </span>
                <span className="mt-2 block font-display font-bold leading-snug text-foreground">
                  {next.title}
                </span>
              </Link>
            )}
          </nav>
        </div>
      </article>
    </>
  )
}
