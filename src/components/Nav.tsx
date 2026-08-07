'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const LINKS = [
  { href: '/services', label: 'Services' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/work', label: 'Our work' },
  { href: '/giving-back', label: 'Giving back' },
  { href: '/about', label: 'About' },
  { href: '/faq', label: 'FAQ' },
  { href: '/journal', label: 'Journal' },
  { href: '/contact', label: 'Contact' },
]

export function Nav({ phone = '305-304-9579' }: { phone?: string }) {
  const [stuck, setStuck] = useState(false)
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const telHref = `tel:+1${phone.replace(/\D/g, '')}`

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close drawer on route change
  useEffect(() => { setOpen(false) }, [pathname])

  // Lock body scroll when drawer open
  useEffect(() => {
    document.body.classList.toggle('is-locked', open)
    return () => document.body.classList.remove('is-locked')
  }, [open])

  return (
    <>
      <nav
        className={['nav', stuck ? 'is-stuck' : '', open ? 'is-open' : ''].filter(Boolean).join(' ')}
        id="nav"
      >
        <Link className="nav-mark" href="/" aria-label="Shine for Good, home">
          Shine<span className="f">for</span><span className="g">Good</span>
        </Link>
        <div className="nav-links" id="navLinks">
          {LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              aria-current={pathname === href ? 'page' : undefined}
              className={pathname === href ? 'is-active' : undefined}
            >
              {label}
            </Link>
          ))}
          <a className="btn btn--solid nav-drawer-cta" href={telHref}>Call or text</a>
        </div>
        <a className="nav-cta" href={telHref}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" />
          </svg>
          <span>{phone}</span>
        </a>
        <button
          className="nav-burger"
          id="burger"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="navLinks"
          onClick={() => setOpen(o => !o)}
        >
          <span />
        </button>
      </nav>
      <div
        className={`nav-scrim${open ? ' is-on' : ''}`}
        id="navScrim"
        aria-hidden="true"
        onClick={() => setOpen(false)}
      />
    </>
  )
}
