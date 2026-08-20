'use client'

import * as React from 'react'
import {
  setOrderStatusAction,
  setReservationStatusAction,
  setMessageStatusAction,
} from '../actions'

/**
 * Status control shared by orders, reservations and the message inbox.
 *
 * Changing a status is a single deliberate choice, so it saves immediately on
 * change rather than needing a second Save click — unlike prices, a status is
 * trivially reversible if picked wrongly.
 */

const OPTIONS = {
  order: [
    ['pending', 'Pending'],
    ['confirmed', 'Confirmed'],
    ['preparing', 'Preparing'],
    ['out_for_delivery', 'Out for delivery'],
    ['completed', 'Completed'],
    ['cancelled', 'Cancelled'],
  ],
  reservation: [
    ['pending', 'Pending'],
    ['confirmed', 'Confirmed'],
    ['seated', 'Seated'],
    ['completed', 'Completed'],
    ['no_show', 'No show'],
    ['cancelled', 'Cancelled'],
  ],
  message: [
    ['new', 'New'],
    ['read', 'Read'],
    ['replied', 'Replied'],
    ['archived', 'Archived'],
  ],
} as const

export type StatusKind = keyof typeof OPTIONS

export function StatusSelect({
  kind,
  id,
  value,
  label,
}: {
  kind: StatusKind
  id: number
  value: string
  label: string
}) {
  const [current, setCurrent] = React.useState(value)
  const [pending, startTransition] = React.useTransition()
  const [failed, setFailed] = React.useState(false)

  function change(next: string) {
    const previous = current
    setCurrent(next) // optimistic
    setFailed(false)

    startTransition(async () => {
      const result =
        kind === 'order'
          ? await setOrderStatusAction(id, next as 'pending')
          : kind === 'reservation'
            ? await setReservationStatusAction(id, next as 'pending')
            : await setMessageStatusAction(id, next as 'new')

      if (!result.ok) {
        setCurrent(previous) // roll back so the UI never lies about saved state
        setFailed(true)
      }
    })
  }

  return (
    <span className="inline-flex items-center gap-2">
      <select
        value={current}
        disabled={pending}
        aria-label={label}
        onChange={(event) => change(event.target.value)}
        className="rounded-md border border-border bg-background px-2 py-1.5 text-sm disabled:opacity-50"
      >
        {OPTIONS[kind].map(([option, optionLabel]) => (
          <option key={option} value={option}>
            {optionLabel}
          </option>
        ))}
      </select>
      {failed && (
        <span role="alert" className="text-xs text-red-700">
          Not saved
        </span>
      )}
    </span>
  )
}
