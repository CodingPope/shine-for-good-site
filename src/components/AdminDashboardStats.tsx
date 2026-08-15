import { getPayload } from 'payload'
import config from '@payload-config'
import type { TrackEventType } from '@/lib/track'

type ConversionType = Exclude<TrackEventType, 'page-view'>

const LABELS: Record<ConversionType, string> = {
  'quote-sms': 'Quote requests — text',
  'quote-email': 'Quote requests — email',
  'contact-form': 'Contact form sent',
  'call-click': 'Call / text link clicked',
}

const TYPES = Object.keys(LABELS) as ConversionType[]

function sourceLabel(referrer?: string | null, utmSource?: string | null): string {
  if (utmSource) return utmSource
  if (!referrer) return 'Direct'
  try {
    const host = new URL(referrer).hostname.replace(/^www\./, '')
    return host || 'Direct'
  } catch {
    return 'Direct'
  }
}

function StatBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        margin: '0 0 1.25rem',
        padding: '1.5rem',
        border: '1px solid var(--theme-elevation-150, #e2e2e2)',
        borderRadius: 6,
        background: 'var(--theme-elevation-50, #fafafa)',
      }}
    >
      <h3 style={{ margin: '0 0 1.1rem', fontSize: '1rem' }}>{title}</h3>
      {children}
    </div>
  )
}

export async function AdminDashboardStats() {
  const payload = await getPayload({ config })
  const since = new Date()
  since.setDate(since.getDate() - 30)
  const sinceISO = since.toISOString()

  const counts = await Promise.all(
    TYPES.map(type =>
      payload
        .count({ collection: 'events', where: { type: { equals: type }, createdAt: { greater_than: sinceISO } } })
        .then(r => r.totalDocs)
        .catch(() => 0)
    )
  )
  const total = counts.reduce((sum, n) => sum + n, 0)

  let topPages: [string, number][] = []
  try {
    const pageViews = await payload.find({
      collection: 'events',
      where: { type: { equals: 'page-view' }, createdAt: { greater_than: sinceISO } },
      limit: 5000,
      select: { page: true },
    })
    const byPage = new Map<string, number>()
    for (const doc of pageViews.docs) {
      const page = doc.page || '(unknown)'
      byPage.set(page, (byPage.get(page) || 0) + 1)
    }
    topPages = [...byPage.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8)
  } catch {
    topPages = []
  }

  let topSources: [string, number][] = []
  try {
    const leads = await payload.find({
      collection: 'leads',
      where: { createdAt: { greater_than: sinceISO } },
      limit: 2000,
      select: { referrer: true, utmSource: true },
    })
    const bySource = new Map<string, number>()
    for (const doc of leads.docs) {
      const label = sourceLabel(doc.referrer, doc.utmSource)
      bySource.set(label, (bySource.get(label) || 0) + 1)
    }
    topSources = [...bySource.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8)
  } catch {
    topSources = []
  }

  return (
    <div style={{ marginBottom: '.75rem' }}>
      <StatBlock title="Last 30 days">
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
      </StatBlock>

      <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 260px' }}>
          <StatBlock title="Most visited pages">
            {topPages.length === 0 ? (
              <p style={{ margin: 0, fontSize: '.85rem', opacity: 0.7 }}>No page views tracked yet.</p>
            ) : (
              <ol style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                {topPages.map(([page, count]) => (
                  <li key={page} style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', padding: '.35rem 0', fontSize: '.85rem', borderTop: '1px solid var(--theme-elevation-100, #eee)' }}>
                    <span style={{ opacity: 0.85 }}>{page}</span>
                    <b>{count}</b>
                  </li>
                ))}
              </ol>
            )}
          </StatBlock>
        </div>

        <div style={{ flex: '1 1 260px' }}>
          <StatBlock title="Where leads come from">
            {topSources.length === 0 ? (
              <p style={{ margin: 0, fontSize: '.85rem', opacity: 0.7 }}>No leads tracked yet.</p>
            ) : (
              <ol style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                {topSources.map(([source, count]) => (
                  <li key={source} style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', padding: '.35rem 0', fontSize: '.85rem', borderTop: '1px solid var(--theme-elevation-100, #eee)' }}>
                    <span style={{ opacity: 0.85 }}>{source}</span>
                    <b>{count}</b>
                  </li>
                ))}
              </ol>
            )}
          </StatBlock>
        </div>
      </div>
    </div>
  )
}
