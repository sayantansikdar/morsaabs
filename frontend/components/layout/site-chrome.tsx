'use client'

import { usePathname } from 'next/navigation'

/**
 * Public-site chrome — header, footer, and the floating furniture.
 *
 * The dashboard lives under the same root layout (Next allows one root layout
 * per app unless every route moves into a group), but it must not inherit the
 * customer-facing chrome: a cookie banner, a "Book Table" sticky bar and a
 * floating call button on top of an orders table is noise at best and covers
 * controls at worst.
 *
 * The chrome is passed in as rendered children rather than imported here, so
 * the server components stay server components — this file only decides whether
 * to place them.
 */
/** Routes that render standalone, without the customer-facing chrome. */
const BARE_ROUTES = ['/admin', '/sign-in', '/sign-up']

export function SiteChrome({
  header,
  footer,
  floating,
  children,
}: {
  header: React.ReactNode
  footer: React.ReactNode
  floating: React.ReactNode
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isBare = BARE_ROUTES.some((route) => pathname?.startsWith(route))

  // Sign-in and sign-up centre themselves in the viewport; with the site header
  // above them the form is pushed below the fold and looks like a blank page.
  if (isBare) return <>{children}</>

  return (
    <>
      {header}
      <main id="main" tabIndex={-1} className="pt-[var(--header-h)] focus:outline-none">
        {children}
      </main>
      {footer}
      {floating}
    </>
  )
}
