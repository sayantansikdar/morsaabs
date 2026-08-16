import { RoyalLoader } from '@/components/ui/royal'

/** Feature 26 — the route-level loading state. */
export default function Loading() {
  return (
    <div className="container-royal flex min-h-[60svh] items-center justify-center">
      <RoyalLoader />
    </div>
  )
}
