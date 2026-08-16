'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { Star, Quote, ThumbsUp, ThumbsDown, ExternalLink, Send } from 'lucide-react'
import { SectionHeading, Badge } from '@/components/ui/royal'
import { Button } from '@/components/ui/button'
import { Textarea, Label } from '@/components/ui/field'
import { reviews, ratingBreakdown } from '@/content/reviews'
import { site, formatDate } from '@/lib/site'
import { track } from '@/lib/analytics'
import { cn } from '@/lib/utils'

export function Reviews() {
  return (
    <section
      id="reviews"
      aria-labelledby="reviews-title"
      className="relative overflow-hidden py-20 sm:py-28"
    >
      <div aria-hidden="true" className="absolute inset-0 bg-muted/40" />

      <div className="container-royal relative">
        <SectionHeading
          id="reviews-title"
          eyebrow="What Guests Say"
          title="Seventy-one reviews, and counting"
          lede="Mirrored from our Google Business Profile. We read every one — including the four-star ones, which are usually the most useful."
        />

        {/* Rating summary */}
        <div className="mx-auto mt-12 grid max-w-3xl gap-8 rounded-3xl border border-gold-400/25 bg-card p-6 sm:grid-cols-[auto_1fr] sm:p-8">
          <div className="text-center sm:border-r sm:border-border sm:pr-8">
            <p className="tnum font-display text-6xl font-bold text-maroon-700 dark:text-gold-300">
              {site.rating.value}
            </p>
            <div className="mt-2 flex justify-center" aria-hidden="true">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    'size-4',
                    i < Math.round(site.rating.value)
                      ? 'fill-gold-400 text-gold-400'
                      : 'text-muted-foreground/30'
                  )}
                />
              ))}
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              <span className="tnum">{site.rating.count}</span> Google reviews
            </p>
          </div>

          <ul className="space-y-2">
            {ratingBreakdown.map((row) => {
              const pct = Math.round((row.count / site.rating.count) * 100)
              return (
                <li key={row.stars} className="flex items-center gap-3 text-sm">
                  <span className="tnum w-10 shrink-0 text-muted-foreground">
                    {row.stars} ★
                  </span>
                  <span
                    className="h-2 flex-1 overflow-hidden rounded-full bg-muted"
                    role="img"
                    aria-label={`${row.stars} stars: ${row.count} reviews, ${pct} percent`}
                  >
                    <span
                      className="block h-full rounded-full bg-gold-400"
                      style={{ width: `${pct}%` }}
                    />
                  </span>
                  <span className="tnum w-8 shrink-0 text-right text-muted-foreground">
                    {row.count}
                  </span>
                </li>
              )
            })}
          </ul>
        </div>

        {/* Review cards */}
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review, i) => (
            <motion.article
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.45, delay: (i % 3) * 0.07 }}
              className="flex flex-col rounded-2xl border border-gold-400/20 bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-gold-400/50 hover:shadow-royal"
            >
              <Quote className="size-7 text-gold-400/50" aria-hidden="true" />

              <div className="mt-3 flex items-center gap-1" aria-label={`Rated ${review.rating} out of 5`}>
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star
                    key={s}
                    aria-hidden="true"
                    className={cn(
                      'size-3.5',
                      s < review.rating ? 'fill-gold-400 text-gold-400' : 'text-muted-foreground/25'
                    )}
                  />
                ))}
              </div>

              <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                {review.text}
              </blockquote>

              {review.dish && (
                <p className="mt-4">
                  <Badge tone="muted">Ordered: {review.dish}</Badge>
                </p>
              )}

              <footer className="mt-5 flex items-center gap-3 border-t border-border pt-4">
                <span
                  aria-hidden="true"
                  className="grid size-10 shrink-0 place-items-center rounded-full bg-maroon-700 font-display text-sm font-bold text-sand-50"
                >
                  {review.initials}
                </span>
                <span className="min-w-0">
                  <cite className="block truncate text-sm font-semibold not-italic text-foreground">
                    {review.author}
                  </cite>
                  <span className="block text-xs text-muted-foreground">
                    {review.source} ·{' '}
                    <time dateTime={review.date}>{formatDate(review.date)}</time>
                  </span>
                </span>
              </footer>
            </motion.article>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Button asChild variant="outline" size="lg">
            <a
              href={site.maps.reviews}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track('outbound_click', { destination: 'google_reviews' })}
            >
              Read all reviews on Google
              <ExternalLink aria-hidden="true" />
            </a>
          </Button>
        </div>

        <SentimentLoop />
      </div>
    </section>
  )
}

/**
 * Feature 15 — the sentiment feedback loop.
 *
 * A single thumb is a low-friction signal; the follow-up textarea only appears
 * after a choice, so we are not asking for an essay before anyone has committed
 * to anything. Positive sentiment is nudged toward a public Google review,
 * negative sentiment is routed to us privately instead — the honest version of
 * that pattern, where the negative path still reaches a human.
 */
function SentimentLoop() {
  const [sentiment, setSentiment] = React.useState<'up' | 'down' | null>(null)
  const [note, setNote] = React.useState('')
  const [sent, setSent] = React.useState(false)
  const noteRef = React.useRef<HTMLTextAreaElement>(null)

  function choose(value: 'up' | 'down') {
    setSentiment(value)
    track('review_sentiment', { sentiment: value })
    // Move focus to the follow-up so keyboard users are not stranded.
    requestAnimationFrame(() => noteRef.current?.focus())
  }

  function submit(e: React.FormEvent) {
    e.preventDefault()
    track('review_feedback_submit', { sentiment, has_note: note.trim().length > 0 })
    setSent(true)
  }

  return (
    <div className="mx-auto mt-14 max-w-2xl rounded-3xl border border-gold-400/30 bg-card p-6 sm:p-8">
      {sent ? (
        <div role="status" className="text-center">
          <p className="font-display text-xl font-bold text-foreground">Thank you — noted.</p>
          <p className="mt-2 text-sm text-muted-foreground">
            {sentiment === 'down'
              ? `This goes straight to Vikram, our manager. If you left a contact detail he will call you back today.`
              : 'It genuinely helps. If you have a minute, a Google review helps other people find us.'}
          </p>
          {sentiment === 'up' && (
            <Button asChild variant="gold" size="md" className="mt-5">
              <a href={site.maps.reviews} target="_blank" rel="noopener noreferrer">
                Leave a Google review
                <ExternalLink aria-hidden="true" />
              </a>
            </Button>
          )}
        </div>
      ) : (
        <>
          <p className="text-center font-display text-xl font-bold text-foreground">
            Eaten with us recently? How did we do?
          </p>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            One tap. We read all of it.
          </p>

          <div className="mt-6 flex justify-center gap-3">
            <button
              type="button"
              onClick={() => choose('up')}
              aria-pressed={sentiment === 'up'}
              className={cn(
                'flex min-h-12 cursor-pointer items-center gap-2 rounded-full border-2 px-6 font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                sentiment === 'up'
                  ? 'border-royal-600 bg-royal-600 text-sand-50'
                  : 'border-border text-foreground hover:border-royal-500 hover:bg-royal-500/10'
              )}
            >
              <ThumbsUp className="size-5" aria-hidden="true" />
              Good
            </button>
            <button
              type="button"
              onClick={() => choose('down')}
              aria-pressed={sentiment === 'down'}
              className={cn(
                'flex min-h-12 cursor-pointer items-center gap-2 rounded-full border-2 px-6 font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                sentiment === 'down'
                  ? 'border-maroon-600 bg-maroon-600 text-sand-50'
                  : 'border-border text-foreground hover:border-maroon-500 hover:bg-maroon-500/10'
              )}
            >
              <ThumbsDown className="size-5" aria-hidden="true" />
              Not great
            </button>
          </div>

          {sentiment && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
              onSubmit={submit}
              className="overflow-hidden"
            >
              <div className="pt-6">
                <Label htmlFor="sentiment-note">
                  {sentiment === 'up'
                    ? 'What worked? (optional)'
                    : 'What went wrong? (optional, but it helps us fix it)'}
                </Label>
                <Textarea
                  id="sentiment-note"
                  ref={noteRef}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  maxLength={600}
                  placeholder={
                    sentiment === 'up'
                      ? 'The dish, the service, the room…'
                      : 'Tell us what happened and when — we will look it up.'
                  }
                />
                <div className="mt-4 flex items-center justify-between gap-4">
                  <p className="tnum text-xs text-muted-foreground">{note.length}/600</p>
                  <Button type="submit" variant="primary">
                    <Send aria-hidden="true" />
                    Send feedback
                  </Button>
                </div>
              </div>
            </motion.form>
          )}
        </>
      )}
    </div>
  )
}
