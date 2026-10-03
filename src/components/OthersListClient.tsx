// SAVE AS: src/components/OthersListClient.tsx   (new file)
// One shared listing component for /announcements, /guides and /services.
// It receives the posts from the server page, so every post link is already in the HTML Google downloads.
// Same design as the old pages. Symbols are written as \u escapes so the file can never be garbled.
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AcpiBrand } from '@/components/AcpiLogo'

const G = '#c9a227', T = '#1dbfad', N = '#0b1f33', W = '#ffffff'

export type OtherListItem = {
  id: number
  slug: string
  emoji: string
  category: string
  createdAt: string      // ISO date or ''
  title: string
  description: string
  sectionCount: number
  href: string
}

export type OtherListConfig = {
  path: string           // 'announcements' | 'guides' | 'services'
  label: string          // page heading
  emoji: string
  color: string
  tint?: string          // hex alpha for badge backgrounds, default '18'
  heroGradient: string
  subtitle: string
  placeholder: string
  countNoun: string      // "announcements", "guides", "public services"
  emptyTitle: string
  cta: string            // "Read more", "Read guide", "View service"
}

const NAV: [string, string][] = [
  ['/', 'Home'], ['/govt-jobs', 'Jobs'], ['/exams', 'Exams'],
  ['/announcements', 'Announcements'], ['/guides', 'Guides'],
  ['/services', 'Services'], ['/pdf-forms', 'PDF Forms'],
]

export default function OthersListClient({ config, posts }: { config: OtherListConfig; posts: OtherListItem[] }) {
  const [search, setSearch] = useState('')
  const tint = config.tint || '18'
  const q = search.toLowerCase()

  const filtered = posts.filter(p =>
    !search ||
    p.title.toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q) ||
    p.description.toLowerCase().includes(q)
  )

  const fmtDate = (iso: string) => {
    if (!iso) return ''
    const d = new Date(iso)
    if (isNaN(d.getTime())) return ''
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata' })
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800&family=Nunito:wght@400;600;700&display=swap');
        * { box-sizing: border-box }
        body { margin: 0; font-family: Nunito, sans-serif; background: #f0f4f8 }
        .card:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(0,0,0,.1) !important; }
        .card { transition: all .2s; }
      `}</style>

      {/* Header */}
      <header style={{ background: N, borderBottom: `3px solid ${G}`, padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <AcpiBrand size={36} textSize=".74rem" />
        </Link>
        <nav style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          {NAV.map(([href, label]) => (
            <Link key={href} href={href} style={{ color: href === `/${config.path}` ? G : '#b0c4d8', textDecoration: 'none', fontSize: '.82rem', fontWeight: 700, fontFamily: 'Nunito,sans-serif' }}>{label}</Link>
          ))}
        </nav>
      </header>

      {/* Hero */}
      <div style={{ background: config.heroGradient, padding: '36px 20px 32px', textAlign: 'center' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>{config.emoji}</div>
        <h1 style={{ fontFamily: 'Sora,sans-serif', fontWeight: 800, color: W, fontSize: '1.8rem', margin: '0 0 8px' }}>{config.label}</h1>
        <p style={{ color: '#8fa3b8', fontSize: '.9rem', margin: '0 0 20px', maxWidth: 500, marginLeft: 'auto', marginRight: 'auto' }}>
          {config.subtitle}
        </p>
        <div style={{ maxWidth: 420, margin: '0 auto', position: 'relative' }}>
          <input value={search} onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', padding: '11px 18px 11px 40px', borderRadius: 30, border: 'none', fontSize: '.88rem', fontFamily: 'Nunito,sans-serif', outline: 'none' }}
            placeholder={config.placeholder} />
          <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#8fa3b8' }}>{'\u{1F50D}'}</span>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '28px 16px 60px' }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: '3rem', marginBottom: 12 }}>{config.emoji}</div>
            <div style={{ fontWeight: 700, color: N, fontSize: '1.1rem', marginBottom: 6 }}>
              {search ? 'No results found' : config.emptyTitle}
            </div>
            <div style={{ color: '#8fa3b8', fontSize: '.88rem' }}>
              {search ? 'Try a different search term' : 'Check back soon for updates'}
            </div>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: 16, fontSize: '.82rem', color: '#5a6a7a' }}>
              Showing <strong>{filtered.length}</strong> {config.countNoun}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {filtered.map(post => (
                <Link key={post.id} href={post.href} style={{ textDecoration: 'none' }}>
                  <div className="card" style={{
                    background: W, borderRadius: 14, padding: '18px 22px',
                    border: '1.5px solid #e8eef4', boxShadow: '0 2px 10px rgba(0,0,0,.05)',
                    display: 'flex', gap: 16, alignItems: 'flex-start',
                  }}>
                    <div style={{
                      width: 48, height: 48, borderRadius: 12, background: config.color + tint,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '1.6rem', flexShrink: 0,
                    }}>{post.emoji || config.emoji}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: 4 }}>
                        {post.category && (
                          <span style={{ padding: '2px 10px', borderRadius: 20, background: config.color + tint, color: config.color, fontSize: '.7rem', fontWeight: 700 }}>
                            {post.category}
                          </span>
                        )}
                        <span style={{ fontSize: '.7rem', color: '#8fa3b8' }}>{fmtDate(post.createdAt)}</span>
                      </div>
                      <h2 style={{ fontFamily: 'Sora,sans-serif', fontWeight: 700, fontSize: '1rem', color: N, margin: '0 0 6px' }}>{post.title}</h2>
                      {post.description && (
                        <p style={{ color: '#5a6a7a', fontSize: '.84rem', margin: 0, lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {post.description}
                        </p>
                      )}
                      <div style={{ marginTop: 8, fontSize: '.78rem', color: T, fontWeight: 700 }}>
                        {post.sectionCount} section{post.sectionCount !== 1 ? 's' : ''} {'\u00B7'} {config.cta} {'\u2192'}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <footer style={{ background: N, color: '#8fa3b8', textAlign: 'center', padding: '20px', fontSize: '.78rem' }}>
        <div>{'\u00A9'} 2025{'\u2013'}2026 Assam Career Point &amp; Info {'\u2014'} <Link href="/privacy-policy" style={{ color: '#8fa3b8' }}>Privacy Policy</Link></div>
      </footer>
    </>
  )
}
