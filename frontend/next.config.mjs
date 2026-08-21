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

  // Datadog RUM error tracking needs browser source maps to turn minified stack
  // traces back into real file/line references. They are generated only when the
  // CI upload step will consume them (DD_SOURCEMAPS=1), and that step strips them
  // from the published artifact afterwards — so production visitors never
  // download them and no original source is exposed.
  productionBrowserSourceMaps: process.env.DD_SOURCEMAPS === '1',

  ...(isStaticExport ? { output: 'export' } : {}),

  basePath: basePath || undefined,
  // Without this, `next/image` and the static chunks are requested from / even
  // though the site lives under /morsaabs.
  assetPrefix: basePath || undefined,

  // Pages has no directory-index rewriting, so each route needs its own
  // index.html inside a folder rather than a bare `about.html`.
  trailingSlash: isStaticExport,

  /**
   * The admin dashboard is server-rendered and talks to Postgres on every
   * request, so it cannot exist in a static export — `output: 'export'`
   * prerenders every route, which would run database queries at build time in
   * CI where there is no database.
   *
   * Admin route files are therefore named `page.node.tsx` / `layout.node.tsx`,
   * and `node.tsx` is only a recognised page extension when we are *not*
   * exporting. In the static build those files are just colocated modules that
   * define no route, so GitHub Pages keeps publishing the public site alone.
   * Remove this once the static export target is retired in favour of Vercel.
   */
  pageExtensions: isStaticExport ? ['tsx', 'ts'] : ['node.tsx', 'node.ts', 'tsx', 'ts'],

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
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      // Dish photography uploaded through the dashboard. The subdomain is the
      // Blob store's id, so it has to be matched by wildcard.
      { protocol: 'https', hostname: '*.public.blob.vercel-storage.com' },
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
