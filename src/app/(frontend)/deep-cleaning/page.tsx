import type { Metadata } from 'next'
import { ServiceDetailPage } from '@/components/ServiceDetailPage'

export const metadata: Metadata = {
  title: 'Deep Cleaning Service in St. Pete & Tampa',
  description: 'Deep house cleaning in St. Petersburg and Tampa. Baseboards, grout, blinds, inside appliances, behind furniture. From $180. Recommended for a first visit.',
}

export default function DeepCleaningPage() {
  return (
    <ServiceDetailPage
      crumbLabel="Deep Cleaning"
      eyebrow="Recommended for a first visit"
      title="Deep cleaning that actually resets a house"
      lede="Everything in a standard clean, then the parts that get skipped for months. This is the one that resets a house."
      price="From $180"
      priceSub="Final price depends on your space and what it needs. Fill out the form and Chelsea will get back to you with a custom quote."
      priceCtaHref="/pricing"
      priceCtaLabel="Request a quote"
      paragraphs={[
        'Most homes in Tampa Bay need this before anything else. Gulf humidity puts a film on everything, and a normal clean moves it around rather than removing it.',
        'A deep clean takes roughly twice as long as a standard visit because it goes at the things time forgets: grout lines, baseboards, blind slats, the tops of door frames, the tracks under every window. Once it is done, recurring visits are genuinely easy.',
      ]}
      included={[
        'Everything in a standard clean', 'Baseboards hand wiped', 'Door frames and door tops',
        'Window sills and tracks', 'Blinds dusted slat by slat', 'Cabinet fronts degreased',
        'Backsplash grout scrubbed', 'Shower grout and hard water buildup', 'Behind and under movable furniture',
        'Vents and returns dusted', 'Light switch plates detailed', 'Trim, corners and cobwebs',
      ]}
      faqHeading="About deep cleaning."
      faq={[
        { question: 'Do I need a deep clean before starting recurring visits?', answer: 'Usually yes, for a first visit. If the home has been professionally cleaned within the last couple of months, a standard clean is often enough. Send photos and you will get an honest answer rather than an upsell.' },
        { question: 'How often should a Florida home get one?', answer: 'Every three to four months for most homes here. Closer to every ten weeks if you are near the water, have pets, or run the AC hard.' },
        { question: 'Does it include inside the oven and fridge?', answer: 'Those are add-ons rather than standard, because plenty of people do not want them touched. Both are $35 in the estimate builder.' },
      ]}
      related={[
        { href: '/residential-cleaning', icon: 'residential', title: 'Residential Cleaning', desc: 'The regular reset. Every room touched, every surface handled, the house put back the way you like it.', price: 'From $110' },
        { href: '/move-in-move-out', icon: 'move', title: 'Move-In / Move-Out', desc: 'For the day the house is empty and every mark is visible. Landlords, buyers and inspectors all look at the same places, and so do we.', price: 'From $225' },
      ]}
    />
  )
}
