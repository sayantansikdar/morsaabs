'use client'

import * as React from 'react'
import { ThemeProvider } from 'next-themes'
import { Toaster } from 'sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { CartProvider } from '@/components/cart-provider'
import { captureAttribution } from '@/lib/analytics'

export function Providers({ children }: { children: React.ReactNode }) {
  // First-touch campaign capture, once per tab (feature 34).
  React.useEffect(() => {
    captureAttribution()
  }, [])

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      // next-themes persists the choice to localStorage under this key,
      // so the theme survives reloads and new tabs (feature 21).
      storageKey="morsaabs.theme"
      disableTransitionOnChange
    >
      <TooltipProvider delayDuration={200} skipDelayDuration={400}>
        <CartProvider>
          {children}
          <Toaster
            position="top-center"
            richColors
            closeButton
            // Toasts announce politely and never steal focus.
            toastOptions={{ duration: 4000 }}
          />
        </CartProvider>
      </TooltipProvider>
    </ThemeProvider>
  )
}
