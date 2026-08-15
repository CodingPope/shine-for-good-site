import type { Metadata } from 'next'
import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'
import { ScrollReveal } from '@/components/ScrollReveal'
import { ClickTracking } from '@/components/ClickTracking'
import { LocalBusinessSchema } from '@/components/LocalBusinessSchema'
import { SITE_URL } from '@/lib/site'
import { getSiteSettings } from '@/lib/getSiteSettings'
import '../globals.css'

export const metadata: Metadata = {
  title: { default: 'Shine for Good | St. Pete & Tampa Bay Cleaning', template: '%s | Shine for Good' },
  description: 'Residential cleaning, deep cleaning, home organization, and more across St. Pete and Tampa Bay. Every clean gives back to the Marc House in Key West.',
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: 'website',
    siteName: 'Shine for Good',
    url: SITE_URL,
  },
  twitter: {
    card: 'summary_large_image',
  },
}

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  const { phone, email, areas } = await getSiteSettings()

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
        <LocalBusinessSchema />
        <ScrollReveal />
        <ClickTracking />
        <a className="skip" href="#main">Skip to content</a>
        <div className="grain" aria-hidden="true" />
        <Nav phone={phone} />
        <main id="main">{children}</main>
        <Footer phone={phone} email={email} areas={areas} />
        <div className="toast" id="toast" role="status" aria-live="polite" />
      </body>
    </html>
  )
}
