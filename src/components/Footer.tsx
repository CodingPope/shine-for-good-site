import Link from 'next/link'

const SERVICES = [
  { href: '/residential-cleaning', label: 'Residential Cleaning' },
  { href: '/deep-cleaning', label: 'Deep Cleaning' },
  { href: '/home-organization', label: 'Home Organization' },
  { href: '/move-in-move-out', label: 'Move-In / Move-Out' },
  { href: '/small-business-cleaning', label: 'Small Businesses' },
]

const MORE = [
  { href: '/pricing', label: 'Pricing & estimate' },
  { href: '/work', label: 'Our work' },
  { href: '/giving-back', label: 'Giving back' },
  { href: '/about', label: 'About Chelsea' },
  { href: '/faq', label: 'Questions' },
  { href: '/policies', label: 'Policies' },
  { href: '/journal', label: 'Journal' },
  { href: '/contact', label: 'Contact' },
]

const DEFAULT_AREAS = [
  'St. Petersburg','Tampa','Clearwater','Gulfport','St. Pete Beach',
  'Treasure Island','Pinellas Park','Seminole','South Tampa','Kenneth City',
]

export function Footer({ phone = '305-304-9579', email = 'cmsawyer12@gmail.com', areas = DEFAULT_AREAS }: {
  phone?: string
  email?: string
  areas?: string[]
}) {
  const telHref = `tel:+1${phone.replace(/\D/g, '')}`
  const year = new Date().getFullYear()

  return (
    <footer className="foot">
      <div className="wrap">
        <div className="foot-grid">
          <div>
            <div className="foot-mark">Shine<span className="f">for</span>Good</div>
            <p style={{ maxWidth: '34ch', margin: 0 }}>
              Where every clean makes a difference. Residential and small business cleaning across St. Petersburg and Tampa.
            </p>
            <div className="orn orn--left" aria-hidden="true"><i /></div>
            <p style={{ fontSize: '.72rem', opacity: .7, maxWidth: '34ch', margin: 0 }}>
              Serving {areas.join(', ')}.
            </p>
            <p style={{ fontSize: '.78rem', margin: '.8rem 0 0' }}>Chelsea Sawyer, owner</p>
            <a href={telHref} style={{ marginTop: '.4rem' }}>{phone}</a>
            <a href={`mailto:${email}`}>{email}</a>
          </div>
          <div>
            <h4>Services</h4>
            {SERVICES.map(({ href, label }) => (
              <Link key={href} href={href}>{label}</Link>
            ))}
          </div>
          <div>
            <h4>More</h4>
            {MORE.map(({ href, label }) => (
              <Link key={href} href={href}>{label}</Link>
            ))}
          </div>
        </div>
        <div className="foot-bot">
          <span>&copy; {year} Shine for Good. All rights reserved.</span>
          <span>Licensed and insured &middot; Serving St. Pete &amp; Tampa Bay</span>
        </div>
      </div>
    </footer>
  )
}
