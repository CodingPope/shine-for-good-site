import { APIError, type CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  hooks: {
    beforeOperation: [
      ({ operation }) => {
        if (
          (operation === 'create' || operation === 'update') &&
          process.env.VERCEL &&
          !process.env.BLOB_READ_WRITE_TOKEN
        ) {
          throw new APIError(
            'Image storage is not configured. Connect Vercel Blob and set BLOB_READ_WRITE_TOKEN before uploading photos.',
            503,
          )
        }
      },
    ],
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
