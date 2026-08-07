'use client'
import { useState } from 'react'
import Link from 'next/link'
import { showToast } from '@/lib/toast'

const AREAS = [
  'St. Petersburg', 'Tampa', 'Clearwater', 'Gulfport', 'St. Pete Beach',
  'Treasure Island', 'Pinellas Park', 'Seminole', 'South Tampa', 'Kenneth City',
]

const PHONE_DIGITS = '+13053049579'

export function ContactSection({
  heading = "Let's find your\ncleaning day.",
  showEstimateLink = true,
}: {
  heading?: string
  showEstimateLink?: boolean
}) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [what, setWhat] = useState('')
  const [msg, setMsg] = useState('')

  const send = () => {
    if (!name.trim() || !phone.trim()) {
      showToast('Name and phone, then it can send.')
      return
    }
    const body = [
      'Message from the Shine for Good site', '',
      `Name: ${name}`, `Phone: ${phone}`, `Email: ${email || '-'}`,
      `Looking for: ${what || '-'}`, '', msg,
    ].join('\n')
    window.location.href = `sms:${PHONE_DIGITS}?&body=${encodeURIComponent(body)}`
    showToast('Opening your messages app so you can hit send.')
  }

  return (
    <section className="sec sec--deep contact" id="contact">
      <svg className="tear tear--top" viewBox="0 0 1440 52" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 0h1440v14c-90 12-180 4-268 12s-152 20-243 14-160-24-256-18-160 22-247 16S86 26 0 34z" fill="#FAF6EE" />
      </svg>
      <div className="wrap">
        <div className="sec-head rv">
          <p className="eyebrow">Get in touch</p>
          <h2>{heading.split('\n').map((line, i) => <span key={i}>{i > 0 && <br />}{line}</span>)}</h2>
        </div>
        <div className="contact-grid">
          <div className="rv">
            <p className="script" style={{ fontSize: '2rem', margin: '0 0 .4rem' }}>Call or Text</p>
            <a className="tel" href="tel:+13053049579">
              <span className="dot">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" />
                </svg>
              </span>
              <span>305-304-9579</span>
            </a>
            <p className="body-s" style={{ marginTop: '1.6rem', maxWidth: '44ch' }}>
              Texts get answered fastest, usually the same day. If you would rather talk it through, say so and Chelsea will call you back at a time that works.
            </p>
            <p className="eyebrow" style={{ margin: '2.4rem 0 .8rem' }}>Where we clean</p>
            <div className="areas">
              {AREAS.map(a => <span key={a} className="area">{a}</span>)}
            </div>
          </div>
          <div className="rv rv-d2">
            <div className="form-row">
              <input className="inp" type="text" placeholder="Name" autoComplete="name" value={name} onChange={e => setName(e.target.value)} />
              <input className="inp" type="tel" placeholder="Phone" autoComplete="tel" value={phone} onChange={e => setPhone(e.target.value)} />
            </div>
            <input className="inp" type="email" placeholder="Email (optional)" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} />
            <input className="inp" type="text" placeholder="What are you after? Deep clean, recurring, move-out..." value={what} onChange={e => setWhat(e.target.value)} />
            <textarea className="inp" placeholder="Tell Chelsea about the space" value={msg} onChange={e => setMsg(e.target.value)} />
            <div style={{ display: 'flex', gap: '.6rem', flexWrap: 'wrap', marginTop: '.6rem' }}>
              <button className="btn btn--light" type="button" onClick={send}>Send it</button>
              {showEstimateLink && <Link className="btn btn--ghost" href="/pricing">Build an estimate first</Link>}
            </div>
            <p className="form-note">One person reads these. Expect a reply, not an autoresponder.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
