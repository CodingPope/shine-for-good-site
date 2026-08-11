import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import Link from 'next/link'
import Image from 'next/image'
import type { JournalPost, Media } from '@/payload-types'

export const metadata: Metadata = {
  title: 'Journal',
  description: 'Cleaning tips, behind-the-scenes stories, and updates from Shine for Good.',
}

export const revalidate = 60

export default async function JournalPage() {
  let posts: JournalPost[] = []
  try {
    const payload = await getPayload({ config })
    const { docs } = await payload.find({
      collection: 'journal-posts',
      where: { _status: { equals: 'published' } },
      sort: '-publishedAt',
      limit: 24,
      depth: 1,
    })
    posts = docs
  } catch {
    posts = []
  }

  return (
    <>
      <header className="page-hero">
        <div className="wash wash--a" aria-hidden="true" />
        <div className="wash wash--b" aria-hidden="true" />
        <div className="wrap">
          <div className="page-hero-inner">
            <nav className="crumbs" aria-label="Breadcrumb">
              <Link href="/">Home</Link><i aria-hidden="true">/</i>
              <span aria-current="page">Journal</span>
            </nav>
            <p className="eyebrow">From Chelsea</p>
            <h1>Journal</h1>
            <div className="orn orn--left" aria-hidden="true"><i /></div>
            <p className="lede">Cleaning tips, home organization ideas, and stories from behind the scenes.</p>
          </div>
        </div>
      </header>

      <section className="sec">
        <div className="wrap">
          {posts.length === 0 ? (
            <div className="rv" style={{ textAlign: 'center', padding: '4rem 0' }}>
              <p className="lede">No posts yet — check back soon.</p>
            </div>
          ) : (
            <div className="cards">
              {posts.map((post) => {
              const cover = (post.coverImage as Media) ?? null
                return (
                  <Link key={post.id} className="card rv" href={`/journal/${post.slug}`}>
                    {cover?.url && (
                      <div style={{ aspectRatio: '16/9', overflow: 'hidden', borderRadius: '.5rem', marginBottom: '1rem' }}>
                        <Image
                          src={cover.url}
                          alt={cover.alt || post.title}
                          width={600}
                          height={338}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                    )}
                    {post.category && (
                      <p className="eyebrow" style={{ marginBottom: '.4rem' }}>{post.category.replace(/-/g, ' ')}</p>
                    )}
                    <h3>{post.title}</h3>
                    {post.excerpt && <p>{post.excerpt}</p>}
                    <span className="post-more">Read more <i /></span>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
