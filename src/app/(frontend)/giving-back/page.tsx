import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Giving Back',
  description: 'Shine for Good gives back with every clean. Learn about the Marc House in Key West and why supporting this community is at the heart of what we do.',
}

export default function GivingBackPage() {
  return (
    <>
      <header className="page-hero">
        <div className="wash wash--a" aria-hidden="true" />
        <div className="wash wash--b" aria-hidden="true" />
        <div className="wrap">
          <div className="page-hero-inner">
            <nav className="crumbs" aria-label="Breadcrumb">
              <Link href="/">Home</Link><i aria-hidden="true">/</i>
              <span aria-current="page">Giving back</span>
            </nav>
            <p className="eyebrow">The whole point</p>
            <h1>Me helping you, you helping others</h1>
            <div className="orn orn--left" aria-hidden="true"><i /></div>
            <p className="lede">Every clean includes a giving-back commitment. Here is the organization we support and why it matters to us.</p>
          </div>
        </div>
      </header>

      <section className="sec">
        <div className="wrap split">
          <div className="rv">
            <div className="stick">
              <div className="pricebox" style={{ textAlign: 'center' }}>
                <div className="ba-img" style={{ height: 240, borderRadius: '.8rem', overflow: 'hidden', background: '#e8e4dc', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.2rem' }}>
                  <div className="ph" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><rect x="3" y="5" width="18" height="14" rx="2" /><circle cx="12" cy="12" r="3.4" /><path d="M7 5l1.6-2h6.8L17 5" /></svg>
                  </div>
                </div>
                <p className="sub">The Marc House, Key West, FL</p>
                <Link className="btn btn--solid" href="/contact">Book a clean, give back</Link>
              </div>
            </div>
          </div>
          <div className="rv rv-d2">
            <p className="lede">The Marc House in Key West is a nonprofit that supports adults with developmental disabilities — providing housing, job coaching, and community so people can live as independently as possible. It is the kind of place that quietly does essential work without a lot of fanfare.</p>
            <p className="lede" style={{ marginTop: '1.2rem' }}>A portion of every service goes directly to the Marc House. It comes out of the service price before supplies, before fuel, before anything else. That ordering matters — businesses that give from what is left at the end of the year usually find there is nothing left.</p>
            <p className="lede" style={{ marginTop: '1.2rem' }}>You get a home that feels calm again. Someone else gets a little more of the support they should have had all along. That is the trade, and it is the reason this business exists at all.</p>
          </div>
        </div>
      </section>

      <section className="sec sec--tint">
        <div className="wrap">
          <div className="sec-head rv"><p className="eyebrow">How it works</p><h2>Three things that<br />keep it honest.</h2></div>
          <div className="steps rv">
            <div className="step"><div><h3>From every clean</h3><p>A portion of every service is set aside before any cost of doing business comes out of it. First, every time.</p></div></div>
            <div className="step"><div><h3>The Marc House, Key West</h3><p>It goes to a single place we believe in — the Marc House, a nonprofit supporting adults with developmental disabilities in Key West, not to a national fund.</p></div></div>
            <div className="step"><div><h3>Ask any time</h3><p>Want to know more about where it goes before you book? Text and ask. It is a fair question and it gets a straight answer.</p></div></div>
          </div>
        </div>
      </section>

      <section className="sec sec--tint">
        <div className="wrap cta-band rv">
          <p className="eyebrow">Next step</p>
          <h2>Book a clean, give back</h2>
          <p className="lede">Every service on the schedule helps the Marc House keep doing its work.</p>
          <div className="cta-actions">
            <Link className="btn btn--solid" href="/pricing">Get a quote</Link>
            <a className="btn btn--ghost" href="tel:+13053049579">Call or text 305-304-9579</a>
          </div>
        </div>
      </section>
    </>
  )
}
