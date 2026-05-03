'use client'
// src/app/services/[slug]/ServiceDetail.tsx
// ✅ PageSpeed fixes + RichContent for TinyMCE
import Link from 'next/link'
import { useEffect } from 'react'

const G = '#c9a227', T = '#1dbfad', N = '#0b1f33', W = '#ffffff'
const PATH = 'services'

// ─────────────────────────────────────────────────────────────
// RichContent helper – renders HTML from TinyMCE or plain text
// ─────────────────────────────────────────────────────────────
function RichContent({ content, className, style }: { content?: string | null; className?: string; style?: React.CSSProperties }) {
  if (!content) return null
  const isHtml = /<[a-z][\s\S]*>/i.test(content)
  if (isHtml) {
    return <div className={className} style={style} dangerouslySetInnerHTML={{ __html: content }} />
  }
  // Legacy plain text – preserve line breaks
  return (
    <div className={className} style={style}>
      {content.split('\n').map((line, i) => <p key={i} style={{ margin: '4px 0' }}>{line}</p>)}
    </div>
  )
}

type OthersPost = {
  id: string
  slug: string
  title: string
  titleAs?: string
  description?: string
  descriptionAs?: string
  emoji: string
  category?: string
  createdAt: string
  updatedAt?: string
  sections: Array<{
    id: string
    title?: string
    content?: string
    images?: string[]
    links: Array<{ id: string; label: string; url: string }>
    pdfLink?: string
    pdfName?: string
  }>
  affiliateLink?: string
  affiliateLinkText?: string
  fullDescription?: string
  fullDescTitle?: string
}

export default function ServiceDetail({ post }: { post: OthersPost }) {
  useEffect(() => {
    const existing = document.getElementById('acp-jsonld')
    if (existing) existing.remove()
    const script = document.createElement('script')
    script.id = 'acp-jsonld'
    script.type = 'application/ld+json'
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: post.title,
      description: post.description,
      url: `https://www.assamcareerpoint-info.com/${PATH}/${post.slug}`,
    })
    document.head.appendChild(script)
  }, [post])

  return (
    <>
      <style>{`
        *{box-sizing:border-box}
        html,body{margin:0;font-family:Nunito,var(--font-nunito),sans-serif;background:#f0f4f8;overflow-x:hidden;max-width:100vw}
        .sec-card{background:#fff;border-radius:12px;border:1.5px solid #e8eef4;overflow:hidden;margin-bottom:18px}
        .link-row:hover{background:#f5f0ff!important}
        .nav-a{
          color:rgba(255,255,255,.65);font-size:.82rem;font-weight:700;
          padding:6px 13px;border-radius:99px;
          border:1.5px solid rgba(255,255,255,.15);
          text-decoration:none;white-space:nowrap;transition:.15s;
        }
        .nav-a:hover{color:${G};border-color:${G}88;background:rgba(201,162,39,.08)}
        .link-row span:first-child{min-width:0;overflow-wrap:anywhere;word-break:break-word}
        @media(max-width:860px){
          .detail-header{padding:10px 12px!important;flex-wrap:wrap!important;gap:10px!important}
          .detail-nav{display:flex!important;gap:6px!important;width:100%!important;overflow-x:auto!important;flex-wrap:nowrap!important;padding-bottom:4px}
          .detail-nav a{flex-shrink:0}
          .detail-crumb{flex-wrap:wrap!important}
          .detail-hero{padding:16px 12px!important}
          .detail-hero-row{flex-wrap:wrap!important}
          .detail-content{padding:18px 12px 40px!important;overflow-x:hidden!important;max-width:100%!important}
          .sec-card > div:last-child{padding:14px 12px!important}
        }
      `}</style>

      <header className="detail-header" style={{ background: N, borderBottom: `3px solid ${G}`, padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ fontFamily: 'Arial Black,sans-serif', fontSize: '.9rem', textDecoration: 'none' }}>
          <span style={{ color: G }}>ASSAM </span><span style={{ color: W }}>CAREER</span><span style={{ color: T }}> POINT</span>
        </Link>
        <nav className="detail-nav" style={{ display: 'flex', gap: 6 }}>
          {([['/', '🏠 Home'], [`/${PATH}`, '🏛️ Services'], ['/announcements', '📢 Announcements']] as [string,string][]).map(([href, label]) => (
            <Link key={href} href={href} className="nav-a">{label}</Link>
          ))}
        </nav>
      </header>

      <main id="main-content">
        <div style={{ background: '#fff', borderBottom: '1px solid #e8eef4', padding: '10px 20px' }}>
          <div className="detail-crumb" style={{ maxWidth: 860, margin: '0 auto', fontSize: '.78rem', color: '#5a6a7a', display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
            <Link href="/" style={{ color: '#5a6a7a', textDecoration: 'none', fontWeight: 600 }}>Home</Link>
            <span>›</span>
            <Link href={`/${PATH}`} style={{ color: '#5a6a7a', textDecoration: 'none', fontWeight: 600 }}>Public Services</Link>
            <span>›</span>
            <span style={{ color: N, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{post.title}</span>
          </div>
        </div>

        <div className="detail-hero" style={{ background: `linear-gradient(135deg, #1a0a2e 0%, ${N} 100%)`, padding: '32px 20px' }}>
          <div style={{ maxWidth: 860, margin: '0 auto' }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
              <span style={{ padding: '3px 12px', borderRadius: 20, background: '#8e44ad', color: '#fff', fontSize: '.72rem', fontWeight: 800, fontFamily: 'Arial Black,sans-serif' }}>🏛 PUBLIC SERVICE</span>
              {post.category && <span style={{ padding: '3px 12px', borderRadius: 20, background: G + '33', color: G, fontSize: '.72rem', fontWeight: 700 }}>{post.category}</span>}
            </div>
            <div className="detail-hero-row" style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <span style={{ fontSize: '2.5rem', flexShrink: 0 }}>{post.emoji}</span>
              <div>
                <h1 style={{ fontFamily: 'Sora,sans-serif', fontWeight: 800, color: W, fontSize: '1.3rem', margin: '0 0 8px', lineHeight: 1.3, overflowWrap:'anywhere' }}>{post.title}</h1>
                {post.titleAs && <div style={{ color: '#8fa3b8', fontSize: '.9rem', marginBottom: 8 }}>{post.titleAs}</div>}
                {post.description && <RichContent content={post.description} className="rte-content" style={{ color: '#b0c4d8', fontSize: '.9rem', margin: '0 0 8px', lineHeight: 1.7 }} />}
                <div style={{ fontSize: '.75rem', color: '#6a8099' }}>
                  Published: {new Date(post.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="detail-content" style={{ maxWidth: 860, margin: '0 auto', padding: '28px 16px 60px' }}>
          {post.descriptionAs && (
            <div style={{ background: '#fdf9ee', border: `1.5px solid ${G}44`, borderRadius: 12, padding: '14px 18px', marginBottom: 20 }}>
              <RichContent content={post.descriptionAs} className="rte-content" style={{ margin: 0, fontSize: '.9rem', color: '#5a3a00', lineHeight: 1.8 }} />
            </div>
          )}

          {post.sections.map((sec, idx) => (
            <div key={sec.id} className="sec-card">
              <div style={{ background: `linear-gradient(90deg, #1a0a2e, ${N})`, padding: '12px 18px' }}>
                <h2 style={{ fontFamily: 'Sora,sans-serif', fontWeight: 700, color: W, fontSize: '1rem', margin: 0 }}>
                  {sec.title || `Section ${idx + 1}`}
                </h2>
              </div>
              <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                {sec.content && <RichContent content={sec.content} className="rte-content" />}

                {(sec.images || []).filter(Boolean).map((imgUrl, imgIdx) => {
                  const src = imgUrl.includes('drive.google.com')
                    ? `https://lh3.googleusercontent.com/d/${(imgUrl.match(/\/d\/([a-zA-Z0-9_-]+)/) || [])[1]}`
                    : imgUrl
                  return (
                    <div key={imgIdx} style={{ borderRadius: 10, overflow: 'hidden', border: '1.5px solid #e8eef4', boxShadow: '0 2px 12px rgba(0,0,0,.06)' }}>
                      <img
                        src={src}
                        alt={`${sec.title || 'Section'} image ${imgIdx + 1}`}
                        style={{ width: '100%', maxHeight: 480, objectFit: 'contain', background: '#f8fbff', display: 'block' }}
                        onError={e => { (e.target as HTMLImageElement).parentElement!.style.display = 'none' }}
                      />
                    </div>
                  )
                })}

                {sec.links.length > 0 && (
                  <div>
                    <div style={{ fontSize: '.78rem', fontWeight: 800, color: '#3a5068', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>🔗 Important Links</div>
                    <div style={{ border: '1.5px solid #e8eef4', borderRadius: 10, overflow: 'hidden' }}>
                      {sec.links.map((lnk, li) => (
                        <a key={lnk.id} href={lnk.url} target="_blank" rel="noopener noreferrer" className="link-row"
                          style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            padding: '11px 16px', borderBottom: li < sec.links.length - 1 ? '1px solid #f0f4f8' : 'none',
                            textDecoration: 'none', background: '#fff', transition: 'background .15s'
                          }}>
                          <span style={{ fontSize: '.88rem', fontWeight: 600, color: N }}>{lnk.label}</span>
                          <span style={{ fontSize: '.78rem', fontWeight: 700, color: T, fontFamily: 'Arial Black,sans-serif' }}>Click Here →</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {sec.pdfLink && (
                  <a href={sec.pdfLink} target="_blank" rel="noopener noreferrer" style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 20px',
                    borderRadius: 30, background: N, color: G, fontWeight: 900, textDecoration: 'none',
                    fontSize: '.84rem', fontFamily: 'Arial Black,sans-serif', alignSelf: 'flex-start'
                  }}>
                    📄 {sec.pdfName || 'Download PDF'}
                  </a>
                )}
              </div>
            </div>
          ))}

          {post.affiliateLink && (
            <div style={{
              background: `linear-gradient(135deg, ${G}18, #8e44ad22)`,
              border: `2px solid #8e44ad44`, borderRadius: 14,
              padding: '20px 22px', marginTop: 8, textAlign: 'center'
            }}>
              <div style={{ fontSize: '1.3rem', marginBottom: 6 }}>📚</div>
              <div style={{ fontFamily: 'Sora,sans-serif', fontWeight: 700, color: N, fontSize: '1rem', marginBottom: 10 }}>Prepare with the best resources</div>
              <a href={post.affiliateLink} target="_blank" rel="noopener noreferrer" style={{
                display: 'inline-block', padding: '11px 28px', borderRadius: 30,
                background: G, color: N, fontWeight: 900, textDecoration: 'none',
                fontFamily: 'Arial Black,sans-serif', fontSize: '.86rem'
              }}>
                {post.affiliateLinkText || 'Start Preparation →'}
              </a>
            </div>
          )}

          {post.fullDescription && (
            <div style={{ marginTop: 24 }}>
              <h2 style={{ fontFamily: 'Sora,sans-serif', fontWeight: 700, fontSize: '1rem', color: N, marginBottom: 10 }}>
                📄 {post.fullDescTitle || 'Full Details'}
              </h2>
              <RichContent content={post.fullDescription} className="rte-content" style={{ lineHeight: 1.9, color: '#3a5068' }} />
            </div>
          )}

          <div style={{ marginTop: 24 }}>
            <Link href={`/${PATH}`} style={{ color: '#0e8a7e', fontWeight: 700, textDecoration: 'none', fontSize: '.88rem' }}>
              ← Back to Public Services
            </Link>
          </div>
        </div>
      </main>

      <footer style={{ background: N, color: '#8fa3b8', textAlign: 'center', padding: '20px', fontSize: '.78rem' }}>
        © 2025–2026 Assam Career Point &amp; Info
      </footer>
    </>
  )
}