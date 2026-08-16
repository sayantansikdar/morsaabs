import type { Metadata } from 'next'
import { PageHeader } from '@/components/layout/page-header'
import { ServicesGrid } from '@/components/sections/services-grid'
import { FaqSection } from '@/components/sections/faq'
import { pageMeta } from '@/lib/seo'

export const metadata: Metadata = pageMeta({
  title: 'Services — Dine-In, Delivery, Catering & Banquet in Uttam Nagar',
  description:
    'Five ways to eat with us: 90-cover dine-in, 20-minute takeaway, 35-minute home delivery across Dwarka Mor, catering from 30 to 800 guests, and a 120-seat banquet hall.',
  path: '/services',
  keywords: [
    'catering services Uttam Nagar',
    'banquet hall Dwarka Mor',
    'food delivery Mohan Garden',
    'party catering New Delhi 110059',
  ],
})

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="How We Serve"
        title="Our Services"
        lede="One kitchen, five ways to reach you — whether that is table nine on a Tuesday or eight hundred guests on a farmhouse lawn."
        trail={[{ name: 'Services', href: '/services' }]}
      />

      <ServicesGrid />
      <FaqSection className="bg-muted/40 py-20 sm:py-28" />
    </>
  )
}
