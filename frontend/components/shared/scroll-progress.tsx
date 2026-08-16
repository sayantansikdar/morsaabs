'use client'

import { motion, useScroll, useSpring } from 'framer-motion'

/**
 * Feature 28 — the reading-progress bar pinned to the top of the viewport.
 *
 * Purely decorative, so it is hidden from assistive tech. It animates
 * scaleX only, which stays off the layout and paint paths.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 260, damping: 34, restDelta: 0.001 })

  return (
    <motion.div
      aria-hidden="true"
      data-print="hide"
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-gold-leaf"
    />
  )
}
