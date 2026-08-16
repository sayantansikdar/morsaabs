import type { Config } from 'tailwindcss'
import animate from 'tailwindcss-animate'

/**
 * "Royal Kingdom of Morsaab's" — the palette is lifted from the concept reel:
 * crimson durbar curtains, gold filigree, deep-green menu panels, warm
 * sandstone courtyards and copper handi bowls.
 *
 * Brand ramps are fixed hex (identical in both themes so the brand never
 * shifts); surface/text roles are HSL CSS variables so dark mode can swap them.
 */
const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './content/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        maroon: {
          50: '#FCF3F3',
          100: '#F8E1E1',
          200: '#F0C0C1',
          300: '#E29597',
          400: '#CF6265',
          500: '#B93B3F',
          600: '#A81E22',
          700: '#8E1B1F',
          800: '#6E1417',
          900: '#4A0E10',
          950: '#2B080A',
        },
        gold: {
          50: '#FDF9EC',
          100: '#FAF0CE',
          200: '#F3DF9C',
          300: '#E8C766',
          400: '#D4AF37',
          500: '#C09A2B',
          // 600 is the light-theme text gold (eyebrows, inline accents, icons).
          // The obvious #A07C22 only reaches 3.7:1 on the sand background — fine
          // for an icon, short of AA for text — so it is darkened just enough to
          // clear 4.5:1 on background, card *and* muted surfaces (4.94/5.19/4.55)
          // while still reading as gold rather than brown.
          600: '#87691D',
          700: '#7C5E1D',
          800: '#5A431A',
          900: '#3D2E14',
        },
        royal: {
          50: '#EEF7F2',
          100: '#D3EBDF',
          200: '#A6D6C0',
          300: '#6FB79A',
          400: '#3D9375',
          500: '#1F7355',
          600: '#14603F',
          700: '#0E4B33',
          800: '#0A3626',
          900: '#06231A',
        },
        sand: {
          50: '#FEFCF7',
          100: '#FDF8EE',
          200: '#F8EEDA',
          300: '#F0E0BF',
          400: '#E4CB9C',
          500: '#D3B27A',
          600: '#B8925A',
          700: '#8F6F44',
          800: '#654E31',
          900: '#40321F',
        },
        copper: {
          400: '#D08B4A',
          500: '#B87333',
          600: '#965C28',
        },

        // Semantic roles — driven by CSS variables, see globals.css
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
      },

      fontFamily: {
        // Elegant serif display + highly readable sans body, per the brief.
        display: ['var(--font-display)', 'Georgia', 'serif'],
        sans: ['var(--font-body)', 'system-ui', 'sans-serif'],
        script: ['var(--font-script)', 'cursive'],
      },

      fontSize: {
        'display-xl': ['clamp(3rem, 8vw, 6.5rem)', { lineHeight: '0.95', letterSpacing: '-0.02em' }],
        'display-lg': ['clamp(2.5rem, 6vw, 4.5rem)', { lineHeight: '1.02', letterSpacing: '-0.015em' }],
        'display-md': ['clamp(2rem, 4.5vw, 3.25rem)', { lineHeight: '1.1', letterSpacing: '-0.01em' }],
        'display-sm': ['clamp(1.5rem, 3vw, 2.25rem)', { lineHeight: '1.2' }],
      },

      borderRadius: {
        arch: '50% 50% 0.75rem 0.75rem / 32% 32% 0.75rem 0.75rem',
        lg: '0.75rem',
        md: '0.5rem',
        sm: '0.375rem',
      },

      boxShadow: {
        royal: '0 18px 50px -12px rgba(74, 14, 16, 0.35)',
        'royal-lg': '0 32px 80px -20px rgba(74, 14, 16, 0.45)',
        gilt: '0 0 0 1px rgba(212, 175, 55, 0.35), 0 12px 32px -12px rgba(212, 175, 55, 0.28)',
        inset: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.08)',
      },

      backgroundImage: {
        'gold-leaf':
          'linear-gradient(135deg, #7C5E1D 0%, #D4AF37 28%, #FAF0CE 48%, #D4AF37 68%, #A07C22 100%)',
        'durbar':
          'radial-gradient(ellipse 90% 60% at 50% 0%, rgba(168,30,34,0.55) 0%, transparent 70%)',
      },

      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        'gold-sweep': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'lamp-flicker': {
          '0%, 100%': { opacity: '1' },
          '45%': { opacity: '0.82' },
          '55%': { opacity: '0.95' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 240ms cubic-bezier(0.32, 0.72, 0, 1)',
        'accordion-up': 'accordion-up 200ms cubic-bezier(0.32, 0.72, 0, 1)',
        shimmer: 'shimmer 1.8s infinite',
        'gold-sweep': 'gold-sweep 6s ease-in-out infinite',
        'lamp-flicker': 'lamp-flicker 4s ease-in-out infinite',
        float: 'float 6s ease-in-out infinite',
      },
    },
  },
  plugins: [animate],
}

export default config
