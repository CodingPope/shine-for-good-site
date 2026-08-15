import Link from 'next/link'
import { ServiceIcon, type ServiceIconName } from './ServiceIcon'
import { FaqAccordion, type AccordionItem } from './Accordion'
import { ContactSection } from './ContactSection'
import { getSiteSettings } from '@/lib/getSiteSettings'

export interface RelatedService {
  href: string
  icon: ServiceIconName
  title: string
  desc: string
  price: string
}

export interface ServiceDetailPageProps {
  crumbLabel: string
  eyebrow: string
  title: string
  lede: string
  price: string
  priceSub: string
  priceCtaHref: string
  priceCtaLabel: string
  paragraphs: string[]
  included: string[]
  faqHeading: string
  faq: AccordionItem[]
  related: RelatedService[]
}

export async function ServiceDetailPage({
  crumbLabel, eyebrow, title, lede, price, priceSub, priceCtaHref, priceCtaLabel,
  paragraphs, included, faqHeading, faq, related,
}: ServiceDetailPageProps) {
  const { phone, areas } = await getSiteSettings()
  const phoneDigits = phone.replace(/\D/g, '')
  return (
    <>
      <header className="page-hero">
        <div className="wash wash--a" aria-hidden="true" />
        <div className="wash wash--b" aria-hidden="true" />
        <div className="wrap">
          <div className="page-hero-inner">
            <nav className="crumbs" aria-label="Breadcrumb">
              <Link href="/">Home</Link><i aria-hidden="true">/</i>
              <Link href="/services">Services</Link><i aria-hidden="true">/</i>
              <span aria-current="page">{crumbLabel}</span>
            </nav>
            <p className="eyebrow">{eyebrow}</p>
            <h1>{title}</h1>
            <div className="orn orn--left" aria-hidden="true"><i /></div>
            <p className="lede">{lede}</p>
          </div>
        </div>
      </header>

      <section className="sec">
        <div className="wrap split">
          <div className="rv">
            <div className="stick">
              <div className="pricebox">
                <p className="eyebrow" style={{ marginBottom: 0 }}>Typical price</p>
                <span className="amt">{price}</span>
                <p className="sub">{priceSub}</p>
                <Link className="btn btn--solid" href={priceCtaHref}>{priceCtaLabel}</Link>
                <a className="btn btn--ghost" href={`tel:+1${phoneDigits}`} style={{ width: '100%', justifyContent: 'center', marginTop: '.5rem' }}>Call or text</a>
              </div>
            </div>
          </div>
          <div className="rv rv-d2">
            {paragraphs.map((p, i) => <p key={i} className="lede" style={{ marginBottom: '1.2rem' }}>{p}</p>)}
            <p className="eyebrow" style={{ margin: '2.6rem 0 1.2rem' }}>What is included</p>
            <ul className="incl">
              {included.map(item => <li key={item}>{item}</li>)}
            </ul>
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          <div className="sec-head rv"><p className="eyebrow">Questions</p><h2>{faqHeading}</h2></div>
          <div className="rv"><FaqAccordion items={faq} /></div>
          <p style={{ marginTop: '2rem' }}><Link className="post-more" href="/faq">All questions <i /></Link></p>
        </div>
      </section>

      <section className="sec sec--tint">
        <div className="wrap">
          <div className="sec-head rv"><p className="eyebrow">Also worth a look</p><h2>Related services</h2></div>
          <div className="cards">
            {related.map(r => (
              <Link key={r.href} className="card rv" href={r.href}>
                <ServiceIcon name={r.icon} />
                <h3>{r.title}</h3>
                <p>{r.desc}</p>
                <span className="post-more">{r.price} <i /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <ContactSection businessPhone={phone} areas={areas} />
    </>
  )
}
