import type { Metadata } from 'next'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import { FaqAccordion, type AccordionItem } from '@/components/Accordion'
import { getSiteSettings } from '@/lib/getSiteSettings'
import type { Policy } from '@/payload-types'

export const metadata: Metadata = {
  title: 'Policies',
  description: 'Cancellation, payment, scheduling, and service policies for Shine for Good cleaning in St. Pete and Tampa Bay.',
}

export const revalidate = 60

const FALLBACK_SCHEDULING: AccordionItem[] = [
  { question: 'Cancellation & rescheduling', answer: 'Please give at least 48 hours notice if you need to cancel or reschedule. Your appointment time is reserved specifically for your home, and last-minute changes may result in a cancellation fee. Life happens — just reach out as soon as you know and Chelsea will do her best to work with you.' },
  { question: 'Access to your home', answer: 'You are responsible for making sure Chelsea can get in at the scheduled time. That might mean being home, leaving a key, or sharing a door code. If the home is not accessible when Chelsea arrives, the appointment may be considered a missed visit and subject to a fee to cover the reserved time and travel.' },
  { question: 'Home conditions & safety', answer: 'Chelsea reserves the right to decline or stop a cleaning if a home presents unsafe or hazardous conditions. This includes extreme clutter blocking access to areas that need cleaning, heavy mold, active pest infestations (fleas, roaches, bed bugs, rodents), biohazards, or anything that creates an unsafe working environment. If a clean cannot take place due to conditions beyond what was described at booking, a $100 missed appointment fee may apply to cover the reserved time and travel.' },
]

const FALLBACK_PAYMENT: AccordionItem[] = [
  { question: 'Payment methods & timing', answer: 'Payment is due on the day of service. Accepted methods are Venmo, Zelle, and cash. Receipts or invoices are available on request. For larger jobs — deep cleans, move-in/move-out cleans, and post-construction cleans — a deposit may be required to hold the appointment. Unpaid balances may result in services being paused until the account is settled.' },
  { question: 'Pricing & service changes', answer: 'Quotes are based on the information provided at booking. If the condition of the home differs significantly from what was described, pricing may need to be adjusted. Any additional charges are communicated before extra work begins — nothing gets added to the bill without your agreement first.' },
]

const FALLBACK_DURING: AccordionItem[] = [
  { question: 'Breakage & damage', answer: 'Every care is taken when cleaning your home. Please let Chelsea know ahead of time about anything fragile, sentimental, or delicate. Shine for Good is not responsible for damage caused by pre-existing wear, improperly installed items, or fragile items that were not disclosed before the appointment.' },
  { question: 'Supplies & equipment', answer: 'Chelsea brings professional cleaning supplies and equipment to every appointment. If you have a preference for specific products — for a particular surface, an allergy, or a personal preference — just let her know in advance or leave them out and she will use them.' },
  { question: 'Pets & animals', answer: 'Pets are welcome. Please mention them when you book — especially if they are anxious, reactive, or need to be secured during the visit. Homes with heavy shedding have a $25 add-on since it adds real time to the clean. None of this is a barrier, just useful to know upfront so the visit goes smoothly.' },
]

const FALLBACK_RECURRING: AccordionItem[] = [
  { question: 'Priority scheduling & consistency', answer: 'Recurring clients get priority scheduling and a consistent standing appointment. Chelsea does her best to keep your preferred day and time, though occasional adjustments may be needed for holidays or emergencies. You will always be notified as early as possible.' },
  { question: 'Rescheduling recurring visits', answer: 'Please give at least 48 hours notice if you need to move a recurring appointment. Repeated last-minute cancellations may result in losing your standing time slot. If a visit is skipped or postponed, additional time may be needed at the next visit due to extra buildup — which may affect the price for that appointment.' },
  { question: 'Changes in home condition', answer: 'Recurring rates are built around maintaining a home between visits. If things change significantly — extended gaps, additional people or pets, renovations, or a lot more clutter than usual — the time and pricing may need to be adjusted. Chelsea will always talk through any changes with you before anything shifts.' },
  { question: 'Taking a break from recurring service', answer: 'If you need to pause recurring cleanings, just let Chelsea know. She will do her best to hold your spot, but standing time slots are not guaranteed to stay open during extended pauses. Reaching out early gives you the best chance of picking back up where you left off.' },
]

function toItems(docs: Policy[]): AccordionItem[] {
  return docs.map(d => ({ question: d.question, answer: d.answer }))
}

export default async function PoliciesPage() {
  const { phone } = await getSiteSettings()
  let scheduling = FALLBACK_SCHEDULING
  let payment = FALLBACK_PAYMENT
  let during = FALLBACK_DURING
  let recurring = FALLBACK_RECURRING
  try {
    const payload = await getPayload({ config })
    const result = await payload.find({ collection: 'policies', sort: 'order', limit: 100 })
    if (result.docs.length) {
      scheduling = toItems(result.docs.filter(d => d.category === 'scheduling'))
      payment = toItems(result.docs.filter(d => d.category === 'payment'))
      during = toItems(result.docs.filter(d => d.category === 'during'))
      recurring = toItems(result.docs.filter(d => d.category === 'recurring'))
    }
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
              <span aria-current="page">Policies</span>
            </nav>
            <p className="eyebrow">How we work together</p>
            <h1>Policies</h1>
            <div className="orn orn--left" aria-hidden="true"><i /></div>
            <p className="lede">The practical details on scheduling, payment, cancellations, and everything in between. Questions on anything here? Just ask.</p>
          </div>
        </div>
        <div className="scroll-cue" aria-hidden="true"><span>Scroll</span><i /></div>
      </header>

      <section className="sec">
        <div className="wrap">
          <div className="sec-head rv"><p className="eyebrow">Scheduling</p><h2>Cancellations &amp;<br />rescheduling.</h2></div>
          <div className="rv"><FaqAccordion items={scheduling} /></div>
        </div>
      </section>

      <section className="sec sec--tint">
        <div className="wrap">
          <div className="sec-head rv"><p className="eyebrow">Payment</p><h2>How payment works.</h2></div>
          <div className="rv"><FaqAccordion items={payment} /></div>
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          <div className="sec-head rv"><p className="eyebrow">During the clean</p><h2>Good things to<br />know ahead of time.</h2></div>
          <div className="rv"><FaqAccordion items={during} /></div>
        </div>
      </section>

      <section className="sec sec--tint">
        <div className="wrap">
          <div className="sec-head rv"><p className="eyebrow">Recurring clients</p><h2>For regular clients,<br />a few extra details.</h2></div>
          <div className="rv"><FaqAccordion items={recurring} /></div>
        </div>
      </section>

      <section className="sec sec--tint">
        <div className="wrap cta-band rv">
          <p className="eyebrow">Still have questions?</p>
          <h2>Just reach out.</h2>
          <p className="lede">Chelsea answers messages herself. Text is fastest, usually the same day.</p>
          <div className="cta-actions">
            <Link className="btn btn--solid" href="/contact">Send a message</Link>
            <a className="btn btn--ghost" href={`tel:+1${phone.replace(/\D/g, '')}`}>Call or text {phone}</a>
          </div>
        </div>
      </section>
    </>
  )
}
