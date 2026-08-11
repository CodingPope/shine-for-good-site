import type { Metadata } from 'next'
import Link from 'next/link'
import { PricingEstimator } from '@/components/PricingEstimator'
import { FaqAccordion, type AccordionItem } from '@/components/Accordion'
import { ContactSection } from '@/components/ContactSection'

export const metadata: Metadata = {
  title: 'Cleaning Prices in St. Pete & Tampa | Instant Estimate',
  description: 'See what house cleaning costs in St. Petersburg and Tampa. Move five dials and get a real price range in under a minute. No email required.',
}

const FAQS: AccordionItem[] = [
  { question: 'How much does house cleaning cost in St. Pete and Tampa?', answer: 'A standard clean starts from $125 for a small studio. A deep clean starts from $205. Square footage, bathroom count and the current condition of the home move the number. Fill out the quote builder and Chelsea will reach out with a custom price.' },
  { question: 'How do I pay?', answer: 'Venmo, Zelle or cash, due on the day of service.' },
  { question: 'How far ahead do I need to book?', answer: 'One to two weeks is typical for a first deep clean. Recurring visits get a standing day and time so you never have to think about it again. Move-out cleans can sometimes be fit in within a few days, so it is always worth asking.' },
  { question: 'What if something is not right?', answer: 'Send a text within 24 hours and that area gets re-cleaned at no charge. No forms, no argument, no awkward conversation.' },
]

export default function PricingPage() {
  return (
    <>
      <header className="page-hero">
        <div className="wash wash--a" aria-hidden="true" />
        <div className="wash wash--b" aria-hidden="true" />
        <div className="wrap">
          <div className="page-hero-inner">
            <nav className="crumbs" aria-label="Breadcrumb">
              <Link href="/">Home</Link><i aria-hidden="true">/</i>
              <span aria-current="page">Pricing</span>
            </nav>
            <p className="eyebrow">Pricing</p>
            <h1>What cleaning actually costs around here</h1>
            <div className="orn orn--left" aria-hidden="true"><i /></div>
            <p className="lede">Tell us about your space, pick your add-ons, and send your details to Chelsea for a custom quote. She will reach out directly.</p>
          </div>
        </div>
      </header>

      <PricingEstimator />

      <section className="sec sec--tint">
        <div className="wrap">
          <div className="sec-head rv">
            <p className="eyebrow">How the quote is built</p>
            <h2>Nothing here is a mystery.</h2>
            <p className="lede">Square footage sets the base. Bathrooms and bedrooms past the standard add a little. Deep cleans and move-outs take longer so they cost more. Booking regularly takes cost out, because a maintained home is faster to clean than a neglected one. Chelsea confirms the final price after reviewing the details you send — it never changes on cleaning day without your approval.</p>
          </div>
          <div className="steps rv">
            <div className="step"><div><h3>Base rate by size</h3><p>Charged per square foot with a minimum, because a 700 square foot condo still takes a full setup and pack-down.</p></div></div>
            <div className="step"><div><h3>Rooms that take real time</h3><p>Bathrooms past two and bedrooms past three add to the base. These are the rooms that actually change how long a visit runs.</p></div></div>
            <div className="step"><div><h3>Depth of clean</h3><p>A deep clean runs about one and a half times a standard visit. A move-out runs a little higher again, because every cabinet and appliance gets opened.</p></div></div>
            <div className="step"><div><h3>Frequency discount</h3><p>Weekly, biweekly and monthly clients pay less per visit. That is not a promotion, it is just what a maintained home costs to clean.</p></div></div>
            <div className="step"><div><h3>Ten percent, off the top</h3><p>Whatever the final number is, a tenth of it is already committed to adults with disabilities in Tampa Bay before anything else comes out.</p></div></div>
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          <div className="sec-head rv"><p className="eyebrow">Questions</p><h2>About pricing<br />and booking.</h2></div>
          <div className="rv"><FaqAccordion items={FAQS} /></div>
        </div>
      </section>

      <ContactSection showEstimateLink={false} />
    </>
  )
}
