import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { Media, Review } from '@/payload-types'

export const metadata: Metadata = {
  title: 'About Chelsea Sawyer',
  description: 'Chelsea Sawyer cleans every Shine for Good home personally across St. Petersburg and Tampa, on a deliberately limited schedule.',
}

export const revalidate = 60

const FALLBACK_REVIEWS = [
  { text: "Couldn’t recommend Shine for Good more. They’re incredibly thorough, trustworthy, and always leave my apartment feeling so fresh and cared for.", name: 'Emma I.', location: 'St. Petersburg' },
  { text: 'Chelsea was on time, very thorough, all in all just did a great job. Very personable and reasonable for the amount of work that she did. Definitely would recommend!', name: 'Brad S.', location: 'St. Petersburg' },
  { text: 'Chelsea is on time and very thorough. She brings a variety of cleaning products with her. She knows how to clean!', name: 'Sheila M.', location: 'St. Petersburg' },
]

export default async function AboutPage() {
  const payload = await getPayload({ config })

  let photo: Media | null = null
  let phone = '305-304-9579'
  let reviews: (Review | (typeof FALLBACK_REVIEWS)[number])[] = FALLBACK_REVIEWS
  try {
    const [settings, reviewsResult] = await Promise.all([
      payload.findGlobal({ slug: 'site-settings' }),
      payload.find({ collection: 'reviews', sort: 'order', limit: 6 }),
    ])
    photo = (settings.aboutPhoto as Media) ?? null
    if (settings.contact?.phone) phone = settings.contact.phone
    if (reviewsResult.docs.length) reviews = reviewsResult.docs
  } catch {
    // fall back to the defaults above
  }

  return (
    <>
      <header className="page-hero">
        <div className="wash wash--a" aria-hidden="true" />
        <div className="wash wash--b" aria-hidden="true" />
        <div className="wrap">
          <div className="page-hero-inner">
            <nav className="crumbs" aria-label="Breadcrumb">
              <Link href="/">Home</Link><i aria-hidden="true">/</i>
              <span aria-current="page">About</span>
            </nav>
            <p className="eyebrow">The person doing the work</p>
            <h1>Hi, I&apos;m Chelsea</h1>
            <div className="orn orn--left" aria-hidden="true"><i /></div>
            <p className="lede">One person, a limited schedule, and a standard that does not move depending on how the day is going.</p>
          </div>
        </div>
      </header>

      <section className="sec">
        <div className="wrap about">
          <div className="about-photo rv">
            {photo?.url ? (
              <Image src={photo.url} alt={photo.alt || 'Chelsea Sawyer'} fill style={{ objectFit: 'cover' }} />
            ) : (
              <>
                <div className="ph" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" /></svg>
                </div>
                <span className="ph-hint">Portrait of Chelsea</span>
              </>
            )}
          </div>
          <div className="rv rv-d2">
            <p className="lede">I started Shine for Good because I wanted the work I do every day to be worth something past the invoice. Cleaning is honest work. Done right, it gives someone back their weekend, their headspace, and the version of their home they actually pictured when they moved in.</p>
            <p className="body-s" style={{ marginTop: '1.2rem' }}>I clean every home myself. That means I know which cabinet sticks, which dog hides, and which corner the last person skipped. It also means I book a limited number of homes each week, so the ones I take on get real attention rather than a rushed forty five minutes.</p>
            <p className="body-s" style={{ marginTop: '1rem' }}>The ten percent is not a campaign. Adults with disabilities are the reason I got into service work in the first place, and giving part of every job back is the simplest way I have found to keep that connected to how I make a living.</p>
            <p className="sig">Chelsea</p>
          </div>
        </div>
      </section>

      <section className="sec sec--tint">
        <div className="wrap">
          <div className="sec-head rv"><p className="eyebrow">In their words</p><h2>What clients say.</h2></div>
          <div className="quotes">
            {reviews.map((r, i) => (
              <figure key={i} className={`quote rv rv-d${i + 1}`} style={{ margin: 0 }}>
                <p>&ldquo;{r.text}&rdquo;</p>
                <cite>{r.name}<span>{r.location}</span></cite>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="sec sec--tint">
        <div className="wrap cta-band rv">
          <p className="eyebrow">Next step</p>
          <h2>Ready to get started?</h2>
          <p className="lede">Send a message or give Chelsea a call. She handles every booking herself and will get back to you the same day.</p>
          <div className="cta-actions">
            <Link className="btn btn--solid" href="/pricing">Get a quote</Link>
            <a className="btn btn--ghost" href={`tel:+1${phone.replace(/\D/g, '')}`}>Call or text {phone}</a>
          </div>
        </div>
      </section>
    </>
  )
}
