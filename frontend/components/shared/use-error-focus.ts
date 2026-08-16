'use client'

import * as React from 'react'

/**
 * Moves focus to the error summary after a failed submit.
 *
 * This has to run in an effect rather than straight after `setErrors`: the
 * summary does not exist in the DOM until React commits the re-render, so
 * focusing inside the submit handler (even via requestAnimationFrame) lands on
 * nothing and leaves focus on <body>. Keying the effect on a counter rather
 * than the errors object means a second failed submit with the *same* errors
 * still re-announces.
 */
export function useErrorFocus<T extends HTMLElement>() {
  const ref = React.useRef<T>(null)
  const [attempt, setAttempt] = React.useState(0)

  React.useEffect(() => {
    if (attempt === 0) return
    ref.current?.focus()
  }, [attempt])

  const focusSummary = React.useCallback(() => setAttempt((n) => n + 1), [])

  return { ref, focusSummary }
}

/** Today in the browser's timezone, as YYYY-MM-DD. */
export function todayISO(): string {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
}

/**
 * Resolves "today" on the client only.
 *
 * Computing it at module scope bakes the *build* date into the static HTML, so
 * a statically rendered booking form starts with a date in the past the day
 * after deploy. Returns an empty string on the server and during the first
 * client render, so hydration matches.
 */
export function useToday(): string {
  const [today, setToday] = React.useState('')
  React.useEffect(() => setToday(todayISO()), [])
  return today
}
