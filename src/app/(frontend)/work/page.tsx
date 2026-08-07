import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import Link from 'next/link'
import Image from 'next/image'
import { BeforeAfterSlider } from '@/components/BeforeAfterSlider'

export const metadata: Metadata = {
  title: 'Our Work',
  description: 'Before and after photos from real Shine for Good cleans across St. Pete and Tampa Bay.',
}

export const revalidate = 60

export default async function WorkPage() {
  let baItems: any[] = []
  let gallery: any[] = []
  try {
    const payload = await getPayload({ config })
    const [baResult, galleryResult] = await Promise.all([
      payload.find({ collection: 'before-after', sort: 'order', limit: 20, depth: 1 }),
      payload.find({ collection: 'work-gallery', sort: 'order', limit: 12, depth: 1 }),
    ])
    baItems = baResult.docs
    gallery = galleryResult.docs
  } catch {
    baItems = []
    gallery = []
  }

  const featured = baItems.find(item => item.featured) || baItems[0] || null
  const featuredBefore = (featured?.beforeImage as any) ?? null
  const featuredAfter = (featured?.afterImage as any) ?? null

  const reviews = [
    { text: "Couldn\u2019t recommend Shine for Good more. They\u2019re incredibly thorough, trustworthy, and always leave my apartment feeling so fresh and cared for.", name: 'Emma I.', location: 'St. Petersburg' },
    { text: 'Chelsea was on time, very thorough, all in all just did a great job. Very personable and reasonable for the amount of work that she did. Definitely would recommend!', name: 'Brad S.', location: 'St. Petersburg' },
    { text: 'Chelsea is on time and very thorough. She brings a variety of cleaning products with her. She knows how to clean!', name: 'Sheila M.', location: 'St. Petersburg' },
  ]

  return (
    <>
      <header className="page-hero">
        <div className="wash wash--a" aria-hidden="true" />
        <div className="wash wash--b" aria-hidden="true" />
        <div className="wrap">
          <div className="page-hero-inner">
            <nav className="crumbs" aria-label="Breadcrumb">
              <Link href="/">Home</Link><i aria-hidden="true">/</i>
              <span aria-current="page">Our work</span>
            </nav>
            <p className="eyebrow">The proof</p>
            <h1>Before and after.</h1>
            <div className="orn orn--left" aria-hidden="true"><i /></div>
            <p className="lede">Real homes, real cleans. Drag the slider to compare.</p>
          </div>
        </div>
      </header>

      {/* Hero before/after slider */}
      <section className="sec">
        <div className="wrap">
          {featured && featuredBefore?.url && featuredAfter?.url ? (
            <div className="rv">
              <BeforeAfterSlider
                beforeSrc={featuredBefore.url}
                afterSrc={featuredAfter.url}
                beforeAlt={featuredBefore.alt || 'Before'}
                afterAlt={featuredAfter.alt || 'After'}
              />
              {featured.caption && (
                <p style={{ textAlign: 'center', marginTop: '1rem', opacity: .7, fontSize: '.9rem' }}>
                  {featured.caption}{featured.location ? ` — ${featured.location}` : ''}
                </p>
              )}
            </div>
          ) : (
            <div className="rv" style={{ textAlign: 'center', padding: '4rem 0' }}>
              <p className="lede">Photos coming soon. <Link href="/contact">Reach out</Link> to learn more.</p>
            </div>
          )}

          {/* Additional before/afters */}
          {baItems.length > 1 && (
            <div className="rv rv-d2" style={{ marginTop: 'clamp(1.6rem,3vw,2.4rem)' }}>
              <div className="gal">
                {baItems.slice(1).map(item => {
                  const bef = item.beforeImage as Media | null
                  const aft = item.afterImage as Media | null
                  if (!bef?.url || !aft?.url) return null
                  return (
                    <div key={item.id} className="gal-item">
                      <Image src={aft.url} alt={aft.alt || item.title} width={400} height={300} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      {item.caption && <span className="gal-cap">{item.caption}{item.location ? `, ${item.location}` : ''}</span>}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Gallery grid */}
          {gallery.length > 0 && (
            <div className="rv rv-d2" style={{ marginTop: 'clamp(1.6rem,3vw,2.4rem)' }}>
              <div className="gal">
                {gallery.map(item => {
                  const photo = item.photo as Media | null
                  if (!photo?.url) return null
                  return (
                    <div key={item.id} className="gal-item">
                      <Image src={photo.url} alt={photo.alt || item.caption || ''} width={400} height={300} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      {item.caption && <span className="gal-cap">{item.caption}{item.location ? `, ${item.location}` : ''}</span>}
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Reviews */}
      <section className="sec sec--tint">
        <div className="wrap">
          <div className="sec-head rv">
            <p className="eyebrow">In their words</p>
            <h2>What clients say<br />after the first visit.</h2>
          </div>
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
          <p className="eyebrow">Ready to get started?</p>
          <h2>Ready to get started?</h2>
          <p className="lede">Send a message or give Chelsea a call. She handles every booking herself.</p>
          <div className="cta-actions">
            <Link className="btn btn--solid" href="/contact">Send a message</Link>
            <a className="btn btn--ghost" href="tel:+13053049579">Call or text 305-304-9579</a>
          </div>
        </div>
      </section>
    </>
  )
}
