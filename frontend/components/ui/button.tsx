import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  // min-h-11 keeps every button at or above the 44px touch target.
  'inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold tracking-wide transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] [&_svg]:size-[1.15em] [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        primary:
          'bg-maroon-700 text-sand-50 shadow-royal hover:bg-maroon-600 hover:shadow-royal-lg',
        gold:
          'bg-gold-400 text-maroon-950 shadow-gilt hover:bg-gold-300',
        royal:
          'bg-royal-700 text-sand-50 shadow-royal hover:bg-royal-600',
        outline:
          'border-2 border-gold-400/70 bg-transparent text-foreground hover:border-gold-400 hover:bg-gold-400/10',
        ghost: 'text-foreground hover:bg-muted',
        link: 'h-auto min-h-0 rounded-none px-0 text-maroon-700 underline underline-offset-4 hover:text-maroon-600 dark:text-gold-300 dark:hover:text-gold-200',
        destructive: 'bg-maroon-800 text-sand-50 hover:bg-maroon-700',
      },
      size: {
        sm: 'px-4 py-2 text-xs',
        md: 'px-6 py-2.5',
        lg: 'px-8 py-3.5 text-base',
        xl: 'px-10 py-4 text-base sm:text-lg',
        icon: 'size-11 px-0',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  /** Shows a spinner and blocks input while an async action is in flight. */
  loading?: boolean
  loadingText?: string
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, loadingText, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'

    if (asChild) {
      return (
        <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props}>
          {children}
        </Comp>
      )
    }

    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        {...props}
      >
        {loading && <Loader2 className="animate-spin" aria-hidden="true" />}
        {loading && loadingText ? loadingText : children}
      </button>
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
