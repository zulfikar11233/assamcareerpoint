'use client'
// src/app/results/[slug]/page.tsx
// ✅ SEO slugs with fallback to numeric ID
import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import {
  ResultPost, getResultBySlug,
  getResultMetaTitle, getResultMetaDesc, generateResultJsonLd,
} from '@/lib/results-db'

const G = '#c9a227', T = '#1dbfad', N = '#0b1f33', W = '#ffffff'

function catColor(cat: string) {
  const map: Record<string, string> = {
    'Merit List': '#2980b9', 'Final Result': '#27ae60',
    'Answer Key': '#8e44ad', 'Cut-off Marks': '#e67e22',
    'Admit Card': '#c0392b', 'Interview List': T,
    'Document Verification': '#16a085', 'Waiting List': '#7f8c8d',
  }
  return map[cat] || '#3a5068'
}

export default function ResultDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)                     // ← slug from URL (can be slug or numeric ID)
  const [post, setPost] = useState<ResultPost | null | undefined>(undefined)

  useEffect(() => {
    // getResultBySlug should already handle both slug and numeric ID fallback
    // If not, you can modify that function to also check String(result.id) === slug
    const found = getResultBySlug(slug)
    setPost(found)

    if (found) {
      // Page title
      document.title = getResultMetaTitle(found)

      // Meta description
      let metaDesc = document.querySelector('meta[name="description"]') as HTMLMetaElement | null
      if (!metaDesc) {
        metaDesc = document.createElement('meta')
        metaDesc.setAttribute('name', 'description')
        document.head.appendChild(metaDesc)
      }
      metaDesc.setAttribute('content', getResultMetaDesc(found))

      // Open Graph tags
      const ogTags: [string, string][] = [
        ['og:title',       getResultMetaTitle(found)],
        ['og:description', getResultMetaDesc(found)],
        ['og:type',        'article'],
        ['og:url',         `https://assamcareerpoint-info.com/results/${found.slug || found.id}`],
        ['og:site_name',   'Assam Career Point & Info'],
      ]
      ogTags.forEach(([prop, content]) => {
        let el = document.querySelector(`meta[property="${prop}"]`) as HTMLMetaElement | null
        if (!el) {
          el = document.createElement('meta')
          el.setAttribute('property', prop)
          document.head.appendChild(el)
        }
        el.setAttribute('content', content)
      })

      // JSON-LD structured data
      const existing = document.getElementById('acp-result-jsonld')
      if (existing) existing.remove()
      const script = document.createElement('script')
      script.id = 'acp-result-jsonld'
      script.type = 'application/ld+json'
      script.text = JSON.stringify(generateResultJsonLd(found))
      document.head.appendChild(script)
    }
  }, [slug])

  // Loading state
  if (post === undefined) {
    return (
      <>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap');*{box-sizing:border-box}body{margin:0;font-family:Nunito,sans-serif;background:#f0f4f8}`}</style>
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
          <h1 style={{ fontFamily: 'Sora,sans-serif', color: N, fontSize: '1.4rem', marginBottom: 12 }}>Result not found</h1>
          <Link href="/results" style={{ color: T, fontWeight: 700, textDecoration: 'none' }}>← Back to Results</Link>
        </div>
      </>
    )
  }

  const color = catColor(post.category)

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800&family=Nunito:wght@400;600;700&display=swap');
        * { box-sizing: border-box }
        body { margin: 0; font-family: Nunito, sans-serif; background: #f0f4f8 }
        .sec-card { background: #fff; border-radius: 13px; border: 1.5px solid #e8eef4; overflow: hidden; margin-bottom: 18px; }
        .link-row:hover { background: #f0faf9 !important; }
        .link-row { transition: background .15s; }
      `}</style>

      {/* Header */}
      <header style={{ background: N, borderBottom: `3px solid ${G}`, padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ fontFamily: 'Arial Black,sans-serif', fontSize: '.9rem', textDecoration: 'none' }}>
          <span style={{ color: G }}>ASSAM </span><span style={{ color: W }}>CAREER</span><span style={{ color: T }}> POINT</span>
        </Link>
        <nav style={{ display: 'flex', gap: 18 }}>
          {[['/', 'Home'], ['/govt-jobs', 'Govt Jobs'], ['/exams', 'Exams'], ['/results', 'Results']].map(([href, label]) => (
            <Link key={href} href={href} style={{ color: '#b0c4d8', textDecoration: 'none', fontSize: '.82rem', fontWeight: 700 }}>{label}</Link>
          ))}
        </nav>
      </header>

      {/* Breadcrumb */}
      <div style={{ background: W, borderBottom: '1px solid #e8eef4', padding: '10px 24px' }}>
        <div style={{ maxWidth: 880, margin: '0 auto', fontSize: '.78rem', color: '#8fa3b8', display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
          <Link href="/" style={{ color: '#8fa3b8', textDecoration: 'none' }}>Home</Link>
          <span>›</span>
          <Link href="/results" style={{ color: '#8fa3b8', textDecoration: 'none' }}>Results</Link>
          <span>›</span>
          <span style={{ color: N }}>{post.title}</span>
        </div>
      </div>

      {/* Hero banner */}
      <div style={{ background: `linear-gradient(135deg, ${N} 0%, #102a45 100%)`, padding: '34px 24px' }}>
        <div style={{ maxWidth: 880, margin: '0 auto' }}>
          {/* Badges */}
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: 14 }}>
            <span style={{ padding: '4px 14px', borderRadius: 20, background: color, color: W, fontSize: '.72rem', fontWeight: 800, fontFamily: 'Arial Black,sans-serif' }}>
              📊 {post.category.toUpperCase()}
            </span>
            {post.org && (
              <span style={{ padding: '4px 14px', borderRadius: 20, background: G + '33', color: G, fontSize: '.72rem', fontWeight: 700 }}>
                {post.org}
              </span>
            )}
            {post.totalPosts && (
              <span style={{ padding: '4px 14px', borderRadius: 20, background: '#ffffff18', color: '#d4e0ec', fontSize: '.72rem', fontWeight: 700 }}>
                👥 {post.totalPosts} Posts
              </span>
            )}
          </div>

          {/* Title + emoji */}
          <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
            <span style={{ fontSize: '2.6rem', flexShrink: 0 }}>{post.emoji}</span>
            <div>
              <h1 style={{ fontFamily: 'Sora,sans-serif', fontWeight: 800, color: W, fontSize: '1.55rem', margin: '0 0 8px', lineHeight: 1.3 }}>
                {post.title}
              </h1>
              {post.titleAs && (
                <div style={{ color: '#8fa3b8', fontSize: '.9rem', marginBottom: 8 }}>{post.titleAs}</div>
              )}
              {post.description && (
                <p style={{ color: '#b0c4d8', fontSize: '.9rem', margin: '0 0 10px', lineHeight: 1.7 }}>
                  {post.description}
                </p>
              )}
              {/* Dates */}
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: '.75rem', color: '#6a8099' }}>
                {post.resultDate && (
                  <span>📅 Result Date: <strong style={{ color: '#8fa3b8' }}>{new Date(post.resultDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</strong></span>
                )}
                <span>🕐 Published: <strong style={{ color: '#8fa3b8' }}>{new Date(post.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</strong></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 880, margin: '0 auto', padding: '28px 16px 60px' }}>

        {/* Assamese description box */}
        {post.descriptionAs && (
          <div style={{ background: '#fdf9ee', border: `1.5px solid ${G}44`, borderRadius: 12, padding: '14px 20px', marginBottom: 22 }}>
            <p style={{ margin: 0, fontSize: '.92rem', color: '#5a3a00', lineHeight: 1.9 }}>{post.descriptionAs}</p>
          </div>
        )}

        {/* Sections */}
        {post.sections.map((sec, idx) => (
          <div key={sec.id} className="sec-card">
            <div style={{ background: `linear-gradient(90deg, ${N}, #102a45)`, padding: '13px 20px', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 24, height: 24, borderRadius: 6, background: color, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '.75rem', fontWeight: 800, color: W, flexShrink: 0 }}>
                {idx + 1}
              </span>
              <h2 style={{ fontFamily: 'Sora,sans-serif', fontWeight: 700, color: W, fontSize: '1rem', margin: 0 }}>
                {sec.title || `Section ${idx + 1}`}
              </h2>
            </div>

            <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              {sec.content && (
                <div style={{ color: '#3a5068', fontSize: '.92rem', lineHeight: 1.85, whiteSpace: 'pre-line' }}>
                  {sec.content}
                </div>
              )}

              {sec.links.length > 0 && (
                <div>
                  <div style={{ fontSize: '.76rem', fontWeight: 800, color: '#3a5068', marginBottom: 8, textTransform: 'uppercase', letterSpacing: .5 }}>
                    🔗 Important Links
                  </div>
                  <div style={{ border: '1.5px solid #e8eef4', borderRadius: 10, overflow: 'hidden' }}>
                    {sec.links.map((lnk, li) => (
                      <a key={lnk.id} href={lnk.url} target="_blank" rel="noopener noreferrer"
                        className="link-row"
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          padding: '12px 18px',
                          borderBottom: li < sec.links.length - 1 ? '1px solid #f0f4f8' : 'none',
                          textDecoration: 'none', background: W,
                        }}>
                        <span style={{ fontSize: '.9rem', fontWeight: 600, color: N }}>
                          {lnk.label || lnk.url}
                        </span>
                        <span style={{ fontSize: '.78rem', fontWeight: 800, color: T, fontFamily: 'Arial Black,sans-serif', whiteSpace: 'nowrap' }}>
                          Click Here →
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {sec.pdfLink && (
                <div>
                  <a href={sec.pdfLink} target="_blank" rel="noopener noreferrer" style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    padding: '11px 22px', borderRadius: 30,
                    background: N, color: G, fontWeight: 900,
                    textDecoration: 'none', fontSize: '.84rem',
                    fontFamily: 'Arial Black,sans-serif',
                    boxShadow: '0 4px 14px rgba(0,0,0,.15)',
                  }}>
                    📄 {sec.pdfName || 'Download PDF'}
                  </a>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Affiliate promo box */}
        {post.affiliateLink && (
          <div style={{
            background: `linear-gradient(135deg, ${G}14, ${T}14)`,
            border: `2px solid ${G}44`, borderRadius: 14,
            padding: '22px 24px', textAlign: 'center', marginTop: 8,
          }}>
            <div style={{ fontSize: '1.4rem', marginBottom: 8 }}>📚</div>
            <div style={{ fontFamily: 'Sora,sans-serif', fontWeight: 700, color: N, fontSize: '1.05rem', marginBottom: 6 }}>
              Prepare for your next exam
            </div>
            <div style={{ color: '#5a6a7a', fontSize: '.86rem', marginBottom: 14 }}>
              Get the best study material and mock tests
            </div>
            <a href={post.affiliateLink} target="_blank" rel="noopener noreferrer" style={{
              display: 'inline-block', padding: '12px 30px', borderRadius: 30,
              background: G, color: N, fontWeight: 900, textDecoration: 'none',
              fontFamily: 'Arial Black,sans-serif', fontSize: '.88rem',
            }}>
              {post.affiliateLinkText || 'Start Preparation →'}
            </a>
          </div>
        )}

        {/* Back button */}
        <div style={{ marginTop: 26 }}>
          <Link href="/results" style={{ color: T, fontWeight: 700, textDecoration: 'none', fontSize: '.9rem' }}>
            ← Back to Results
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ background: N, color: '#8fa3b8', textAlign: 'center', padding: '20px', fontSize: '.78rem' }}>
        © 2025–2026 Assam Career Point &amp; Info — Informational portal only, verify from official sources.
        {' '}<Link href="/privacy-policy" style={{ color: '#8fa3b8' }}>Privacy Policy</Link>
      </footer>
    </>
  )
}