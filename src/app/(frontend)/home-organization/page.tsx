import type { Metadata } from 'next'
import { ServiceDetailPage } from '@/components/ServiceDetailPage'

export const metadata: Metadata = {
  title: 'Home Organization in St. Pete & Tampa',
  description: 'Pantry, closet, garage and playroom organization in St. Petersburg and Tampa. Billed hourly at $60/hour.',
}

export default function HomeOrganizationPage() {
  return (
    <ServiceDetailPage
      crumbLabel="Home Organization"
      eyebrow="Billed hourly"
      title="Home organization in St. Pete and Tampa"
      lede="Pantry, closet, garage, playroom. We sort, we purge, we give everything a home you will still be using in six months."
      price="$60 / hour"
      priceSub="Billed by the hour because every space is different. Reach out and we'll talk through what yours needs."
      priceCtaHref="/contact"
      priceCtaLabel="Get in touch"
      paragraphs={[
        'Organizing is not the same job as cleaning and it should not be priced like it. This is billed hourly because the honest answer to how long a pantry takes is that it depends entirely on what is in the pantry.',
        'The goal is a system you can actually keep. Beautiful bins that need forty minutes a week to maintain are a failure. If it does not survive a bad Tuesday, it was not the right system.',
      ]}
      included={[
        'Sort, group and declutter', 'Donation pile bagged and hauled', 'Containers sized to the space',
        'Clear labeling that lasts', 'Pantry and food rotation', 'Closet reset by category',
        'Garage and storage zones', 'Kids rooms and toy systems', 'Paperwork sorted and filed',
        'A simple plan to keep it that way',
      ]}
      faqHeading="About home organization."
      faq={[
        { question: 'Do I have to be there?', answer: 'For at least the sorting part, yes. Keep-or-donate decisions are yours to make. Once categories are set you are free to disappear.' },
        { question: 'Do you supply the bins?', answer: 'I will measure and send you a shopping list with sizes, or shop for them at cost if you would rather not. Buying containers before sorting is the most common way this goes wrong.' },
        { question: 'What happens to donations?', answer: 'Bagged, loaded, and dropped off locally. You get the receipt.' },
      ]}
      related={[
        { href: '/residential-cleaning', icon: 'residential', title: 'Residential Cleaning', desc: 'The regular reset. Every room touched, every surface handled, the house put back the way you like it.', price: 'From $110' },
        { href: '/move-in-move-out', icon: 'move', title: 'Move-In / Move-Out', desc: 'For the day the house is empty and every mark is visible. Landlords, buyers and inspectors all look at the same places, and so do we.', price: 'From $225' },
      ]}
    />
  )
}
