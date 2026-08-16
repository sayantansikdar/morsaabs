'use client'

import Link from 'next/link'
import { MessageCircleQuestion, Phone } from 'lucide-react'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'
import { SectionHeading } from '@/components/ui/royal'
import { Button } from '@/components/ui/button'
import { faqs } from '@/content/faqs'
import { site } from '@/lib/site'
import { track } from '@/lib/analytics'

/**
 * Features 7 + 39 — the expandable FAQ.
 *
 * `type="single" collapsible` keeps one panel open at a time, which stops the
 * page from growing to three screens while somebody is reading one answer.
 */
export function FaqSection({
  heading = true,
  className,
}: {
  heading?: boolean
  className?: string
}) {
  return (
    <section id="faq" aria-labelledby="faq-title" className={className ?? 'py-20 sm:py-28'}>
      <div className="container-royal">
        {heading && (
          <SectionHeading
            id="faq-title"
            eyebrow="Before You Come"
            title="The five questions we get most"
            lede="Anything not covered here, call us — someone picks up during service hours."
          />
        )}

        <div className="mx-auto mt-12 max-w-3xl">
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id}>
                <AccordionTrigger
                  onClick={() => track('faq_open', { question_id: faq.id })}
                >
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-10 rounded-2xl border border-gold-400/30 bg-card p-6 text-center">
            <MessageCircleQuestion
              className="mx-auto size-8 text-gold-500"
              aria-hidden="true"
            />
            <p className="mt-3 font-display text-lg font-bold text-foreground">
              Still have a question?
            </p>
            <p className="mt-1.5 text-sm text-muted-foreground">
              {site.promise.enquiry}. Or just ring the restaurant.
            </p>
            <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild variant="primary">
                <a href={`tel:${site.phone}`} onClick={() => track('call_click', { location: 'faq' })}>
                  <Phone aria-hidden="true" />
                  {site.phoneDisplay}
                </a>
              </Button>
              <Button asChild variant="outline">
                <Link href="/contact">Send a message</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
