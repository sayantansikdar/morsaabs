import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Flame, Leaf, ShieldCheck, Users } from 'lucide-react'
import { PageHeader } from '@/components/layout/page-header'
import { SectionHeading, ArchFrame, GiltRule, Badge } from '@/components/ui/royal'
import { Button } from '@/components/ui/button'
import { GuaranteeSection } from '@/components/sections/teasers'
import { media, team } from '@/content/media'
import { pageMeta } from '@/lib/seo'
import { site } from '@/lib/site'

export const metadata: Metadata = pageMeta({
  title: 'Our Story — The Kitchen Behind Morsaab’s, Uttam Nagar',
  description:
    'How a pure vegetarian kitchen on Rama Park Road came to cook North Indian, Indo-Chinese and South Indian food to the same standard — and the four people who run it.',
  path: '/about',
  keywords: [
    'about Morsaabs restaurant',
    'vegetarian restaurant story Uttam Nagar',
    'chef Uttam Nagar Delhi',
    'pure veg kitchen Dwarka Mor',
  ],
})

const principles = [
  {
    icon: Leaf,
    title: 'One kitchen, one standard',
    body: 'No separate "veg section" as an afterthought. The whole kitchen is vegetarian, so nothing is ever a substitution or a compromise.',
  },
  {
    icon: Flame,
    title: 'Cooked to order',
    body: 'Gravies are built fresh each morning and finished per order. Nothing sits under a lamp waiting for someone to want it.',
  },
  {
    icon: ShieldCheck,
    title: 'Priced without games',
    body: 'The price on the menu is the price on the bill. No service charge added quietly, no "market price" on anything.',
  },
  {
    icon: Users,
    title: 'The same people, every service',
    body: 'A stable kitchen brigade is the only reliable route to consistency. Most of ours have been here since we opened.',
  },
]

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="Our Story"
        title="A durbar hall on Rama Park Road"
        lede="We built the restaurant we wanted to eat in: pure vegetarian, cooked seriously, in a room worth dressing up for."
        trail={[{ name: 'Our Story', href: '/about' }]}
      />

      {/* The story */}
      <section aria-labelledby="story-title" className="py-16 sm:py-24">
        <div className="container-royal">
          <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr] lg:gap-16">
            <div>
              <SectionHeading
                id="story-title"
                eyebrow="How it started"
                title="The idea was slightly stubborn"
                align="left"
              />

              <div className="measure mt-8 space-y-5 leading-relaxed text-muted-foreground">
                <p>
                  West Delhi has never been short of vegetarian restaurants. What it was
                  short of — and this is the thing that started the argument that became
                  this restaurant — was vegetarian restaurants that behaved like serious
                  ones.
                </p>
                <p>
                  The pattern was familiar. A good non-vegetarian kitchen makes its stock
                  daily, builds gravies from scratch, keeps a chef on the pass tasting
                  everything. A lot of vegetarian kitchens in the neighbourhood were
                  buying in a base gravy, colouring it three ways, and calling the
                  results shahi paneer, kadhai paneer and paneer butter masala.
                </p>
                <p>
                  You can taste it. Anyone can taste it. So the founding decision was
                  simply that we would not do that — and that we would still price the
                  thali at a number people around here would actually pay.
                </p>

                <GiltRule className="my-8" />

                <h2 className="font-display text-2xl font-bold text-foreground">
                  Why the menu is so wide
                </h2>
                <p>
                  Nine sections is a lot for one kitchen, and food writers occasionally
                  tell us so. The reason is that this is a neighbourhood restaurant, not a
                  destination one. A family of five walks in and wants a thali, a dosa, a
                  chilli paneer and two pizzas, and if we cannot serve all of that they
                  go somewhere that can.
                </p>
                <p>
                  What makes it workable is that the sections are genuinely separate
                  stations with their own chefs — Sunita runs the tandoor and the dosa
                  griddle, the wok section is its own person, and nobody is asked to
                  cover two at once during service.
                </p>

                <h2 className="mt-10 font-display text-2xl font-bold text-foreground">
                  The room
                </h2>
                <p>
                  The fit-out is deliberately theatrical: carved arches, brass sconces,
                  deep maroon and gold. That is not nostalgia for its own sake. A
                  vegetarian restaurant in West Delhi is where a lot of families have
                  their anniversaries and their engagements, because for many of them
                  there is nowhere else. Those evenings deserve a room that rises to
                  them.
                </p>
                <p>
                  In 2026 we closed the mezzanine for six weeks and rebuilt it around six
                  arched alcoves. It cost us twelve covers.{' '}
                  <Link
                    href="/gallery"
                    className="font-medium text-maroon-700 underline underline-offset-4 hover:text-maroon-600 dark:text-gold-300"
                  >
                    You can see the before and after
                  </Link>
                  , and it was worth every one of them.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <ArchFrame className="mx-auto aspect-[3/4] w-full max-w-sm" cusped>
                <Image
                  src={media.tandoor.src}
                  alt={media.tandoor.alt}
                  fill
                  sizes="(min-width: 1024px) 30vw, 90vw"
                  className="object-cover"
                />
              </ArchFrame>

              <figure className="overflow-hidden rounded-2xl border border-gold-400/25">
                <Image
                  src={media.storefront.src}
                  alt={media.storefront.alt}
                  width={media.storefront.width}
                  height={media.storefront.height}
                  sizes="(min-width: 1024px) 30vw, 90vw"
                  className="h-auto w-full object-cover"
                />
                <figcaption className="bg-card p-4 text-sm text-muted-foreground">
                  The frontage on Rama Park Road, seven minutes from Dwarka Mor metro.
                </figcaption>
              </figure>
            </div>
          </div>
        </div>
      </section>

      {/* Principles */}
      <section aria-labelledby="principles-title" className="bg-muted/40 py-16 sm:py-24">
        <div className="container-royal">
          <SectionHeading
            id="principles-title"
            eyebrow="How we work"
            title="Four things we do not negotiate"
          />

          <div className="mt-14 grid gap-5 sm:grid-cols-2">
            {principles.map((p) => (
              <div
                key={p.title}
                className="rounded-2xl border border-gold-400/20 bg-card p-6 transition-all duration-300 hover:border-gold-400/50 hover:shadow-royal"
              >
                <span className="grid size-11 place-items-center rounded-xl bg-maroon-700/10 text-maroon-700 dark:bg-gold-400/15 dark:text-gold-300">
                  <p.icon className="size-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 font-display text-lg font-bold text-foreground">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature 20 — the team */}
      <section id="team" aria-labelledby="team-title" className="scroll-mt-28 py-16 sm:py-24">
        <div className="container-royal">
          <SectionHeading
            id="team-title"
            eyebrow="Who cooks your food"
            title="The people at the pass"
            lede="Four of the people you are trusting with dinner. Between them they have been in professional kitchens for over fifty years."
          />

          <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((person) => (
              <li key={person.name} className="text-center">
                <div className="relative mx-auto aspect-square w-full max-w-[15rem] overflow-hidden rounded-2xl border border-gold-400/30">
                  <Image
                    src={person.photo.src}
                    alt={person.photo.alt}
                    fill
                    sizes="(min-width: 1024px) 15rem, 45vw"
                    className="object-cover"
                  />
                </div>
                <h3 className="mt-4 font-display text-lg font-bold text-foreground">
                  {person.name}
                </h3>
                <p className="mt-1">
                  <Badge tone="gold">{person.role}</Badge>
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{person.bio}</p>
              </li>
            ))}
          </ul>

          <p className="mx-auto mt-10 max-w-2xl rounded-xl border border-dashed border-gold-400/40 bg-muted/50 p-4 text-center text-sm text-muted-foreground">
            Chef Ramesh and Meera write most of{' '}
            <Link href="/blog" className="font-medium underline underline-offset-4">
              the journal
            </Link>{' '}
            — techniques, ingredients and the occasional argument about tomatoes.
          </p>
        </div>
      </section>

      <GuaranteeSection />

      {/* Onward links */}
      <section className="pb-24">
        <div className="container-royal">
          <div className="rounded-3xl border border-gold-400/30 bg-card p-8 text-center sm:p-12">
            <h2 className="font-display text-display-sm font-bold text-foreground">
              Come and see for yourself
            </h2>
            <p className="measure mx-auto mt-3 text-muted-foreground">
              {site.promise.reservation}. Or walk in — weekdays are rarely a problem.
            </p>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild variant="gold" size="lg">
                <Link href="/reserve">
                  Book a table
                  <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/menu">See the menu</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/stories">Read event stories</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
