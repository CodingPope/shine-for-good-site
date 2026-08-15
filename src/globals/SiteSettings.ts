import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  admin: {
    group: 'Site',
    description: 'Contact info and service areas used sitewide — the footer, nav, contact form, and Google business info all pull from here.',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      type: 'group',
      name: 'contact',
      label: 'Contact Info',
      admin: { description: 'Changing this updates the phone number and email everywhere on the site — footer, nav, contact form, quote estimator.' },
      fields: [
        {
          name: 'phone',
          type: 'text',
          required: true,
          defaultValue: '305-304-9579',
          admin: { description: 'Format: 305-304-9579' },
        },
        {
          name: 'email',
          type: 'email',
          required: true,
          defaultValue: 'cmsawyer12@gmail.com',
        },
      ],
    },
    {
      name: 'serviceAreas',
      type: 'array',
      label: 'Service Areas',
      admin: { description: 'Cities/neighborhoods shown in the footer, contact page, and sent to Google for local search.' },
      fields: [
        { name: 'city', type: 'text', required: true },
      ],
      defaultValue: [
        { city: 'St. Petersburg' }, { city: 'Tampa' }, { city: 'Clearwater' }, { city: 'Gulfport' },
        { city: 'St. Pete Beach' }, { city: 'Treasure Island' }, { city: 'Pinellas Park' },
        { city: 'Seminole' }, { city: 'South Tampa' }, { city: 'Kenneth City' },
      ],
    },
    {
      name: 'aboutPhoto',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Portrait shown on the About page. Falls back to a placeholder icon until set.' },
    },
  ],
}
