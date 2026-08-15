import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'alt',
    group: 'System',
    description: 'Every photo uploaded anywhere on the site lands here. You usually don\'t need to come to this tab directly — upload photos from within Journal Posts, Before & After, etc. instead.',
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: { description: 'Describe the photo in a few words — used for accessibility and search engines, not shown on the page.' },
    },
    {
      name: 'caption',
      type: 'text',
    },
  ],
  upload: {
    staticDir: '../public/media',
  },
}
