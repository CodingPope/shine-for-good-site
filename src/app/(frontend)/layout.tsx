import type { Metadata } from 'next'
import Script from 'next/script'
import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'
import { ScrollReveal } from '@/components/ScrollReveal'
import '../globals.css'

export const metadata: Metadata = {
  title: { default: 'Shine for Good | St. Pete & Tampa Bay Cleaning', template: '%s | Shine for Good' },
  description: 'Residential cleaning, deep cleaning, home organization, and more across St. Pete and Tampa Bay. Every clean gives back to the Marc House in Key West.',
  metadataBase: new URL('https://www.shine-for-good.com'),
}

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
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
        <ScrollReveal />
        <a className="skip" href="#main">Skip to content</a>
        <div className="grain" aria-hidden="true" />
        <Nav />
        <main id="main">{children}</main>
        <Footer />
        <div className="toast" id="toast" role="status" aria-live="polite" />
        <Script src="/assets/site.js" strategy="afterInteractive" />
      </body>
    </html>
  )
}
