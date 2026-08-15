import type { Metadata } from 'next'
import Link from 'next/link'
import './globals.css'

export const metadata: Metadata = {
  title: 'Page not found | Shine for Good',
  description: 'That page does not exist. Head back to the Shine for Good home page or get in touch.',
  robots: { index: false, follow: true },
}

export default function RootNotFound() {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#FAF6EE" />
        <meta name="color-scheme" content="light" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Jost:wght@300;400;500&family=Parisienne&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
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
      </body>
    </html>
  )
}
