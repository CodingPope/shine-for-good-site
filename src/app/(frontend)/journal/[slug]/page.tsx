import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'

export const revalidate = 60

export async function generateStaticParams() {
  try {
    const payload = await getPayload({ config })
    const { docs } = await payload.find({
      collection: 'journal-posts',
      where: { _status: { equals: 'published' } },
      limit: 100,
      select: { slug: true },
    })
    return docs.map(doc => ({ slug: doc.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'journal-posts',
    where: { slug: { equals: slug }, _status: { equals: 'published' } },
    limit: 1,
    depth: 1,
  })
  const post = docs[0]
  if (!post) return { title: 'Post not found' }
  return {
    title: post.title,
    description: post.excerpt || undefined,
  }
}

export default async function JournalPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'journal-posts',
    where: { slug: { equals: slug }, _status: { equals: 'published' } },
    limit: 1,
    depth: 2,
  })

  const post = docs[0]
  if (!post) notFound()

  const cover = (post.coverImage as any) ?? null
  const publishedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : null

  return (
    <>
      <header className="page-hero">
        <div className="wash wash--a" aria-hidden="true" />
        <div className="wash wash--b" aria-hidden="true" />
        <div className="wrap">
          <div className="page-hero-inner">
            <nav className="crumbs" aria-label="Breadcrumb">
              <Link href="/">Home</Link><i aria-hidden="true">/</i>
              <Link href="/journal">Journal</Link><i aria-hidden="true">/</i>
              <span aria-current="page">{post.title}</span>
            </nav>
            {post.category && (
              <p className="eyebrow">{post.category.replace(/-/g, ' ')}</p>
            )}
            <h1>{post.title}</h1>
            <div className="orn orn--left" aria-hidden="true"><i /></div>
            {publishedDate && <p className="lede" style={{ fontSize: '.9rem', opacity: .7 }}>{publishedDate}</p>}
          </div>
        </div>
      </header>

      <section className="sec">
        <div className="wrap">
          <div className="split">
            <div className="rv rv-d2" style={{ maxWidth: '72ch' }}>
              {cover?.url && (
                <Image
                  src={cover.url}
                  alt={cover.alt || post.title}
                  width={900}
                  height={500}
                  style={{ width: '100%', height: 'auto', borderRadius: '.75rem', marginBottom: '2.4rem' }}
                  priority
                />
              )}
              {post.excerpt && (
                <p className="lede" style={{ marginBottom: '2rem' }}>{post.excerpt}</p>
              )}
              {/* Rich text content rendered as HTML */}
              {post.content && (
                <div className="prose" style={{ lineHeight: 1.7 }}>
                  <RichTextRenderer content={post.content} />
                </div>
              )}
              <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--rule)' }}>
                <Link className="post-more" href="/journal">← Back to journal <i /></Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

// Simple rich text renderer for Lexical output
function RichTextRenderer({ content }: { content: any }) {
  if (!content?.root?.children) return null
  return (
    <>
      {content.root.children.map((node: any, i: number) => (
        <LexicalNode key={i} node={node} />
      ))}
    </>
  )
}

function LexicalNode({ node }: { node: any }) {
  if (node.type === 'paragraph') {
    const text = node.children?.map((c: any) => c.text || '').join('') || ''
    return text ? <p>{text}</p> : null
  }
  if (node.type === 'heading') {
    const text = node.children?.map((c: any) => c.text || '').join('') || ''
    const tags: Record<string, React.ElementType> = { h1: 'h1', h2: 'h2', h3: 'h3', h4: 'h4' }
    const Tag = tags[node.tag] || 'h2'
    return <Tag>{text}</Tag>
  }
  if (node.type === 'list') {
    const Tag: React.ElementType = node.listType === 'number' ? 'ol' : 'ul'
    return (
      <Tag>
        {node.children?.map((item: any, i: number) => (
          <li key={i}>{item.children?.map((c: any) => c.text || '').join('') || ''}</li>
        ))}
      </Tag>
    )
  }
  return null
}
