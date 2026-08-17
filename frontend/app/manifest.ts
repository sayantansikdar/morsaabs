import type { MetadataRoute } from 'next'
import { site, asset } from '@/lib/site'

/**
 * Generated rather than a static public/site.webmanifest, because the paths
 * inside it (start_url, icon src, shortcut urls) need the deployment's
 * basePath applied — and nothing rewrites the contents of a file in public/.
 */
export const dynamic = 'force-static'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Morsaab's — Royal Vegetarian Restaurant",
    short_name: "Morsaab's",
    description: site.description,
    start_url: asset('/?utm_source=pwa&utm_medium=homescreen'),
    scope: asset('/'),
    display: 'standalone',
    orientation: 'portrait-primary',
    background_color: '#FDF8EE',
    theme_color: '#4A0E10',
    lang: 'en-IN',
    categories: ['food', 'lifestyle'],
    icons: [
      { src: asset('/icon.svg'), sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
      { src: asset('/apple-icon'), sizes: '180x180', type: 'image/png', purpose: 'maskable' },
    ],
    shortcuts: [
      { name: 'Order Online', url: asset('/order?utm_source=pwa&utm_medium=shortcut'), description: 'Delivery or takeaway' },
      { name: 'Book a Table', url: asset('/reserve?utm_source=pwa&utm_medium=shortcut'), description: 'Reserve in 15 minutes' },
      { name: 'Full Menu', url: asset('/menu?utm_source=pwa&utm_medium=shortcut'), description: 'Every dish and price' },
    ],
  }
}
