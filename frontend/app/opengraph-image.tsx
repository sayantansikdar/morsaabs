import { ImageResponse } from 'next/og'
import { site } from '@/lib/site'

/**
 * Feature 13 — the social share card.
 *
 * Generated at build time rather than shipped as a binary, so the copy stays in
 * sync with lib/site.ts and there is no stale social-share.jpg to forget about.
 * Next wires the og:image and twitter:image tags automatically.
 *
 * Satori (which renders this) supports flexbox only — no grid, and every
 * element with more than one child needs an explicit display value.
 */
export const runtime = 'nodejs'
// Generated once at build time so it exists as a real PNG in a static export.
export const dynamic = 'force-static'
export const alt = "Morsaab's — A Royal Taste of India. Pure vegetarian restaurant near Dwarka Mor, New Delhi."
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          backgroundColor: '#2B080A',
          backgroundImage:
            'radial-gradient(ellipse 90% 70% at 50% 0%, #6E1417 0%, #2B080A 65%)',
          fontFamily: 'serif',
        }}
      >
        {/* Gold canopy rule */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: 10,
            background: 'linear-gradient(90deg, #7C5E1D, #D4AF37 30%, #FAF0CE 50%, #D4AF37 70%, #7C5E1D)',
          }}
        />

        {/* Arch outline */}
        <svg
          width="420"
          height="470"
          viewBox="0 0 300 400"
          style={{ position: 'absolute', opacity: 0.18 }}
          fill="none"
          stroke="#D4AF37"
          strokeWidth="3"
        >
          <path d="M20,400 L20,180 C20,90 75,25 150,5 C225,25 280,90 280,180 L280,400" />
          <path d="M62,400 L62,192 C62,118 102,66 150,50 C198,66 238,118 238,192 L238,400" />
        </svg>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            border: '1px solid rgba(212,175,55,0.45)',
            borderRadius: 999,
            padding: '8px 22px',
            color: '#E8C766',
            fontSize: 22,
            letterSpacing: 3,
            textTransform: 'uppercase',
          }}
        >
          Uttam Nagar · New Delhi
        </div>

        <div
          style={{
            display: 'flex',
            fontSize: 132,
            fontWeight: 700,
            color: '#FDF8EE',
            marginTop: 26,
            letterSpacing: -2,
          }}
        >
          Morsaab’s
        </div>

        <div
          style={{
            display: 'flex',
            fontSize: 44,
            color: '#D4AF37',
            marginTop: 6,
            fontStyle: 'italic',
          }}
        >
          {site.tagline}
        </div>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 30 }}>
          <div style={{ width: 90, height: 1, backgroundColor: '#D4AF37' }} />
          <div style={{ width: 10, height: 10, backgroundColor: '#D4AF37', transform: 'rotate(45deg)' }} />
          <div style={{ width: 90, height: 1, backgroundColor: '#D4AF37' }} />
        </div>

        <div
          style={{
            display: 'flex',
            fontSize: 28,
            color: '#E4CB9C',
            marginTop: 28,
            textAlign: 'center',
            maxWidth: 860,
          }}
        >
          Pure vegetarian North Indian &amp; Indo-Chinese · 7 min from Dwarka Mor metro
        </div>

        <div
          style={{
            display: 'flex',
            gap: 16,
            marginTop: 38,
          }}
        >
          {/* Plain Latin text only — Satori fetches a fallback font for any
              glyph outside the bundled set, and a symbol like ★ fails the build
              lookup for no visual gain. */}
          {['Rated 4.8 · 71+ reviews', '11 AM – 11 PM daily', '35-min delivery'].map((chip) => (
            <div
              key={chip}
              style={{
                display: 'flex',
                backgroundColor: 'rgba(212,175,55,0.14)',
                border: '1px solid rgba(212,175,55,0.4)',
                borderRadius: 999,
                padding: '10px 24px',
                color: '#FAF0CE',
                fontSize: 24,
              }}
            >
              {chip}
            </div>
          ))}
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: 34,
            display: 'flex',
            color: '#B8925A',
            fontSize: 24,
            letterSpacing: 1,
          }}
        >
          morsaabs.com · {site.phoneDisplay}
        </div>
      </div>
    ),
    size
  )
}
