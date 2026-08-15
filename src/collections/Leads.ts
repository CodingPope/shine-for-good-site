import type { CollectionConfig } from 'payload'
import { notifyOwnerNewLead, sendCustomerReceipt } from '../lib/emails'

export const Leads: CollectionConfig = {
  slug: 'leads',
  labels: { singular: 'Lead', plural: 'Leads' },
  access: {
    read: ({ req }) => Boolean(req.user),
    create: () => true,
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'phone', 'status', 'source', 'createdAt'],
    group: 'Leads',
    description: 'Every quote request and contact form submission lands here. Update the status as you work a lead — "New" leads left untouched for 24 hours trigger a reminder email, and "Quoted" leads left for 3-5 days trigger an automatic customer follow-up.',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'phone',
      type: 'text',
    },
    {
      name: 'email',
      type: 'email',
      admin: { description: 'Needed for the auto-reply and follow-up emails to reach the customer.' },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'Contacted', value: 'contacted' },
        { label: 'Quoted', value: 'quoted' },
        { label: 'Booked', value: 'booked' },
        { label: 'Lost', value: 'lost' },
      ],
      admin: {
        position: 'sidebar',
        description: 'Booked and Lost are treated as closed — the reminder/follow-up automation stops once a lead reaches either.',
      },
    },
    {
      name: 'source',
      type: 'select',
      admin: { position: 'sidebar' },
      options: [
        { label: 'Quote estimator', value: 'quote-estimator' },
        { label: 'Contact form', value: 'contact-form' },
      ],
    },
    {
      name: 'summary',
      type: 'textarea',
      admin: { description: 'What they asked for — service type, size, notes.' },
    },
    {
      name: 'estimateRange',
      type: 'text',
      admin: { description: 'The price range shown on the site, if this came from the quote estimator.' },
    },
    {
      name: 'page',
      type: 'text',
      admin: { position: 'sidebar', description: 'The page they submitted from.' },
    },
    {
      name: 'referrer',
      type: 'text',
      admin: { position: 'sidebar', description: 'Where they came from before landing on the site.' },
    },
    {
      name: 'utmSource',
      type: 'text',
      admin: { position: 'sidebar' },
    },
    {
      name: 'utmMedium',
      type: 'text',
      admin: { position: 'sidebar' },
    },
    {
      name: 'utmCampaign',
      type: 'text',
      admin: { position: 'sidebar' },
    },
    {
      name: 'statusUpdatedAt',
      type: 'date',
      admin: { position: 'sidebar', readOnly: true, description: 'Set automatically whenever status changes.' },
    },
    {
      name: 'ownerNotifiedAt',
      type: 'date',
      admin: { position: 'sidebar', readOnly: true },
    },
    {
      name: 'nudgeSentAt',
      type: 'date',
      admin: { position: 'sidebar', readOnly: true, description: '24-hour unanswered-lead reminder, if sent.' },
    },
    {
      name: 'followUpSentAt',
      type: 'date',
      admin: { position: 'sidebar', readOnly: true, description: 'Auto follow-up after sitting in Quoted, if sent.' },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, originalDoc }) => {
        if (!originalDoc || data.status !== originalDoc.status) {
          data.statusUpdatedAt = new Date().toISOString()
        }
        return data
      },
    ],
    afterChange: [
      async ({ doc, operation, req }) => {
        if (operation !== 'create') return doc
        try {
          await notifyOwnerNewLead(req.payload, doc)
          await sendCustomerReceipt(req.payload, doc)
          await req.payload.update({
            collection: 'leads',
            id: doc.id,
            data: { ownerNotifiedAt: new Date().toISOString() },
          })
        } catch (err) {
          req.payload.logger.error({ err, msg: 'Failed to send new-lead notification emails' })
        }
        return doc
      },
    ],
  },
}
