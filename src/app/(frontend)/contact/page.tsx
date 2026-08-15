import type { Metadata } from 'next'
import Link from 'next/link'
import { ContactSection } from '@/components/ContactSection'
import { getSiteSettings } from '@/lib/getSiteSettings'

export const metadata: Metadata = {
  title: 'Contact Chelsea',
  description: 'Call or text 305-304-9579 to book house cleaning in St. Petersburg or Tampa. Same day replies most days.',
}

export default async function ContactPage() {
  const { phone, areas } = await getSiteSettings()
  return (
    <>
      <header className="page-hero">
        <div className="wash wash--a" aria-hidden="true" />
        <div className="wash wash--b" aria-hidden="true" />
        <div className="wrap">
          <div className="page-hero-inner">
            <nav className="crumbs" aria-label="Breadcrumb">
              <Link href="/">Home</Link><i aria-hidden="true">/</i>
              <span aria-current="page">Contact</span>
            </nav>
            <p className="eyebrow">Get in touch</p>
            <h1>Let&apos;s find your cleaning day</h1>
            <div className="orn orn--left" aria-hidden="true"><i /></div>
            <p className="lede">Texting is fastest and usually gets an answer the same day. If you would rather talk it through, say so and Chelsea will call you back at a time that works.</p>
          </div>
        </div>
      </header>

      <ContactSection businessPhone={phone} areas={areas} />

      <section className="sec sec--tint">
        <div className="wrap">
          <div className="sec-head rv"><p className="eyebrow">Before you write</p><h2>The three things<br />worth mentioning.</h2></div>
          <div className="steps rv">
            <div className="step"><div><h3>Roughly how big the place is</h3><p>Square footage if you know it, or bedrooms and bathrooms if you do not. That is most of what sets the price.</p></div></div>
            <div className="step"><div><h3>When it was last cleaned properly</h3><p>This decides whether you need a deep clean first or can go straight to recurring visits. An honest answer saves you money.</p></div></div>
            <div className="step"><div><h3>Pets, allergies, problem areas</h3><p>Heavy shedding, fragrance sensitivities, a shower that has gotten away from you. None of it is a problem, all of it is useful to know up front.</p></div></div>
          </div>
        </div>
      </section>
    </>
  )
}
