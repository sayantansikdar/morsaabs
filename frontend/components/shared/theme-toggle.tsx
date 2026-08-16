'use client'

import * as React from 'react'
import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Feature 21 — dark mode with persistent state.
 *
 * next-themes writes the choice to localStorage and re-applies it before paint
 * via the inline script in <head>, so there is no flash on reload. Until the
 * provider has mounted we render a same-sized inert placeholder, which keeps
 * the header from shifting.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])

  const isDark = resolvedTheme === 'dark'

  if (!mounted) {
    return <div className={cn('size-11 shrink-0', className)} aria-hidden="true" />
  }

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-pressed={isDark}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      className={cn(
        'relative grid size-11 shrink-0 cursor-pointer place-items-center rounded-full border border-gold-400/40 text-gold-600 transition-colors hover:bg-gold-400/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring dark:text-gold-300',
        className
      )}
    >
      <Sun
        className={cn(
          'absolute size-5 transition-all duration-300',
          isDark ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'
        )}
        aria-hidden="true"
      />
      <Moon
        className={cn(
          'absolute size-5 transition-all duration-300',
          isDark ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'
        )}
        aria-hidden="true"
      />
    </button>
  )
}
