import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Shine for Good | St. Pete & Tampa Bay Cleaning',
}

export default function HomePage() {
  return (
    <>
      <header className="hero">
        <div className="wash wash--a" aria-hidden="true" />
        <div className="wash wash--b" aria-hidden="true" />
        <div className="wrap hero-inner">
          <div className="hero-text load-fade ld1">
            <div className="orn" aria-hidden="true"><i /></div>
          </div>
          <div className="load-fade ld2">
            <h1 style={{ margin: 0 }}>
              <span className="shine">Shine</span>
              <span className="row2">
                <span className="for">for</span>
                <span className="good">Good</span>
              </span>
            </h1>
          </div>
          <div className="load-fade ld3"><div className="orn" aria-hidden="true"><i /></div></div>
          <p className="hero-tag load-fade ld3">Where every clean makes a difference.</p>
          <p className="hero-sub load-fade ld4">
            Creating clean, calm spaces that <em>feel good</em> to come home to.
          </p>
          <div className="hero-actions load-fade ld5">
            <Link className="btn btn--solid" href="/pricing">Get a quote</Link>
            <a className="btn btn--ghost" href="tel:+13053049579">Call or text Chelsea</a>
          </div>
          <p className="hero-note load-fade ld6">
            <b>Every clean gives back to the Marc House in Key West</b>
          </p>
        </div>
        <div className="scroll-cue" aria-hidden="true"><span>Scroll</span><i /></div>
      </header>

      {/* Services teaser */}
      <section className="sec" id="services">
        <div className="wrap">
          <div className="sec-head rv">
            <p className="eyebrow">What we do</p>
            <h2>Every service,<br />spelled out clearly.</h2>
            <p className="lede">Tap any service to see exactly what&rsquo;s included. Not sure which fits? Just reach out.</p>
          </div>
          <div className="cards">
            {[
              { href: '/residential-cleaning', title: 'Residential Cleaning', desc: 'The regular reset. Every room touched, every surface handled.', price: 'From $110' },
              { href: '/deep-cleaning', title: 'Deep Cleaning', desc: 'Everything in a standard clean, then the parts that get skipped for months.', price: 'From $180' },
              { href: '/home-organization', title: 'Home Organization', desc: 'Pantry, closet, garage, playroom. A system you can actually keep.', price: '$60 / hour' },
              { href: '/move-in-move-out', title: 'Move-In / Move-Out', desc: 'For the day the house is empty and every mark is visible.', price: 'From $225' },
              { href: '/small-business-cleaning', title: 'Small Businesses', desc: 'Offices, salons, studios and shops. Cleaned around your hours.', price: 'Custom quote' },
            ].map(s => (
              <Link key={s.href} className="card rv" href={s.href}>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                <span className="post-more">{s.price} <i /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="sec sec--tint">
        <div className="wrap">
          <div className="sec-head rv"><p className="eyebrow">In their words</p><h2>What clients say<br />after the first visit.</h2></div>
          <div className="quotes">
            {[
              { text: "Couldn\u2019t recommend Shine for Good more. They\u2019re incredibly thorough, trustworthy, and always leave my apartment feeling so fresh and cared for.", name: 'Emma I.', loc: 'St. Petersburg' },
              { text: 'Chelsea was on time, very thorough, all in all just did a great job. Very personable and reasonable for the amount of work that she did. Definitely would recommend!', name: 'Brad S.', loc: 'St. Petersburg' },
              { text: 'Chelsea is on time and very thorough. She brings a variety of cleaning products with her. She knows how to clean!', name: 'Sheila M.', loc: 'St. Petersburg' },
            ].map((r, i) => (
              <figure key={i} className={`quote rv rv-d${i + 1}`} style={{ margin: 0 }}>
                <p>&ldquo;{r.text}&rdquo;</p>
                <cite>{r.name}<span>{r.loc}</span></cite>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="sec sec--tint">
        <div className="wrap cta-band rv">
          <p className="eyebrow">Ready to get started?</p>
          <h2>Ready to get started?</h2>
          <p className="lede">Send a message or give Chelsea a call. She handles every booking herself and will get back to you the same day.</p>
          <div className="cta-actions">
            <Link className="btn btn--solid" href="/contact">Send a message</Link>
            <a className="btn btn--ghost" href="tel:+13053049579">Call or text 305-304-9579</a>
          </div>
        </div>
      </section>
    </>
  )
}
