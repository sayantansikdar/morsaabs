import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site'

/**
 * Feature 10 — crawler management.
 *
 * Search crawlers get everything except the private and per-visitor routes.
 * AI crawlers are allowed on the content that is genuinely useful to quote
 * (the menu, the journal, the service pages) and pointed at /llms.txt, which
 * gives them a cleaner summary than scraping the HTML would.
 */
export default function robots(): MetadataRoute.Robots {
  const disallow = ['/api/', '/thank-you', '/account', '/_next/']

  return {
    rules: [
      { userAgent: '*', allow: '/', disallow },
      // Ad-quality bots need the landing pages they are asked to score.
      { userAgent: 'AdsBot-Google', allow: '/', disallow: ['/api/', '/account'] },
      {
        userAgent: ['GPTBot', 'ClaudeBot', 'PerplexityBot', 'Google-Extended', 'CCBot'],
        allow: ['/', '/menu', '/blog/', '/services/', '/about', '/faq'],
        disallow: [...disallow, '/order', '/reserve'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
