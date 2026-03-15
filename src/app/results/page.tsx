'use client'
// src/app/results/page.tsx — REPLACE the existing Coming Soon placeholder with this
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ResultPost, getPublishedResults, RESULT_CATEGORIES } from '@/lib/results-db'

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

export default function ResultsPage() {
  const [posts, setPosts] = useState<ResultPost[]>([])
  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState('All')
  const [loaded, setLoaded] = useState(false)

useEffect(() => {
    fetch('/api/data/results')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setPosts(data)
        } else {
          setPosts(getPublishedResults())
        }
        setLoaded(true)
      })
      .catch(() => {
        setPosts(getPublishedResults())
        setLoaded(true)
      })
  }, [])

  const filtered = posts.filter(p => {
    const matchSearch = !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.org.toLowerCase().includes(search.toLowerCase()) ||
      (p.description || '').toLowerCase().includes(search.toLowerCase())
    const matchCat = filterCat === 'All' || p.category === filterCat
    return matchSearch && matchCat
  })

  const usedCats = ['All', ...RESULT_CATEGORIES.filter(c => posts.some(p => p.category === c))]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800&family=Nunito:wght@400;600;700&display=swap');
        * { box-sizing: border-box }
        body { margin: 0; font-family: Nunito, sans-serif; background: #f0f4f8 }
        .card:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(0,0,0,.12) !important; border-color: #c9a22766 !important; }
        .card { transition: all .2s; }
        .cat-btn:hover { opacity: .85; }
      `}</style>

      {/* Header */}
      <header style={{ background: N, borderBottom: `3px solid ${G}`, padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ fontFamily: 'Arial Black,sans-serif', fontSize: '.9rem', textDecoration: 'none' }}>
          <span style={{ color: G }}>ASSAM </span><span style={{ color: W }}>CAREER</span><span style={{ color: T }}> POINT</span>
        </Link>
        <nav style={{ display: 'flex', gap: 18, flexWrap: 'wrap' }}>
          {[['/', 'Home'], ['/govt-jobs', 'Govt Jobs'], ['/exams', 'Exams'], ['/information', 'Info'], ['/results', 'Results']].map(([href, label]) => (
            <Link key={href} href={href} style={{
              color: href === '/results' ? G : '#b0c4d8',
              textDecoration: 'none', fontSize: '.82rem', fontWeight: 700,
              fontFamily: 'Nunito,sans-serif',
            }}>{label}</Link>
          ))}
        </nav>
      </header>

      {/* Hero */}
      <div style={{ background: `linear-gradient(135deg, ${N} 0%, #102a45 100%)`, padding: '40px 20px 36px', textAlign: 'center' }}>
        <div style={{ fontSize: '2.8rem', marginBottom: 10 }}>📊</div>
        <h1 style={{ fontFamily: 'Sora,sans-serif', fontWeight: 800, color: W, fontSize: '1.9rem', margin: '0 0 10px' }}>
          Results & Merit Lists
        </h1>
        <p style={{ color: '#8fa3b8', fontSize: '.92rem', margin: '0 0 24px', maxWidth: 520, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.7 }}>
          Exam results, merit lists, answer keys and cut-off marks for Assam & Northeast India government recruitments
        </p>
        {/* Search */}
        <div style={{ maxWidth: 440, margin: '0 auto', position: 'relative' }}>
          <input value={search} onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', padding: '12px 18px 12px 42px', borderRadius: 30, border: 'none', fontSize: '.9rem', fontFamily: 'Nunito,sans-serif', outline: 'none', boxShadow: '0 4px 20px rgba(0,0,0,.2)' }}
            placeholder="Search results, merit lists..." />
          <span style={{ position: 'absolute', left: 15, top: '50%', transform: 'translateY(-50%)', color: '#8fa3b8', fontSize: '1rem' }}>🔍</span>
        </div>
      </div>

      {/* Category filter */}
      {usedCats.length > 1 && (
        <div style={{ background: W, borderBottom: '1.5px solid #e8eef4', padding: '14px 20px', display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
          {usedCats.map(cat => (
            <button key={cat} className="cat-btn" onClick={() => setFilterCat(cat)} style={{
              padding: '6px 16px', borderRadius: 20, fontSize: '.78rem', fontWeight: 700,
              border: 'none', cursor: 'pointer', transition: 'all .15s',
              background: filterCat === cat ? (cat === 'All' ? N : catColor(cat)) : '#f0f4f8',
              color: filterCat === cat ? W : '#3a5068',
            }}>{cat}</button>
          ))}
        </div>
      )}

      {/* Results list */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '28px 16px 60px' }}>
        {!loaded ? (
          <div style={{ textAlign: 'center', padding: 60, color: '#8fa3b8', fontSize: '.9rem' }}>Loading...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '70px 20px' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: 14 }}>📊</div>
            <h2 style={{ fontFamily: 'Sora,sans-serif', fontWeight: 800, color: N, fontSize: '1.2rem', marginBottom: 8 }}>
              {search || filterCat !== 'All' ? 'No results found' : 'No results published yet'}
            </h2>
            <p style={{ color: '#8fa3b8', fontSize: '.88rem', maxWidth: 340, margin: '0 auto 20px' }}>
              {search ? `Try searching with different keywords` : 'Check back soon — results will be published here'}
            </p>
            {(search || filterCat !== 'All') && (
              <button onClick={() => { setSearch(''); setFilterCat('All') }}
                style={{ padding: '9px 22px', borderRadius: 30, background: N, color: G, fontWeight: 900, border: 'none', cursor: 'pointer', fontFamily: 'Arial Black,sans-serif', fontSize: '.82rem' }}>
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div style={{ marginBottom: 18, fontSize: '.82rem', color: '#5a6a7a' }}>
              Showing <strong>{filtered.length}</strong> result{filtered.length !== 1 ? 's' : ''}
              {filterCat !== 'All' && ` · ${filterCat}`}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {filtered.map(post => (
                <Link key={post.id} href={`/results/${post.slug}`} style={{ textDecoration: 'none' }}>
                  <div className="card" style={{
                    background: W, borderRadius: 14, padding: '18px 22px',
                    border: '1.5px solid #e8eef4', boxShadow: '0 2px 12px rgba(0,0,0,.06)',
                    display: 'flex', gap: 16, alignItems: 'flex-start',
                  }}>
                    {/* Emoji icon */}
                    <div style={{
                      width: 52, height: 52, borderRadius: 13,
                      background: catColor(post.category) + '18',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '1.7rem', flexShrink: 0,
                    }}>{post.emoji}</div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      {/* Badges row */}
                      <div style={{ display: 'flex', gap: 7, alignItems: 'center', flexWrap: 'wrap', marginBottom: 5 }}>
                        <span style={{
                          padding: '2px 11px', borderRadius: 20,
                          background: catColor(post.category) + '18',
                          color: catColor(post.category),
                          fontSize: '.7rem', fontWeight: 800,
                        }}>{post.category}</span>
                        {post.org && (
                          <span style={{ fontSize: '.72rem', color: '#8fa3b8', fontWeight: 600 }}>{post.org}</span>
                        )}
                        {post.resultDate && (
                          <span style={{ fontSize: '.7rem', color: '#8fa3b8' }}>
                            📅 {new Date(post.resultDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h2 style={{ fontFamily: 'Sora,sans-serif', fontWeight: 700, fontSize: '1rem', color: N, margin: '0 0 6px', lineHeight: 1.4 }}>
                        {post.title}
                      </h2>

                      {/* Description */}
                      {post.description && (
                        <p style={{ color: '#5a6a7a', fontSize: '.84rem', margin: '0 0 8px', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {post.description}
                        </p>
                      )}

                      {/* Footer row */}
                      <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                        {post.totalPosts && (
                          <span style={{ fontSize: '.78rem', color: '#5a6a7a', fontWeight: 600 }}>
                            👥 {post.totalPosts} Posts
                          </span>
                        )}
                        <span style={{ fontSize: '.78rem', color: T, fontWeight: 700 }}>
                          {post.sections.length} section{post.sections.length !== 1 ? 's' : ''} · View Details →
                        </span>
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
        © 2025–2026 Assam Career Point &amp; Info — Informational portal only, verify from official sources.
        {' '}<Link href="/privacy-policy" style={{ color: '#8fa3b8' }}>Privacy Policy</Link>
      </footer>
    </>
  )
}
