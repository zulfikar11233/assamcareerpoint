'use client'
// src/app/announcements/page.tsx
// Public listing page for Announcements

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { OthersPost, getOthersPosts } from '@/lib/others-db'

const G = '#c9a227', T = '#1dbfad', N = '#0b1f33', W = '#ffffff'
const TYPE = 'announcement' as const
const PATH = 'announcements'
const LABEL = 'Announcements'
const EMOJI = '📢'
const COLOR = '#e74c3c'

export default function AnnouncementsPage() {
  const [posts, setPosts] = useState<OthersPost[]>([])
  const [search, setSearch] = useState('')
  const [loaded, setLoaded] = useState(false)

useEffect(() => {
    fetch('/api/data/announcements', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setPosts(data.filter((p: OthersPost) => p.published).sort((a, b) => b.id - a.id))
        } else {
          setPosts(getOthersPosts(TYPE).filter(p => p.published).sort((a, b) => b.id - a.id))
        }
        setLoaded(true)
      })
      .catch(() => {
        setPosts(getOthersPosts(TYPE).filter(p => p.published).sort((a, b) => b.id - a.id))
        setLoaded(true)
      })
  }, [])

  const filtered = posts.filter(p =>
    !search ||
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    (p.category || '').toLowerCase().includes(search.toLowerCase()) ||
    (p.description || '').toLowerCase().includes(search.toLowerCase())
  )

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
      <header style={{ background: N, borderBottom: `3px solid ${G}`, padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ fontFamily: 'Arial Black,sans-serif', fontSize: '.9rem', textDecoration: 'none' }}>
          <span style={{ color: G }}>ASSAM </span><span style={{ color: W }}>CAREER</span><span style={{ color: T }}> POINT</span>
        </Link>
        <nav style={{ display: 'flex', gap: 16 }}>
          {[['/', 'Home'], ['/govt-jobs', 'Jobs'], ['/exams', 'Exams'], ['/announcements', 'Announcements'], ['/guides', 'Guides'], ['/services', 'Services']].map(([href, label]) => (
            <Link key={href} href={href} style={{ color: href === `/${PATH}` ? G : '#b0c4d8', textDecoration: 'none', fontSize: '.82rem', fontWeight: 700, fontFamily: 'Nunito,sans-serif' }}>{label}</Link>
          ))}
        </nav>
      </header>

      {/* Hero */}
      <div style={{ background: `linear-gradient(135deg, ${N} 0%, #0d2d4a 100%)`, padding: '36px 20px 32px', textAlign: 'center' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>{EMOJI}</div>
        <h1 style={{ fontFamily: 'Sora,sans-serif', fontWeight: 800, color: W, fontSize: '1.8rem', margin: '0 0 8px' }}>{LABEL}</h1>
        <p style={{ color: '#8fa3b8', fontSize: '.9rem', margin: '0 0 20px', maxWidth: 500, marginLeft: 'auto', marginRight: 'auto' }}>
          Latest government announcements, notifications and official updates for Assam & NE India
        </p>
        {/* Search */}
        <div style={{ maxWidth: 420, margin: '0 auto', position: 'relative' }}>
          <input value={search} onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', padding: '11px 18px 11px 40px', borderRadius: 30, border: 'none', fontSize: '.88rem', fontFamily: 'Nunito,sans-serif', outline: 'none' }}
            placeholder="Search announcements..." />
          <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#8fa3b8' }}>🔍</span>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '28px 16px 60px' }}>
        {!loaded ? (
          <div style={{ textAlign: 'center', padding: 60, color: '#8fa3b8' }}>Loading...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: '3rem', marginBottom: 12 }}>{EMOJI}</div>
            <div style={{ fontWeight: 700, color: N, fontSize: '1.1rem', marginBottom: 6 }}>
              {search ? 'No results found' : 'No announcements yet'}
            </div>
            <div style={{ color: '#8fa3b8', fontSize: '.88rem' }}>
              {search ? `Try a different search term` : 'Check back soon for updates'}
            </div>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: 16, fontSize: '.82rem', color: '#5a6a7a' }}>
              Showing <strong>{filtered.length}</strong> {LABEL.toLowerCase()}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {filtered.map(post => (
                <Link key={post.id} href={`/${PATH}/${post.slug}`} style={{ textDecoration: 'none' }}>
                  <div className="card" style={{
                    background: W, borderRadius: 14, padding: '18px 22px',
                    border: '1.5px solid #e8eef4', boxShadow: '0 2px 10px rgba(0,0,0,.05)',
                    display: 'flex', gap: 16, alignItems: 'flex-start',
                  }}>
                    <div style={{
                      width: 48, height: 48, borderRadius: 12, background: COLOR + '18',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '1.6rem', flexShrink: 0,
                    }}>{post.emoji}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: 4 }}>
                        {post.category && (
                          <span style={{ padding: '2px 10px', borderRadius: 20, background: COLOR + '18', color: COLOR, fontSize: '.7rem', fontWeight: 700 }}>
                            {post.category}
                          </span>
                        )}
                        <span style={{ fontSize: '.7rem', color: '#8fa3b8' }}>
                          {new Date(post.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                      <h2 style={{ fontFamily: 'Sora,sans-serif', fontWeight: 700, fontSize: '1rem', color: N, margin: '0 0 6px' }}>{post.title}</h2>
                      {post.description && (
                        <p style={{ color: '#5a6a7a', fontSize: '.84rem', margin: 0, lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {post.description}
                        </p>
                      )}
                      <div style={{ marginTop: 8, fontSize: '.78rem', color: T, fontWeight: 700 }}>
                        {post.sections.length} section{post.sections.length !== 1 ? 's' : ''} · Read more →
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
        <div>© 2025–2026 Assam Career Point &amp; Info — <Link href="/privacy-policy" style={{ color: '#8fa3b8' }}>Privacy Policy</Link></div>
      </footer>
    </>
  )
}
