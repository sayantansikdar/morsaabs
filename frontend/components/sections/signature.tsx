'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight, Printer } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SectionHeading, ArchFrame, Badge } from '@/components/ui/royal'
import { DishCard } from '@/components/shared/dish-card'
import { CopyButton } from '@/components/shared/copy-button'
import { menu, allMenuItems } from '@/content/menu'
import { media } from '@/content/media'
import { site } from '@/lib/site'

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
}
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const } },
}

/** The eight dishes we would put in front of a first-time guest. */
export function SignatureDishes() {
  const picks = allMenuItems.filter((i) => i.chefSpecial || i.bestseller).slice(0, 8)

  return (
    <section id="signature" aria-labelledby="signature-title" className="py-20 sm:py-28">
      <div className="container-royal">
        <SectionHeading
          id="signature-title"
          eyebrow="From the Royal Kitchen"
          title="Dishes worth the journey"
          lede="Eight plates that people come back for. The full carte runs to nine sections and just over seventy dishes."
        />

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {picks.map((dish) => (
            <motion.div key={dish.name} variants={item}>
              <DishCard item={dish} categorySlug={dish.categorySlug} className="h-full" />
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild variant="primary" size="lg">
            <Link href="/menu">
              Browse the full menu
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/menu#print">
              <Printer aria-hidden="true" />
              Printable menu
            </Link>
          </Button>
        </div>

        {/* Section index — internal linking straight into each menu anchor. */}
        <nav aria-label="Menu sections" className="mt-10">
          <ul className="flex flex-wrap justify-center gap-2">
            {menu.map((category) => (
              <li key={category.slug}>
                <Link
                  href={`/menu#${category.slug}`}
                  className="inline-flex min-h-11 items-center rounded-full border border-gold-400/30 px-4 text-sm font-medium text-foreground/85 transition-colors hover:border-gold-400 hover:bg-gold-400/10 hover:text-maroon-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring dark:hover:text-gold-300"
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  )
}

/** Feature 29 — the launch offer, with a copyable code. */
export function OfferStrip() {
  return (
    <section aria-labelledby="offer-title" className="py-8">
      <div className="container-royal">
        <div className="relative overflow-hidden rounded-3xl border border-gold-400/40 bg-maroon-900 px-6 py-8 text-center sm:px-10">
          <div aria-hidden="true" className="absolute inset-0 bg-jaali text-gold-300" />
          <div className="relative">
            <Badge tone="gold" className="mb-4">
              Limited offer
            </Badge>
            <h2 id="offer-title" className="font-display text-2xl font-bold text-sand-50 sm:text-3xl">
              {site.offer.description}
            </h2>
            <p className="mt-2 text-sm text-sand-300">
              Apply this code at checkout. Valid on delivery and takeaway.
            </p>
            <div className="mx-auto mt-6 max-w-sm">
              <CopyButton value={site.offer.code} label="discount code" variant="code" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/** A short about block on the home page; the full story lives at /about. */
export function AboutTeaser() {
  return (
    <section aria-labelledby="about-teaser-title" className="relative overflow-hidden py-20 sm:py-28">
      <div aria-hidden="true" className="absolute inset-0 bg-muted/40" />

      <div className="container-royal relative">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto w-full max-w-md lg:max-w-none"
          >
            <ArchFrame className="aspect-[4/5] w-full" cusped>
              <Image
                src={media.interiorArches.src}
                alt={media.interiorArches.alt}
                fill
                sizes="(min-width: 1024px) 45vw, 90vw"
                className="object-cover"
              />
            </ArchFrame>

            {/* Floating stat card */}
            <div className="absolute -bottom-6 -right-2 rounded-2xl border border-gold-400/40 bg-card p-5 shadow-royal sm:right-4">
              <p className="tnum font-display text-3xl font-bold text-maroon-700 dark:text-gold-300">
                100%
              </p>
              <p className="mt-1 text-sm font-medium text-muted-foreground">
                Pure vegetarian
                <br />
                kitchen
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <SectionHeading
              id="about-teaser-title"
              eyebrow="Our Story"
              title="A durbar hall on Rama Park Road"
              align="left"
            />
            <div className="measure mt-6 space-y-4 leading-relaxed text-muted-foreground">
              <p>
                We opened with a simple, slightly stubborn idea: that a pure vegetarian
                restaurant in West Delhi should not have to feel like a compromise. Not
                in the room, not on the plate, not in what it costs.
              </p>
              <p>
                So the kitchen runs the same way a good non-vegetarian kitchen does —
                stock made daily, gravies built from scratch each morning, nothing
                reheated from a holding tray. And the room was built to look like
                somewhere you would take your parents on an anniversary.
              </p>
              <p>
                Chef Ramesh Bhatt has run this pass for nine years. He tastes every
                gravy before service and has sent plenty of them back.
              </p>
            </div>

            <dl className="mt-8 grid grid-cols-3 gap-4">
              {[
                { value: '70+', label: 'Dishes on the carte' },
                { value: '9', label: 'Years at this pass' },
                { value: '800', label: 'Largest event catered' },
              ].map((stat) => (
                <div key={stat.label} className="rounded-xl border border-gold-400/25 bg-card p-4">
                  <dt className="sr-only">{stat.label}</dt>
                  <dd>
                    <span className="tnum block font-display text-2xl font-bold text-maroon-700 dark:text-gold-300">
                      {stat.value}
                    </span>
                    <span className="mt-1 block text-xs text-muted-foreground">{stat.label}</span>
                  </dd>
                </div>
              ))}
            </dl>

            <Button asChild variant="outline" size="lg" className="mt-8">
              <Link href="/about">
                Read our full story
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
