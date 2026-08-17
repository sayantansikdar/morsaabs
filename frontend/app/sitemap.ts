import type { MetadataRoute } from 'next'
import { SITE_URL, LAST_UPDATED } from '@/lib/site'
import { services } from '@/content/services'
import { posts } from '@/content/blog'

/**
 * Feature 41 — the sitemap, generated from the same content modules the pages
 * render, so a new service or post cannot be forgotten here.
 *
 * Priorities are relative, not absolute: the conversion pages and the menu
 * outrank the legal pages, which are listed only so they are discoverable.
 */
/**
 * Rendered at build time so it exists as a real sitemap.xml file in a static
 * export — without this Next treats it as a dynamic route and refuses to
 * export the build.
 */
export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const reviewed = new Date(LAST_UPDATED)

  const staticRoutes: {
    path: string
    priority: number
    changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']
  }[] = [
    { path: '/', priority: 1.0, changeFrequency: 'weekly' },
    { path: '/menu', priority: 0.95, changeFrequency: 'weekly' },
    { path: '/order', priority: 0.9, changeFrequency: 'monthly' },
    { path: '/reserve', priority: 0.9, changeFrequency: 'monthly' },
    { path: '/services', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/about', priority: 0.7, changeFrequency: 'monthly' },
    { path: '/contact', priority: 0.7, changeFrequency: 'monthly' },
    { path: '/stories', priority: 0.65, changeFrequency: 'monthly' },
    { path: '/gallery', priority: 0.6, changeFrequency: 'monthly' },
    { path: '/blog', priority: 0.6, changeFrequency: 'weekly' },
    { path: '/faq', priority: 0.55, changeFrequency: 'monthly' },
    { path: '/privacy', priority: 0.3, changeFrequency: 'yearly' },
    { path: '/terms', priority: 0.3, changeFrequency: 'yearly' },
  ]

  return [
    ...staticRoutes.map((route) => ({
      url: `${SITE_URL}${route.path}`,
      lastModified: reviewed,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),

    ...services.map((service) => ({
      url: `${SITE_URL}/services/${service.slug}`,
      lastModified: reviewed,
      changeFrequency: 'monthly' as const,
      priority: 0.75,
    })),

    ...posts.map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: new Date(post.updatedAt),
      changeFrequency: 'yearly' as const,
      priority: 0.5,
    })),
  ]
}
