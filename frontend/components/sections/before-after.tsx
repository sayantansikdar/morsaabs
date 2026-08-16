'use client'

import * as React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { MoveHorizontal } from 'lucide-react'
import { SectionHeading, Badge } from '@/components/ui/royal'
import { beforeAfter, type BeforeAfter } from '@/content/media'
import { cn } from '@/lib/utils'

/**
 * Feature 51 — before/after comparison.
 *
 * The handle is a real range input rather than a bare drag target, so it works
 * with a mouse, a finger, and arrow keys, and screen readers announce it as a
 * slider with a percentage. The drag layer sits on top for pointer users and
 * writes to the same state.
 */
export function BeforeAfterSlider({ pair }: { pair: BeforeAfter }) {
  const [position, setPosition] = React.useState(50)
  const frameRef = React.useRef<HTMLDivElement>(null)
  const draggingRef = React.useRef(false)
  const labelId = React.useId()

  const setFromClientX = React.useCallback((clientX: number) => {
    const rect = frameRef.current?.getBoundingClientRect()
    if (!rect) return
    const pct = ((clientX - rect.left) / rect.width) * 100
    setPosition(Math.min(100, Math.max(0, pct)))
  }, [])

  React.useEffect(() => {
    function onMove(e: PointerEvent) {
      if (!draggingRef.current) return
      e.preventDefault()
      setFromClientX(e.clientX)
    }
    function onUp() {
      draggingRef.current = false
    }
    window.addEventListener('pointermove', onMove, { passive: false })
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
    }
  }, [setFromClientX])

  return (
    <figure className="overflow-hidden rounded-2xl border border-gold-400/25 bg-card">
      <div
        ref={frameRef}
        className="relative aspect-[3/2] w-full touch-pan-y select-none overflow-hidden"
        onPointerDown={(e) => {
          draggingRef.current = true
          setFromClientX(e.clientX)
        }}
      >
        {/* After sits underneath, full width. */}
        <Image
          src={pair.after.src}
          alt={pair.after.alt}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
        />

        {/* Before is clipped to the handle position. */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        >
          <Image
            src={pair.before.src}
            alt={pair.before.alt}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>

        <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-maroon-950/80 px-3 py-1 text-xs font-bold uppercase tracking-widest text-sand-100">
          Before
        </span>
        <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-gold-400 px-3 py-1 text-xs font-bold uppercase tracking-widest text-maroon-950">
          After
        </span>

        {/* Divider + grip */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 w-0.5 bg-gold-400 shadow-[0_0_16px_rgba(212,175,55,0.7)]"
          style={{ left: `${position}%` }}
        >
          <span className="absolute left-1/2 top-1/2 grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-gold-400 bg-maroon-950 text-gold-300">
            <MoveHorizontal className="size-5" />
          </span>
        </div>

        {/* The accessible control. Visually hidden but fully operable. */}
        <label htmlFor={`${labelId}-range`} className="sr-only">
          Reveal the before and after images of {pair.title}
        </label>
        <input
          id={`${labelId}-range`}
          type="range"
          min={0}
          max={100}
          step={1}
          value={Math.round(position)}
          onChange={(e) => setPosition(Number(e.target.value))}
          aria-valuetext={`${Math.round(position)}% before, ${100 - Math.round(position)}% after`}
          className={cn(
            'absolute inset-x-0 bottom-0 h-11 w-full cursor-ew-resize opacity-0',
            // Keep the focus ring visible even though the input itself is not.
            'focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400'
          )}
        />
      </div>

      <figcaption className="p-5">
        <div className="flex flex-wrap items-center gap-3">
          <h3 className="font-display text-lg font-bold text-foreground">{pair.title}</h3>
          <Badge tone="muted">{pair.year}</Badge>
        </div>
        <p className="measure mt-2 text-sm leading-relaxed text-muted-foreground">{pair.caption}</p>
      </figcaption>
    </figure>
  )
}

export function BeforeAfterSection() {
  return (
    <section id="gallery" aria-labelledby="gallery-title" className="py-20 sm:py-28">
      <div className="container-royal">
        <SectionHeading
          id="gallery-title"
          eyebrow="Then & Now"
          title="What we changed, and why"
          lede="Three upgrades we made to the room and the plate. Drag the handle — or use the arrow keys — to see the difference."
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {beforeAfter.map((pair, i) => (
            <motion.div
              key={pair.id}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: (i % 2) * 0.08 }}
              className={i === 0 ? 'lg:col-span-2' : ''}
            >
              <BeforeAfterSlider pair={pair} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
