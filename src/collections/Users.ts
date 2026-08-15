import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
    group: 'System',
    description: 'Admin accounts that can log into this dashboard. Not shown anywhere on the public site.',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
    },
  ],
}
