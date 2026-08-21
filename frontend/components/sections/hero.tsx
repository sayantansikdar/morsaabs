import Link from 'next/link'
import { Star, MapPin, Clock, ChevronDown, Truck, CalendarCheck, UtensilsCrossed } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DurbarScene } from '@/components/sections/durbar-scene'
import { SpiceDrift } from '@/components/sections/spice-drift'
import { site } from '@/lib/site'

/**
 * The durbar hall entrance.
 *
 * A server component on purpose — there is no interactive state here, so the
 * whole hero (the LCP element included) renders from HTML and CSS with no
 * hydration in the way. The entrance animation is the `.rise` CSS utility;
 * see globals.css for why it is not JS-driven.
 *
 * Pulled up under the transparent header with a negative margin so the arcade
 * runs edge to edge, then padded back so the content clears the nav.
 */
export function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative -mt-[var(--header-h)] flex min-h-[max(34rem,88svh)] items-center overflow-hidden"
    >
      {/* The backdrop is drawn, not photographed — see DurbarScene for why. */}
      <DurbarScene />

      {/* Ambient spices, behind the copy and above the palace. */}
      <SpiceDrift />

      <div className="container-royal relative z-10 py-24 text-center sm:py-32">
        {/* Rating badge */}
        <div className="rise mb-6 flex justify-center sm:mb-7">
          <a
            href={site.maps.reviews}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center gap-2.5 rounded-full border border-gold-400/40 bg-white/10 px-5 backdrop-blur-md transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400"
          >
            <span className="flex" aria-hidden="true">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="size-3.5 fill-gold-400 text-gold-400" />
              ))}
            </span>
            <span className="tnum text-sm font-semibold text-sand-50">
              {site.rating.value} · {site.rating.count}+ Google reviews
            </span>
          </a>
        </div>

        <p className="rise rise-1 mb-1 font-script text-3xl text-gold-300 sm:text-4xl" lang="hi">
          {site.nameDevanagari}
        </p>

        <h1
          id="hero-title"
          className="rise rise-2 text-display-xl font-bold text-sand-50 text-shadow-royal"
        >
          Morsaab’s
        </h1>

        <p className="rise rise-3 mx-auto mt-2 max-w-2xl font-display text-xl italic text-gilt sm:mt-3 sm:text-2xl">
          A Royal Taste of India
        </p>

        <p className="rise rise-4 mx-auto mt-4 max-w-xl text-base leading-relaxed text-sand-200/90 sm:mt-5 sm:text-lg">
          Pure vegetarian North Indian, Indo-Chinese and South Indian cooking —
          served under carved arches near Dwarka Mor since day one.
        </p>

        {/* Feature 2 — the primary conversion pair, above the fold.
            Two-up on small screens so all three still fit the first viewport. */}
        <div className="rise rise-5 mx-auto mt-7 grid max-w-md grid-cols-2 gap-2.5 sm:mt-9 sm:flex sm:max-w-none sm:justify-center sm:gap-3">
          <Button asChild variant="gold" size="lg" className="sm:size-auto sm:min-w-52 sm:px-10 sm:py-4 sm:text-lg">
            <Link href="/order">
              <Truck aria-hidden="true" />
              Order Now
            </Link>
          </Button>
          <Button asChild variant="royal" size="lg" className="sm:min-w-52 sm:px-10 sm:py-4 sm:text-lg">
            <Link href="/reserve">
              <CalendarCheck aria-hidden="true" />
              Book a Table
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="col-span-2 border-sand-50/60 text-sand-50 hover:border-gold-400 hover:bg-white/10 sm:col-span-1 sm:min-w-44 sm:px-10 sm:py-4 sm:text-lg"
          >
            <Link href="/menu">
              <UtensilsCrossed aria-hidden="true" />
              View Menu
            </Link>
          </Button>
        </div>

        {/* Feature 8 — the response promise, stated where the CTA is decided. */}
        <p className="rise rise-6 mt-5 text-sm text-sand-300">
          <span className="font-semibold text-gold-300">{site.promise.deliveryShort}</span>
          {' · '}
          <span className="font-semibold text-gold-300">{site.promise.reservationShort}</span>
        </p>

        {/* Location + hours */}
        <div className="rise rise-7 mt-7 flex flex-wrap items-center justify-center gap-x-8 gap-y-1 text-sm text-sand-200/85 sm:mt-10 sm:gap-y-3">
          <a
            href={site.maps.directions}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center gap-2 rounded-lg px-2 transition-colors hover:text-gold-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400"
          >
            <MapPin className="size-4 shrink-0 text-gold-400" aria-hidden="true" />
            {site.address.locality}, New Delhi — {site.address.landmark}
          </a>
          <span className="inline-flex items-center gap-2">
            <Clock className="size-4 shrink-0 text-gold-400" aria-hidden="true" />
            <span className="tnum">{site.hours.display}</span>
            <span className="text-sand-400">daily</span>
          </span>
        </div>
      </div>

      {/* Scroll cue — hidden on small screens, where the sticky CTA bar owns
          the bottom edge and the two would collide. */}
      <div className="absolute inset-x-0 bottom-6 z-10 hidden justify-center sm:flex">
        <a
          href="#signature"
          aria-label="Skip to the signature dishes"
          className="grid size-11 place-items-center rounded-full text-sand-50/60 transition-colors hover:text-sand-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400"
        >
          <ChevronDown className="size-6 motion-safe:animate-float" aria-hidden="true" />
        </a>
      </div>
    </section>
  )
}
