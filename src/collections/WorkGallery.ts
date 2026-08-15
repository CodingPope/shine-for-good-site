import type { CollectionConfig } from 'payload'

export const WorkGallery: CollectionConfig = {
  slug: 'work-gallery',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'caption',
    defaultColumns: ['caption', 'location', 'serviceType'],
    group: 'Content',
    description: 'Single photos (not paired before/after) shown in the gallery grid on the Work page. For side-by-side comparisons, use "Before & After" instead.',
  },
  fields: [
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'caption',
      type: 'text',
      admin: {
        description: 'Short label shown below the photo, e.g. "Kitchen reset, Old Northeast"',
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
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        description: 'Lower numbers appear first.',
      },
    },
  ],
}
