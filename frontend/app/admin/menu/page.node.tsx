import { getMenu } from '@/lib/db/queries'
import { MenuEditor } from './menu-editor'
import { requireAdminOrNull } from '@/lib/admin-auth'

/**
 * Menu management.
 *
 * `includeUnavailable` is on: the dashboard must show dishes that are currently
 * off the menu, otherwise there is no way to switch one back on.
 */

export const dynamic = 'force-dynamic'

export default async function AdminMenuPage() {
  // Resource-level gate. The layout's refusal only hides the UI; without this
  // the page still runs and its rows travel in the RSC payload. See
  // requireAdminOrNull.
  if (!(await requireAdminOrNull())) return null

  const categories = await getMenu({ includeUnavailable: true })
  const dishCount = categories.reduce((total, category) => total + category.items.length, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold">Menu &amp; prices</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {dishCount} dishes across {categories.length} categories. Changes go live on the
          public menu as soon as you save.
        </p>
      </div>

      <MenuEditor categories={categories} />
    </div>
  )
}
