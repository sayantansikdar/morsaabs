import type { Metadata } from 'next'
import { SITE_URL, site } from './site'

/**
 * Builds page metadata with a canonical URL attached every time (feature 43),
 * so no page can ship without one.
 */
export function pageMeta({
  title,
  description,
  path,
  keywords,
  noIndex = false,
  type = 'website',
  publishedTime,
  modifiedTime,
}: {
  title: string
  description: string
  path: string
  keywords?: string[]
  noIndex?: boolean
  type?: 'website' | 'article'
  publishedTime?: string
  modifiedTime?: string
}): Metadata {
  const url = `${SITE_URL}${path}`
  // Declaring an `openGraph` block on a page shadows the file-convention
  // opengraph-image from app/, so interior pages ship with no share image
  // unless it is named explicitly. SITE_URL already carries any basePath.
  const ogImage = {
    url: `${SITE_URL}/opengraph-image`,
    width: 1200,
    height: 630,
    alt: `${site.name} — ${site.tagline}`,
  }
  return {
    title,
    description,
    keywords,
    alternates: { canonical: url },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
    openGraph: {
      type,
      url,
      title,
      description,
      siteName: site.name,
      locale: 'en_IN',
      images: [ogImage],
      ...(publishedTime ? { publishedTime } : {}),
      ...(modifiedTime ? { modifiedTime } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      site: '@morsaabs',
      images: [ogImage.url],
    },
  }
}
