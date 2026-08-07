import type { CollectionConfig } from 'payload'

export const JournalPosts: CollectionConfig = {
  slug: 'journal-posts',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'publishedAt', '_status'],
  },
  versions: {
    drafts: {
      autosave: { interval: 30000 },
    },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
        description: 'URL-friendly name, e.g. "deep-clean-tips". No spaces or special characters.',
      },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      admin: {
        description: 'Short summary shown on the journal listing page.',
      },
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Cleaning Tips', value: 'cleaning-tips' },
        { label: 'Behind the Scenes', value: 'behind-the-scenes' },
        { label: 'Giving Back', value: 'giving-back' },
        { label: 'Home Organization', value: 'home-organization' },
        { label: 'Announcements', value: 'announcements' },
      ],
    },
    {
      name: 'content',
      type: 'richText',
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayOnly', displayFormat: 'MMM d, yyyy' },
      },
    },
  ],
}
