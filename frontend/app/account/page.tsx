import type { Metadata } from 'next'
import { PageHeader } from '@/components/layout/page-header'
import { AccountForms } from '@/components/forms/account-forms'
import { pageMeta } from '@/lib/seo'

export const metadata: Metadata = pageMeta({
  title: 'My Account — Saved Addresses & Order History',
  description:
    'Sign in to reorder in two taps, keep your delivery addresses saved, and see the reservations you have made with Morsaab’s.',
  path: '/account',
  // A logged-out shell has nothing worth ranking, and the signed-in views are private.
  noIndex: true,
})

export default function AccountPage() {
  return (
    <>
      <PageHeader
        eyebrow="Your Account"
        title="Sign in"
        lede="Saved addresses, past orders and your reservation history — so the next order takes two taps instead of ten."
        trail={[{ name: 'My Account', href: '/account' }]}
      />

      <section className="py-14 sm:py-20">
        <div className="container-royal max-w-xl">
          <AccountForms />
        </div>
      </section>
    </>
  )
}
