import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.vercel-storage.com' },
      { protocol: 'https', hostname: '*.public.blob.vercel-storage.com' },
    ],
  },
  async redirects() {
    // Keep old .html URLs working
    const pages = [
      'about', 'services', 'pricing', 'work', 'giving-back',
      'faq', 'journal', 'contact', 'policies',
      'residential-cleaning', 'deep-cleaning', 'home-organization',
      'move-in-move-out', 'small-business-cleaning',
    ]
    return pages.map(p => ({
      source: `/${p}.html`,
      destination: `/${p}`,
      permanent: true,
    }))
  },
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
