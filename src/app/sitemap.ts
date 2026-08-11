import type { MetadataRoute } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'

const BASE_URL = 'https://shine-for-good.com'

const STATIC_ROUTES: { path: string; priority: number; changeFrequency: 'monthly' | 'weekly' }[] = [
  { path: '/', priority: 1.0, changeFrequency: 'monthly' },
  { path: '/services', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/residential-cleaning', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/deep-cleaning', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/home-organization', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/move-in-move-out', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/small-business-cleaning', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/pricing', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/work', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/giving-back', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/about', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/faq', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/journal', priority: 0.7, changeFrequency: 'weekly' },
  { path: '/contact', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/policies', priority: 0.3, changeFrequency: 'monthly' },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map(route => ({
    url: `${BASE_URL}${route.path}`,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }))

  let journalEntries: MetadataRoute.Sitemap = []
  try {
    const payload = await getPayload({ config })
    const { docs } = await payload.find({
      collection: 'journal-posts',
      where: { _status: { equals: 'published' } },
      limit: 100,
      select: { slug: true, publishedAt: true, updatedAt: true },
    })
    journalEntries = docs.map(doc => ({
      url: `${BASE_URL}/journal/${doc.slug}`,
      lastModified: doc.updatedAt ? new Date(doc.updatedAt) : undefined,
      changeFrequency: 'monthly',
      priority: 0.6,
    }))
  } catch {
    journalEntries = []
  }

  return [...staticEntries, ...journalEntries]
}
