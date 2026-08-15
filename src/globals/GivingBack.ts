import type { GlobalConfig } from 'payload'

export const GivingBack: GlobalConfig = {
  slug: 'giving-back',
  label: 'Giving Back',
  admin: {
    group: 'Site',
    description: 'The charity content shown on the Giving Back page — who you support, the photo, and why it matters.',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Photo of or from the organization. Falls back to a placeholder icon until set.' },
    },
    {
      name: 'orgName',
      type: 'text',
      required: true,
      defaultValue: 'The Marc House',
    },
    {
      name: 'orgLocation',
      type: 'text',
      defaultValue: 'Key West, FL',
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      admin: { description: 'What the organization does and why it was chosen. One or two sentences.' },
      defaultValue: 'The Marc House in Key West is a nonprofit that supports adults with developmental disabilities — providing housing, job coaching, and community so people can live as independently as possible. It is the kind of place that quietly does essential work without a lot of fanfare.',
    },
  ],
}
