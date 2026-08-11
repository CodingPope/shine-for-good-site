import { getPayload } from 'payload'
import config from '@payload-config'
import type { TrackEventType } from '@/lib/track'

const LABELS: Record<TrackEventType, string> = {
  'quote-sms': 'Quote requests — text',
  'quote-email': 'Quote requests — email',
  'contact-form': 'Contact form sent',
  'call-click': 'Call / text link clicked',
}

const TYPES = Object.keys(LABELS) as TrackEventType[]

export async function AdminDashboardStats() {
  const payload = await getPayload({ config })
  const since = new Date()
  since.setDate(since.getDate() - 30)

  const counts = await Promise.all(
    TYPES.map(type =>
      payload
        .count({ collection: 'events', where: { type: { equals: type }, createdAt: { greater_than: since.toISOString() } } })
        .then(r => r.totalDocs)
        .catch(() => 0)
    )
  )

  const total = counts.reduce((sum, n) => sum + n, 0)

  return (
    <div
      style={{
        margin: '0 0 2rem',
        padding: '1.5rem',
        border: '1px solid var(--theme-elevation-150, #e2e2e2)',
        borderRadius: 6,
        background: 'var(--theme-elevation-50, #fafafa)',
      }}
    >
      <h3 style={{ margin: '0 0 .25rem', fontSize: '1rem' }}>Last 30 days</h3>
      <p style={{ margin: '0 0 1.25rem', fontSize: '.85rem', opacity: 0.7 }}>
        {total === 0 ? 'No activity tracked yet.' : `${total} total site actions.`}
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem' }}>
        {TYPES.map((type, i) => (
          <div key={type}>
            <div style={{ fontSize: '1.8rem', fontWeight: 600, lineHeight: 1 }}>{counts[i]}</div>
            <div style={{ fontSize: '.78rem', opacity: 0.7, marginTop: '.35rem' }}>{LABELS[type]}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
