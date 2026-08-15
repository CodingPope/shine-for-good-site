import type { CollectionConfig } from 'payload'

export const Policies: CollectionConfig = {
  slug: 'policies',
  labels: { singular: 'Policy', plural: 'Policies' },
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'question',
    defaultColumns: ['question', 'category', 'order'],
    group: 'Content',
    description: 'The scheduling, payment, and service policies shown on the Policies page, grouped by category.',
  },
  fields: [
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Scheduling', value: 'scheduling' },
        { label: 'Payment', value: 'payment' },
        { label: 'During the clean', value: 'during' },
        { label: 'Recurring service', value: 'recurring' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'question',
      type: 'text',
      required: true,
    },
    {
      name: 'answer',
      type: 'textarea',
      required: true,
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        description: 'Lower numbers appear first within their category.',
      },
    },
  ],
}
