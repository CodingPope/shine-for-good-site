import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Page not found',
  description: 'That page does not exist. Head back to the Shine for Good home page or get in touch.',
  robots: { index: false, follow: true },
}

export default function NotFound() {
  return (
    <header className="page-hero">
      <div className="wash wash--a" aria-hidden="true" />
      <div className="wash wash--b" aria-hidden="true" />
      <div className="wrap">
        <div className="page-hero-inner">
          <p className="eyebrow">Page not found</p>
          <h1>That page doesn&apos;t exist</h1>
          <div className="orn orn--left" aria-hidden="true"><i /></div>
          <p className="lede">The link might be old, or the address might be off by a letter. Here are a couple of places to go instead.</p>
          <div className="cta-actions" style={{ marginTop: '2rem' }}>
            <Link className="btn btn--solid" href="/">Back to home</Link>
            <Link className="btn btn--ghost" href="/contact">Contact Chelsea</Link>
          </div>
        </div>
      </div>
    </header>
  )
}
