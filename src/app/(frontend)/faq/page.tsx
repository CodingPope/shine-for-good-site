import type { Metadata } from 'next'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import { FaqAccordion, type AccordionItem } from '@/components/Accordion'
import { getSiteSettings } from '@/lib/getSiteSettings'

export const metadata: Metadata = {
  title: 'Cleaning FAQ',
  description: 'Answers on pricing, booking, supplies, insurance, pets, payment and service areas for house cleaning in St. Petersburg and Tampa.',
}

export const revalidate = 60

const FALLBACK_FAQS: AccordionItem[] = [
  { question: 'Do I need to be home during the cleaning?', answer: 'No. Most clients give a door code or leave a key. You are welcome to stay home if you prefer, and plenty of people work through it. Either way is normal.' },
  { question: 'Do you bring your own cleaning supplies?', answer: 'Yes, everything is included. Products are low fragrance and safe around kids and pets. If you have something you prefer for a particular surface, leave it on the counter and it will be used instead.' },
  { question: 'How much does house cleaning cost in St. Pete and Tampa?', answer: 'A standard clean starts from $125 for a small studio. A deep clean starts from $205. Square footage, bathroom count and the current condition of the home move the number. Fill out the quote builder and Chelsea will reach out with a custom price.' },
  { question: 'Are you insured?', answer: 'Yes. Shine for Good carries general liability insurance, and proof of coverage is available any time you want to see it.' },
  { question: 'What does the 10% giving actually mean?', answer: 'Ten percent of what you pay for every single service goes to the Marc House in Key West, a nonprofit supporting adults with developmental disabilities. It comes off the top of the service price, and it is the whole reason this business exists.' },
  { question: 'How far ahead do I need to book?', answer: 'One to two weeks is typical for a first deep clean. Recurring visits get a standing day and time so you never have to think about it again. Move-out cleans can sometimes be fit in within a few days, so it is always worth asking.' },
  { question: 'What if something is not right?', answer: 'Send a text within 24 hours and that area gets re-cleaned at no charge. No forms, no argument, no awkward conversation.' },
  { question: 'How do I pay?', answer: 'Venmo, Zelle or cash, due on the day of service.' },
  { question: 'Do you clean homes with pets?', answer: 'Yes, and it is worth mentioning when you book. Heavy shedding adds time, which is why it is a $25 add-on rather than a surprise.' },
  { question: 'What areas do you serve?', answer: 'St. Petersburg and Tampa, plus Clearwater, Gulfport, St. Pete Beach, Treasure Island, Pinellas Park, Seminole, South Tampa and Kenneth City. If you are just outside that, ask anyway.' },
  { question: 'How should I prepare my home before a cleaning?', answer: 'The more accessible your home is, the better the clean. Before your appointment, it helps to pick up clothing and personal items from floors and surfaces, clear countertops, and put away anything fragile or valuable. Chelsea is there to clean, not to sort through belongings — a tidy space means more time actually spent cleaning and detailing.' },
  { question: 'Do you offer laundry as an add-on?', answer: 'Yes. Wash and fold is available for $25. Just mention it when you reach out so enough time can be built into the visit.' },
  { question: 'What is the cancellation policy?', answer: 'Please give at least 48 hours notice if you need to cancel or reschedule. Your time slot is held specifically for your home, and last-minute cancellations may be subject to a fee. Life happens — just reach out as soon as you know and we will work with you.' },
  { question: 'Can you clean inside the fridge or oven?', answer: 'Yes, both are available as add-ons for $45 each. Just let Chelsea know when you book so the time is built into the appointment.' },
  { question: 'How often should I schedule a cleaning?', answer: 'Every two weeks works well for most homes — keeps things in good shape without feeling excessive. Weekly is a great fit for busier households with kids or pets. Monthly is solid if you stay on top of things yourself and just want a thorough reset. Chelsea is happy to talk through what makes the most sense for your space.' },
  { question: 'Are tips expected?', answer: 'Never required, always appreciated. Referrals to friends and neighbors mean just as much — word of mouth is how a small local business grows.' },
  { question: 'What makes Shine for Good different from other cleaning services?', answer: 'Chelsea cleans every home herself — not a rotating crew. That means you get the same person every time, someone who actually knows your space. And a portion of every clean goes to the Marc House in Key West, so your home getting cleaner makes a real difference beyond just the invoice.' },
]

export default async function FaqPage() {
  const { phone } = await getSiteSettings()
  let faqs: AccordionItem[] = FALLBACK_FAQS
  try {
    const payload = await getPayload({ config })
    const result = await payload.find({ collection: 'faqs', sort: 'order', limit: 100 })
    if (result.docs.length) faqs = result.docs.map(f => ({ question: f.question, answer: f.answer }))
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
              <span aria-current="page">Questions</span>
            </nav>
            <p className="eyebrow">Good to know</p>
            <h1>Questions people ask first</h1>
            <div className="orn orn--left" aria-hidden="true"><i /></div>
            <p className="lede">If the answer you need is not here, text and ask. Chelsea answers these herself.</p>
          </div>
        </div>
        <div className="scroll-cue" aria-hidden="true"><span>Scroll</span><i /></div>
      </header>

      <section className="sec">
        <div className="wrap">
          <div className="rv"><FaqAccordion items={faqs} /></div>
        </div>
      </section>

      <section className="sec sec--tint">
        <div className="wrap cta-band rv">
          <p className="eyebrow">Still have questions?</p>
          <h2>Just reach out.</h2>
          <p className="lede">Chelsea answers messages herself. Text is fastest, usually same day. Or <Link href="/policies" style={{ color: 'inherit', textDecoration: 'underline' }}>read through the full policies</Link> for the practical details on scheduling and payment.</p>
          <div className="cta-actions">
            <Link className="btn btn--solid" href="/contact">Send a message</Link>
            <a className="btn btn--ghost" href={`tel:+1${phone.replace(/\D/g, '')}`}>Call or text {phone}</a>
          </div>
        </div>
      </section>
    </>
  )
}
