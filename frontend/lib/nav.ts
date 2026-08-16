import { services } from '@/content/services'

export type NavLink = { href: string; label: string; description?: string }

/** Primary navigation — identical on desktop and in the mobile drawer. */
export const primaryNav: NavLink[] = [
  { href: '/menu', label: 'Menu', description: 'Nine kitchens, one carte' },
  { href: '/services', label: 'Services', description: 'Dine-in to banquet' },
  { href: '/about', label: 'Our Story', description: 'The kitchen and the people in it' },
  { href: '/gallery', label: 'Gallery', description: 'The room, before and after' },
  { href: '/blog', label: 'Journal', description: 'Royal recipes and kitchen craft' },
  { href: '/contact', label: 'Contact', description: 'Find us, call us, write to us' },
]

export const serviceNav: NavLink[] = services.map((s) => ({
  href: `/services/${s.slug}`,
  label: s.name,
  description: s.short,
}))

/** Feature 3 — strategic internal linking, grouped for the footer. */
export const footerNav: { title: string; links: NavLink[] }[] = [
  {
    title: 'Dining',
    links: [
      { href: '/menu', label: 'Full Menu' },
      { href: '/menu#thali', label: 'Royal Thali' },
      { href: '/reserve', label: 'Book a Table' },
      { href: '/order', label: 'Order Online' },
      { href: '/faq', label: 'Questions' },
    ],
  },
  {
    title: 'Services',
    links: serviceNav.map(({ href, label }) => ({ href, label })),
  },
  {
    title: 'The Restaurant',
    links: [
      { href: '/about', label: 'Our Story' },
      { href: '/about#team', label: 'The Team' },
      { href: '/stories', label: 'Event Stories' },
      { href: '/gallery', label: 'Gallery' },
      { href: '/blog', label: 'Journal' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { href: '/privacy', label: 'Privacy Policy' },
      { href: '/terms', label: 'Terms of Service' },
      { href: '/contact', label: 'Contact Us' },
      { href: '/account', label: 'My Account' },
    ],
  },
]
