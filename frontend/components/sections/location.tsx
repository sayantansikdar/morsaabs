'use client'

import * as React from 'react'
import { MapPin, Navigation, Phone, Clock, Train, Car, ExternalLink, Play } from 'lucide-react'
import { SectionHeading } from '@/components/ui/royal'
import { Button } from '@/components/ui/button'
import { CopyButton } from '@/components/shared/copy-button'
import { site, fullAddress } from '@/lib/site'
import { track } from '@/lib/analytics'

/**
 * Feature 14 — map and directions.
 *
 * The Google embed is click-to-load: it is a third-party iframe that sets
 * cookies and costs several hundred kilobytes, so it does not load until the
 * visitor asks for it. Address, directions link and travel notes are all
 * available without ever loading it.
 */
export function LocationSection() {
  const [mapLoaded, setMapLoaded] = React.useState(false)

  const directions = [
    {
      icon: Train,
      title: 'By Metro',
      detail:
        'Dwarka Mor (Blue Line) — 7 minutes on foot via Rama Park Road. Uttam Nagar East is a 12-minute walk.',
    },
    {
      icon: Car,
      title: 'By Road',
      detail:
        'Off Najafgarh Road, turn into Rama Park Road at the Mohan Garden crossing. Street parking outside; valet Friday to Sunday evenings.',
    },
  ]

  return (
    <section id="location" aria-labelledby="location-title" className="py-20 sm:py-28">
      <div className="container-royal">
        <SectionHeading
          id="location-title"
          eyebrow="Find Us"
          title="Rama Park Road, Uttam Nagar"
          lede="Seven minutes on foot from Dwarka Mor metro. Look for the carved arch and the gold lettering."
        />

        <div className="mt-14 grid gap-8 lg:grid-cols-[1fr_1.25fr]">
          {/* Details column */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-gold-400/25 bg-card p-6">
              <h3 className="flex items-center gap-2.5 font-display text-lg font-bold text-foreground">
                <MapPin className="size-5 text-gold-600 dark:text-gold-300" aria-hidden="true" />
                Address
              </h3>
              <address className="mt-3 not-italic leading-relaxed text-muted-foreground">
                {fullAddress}
              </address>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button asChild variant="primary" size="sm">
                  <a
                    href={site.maps.directions}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => track('directions_click', { location: 'location_section' })}
                  >
                    <Navigation aria-hidden="true" />
                    Get directions
                  </a>
                </Button>
                <CopyButton
                  value={fullAddress}
                  label="address"
                  className="border border-border"
                />
              </div>
            </div>

            <div className="rounded-2xl border border-gold-400/25 bg-card p-6">
              <h3 className="flex items-center gap-2.5 font-display text-lg font-bold text-foreground">
                <Clock className="size-5 text-gold-600 dark:text-gold-300" aria-hidden="true" />
                Opening hours
              </h3>
              <p className="tnum mt-3 text-2xl font-bold text-maroon-700 dark:text-gold-300">
                {site.hours.display}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {site.hours.days}. Last kitchen order 10:30 PM.
              </p>
            </div>

            <div className="rounded-2xl border border-gold-400/25 bg-card p-6">
              <h3 className="flex items-center gap-2.5 font-display text-lg font-bold text-foreground">
                <Phone className="size-5 text-gold-600 dark:text-gold-300" aria-hidden="true" />
                Call the restaurant
              </h3>
              <a
                href={`tel:${site.phone}`}
                onClick={() => track('call_click', { location: 'location_section' })}
                className="tnum mt-3 inline-block rounded font-display text-2xl font-bold text-maroon-700 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring dark:text-gold-300"
              >
                {site.phoneDisplay}
              </a>
              <p className="mt-1 text-sm text-muted-foreground">{site.promise.reservation}.</p>
            </div>

            <ul className="space-y-4">
              {directions.map((d) => (
                <li key={d.title} className="flex gap-3 rounded-2xl bg-muted/60 p-5">
                  <d.icon className="mt-0.5 size-5 shrink-0 text-gold-600 dark:text-gold-300" aria-hidden="true" />
                  <div>
                    <h3 className="font-semibold text-foreground">{d.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{d.detail}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Map column */}
          <div className="min-h-[26rem] overflow-hidden rounded-2xl border border-gold-400/25 bg-muted lg:min-h-full">
            {mapLoaded ? (
              <iframe
                src={site.maps.embed}
                title={`Google map showing ${site.name} on Rama Park Road, Uttam Nagar, New Delhi`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                className="size-full min-h-[26rem] border-0"
              />
            ) : (
              <div className="flex size-full min-h-[26rem] flex-col items-center justify-center gap-4 p-8 text-center">
                <span
                  aria-hidden="true"
                  className="grid size-16 place-items-center rounded-full border border-gold-400/40 bg-card text-gold-600 dark:text-gold-300"
                >
                  <MapPin className="size-7" />
                </span>
                <p className="font-display text-lg font-bold text-foreground">
                  Interactive map
                </p>
                <p className="measure text-sm text-muted-foreground">
                  Loading the Google map sets third-party cookies, so we wait until you
                  ask. Directions work without it.
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  <Button
                    variant="primary"
                    onClick={() => {
                      setMapLoaded(true)
                      track('map_load', { location: 'location_section' })
                    }}
                  >
                    <Play aria-hidden="true" />
                    Load the map
                  </Button>
                  <Button asChild variant="outline">
                    <a href={site.maps.place} target="_blank" rel="noopener noreferrer">
                      Open in Google Maps
                      <ExternalLink aria-hidden="true" />
                    </a>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
