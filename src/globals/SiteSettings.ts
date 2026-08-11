import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'aboutPhoto',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Portrait shown on the About page. Falls back to a placeholder icon until set.' },
    },
  ],
}
