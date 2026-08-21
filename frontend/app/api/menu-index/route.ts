import { NextResponse } from 'next/server'
import { getPublicMenuItems } from '@/lib/menu-source'

/**
 * The dish list, for the site search.
 *
 * Search lives in the header, so it is on every page. Feeding it from the
 * server would make every page dynamic just to keep a search index fresh —
 * this route lets those pages stay static and lets the dialog fetch the
 * current dishes the first time someone opens it.
 *
 * Only what the results actually render: no descriptions of dishes that are
 * unavailable, no internal ids.
 */

export const revalidate = 300

export async function GET() {
  try {
    const items = await getPublicMenuItems()

    return NextResponse.json(
      items.map((item) => ({
        name: item.name,
        price: item.price,
        description: item.description,
        spice: item.spice,
        chefSpecial: item.chefSpecial ?? false,
        category: item.category,
        categorySlug: item.categorySlug,
      })),
      {
        // Cheap to serve and rarely changes; let the CDN hold it, and keep
        // serving the old copy while a new one is fetched.
        headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=3600' },
      }
    )
  } catch (error) {
    console.error('[menu-index] failed', error)
    // The dialog falls back to its bundled list, so an empty array is safe.
    return NextResponse.json([], { status: 200 })
  }
}
