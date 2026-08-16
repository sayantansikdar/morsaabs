import Link from 'next/link'
import { Home, UtensilsCrossed, Phone, Search, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { primaryNav } from '@/lib/nav'
import { site } from '@/lib/site'

export const metadata = {
  title: 'Page Not Found',
  robots: { index: false, follow: true },
}

/**
 * Feature 1 — the royal 404.
 *
 * A dead end is where people leave, so this one carries the full primary
 * navigation, the three actions that matter, and a phone number.
 */
export default function NotFound() {
  return (
    <section className="relative flex min-h-[calc(100svh-var(--header-h))] items-center overflow-hidden bg-maroon-950 py-20">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-durbar" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-jaali text-gold-300" />

      {/* An empty arch — the door that leads nowhere. */}
      <svg
        aria-hidden="true"
        viewBox="0 0 300 400"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[34rem] -translate-x-1/2 -translate-y-1/2 text-gold-400/12"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
      >
        <path d="M20,400 L20,180 C20,90 75,25 150,5 C225,25 280,90 280,180 L280,400" />
        <path d="M55,400 L55,190 C55,115 100,62 150,45 C200,62 245,115 245,190 L245,400" opacity="0.6" />
        <path d="M92,400 L92,200 C92,145 122,105 150,92 C178,105 208,145 208,200 L208,400" opacity="0.35" />
      </svg>

      <div className="container-royal relative text-center">
        <p className="font-script text-5xl text-gold-300 sm:text-6xl">404</p>

        <h1 className="mt-4 text-display-lg font-bold text-sand-50 text-shadow-royal">
          This door leads nowhere
        </h1>

        <p className="measure mx-auto mt-5 text-base leading-relaxed text-sand-200/90 sm:text-lg">
          The page you were looking for has moved, been renamed, or never existed. The
          kitchen, however, is exactly where it has always been.
        </p>

        <div className="mt-9 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
          <Button asChild variant="gold" size="xl">
            <Link href="/">
              <Home aria-hidden="true" />
              Back to the entrance
            </Link>
          </Button>
          <Button asChild variant="royal" size="xl">
            <Link href="/menu">
              <UtensilsCrossed aria-hidden="true" />
              See the menu
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="xl"
            className="border-sand-50/50 text-sand-50 hover:border-gold-400 hover:bg-white/10"
          >
            <a href={`tel:${site.phone}`}>
              <Phone aria-hidden="true" />
              Call us
            </a>
          </Button>
        </div>

        {/* Feature 1 — navigation recovery: every top-level route, right here. */}
        <nav aria-label="All pages" className="mx-auto mt-14 max-w-2xl">
          <p className="mb-4 flex items-center justify-center gap-2 text-sm text-sand-300">
            <Search className="size-4 text-gold-400" aria-hidden="true" />
            Or pick up where you meant to go:
          </p>
          <ul className="flex flex-wrap justify-center gap-2">
            {[...primaryNav, { href: '/reserve', label: 'Book a Table' }, { href: '/order', label: 'Order Online' }].map(
              (item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-gold-400/35 px-4 text-sm font-medium text-sand-100 transition-colors hover:border-gold-400 hover:bg-gold-400 hover:text-maroon-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400"
                  >
                    {item.label}
                    <ArrowRight className="size-3.5" aria-hidden="true" />
                  </Link>
                </li>
              )
            )}
          </ul>
        </nav>
      </div>
    </section>
  )
}
