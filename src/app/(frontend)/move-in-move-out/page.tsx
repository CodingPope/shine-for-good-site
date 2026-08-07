import type { Metadata } from 'next'
import { ServiceDetailPage } from '@/components/ServiceDetailPage'

export const metadata: Metadata = {
  title: 'Move-In / Move-Out Cleaning in St. Pete & Tampa',
  description: 'Move-in and move-out cleaning in St. Petersburg and Tampa. Inside cabinets, oven, fridge, closets and floors. From $225.',
}

export default function MoveInMoveOutPage() {
  return (
    <ServiceDetailPage
      crumbLabel="Move-In / Move-Out"
      eyebrow="For empty houses"
      title="Move-in and move-out cleaning"
      lede="For the day the house is empty and every mark is visible. Landlords, buyers and inspectors all look at the same places, and so do we."
      price="From $225"
      priceSub="Final price depends on your space and what it needs. Fill out the form and Chelsea will get back to you with a custom quote."
      priceCtaHref="/pricing"
      priceCtaLabel="Request a quote"
      paragraphs={[
        'Deposits are rarely lost over big things. They are lost over the oven, the fridge seal, and the tops of the door frames, because those are the places a walkthrough always checks and a normal clean always skips.',
        'This clean is built backwards from the inspection. If a property manager in Pinellas or Hillsborough is going to open it, pull it out, or run a finger along it, it is on the list.',
      ]}
      included={[
        'Inside every cabinet and drawer', 'Inside the refrigerator', 'Inside the oven',
        'Closets, shelves and rods', 'Appliance exteriors and sides', 'Wall spot cleaning',
        'Baseboards and trim', 'Windows inside, sills and tracks', 'Light fixtures and fans',
        'Garage sweep out', 'Floors detailed edge to edge', 'Final walkthrough with you',
      ]}
      faqHeading="About move-in / move-out."
      faq={[
        { question: 'Will this get my deposit back?', answer: 'It removes cleaning as a reason to withhold it. Repairs, damage, and unpaid rent are separate matters and no cleaner can help with those.' },
        { question: 'Can you do it same week?', answer: 'Often yes. Move-outs are the easiest thing to fit into a gap, so it is always worth asking even on short notice.' },
        { question: 'Do you clean carpets?', answer: 'Not steam cleaning, no. Carpets are vacuumed thoroughly and I can point you to a local company for extraction if your lease requires it.' },
      ]}
      related={[
        { href: '/deep-cleaning', icon: 'deep', title: 'Deep Cleaning', desc: 'Everything in a standard clean, then the parts that get skipped for months. This is the one that resets a house.', price: 'From $180' },
        { href: '/residential-cleaning', icon: 'residential', title: 'Residential Cleaning', desc: 'The regular reset. Every room touched, every surface handled, the house put back the way you like it.', price: 'From $110' },
      ]}
    />
  )
}
