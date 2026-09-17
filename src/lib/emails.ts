import type { Payload } from 'payload'
import type { Lead } from '@/payload-types'

const OWNER_EMAIL = process.env.OWNER_NOTIFICATION_EMAIL || 'cmsawyer12@gmail.com'

function adminLink(lead: Lead) {
  return `${process.env.NEXT_PUBLIC_SERVER_URL || ''}/admin/collections/leads/${lead.id}`
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;')
}

function leadLine(label: string, value?: string | null) {
  return value ? `<p style="margin:0 0 6px"><strong>${label}:</strong> ${escapeHtml(value)}</p>` : ''
}

function linkLine(label: string, value: string | null | undefined, href: (v: string) => string) {
  if (!value) return ''
  const safe = escapeHtml(value)
  return `<p style="margin:0 0 6px"><strong>${label}:</strong> <a href="${href(safe)}">${safe}</a></p>`
}

const SOURCE_LABELS: Record<string, string> = {
  'quote-estimator': 'Quote estimator',
  'contact-form': 'Contact form',
}

/**
 * Every owner-facing email gets the same block, so a reminder is never missing a
 * detail the original notification had. Phone and email are rendered as links so
 * they are one tap from a phone, and a missing one says so rather than vanishing —
 * "no email on file" and "we forgot to include it" used to look identical.
 */
function leadDetails(lead: Lead) {
  const utm = [lead.utmSource, lead.utmMedium, lead.utmCampaign].filter(Boolean).join(' / ')
  return [
    leadLine('Name', lead.name),
    linkLine('Phone', lead.phone, v => `tel:${v.replace(/[^\d+]/g, '')}`)
      || '<p style="margin:0 0 6px;color:#777"><strong>Phone:</strong> not given</p>',
    linkLine('Email', lead.email, v => `mailto:${v}`)
      || '<p style="margin:0 0 6px;color:#777"><strong>Email:</strong> not given</p>',
    leadLine('Estimate', lead.estimateRange),
    leadLine('Source', lead.source ? SOURCE_LABELS[lead.source] ?? lead.source : null),
    leadLine('Page', lead.page),
    leadLine('Came from', lead.referrer),
    leadLine('Campaign', utm || null),
    lead.summary
      ? `<p style="margin:12px 0 0;white-space:pre-wrap">${escapeHtml(lead.summary)}</p>`
      : '',
  ].join('')
}

function shell(body: string, lead: Lead) {
  return `
    <div style="font-family:sans-serif;font-size:14px;color:#222">
      ${body}
      <p style="margin:16px 0 0"><a href="${adminLink(lead)}">Open in admin</a></p>
    </div>
  `
}

export async function notifyOwnerNewLead(payload: Payload, lead: Lead) {
  const subject = `New lead: ${lead.name}${lead.estimateRange ? ` (${lead.estimateRange})` : ''}`
  await payload.sendEmail({
    to: OWNER_EMAIL,
    subject,
    html: shell(`<h2 style="margin:0 0 12px">New lead from the site</h2>${leadDetails(lead)}`, lead),
  })
}

export async function sendCustomerReceipt(payload: Payload, lead: Lead) {
  if (!lead.email) return
  const subject = 'Got your request — Shine for Good'
  const html = `
    <div style="font-family:sans-serif;font-size:14px;color:#222">
      <p>Hi ${escapeHtml(lead.name.split(' ')[0] || lead.name)},</p>
      <p>This confirms Chelsea received your request. She reads and replies to these herself, usually the same day — no automated quote is coming, just a real reply.</p>
      <p>If it's urgent, you can also call or text 305-304-9579.</p>
      <p>— Shine for Good</p>
    </div>
  `
  await payload.sendEmail({ to: lead.email, subject, html })
}

export async function nudgeOwnerUnansweredLead(payload: Payload, lead: Lead) {
  const daysAgo = Math.floor((Date.now() - new Date(lead.createdAt).getTime()) / 86400000)
  const days = `${daysAgo} day${daysAgo === 1 ? '' : 's'}`
  const subject = `Unanswered lead: ${lead.name} (${days} ago)`
  await payload.sendEmail({
    to: OWNER_EMAIL,
    subject,
    html: shell(
      `<h2 style="margin:0 0 12px">You have an unanswered lead</h2>
       <p style="margin:0 0 12px">${escapeHtml(lead.name)} reached out ${days} ago and is still marked "New." Here is everything they sent:</p>
       ${leadDetails(lead)}`,
      lead,
    ),
  })
}

export async function sendQuotedFollowUp(payload: Payload, lead: Lead) {
  if (lead.email) {
    await payload.sendEmail({
      to: lead.email,
      subject: 'Just checking in — Shine for Good',
      html: `
        <div style="font-family:sans-serif;font-size:14px;color:#222">
          <p>Hi ${escapeHtml(lead.name.split(' ')[0] || lead.name)},</p>
          <p>Just checking if you had any questions on the quote Chelsea sent over. No pressure at all — happy to help if anything wasn't clear or your plans changed.</p>
          <p>— Shine for Good</p>
        </div>
      `,
    })
  }
  const what = lead.email
    ? `an automatic check-in went out to ${escapeHtml(lead.email)} on your behalf`
    : 'there was no email on file, so nothing could be sent automatically — this one needs a call or text'
  await payload.sendEmail({
    to: OWNER_EMAIL,
    subject: `Follow-up ${lead.email ? 'sent' : 'needed'}: ${lead.name}`,
    html: shell(
      `<p style="margin:0 0 12px">${escapeHtml(lead.name)} has been "Quoted" for a few days with no update, so ${what}.</p>
       ${leadDetails(lead)}`,
      lead,
    ),
  })
}
