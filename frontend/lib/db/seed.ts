/**
 * Seeds the menu from `content/menu.ts` into the database.
 *
 * This is the one-way migration that moves the carte out of code so the admin
 * dashboard can edit it. Run once against a fresh database:
 *
 *     npm run db:seed
 *
 * It is idempotent: categories and dishes are matched on (slug) and
 * (category, name), so re-running updates rather than duplicating. It never
 * deletes — a dish removed from code but present in the database is left alone,
 * because after go-live the database is the source of truth, not this file.
 */

import { config } from 'dotenv'
import { eq, and } from 'drizzle-orm'

// Run outside Next, so .env.local is not picked up automatically.
config({ path: ['.env.local', '.env'] })

import { getDb } from './index'
import { menuCategories, menuItems } from './schema'
import { menu } from '../../content/menu'
import { media } from '../../content/media'

/**
 * The handful of dishes we already have real photography for. Everything else
 * starts without an image; staff upload them through the dashboard.
 */
const DISH_PHOTOS: Record<string, { src: string; alt: string }> = {
  'Paneer Butter Masala': media.paneerButterMasala,
  'Masala Dosa': media.dosa,
  'Plain Dosa': media.dosa,
}

async function seed() {
  const db = getDb()

  let categoryCount = 0
  let itemCount = 0

  for (const [categoryIndex, category] of menu.entries()) {
    const [row] = await db
      .insert(menuCategories)
      .values({
        slug: category.slug,
        name: category.name,
        blurb: category.blurb,
        sortOrder: categoryIndex,
      })
      .onConflictDoUpdate({
        target: menuCategories.slug,
        set: {
          name: category.name,
          blurb: category.blurb,
          sortOrder: categoryIndex,
          updatedAt: new Date(),
        },
      })
      .returning({ id: menuCategories.id })

    categoryCount += 1

    for (const [itemIndex, item] of category.items.entries()) {
      const photo = DISH_PHOTOS[item.name]

      // No unique constraint spans (category, name) — a restaurant may legitimately
      // repeat a dish name across categories — so upsert by explicit lookup.
      const existing = await db
        .select({ id: menuItems.id })
        .from(menuItems)
        .where(and(eq(menuItems.categoryId, row.id), eq(menuItems.name, item.name)))
        .limit(1)

      const values = {
        categoryId: row.id,
        name: item.name,
        price: item.price,
        description: item.description,
        spice: item.spice,
        chefSpecial: item.chefSpecial ?? false,
        bestseller: item.bestseller ?? false,
        jain: item.jain ?? false,
        vegan: item.vegan ?? false,
        contains: item.contains ?? [],
        imageUrl: photo?.src ?? null,
        imageAlt: photo?.alt ?? null,
        sortOrder: itemIndex,
        updatedAt: new Date(),
      }

      if (existing.length > 0) {
        await db.update(menuItems).set(values).where(eq(menuItems.id, existing[0].id))
      } else {
        await db.insert(menuItems).values(values)
      }

      itemCount += 1
    }
  }

  console.log(`Seeded ${categoryCount} categories and ${itemCount} dishes.`)
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Seed failed:', error)
    process.exit(1)
  })
