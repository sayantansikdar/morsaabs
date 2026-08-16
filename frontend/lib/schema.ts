/**
 * JSON-LD builders (feature 17).
 *
 * The Restaurant node is the anchor: everything else references it by @id so
 * Google reads one business with several related entities rather than several
 * unrelated businesses.
 */

import { SITE_URL, site } from './site'
import { menu } from '@/content/menu'
import { faqs } from '@/content/faqs'
import type { Post } from '@/content/blog'

export const ORG_ID = `${SITE_URL}/#restaurant`
const WEBSITE_ID = `${SITE_URL}/#website`

export function restaurantSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    '@id': ORG_ID,
    name: site.name,
    alternateName: [site.nameDevanagari, "Morsaabs", "Morsaab's Restaurant"],
    description: site.description,
    url: SITE_URL,
    telephone: site.phone,
    email: site.email,
    image: [`${SITE_URL}/opengraph-image`],
    logo: `${SITE_URL}/icon.svg`,
    priceRange: '₹₹',
    currenciesAccepted: 'INR',
    paymentAccepted: 'UPI, Credit Card, Debit Card, Digital Wallet, Cash, Net Banking',
    servesCuisine: ['North Indian', 'Indo-Chinese', 'South Indian', 'Italian', 'Vegetarian'],
    address: {
      '@type': 'PostalAddress',
      streetAddress: `${site.address.street}, ${site.address.road}`,
      addressLocality: site.address.locality,
      addressRegion: site.address.region,
      postalCode: site.address.postalCode,
      addressCountry: site.address.country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: site.geo.latitude,
      longitude: site.geo.longitude,
    },
    hasMap: site.maps.place,
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday',
        ],
        opens: site.hours.opens,
        closes: site.hours.closes,
      },
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: site.rating.value,
      reviewCount: site.rating.count,
      bestRating: 5,
      worstRating: 1,
    },
    sameAs: [site.social.instagram, site.social.facebook, site.social.twitter],
    acceptsReservations: `${SITE_URL}/reserve`,
    hasMenu: `${SITE_URL}/menu`,
    areaServed: [
      'Uttam Nagar', 'Dwarka Mor', 'Mohan Garden', 'Bindapur', 'Matiala', 'Janakpuri West', 'New Delhi',
    ].map((name) => ({ '@type': 'Place', name })),
    makesOffer: [
      { '@type': 'Offer', name: 'Dine-in', url: `${SITE_URL}/services/dine-in` },
      { '@type': 'Offer', name: 'Takeaway', url: `${SITE_URL}/services/takeaway` },
      { '@type': 'Offer', name: 'Home Delivery', url: `${SITE_URL}/services/home-delivery` },
      { '@type': 'Offer', name: 'Catering', url: `${SITE_URL}/services/catering` },
      { '@type': 'Offer', name: 'Banquet Hall', url: `${SITE_URL}/services/banquet` },
    ],
  }
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: SITE_URL,
    name: site.name,
    publisher: { '@id': ORG_ID },
    inLanguage: 'en-IN',
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/menu?q={search_term_string}` },
      'query-input': 'required name=search_term_string',
    },
  }
}

export function menuSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Menu',
    '@id': `${SITE_URL}/menu#menu`,
    name: `${site.name} Menu`,
    inLanguage: 'en-IN',
    hasMenuSection: menu.map((category) => ({
      '@type': 'MenuSection',
      name: category.name,
      description: category.blurb,
      hasMenuItem: category.items.map((item) => ({
        '@type': 'MenuItem',
        name: item.name,
        description: item.description,
        offers: { '@type': 'Offer', price: item.price, priceCurrency: 'INR' },
        suitableForDiet: [
          'https://schema.org/VegetarianDiet',
          ...(item.vegan ? ['https://schema.org/VeganDiet'] : []),
        ],
      })),
    })),
  }
}

export function faqSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  }
}

export function breadcrumbSchema(trail: { name: string; href: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: `${SITE_URL}${crumb.href}`,
    })),
  }
}

export function articleSchema(post: Post) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${SITE_URL}/blog/${post.slug}#article`,
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    inLanguage: 'en-IN',
    keywords: post.tags.join(', '),
    articleSection: post.category,
    wordCount: post.body.reduce((n, b) => {
      if ('text' in b) return n + b.text.split(/\s+/).length
      if ('items' in b) return n + b.items.join(' ').split(/\s+/).length
      return n
    }, 0),
    author: { '@type': 'Person', name: post.author, jobTitle: post.authorRole },
    publisher: { '@id': ORG_ID },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/blog/${post.slug}` },
    image: [`${SITE_URL}/opengraph-image`],
  }
}

export function serviceSchema(s: { slug: string; name: string; summary: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `${s.name} — ${site.name}`,
    description: s.summary,
    url: `${SITE_URL}/services/${s.slug}`,
    provider: { '@id': ORG_ID },
    areaServed: { '@type': 'City', name: 'New Delhi' },
    serviceType: s.name,
  }
}
