import { postgresAdapter } from '@payloadcms/db-postgres'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { JournalPosts } from './collections/JournalPosts'
import { BeforeAfter } from './collections/BeforeAfter'
import { WorkGallery } from './collections/WorkGallery'
import { Events } from './collections/Events'
import { Reviews } from './collections/Reviews'
import { SiteSettings } from './globals/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: '— Shine for Good',
    },
    components: {
      beforeDashboard: ['@/components/AdminDashboardStats#AdminDashboardStats'],
    },
    livePreview: {
      collections: ['journal-posts', 'before-after', 'work-gallery'],
      globals: ['site-settings'],
      breakpoints: [
        { label: 'Mobile', name: 'mobile', width: 375, height: 667 },
        { label: 'Desktop', name: 'desktop', width: 1440, height: 900 },
      ],
      url: ({ data, collectionConfig, globalConfig }) => {
        const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || ''
        if (collectionConfig?.slug === 'journal-posts' && data?.slug) {
          return `${serverURL}/next/preview?path=${encodeURIComponent(`/journal/${data.slug}`)}`
        }
        if (collectionConfig?.slug === 'before-after' || collectionConfig?.slug === 'work-gallery') {
          return `${serverURL}/work`
        }
        if (globalConfig?.slug === 'site-settings') {
          return `${serverURL}/about`
        }
        return serverURL
      },
    },
  },
  collections: [Users, Media, JournalPosts, BeforeAfter, WorkGallery, Events, Reviews],
  globals: [SiteSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
      max: process.env.NODE_ENV === 'production' ? 10 : 2,
      connectionTimeoutMillis: 10000,
      idleTimeoutMillis: 10000,
      allowExitOnIdle: true,
    },
  }),
  sharp,
  plugins: [
    ...(process.env.BLOB_READ_WRITE_TOKEN
      ? [
          vercelBlobStorage({
            collections: { media: true },
            token: process.env.BLOB_READ_WRITE_TOKEN,
          }),
        ]
      : []),
  ],
})
