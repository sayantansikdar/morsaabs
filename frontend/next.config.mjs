import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * Two deploy targets from one codebase.
 *
 * GitHub Pages is a static file host: no Node runtime, so no SSR, no route
 * handlers, and no on-demand image optimisation. Setting STATIC_EXPORT=1
 * switches the build to `output: 'export'` and turns off everything that needs
 * a server. Without it the build is a normal Next app for Vercel or Lambda.
 *
 * Pages also serves this repo from a subpath (/morsaabs), so the export needs a
 * basePath — otherwise every asset resolves to the domain root and 404s.
 */
const isStaticExport = process.env.STATIC_EXPORT === '1'
const basePath = process.env.BASE_PATH ?? ''

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  ...(isStaticExport ? { output: 'export' } : {}),

  basePath: basePath || undefined,
  // Without this, `next/image` and the static chunks are requested from / even
  // though the site lives under /morsaabs.
  assetPrefix: basePath || undefined,

  // Pages has no directory-index rewriting, so each route needs its own
  // index.html inside a folder rather than a bare `about.html`.
  trailingSlash: isStaticExport,

  // There is a lockfile above this directory too; pin the trace root here so
  // Next does not infer the home directory as the workspace root.
  outputFileTracingRoot: __dirname,

  images: {
    // Feature 55: on a Node host Next serves AVIF first, falling back to WebP,
    // resized to whichever of these widths the layout asks for. A static export
    // has no optimiser process, so images are passed through untouched.
    unoptimized: isStaticExport,
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [375, 640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
    ],
  },

  // headers() and redirects() are server features. Declaring them under
  // `output: export` only produces a build warning and silently does nothing,
  // so they are omitted entirely rather than left to look effective.
  ...(isStaticExport
    ? {}
    : {
        async headers() {
          return [
            {
              source: '/:path*',
              headers: [
                { key: 'X-Content-Type-Options', value: 'nosniff' },
                { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
                { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
              ],
            },
            {
              // llms.txt is plain text; without this browsers offer to download it.
              source: '/llms.txt',
              headers: [{ key: 'Content-Type', value: 'text/plain; charset=utf-8' }],
            },
          ]
        },

        async redirects() {
          return [
            { source: '/home', destination: '/', permanent: true },
            { source: '/menu-card', destination: '/menu', permanent: true },
          ]
        },
      }),
}

export default nextConfig
