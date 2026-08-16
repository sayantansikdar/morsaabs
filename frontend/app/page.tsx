import type { Metadata } from 'next'
import { Hero } from '@/components/sections/hero'
import { SignatureDishes, OfferStrip, AboutTeaser } from '@/components/sections/signature'
import { ServicesGrid } from '@/components/sections/services-grid'
import { StoriesTeaser, BlogTeaser, GuaranteeSection } from '@/components/sections/teasers'
import { Reviews } from '@/components/sections/reviews'
import { BeforeAfterSection } from '@/components/sections/before-after'
import { FaqSection } from '@/components/sections/faq'
import { LocationSection } from '@/components/sections/location'
import { JsonLd } from '@/components/shared/json-ld'
import { faqSchema } from '@/lib/schema'
import { pageMeta } from '@/lib/seo'

export const metadata: Metadata = pageMeta({
  // Feature 11 — title written for the local search terms people actually use.
  title: "Morsaab's — Pure Veg Restaurant near Dwarka Mor, Uttam Nagar | Delhi",
  // Feature 12.
  description:
    "Royal North Indian & Indo-Chinese pure vegetarian restaurant on Rama Park Road, Uttam Nagar — 7 min from Dwarka Mor metro. Dine-in, 35-min home delivery, catering & banquet. Open 11 AM–11 PM daily. ☎ +91 92119 97724",
  path: '/',
  keywords: [
    'pure veg restaurant near Dwarka Mor',
    'best restaurant Uttam Nagar',
    'North Indian restaurant Rama Park Road',
    'vegetarian thali Dwarka Mor',
    'Indo-Chinese Uttam Nagar',
    'food delivery 110059',
    'banquet hall Uttam Nagar',
    'catering Mohan Garden',
  ],
})

export default function HomePage() {
  return (
    <>
      <JsonLd data={faqSchema()} />

      <Hero />
      <SignatureDishes />
      <OfferStrip />
      <AboutTeaser />
      <ServicesGrid />
      <StoriesTeaser />
      <Reviews />
      <BeforeAfterSection />
      <GuaranteeSection />
      <BlogTeaser />
      <FaqSection />
      <LocationSection />
    </>
  )
}
