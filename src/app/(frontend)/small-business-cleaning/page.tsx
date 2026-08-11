import type { Metadata } from 'next'
import { ServiceDetailPage } from '@/components/ServiceDetailPage'

export const metadata: Metadata = {
  title: 'Small Business Cleaning in St. Pete & Tampa',
  description: 'Commercial cleaning for small offices, salons, studios and shops in St. Petersburg and Tampa. Custom quote.',
}

export default function SmallBusinessCleaningPage() {
  return (
    <ServiceDetailPage
      crumbLabel="Small Businesses"
      eyebrow="For small commercial spaces"
      title="Small business cleaning in St. Pete and Tampa"
      lede="Offices, salons, studios and shops. Cleaned around your hours so your team walks into a fresh space, not a cleaning crew."
      price="Custom quote"
      priceSub="Every commercial space is different. Reach out and we'll walk through what yours needs and put together a price that makes sense."
      priceCtaHref="/contact"
      priceCtaLabel="Get in touch"
      paragraphs={[
        'Small commercial spaces get quoted badly by big companies, either priced like a house or priced like a hospital. This is priced for what it is: a real space with real hours and a standing schedule.',
        'One consistent person, working after you close, on a checklist you approve. No rotating crews, no different standard every week, no strangers with your alarm code.',
      ]}
      included={[
        'Restrooms fully sanitized', 'Breakroom and kitchenette', 'Entry glass and door handles',
        'Desks and shared surfaces', 'Floors vacuumed and mopped', 'Trash and recycling out',
        'Supply restocking', 'Waiting areas reset', 'Flexible nights and weekends', 'Standing weekly or biweekly',
      ]}
      faqHeading="About small businesses."
      faq={[
        { question: 'What kinds of businesses?', answer: 'Offices under about 5,000 square feet, salons, studios, small clinics, shops and tasting rooms. Anything needing a large crew is not the right fit and I will tell you so.' },
        { question: 'Are you insured for commercial work?', answer: 'Yes, general liability, and a certificate can be sent directly to your landlord or property manager.' },
        { question: 'Can you work around our alarm and access?', answer: 'Yes. Codes and keys are handled the same way as residential clients, and access details are never shared.' },
      ]}
      related={[
        { href: '/residential-cleaning', icon: 'residential', title: 'Residential Cleaning', desc: 'The regular reset. Every room touched, every surface handled, the house put back the way you like it.', price: 'From $125' },
        { href: '/deep-cleaning', icon: 'deep', title: 'Deep Cleaning', desc: 'Everything in a standard clean, then the parts that get skipped for months. This is the one that resets a house.', price: 'From $205' },
      ]}
    />
  )
}
