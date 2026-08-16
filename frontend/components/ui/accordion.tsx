'use client'

import * as React from 'react'
import * as AccordionPrimitive from '@radix-ui/react-accordion'
import { Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Features 7 + 39 — the expandable FAQ. Radix animates height via a CSS
 * variable, so the open/close transition is a real height tween rather than a
 * max-height guess, and it collapses to nothing when the panel is closed.
 */

export const Accordion = AccordionPrimitive.Root

export const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn(
      'group overflow-hidden rounded-2xl border border-gold-400/25 bg-card transition-colors data-[state=open]:border-gold-400/60',
      className
    )}
    {...props}
  />
))
AccordionItem.displayName = 'AccordionItem'

export const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        'flex flex-1 cursor-pointer items-center justify-between gap-4 px-5 py-5 text-left font-display text-lg font-semibold text-foreground transition-colors hover:text-maroon-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring dark:hover:text-gold-300 sm:px-6',
        className
      )}
      {...props}
    >
      {children}
      <span
        aria-hidden="true"
        className="grid size-8 shrink-0 place-items-center rounded-full border border-gold-400/40 text-gold-500 transition-transform duration-300 group-data-[state=open]:rotate-45 group-data-[state=open]:bg-gold-400 group-data-[state=open]:text-maroon-950"
      >
        <Plus className="size-4" />
      </span>
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
))
AccordionTrigger.displayName = 'AccordionTrigger'

export const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}
  >
    <div className={cn('measure px-5 pb-5 leading-relaxed text-muted-foreground sm:px-6', className)}>
      {children}
    </div>
  </AccordionPrimitive.Content>
))
AccordionContent.displayName = 'AccordionContent'
