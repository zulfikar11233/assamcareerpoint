'use client'
// src/app/guides/page.tsx
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { OthersPost, getOthersPosts } from '@/lib/others-db'

const G = '#c9a227', T = '#1dbfad', N = '#0b1f33', W = '#ffffff'
const TYPE = 'guide' as const
const PATH = 'guides'
const LABEL = 'Documents & Guides'
const EMOJI = '📋'
const COLOR = T

export default function GuidesPage() {
  const [posts, setPosts] = useState<OthersPost[]>([])
  const [search, setSearch] = useState('')
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setPosts(getOthersPosts(TYPE).filter(p => p.published).sort((a, b) => b.id - a.id))
    setLoaded(true)
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

      <header style={{ background: N, borderBottom: `3px solid ${G}`, padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ fontFamily: 'Arial Black,sans-serif', fontSize: '.9rem', textDecoration: 'none' }}>
          <span style={{ color: G }}>ASSAM </span><span style={{ color: W }}>CAREER</span><span style={{ color: T }}> POINT</span>
        </Link>
        <nav style={{ display: 'flex', gap: 16 }}>
          {[['/', 'Home'], ['/govt-jobs', 'Jobs'], ['/exams', 'Exams'], ['/guides', 'Guides'], ['/services', 'Services']].map(([href, label]) => (
            <Link key={href} href={href} style={{ color: href === `/${PATH}` ? G : '#b0c4d8', textDecoration: 'none', fontSize: '.82rem', fontWeight: 700 }}>{label}</Link>
          ))}
        </nav>
      </header>

      <div style={{ background: `linear-gradient(135deg, #0d2d4a 0%, #0a3d3a 100%)`, padding: '36px 20px 32px', textAlign: 'center' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>{EMOJI}</div>
        <h1 style={{ fontFamily: 'Sora,sans-serif', fontWeight: 800, color: W, fontSize: '1.8rem', margin: '0 0 8px' }}>{LABEL}</h1>
        <p style={{ color: '#8fa3b8', fontSize: '.9rem', margin: '0 0 20px', maxWidth: 500, marginLeft: 'auto', marginRight: 'auto' }}>
          Step-by-step guides, how-to documents and official process guides for Assam residents
        </p>
        <div style={{ maxWidth: 420, margin: '0 auto', position: 'relative' }}>
          <input value={search} onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', padding: '11px 18px 11px 40px', borderRadius: 30, border: 'none', fontSize: '.88rem', fontFamily: 'Nunito,sans-serif', outline: 'none' }}
            placeholder="Search guides..." />
          <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#8fa3b8' }}>🔍</span>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '28px 16px 60px' }}>
        {!loaded ? (
          <div style={{ textAlign: 'center', padding: 60, color: '#8fa3b8' }}>Loading...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: '3rem', marginBottom: 12 }}>{EMOJI}</div>
            <div style={{ fontWeight: 700, color: N, fontSize: '1.1rem' }}>{search ? 'No results found' : 'No guides yet'}</div>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: 16, fontSize: '.82rem', color: '#5a6a7a' }}>Showing <strong>{filtered.length}</strong> guides</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {filtered.map(post => (
                <Link key={post.id} href={`/${PATH}/${post.slug}`} style={{ textDecoration: 'none' }}>
                  <div className="card" style={{ background: W, borderRadius: 14, padding: '18px 22px', border: '1.5px solid #e8eef4', boxShadow: '0 2px 10px rgba(0,0,0,.05)', display: 'flex', gap: 16 }}>
                    <div style={{ width: 48, height: 48, borderRadius: 12, background: COLOR + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', flexShrink: 0 }}>{post.emoji}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: 4 }}>
                        {post.category && <span style={{ padding: '2px 10px', borderRadius: 20, background: COLOR + '22', color: COLOR, fontSize: '.7rem', fontWeight: 700 }}>{post.category}</span>}
                        <span style={{ fontSize: '.7rem', color: '#8fa3b8' }}>{new Date(post.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      </div>
                      <h2 style={{ fontFamily: 'Sora,sans-serif', fontWeight: 700, fontSize: '1rem', color: N, margin: '0 0 6px' }}>{post.title}</h2>
                      {post.description && <p style={{ color: '#5a6a7a', fontSize: '.84rem', margin: 0, lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{post.description}</p>}
                      <div style={{ marginTop: 8, fontSize: '.78rem', color: T, fontWeight: 700 }}>{post.sections.length} section{post.sections.length !== 1 ? 's' : ''} · Read guide →</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>

      <footer style={{ background: N, color: '#8fa3b8', textAlign: 'center', padding: '20px', fontSize: '.78rem' }}>
        <div>© 2025–2026 Assam Career Point &amp; Info</div>
      </footer>
    </>
  )
}
