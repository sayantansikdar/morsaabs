'use client'

import * as React from 'react'
import type { MenuItem } from '@/content/menu'

export type CartLine = { name: string; price: number; quantity: number; categorySlug?: string }

type CartContext = {
  lines: CartLine[]
  count: number
  subtotal: number
  add: (item: Pick<MenuItem, 'name' | 'price'>, categorySlug?: string) => void
  setQuantity: (name: string, quantity: number) => void
  remove: (name: string) => void
  clear: () => void
  hydrated: boolean
}

const CART_KEY = 'morsaabs.cart.v1'
const Ctx = React.createContext<CartContext | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = React.useState<CartLine[]>([])
  const [hydrated, setHydrated] = React.useState(false)

  // Restore after mount so the server and client render the same first pass.
  React.useEffect(() => {
    try {
      const raw = window.localStorage.getItem(CART_KEY)
      if (raw) setLines(JSON.parse(raw) as CartLine[])
    } catch {
      /* corrupt or unavailable storage — start with an empty cart */
    }
    setHydrated(true)
  }, [])

  React.useEffect(() => {
    if (!hydrated) return
    try {
      window.localStorage.setItem(CART_KEY, JSON.stringify(lines))
    } catch {
      /* nothing we can do; the cart just will not survive a reload */
    }
  }, [lines, hydrated])

  const value = React.useMemo<CartContext>(() => {
    const count = lines.reduce((n, l) => n + l.quantity, 0)
    const subtotal = lines.reduce((n, l) => n + l.quantity * l.price, 0)

    return {
      lines,
      count,
      subtotal,
      hydrated,
      add: (item, categorySlug) =>
        setLines((prev) => {
          const existing = prev.find((l) => l.name === item.name)
          if (existing) {
            return prev.map((l) => (l.name === item.name ? { ...l, quantity: l.quantity + 1 } : l))
          }
          return [...prev, { name: item.name, price: item.price, quantity: 1, categorySlug }]
        }),
      setQuantity: (name, quantity) =>
        setLines((prev) =>
          quantity <= 0
            ? prev.filter((l) => l.name !== name)
            : prev.map((l) => (l.name === name ? { ...l, quantity } : l))
        ),
      remove: (name) => setLines((prev) => prev.filter((l) => l.name !== name)),
      clear: () => setLines([]),
    }
  }, [lines, hydrated])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useCart(): CartContext {
  const ctx = React.useContext(Ctx)
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>')
  return ctx
}
