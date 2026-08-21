/**
 * Spices drifting through the durbar, as in the concept reel.
 *
 * Deliberately CSS rather than framer-motion: this runs for as long as the hero
 * is on screen, and a JS animation loop for ambient decoration would burn
 * main-thread time on every frame for something nobody is looking at directly.
 * Transform and opacity only, so it stays on the compositor and never triggers
 * layout.
 *
 * A server component — there is no state and no interactivity, so none of this
 * needs to reach the browser as JavaScript.
 *
 * Motion is ambient, not a feature: the reel throws spices across the frame at
 * full contrast, which on a real page reads as clutter behind the words people
 * came to read. These are slow, low-contrast, and behind the copy. The global
 * prefers-reduced-motion rule in globals.css collapses every animation here to
 * nothing, so a reader who asked for stillness gets a static backdrop.
 */

type Spice = 'anise' | 'cardamom' | 'bay'

/** Hand-placed rather than random, so nothing clusters or covers the headline. */
const DRIFT: {
  kind: Spice
  left: string
  size: number
  duration: number
  delay: number
  drift: string
  spin: number
  opacity: number
}[] = [
  { kind: 'anise', left: '6%', size: 34, duration: 30, delay: 0, drift: '4vw', spin: 220, opacity: 0.16 },
  { kind: 'cardamom', left: '17%', size: 20, duration: 24, delay: -7, drift: '-3vw', spin: 300, opacity: 0.2 },
  { kind: 'bay', left: '27%', size: 28, duration: 34, delay: -15, drift: '5vw', spin: -180, opacity: 0.14 },
  { kind: 'cardamom', left: '39%', size: 16, duration: 27, delay: -3, drift: '2vw', spin: 260, opacity: 0.18 },
  { kind: 'anise', left: '54%', size: 26, duration: 32, delay: -19, drift: '-4vw', spin: -240, opacity: 0.13 },
  { kind: 'bay', left: '66%', size: 32, duration: 29, delay: -11, drift: '3vw', spin: 200, opacity: 0.15 },
  { kind: 'cardamom', left: '78%', size: 18, duration: 26, delay: -22, drift: '-2vw', spin: 280, opacity: 0.19 },
  { kind: 'anise', left: '90%', size: 30, duration: 36, delay: -5, drift: '-5vw', spin: 190, opacity: 0.14 },
]

export function SpiceDrift() {
  return (
    <div
      aria-hidden="true"
      data-print="hide"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {DRIFT.map((spice, index) => (
        <span
          key={index}
          className="spice-drift absolute top-0 block motion-reduce:hidden"
          style={
            {
              left: spice.left,
              width: spice.size,
              height: spice.size,
              opacity: spice.opacity,
              animationDuration: `${spice.duration}s`,
              // Negative delays start each one mid-flight, so the hero is
              // already populated on load instead of filling up over 30s.
              animationDelay: `${spice.delay}s`,
              '--spice-drift-x': spice.drift,
              '--spice-spin': `${spice.spin}deg`,
            } as React.CSSProperties
          }
        >
          <SpiceMark kind={spice.kind} />
        </span>
      ))}
    </div>
  )
}

/** Drawn, not imported: three small shapes cost less than one icon request. */
function SpiceMark({ kind }: { kind: Spice }) {
  if (kind === 'anise') {
    return (
      <svg viewBox="0 0 32 32" className="size-full fill-gold-300/70">
        {/* Eight points radiating from a small centre — star anise. */}
        {Array.from({ length: 8 }).map((_, i) => (
          <ellipse
            key={i}
            cx="16"
            cy="7"
            rx="2.6"
            ry="6.4"
            transform={`rotate(${i * 45} 16 16)`}
          />
        ))}
        <circle cx="16" cy="16" r="2.4" className="fill-maroon-500/80" />
      </svg>
    )
  }

  if (kind === 'cardamom') {
    return (
      <svg viewBox="0 0 32 32" className="size-full fill-royal-400/70">
        {/* A pod: tapered at both ends, with the seam down the middle. */}
        <path d="M16 2c5 5.5 7 10.4 7 14s-2.6 14-7 14-7-10.4-7-14S11 7.5 16 2z" />
        <path d="M16 4v24" className="stroke-maroon-950/30" strokeWidth="1.2" fill="none" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 32 32" className="size-full fill-royal-500/60">
      {/* Bay leaf: a pointed oval with a central vein. */}
      <path d="M16 2c7 6 10 11 10 15s-4.5 13-10 13S6 21 6 17 9 8 16 2z" />
      <path d="M16 5v22" className="stroke-maroon-950/25" strokeWidth="1.1" fill="none" />
    </svg>
  )
}
