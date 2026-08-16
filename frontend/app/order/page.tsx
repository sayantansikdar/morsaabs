import { Suspense } from 'react'
import type { Metadata } from 'next'
import { PageHeader } from '@/components/layout/page-header'
import { OrderForm } from '@/components/forms/order-form'
import { RoyalLoader } from '@/components/ui/royal'
import { pageMeta } from '@/lib/seo'
import { site } from '@/lib/site'

export const metadata: Metadata = pageMeta({
  title: 'Order Online — Veg Food Delivery near Dwarka Mor in 35 Minutes',
  description:
    'Order pure vegetarian North Indian and Indo-Chinese food for delivery across Uttam Nagar, Mohan Garden and Dwarka Mor. Free delivery above ₹399, 35–45 minutes, pay by UPI, card or cash.',
  path: '/order',
  keywords: [
    'veg food delivery Uttam Nagar',
    'online food order Dwarka Mor',
    'paneer delivery Mohan Garden',
    'food delivery 110059',
  ],
})

export default function OrderPage() {
  return (
    <>
      <PageHeader
        eyebrow="Order Online"
        title="Order for delivery or takeaway"
        lede={`${site.promise.delivery}. Free above ₹399. You pay when it arrives — nothing is charged online.`}
        trail={[{ name: 'Order Online', href: '/order' }]}
      />

      <section className="py-14 sm:py-20">
        <div className="container-royal">
          {/* useSearchParams inside OrderForm needs a Suspense boundary. */}
          <Suspense fallback={<RoyalLoader label="Setting your table…" />}>
            <OrderForm />
          </Suspense>
        </div>
      </section>
    </>
  )
}
