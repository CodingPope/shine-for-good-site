import type { Metadata } from 'next'
import Link from 'next/link'
import { ServiceIcon } from '@/components/ServiceIcon'
import { getSiteSettings } from '@/lib/getSiteSettings'

export const metadata: Metadata = {
  title: 'Cleaning Services in St. Pete & Tampa',
  description: 'Residential cleaning, deep cleaning, home organization, move-in and move-out cleaning, and small business cleaning across St. Petersburg and Tampa. See what each includes.',
}

const SERVICES = [
  { href: '/residential-cleaning', icon: 'residential' as const, title: 'Residential Cleaning', desc: 'The regular reset. Every room touched, every surface handled, the house put back the way you like it.', price: 'From $125' },
  { href: '/deep-cleaning', icon: 'deep' as const, title: 'Deep Cleaning', desc: 'Everything in a standard clean, then the parts that get skipped for months. This is the one that resets a house.', price: 'From $205' },
  { href: '/home-organization', icon: 'organize' as const, title: 'Home Organization', desc: 'Pantry, closet, garage, playroom. We sort, we purge, we give everything a home you will still be using in six months.', price: '$60 / hour' },
  { href: '/move-in-move-out', icon: 'move' as const, title: 'Move-In / Move-Out', desc: 'For the day the house is empty and every mark is visible. Landlords, buyers and inspectors all look at the same places, and so do we.', price: 'From $200' },
  { href: '/small-business-cleaning', icon: 'biz' as const, title: 'Small Businesses', desc: 'Offices, salons, studios and shops. Cleaned around your hours so your team walks into a fresh space, not a cleaning crew.', price: 'Custom quote' },
  { href: '/contact', icon: 'post' as const, title: 'Post-Construction Clean', desc: 'New build or major renovation? We handle the dust, debris, and grime left behind so the space is actually ready to move into.', price: 'Custom quote' },
  { href: '/contact', icon: 'airbnb' as const, title: 'Airbnb & Short-Term Rentals', desc: 'Quick turnover cleans between guests. Linens, restocking, full reset — so your listing stays five-star ready every time.', price: 'Custom quote' },
]

export default async function ServicesPage() {
  const { phone } = await getSiteSettings()
  return (
    <>
      <header className="page-hero">
        <div className="wash wash--a" aria-hidden="true" />
        <div className="wash wash--b" aria-hidden="true" />
        <div className="wrap">
          <div className="page-hero-inner">
            <nav className="crumbs" aria-label="Breadcrumb">
              <Link href="/">Home</Link><i aria-hidden="true">/</i>
              <span aria-current="page">Services</span>
            </nav>
            <p className="eyebrow">What we do</p>
            <h1>Cleaning services in St. Pete and Tampa Bay</h1>
            <div className="orn orn--left" aria-hidden="true"><i /></div>
            <p className="lede">Seven services, each described in full. If you are not sure which one you need, fill out the quote builder and Chelsea will match you up.</p>
          </div>
        </div>
      </header>

      <section className="sec">
        <div className="wrap">
          <div className="cards">
            {SERVICES.map(s => (
              <Link key={s.title} className="card rv" href={s.href}>
                <ServiceIcon name={s.icon} />
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                <span className="post-more">{s.price} <i /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="sec sec--tint">
        <div className="wrap cta-band rv">
          <p className="eyebrow">Next step</p>
          <h2>Not sure which one you need?</h2>
          <p className="lede">Answer a few questions and the quote builder will help Chelsea put together the right price for your space.</p>
          <div className="cta-actions">
            <Link className="btn btn--solid" href="/pricing">Get a quote</Link>
            <a className="btn btn--ghost" href={`tel:+1${phone.replace(/\D/g, '')}`}>Call or text {phone}</a>
          </div>
        </div>
      </section>
    </>
  )
}
