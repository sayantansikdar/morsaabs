import Link from 'next/link'
import { PageHeader } from '@/components/layout/page-header'
import { GiltRule } from '@/components/ui/royal'
import { LAST_UPDATED, formatDate, site } from '@/lib/site'

export type LegalSection = {
  id: string
  heading: string
  paragraphs?: string[]
  list?: string[]
}

/**
 * Shared shell for the privacy policy and terms.
 *
 * ⚠️ These documents are a starting point written to match how the site
 * actually behaves — they are not legal advice. Have a lawyer review them
 * against the DPDP Act 2023 and your state's rules before launch.
 */
export function LegalLayout({
  title,
  eyebrow,
  lede,
  path,
  sections,
}: {
  title: string
  eyebrow: string
  lede: string
  path: string
  sections: LegalSection[]
}) {
  return (
    <>
      <PageHeader
        eyebrow={eyebrow}
        title={title}
        lede={lede}
        trail={[{ name: title, href: path }]}
      />

      <article className="py-14 sm:py-20">
        <div className="container-royal">
          <div className="grid gap-10 lg:grid-cols-[16rem_1fr] lg:gap-14">
            <nav
              aria-label="On this page"
              className="rounded-2xl border border-gold-400/25 bg-card p-5 lg:sticky lg:top-28 lg:self-start"
            >
              <h2 className="font-display text-base font-bold text-foreground">Contents</h2>
              <ol className="mt-3 space-y-1">
                {sections.map((section, i) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className="block rounded px-2 py-2 text-sm leading-snug text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <span className="tnum mr-1.5 text-gold-600 dark:text-gold-300">{i + 1}.</span>
                      {section.heading}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>

            <div className="measure">
              <p className="rounded-xl bg-muted/60 p-4 text-sm text-muted-foreground">
                Last updated{' '}
                <time dateTime={LAST_UPDATED} className="font-semibold text-foreground">
                  {formatDate(LAST_UPDATED)}
                </time>
                . Questions about this document? Email{' '}
                <a
                  href={`mailto:${site.email}`}
                  className="break-anywhere font-medium underline underline-offset-4"
                >
                  {site.email}
                </a>
                .
              </p>

              {sections.map((section, i) => (
                <section key={section.id} id={section.id} className="scroll-mt-28">
                  {i > 0 && <GiltRule className="my-10" />}
                  <h2 className="mt-8 font-display text-2xl font-bold text-foreground first:mt-6">
                    <span className="tnum mr-2 text-gold-600 dark:text-gold-300">{i + 1}.</span>
                    {section.heading}
                  </h2>

                  {section.paragraphs?.map((p) => (
                    <p key={p.slice(0, 40)} className="mt-4 leading-relaxed text-muted-foreground">
                      {p}
                    </p>
                  ))}

                  {section.list && (
                    <ul className="mt-4 space-y-2.5">
                      {section.list.map((li) => (
                        <li key={li} className="flex gap-3 leading-relaxed text-muted-foreground">
                          <span
                            aria-hidden="true"
                            className="mt-2.5 size-1.5 shrink-0 rotate-45 bg-gold-400"
                          />
                          <span>{li}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}

              <div className="mt-12 rounded-2xl border border-gold-400/25 bg-card p-6">
                <h2 className="font-display text-lg font-bold text-foreground">
                  The other document
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  {path === '/privacy' ? (
                    <>
                      Our{' '}
                      <Link href="/terms" className="font-medium underline underline-offset-4">
                        Terms of Service
                      </Link>{' '}
                      cover orders, reservations, catering contracts and cancellations.
                    </>
                  ) : (
                    <>
                      Our{' '}
                      <Link href="/privacy" className="font-medium underline underline-offset-4">
                        Privacy Policy
                      </Link>{' '}
                      covers what we collect, why, and how to have it deleted.
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </article>
    </>
  )
}
