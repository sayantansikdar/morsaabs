'use client'

import * as React from 'react'
import Image from 'next/image'
import { Flame, Crown, Plus, Check, Sparkles, Leaf } from 'lucide-react'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { Badge } from '@/components/ui/royal'
import { useCart } from '@/components/cart-provider'
import { SPICE_LABEL, type MenuItem, type SpiceLevel } from '@/content/menu'
import { formatPrice } from '@/lib/site'
import { track } from '@/lib/analytics'
import { cn } from '@/lib/utils'

/**
 * Feature 42 — the spice meter, as a tooltip rather than colour alone.
 *
 * Three flames are always rendered; the unlit ones stay visible at low opacity
 * so the level reads as "2 of 3" and not just "some orange". The numeric level
 * is also in the accessible name, so it survives with images or colour off.
 */
export function SpiceMeter({ level, className }: { level: SpiceLevel; className?: string }) {
  if (level === 0) return null
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          // min-h-6 / px-1 lift the hit area to the 24×24px floor; the negative
          // margin keeps the flames optically aligned with the badges beside them.
          className={cn(
            '-mx-1 inline-flex min-h-6 cursor-help items-center gap-px rounded px-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            className
          )}
          aria-label={`Spice level ${level} of 3 — ${SPICE_LABEL[level]}`}
        >
          {([1, 2, 3] as const).map((n) => (
            <Flame
              key={n}
              aria-hidden="true"
              className={cn(
                'size-3.5 transition-colors',
                n <= level ? 'fill-maroon-500 text-maroon-600' : 'text-muted-foreground/25'
              )}
            />
          ))}
        </button>
      </TooltipTrigger>
      <TooltipContent>{SPICE_LABEL[level]}</TooltipContent>
    </Tooltip>
  )
}

export function DishCard({
  item,
  categorySlug,
  className,
}: {
  item: MenuItem
  categorySlug?: string
  className?: string
}) {
  const { add } = useCart()
  const [justAdded, setJustAdded] = React.useState(false)

  React.useEffect(() => {
    if (!justAdded) return
    const t = setTimeout(() => setJustAdded(false), 1600)
    return () => clearTimeout(t)
  }, [justAdded])

  function handleAdd() {
    add(item, categorySlug)
    setJustAdded(true)
    track('add_to_cart', {
      currency: 'INR',
      value: item.price,
      items: [{ item_name: item.name, price: item.price, item_category: categorySlug }],
    })
  }

  return (
    <article
      data-print="card"
      className={cn(
        // Feature 27 — the hover state lifts the card and warms its border,
        // using transform and colour only so nothing reflows.
        'group relative flex flex-col rounded-2xl border border-gold-400/20 bg-card p-5 transition-all duration-300',
        'hover:-translate-y-1 hover:border-gold-400/60 hover:shadow-royal focus-within:border-gold-400/60',
        className
      )}
    >
      {/* Photography is optional and most dishes have none, so the card must
          look deliberate without it — hence no placeholder, just no image. */}
      {item.imageUrl && (
        <div className="relative mb-4 aspect-[4/3] overflow-hidden rounded-xl bg-muted">
          <Image
            src={item.imageUrl}
            // Empty alt when there is no description: the dish name is already
            // the heading directly below, and repeating it makes a screen
            // reader say everything twice.
            alt={item.imageAlt ?? ''}
            fill
            sizes="(min-width: 1024px) 22rem, (min-width: 640px) 45vw, 90vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-lg font-bold leading-snug text-foreground">
            {item.name}
          </h3>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
        </div>
        <p className="tnum shrink-0 font-display text-xl font-bold text-maroon-700 dark:text-gold-300">
          {formatPrice(item.price)}
        </p>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <SpiceMeter level={item.spice} />

        {item.chefSpecial && (
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="cursor-help">
                <Badge tone="gold">
                  <Crown className="size-3" aria-hidden="true" />
                  Chef’s Pick
                </Badge>
              </span>
            </TooltipTrigger>
            <TooltipContent>
              Chosen by Chef Ramesh — the dish he sends out when someone asks what to order.
            </TooltipContent>
          </Tooltip>
        )}

        {item.bestseller && (
          <Badge tone="maroon">
            <Sparkles className="size-3" aria-hidden="true" />
            Bestseller
          </Badge>
        )}

        {item.jain && <Badge tone="royal">Jain</Badge>}

        {item.vegan && (
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="cursor-help">
                <Badge tone="royal">
                  <Leaf className="size-3" aria-hidden="true" />
                  Vegan
                </Badge>
              </span>
            </TooltipTrigger>
            <TooltipContent>No dairy, no honey. Cooked in oil rather than ghee.</TooltipContent>
          </Tooltip>
        )}

        {item.contains && item.contains.length > 0 && (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                className="-mx-1 inline-flex min-h-6 cursor-help items-center rounded px-1 text-xs font-medium text-muted-foreground underline decoration-dotted underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Allergens
              </button>
            </TooltipTrigger>
            <TooltipContent>Contains {item.contains.join(', ').toLowerCase()}.</TooltipContent>
          </Tooltip>
        )}
      </div>

      <button
        type="button"
        onClick={handleAdd}
        data-print="hide"
        className={cn(
          'mt-5 flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-full border-2 text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          justAdded
            ? 'border-royal-600 bg-royal-600 text-sand-50'
            : 'border-gold-400/60 text-maroon-700 hover:border-gold-400 hover:bg-gold-400 hover:text-maroon-950 dark:text-gold-300 dark:hover:text-maroon-950'
        )}
      >
        {justAdded ? (
          <>
            <Check className="size-4" aria-hidden="true" />
            Added
          </>
        ) : (
          <>
            <Plus className="size-4" aria-hidden="true" />
            Add to order
          </>
        )}
        <span className="sr-only">— {item.name}</span>
      </button>

      {/* Announces the add without moving focus. */}
      <span aria-live="polite" className="sr-only">
        {justAdded ? `${item.name} added to your order` : ''}
      </span>
    </article>
  )
}
