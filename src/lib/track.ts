export type TrackEventType = 'page-view' | 'quote-sms' | 'quote-email' | 'contact-form' | 'call-click'

export function track(type: TrackEventType) {
  try {
    fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, page: window.location.pathname }),
      keepalive: true,
    }).catch(() => {})
  } catch {}
}
