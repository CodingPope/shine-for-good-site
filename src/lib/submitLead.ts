export interface LeadPayload {
  name: string
  phone?: string
  email?: string
  source: 'quote-estimator' | 'contact-form'
  summary?: string
  estimateRange?: string
}

export function submitLead(lead: LeadPayload) {
  try {
    const params = new URLSearchParams(window.location.search)
    fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...lead,
        page: window.location.pathname,
        referrer: document.referrer || undefined,
        utmSource: params.get('utm_source') || undefined,
        utmMedium: params.get('utm_medium') || undefined,
        utmCampaign: params.get('utm_campaign') || undefined,
      }),
      keepalive: true,
    }).catch(() => {})
  } catch {}
}
