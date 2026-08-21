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
import { getPublicMenu, getPublicMenuItems } from '@/lib/menu-source'
import { site } from '@/lib/site'

/**
 * The menu is rendered from the database, so the dish count in the title moves
 * with it — hence generateMetadata rather than a module-scope constant.
 */
export async function generateMetadata(): Promise<Metadata> {
  const count = (await getPublicMenuItems()).length
  return pageMeta({
  title: `Menu — ${count} Pure Veg Dishes | Prices in Uttam Nagar`,
  description: `Full menu with prices: paneer butter masala ₹349, Royal Special thali ₹349, masala dosa ₹139, chilli paneer ₹249 and ${count - 4} more. North Indian, Indo-Chinese, South Indian, pizza & pasta — all pure vegetarian.`,
  path: '/menu',
  keywords: [
    'Morsaabs menu with prices',
    'veg restaurant menu Uttam Nagar',
    'paneer dishes Dwarka Mor',
    'thali price Uttam Nagar',
    'dosa near Dwarka Mor',
  ],
  })
}

/*
 * Statically rendered and refreshed on demand: the dashboard calls
 * revalidatePath('/menu') whenever a dish changes, so an edit is live at once
 * without every visitor paying for a database round trip. The interval is a
 * backstop in case a revalidation is ever missed.
 */
export const revalidate = 300

export default async function MenuPage() {
  const [menu, allItems] = await Promise.all([getPublicMenu(), getPublicMenuItems()])
  return (
    <>
      <JsonLd data={menuSchema(menu)} />

      <PageHeader
        eyebrow="The Carte"
        title="Our Menu"
        lede={`${allItems.length} dishes across nine sections — every one of them pure vegetarian, cooked to order. Prices include taxes.`}
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
        <MenuBrowser menu={menu} />
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
