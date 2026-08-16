import type { Metadata } from 'next'
import { PageHeader } from '@/components/layout/page-header'
import { FaqSection } from '@/components/sections/faq'
import { JsonLd } from '@/components/shared/json-ld'
import { faqSchema } from '@/lib/schema'
import { pageMeta } from '@/lib/seo'

export const metadata: Metadata = pageMeta({
  title: 'Questions — Delivery Times, Jain Food, Catering & Payment',
  description:
    'Is the kitchen fully pure veg? How long does delivery take? Do I need to book? Can you cater a wedding? What payments do you accept? Answered plainly.',
  path: '/faq',
  keywords: [
    'pure veg restaurant questions',
    'Jain food Uttam Nagar',
    'delivery time Dwarka Mor restaurant',
    'catering minimum guests Delhi',
  ],
})

export default function FaqPage() {
  return (
    <>
      <JsonLd data={faqSchema()} />

      <PageHeader
        eyebrow="Questions"
        title="Everything people ask us"
        lede="The five we field most often, answered the way we would answer them on the phone."
        trail={[{ name: 'Questions', href: '/faq' }]}
      />

      <FaqSection heading={false} className="py-14 sm:py-20" />
    </>
  )
}
