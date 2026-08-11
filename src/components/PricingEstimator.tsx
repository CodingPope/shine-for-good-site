'use client'
import { useMemo, useState } from 'react'
import { showToast } from '@/lib/toast'
import { track } from '@/lib/track'

const CFG = {
  rate: 0.11, min: 125, bathExtra: 25, bedExtra: 18,
  deepMult: 1.64, moveMult: 1.60, bizMult: 1.05, orgRate: 60,
  wk: 20, bi: 15, mo: 10, spread: 10, give: 10,
}

const ADDONS = [
  { id: 'fridge', name: 'Inside the fridge', price: 30 },
  { id: 'oven', name: 'Inside the oven', price: 30 },
  { id: 'windows', name: 'Interior windows', price: 45 },
  { id: 'base', name: 'Baseboards by hand', price: 30 },
  { id: 'cab', name: 'Inside cabinets', price: 40 },
  { id: 'laundry', name: 'Wash and fold', price: 25 },
  { id: 'pet', name: 'Heavy pet hair', price: 25 },
  { id: 'garage', name: 'Garage or lanai', price: 50 },
] as const

const SERVICES = [
  { id: 'standard', label: 'Residential' },
  { id: 'deep', label: 'Deep' },
  { id: 'organize', label: 'Organization' },
  { id: 'move', label: 'Move-in / out' },
  { id: 'biz', label: 'Business' },
  { id: 'post', label: 'Post-construction' },
] as const

const SVC_LABELS: Record<string, string> = {
  standard: 'Standard clean', deep: 'Deep clean',
  move: 'Move-in or move-out clean', biz: 'Small business clean',
  post: 'Post-construction clean',
}

const FREQ = [
  { id: 'once', label: 'One time' },
  { id: 'wk', label: 'Weekly' },
  { id: 'bi', label: 'Every 2 wks' },
  { id: 'mo', label: 'Monthly' },
] as const

const FREQ_PCT: Record<string, number> = { wk: CFG.wk, bi: CFG.bi, mo: CFG.mo, once: 0 }
const FREQ_NAME: Record<string, string> = { once: 'one time', wk: 'every week', bi: 'every two weeks', mo: 'once a month' }

const BED_OPTIONS = [1, 2, 3, 4, 5, 6]
const BATH_OPTIONS = [1, 1.5, 2, 2.5, 3, 4]

const PHONE_DIGITS = '+13053049579'
const EMAIL = 'cmsawyer12@gmail.com'

function money(n: number) {
  return '$' + Math.round(n).toLocaleString('en-US')
}

interface PricingEstimatorProps {
  eyebrow?: string
  heading?: React.ReactNode
  lede?: string
}

export function PricingEstimator({ eyebrow, heading, lede }: PricingEstimatorProps = {}) {
  const [svc, setSvc] = useState<string>('standard')
  const [sqft, setSqft] = useState(1500)
  const [bed, setBed] = useState(3)
  const [bath, setBath] = useState(2)
  const [freq, setFreq] = useState<string>('bi')
  const [addons, setAddons] = useState<string[]>([])
  const [qName, setQName] = useState('')
  const [qPhone, setQPhone] = useState('')
  const [qAddr, setQAddr] = useState('')
  const [qNote, setQNote] = useState('')

  const recurring = svc === 'standard' || svc === 'deep' || svc === 'biz'
  const effectiveFreq = recurring ? freq : 'once'

  const result = useMemo(() => {
    let base: number
    let baseLab = 'Base clean'
    let forLine: string

    if (svc === 'organize') {
      const hours = Math.max(2, Math.min(10, Math.round(sqft / 450)))
      base = hours * CFG.orgRate
      baseLab = `${hours} hours at ${money(CFG.orgRate)}/hr`
      forLine = `Home organization, roughly ${hours} hours`
    } else if (svc === 'post') {
      base = Math.max(CFG.min * 2, sqft * CFG.rate * CFG.deepMult * 1.2)
      forLine = 'Post-construction clean, one time'
    } else {
      base = Math.max(CFG.min, sqft * CFG.rate)
      base += Math.max(0, bath - 2) * CFG.bathExtra
      base += Math.max(0, bed - 3) * CFG.bedExtra
      if (svc === 'deep') base *= CFG.deepMult
      if (svc === 'move') base *= CFG.moveMult
      if (svc === 'biz') base *= CFG.bizMult
      forLine = SVC_LABELS[svc] + (effectiveFreq === 'once' ? ', one time' : `, ${FREQ_NAME[effectiveFreq]}`)
    }

    const addTotal = addons.reduce((s, id) => s + (ADDONS.find(a => a.id === id)?.price ?? 0), 0)
    const sub = base + addTotal
    const pct = FREQ_PCT[effectiveFreq] ?? 0
    const discount = sub * (pct / 100)
    const total = sub - discount
    const lo = Math.round((total * (1 - CFG.spread / 100)) / 5) * 5
    const hi = Math.round((total * (1 + CFG.spread / 100)) / 5) * 5
    const give = Math.max(1, Math.round(total * (CFG.give / 100)))

    return { base, baseLab, forLine, addTotal, discount, pct, lo, hi, give }
  }, [svc, sqft, bed, bath, effectiveFreq, addons])

  const toggleAddon = (id: string) => {
    setAddons(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id])
  }

  const summary = () => {
    const names = addons.map(id => ADDONS.find(a => a.id === id)?.name).filter(Boolean)
    const lines = [
      'Quote request from the Shine for Good site', '',
      `Name: ${qName || '-'}`,
      `Phone: ${qPhone || '-'}`,
      `Where: ${qAddr || '-'}`, '',
      `Service: ${result.forLine}`,
      `Size: ${sqft.toLocaleString('en-US')} sq ft, ${bed} bd / ${bath} ba`,
      `Add-ons: ${names.length ? names.join(', ') : 'none'}`,
      `Site estimate: ${money(result.lo)} to ${money(result.hi)}`, '',
    ]
    if (qNote) lines.push(`Notes: ${qNote}`)
    return lines.join('\n')
  }

  const sendSms = () => {
    if (!qName.trim() || !qPhone.trim()) { showToast('Add your name and phone so Chelsea can reply.'); return }
    track('quote-sms')
    window.location.href = `sms:${PHONE_DIGITS}?&body=${encodeURIComponent(summary())}`
    showToast('Opening your messages app with the details filled in.')
  }

  const sendEmail = () => {
    if (!qName.trim()) { showToast('Add your name first.'); return }
    track('quote-email')
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent('Quote request: ' + result.forLine)}&body=${encodeURIComponent(summary())}`
    showToast('Opening your email with the details filled in.')
  }

  let n = 0
  const num = () => ++n

  return (
    <section className="sec est" id="estimate">
      <div className="wrap">
        {(eyebrow || heading || lede) && (
          <div className="sec-head rv">
            {eyebrow && <p className="eyebrow">{eyebrow}</p>}
            {heading && <h2>{heading}</h2>}
            {lede && <p className="lede">{lede}</p>}
          </div>
        )}
        <div className="est-grid">
          <div className="rv">
            <div className="field">
              <div className="field-top"><span className="field-lab">{num()} &middot; What kind of clean</span></div>
              <div className="chips" role="group" aria-label="Service type">
                {SERVICES.map(s => (
                  <button
                    key={s.id}
                    type="button"
                    className={`chip${svc === s.id ? ' is-on' : ''}`}
                    role="radio"
                    aria-checked={svc === s.id}
                    onClick={() => setSvc(s.id)}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="field">
              <div className="field-top">
                <span className="field-lab">{num()} &middot; Square footage</span>
                <span className="field-val">{sqft >= 4000 ? '4,000+' : sqft.toLocaleString('en-US')} sq ft</span>
              </div>
              <input
                type="range" min={500} max={4000} step={50} value={sqft}
                aria-label="Square footage"
                onChange={e => setSqft(parseInt(e.target.value, 10))}
              />
              <div className="range-ends"><span>500</span><span>4,000+</span></div>
            </div>

            <div className="field">
              <div className="field-top"><span className="field-lab">{num()} &middot; Bedrooms &amp; bathrooms</span></div>
              <div className="bedbath">
                <div>
                  <div className="range-ends" style={{ marginBottom: '.5rem' }}><span>Bedrooms</span><span style={{ color: 'var(--moss)' }}>{bed === 6 ? '6+' : bed}</span></div>
                  <div className="chips" role="group" aria-label="Bedrooms">
                    {BED_OPTIONS.map(n2 => (
                      <button key={n2} type="button" className={`chip${bed === n2 ? ' is-on' : ''}`} role="radio" aria-checked={bed === n2} onClick={() => setBed(n2)}>
                        {n2 === 6 ? '6+' : n2}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="range-ends" style={{ marginBottom: '.5rem' }}><span>Bathrooms</span><span style={{ color: 'var(--moss)' }}>{bath === 4 ? '4+' : bath}</span></div>
                  <div className="chips" role="group" aria-label="Bathrooms">
                    {BATH_OPTIONS.map(n2 => (
                      <button key={n2} type="button" className={`chip${bath === n2 ? ' is-on' : ''}`} role="radio" aria-checked={bath === n2} onClick={() => setBath(n2)}>
                        {n2 === 4 ? '4+' : n2}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {recurring && (
              <div className="field">
                <div className="field-top"><span className="field-lab">{num()} &middot; How often</span></div>
                <div className="chips" role="group" aria-label="Frequency">
                  {FREQ.map(f => {
                    const off = FREQ_PCT[f.id]
                    return (
                      <button key={f.id} type="button" className={`chip${freq === f.id ? ' is-on' : ''}`} role="radio" aria-checked={freq === f.id} onClick={() => setFreq(f.id)}>
                        {f.label}{off ? <small>save {off}%</small> : null}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            <div className="field">
              <div className="field-top"><span className="field-lab">{num()} &middot; Add anything on</span></div>
              <div className="addons">
                {ADDONS.map(a => {
                  const on = addons.includes(a.id)
                  return (
                    <button key={a.id} type="button" className={`addon${on ? ' is-on' : ''}`} aria-pressed={on} onClick={() => toggleAddon(a.id)}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '.6rem' }}>
                        <span className="box" />{a.name}
                      </span>
                      <i>+{money(a.price)}</i>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="result rv rv-d2">
            <div className="bloom">
              <p className="res-lab">Request a quote</p>
              <p className="res-range">{money(result.lo)} <span className="to">to</span> {money(result.hi)}</p>
              <p className="res-for">{result.forLine}</p>
              <div className="res-rule" />
              <div className="res-row"><span>{result.baseLab}</span><b>{money(result.base)}</b></div>
              {result.addTotal > 0 && (
                <div className="res-row"><span>Add-ons</span><b>{money(result.addTotal)}</b></div>
              )}
              {result.discount >= 1 && (
                <div className="res-save"><span>{result.pct}% recurring discount</span><b>-{money(result.discount)}</b></div>
              )}
              <div className="give">
                <div className="give-top">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1L12 21l7.7-7.6 1.1-1a5.5 5.5 0 0 0 0-7.8z" /></svg>
                  <span>Something good happens here</span>
                </div>
                <p><b>{money(result.give)}</b> <span>of that goes to the Marc House in Key West.</span></p>
              </div>
              <p className="res-fine">Fill in your details and Chelsea will reach out with a custom quote. No automated responses, no pressure.</p>
              <div className="send is-on">
                <input className="inp" type="text" placeholder="Your name" autoComplete="name" value={qName} onChange={e => setQName(e.target.value)} />
                <input className="inp" type="tel" placeholder="Phone number" autoComplete="tel" value={qPhone} onChange={e => setQPhone(e.target.value)} />
                <input className="inp" type="text" placeholder="Neighborhood or address" autoComplete="street-address" value={qAddr} onChange={e => setQAddr(e.target.value)} />
                <textarea className="inp" placeholder="Anything Chelsea should know? Pets, problem areas, timing." value={qNote} onChange={e => setQNote(e.target.value)} />
                <div className="res-actions">
                  <button className="btn btn--gold" type="button" onClick={sendSms}>Text it over</button>
                  <button className="btn btn--ghost" type="button" onClick={sendEmail}>Email it instead</button>
                </div>
                <p className="res-fine">Your details go straight to Chelsea&apos;s phone. No mailing list, no automated follow-up sequence.</p>
              </div>
              <a className="btn btn--ghost" href="tel:+13053049579" style={{ marginTop: '.8rem', display: 'block', textAlign: 'center' }}>Rather just talk? Call</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
