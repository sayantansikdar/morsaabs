import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { PageHeader } from '@/components/layout/page-header'
import { BeforeAfterSlider } from '@/components/sections/before-after'
import { SectionHeading } from '@/components/ui/royal'
import { Button } from '@/components/ui/button'
import { beforeAfter, media } from '@/content/media'
import { pageMeta } from '@/lib/seo'

export const metadata: Metadata = pageMeta({
  title: 'Gallery — The Room, The Kitchen & The Plates',
  description:
    'Inside Morsaab’s on Rama Park Road: the arched mezzanine, the tandoor, the pass, and three before-and-after comparisons of the fit-out and plating we rebuilt.',
  path: '/gallery',
  keywords: [
    'Morsaabs restaurant photos',
    'restaurant interior Uttam Nagar',
    'banquet hall photos Dwarka Mor',
  ],
})

const galleryImages = [
  media.interiorArches,
  media.tandoor,
  media.thali,
  media.paneerButterMasala,
  media.dosa,
  media.chilliPaneer,
  media.kitchenPass,
  media.banquetHall,
  media.dessert,
] as const

export default function GalleryPage() {
  return (
    <>
      <PageHeader
        eyebrow="Gallery"
        title="The room and the plate"
        lede="Photographs of the restaurant, the kitchen and the food — plus what three of our upgrades actually changed."
        trail={[{ name: 'Gallery', href: '/gallery' }]}
      />

      {/* Feature 51 — before / after */}
      <section aria-labelledby="ba-title" className="py-16 sm:py-24">
        <div className="container-royal">
          <SectionHeading
            id="ba-title"
            eyebrow="Then & Now"
            title="What we changed, and why"
            lede="Drag the handle, or focus it and use the arrow keys."
          />

          <div className="mt-14 space-y-8">
            {beforeAfter.map((pair) => (
              <BeforeAfterSlider key={pair.id} pair={pair} />
            ))}
          </div>
        </div>
      </section>

      {/* The rest of the gallery */}
      <section aria-labelledby="photos-title" className="bg-muted/40 py-16 sm:py-24">
        <div className="container-royal">
          <SectionHeading
            id="photos-title"
            eyebrow="Photographs"
            title="Around the restaurant"
          />

          <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {galleryImages.map((image, i) => (
              <li
                key={image.src}
                className="group overflow-hidden rounded-2xl border border-gold-400/20 bg-card"
              >
                <figure>
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      // Only the first row is likely above the fold.
                      loading={i < 3 ? 'eager' : 'lazy'}
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <figcaption className="p-4 text-sm leading-relaxed text-muted-foreground">
                    {image.alt}
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>

          <div className="mt-12 text-center">
            <Button asChild variant="gold" size="lg">
              <Link href="/reserve">Book a table and see it yourself</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
