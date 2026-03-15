'use client'
// src/app/announcements/[slug]/page.tsx
// SEO-optimized detail page for Announcements

import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import { OthersPost, getPostBySlug, getMetaTitle, getMetaDesc, generateJsonLd } from '@/lib/others-db'

const G = '#c9a227', T = '#1dbfad', N = '#0b1f33', W = '#ffffff'
const TYPE = 'announcement' as const
const PATH = 'announcements'

export default function AnnouncementDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const [post, setPost] = useState<OthersPost | null | undefined>(undefined)

  useEffect(() => {
    const found = getPostBySlug(TYPE, slug)
    setPost(found)

    if (found) {
      // Set document title
      document.title = getMetaTitle(found)

      // Set meta description
      let metaDesc = document.querySelector('meta[name="description"]')
      if (!metaDesc) { metaDesc = document.createElement('meta'); metaDesc.setAttribute('name', 'description'); document.head.appendChild(metaDesc) }
      metaDesc.setAttribute('content', getMetaDesc(found))

      // Open Graph tags
      const ogTags: [string, string][] = [
        ['og:title', getMetaTitle(found)],
        ['og:description', getMetaDesc(found)],
        ['og:type', 'article'],
        ['og:url', `https://assamcareerpoint-info.com/${PATH}/${found.slug}`],
        ['og:site_name', 'Assam Career Point & Info'],
      ]
      ogTags.forEach(([prop, content]) => {
        let el = document.querySelector(`meta[property="${prop}"]`) as HTMLMetaElement | null
        if (!el) { el = document.createElement('meta'); el.setAttribute('property', prop); document.head.appendChild(el) }
        el.setAttribute('content', content)
      })

      // JSON-LD schema
      const existing = document.getElementById('acp-jsonld')
      if (existing) existing.remove()
      const script = document.createElement('script')
      script.id = 'acp-jsonld'
      script.type = 'application/ld+json'
      script.text = JSON.stringify(generateJsonLd(found))
      document.head.appendChild(script)
    }
  }, [slug])

  // Loading
  if (post === undefined) {
    return (
      <>
        <header style={{ background: N, borderBottom: `3px solid ${G}`, padding: '12px 20px' }}>
          <Link href="/" style={{ fontFamily: 'Arial Black,sans-serif', fontSize: '.9rem', textDecoration: 'none' }}>
            <span style={{ color: G }}>ASSAM </span><span style={{ color: W }}>CAREER</span><span style={{ color: T }}> POINT</span>
          </Link>
        </header>
        <div style={{ textAlign: 'center', padding: 80, color: '#8fa3b8', fontFamily: 'Nunito,sans-serif' }}>Loading...</div>
      </>
    )
  }

  // Not found
  if (!post) {
    return (
      <>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800&family=Nunito:wght@400;600;700&display=swap');*{box-sizing:border-box}body{margin:0;font-family:Nunito,sans-serif;background:#f0f4f8}`}</style>
        <header style={{ background: N, borderBottom: `3px solid ${G}`, padding: '12px 20px' }}>
          <Link href="/" style={{ fontFamily: 'Arial Black,sans-serif', fontSize: '.9rem', textDecoration: 'none' }}>
            <span style={{ color: G }}>ASSAM </span><span style={{ color: W }}>CAREER</span><span style={{ color: T }}> POINT</span>
          </Link>
        </header>
        <div style={{ textAlign: 'center', padding: '80px 20px', fontFamily: 'Nunito,sans-serif' }}>
          <div style={{ fontSize: '3rem', marginBottom: 12 }}>😕</div>
          <h1 style={{ fontFamily: 'Sora,sans-serif', color: N, fontSize: '1.4rem' }}>Post not found</h1>
          <Link href={`/${PATH}`} style={{ color: T, fontWeight: 700 }}>← Back to Announcements</Link>
        </div>
      </>
    )
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800&family=Nunito:wght@400;600;700&display=swap');
        * { box-sizing: border-box }
        body { margin: 0; font-family: Nunito, sans-serif; background: #f0f4f8 }
        .sec-card { background: #fff; border-radius: 12px; border: 1.5px solid #e8eef4; overflow: hidden; margin-bottom: 18px; }
        .link-row:hover { background: #f0faf9 !important; }
      `}</style>

      {/* Header */}
      <header style={{ background: N, borderBottom: `3px solid ${G}`, padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ fontFamily: 'Arial Black,sans-serif', fontSize: '.9rem', textDecoration: 'none' }}>
          <span style={{ color: G }}>ASSAM </span><span style={{ color: W }}>CAREER</span><span style={{ color: T }}> POINT</span>
        </Link>
        <nav style={{ display: 'flex', gap: 16 }}>
          {[['/', 'Home'], ['/govt-jobs', 'Jobs'], ['/exams', 'Exams'], [`/${PATH}`, 'Announcements']].map(([href, label]) => (
            <Link key={href} href={href} style={{ color: '#b0c4d8', textDecoration: 'none', fontSize: '.82rem', fontWeight: 700 }}>{label}</Link>
          ))}
        </nav>
      </header>

      {/* Breadcrumb */}
      <div style={{ background: W, borderBottom: '1px solid #e8eef4', padding: '10px 20px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto', fontSize: '.78rem', color: '#8fa3b8', display: 'flex', gap: 6, alignItems: 'center' }}>
          <Link href="/" style={{ color: '#8fa3b8', textDecoration: 'none' }}>Home</Link>
          <span>›</span>
          <Link href={`/${PATH}`} style={{ color: '#8fa3b8', textDecoration: 'none' }}>Announcements</Link>
          <span>›</span>
          <span style={{ color: N }}>{post.title}</span>
        </div>
      </div>

      {/* Hero */}
      <div style={{ background: `linear-gradient(135deg, ${N} 0%, #0d2d4a 100%)`, padding: '32px 20px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: 12 }}>
            <span style={{ padding: '3px 12px', borderRadius: 20, background: '#e74c3c', color: W, fontSize: '.72rem', fontWeight: 800, fontFamily: 'Arial Black,sans-serif' }}>
              📢 ANNOUNCEMENT
            </span>
            {post.category && (
              <span style={{ padding: '3px 12px', borderRadius: 20, background: G + '33', color: G, fontSize: '.72rem', fontWeight: 700 }}>{post.category}</span>
            )}
          </div>
          <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
            <span style={{ fontSize: '2.5rem', flexShrink: 0 }}>{post.emoji}</span>
            <div>
              <h1 style={{ fontFamily: 'Sora,sans-serif', fontWeight: 800, color: W, fontSize: '1.5rem', margin: '0 0 8px', lineHeight: 1.3 }}>
                {post.title}
              </h1>
              {post.titleAs && (
                <div style={{ color: '#8fa3b8', fontSize: '.9rem', marginBottom: 8 }}>{post.titleAs}</div>
              )}
              {post.description && (
                <p style={{ color: '#b0c4d8', fontSize: '.9rem', margin: '0 0 8px', lineHeight: 1.7 }}>{post.description}</p>
              )}
              <div style={{ fontSize: '.75rem', color: '#6a8099' }}>
                Published: {new Date(post.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                {post.updatedAt && post.updatedAt !== post.createdAt && ` · Updated: ${new Date(post.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '28px 16px 60px' }}>

        {/* Assamese description */}
        {post.descriptionAs && (
          <div style={{ background: '#fdf9ee', border: `1.5px solid ${G}44`, borderRadius: 12, padding: '14px 18px', marginBottom: 20 }}>
            <p style={{ margin: 0, fontSize: '.9rem', color: '#5a3a00', lineHeight: 1.8 }}>{post.descriptionAs}</p>
          </div>
        )}

        {/* Sections */}
        {post.sections.map((sec, idx) => (
          <div key={sec.id} className="sec-card">
            {/* Section header */}
            <div style={{ background: `linear-gradient(90deg, ${N}ee, #0d2d4a)`, padding: '12px 18px' }}>
              <h2 style={{ fontFamily: 'Sora,sans-serif', fontWeight: 700, color: W, fontSize: '1rem', margin: 0 }}>
                {sec.title || `Section ${idx + 1}`}
              </h2>
            </div>

            <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Content */}
              {sec.content && (
                <div style={{ color: '#3a5068', fontSize: '.9rem', lineHeight: 1.8, whiteSpace: 'pre-line' }}>
                  {sec.content}
                </div>
              )}

              {/* Links table */}
              {sec.links.length > 0 && (
                <div>
                  <div style={{ fontSize: '.78rem', fontWeight: 800, color: '#3a5068', marginBottom: 8, textTransform: 'uppercase', letterSpacing: .5 }}>
                    🔗 Important Links
                  </div>
                  <div style={{ border: '1.5px solid #e8eef4', borderRadius: 10, overflow: 'hidden' }}>
                    {sec.links.map((lnk, li) => (
                      <a key={lnk.id} href={lnk.url} target="_blank" rel="noopener noreferrer"
                        className="link-row"
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          padding: '11px 16px', borderBottom: li < sec.links.length - 1 ? '1px solid #f0f4f8' : 'none',
                          textDecoration: 'none', background: W, transition: 'background .15s',
                        }}>
                        <span style={{ fontSize: '.88rem', fontWeight: 600, color: N }}>{lnk.label}</span>
                        <span style={{ fontSize: '.78rem', fontWeight: 700, color: T, fontFamily: 'Arial Black,sans-serif' }}>Click Here →</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* PDF download */}
              {sec.pdfLink && (
                <a href={sec.pdfLink} target="_blank" rel="noopener noreferrer" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 20px',
                  borderRadius: 30, background: N, color: G, fontWeight: 900, textDecoration: 'none',
                  fontSize: '.84rem', fontFamily: 'Arial Black,sans-serif', alignSelf: 'flex-start',
                }}>
                  📄 {sec.pdfName || 'Download PDF'}
                </a>
              )}
            </div>
          </div>
        ))}

        {/* Affiliate box */}
        {post.affiliateLink && (
          <div style={{
            background: `linear-gradient(135deg, ${G}18, ${T}18)`,
            border: `2px solid ${G}44`, borderRadius: 14, padding: '20px 22px',
            marginTop: 8, textAlign: 'center',
          }}>
            <div style={{ fontSize: '1.3rem', marginBottom: 6 }}>📚</div>
            <div style={{ fontFamily: 'Sora,sans-serif', fontWeight: 700, color: N, fontSize: '1rem', marginBottom: 6 }}>
              Prepare for this exam with the best resources
            </div>
            <a href={post.affiliateLink} target="_blank" rel="noopener noreferrer" style={{
              display: 'inline-block', padding: '11px 28px', borderRadius: 30, background: G,
              color: N, fontWeight: 900, textDecoration: 'none', fontFamily: 'Arial Black,sans-serif', fontSize: '.86rem',
            }}>{post.affiliateLinkText || 'Start Preparation →'}</a>
          </div>
        )}

        {/* Back button */}
        <div style={{ marginTop: 24 }}>
          <Link href={`/${PATH}`} style={{ color: T, fontWeight: 700, textDecoration: 'none', fontSize: '.88rem' }}>
            ← Back to Announcements
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ background: N, color: '#8fa3b8', textAlign: 'center', padding: '20px', fontSize: '.78rem' }}>
        <div>© 2025–2026 Assam Career Point &amp; Info — <Link href="/privacy-policy" style={{ color: '#8fa3b8' }}>Privacy Policy</Link></div>
      </footer>
    </>
  )
}
