import Link from 'next/link'
import { Clock, Instagram, Facebook, Twitter, MapPin, Mail, Phone, ShieldCheck } from 'lucide-react'
import { Crest } from '@/components/layout/header'
import { CopyButton } from '@/components/shared/copy-button'
import { footerNav } from '@/lib/nav'
import { site, fullAddress, LAST_UPDATED, formatDate } from '@/lib/site'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer
      data-print="hide"
      className="relative mt-24 overflow-hidden border-t border-gold-400/30 bg-maroon-950 text-sand-200"
    >
      {/* Durbar glow + jaali screen, both purely decorative. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-durbar opacity-70" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-jaali text-gold-400" />

      <div className="container-royal relative py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_2.6fr]">
          {/* Identity + NAP */}
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400"
            >
              <Crest className="size-11 text-gold-400" />
              <span>
                <span className="block font-display text-2xl font-bold text-sand-50">Morsaab’s</span>
                <span className="block font-script text-lg text-gold-300">{site.nameDevanagari}</span>
              </span>
            </Link>

            <p className="measure mt-5 text-sm leading-relaxed text-sand-300">
              A complete destination for vegetarian food lovers — royal North Indian,
              Indo-Chinese and South Indian cooking near Dwarka Mor, New Delhi.
            </p>

            <address className="mt-6 space-y-3 not-italic text-sm">
              <a
                href={site.maps.directions}
                target="_blank"
                rel="noopener noreferrer"
                className="flex gap-3 rounded transition-colors hover:text-gold-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400"
              >
                <MapPin className="mt-0.5 size-4 shrink-0 text-gold-400" aria-hidden="true" />
                <span>{fullAddress}</span>
              </a>

              <div className="flex items-center gap-3">
                <Phone className="size-4 shrink-0 text-gold-400" aria-hidden="true" />
                {/* Feature 45 — tap to call. */}
                <a
                  href={`tel:${site.phone}`}
                  className="tnum rounded font-semibold transition-colors hover:text-gold-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400"
                >
                  {site.phoneDisplay}
                </a>
                <CopyButton
                  value={site.phoneDisplay}
                  label="phone number"
                  className="text-sand-400 hover:bg-white/10 hover:text-sand-100"
                />
              </div>

              <div className="flex items-center gap-3">
                <Mail className="size-4 shrink-0 text-gold-400" aria-hidden="true" />
                {/* Feature 53 — a visible email address. */}
                <a
                  href={`mailto:${site.email}`}
                  className="break-anywhere rounded transition-colors hover:text-gold-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400"
                >
                  {site.email}
                </a>
              </div>

              {/* Feature 47 — opening hours. */}
              <div className="flex items-start gap-3">
                <Clock className="mt-0.5 size-4 shrink-0 text-gold-400" aria-hidden="true" />
                <span>
                  <span className="tnum block font-semibold text-sand-100">{site.hours.display}</span>
                  <span className="block text-sand-400">{site.hours.days}</span>
                </span>
              </div>
            </address>

            {/* Feature 54 — social profiles. */}
            <ul className="mt-6 flex gap-2.5">
              {[
                { href: site.social.instagram, Icon: Instagram, name: 'Instagram' },
                { href: site.social.facebook, Icon: Facebook, name: 'Facebook' },
                { href: site.social.twitter, Icon: Twitter, name: 'Twitter' },
              ].map(({ href, Icon, name }) => (
                <li key={name}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer me"
                    aria-label={`${site.name} on ${name} (opens in a new tab)`}
                    className="grid size-11 place-items-center rounded-full border border-gold-400/35 text-gold-300 transition-colors hover:border-gold-400 hover:bg-gold-400 hover:text-maroon-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400"
                  >
                    <Icon className="size-4.5" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Feature 3 — the internal-link map. */}
          <nav aria-label="Footer" className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {footerNav.map((group) => (
              <div key={group.title}>
                <h2 className="mb-4 font-display text-sm font-bold uppercase tracking-[0.18em] text-gold-300">
                  {group.title}
                </h2>
                <ul className="space-y-2.5">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="inline-block rounded text-sm text-sand-300 transition-colors hover:text-gold-300 hover:underline hover:underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        {/* Feature 59 — payment methods. */}
        <div className="mt-14 rounded-2xl border border-gold-400/25 bg-maroon-900/50 p-5">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <span className="flex items-center gap-2 text-sm font-semibold text-gold-300">
              <ShieldCheck className="size-4" aria-hidden="true" />
              We accept
            </span>
            <ul className="flex flex-wrap gap-2">
              {site.payments.map((method) => (
                <li
                  key={method}
                  className="rounded-full border border-gold-400/25 bg-maroon-950/50 px-3 py-1.5 text-xs text-sand-300"
                >
                  {method}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div aria-hidden="true" className="rule-gilt my-10" />

        <div className="flex flex-col gap-4 text-sm text-sand-400 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.legalName}. All rights reserved.
          </p>
          {/* Feature 38 — last updated. */}
          <p className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span>
              Last updated{' '}
              <time dateTime={LAST_UPDATED} className="font-medium text-sand-200">
                {formatDate(LAST_UPDATED)}
              </time>
            </span>
            <Link href="/privacy" className="rounded underline-offset-4 hover:text-gold-300 hover:underline">
              Privacy
            </Link>
            <Link href="/terms" className="rounded underline-offset-4 hover:text-gold-300 hover:underline">
              Terms
            </Link>
          </p>
        </div>
      </div>
    </footer>
  )
}
