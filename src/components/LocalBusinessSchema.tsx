import { SITE_URL } from '@/lib/site'

const SERVICES = [
  { name: 'Residential Cleaning', path: '/residential-cleaning' },
  { name: 'Deep Cleaning', path: '/deep-cleaning' },
  { name: 'Home Organization', path: '/home-organization' },
  { name: 'Move-In / Move-Out', path: '/move-in-move-out' },
  { name: 'Small Businesses', path: '/small-business-cleaning' },
]

const AREAS = [
  'St. Petersburg', 'Tampa', 'Clearwater', 'Gulfport', 'St. Pete Beach',
  'Treasure Island', 'Pinellas Park', 'Seminole', 'South Tampa', 'Kenneth City',
]

export function LocalBusinessSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'HomeAndConstructionBusiness'],
    '@id': `${SITE_URL}/#business`,
    name: 'Shine for Good',
    description: 'Residential cleaning, deep cleaning, home organization, move-in and move-out cleaning, and small business cleaning in St. Petersburg and Tampa, Florida. Ten percent of every service supports adults with disabilities.',
    slogan: 'Where every clean makes a difference.',
    url: `${SITE_URL}/`,
    telephone: '+1-305-304-9579',
    priceRange: '$$',
    founder: { '@type': 'Person', name: 'Chelsea Sawyer' },
    address: { '@type': 'PostalAddress', addressLocality: 'St. Petersburg', addressRegion: 'FL', addressCountry: 'US' },
    geo: { '@type': 'GeoCoordinates', latitude: 27.7676, longitude: -82.6403 },
    areaServed: AREAS.map(name => ({ '@type': 'City', name })),
    openingHoursSpecification: [
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], opens: '08:00', closes: '18:00' },
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Cleaning Services',
      itemListElement: SERVICES.map(s => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: s.name, url: `${SITE_URL}${s.path}` },
      })),
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
