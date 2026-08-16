'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, UtensilsCrossed, ShoppingBag, Bike, ChefHat, Crown, Clock } from 'lucide-react'
import { SectionHeading, CornerFiligree } from '@/components/ui/royal'
import { services } from '@/content/services'

const ICONS = {
  utensils: UtensilsCrossed,
  bag: ShoppingBag,
  bike: Bike,
  chefhat: ChefHat,
  crown: Crown,
} as const

/** Feature 52 — five services, each linking to its own page. */
export function ServicesGrid() {
  return (
    <section id="services" aria-labelledby="services-title" className="py-20 sm:py-28">
      <div className="container-royal">
        <SectionHeading
          id="services-title"
          eyebrow="How We Serve"
          title="Five ways to eat with us"
          lede="Every one of them runs out of the same kitchen, to the same standard — whether you are at table nine or hosting eight hundred people on a lawn."
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => {
            const Icon = ICONS[service.icon]
            // The last two cards fill the bottom row on a 3-column grid.
            const wide = i >= 3
            return (
              <motion.article
                key={service.slug}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.45, delay: (i % 3) * 0.07, ease: [0.22, 1, 0.36, 1] }}
                className={wide ? 'lg:col-span-1' : ''}
              >
                <Link
                  href={`/services/${service.slug}`}
                  className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-gold-400/20 bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-gold-400/60 hover:shadow-royal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <CornerFiligree className="right-0 top-0 -scale-x-100 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  <span className="grid size-12 place-items-center rounded-xl bg-maroon-700/10 text-maroon-700 transition-colors duration-300 group-hover:bg-maroon-700 group-hover:text-sand-50 dark:bg-gold-400/15 dark:text-gold-300 dark:group-hover:bg-gold-400 dark:group-hover:text-maroon-950">
                    <Icon className="size-6" aria-hidden="true" />
                  </span>

                  <h3 className="mt-5 font-display text-xl font-bold text-foreground">
                    {service.name}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {service.short}
                  </p>

                  {/* Feature 8 — each service states its own response promise. */}
                  <p className="mt-4 flex items-start gap-2 rounded-lg bg-muted/70 px-3 py-2 text-xs font-medium text-foreground/80">
                    <Clock className="mt-0.5 size-3.5 shrink-0 text-gold-600 dark:text-gold-300" aria-hidden="true" />
                    {service.responsePromise}
                  </p>

                  <p className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-maroon-700 dark:text-gold-300">
                    {service.priceNote}
                  </p>

                  <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-foreground">
                    Learn more
                    <ArrowRight
                      className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </span>
                </Link>
              </motion.article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
