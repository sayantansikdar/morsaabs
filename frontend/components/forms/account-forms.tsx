'use client'

import * as React from 'react'
import Link from 'next/link'
import { LogIn, UserPlus, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Field, Input, PasswordInput } from '@/components/ui/field'
import { ErrorSummary } from '@/components/shared/form-parts'
import { useErrorFocus } from '@/components/shared/use-error-focus'
import { cn } from '@/lib/utils'

/**
 * Sign-in / register shell.
 *
 * ⚠️ There is no authentication backend behind this yet — it validates input
 * and stops. Wire it to a real identity provider before enabling it in
 * production, and never post credentials to the form endpoints in lib/submit.
 */

const LABELS: Record<string, string> = {
  email: 'Email address',
  password: 'Password',
  name: 'Your name',
  confirm: 'Confirm password',
  form: 'Sign in',
}

export function AccountForms() {
  const [tab, setTab] = React.useState<'signin' | 'register'>('signin')

  return (
    <div className="rounded-3xl border border-gold-400/25 bg-card p-6 sm:p-8">
      {/* Tabs */}
      <div role="tablist" aria-label="Account" className="grid grid-cols-2 gap-2 rounded-full bg-muted p-1.5">
        {(
          [
            { id: 'signin', label: 'Sign in' },
            { id: 'register', label: 'Create account' },
          ] as const
        ).map((t) => (
          <button
            key={t.id}
            role="tab"
            id={`tab-${t.id}`}
            aria-selected={tab === t.id}
            aria-controls={`panel-${t.id}`}
            onClick={() => setTab(t.id)}
            className={cn(
              'min-h-11 cursor-pointer rounded-full text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              tab === t.id
                ? 'bg-maroon-700 text-sand-50 shadow-royal'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {tab === 'signin' ? <SignInForm /> : <RegisterForm />}
      </div>

      <p className="mt-8 flex items-start gap-2.5 rounded-xl border border-dashed border-gold-400/40 bg-muted/50 p-4 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0 text-gold-600 dark:text-gold-300" aria-hidden="true" />
        <span>
          Accounts are not live yet — this form validates but does not sign you in. You
          can still{' '}
          <Link href="/order" className="font-medium underline underline-offset-4">
            order
          </Link>{' '}
          and{' '}
          <Link href="/reserve" className="font-medium underline underline-offset-4">
            book a table
          </Link>{' '}
          as a guest.
        </span>
      </p>
    </div>
  )
}

function SignInForm() {
  const [errors, setErrors] = React.useState<Record<string, string>>({})
  const { ref: summaryRef, focusSummary } = useErrorFocus<HTMLDivElement>()
  const formRef = React.useRef<HTMLFormElement>(null)

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = Object.fromEntries(new FormData(formRef.current!)) as Record<string, string>
    const next: Record<string, string> = {}

    if (!data.email?.includes('@')) {
      next.email = 'Enter the email address you signed up with — it needs an @ and a domain.'
    }
    if (!data.password || data.password.length < 8) {
      next.password = 'Your password is at least 8 characters. Check for a stray space at the end.'
    }

    setErrors(next)
    if (Object.keys(next).length > 0) {
      focusSummary()
      return
    }
    setErrors({ form: 'Accounts are not live yet — please order or book as a guest.' })
    focusSummary()
  }

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      noValidate
      role="tabpanel"
      id="panel-signin"
      aria-labelledby="tab-signin"
      className="space-y-5"
    >
      <ErrorSummary ref={summaryRef} errors={errors} labels={LABELS} />

      <Field id="email" label={LABELS.email} required error={errors.email}>
        {(props) => (
          <Input
            {...props}
            name="email"
            type="email"
            // Password managers need these to offer to fill.
            autoComplete="username"
            placeholder="you@example.com"
            invalid={!!errors.email}
          />
        )}
      </Field>

      <Field id="password" label={LABELS.password} required error={errors.password}>
        {(props) => (
          <PasswordInput
            {...props}
            name="password"
            autoComplete="current-password"
            placeholder="Your password"
            invalid={!!errors.password}
          />
        )}
      </Field>

      <div className="flex items-center justify-between gap-4">
        <label className="flex cursor-pointer items-center gap-2.5 text-sm text-muted-foreground">
          <input
            type="checkbox"
            name="remember"
            className="size-4 cursor-pointer rounded border-input accent-maroon-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          Keep me signed in
        </label>
        <Link
          href="/contact?service=general"
          className="rounded text-sm font-medium text-maroon-700 underline underline-offset-4 hover:text-maroon-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring dark:text-gold-300"
        >
          Forgot password?
        </Link>
      </div>

      <Button type="submit" variant="gold" size="lg" className="w-full">
        <LogIn aria-hidden="true" />
        Sign in
      </Button>
    </form>
  )
}

function RegisterForm() {
  const [errors, setErrors] = React.useState<Record<string, string>>({})
  const [password, setPassword] = React.useState('')
  const { ref: summaryRef, focusSummary } = useErrorFocus<HTMLDivElement>()
  const formRef = React.useRef<HTMLFormElement>(null)

  const strength = scorePassword(password)

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = Object.fromEntries(new FormData(formRef.current!)) as Record<string, string>
    const next: Record<string, string> = {}

    if (!data.name || data.name.trim().length < 2) {
      next.name = 'Enter your name — at least two characters.'
    }
    if (!data.email?.includes('@')) {
      next.email = 'Enter a valid email address with an @ and a domain.'
    }
    if (!data.password || data.password.length < 8) {
      next.password = 'Choose a password of at least 8 characters. Longer is better than complicated.'
    }
    if (data.password !== data.confirm) {
      next.confirm = 'The two passwords do not match. Reveal them with the eye icon to compare.'
    }

    setErrors(next)
    if (Object.keys(next).length > 0) {
      focusSummary()
      return
    }
    setErrors({ form: 'Accounts are not live yet — please order or book as a guest.' })
    focusSummary()
  }

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      noValidate
      role="tabpanel"
      id="panel-register"
      aria-labelledby="tab-register"
      className="space-y-5"
    >
      <ErrorSummary ref={summaryRef} errors={errors} labels={LABELS} />

      <Field id="reg-name" label={LABELS.name} required error={errors.name}>
        {(props) => (
          <Input {...props} name="name" autoComplete="name" placeholder="Your name" invalid={!!errors.name} />
        )}
      </Field>

      <Field id="reg-email" label={LABELS.email} required error={errors.email}>
        {(props) => (
          <Input
            {...props}
            name="email"
            type="email"
            autoComplete="username"
            placeholder="you@example.com"
            invalid={!!errors.email}
          />
        )}
      </Field>

      <Field
        id="reg-password"
        label={LABELS.password}
        required
        helper="At least 8 characters. A short phrase beats a scrambled word."
        error={errors.password}
      >
        {(props) => (
          <PasswordInput
            {...props}
            name="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            invalid={!!errors.password}
          />
        )}
      </Field>

      {password.length > 0 && (
        <div>
          <div className="flex gap-1.5" aria-hidden="true">
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className={cn(
                  'h-1.5 flex-1 rounded-full transition-colors',
                  i < strength.score ? strength.colour : 'bg-muted'
                )}
              />
            ))}
          </div>
          <p aria-live="polite" className="mt-1.5 text-sm text-muted-foreground">
            Password strength: <span className="font-semibold text-foreground">{strength.label}</span>
          </p>
        </div>
      )}

      <Field id="reg-confirm" label={LABELS.confirm} required error={errors.confirm}>
        {(props) => (
          <PasswordInput
            {...props}
            name="confirm"
            autoComplete="new-password"
            invalid={!!errors.confirm}
          />
        )}
      </Field>

      <Button type="submit" variant="gold" size="lg" className="w-full">
        <UserPlus aria-hidden="true" />
        Create account
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        By creating an account you agree to our{' '}
        <Link href="/terms" className="font-medium underline underline-offset-4">
          Terms
        </Link>{' '}
        and{' '}
        <Link href="/privacy" className="font-medium underline underline-offset-4">
          Privacy Policy
        </Link>
        .
      </p>
    </form>
  )
}

/** Length-weighted rather than symbol-weighted — length is what actually helps. */
function scorePassword(value: string): { score: number; label: string; colour: string } {
  let score = 0
  if (value.length >= 8) score++
  if (value.length >= 14) score++
  if (/[^A-Za-z0-9]/.test(value) || /\d/.test(value)) score++
  if (value.length >= 20) score++

  const labels = ['Too short', 'Weak', 'Reasonable', 'Strong', 'Very strong']
  const colours = ['bg-maroon-600', 'bg-maroon-600', 'bg-gold-400', 'bg-royal-500', 'bg-royal-600']
  return { score, label: labels[score], colour: colours[score] }
}
