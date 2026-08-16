'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { CalendarCheck, Clock, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Field, Input, Select, Textarea } from '@/components/ui/field'
import { ConfirmDialog } from '@/components/ui/dialog'
import { ErrorSummary } from '@/components/shared/form-parts'
import { useErrorFocus, useToday } from '@/components/shared/use-error-focus'
import { reservationSchema, fieldErrors } from '@/lib/validation'
import { submitForm } from '@/lib/submit'
import { track } from '@/lib/analytics'
import { site } from '@/lib/site'

const LABELS: Record<string, string> = {
  name: 'Your name',
  phone: 'Phone number',
  email: 'Email',
  date: 'Date',
  time: 'Time',
  guests: 'Number of guests',
  occasion: 'Occasion',
  notes: 'Anything we should know',
}

/** Seating runs 11:00–22:30 in half-hour slots. */
const TIME_SLOTS = Array.from({ length: 24 }, (_, i) => {
  const minutes = 11 * 60 + i * 30
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  const value = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
  const suffix = h >= 12 ? 'PM' : 'AM'
  const display = `${h % 12 === 0 ? 12 : h % 12}:${String(m).padStart(2, '0')} ${suffix}`
  return { value, display }
})

export function ReservationForm() {
  const router = useRouter()
  // Resolved on the client: computing it at module scope bakes the *build* date
  // into the prerendered HTML, so the day after a deploy the form would open
  // pre-filled with a date its own validator rejects as being in the past.
  const today = useToday()
  const [date, setDate] = React.useState('')
  const [errors, setErrors] = React.useState<Record<string, string>>({})

  React.useEffect(() => {
    // Default to today once known, without stamping over a date the guest
    // has already picked.
    setDate((current) => current || today)
  }, [today])
  const [submitting, setSubmitting] = React.useState(false)
  const [confirmOpen, setConfirmOpen] = React.useState(false)
  const [pending, setPending] = React.useState<Record<string, unknown> | null>(null)
  const { ref: summaryRef, focusSummary } = useErrorFocus<HTMLDivElement>()
  const formRef = React.useRef<HTMLFormElement>(null)

  function validate(): Record<string, unknown> | null {
    const data = Object.fromEntries(new FormData(formRef.current!))
    const parsed = reservationSchema.safeParse(data)

    if (!parsed.success) {
      const next = fieldErrors(parsed.error)
      setErrors(next)
      // Focus the summary, not the first field — the count matters first.
      focusSummary()
      track('form_error', { form: 'reservation', error_count: Object.keys(next).length })
      return null
    }

    setErrors({})
    return parsed.data
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = validate()
    if (!data) return
    // Feature 37 — confirm before we hold a table in someone's name.
    setPending(data)
    setConfirmOpen(true)
  }

  async function send() {
    if (!pending) return
    setSubmitting(true)
    const result = await submitForm('reservations', pending)
    setSubmitting(false)

    if (!result.ok) {
      setErrors({ form: result.error })
      focusSummary()
      return
    }

    track('reservation_submit', { guests: pending.guests, date: pending.date })
    // Feature 4 — hand off to the dedicated thank-you page.
    const params = new URLSearchParams({
      type: 'reservation',
      ref: result.reference,
      name: String(pending.name ?? ''),
      date: String(pending.date ?? ''),
      time: String(pending.time ?? ''),
      guests: String(pending.guests ?? ''),
    })
    router.push(`/thank-you?${params.toString()}`)
  }

  const summary = pending
    ? `${pending.guests} ${Number(pending.guests) === 1 ? 'guest' : 'guests'} on ${pending.date} at ${pending.time}, under ${pending.name}.`
    : ''

  return (
    <>
      <form ref={formRef} onSubmit={onSubmit} noValidate className="space-y-5">
        <ErrorSummary ref={summaryRef} errors={errors} labels={{ ...LABELS, form: 'Submission' }} />

        <div className="grid gap-5 sm:grid-cols-2">
          <Field id="name" label={LABELS.name} required error={errors.name}>
            {(props) => (
              <Input
                {...props}
                name="name"
                autoComplete="name"
                placeholder="Aarti Malhotra"
                invalid={!!errors.name}
              />
            )}
          </Field>

          <Field
            id="phone"
            label={LABELS.phone}
            required
            helper="We call this number to confirm."
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
        </div>

        <Field
          id="email"
          label={`${LABELS.email} (optional)`}
          helper="For a written confirmation."
          error={errors.email}
        >
          {(props) => (
            <Input
              {...props}
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              invalid={!!errors.email}
            />
          )}
        </Field>

        <div className="grid gap-5 sm:grid-cols-3">
          <Field id="date" label={LABELS.date} required error={errors.date}>
            {(props) => (
              <Input
                {...props}
                name="date"
                type="date"
                min={today || undefined}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                invalid={!!errors.date}
              />
            )}
          </Field>

          <Field id="time" label={LABELS.time} required error={errors.time}>
            {(props) => (
              <Select {...props} name="time" defaultValue="19:30" invalid={!!errors.time}>
                {TIME_SLOTS.map((slot) => (
                  <option key={slot.value} value={slot.value}>
                    {slot.display}
                  </option>
                ))}
              </Select>
            )}
          </Field>

          <Field id="guests" label={LABELS.guests} required error={errors.guests}>
            {(props) => (
              <Select {...props} name="guests" defaultValue="2" invalid={!!errors.guests}>
                {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>
                    {n} {n === 1 ? 'guest' : 'guests'}
                  </option>
                ))}
              </Select>
            )}
          </Field>
        </div>

        <Field id="occasion" label={`${LABELS.occasion} (optional)`} error={errors.occasion}>
          {(props) => (
            <Select {...props} name="occasion" defaultValue="">
              <option value="">Just dinner</option>
              <option value="birthday">Birthday</option>
              <option value="anniversary">Anniversary</option>
              <option value="family">Family gathering</option>
              <option value="business">Business meal</option>
              <option value="other">Something else</option>
            </Select>
          )}
        </Field>

        <Field
          id="notes"
          label={`${LABELS.notes} (optional)`}
          helper="Jain or no-onion-no-garlic, a high chair, a wheelchair-accessible table, an allergy — tell us here."
          error={errors.notes}
        >
          {(props) => (
            <Textarea
              {...props}
              name="notes"
              maxLength={500}
              placeholder="Two Jain meals, and one guest uses a wheelchair."
              invalid={!!errors.notes}
            />
          )}
        </Field>

        <div className="rounded-xl border border-gold-400/30 bg-muted/60 p-4">
          <p className="flex items-start gap-2.5 text-sm text-muted-foreground">
            <Clock className="mt-0.5 size-4 shrink-0 text-gold-600 dark:text-gold-300" aria-hidden="true" />
            <span>
              <span className="font-semibold text-foreground">{site.promise.reservation}.</span>{' '}
              We hold booked tables for 15 minutes past the reservation time — one call
              keeps it longer.
            </span>
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button type="submit" variant="gold" size="lg" loading={submitting} loadingText="Sending…">
            <CalendarCheck aria-hidden="true" />
            Request this table
          </Button>
          <Button asChild variant="outline" size="lg">
            <a href={`tel:${site.phone}`} onClick={() => track('call_click', { location: 'reserve_form' })}>
              <Phone aria-hidden="true" />
              Book by phone instead
            </a>
          </Button>
        </div>
      </form>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Confirm this booking?"
        description={`${summary} We will call to confirm within 15 minutes during service hours.`}
        confirmLabel="Yes, request it"
        cancelLabel="Let me check"
        onConfirm={send}
      />
    </>
  )
}
