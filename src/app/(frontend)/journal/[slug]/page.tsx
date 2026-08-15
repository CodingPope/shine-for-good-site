import type { Metadata } from 'next'
import { Fragment } from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { draftMode } from 'next/headers'
import { RefreshRouteOnSave } from '@/components/RefreshRouteOnSave'
import { getSiteSettings } from '@/lib/getSiteSettings'
import type { JournalPost, Media } from '@/payload-types'

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
  const cover = (post.coverImage as Media) ?? null
  return {
    title: post.title,
    description: post.excerpt || undefined,
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.excerpt || undefined,
      publishedTime: post.publishedAt || undefined,
      images: cover?.url ? [cover.url] : undefined,
    },
  }
}

export default async function JournalPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { isEnabled: isDraftMode } = await draftMode()
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'journal-posts',
    where: isDraftMode
      ? { slug: { equals: slug } }
      : { slug: { equals: slug }, _status: { equals: 'published' } },
    limit: 1,
    depth: 2,
    draft: isDraftMode,
  })

  const post = docs[0]
  if (!post) notFound()

  const { phone } = await getSiteSettings()
  const cover = (post.coverImage as Media) ?? null
  const publishedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : null

  return (
    <>
      {isDraftMode && (
        <>
          <RefreshRouteOnSave />
          <div style={{ background: 'var(--moss-deep)', color: '#F4F0E6', textAlign: 'center', padding: '.6rem 1rem', fontSize: '.8rem' }}>
            Draft preview — this content isn&apos;t published yet.{' '}
            <a href="/next/exit-preview" style={{ color: 'inherit', textDecoration: 'underline' }}>Exit preview</a>
          </div>
        </>
      )}
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
                  <div className="prose-cta">
                    <span className="body-s" style={{ flex: 1, minWidth: 200 }}>Ready to hand it over? Build an estimate in under a minute.</span>
                    <Link className="btn btn--solid" href="/pricing">Get an estimate</Link>
                    <a className="btn btn--ghost" href={`tel:+1${phone.replace(/\D/g, '')}`}>Call Chelsea</a>
                  </div>
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

// Minimal shape for Lexical's serialized AST — Payload's own generated types
// leave nested node shapes as `any`, so we define our own for the renderer.
interface LexicalASTNode {
  type: string
  tag?: string
  listType?: 'bullet' | 'number'
  format?: number
  text?: string
  children?: LexicalASTNode[]
}

// Simple rich text renderer for Lexical output
function RichTextRenderer({ content }: { content: JournalPost['content'] }) {
  const children = content?.root?.children as LexicalASTNode[] | undefined
  if (!children) return null
  return (
    <>
      {children.map((node, i) => (
        <LexicalNode key={i} node={node} />
      ))}
    </>
  )
}

// Lexical text format bitmask: bold=1, italic=2, strikethrough=4, underline=8, code=16
function renderInline(children: LexicalASTNode[] = []): React.ReactNode {
  return children.map((c, i) => {
    if (c.type === 'linebreak') return <br key={i} />
    const format = c.format || 0
    let inner: React.ReactNode = c.text ?? ''
    if (format & 16) inner = <code>{inner}</code>
    if (format & 2) inner = <em>{inner}</em>
    if (format & 1) inner = <strong>{inner}</strong>
    if (format & 8) inner = <u>{inner}</u>
    return <Fragment key={i}>{inner}</Fragment>
  })
}

function LexicalNode({ node }: { node: LexicalASTNode }) {
  if (node.type === 'paragraph') {
    return node.children?.length ? <p>{renderInline(node.children)}</p> : null
  }
  if (node.type === 'heading') {
    const tags: Record<string, React.ElementType> = { h1: 'h1', h2: 'h2', h3: 'h3', h4: 'h4' }
    const Tag = (node.tag && tags[node.tag]) || 'h2'
    return <Tag>{renderInline(node.children)}</Tag>
  }
  if (node.type === 'quote') {
    return <blockquote>{renderInline(node.children)}</blockquote>
  }
  if (node.type === 'list') {
    const Tag: React.ElementType = node.listType === 'number' ? 'ol' : 'ul'
    return (
      <Tag>
        {node.children?.map((item, i) => (
          <li key={i}>{renderInline(item.children)}</li>
        ))}
      </Tag>
    )
  }
  return null
}
