'use client'

import * as React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Send, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Field, Input, Select, Textarea, FieldError } from '@/components/ui/field'
import { ErrorSummary } from '@/components/shared/form-parts'
import { useErrorFocus } from '@/components/shared/use-error-focus'
import { contactSchema, fieldErrors } from '@/lib/validation'
import { submitForm } from '@/lib/submit'
import { track } from '@/lib/analytics'
import { site } from '@/lib/site'

const LABELS: Record<string, string> = {
  name: 'Your name',
  email: 'Email address',
  phone: 'Phone number',
  subject: 'What this is about',
  message: 'Your message',
  consent: 'Permission to reply',
  form: 'Submission',
}

const SUBJECTS = [
  { value: 'general', label: 'A general question' },
  { value: 'catering', label: 'Catering enquiry' },
  { value: 'banquet', label: 'Banquet hall booking' },
  { value: 'feedback', label: 'Feedback about a visit' },
  { value: 'careers', label: 'Working with us' },
] as const

export function ContactForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  // /contact?service=catering pre-selects the right subject.
  const requested = searchParams.get('service')
  const initialSubject =
    SUBJECTS.find((s) => s.value === requested)?.value ?? 'general'

  const [errors, setErrors] = React.useState<Record<string, string>>({})
  const [submitting, setSubmitting] = React.useState(false)
  const { ref: summaryRef, focusSummary } = useErrorFocus<HTMLDivElement>()
  const formRef = React.useRef<HTMLFormElement>(null)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const raw = Object.fromEntries(new FormData(formRef.current!))
    const parsed = contactSchema.safeParse({ ...raw, consent: raw.consent === 'on' })

    if (!parsed.success) {
      const next = fieldErrors(parsed.error)
      setErrors(next)
      focusSummary()
      track('form_error', { form: 'contact', error_count: Object.keys(next).length })
      return
    }

    setErrors({})
    setSubmitting(true)
    const result = await submitForm('contact', parsed.data)
    setSubmitting(false)

    if (!result.ok) {
      setErrors({ form: result.error })
      focusSummary()
      return
    }

    track('contact_submit', { subject: parsed.data.subject })
    router.push(
      `/thank-you?type=message&ref=${result.reference}&name=${encodeURIComponent(parsed.data.name)}&subject=${parsed.data.subject}`
    )
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="space-y-5">
      <ErrorSummary ref={summaryRef} errors={errors} labels={LABELS} />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="name" label={LABELS.name} required error={errors.name}>
          {(props) => (
            <Input {...props} name="name" autoComplete="name" placeholder="Your name" invalid={!!errors.name} />
          )}
        </Field>

        <Field id="phone" label={LABELS.phone} required error={errors.phone}>
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

      <Field id="email" label={LABELS.email} required error={errors.email}>
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

      <Field id="subject" label={LABELS.subject} required error={errors.subject}>
        {(props) => (
          <Select {...props} name="subject" defaultValue={initialSubject} invalid={!!errors.subject}>
            {SUBJECTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </Select>
        )}
      </Field>

      <Field
        id="message"
        label={LABELS.message}
        required
        helper="For catering or banquet: the date, headcount and any dietary requirements get you a costed reply fastest."
        error={errors.message}
      >
        {(props) => (
          <Textarea
            {...props}
            name="message"
            rows={6}
            maxLength={2000}
            placeholder="Tell us what you need…"
            invalid={!!errors.message}
          />
        )}
      </Field>

      {/* Consent — an unticked box, never pre-ticked. */}
      <div>
        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-input bg-card p-4 transition-colors hover:bg-muted/50">
          <input
            id="consent"
            name="consent"
            type="checkbox"
            aria-invalid={errors.consent ? true : undefined}
            aria-describedby={errors.consent ? 'consent-error' : undefined}
            className="mt-0.5 size-5 shrink-0 cursor-pointer rounded border-input accent-maroon-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <span className="text-sm leading-relaxed text-muted-foreground">
            You may contact me about this enquiry using the details above. We do not add
            anyone to a mailing list from this form.
          </span>
        </label>
        <FieldError id="consent-error">{errors.consent}</FieldError>
      </div>

      <div className="rounded-xl border border-gold-400/30 bg-muted/60 p-4">
        <p className="flex items-start gap-2.5 text-sm text-muted-foreground">
          <Clock className="mt-0.5 size-4 shrink-0 text-gold-600 dark:text-gold-300" aria-hidden="true" />
          <span>
            <span className="font-semibold text-foreground">{site.promise.enquiry}.</span>{' '}
            General questions usually get an answer the same day. Urgent? Call{' '}
            <a href={`tel:${site.phone}`} className="font-semibold underline underline-offset-4">
              {site.phoneDisplay}
            </a>
            .
          </span>
        </p>
      </div>

      <Button type="submit" variant="gold" size="lg" loading={submitting} loadingText="Sending…">
        <Send aria-hidden="true" />
        Send message
      </Button>
    </form>
  )
}
