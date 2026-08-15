import type { Payload } from 'payload'
import type { Lead } from '@/payload-types'

const OWNER_EMAIL = process.env.OWNER_NOTIFICATION_EMAIL || 'cmsawyer12@gmail.com'

function adminLink(lead: Lead) {
  return `${process.env.NEXT_PUBLIC_SERVER_URL || ''}/admin/collections/leads/${lead.id}`
}

function leadLine(label: string, value?: string | null) {
  return value ? `<p style="margin:0 0 6px"><strong>${label}:</strong> ${value}</p>` : ''
}

export async function notifyOwnerNewLead(payload: Payload, lead: Lead) {
  const subject = `New lead: ${lead.name}${lead.estimateRange ? ` (${lead.estimateRange})` : ''}`
  const html = `
    <div style="font-family:sans-serif;font-size:14px;color:#222">
      <h2 style="margin:0 0 12px">New lead from the site</h2>
      ${leadLine('Name', lead.name)}
      ${leadLine('Phone', lead.phone)}
      ${leadLine('Email', lead.email)}
      ${leadLine('Estimate', lead.estimateRange)}
      ${leadLine('Source', lead.source)}
      ${leadLine('Page', lead.page)}
      ${lead.summary ? `<p style="margin:12px 0 0;white-space:pre-wrap">${lead.summary}</p>` : ''}
      <p style="margin:16px 0 0"><a href="${adminLink(lead)}">Open in admin</a></p>
    </div>
  `
  await payload.sendEmail({ to: OWNER_EMAIL, subject, html })
}

export async function sendCustomerReceipt(payload: Payload, lead: Lead) {
  if (!lead.email) return
  const subject = 'Got your request — Shine for Good'
  const html = `
    <div style="font-family:sans-serif;font-size:14px;color:#222">
      <p>Hi ${lead.name.split(' ')[0] || lead.name},</p>
      <p>This confirms Chelsea received your request. She reads and replies to these herself, usually the same day — no automated quote is coming, just a real reply.</p>
      <p>If it's urgent, you can also call or text 305-304-9579.</p>
      <p>— Shine for Good</p>
    </div>
  `
  await payload.sendEmail({ to: lead.email, subject, html })
}

export async function nudgeOwnerUnansweredLead(payload: Payload, lead: Lead) {
  const daysAgo = Math.floor((Date.now() - new Date(lead.createdAt).getTime()) / 86400000)
  const subject = `Unanswered lead: ${lead.name} (${daysAgo} day${daysAgo === 1 ? '' : 's'} ago)`
  const html = `
    <div style="font-family:sans-serif;font-size:14px;color:#222">
      <h2 style="margin:0 0 12px">You have an unanswered lead</h2>
      <p style="margin:0 0 12px">${lead.name} reached out ${daysAgo} day${daysAgo === 1 ? '' : 's'} ago and is still marked "New."</p>
      ${leadLine('Phone', lead.phone)}
      ${leadLine('Email', lead.email)}
      ${lead.summary ? `<p style="margin:12px 0 0;white-space:pre-wrap">${lead.summary}</p>` : ''}
      <p style="margin:16px 0 0"><a href="${adminLink(lead)}">Open in admin</a></p>
    </div>
  `
  await payload.sendEmail({ to: OWNER_EMAIL, subject, html })
}

export async function sendQuotedFollowUp(payload: Payload, lead: Lead) {
  if (lead.email) {
    await payload.sendEmail({
      to: lead.email,
      subject: 'Just checking in — Shine for Good',
      html: `
        <div style="font-family:sans-serif;font-size:14px;color:#222">
          <p>Hi ${lead.name.split(' ')[0] || lead.name},</p>
          <p>Just checking if you had any questions on the quote Chelsea sent over. No pressure at all — happy to help if anything wasn't clear or your plans changed.</p>
          <p>— Shine for Good</p>
        </div>
      `,
    })
  }
  await payload.sendEmail({
    to: OWNER_EMAIL,
    subject: `Follow-up sent: ${lead.name}`,
    html: `
      <div style="font-family:sans-serif;font-size:14px;color:#222">
        <p>${lead.name} has been "Quoted" for a few days with no update, so an automatic check-in went out to ${lead.email || 'them'} on your behalf.</p>
        <p style="margin:16px 0 0"><a href="${adminLink(lead)}">Open in admin</a></p>
      </div>
    `,
  })
}
