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
    description: 'Click events tracked from the site (quote requests, calls, messages). Feeds the dashboard summary — not meant to be edited by hand.',
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
