import { getPayload } from 'payload'
import config from '@payload-config'
import type { NextRequest } from 'next/server'
import { nudgeOwnerUnansweredLead, sendQuotedFollowUp } from '@/lib/emails'

const DAY_MS = 24 * 60 * 60 * 1000

export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization')
  if (!process.env.CRON_SECRET || auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 })
  }

  const payload = await getPayload({ config })
  const now = Date.now()
  let nudged = 0
  let followedUp = 0

  // New leads left untouched for 24+ hours
  const staleNew = await payload.find({
    collection: 'leads',
    where: {
      status: { equals: 'new' },
      statusUpdatedAt: { less_than_equal: new Date(now - DAY_MS).toISOString() },
      nudgeSentAt: { equals: null },
    },
    limit: 100,
  })
  for (const lead of staleNew.docs) {
    try {
      await nudgeOwnerUnansweredLead(payload, lead)
      await payload.update({ collection: 'leads', id: lead.id, data: { nudgeSentAt: new Date().toISOString() } })
      nudged++
    } catch (err) {
      payload.logger.error({ err, leadId: lead.id, msg: 'Failed to send unanswered-lead nudge' })
    }
  }

  // Quoted leads sitting for 3-5 days with no update
  const staleQuoted = await payload.find({
    collection: 'leads',
    where: {
      status: { equals: 'quoted' },
      statusUpdatedAt: {
        less_than_equal: new Date(now - 3 * DAY_MS).toISOString(),
        greater_than_equal: new Date(now - 5 * DAY_MS).toISOString(),
      },
      followUpSentAt: { equals: null },
    },
    limit: 100,
  })
  for (const lead of staleQuoted.docs) {
    try {
      await sendQuotedFollowUp(payload, lead)
      await payload.update({ collection: 'leads', id: lead.id, data: { followUpSentAt: new Date().toISOString() } })
      followedUp++
    } catch (err) {
      payload.logger.error({ err, leadId: lead.id, msg: 'Failed to send quoted follow-up' })
    }
  }

  return Response.json({ nudged, followedUp })
}
