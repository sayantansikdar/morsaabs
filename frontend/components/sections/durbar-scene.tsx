'use client'

import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'

/**
 * The durbar courtyard — the hero backdrop, drawn rather than photographed.
 *
 * Stock photography of somebody else's restaurant is worse than no photograph,
 * and the concept reel this is based on is itself an illustrated palace scene.
 * Drawing it in SVG means it is on-palette by construction, weighs a couple of
 * kilobytes, needs no image request on the critical path, and renders sharp at
 * any viewport.
 *
 * Four depth planes drift at different rates on scroll. All of it is decorative
 * and hidden from assistive tech; the parallax is disabled under
 * prefers-reduced-motion, where every plane simply holds still.
 */
export function DurbarScene() {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)

  /*
   * Progress is measured across *this scene*, not the document.
   *
   * A bare useScroll() reports progress over the whole page, and this page is
   * some 38,000px tall — so the hero occupies about 2% of it and every plane
   * had travelled roughly a fiftieth of its range by the time it scrolled out
   * of sight. The parallax was not subtle, it was very nearly absent.
   *
   * Scoped to the scene, 0 is the hero at rest and 1 is the hero fully gone,
   * so the ranges below describe what actually happens on screen.
   */
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  /*
   * Distant planes move least — the standard parallax depth cue. The spread
   * between the nearest and furthest plane is what reads as depth, so it is
   * wider than it was: the reel's courtyard has the colonnade sliding past a
   * near-static palace, and 8%→30% was too flat to register at hero height.
   * Every value collapses to 0 under prefers-reduced-motion.
   */
  const sky = useTransform(scrollYProgress, [0, 1], ['0%', reduced ? '0%' : '6%'])
  const palace = useTransform(scrollYProgress, [0, 1], ['0%', reduced ? '0%' : '14%'])
  const arcade = useTransform(scrollYProgress, [0, 1], ['0%', reduced ? '0%' : '26%'])
  const drape = useTransform(scrollYProgress, [0, 1], ['0%', reduced ? '0%' : '-14%'])

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* ---- Plane 1: sky and courtyard ground ---------------------------- */}
      <motion.div style={{ y: sky }} className="absolute inset-x-0 -top-[8%] h-[124%]">
        <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" className="size-full">
          <defs>
            <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2B080A" />
              <stop offset="38%" stopColor="#6E1417" />
              <stop offset="62%" stopColor="#A8542A" />
              <stop offset="78%" stopColor="#D3B27A" />
              <stop offset="100%" stopColor="#8F6F44" />
            </linearGradient>
            <radialGradient id="sun" cx="50%" cy="72%" r="34%">
              <stop offset="0%" stopColor="#FAF0CE" stopOpacity="0.85" />
              <stop offset="55%" stopColor="#E8C766" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#E8C766" stopOpacity="0" />
            </radialGradient>
          </defs>

          <rect width="1440" height="900" fill="url(#sky)" />
          <ellipse cx="720" cy="648" rx="520" ry="300" fill="url(#sun)" />

          {/* Scattered gold stars */}
          {[
            [180, 120], [340, 78], [520, 148], [980, 96], [1180, 160], [1320, 104],
            [90, 240], [1390, 250], [640, 60], [820, 132],
          ].map(([x, y], i) => (
            <g key={`${x}-${y}`} transform={`translate(${x} ${y})`} opacity={0.35 + (i % 3) * 0.16}>
              <path d="M0,-7 L1.9,-1.9 L7,0 L1.9,1.9 L0,7 L-1.9,1.9 L-7,0 L-1.9,-1.9 Z" fill="#E8C766" />
            </g>
          ))}
        </svg>
      </motion.div>

      {/* ---- Plane 2: the palace silhouette -------------------------------- */}
      <motion.div style={{ y: palace }} className="absolute inset-x-0 bottom-0 h-[78%]">
        <svg viewBox="0 0 1440 620" preserveAspectRatio="xMidYMax slice" className="size-full">
          <g fill="#4A0E10" opacity="0.82">
            {/* Central pavilion with an onion dome */}
            <path d="M660 240 C660 196 690 168 720 150 C750 168 780 196 780 240 L780 260 L660 260 Z" />
            <path d="M714 150 L720 118 L726 150 Z" fill="#D4AF37" />
            <rect x="648" y="258" width="144" height="16" />
            <rect x="664" y="274" width="112" height="230" />

            {/* Flanking chhatris */}
            {[560, 880].map((x) => (
              <g key={x}>
                <path d={`M${x - 42} 300 C${x - 42} 272 ${x - 20} 254 ${x} 244 C${x + 20} 254 ${x + 42} 272 ${x + 42} 300 L${x + 42} 314 L${x - 42} 314 Z`} />
                <path d={`M${x - 4} 244 L${x} 220 L${x + 4} 244 Z`} fill="#D4AF37" />
                <rect x={x - 52} y="312" width="104" height="12" />
                <rect x={x - 40} y="324" width="80" height="180" />
              </g>
            ))}

            {/* Arcaded wings — a run of multifoil arches either side */}
            {Array.from({ length: 14 }).map((_, i) => {
              const x = i * 104 + 8
              if (x > 470 && x < 970) return null
              return (
                <path
                  key={x}
                  d={`M${x} 504 L${x} 400 C${x} 366 ${x + 20} 344 ${x + 44} 336 C${x + 68} 344 ${x + 88} 366 ${x + 88} 400 L${x + 88} 504 Z`}
                />
              )
            })}
          </g>

          {/* Lit arch openings — the glow from inside */}
          <g fill="#D3B27A" opacity="0.3">
            {Array.from({ length: 14 }).map((_, i) => {
              const x = i * 104 + 30
              if (x > 470 && x < 970) return null
              return (
                <path
                  key={x}
                  d={`M${x} 504 L${x} 412 C${x} 388 ${x + 12} 372 ${x + 22} 366 C${x + 32} 372 ${x + 44} 388 ${x + 44} 412 L${x + 44} 504 Z`}
                />
              )
            })}
            <path d="M700 504 L700 340 C700 312 710 296 720 290 C730 296 740 312 740 340 L740 504 Z" />
          </g>

          {/* Courtyard floor */}
          <rect y="504" width="1440" height="116" fill="#3D2E14" opacity="0.9" />
          <g stroke="#D4AF37" strokeWidth="1" opacity="0.16">
            {Array.from({ length: 10 }).map((_, i) => (
              <line key={i} x1={i * 160} y1="504" x2={i * 160 - 120} y2="620" />
            ))}
            <line x1="0" y1="548" x2="1440" y2="548" />
            <line x1="0" y1="584" x2="1440" y2="584" />
          </g>
        </svg>
      </motion.div>

      {/* ---- Plane 3: the foreground arcade we are standing under ---------- */}
      <motion.div style={{ y: arcade }} className="absolute inset-0">
        <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" className="size-full">
          <g fill="#2B080A">
            {/* Left and right columns, each capped with a cusped arch springing
                toward the centre — the frame the hero copy sits inside. */}
            <path d="M0 900 L0 0 L232 0 L232 214 C232 300 190 356 120 380 L120 900 Z" opacity="0.94" />
            <path d="M1440 900 L1440 0 L1208 0 L1208 214 C1208 300 1250 356 1320 380 L1320 900 Z" opacity="0.94" />
          </g>

          {/* Gold beading down the column edges */}
          <g stroke="#D4AF37" strokeWidth="2" fill="none" opacity="0.5">
            <path d="M120 380 C190 356 232 300 232 214 L232 0" />
            <path d="M1320 380 C1250 356 1208 300 1208 214 L1208 0" />
          </g>
          <g fill="#D4AF37" opacity="0.6">
            <circle cx="120" cy="392" r="7" />
            <circle cx="1320" cy="392" r="7" />
          </g>
        </svg>
      </motion.div>

      {/* ---- Plane 4: the crimson canopy drape ---------------------------- */}
      <motion.div style={{ y: drape }} className="absolute inset-x-0 top-0 h-[34%]">
        <svg viewBox="0 0 1440 300" preserveAspectRatio="none" className="size-full">
          <defs>
            <linearGradient id="velvet" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6E1417" />
              <stop offset="70%" stopColor="#A81E22" />
              <stop offset="100%" stopColor="#8E1B1F" />
            </linearGradient>
          </defs>

          {/* A swagged valance: six scallops across the top edge. */}
          <path
            d="M0,0 H1440 V96
               C1320,196 1200,196 1080,96
               C960,196 840,196 720,96
               C600,196 480,196 360,96
               C240,196 120,196 0,96 Z"
            fill="url(#velvet)"
          />
          <path
            d="M0,96 C120,196 240,196 360,96 C480,196 600,196 720,96
               C840,196 960,196 1080,96 C1200,196 1320,196 1440,96"
            fill="none"
            stroke="#D4AF37"
            strokeWidth="3"
            opacity="0.75"
          />
          {/* Tassels at each scallop trough */}
          {[180, 540, 900, 1260].map((x) => (
            <g key={x} fill="#D4AF37" opacity="0.85">
              <circle cx={x} cy="152" r="7" />
              <path d={`M${x - 4} 158 L${x + 4} 158 L${x} 182 Z`} />
            </g>
          ))}
        </svg>
      </motion.div>

      {/* Jaali screen texture over the whole scene */}
      <div className="absolute inset-0 bg-jaali text-gold-300" />

      {/* Final scrim. The horizon is deliberately the brightest part of the
          scene, and the location/hours line sits right on it — so the lower
          third gets its own wash rather than fading to the page background,
          which in light mode is cream and would drop that text below 4.5:1. */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_58%_46%_at_50%_46%,rgba(43,8,10,0.80),rgba(43,8,10,0.42)_70%,transparent)]" />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-maroon-950 via-maroon-950/80 to-transparent" />
    </div>
  )
}
