'use client'

import * as React from 'react'
import Image from 'next/image'
import { updateMenuItemAction, deleteMenuItemAction } from '../actions'
import type { MenuItemRow } from '@/lib/db/schema'

/**
 * Inline menu editing.
 *
 * Saving is explicit — a "Save" button per dish rather than save-on-blur.
 * Prices are the kind of field where an accidental keystroke followed by a
 * click elsewhere must not silently reprice the menu.
 */

type Category = {
  id: number
  name: string
  slug: string
  items: MenuItemRow[]
}

export function MenuEditor({ categories }: { categories: Category[] }) {
  return (
    <div className="space-y-10">
      {categories.map((category) => (
        <section key={category.id} aria-labelledby={`cat-${category.id}`}>
          <div className="mb-3 flex items-baseline justify-between gap-4">
            <h2 id={`cat-${category.id}`} className="font-display text-xl font-semibold">
              {category.name}
            </h2>
            <span className="text-sm text-muted-foreground">
              {category.items.length} {category.items.length === 1 ? 'dish' : 'dishes'}
            </span>
          </div>

          <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
            {category.items.map((item) => (
              <DishRow key={item.id} item={item} />
            ))}
            {category.items.length === 0 && (
              <li className="p-4 text-sm text-muted-foreground">No dishes in this category.</li>
            )}
          </ul>
        </section>
      ))}
    </div>
  )
}

function DishRow({ item }: { item: MenuItemRow }) {
  const [open, setOpen] = React.useState(false)
  const [pending, startTransition] = React.useTransition()
  const [message, setMessage] = React.useState<string | null>(null)

  // Local draft so typing never fights the server-rendered value.
  const [price, setPrice] = React.useState(String(item.price))
  const [name, setName] = React.useState(item.name)
  const [description, setDescription] = React.useState(item.description)
  const [imageUrl, setImageUrl] = React.useState(item.imageUrl ?? '')
  const [imageAlt, setImageAlt] = React.useState(item.imageAlt ?? '')
  const [available, setAvailable] = React.useState(item.isAvailable)
  const [bestseller, setBestseller] = React.useState(item.bestseller)
  const [chefSpecial, setChefSpecial] = React.useState(item.chefSpecial)

  const dirty =
    price !== String(item.price) ||
    name !== item.name ||
    description !== item.description ||
    imageUrl !== (item.imageUrl ?? '') ||
    imageAlt !== (item.imageAlt ?? '') ||
    available !== item.isAvailable ||
    bestseller !== item.bestseller ||
    chefSpecial !== item.chefSpecial

  function save() {
    const parsed = Number(price)
    if (!Number.isInteger(parsed) || parsed < 1) {
      setMessage('Enter a whole number of rupees, at least ₹1.')
      return
    }

    setMessage(null)
    startTransition(async () => {
      const result = await updateMenuItemAction({
        id: item.id,
        name,
        price: parsed,
        description,
        imageUrl: imageUrl.trim() === '' ? null : imageUrl.trim(),
        imageAlt: imageAlt.trim() === '' ? null : imageAlt.trim(),
        isAvailable: available,
        bestseller,
        chefSpecial,
      })
      setMessage(result.ok ? 'Saved.' : result.error)
    })
  }

  function remove() {
    // Deleting a dish is not undoable from the UI, so make the user mean it.
    if (!window.confirm(`Delete “${item.name}” from the menu? This cannot be undone.`)) return
    startTransition(async () => {
      const result = await deleteMenuItemAction(item.id)
      if (!result.ok) setMessage(result.error)
    })
  }

  return (
    <li className="p-4">
      <div className="flex flex-wrap items-center gap-3">
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt=""
            width={48}
            height={48}
            className="size-12 shrink-0 rounded-md object-cover"
          />
        ) : (
          <div
            aria-hidden="true"
            className="grid size-12 shrink-0 place-items-center rounded-md bg-muted text-xs text-muted-foreground"
          >
            —
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="truncate font-medium">{item.name}</div>
          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
            {!item.isAvailable && <span className="text-amber-700">Unavailable</span>}
            {item.bestseller && <span>Bestseller</span>}
            {item.chefSpecial && <span>Chef&rsquo;s special</span>}
          </div>
        </div>

        <label className="flex items-center gap-1.5 text-sm">
          <span className="text-muted-foreground">₹</span>
          <input
            type="number"
            inputMode="numeric"
            min={1}
            step={1}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            aria-label={`Price for ${item.name} in rupees`}
            className="w-24 rounded-md border border-border bg-background px-2 py-1.5 text-right tabular-nums"
          />
        </label>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="rounded-md border border-border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-muted"
        >
          {open ? 'Close' : 'Edit'}
        </button>

        <button
          type="button"
          onClick={save}
          disabled={!dirty || pending}
          className="rounded-md bg-foreground px-3 py-1.5 text-sm font-semibold text-background transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          {pending ? 'Saving…' : 'Save'}
        </button>
      </div>

      {open && (
        <div className="mt-4 grid gap-4 rounded-lg bg-muted/40 p-4 sm:grid-cols-2">
          <Field label="Dish name">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            />
          </Field>

          <Field label="Photo URL" hint="Paste an image link, or leave empty for no photo.">
            <input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://…"
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            />
          </Field>

          <Field label="Description" className="sm:col-span-2">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            />
          </Field>

          <Field
            label="Photo description"
            hint="Describes the photo for screen readers and when images fail to load."
            className="sm:col-span-2"
          >
            <input
              value={imageAlt}
              onChange={(e) => setImageAlt(e.target.value)}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            />
          </Field>

          <div className="flex flex-wrap gap-4 sm:col-span-2">
            <Toggle checked={available} onChange={setAvailable} label="Available to order" />
            <Toggle checked={bestseller} onChange={setBestseller} label="Bestseller" />
            <Toggle checked={chefSpecial} onChange={setChefSpecial} label="Chef's special" />
          </div>

          <div className="sm:col-span-2">
            <button
              type="button"
              onClick={remove}
              disabled={pending}
              className="text-sm font-medium text-red-700 underline underline-offset-4 hover:text-red-800 disabled:opacity-40"
            >
              Delete this dish
            </button>
          </div>
        </div>
      )}

      {message && (
        <p
          role="status"
          className={`mt-2 text-sm ${message === 'Saved.' ? 'text-green-700' : 'text-red-700'}`}
        >
          {message}
        </p>
      )}
    </li>
  )
}

function Field({
  label,
  hint,
  className = '',
  children,
}: {
  label: string
  hint?: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1 block text-sm font-medium">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-muted-foreground">{hint}</span>}
    </label>
  )
}

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: (value: boolean) => void
  label: string
}) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="size-4 rounded border-border"
      />
      {label}
    </label>
  )
}
