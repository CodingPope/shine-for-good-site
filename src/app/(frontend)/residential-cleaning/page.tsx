import type { Metadata } from 'next'
import { ServiceDetailPage } from '@/components/ServiceDetailPage'

export const metadata: Metadata = {
  title: 'Residential House Cleaning in St. Pete & Tampa',
  description: 'Recurring house cleaning in St. Petersburg and Tampa. Every room, every visit, same person each time. From $110. 10% of every service supports adults with disabilities.',
}

export default function ResidentialCleaningPage() {
  return (
    <ServiceDetailPage
      crumbLabel="Residential Cleaning"
      eyebrow="Most popular as a recurring visit"
      title="Residential cleaning in St. Pete and Tampa"
      lede="The regular reset. Every room touched, every surface handled, the house put back the way you like it."
      price="From $110"
      priceSub="Final price depends on your space and what it needs. Fill out the form and Chelsea will get back to you with a custom quote."
      priceCtaHref="/pricing"
      priceCtaLabel="Request a quote"
      paragraphs={[
        'This is the visit that keeps a house from ever getting bad. Kitchen, bathrooms, floors, dusting, beds, trash, all of it, on a standing day you never have to think about again.',
        'The same person cleans your home every time. That matters more than people expect. By the third visit I know which cabinet sticks, which dog hides under the bed, and which corner the last cleaner kept skipping.',
      ]}
      included={[
        'Kitchen counters, sink and backsplash', 'Stovetop, hood and appliance fronts', 'Microwave inside and out',
        'All bathrooms, top to bottom', 'Toilets, tubs, showers and glass', 'Mirrors and chrome polished',
        'Floors vacuumed and mopped', 'Dusting, high and low', 'Ceiling fans and light fixtures',
        'Beds made or linens changed', 'Trash out, liners replaced', 'Doors, switches and handles wiped',
      ]}
      faqHeading="About residential cleaning."
      faq={[
        { question: 'How long does a recurring clean take?', answer: 'A 1,500 square foot home usually runs two and a half to three hours. Bigger homes and homes with more bathrooms take longer. The price does not change based on how fast it goes.' },
        { question: 'Can I skip a visit?', answer: 'Yes. Text at least 24 hours ahead and there is no charge. Your standing slot stays yours.' },
        { question: 'Do I keep the same cleaner?', answer: 'Always. Chelsea cleans every home personally, which is why the schedule is limited.' },
      ]}
      related={[
        { href: '/deep-cleaning', icon: 'deep', title: 'Deep Cleaning', desc: 'Everything in a standard clean, then the parts that get skipped for months. This is the one that resets a house.', price: 'From $180' },
        { href: '/home-organization', icon: 'organize', title: 'Home Organization', desc: 'Pantry, closet, garage, playroom. We sort, we purge, we give everything a home you will still be using in six months.', price: '$60 / hour' },
      ]}
    />
  )
}
