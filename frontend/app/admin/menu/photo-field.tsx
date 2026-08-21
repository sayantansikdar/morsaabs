'use client'

import * as React from 'react'
import Image from 'next/image'
import { upload } from '@vercel/blob/client'

/**
 * Dish photograph: upload a file, or paste a URL.
 *
 * The file goes straight from the browser to Vercel Blob — see the upload route
 * for why it does not travel through a serverless function. What comes back is
 * a URL, which is stored on the dish exactly like a pasted one, so both routes
 * converge on the same field and the same save.
 *
 * The URL box stays because it is genuinely useful: a photo already hosted
 * elsewhere needs no upload, and it keeps the dashboard usable on a deployment
 * with no Blob store configured.
 */

const MAX_BYTES = 8 * 1024 * 1024
const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp', 'image/avif']

export function PhotoField({
  value,
  onChange,
  dishName,
}: {
  value: string
  onChange: (url: string) => void
  dishName: string
}) {
  const [busy, setBusy] = React.useState(false)
  const [message, setMessage] = React.useState<string | null>(null)
  const inputId = React.useId()

  async function onFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    // Checked here for a fast, clear message; the server enforces the same
    // limits independently, since this check is trivially bypassed.
    if (!ACCEPTED.includes(file.type)) {
      setMessage('That file is not a JPEG, PNG, WebP or AVIF image.')
      return
    }
    if (file.size > MAX_BYTES) {
      setMessage(
        `That photo is ${(file.size / 1024 / 1024).toFixed(1)} MB. The limit is 8 MB — try a smaller export.`
      )
      return
    }

    setBusy(true)
    setMessage(null)
    try {
      const blob = await upload(file.name, file, {
        access: 'public',
        handleUploadUrl: '/api/admin/upload',
      })
      onChange(blob.url)
      setMessage('Uploaded — remember to save the dish.')
    } catch (error) {
      const detail = error instanceof Error ? error.message : ''
      setMessage(
        detail.includes('not configured')
          ? 'Photo uploads are not set up on this deployment yet. Paste an image URL instead.'
          : 'That upload did not go through. Try again, or paste an image URL instead.'
      )
    } finally {
      setBusy(false)
      // Let the same file be chosen again after a failure.
      event.target.value = ''
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-start gap-3">
        {value ? (
          <Image
            src={value}
            alt={`Current photo for ${dishName}`}
            width={64}
            height={64}
            className="size-16 shrink-0 rounded-md object-cover"
            // A pasted URL can point anywhere; next/image only optimises hosts
            // in remotePatterns, so skip the optimiser rather than 400.
            unoptimized
          />
        ) : (
          <div
            aria-hidden="true"
            className="grid size-16 shrink-0 place-items-center rounded-md bg-muted text-xs text-muted-foreground"
          >
            No photo
          </div>
        )}

        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <label
              htmlFor={inputId}
              className="cursor-pointer rounded-md border border-border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-muted"
            >
              {busy ? 'Uploading…' : value ? 'Replace photo' : 'Upload photo'}
            </label>
            <input
              id={inputId}
              type="file"
              accept={ACCEPTED.join(',')}
              disabled={busy}
              onChange={onFile}
              className="sr-only"
            />

            {value && (
              <button
                type="button"
                onClick={() => {
                  onChange('')
                  setMessage(null)
                }}
                className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
              >
                Remove
              </button>
            )}
          </div>

          <input
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder="…or paste an image URL"
            aria-label={`Photo URL for ${dishName}`}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          />
        </div>
      </div>

      {message && (
        <p role="status" className="text-xs text-muted-foreground">
          {message}
        </p>
      )}
    </div>
  )
}
