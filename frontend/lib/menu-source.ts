/**
 * What the public site shows as the menu.
 *
 * The database is the source of truth once it exists: the dashboard edits it,
 * and a price or photograph changed there has to reach the customer-facing menu
 * or the dashboard is a lie. content/menu.ts is the fallback, for a build with
 * no DATABASE_URL — CI, and the static export.
 *
 * Rows are mapped back to the shape the menu components already speak, so the
 * two sources are interchangeable and nothing downstream needs to know which
 * one it got.
 */

import 'server-only'
import { menu as staticMenu, type MenuCategory, type SpiceLevel } from '@/content/menu'
import { isDatabaseConfigured } from './db'
import { getMenu } from './db/queries'

export async function getPublicMenu(): Promise<MenuCategory[]> {
  if (!isDatabaseConfigured()) return staticMenu

  try {
    const categories = await getMenu()

    // An empty database — migrated but never seeded — would otherwise blank the
    // menu. Falling back is the safer failure: a stale menu beats no menu.
    if (categories.length === 0) return staticMenu

    return categories.map((category) => ({
      slug: category.slug,
      name: category.name,
      blurb: category.blurb,
      items: category.items.map((item) => ({
        name: item.name,
        price: item.price,
        description: item.description,
        spice: item.spice as SpiceLevel,
        chefSpecial: item.chefSpecial,
        bestseller: item.bestseller,
        jain: item.jain,
        vegan: item.vegan,
        contains: parseContains(item.contains),
        imageUrl: item.imageUrl,
        imageAlt: item.imageAlt,
      })),
    }))
  } catch (error) {
    // A database hiccup must not take the menu page down with it.
    console.error('[menu] falling back to the bundled menu', error)
    return staticMenu
  }
}

/** Flattened, for search and "all dishes" views. */
export async function getPublicMenuItems() {
  const categories = await getPublicMenu()
  return categories.flatMap((category) =>
    category.items.map((item) => ({
      ...item,
      category: category.name,
      categorySlug: category.slug,
    }))
  )
}

/** `contains` is stored as a JSON array of strings. */
function parseContains(raw: unknown): string[] | undefined {
  if (Array.isArray(raw)) return raw as string[]
  if (typeof raw !== 'string' || raw.trim() === '') return undefined
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : undefined
  } catch {
    return undefined
  }
}
