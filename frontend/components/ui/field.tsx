'use client'

import * as React from 'react'
import * as LabelPrimitive from '@radix-ui/react-label'
import { AlertCircle, Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils'

/* ------------------------------------------------------------------ Label */

export const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & { required?: boolean }
>(({ className, children, required, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn('mb-1.5 block text-sm font-semibold text-foreground', className)}
    {...props}
  >
    {children}
    {required && (
      <>
        {' '}
        <span className="text-maroon-600 dark:text-maroon-300" aria-hidden="true">
          *
        </span>
        <span className="sr-only">(required)</span>
      </>
    )}
  </LabelPrimitive.Root>
))
Label.displayName = 'Label'

/* ------------------------------------------------------------------ Input */

const controlBase =
  'w-full rounded-xl border bg-card px-4 py-3 text-base text-foreground placeholder:text-muted-foreground/70 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 focus:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 read-only:bg-muted/60'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, invalid, ...props }, ref) => (
    <input
      ref={ref}
      aria-invalid={invalid || undefined}
      className={cn(
        controlBase,
        'min-h-11',
        invalid ? 'border-maroon-600 bg-maroon-50/60 dark:bg-maroon-950/40' : 'border-input',
        className
      )}
      {...props}
    />
  )
)
Input.displayName = 'Input'

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & { invalid?: boolean }
>(({ className, invalid, ...props }, ref) => (
  <textarea
    ref={ref}
    aria-invalid={invalid || undefined}
    className={cn(
      controlBase,
      'min-h-28 resize-y',
      invalid ? 'border-maroon-600 bg-maroon-50/60 dark:bg-maroon-950/40' : 'border-input',
      className
    )}
    {...props}
  />
))
Textarea.displayName = 'Textarea'

export const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement> & { invalid?: boolean }
>(({ className, invalid, children, ...props }, ref) => (
  <select
    ref={ref}
    aria-invalid={invalid || undefined}
    className={cn(
      controlBase,
      'min-h-11 appearance-none bg-[length:1rem] bg-[right_1rem_center] bg-no-repeat pr-10',
      "bg-[url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23A07C22' stroke-width='2.5' stroke-linecap='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")]",
      invalid ? 'border-maroon-600' : 'border-input',
      className
    )}
    {...props}
  >
    {children}
  </select>
))
Select.displayName = 'Select'

/* ------------------------------------------- Password with reveal toggle -- */

/** Feature 33 — password visibility toggle for the account area. */
export const PasswordInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, invalid, ...props }, ref) => {
    const [visible, setVisible] = React.useState(false)
    return (
      <div className="relative">
        <Input
          ref={ref}
          type={visible ? 'text' : 'password'}
          invalid={invalid}
          className={cn('pr-12', className)}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          // aria-pressed exposes the toggle's state; the label says what it does.
          aria-pressed={visible}
          aria-label={visible ? 'Hide password' : 'Show password'}
          className="absolute right-1 top-1/2 flex size-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {visible ? (
            <EyeOff className="size-5" aria-hidden="true" />
          ) : (
            <Eye className="size-5" aria-hidden="true" />
          )}
        </button>
      </div>
    )
  }
)
PasswordInput.displayName = 'PasswordInput'

/* ------------------------------------------------- Helper & error text --- */

export function HelperText({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <p id={id} className="mt-1.5 text-sm text-muted-foreground">
      {children}
    </p>
  )
}

/**
 * Feature 36 + 46 — the inline error. role="alert" so a screen reader hears it
 * the moment it appears, and an icon so the message is not colour-only.
 */
export function FieldError({ id, children }: { id: string; children?: React.ReactNode }) {
  if (!children) return null
  return (
    <p
      id={id}
      role="alert"
      className="mt-1.5 flex items-start gap-1.5 text-sm font-medium text-maroon-700 dark:text-maroon-300"
    >
      <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <span>{children}</span>
    </p>
  )
}

/** Wires label / control / helper / error together with the right aria plumbing. */
export function Field({
  id,
  label,
  required,
  helper,
  error,
  children,
  className,
}: {
  id: string
  label: string
  required?: boolean
  helper?: string
  error?: string
  children: (props: {
    id: string
    'aria-describedby': string | undefined
    'aria-invalid': true | undefined
  }) => React.ReactNode
  className?: string
}) {
  const helperId = helper ? `${id}-helper` : undefined
  const errorId = error ? `${id}-error` : undefined
  const describedBy = [errorId, helperId].filter(Boolean).join(' ') || undefined

  return (
    <div className={className}>
      <Label htmlFor={id} required={required}>
        {label}
      </Label>
      {children({ id, 'aria-describedby': describedBy, 'aria-invalid': error ? true : undefined })}
      <FieldError id={`${id}-error`}>{error}</FieldError>
      {helper && !error && <HelperText id={`${id}-helper`}>{helper}</HelperText>}
    </div>
  )
}
