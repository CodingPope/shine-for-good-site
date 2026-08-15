import type { CollectionConfig } from 'payload'

export const Events: CollectionConfig = {
  slug: 'events',
  labels: { singular: 'Event', plural: 'Site Activity' },
  access: {
    read: ({ req }) => Boolean(req.user),
    create: () => true,
    update: () => false,
    delete: ({ req }) => Boolean(req.user),
  },
  admin: {
    useAsTitle: 'type',
    defaultColumns: ['type', 'page', 'createdAt'],
    group: 'System',
    description: 'Raw click events tracked from the site. This is what feeds the "Last 30 days" summary on the dashboard — you don\'t need to edit these by hand.',
    hidden: false,
  },
  fields: [
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Quote request — text', value: 'quote-sms' },
        { label: 'Quote request — email', value: 'quote-email' },
        { label: 'Contact form sent', value: 'contact-form' },
        { label: 'Call or text link clicked', value: 'call-click' },
      ],
    },
    {
      name: 'page',
      type: 'text',
      admin: { description: 'The page the click happened on.' },
    },
  ],
}
