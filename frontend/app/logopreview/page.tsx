import { BrandLogo } from '@/components/layout/brand-logo'
export default function P() {
  return (
    <div style={{ margin: 0 }}>
      <div style={{ background: '#1a0d0f', padding: 24 }}><BrandLogo className="w-[470px]" /></div>
      <div style={{ background: '#FDF8EE', padding: 24 }}><BrandLogo className="w-[470px]" /></div>
      <div style={{ background: '#1a0d0f', padding: 24 }}><BrandLogo className="w-[180px]" /></div>
    </div>
  )
}
