import { ClerkProvider } from '@clerk/nextjs'
import type { Metadata, Viewport } from 'next'
import { Playfair_Display, Manrope, Great_Vibes } from 'next/font/google'
import './globals.css'

import { Providers } from '@/components/providers'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { SiteChrome } from '@/components/layout/site-chrome'
import { ScrollProgress } from '@/components/shared/scroll-progress'
import { CookieBanner } from '@/components/shared/cookie-banner'
import { Analytics } from '@/components/shared/analytics'
import { DatadogRum } from '@/components/shared/datadog-rum'
import { JsonLd } from '@/components/shared/json-ld'
import { ArchClipDefs } from '@/components/ui/royal'
import {
  BackToTop,
  FloatingContact,
  SkipLink,
  StickyMobileCTA,
} from '@/components/shared/floating-actions'
import { restaurantSchema, websiteSchema } from '@/lib/schema'
import { SITE_URL, SITE_ORIGIN, site, BASE_PATH } from '@/lib/site'

/* next/font self-hosts and preloads these, so there is no render-blocking
   request to Google and no flash of invisible text. */
const display = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
  weight: ['400', '500', '600', '700', '800'],
})

const body = Manrope({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
  weight: ['300', '400', '500', '600', '700'],
})

const script = Great_Vibes({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-script',
  weight: '400',
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  title: {
    default: "Morsaab's — Royal Vegetarian Restaurant near Dwarka Mor, New Delhi",
    template: "%s | Morsaab's",
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.legalName }],
  creator: site.legalName,
  publisher: site.legalName,
  category: 'restaurant',
  keywords: [
    'restaurant near Dwarka Mor',
    'pure veg restaurant Uttam Nagar',
    'North Indian restaurant New Delhi',
    'Indo-Chinese Uttam Nagar',
    'best thali Dwarka Mor',
    'vegetarian restaurant Mohan Garden',
    'catering services Uttam Nagar',
    'banquet hall Dwarka Mor',
    'food delivery Uttam Nagar 110059',
    "Morsaab's",
  ],
  alternates: { canonical: SITE_URL },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: SITE_URL,
    siteName: site.name,
    title: "Morsaab's — A Royal Taste of India",
    description: site.description,
  },
  twitter: { card: 'summary_large_image', site: '@morsaabs', creator: '@morsaabs' },
  // Feature 48 — Search Console verification.
  verification: { google: site.googleSiteVerification },
  formatDetection: { telephone: true, address: true },
  manifest: `${BASE_PATH}/manifest.webmanifest`,
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  // Zoom is never disabled — maximumScale and userScalable are left at defaults.
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FDF8EE' },
    { media: '(prefers-color-scheme: dark)', color: '#14090A' },
  ],
  colorScheme: 'light dark',
}

/**
 * ClerkProvider needs a publishable key and throws without one.
 *
 * The public site is still built as a static export in CI, where no Clerk keys
 * exist and nothing on the exported pages uses authentication — so the provider
 * is only mounted when a key is present. On Vercel it is always present and the
 * dashboard gets its session; on GitHub Pages the tree renders unwrapped.
 */
function WithClerk({ children }: { children: React.ReactNode }) {
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) return <>{children}</>
  return <ClerkProvider>{children}</ClerkProvider>
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en-IN"
      suppressHydrationWarning
      className={`${display.variable} ${body.variable} ${script.variable}`}
    >
      <head>
        {/* Both image hosts are contacted on nearly every page — warm them early.
            Blob serves the dish photography (33 images on the menu alone); the
            stock host still serves the gallery, about and reserve pages. */}
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://euzy3uln8hrj0lj1.public.blob.vercel-storage.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />

        {/*
          Scroll-reveal safety net. The section reveals render their initial
          state as an inline `opacity:0` in the server HTML and rely on JS to
          animate it away — so without JS the whole page body would be blank.
          This only applies when scripting is off, and forces those elements to
          their final state. The hero does not need it: its entrance is pure CSS.
        */}
        <noscript>
          <style>{`[style*="opacity:0"],[style*="opacity: 0"]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body className="min-h-dvh bg-background">
        <WithClerk>
          <JsonLd data={restaurantSchema()} />
          <JsonLd data={websiteSchema()} />

          <Providers>
            <ArchClipDefs />

            {/* The dashboard opts out of all of this — see SiteChrome. */}
            <SiteChrome
              header={
                <>
                  <SkipLink />
                  <ScrollProgress />

                  {/* Focus target for "back to top". */}
                  <span id="top" tabIndex={-1} className="sr-only">
                    Top of page
                  </span>

                  <Header />
                </>
              }
              footer={<Footer />}
              floating={
                <>
                  {/* Bottom-bar clearance so the last of the footer is never trapped
                      under the sticky mobile CTA. */}
                  <div aria-hidden="true" className="h-20 md:hidden" data-print="hide" />

                  <StickyMobileCTA />
                  <BackToTop />
                  <FloatingContact />
                  <CookieBanner />
                </>
              }
            >
              {children}
            </SiteChrome>
          </Providers>

          <Analytics measurementId={site.gaMeasurementId} />
          <DatadogRum />
        </WithClerk>
      </body>
    </html>
  )
}