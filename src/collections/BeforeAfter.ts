import type { CollectionConfig } from 'payload'

export const BeforeAfter: CollectionConfig = {
  slug: 'before-after',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'serviceType', 'location'],
    description: 'Before & after photo pairs shown on the Work page.',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'Internal label, e.g. "Kitchen deep clean - Hyde Park"',
      },
    },
    {
      name: 'beforeImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'afterImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'caption',
      type: 'text',
      admin: {
        description: 'Short caption shown below the slider.',
      },
    },
    {
      name: 'serviceType',
      type: 'select',
      options: [
        { label: 'Residential Cleaning', value: 'residential' },
        { label: 'Deep Cleaning', value: 'deep' },
        { label: 'Move-In / Move-Out', value: 'move' },
        { label: 'Home Organization', value: 'organization' },
        { label: 'Post-Construction', value: 'post-construction' },
        { label: 'Airbnb', value: 'airbnb' },
      ],
    },
    {
      name: 'location',
      type: 'text',
      admin: {
        description: 'Neighborhood or city, e.g. "Old Northeast, St. Pete"',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Show as the main hero before/after on the Work page.',
      },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        description: 'Lower numbers appear first in the gallery.',
      },
    },
  ],
}
