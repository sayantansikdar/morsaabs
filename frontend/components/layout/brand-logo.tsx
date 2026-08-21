/**
 * The Morsaab's trademark, drawn as SVG.
 *
 * ⚠️ This is a reconstruction, not the original artwork. It was rebuilt from a
 * screenshot of the logo — a phone profile picture, about 470px wide with JPEG
 * artefacts and a white circle baked into the background. Placing that in the
 * header would have been soft on every retina screen and would have shown a
 * white disc against the maroon bar. Redrawing it means it is sharp at any
 * size, weighs about a kilobyte, needs no image request, and sits on any
 * background.
 *
 * The trade is fidelity: the geometry and the colours are sampled from the real
 * mark (#A9151D and #E9B270), but the two typefaces are the site's own
 * Playfair Display and Great Vibes standing in for whatever the designer used,
 * and the monogram's flourish is approximated. **Replace this with the original
 * vector file** — from whoever produced the trademark — before it goes on
 * anything printed. For a registered mark, exactness is the point.
 */

export function BrandLogo({
  className,
  title = "Morsaab’s",
}: {
  className?: string
  /** Rendered as the accessible name; pass null-ish only when a sibling labels it. */
  title?: string
}) {
  return (
    <svg
      viewBox="0 0 470 270"
      className={className}
      role="img"
      aria-label={title}
      // The gradients are id-scoped; two of these on one page would otherwise
      // collide, so the ids are namespaced rather than generic.
      focusable="false"
    >
      <defs>
        {/* The border is a milled metal edge on the original: light at the top
            left, deepening round to the bottom right. */}
        <linearGradient id="msRim" x1="0" y1="0" x2="0.7" y2="1">
          <stop offset="0" stopColor="#F6DCA9" />
          <stop offset="0.35" stopColor="#E9B270" />
          <stop offset="0.7" stopColor="#C98F4C" />
          <stop offset="1" stopColor="#F2D096" />
        </linearGradient>

        <linearGradient id="msField" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#B4171F" />
          <stop offset="1" stopColor="#96131A" />
        </linearGradient>
      </defs>

      {/* Body of the badge: gold rim drawn as a stroke so the red never bleeds
          past it at small sizes. */}
      <ellipse cx="224" cy="140" rx="212" ry="118" fill="url(#msField)" />
      <ellipse
        cx="224"
        cy="140"
        rx="212"
        ry="118"
        fill="none"
        stroke="url(#msRim)"
        strokeWidth="11"
      />
      <ellipse
        cx="224"
        cy="140"
        rx="200"
        ry="107"
        fill="none"
        stroke="#7E0F16"
        strokeWidth="1.5"
        opacity="0.5"
      />

      {/* Monogram roundel, sitting above the wordmark. */}
      <circle cx="224" cy="88" r="41" fill="none" stroke="#C05C41" strokeWidth="2" opacity="0.75" />

      {/* The flourishes that run out either side of the roundel. */}
      <path
        d="M126 90c18-9 34 7 52-1M270 89c18 8 34-8 52 1"
        fill="none"
        stroke="#E9B270"
        strokeWidth="2.4"
        strokeLinecap="round"
      />

      <text
        x="224"
        y="103"
        textAnchor="middle"
        fill="#E9B270"
        style={{ font: '400 52px var(--font-script), "Great Vibes", cursive' }}
      >
        ms
      </text>

      <text
        x="224"
        y="201"
        textAnchor="middle"
        fill="#E9B270"
        style={{
          font: '600 62px var(--font-display), "Playfair Display", Georgia, serif',
          letterSpacing: '0.02em',
        }}
      >
        MORSAAB’S
      </text>

      {/* Trademark mark, outside the badge as on the original. */}
      <circle cx="437" cy="34" r="19" fill="#FBF7F0" stroke="#A9151D" strokeWidth="2.5" />
      <text
        x="437"
        y="41"
        textAnchor="middle"
        fill="#A9151D"
        style={{ font: '700 17px Georgia, serif' }}
      >
        TM
      </text>
    </svg>
  )
}
