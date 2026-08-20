'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Minus, Plus, Trash2, ShoppingBag, Bike, Store, Clock, Tag, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Field, Input, Textarea, Select } from '@/components/ui/field'
import { ConfirmDialog } from '@/components/ui/dialog'
import { ErrorSummary, SubmissionsUnavailableNotice } from '@/components/shared/form-parts'
import { useErrorFocus } from '@/components/shared/use-error-focus'
import { useCart } from '@/components/cart-provider'
import { orderSchema, fieldErrors } from '@/lib/validation'
import { submitForm, SUBMISSIONS_UNAVAILABLE } from '@/lib/submit'
import { track } from '@/lib/analytics'
import { site, formatPrice } from '@/lib/site'
import { cn } from '@/lib/utils'

/**
 * Whether this deployment can take money online.
 *
 * The publishable key is public by design, so its presence is a safe signal in
 * the browser. Server-side the real gate is STRIPE_SECRET_KEY, checked again
 * when the order is submitted — this only decides whether to show the option.
 */
const ONLINE_PAYMENT_ENABLED = Boolean(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)

const LABELS: Record<string, string> = {
  name: 'Your name',
  phone: 'Phone number',
  mode: 'Delivery or takeaway',
  address: 'Delivery address',
  landmark: 'Landmark',
  notes: 'Instructions',
  payment: 'Payment method',
  form: 'Submission',
}

const DELIVERY_FEE = 29
const FREE_DELIVERY_OVER = 399
const MIN_ORDER = 199

export function OrderForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { lines, subtotal, count, setQuantity, remove, clear, hydrated } = useCart()

  const [mode, setMode] = React.useState<'delivery' | 'takeaway'>(
    searchParams.get('mode') === 'takeaway' ? 'takeaway' : 'delivery'
  )
  const [promo, setPromo] = React.useState('')
  const [promoApplied, setPromoApplied] = React.useState(false)
  const [promoError, setPromoError] = React.useState('')
  const [errors, setErrors] = React.useState<Record<string, string>>({})
  const [submitting, setSubmitting] = React.useState(false)
  const [confirmOpen, setConfirmOpen] = React.useState(false)
  const [clearOpen, setClearOpen] = React.useState(false)
  const [pending, setPending] = React.useState<Record<string, unknown> | null>(null)
  const { ref: summaryRef, focusSummary } = useErrorFocus<HTMLDivElement>()
  const formRef = React.useRef<HTMLFormElement>(null)

  const discount = promoApplied ? Math.round(subtotal * 0.15) : 0
  const deliveryFee =
    mode === 'delivery' && subtotal > 0 && subtotal - discount < FREE_DELIVERY_OVER ? DELIVERY_FEE : 0
  const total = Math.max(0, subtotal - discount + deliveryFee)
  const belowMinimum = subtotal > 0 && subtotal < MIN_ORDER

  function applyPromo(e: React.FormEvent) {
    e.preventDefault()
    const code = promo.trim().toUpperCase()
    if (code !== site.offer.code) {
      setPromoError(`That code is not one of ours. Try ${site.offer.code}.`)
      setPromoApplied(false)
      return
    }
    if (subtotal < 599) {
      setPromoError('This code applies to orders above ₹599. Add a little more to use it.')
      setPromoApplied(false)
      return
    }
    setPromoError('')
    setPromoApplied(true)
    track('promo_applied', { code })
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (lines.length === 0) {
      setErrors({ form: 'Your order is empty. Add something from the menu first.' })
      focusSummary()
      return
    }
    if (belowMinimum) {
      setErrors({ form: `The minimum order is ${formatPrice(MIN_ORDER)}. Add ${formatPrice(MIN_ORDER - subtotal)} more.` })
      focusSummary()
      return
    }

    const raw = Object.fromEntries(new FormData(formRef.current!))
    const parsed = orderSchema.safeParse({ ...raw, mode })

    if (!parsed.success) {
      const next = fieldErrors(parsed.error)
      setErrors(next)
      focusSummary()
      track('form_error', { form: 'order', error_count: Object.keys(next).length })
      return
    }

    setErrors({})
    setPending({
      ...parsed.data,
      items: lines,
      subtotal,
      discount,
      deliveryFee,
      total,
      promoCode: promoApplied ? site.offer.code : null,
    })
    setConfirmOpen(true)
  }

  async function send() {
    if (!pending) return
    setSubmitting(true)
    const result = await submitForm('orders', pending)
    setSubmitting(false)

    if (!result.ok) {
      setErrors({ form: result.error })
      focusSummary()
      return
    }

    track('purchase', {
      currency: 'INR',
      value: total,
      transaction_id: result.reference,
      items: lines.map((l) => ({ item_name: l.name, price: l.price, quantity: l.quantity })),
    })

    clear()

    // Paying online: hand the guest to Stripe. Not router.push — the checkout
    // page is on Stripe's domain, so this has to leave the app entirely.
    if (result.checkoutUrl) {
      window.location.href = result.checkoutUrl
      return
    }

    router.push(
      `/thank-you?type=order&ref=${result.reference}&name=${encodeURIComponent(String(pending.name))}&mode=${mode}&total=${total}`
    )
  }

  if (!hydrated) {
    return (
      <div className="space-y-4" aria-busy="true">
        <div className="skeleton h-24 w-full rounded-2xl" />
        <div className="skeleton h-24 w-full rounded-2xl" />
        <div className="skeleton h-64 w-full rounded-2xl" />
      </div>
    )
  }

  return (
    <>
      <div className="grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:items-start">
        {/* ------------------------------------------------------- Cart --- */}
        <section aria-labelledby="cart-title" className="rounded-3xl border border-gold-400/25 bg-card p-6 sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <h2 id="cart-title" className="font-display text-2xl font-bold text-foreground">
              Your order
            </h2>
            {count > 0 && (
              <Button variant="ghost" size="sm" onClick={() => setClearOpen(true)}>
                <Trash2 aria-hidden="true" />
                Clear
              </Button>
            )}
          </div>

          {lines.length === 0 ? (
            <div className="py-12 text-center">
              <ShoppingBag className="mx-auto size-10 text-muted-foreground/40" aria-hidden="true" />
              <p className="mt-4 font-display text-lg font-bold text-foreground">
                Nothing here yet
              </p>
              <p className="measure mx-auto mt-2 text-sm text-muted-foreground">
                Add dishes from the menu and they will appear here. Your order is kept on
                this device if you leave and come back.
              </p>
              <Button asChild variant="gold" className="mt-6">
                <Link href="/menu">Browse the menu</Link>
              </Button>
            </div>
          ) : (
            <>
              <ul className="mt-6 divide-y divide-border">
                {lines.map((line) => (
                  <li key={line.name} className="flex items-center gap-4 py-4">
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-foreground">{line.name}</p>
                      <p className="tnum mt-0.5 text-sm text-muted-foreground">
                        {formatPrice(line.price)} each
                      </p>
                    </div>

                    <div className="flex items-center gap-1 rounded-full border border-input">
                      <button
                        type="button"
                        onClick={() => setQuantity(line.name, line.quantity - 1)}
                        aria-label={`Reduce ${line.name} to ${line.quantity - 1}`}
                        className="grid size-10 cursor-pointer place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <Minus className="size-4" aria-hidden="true" />
                      </button>
                      <span className="tnum w-7 text-center font-semibold text-foreground" aria-live="polite">
                        {line.quantity}
                        <span className="sr-only"> {line.name}</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity(line.name, line.quantity + 1)}
                        aria-label={`Increase ${line.name} to ${line.quantity + 1}`}
                        className="grid size-10 cursor-pointer place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <Plus className="size-4" aria-hidden="true" />
                      </button>
                    </div>

                    <p className="tnum w-20 shrink-0 text-right font-display text-lg font-bold text-maroon-700 dark:text-gold-300">
                      {formatPrice(line.price * line.quantity)}
                    </p>

                    <button
                      type="button"
                      onClick={() => remove(line.name)}
                      aria-label={`Remove ${line.name} from your order`}
                      className="grid size-10 shrink-0 cursor-pointer place-items-center rounded-full text-muted-foreground transition-colors hover:bg-maroon-600/10 hover:text-maroon-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <Trash2 className="size-4" aria-hidden="true" />
                    </button>
                  </li>
                ))}
              </ul>

              {/* Promo code */}
              <form onSubmit={applyPromo} className="mt-6 border-t border-border pt-6">
                <label htmlFor="promo" className="mb-1.5 block text-sm font-semibold text-foreground">
                  Discount code
                </label>
                <div className="flex gap-2">
                  <Input
                    id="promo"
                    value={promo}
                    onChange={(e) => {
                      setPromo(e.target.value)
                      setPromoError('')
                    }}
                    placeholder={site.offer.code}
                    aria-describedby={promoError ? 'promo-error' : 'promo-help'}
                    aria-invalid={promoError ? true : undefined}
                    invalid={!!promoError}
                    className="uppercase"
                    disabled={promoApplied}
                  />
                  <Button type="submit" variant="outline" disabled={promoApplied || promo.length === 0}>
                    {promoApplied ? <Check aria-hidden="true" /> : <Tag aria-hidden="true" />}
                    {promoApplied ? 'Applied' : 'Apply'}
                  </Button>
                </div>
                {promoError ? (
                  <p id="promo-error" role="alert" className="mt-1.5 text-sm font-medium text-maroon-700 dark:text-maroon-300">
                    {promoError}
                  </p>
                ) : (
                  <p id="promo-help" className="mt-1.5 text-sm text-muted-foreground">
                    {site.offer.description}.
                  </p>
                )}
              </form>

              {/* Totals */}
              <dl className="mt-6 space-y-2 border-t border-border pt-6 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Subtotal</dt>
                  <dd className="tnum font-medium text-foreground">{formatPrice(subtotal)}</dd>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between">
                    <dt className="text-royal-600 dark:text-royal-300">
                      Discount ({site.offer.code})
                    </dt>
                    <dd className="tnum font-medium text-royal-600 dark:text-royal-300">
                      −{formatPrice(discount)}
                    </dd>
                  </div>
                )}
                {mode === 'delivery' && (
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Delivery</dt>
                    <dd className="tnum font-medium text-foreground">
                      {deliveryFee === 0 ? 'Free' : formatPrice(deliveryFee)}
                    </dd>
                  </div>
                )}
                <div className="flex justify-between border-t border-border pt-3 text-base">
                  <dt className="font-display font-bold text-foreground">Total</dt>
                  <dd className="tnum font-display text-xl font-bold text-maroon-700 dark:text-gold-300">
                    {formatPrice(total)}
                  </dd>
                </div>
              </dl>

              {belowMinimum && (
                <p role="alert" className="mt-4 rounded-lg bg-maroon-50 p-3 text-sm font-medium text-maroon-700 dark:bg-maroon-950/50 dark:text-maroon-200">
                  Minimum order is {formatPrice(MIN_ORDER)}. Add {formatPrice(MIN_ORDER - subtotal)}{' '}
                  more to check out.
                </p>
              )}

              <Button asChild variant="ghost" size="sm" className="mt-4">
                <Link href="/menu">+ Add more dishes</Link>
              </Button>
            </>
          )}
        </section>

        {/* --------------------------------------------------- Checkout --- */}
        <form
          ref={formRef}
          onSubmit={onSubmit}
          noValidate
          className="rounded-3xl border border-gold-400/25 bg-card p-6 sm:p-8"
        >
          <h2 className="font-display text-2xl font-bold text-foreground">Your details</h2>

          <div className="mt-6">
            {SUBMISSIONS_UNAVAILABLE && (
          <SubmissionsUnavailableNotice
            phone={site.phone}
            phoneDisplay={site.phoneDisplay}
            action="place an order"
          />
        )}

        <ErrorSummary ref={summaryRef} errors={errors} labels={LABELS} />
          </div>

          {/* Mode toggle */}
          <fieldset className="mt-2">
            <legend className="mb-2 text-sm font-semibold text-foreground">
              How would you like it?
            </legend>
            <div className="grid grid-cols-2 gap-3">
              {(
                [
                  { value: 'delivery', label: 'Delivery', detail: site.promise.deliveryShort, Icon: Bike },
                  { value: 'takeaway', label: 'Takeaway', detail: 'Ready in 20–25 min', Icon: Store },
                ] as const
              ).map((option) => (
                <label
                  key={option.value}
                  className={cn(
                    'flex cursor-pointer flex-col items-center gap-1.5 rounded-xl border-2 p-4 text-center transition-colors',
                    mode === option.value
                      ? 'border-maroon-700 bg-maroon-700/5'
                      : 'border-input hover:border-gold-400/60 hover:bg-muted/50'
                  )}
                >
                  <input
                    type="radio"
                    name="mode"
                    value={option.value}
                    checked={mode === option.value}
                    onChange={() => setMode(option.value)}
                    className="sr-only"
                  />
                  <option.Icon
                    className={cn(
                      'size-6',
                      mode === option.value ? 'text-maroon-700 dark:text-gold-300' : 'text-muted-foreground'
                    )}
                    aria-hidden="true"
                  />
                  <span className="font-semibold text-foreground">{option.label}</span>
                  <span className="text-xs text-muted-foreground">{option.detail}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="mt-5 space-y-5">
            <Field id="name" label={LABELS.name} required error={errors.name}>
              {(props) => (
                <Input {...props} name="name" autoComplete="name" placeholder="Your name" invalid={!!errors.name} />
              )}
            </Field>

            <Field
              id="phone"
              label={LABELS.phone}
              required
              helper="The rider calls this number."
              error={errors.phone}
            >
              {(props) => (
                <Input
                  {...props}
                  name="phone"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  placeholder="98765 43210"
                  invalid={!!errors.phone}
                />
              )}
            </Field>

            {/* Progressive disclosure — address only when it is needed. */}
            {mode === 'delivery' && (
              <>
                <Field
                  id="address"
                  label={LABELS.address}
                  required
                  helper="House or shop number, street, area and pin code."
                  error={errors.address}
                >
                  {(props) => (
                    <Textarea
                      {...props}
                      name="address"
                      autoComplete="street-address"
                      rows={3}
                      placeholder="B-12, Gali No. 6, Mohan Garden, New Delhi 110059"
                      invalid={!!errors.address}
                    />
                  )}
                </Field>

                <Field id="landmark" label={`${LABELS.landmark} (optional)`} error={errors.landmark}>
                  {(props) => (
                    <Input {...props} name="landmark" placeholder="Opposite the Kotak ATM" />
                  )}
                </Field>
              </>
            )}

            <Field id="payment" label={LABELS.payment} required error={errors.payment}>
              {(props) => (
                <Select {...props} name="payment" defaultValue="upi" invalid={!!errors.payment}>
                  {/* Only offered when Stripe is configured for this deployment,
                      so the option can never lead to a dead end. */}
                  {ONLINE_PAYMENT_ENABLED && (
                    <option value="stripe">Pay online now — card, UPI or wallet</option>
                  )}
                  <option value="upi">UPI — GPay, PhonePe or Paytm</option>
                  <option value="card">Card at the door</option>
                  <option value="cash">Cash</option>
                </Select>
              )}
            </Field>

            <Field
              id="notes"
              label={`${LABELS.notes} (optional)`}
              helper="Spice level, Jain preparation, no cutlery, doorbell not working — anything."
              error={errors.notes}
            >
              {(props) => (
                <Textarea
                  {...props}
                  name="notes"
                  maxLength={400}
                  rows={3}
                  placeholder="Make the chilli paneer mild, please. No cutlery needed."
                  invalid={!!errors.notes}
                />
              )}
            </Field>
          </div>

          <div className="mt-6 rounded-xl border border-gold-400/30 bg-muted/60 p-4">
            <p className="flex items-start gap-2.5 text-sm text-muted-foreground">
              <Clock className="mt-0.5 size-4 shrink-0 text-gold-600 dark:text-gold-300" aria-hidden="true" />
              <span>
                <span className="font-semibold text-foreground">
                  {mode === 'delivery' ? site.promise.delivery : 'Ready for collection in 20–25 minutes'}.
                </span>{' '}
                We call if anything on your order is unavailable.
              </span>
            </p>
          </div>

          <Button
            type="submit"
            variant="gold"
            size="lg"
            className="mt-6 w-full"
            loading={submitting}
            loadingText="Placing your order…"
            disabled={lines.length === 0}
          >
            <ShoppingBag aria-hidden="true" />
            {lines.length === 0 ? 'Add dishes to continue' : `Place order · ${formatPrice(total)}`}
          </Button>

          <p className="mt-3 text-center text-xs text-muted-foreground">
            You will not be charged online — pay on delivery or collection.
          </p>
        </form>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Place this order?"
        description={`${count} ${count === 1 ? 'item' : 'items'} · ${formatPrice(total)} · ${mode === 'delivery' ? 'delivered to your address' : 'for collection'}. We will call to confirm.`}
        confirmLabel="Yes, place it"
        cancelLabel="Let me check"
        onConfirm={send}
      />

      <ConfirmDialog
        open={clearOpen}
        onOpenChange={setClearOpen}
        title="Clear your whole order?"
        description={`This removes all ${count} ${count === 1 ? 'item' : 'items'}. It cannot be undone.`}
        confirmLabel="Yes, clear it"
        cancelLabel="Keep my order"
        destructive
        onConfirm={() => {
          clear()
          track('cart_cleared')
        }}
      />
    </>
  )
}
