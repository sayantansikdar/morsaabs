import { Suspense } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHeader } from '@/components/layout/page-header'
import { MenuBrowser } from '@/components/sections/menu-browser'
import { JsonLd } from '@/components/shared/json-ld'
import { Button } from '@/components/ui/button'
import { RoyalLoader } from '@/components/ui/royal'
import { menuSchema } from '@/lib/schema'
import { pageMeta } from '@/lib/seo'
import { allMenuItems } from '@/content/menu'
import { site } from '@/lib/site'

export const metadata: Metadata = pageMeta({
  title: `Menu — ${allMenuItems.length} Pure Veg Dishes | Prices in Uttam Nagar`,
  description: `Full menu with prices: paneer butter masala ₹349, Royal Special thali ₹349, masala dosa ₹139, chilli paneer ₹249 and ${allMenuItems.length - 4} more. North Indian, Indo-Chinese, South Indian, pizza & pasta — all pure vegetarian.`,
  path: '/menu',
  keywords: [
    'Morsaabs menu with prices',
    'veg restaurant menu Uttam Nagar',
    'paneer dishes Dwarka Mor',
    'thali price Uttam Nagar',
    'dosa near Dwarka Mor',
  ],
})

export default function MenuPage() {
  return (
    <>
      <JsonLd data={menuSchema()} />

      <PageHeader
        eyebrow="The Carte"
        title="Our Menu"
        lede={`${allMenuItems.length} dishes across nine sections — every one of them pure vegetarian, cooked to order. Prices include taxes.`}
        trail={[{ name: 'Menu', href: '/menu' }]}
      >
        <div className="flex flex-wrap gap-3">
          <Button asChild variant="gold" size="lg">
            <Link href="/order">Order online</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-sand-50/50 text-sand-50 hover:bg-white/10"
          >
            <a href={`tel:${site.phone}`}>Call {site.phoneDisplay}</a>
          </Button>
        </div>
      </PageHeader>

      {/* useSearchParams inside MenuBrowser needs a Suspense boundary. */}
      <Suspense fallback={<RoyalLoader label="Laying out the carte…" />}>
        <MenuBrowser />
      </Suspense>

      {/* Print-only header — the screen version lives in PageHeader. */}
      <div id="print" className="hidden print:block">
        <h2>{site.name} — Full Menu</h2>
        <p>
          {site.phoneDisplay} · {site.hours.display} · {site.url}
        </p>
      </div>
    </>
  )
}
