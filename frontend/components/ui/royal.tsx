import * as React from 'react'
import { cn } from '@/lib/utils'

/**
 * The ornament vocabulary: the Mughal arch, the gold rule, the jaali screen.
 * Everything decorative here is `aria-hidden` — none of it carries meaning a
 * screen reader needs.
 */

/**
 * A four-centred Mughal arch as a reusable clip path, declared once per page
 * and referenced by id. Coordinates are in objectBoundingBox units so a single
 * definition clips elements of any size.
 */
export function ArchClipDefs() {
  return (
    <svg aria-hidden="true" focusable="false" className="pointer-events-none absolute size-0">
      <defs>
        <clipPath id="mughal-arch" clipPathUnits="objectBoundingBox">
          <path
            d="M0,1 L0,0.62 C0,0.34 0.14,0.14 0.34,0.06 C0.42,0.02 0.46,0 0.5,0
               C0.54,0 0.58,0.02 0.66,0.06 C0.86,0.14 1,0.34 1,0.62 L1,1 Z"
          />
        </clipPath>
        <clipPath id="mughal-arch-cusped" clipPathUnits="objectBoundingBox">
          <path
            d="M0,1 L0,0.66 C0,0.58 0.04,0.52 0.10,0.52 C0.16,0.52 0.20,0.45 0.20,0.37
               C0.20,0.24 0.29,0.13 0.40,0.09 C0.44,0.03 0.47,0 0.5,0
               C0.53,0 0.56,0.03 0.60,0.09 C0.71,0.13 0.80,0.24 0.80,0.37
               C0.80,0.45 0.84,0.52 0.90,0.52 C0.96,0.52 1,0.58 1,0.66 L1,1 Z"
          />
        </clipPath>
      </defs>
    </svg>
  )
}

/** Wraps content in an arch silhouette with a gilt edge. */
export function ArchFrame({
  children,
  cusped = false,
  className,
  innerClassName,
}: {
  children: React.ReactNode
  cusped?: boolean
  className?: string
  innerClassName?: string
}) {
  return (
    <div className={cn('relative', className)}>
      {/* The gilt edge is a second, slightly larger arch behind the content. */}
      <div
        aria-hidden="true"
        className="absolute -inset-[3px] bg-gold-leaf"
        style={{ clipPath: `url(#${cusped ? 'mughal-arch-cusped' : 'mughal-arch'})` }}
      />
      <div
        className={cn('relative size-full overflow-hidden', innerClassName)}
        style={{ clipPath: `url(#${cusped ? 'mughal-arch-cusped' : 'mughal-arch'})` }}
      >
        {children}
      </div>
    </div>
  )
}

/** Hairline gold rule with a centred lozenge — the standard section divider. */
export function GiltRule({ className }: { className?: string }) {
  return <div aria-hidden="true" className={cn('rule-gilt my-10', className)} />
}

/** A carved jaali (lattice) screen, used as a low-contrast panel texture. */
export function Jaali({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn('pointer-events-none absolute inset-0 bg-jaali text-gold-400', className)}
    />
  )
}

/** Small gold corner filigree for cards and panels. */
export function CornerFiligree({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 48 48"
      className={cn('pointer-events-none absolute size-10 text-gold-400/60', className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
    >
      <path d="M2 20 C2 9 9 2 20 2" strokeLinecap="round" />
      <path d="M2 30 C2 14 14 2 30 2" strokeLinecap="round" opacity="0.5" />
      <circle cx="8" cy="8" r="1.75" fill="currentColor" stroke="none" />
    </svg>
  )
}

/** The section eyebrow → heading → lede stack used on every major section. */
export function SectionHeading({
  eyebrow,
  title,
  lede,
  align = 'center',
  as: Tag = 'h2',
  className,
  id,
}: {
  eyebrow?: string
  title: React.ReactNode
  lede?: React.ReactNode
  align?: 'center' | 'left'
  as?: 'h1' | 'h2' | 'h3'
  className?: string
  id?: string
}) {
  return (
    <div
      className={cn(
        'max-w-3xl',
        align === 'center' ? 'mx-auto text-center' : 'text-left',
        className
      )}
    >
      {eyebrow && (
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-gold-600 dark:text-gold-300">
          {eyebrow}
        </p>
      )}
      <Tag
        id={id}
        className={cn(
          'font-display font-bold text-foreground',
          Tag === 'h1' ? 'text-display-lg' : 'text-display-md'
        )}
      >
        {title}
      </Tag>
      <div
        aria-hidden="true"
        className={cn(
          'mt-5 flex items-center gap-2',
          align === 'center' ? 'justify-center' : 'justify-start'
        )}
      >
        <span className="h-px w-10 bg-gradient-to-r from-transparent to-gold-400" />
        <span className="size-1.5 rotate-45 bg-gold-400" />
        <span className="h-px w-10 bg-gradient-to-l from-transparent to-gold-400" />
      </div>
      {lede && (
        <p
          className={cn(
            'measure mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg',
            align === 'center' && 'mx-auto'
          )}
        >
          {lede}
        </p>
      )}
    </div>
  )
}

/* ------------------------------------------------------------- Badges ---- */

export function Badge({
  children,
  tone = 'gold',
  className,
}: {
  children: React.ReactNode
  tone?: 'gold' | 'maroon' | 'royal' | 'muted'
  className?: string
}) {
  const tones = {
    gold: 'border-gold-400/50 bg-gold-400/15 text-gold-700 dark:text-gold-200',
    maroon: 'border-maroon-600/40 bg-maroon-600/10 text-maroon-700 dark:text-maroon-200',
    royal: 'border-royal-500/40 bg-royal-500/10 text-royal-700 dark:text-royal-200',
    muted: 'border-border bg-muted text-muted-foreground',
  }
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.7rem] font-semibold uppercase tracking-wider',
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  )
}

/* ---------------------------------------------------------- Skeletons ---- */

/** Feature 26 — shimmer placeholders that reserve the final layout's space. */
export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('skeleton', className)} />
}

export function CardSkeleton() {
  return (
    <div className="surface-card overflow-hidden p-5">
      <Skeleton className="mb-4 h-40 w-full rounded-xl" />
      <Skeleton className="mb-2 h-5 w-2/3" />
      <Skeleton className="mb-2 h-4 w-full" />
      <Skeleton className="h-4 w-4/5" />
    </div>
  )
}

/**
 * Feature 26 — the royal loading animation: a gold arch drawing itself, with
 * a live region so a screen reader is told the page is working.
 */
export function RoyalLoader({ label = 'Preparing the durbar…' }: { label?: string }) {
  return (
    <div role="status" aria-live="polite" className="flex flex-col items-center justify-center gap-5 py-24">
      <svg
        viewBox="0 0 100 100"
        className="size-20 text-gold-400"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        aria-hidden="true"
      >
        <path
          d="M12,92 L12,56 C12,32 28,14 50,8 C72,14 88,32 88,56 L88,92"
          strokeLinecap="round"
          strokeDasharray="230"
          className="motion-safe:animate-[dash_1.8s_ease-in-out_infinite]"
          style={{ strokeDashoffset: 230 }}
        />
        <circle cx="50" cy="50" r="6" className="motion-safe:animate-lamp-flicker" fill="currentColor" stroke="none" />
      </svg>
      <p className="font-display text-lg text-muted-foreground">{label}</p>
      <style>{`@keyframes dash{0%{stroke-dashoffset:230}55%{stroke-dashoffset:0}100%{stroke-dashoffset:-230}}`}</style>
    </div>
  )
}
