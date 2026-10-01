// SAVE AS: src/app/pdf-forms/PdfFormsClient.tsx   (new file)
// Same design as the old page. Differences:
//  - receives `forms` from the server page (no fetch('/api/...'), no SAMPLE data, no localStorage)
//  - so every PDF card is a real <a href> in the HTML that Google downloads
//  - the public "How to add new documents (for Admin)" box is removed
//  - emojis/symbols are written as \u escapes, so this file can never get garbled characters again
'use client'

import Link from 'next/link'
import { useState } from 'react'
import { AcpiBrand } from '@/components/AcpiLogo'

export type PdfListItem = {
  id: number
  title: string
  category: string
  uploadedAt: string
  downloads: number
  imageUrl: string
  href: string
}

function toImgSrc(url?: string): string {
  if (!url || typeof url !== 'string') return ''
  const u = url.trim()
  if (!u.startsWith('http')) return ''
  if (u.includes('drive.google.com')) {
    const m = u.match(/\/d\/([a-zA-Z0-9_-]+)/) ||
              u.match(/[?&]id=([a-zA-Z0-9_-]+)/)
    if (m) return `https://lh3.googleusercontent.com/d/${m[1]}`
  }
  return u
}

const ALL_CATS = ['All','Application Forms','Syllabus','Question Papers','Answer Keys','Govt Documents','Results','Other']

const CAT_ICONS: Record<string,string> = {
  'All':'\u{1F4C2}',
  'Application Forms':'\u{1F4DD}',
  'Syllabus':'\u{1F4D6}',
  'Question Papers':'\u{1F4CB}',
  'Answer Keys':'\u{1F511}',
  'Govt Documents':'\u{1F3DB}\uFE0F',
  'Results':'\u{1F4CA}',
  'Other':'\u{1F4C4}',
}

const NAV = [
  ['Home','/'],
  ['Govt Jobs','/govt-jobs'],
  ['Exams','/exams'],
  ['Information','/information'],
  ['PDF Forms','/pdf-forms'],
  ['Results','/results'],
  ['Announcements','/announcements'],
  ['Tools','/tools'],
]

export default function PdfFormsClient({ forms }: { forms: PdfListItem[] }) {
  const [cat,    setCat]    = useState('All')
  const [search, setSearch] = useState('')

  const q = search.trim().toLowerCase()
  const visible = forms.filter(f =>
    (cat === 'All' || f.category === cat) &&
    f.title.toLowerCase().includes(q)
  )

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        html, body { overflow-x: hidden; max-width: 100vw; margin: 0; font-family: Nunito, sans-serif; background: #f0f4f8; color: #1a1a2e; }
        .nav-lnk { color:rgba(255,255,255,.65); font-size:.82rem; font-weight:600; padding:7px 11px; border-radius:8px; text-decoration:none; white-space:nowrap; transition:.15s; }
        .nav-lnk:hover { color:#00b4d8 !important; background:rgba(255,255,255,.08); }
        .nav-lnk.active { color:#00b4d8 !important; }
        .cat-btn { padding:7px 14px;border-radius:99px;font-size:.77rem;font-weight:700;cursor:pointer;border:1.5px solid #d4e0ec;background:#fff;color:#5a6a7a;font-family:Nunito,sans-serif;transition:.15s; }
        .cat-btn.on { background:#0d1b2a;color:#fff;border-color:#0d1b2a; }
        .cat-btn:hover:not(.on) { border-color:#00b4d8;color:#00b4d8; }
        .pcard { background:#fff;border:1.5px solid #d4e0ec;border-radius:13px;padding:18px 20px;transition:.2s;display:block;text-decoration:none;color:inherit; }
        .pcard:hover { transform:translateY(-3px);box-shadow:0 8px 28px rgba(0,0,0,.09); }
        .pgrid { display:grid;grid-template-columns:repeat(auto-fill,minmax(310px,1fr));gap:16px; }
        @media(max-width:600px) { .pgrid { grid-template-columns:1fr; } }
      `}</style>

      {/* HEADER */}
      <header style={{ background:'#0d1b2a',position:'sticky',top:0,zIndex:100,boxShadow:'0 2px 20px rgba(0,0,0,.28)' }}>
        <div style={{ maxWidth:1180,margin:'0 auto',padding:'11px 20px',display:'flex',alignItems:'center',justifyContent:'space-between',gap:14 }}>
          <Link href="/" style={{ display:'flex',alignItems:'center',gap:10,textDecoration:'none',flexShrink:0 }}>
            <AcpiBrand size={38} textSize=".76rem" stacked />
          </Link>
          <nav style={{ display:'flex',gap:2,flexWrap:'wrap' as const }}>
            {NAV.map(([l,h])=>(
              <Link key={h} href={h} className={`nav-lnk${h==='/pdf-forms'?' active':''}`}>{l}</Link>
            ))}
          </nav>
        </div>
      </header>

      {/* HERO */}
      <div style={{ background:'linear-gradient(135deg,#0d1b2a,#1b2f45)',padding:'40px 20px 34px',textAlign:'center' as const }}>
        <div style={{ display:'inline-flex',alignItems:'center',gap:7,background:'rgba(107,0,173,.2)',border:'1px solid rgba(107,0,173,.4)',borderRadius:99,padding:'4px 13px',fontSize:'.73rem',fontWeight:700,color:'#ce93d8',marginBottom:14 }}>
          {'\u{1F4C4}'} PDF Forms Library
        </div>
        <h1 style={{ fontFamily:"'Sora',sans-serif",fontSize:'clamp(1.6rem,3.5vw,2.3rem)',fontWeight:800,color:'#fff',marginBottom:10 }}>
          Government PDF Forms &amp; Documents
        </h1>
        <p style={{ color:'rgba(255,255,255,.55)',fontSize:'.95rem',marginBottom:6 }}>
          Application Forms {'\u00B7'} Syllabus {'\u00B7'} Question Papers {'\u00B7'} Answer Keys {'\u00B7'} Official Documents
        </p>
        <p style={{ color:'rgba(255,255,255,.35)',fontSize:'.78rem' }}>
          All documents hosted on Google Drive {'\u2014'} open directly in browser or download
        </p>
        <div style={{ maxWidth:680,margin:'20px auto 0',background:'rgba(255,255,255,.07)',border:'1px solid rgba(255,255,255,.12)',borderRadius:12,padding:'13px 20px',fontSize:'.8rem',color:'rgba(255,255,255,.6)',textAlign:'left' as const }}>
          <strong style={{color:'rgba(255,255,255,.8)'}}>{'\u{1F4CC}'} About this section:</strong> This library contains <strong style={{color:'#00b4d8'}}>official government forms, syllabi, question papers</strong> and similar documents.
          Job vacancy advertisement PDFs are separate {'\u2014'} find them on each individual job page.
        </div>
      </div>

      <div style={{ maxWidth:1180,margin:'0 auto',padding:'28px 20px 50px' }}>

        {/* Search + Category Filter */}
        <div style={{ background:'#fff',border:'1.5px solid #d4e0ec',borderRadius:13,padding:'18px 20px',marginBottom:24 }}>
          <div style={{ display:'flex',gap:12,alignItems:'center',flexWrap:'wrap' as const,marginBottom:14 }}>
            <input
              value={search}
              onChange={e=>setSearch(e.target.value)}
              placeholder={'\u{1F50D} Search forms, syllabus, papers...'}
              style={{ flex:1,minWidth:200,background:'#f0f4f8',border:'1.5px solid #d4e0ec',borderRadius:9,padding:'10px 14px',fontFamily:'Nunito,sans-serif',fontSize:'.84rem',outline:'none',color:'#1a1a2e' }}
            />
            <span style={{ fontSize:'.78rem',color:'#5a6a7a',whiteSpace:'nowrap' as const }}>{visible.length} documents</span>
          </div>
          <div style={{ display:'flex',gap:8,flexWrap:'wrap' as const }}>
            {ALL_CATS.map(c=>(
              <button key={c} onClick={()=>setCat(c)} className={`cat-btn ${cat===c?'on':''}`}>
                {CAT_ICONS[c]} {c}
              </button>
            ))}
          </div>
        </div>

        {visible.length === 0 ? (
          <div style={{ textAlign:'center' as const,padding:'60px 20px',color:'#5a6a7a' }}>
            <div style={{ fontSize:'2.5rem',marginBottom:12 }}>{'\u{1F4ED}'}</div>
            <div style={{ fontFamily:"'Sora',sans-serif",fontWeight:700 }}>No documents found</div>
            <div style={{ fontSize:'.83rem',marginTop:6 }}>Try a different search or category</div>
          </div>
        ) : (
          <div className="pgrid">
            {visible.map(form => {
              const imgSrc = toImgSrc(form.imageUrl)
              return (
                <Link key={form.id} href={form.href} className="pcard">
                  <div style={{
                    height:150, borderRadius:'10px 10px 0 0',
                    background:'#f3e5f5',
                    overflow:'hidden', display:'flex',
                    alignItems:'center', justifyContent:'center',
                    marginTop:-18, marginLeft:-20,
                    marginRight:-20, marginBottom:14,
                    width:'calc(100% + 40px)',
                  }}>
                    {imgSrc ? (
                      <img src={imgSrc} alt={form.title}
                        style={{ width:'100%', height:'100%', objectFit:'cover' }}
                        onError={(e)=>{ (e.target as HTMLImageElement).style.display='none' }} />
                    ) : (
                      <span style={{ fontSize:'3.5rem', opacity:.35 }}>
                        {CAT_ICONS[form.category] || '\u{1F4C4}'}
                      </span>
                    )}
                  </div>
                  <div style={{fontFamily:"'Sora',sans-serif",fontWeight:700,fontSize:'.88rem',color:'#1a1a2e',lineHeight:1.35,marginBottom:7}}>
                    {form.title}
                  </div>
                  <div style={{display:'flex',gap:7,flexWrap:'wrap' as const,alignItems:'center',marginBottom:10}}>
                    <span style={{display:'inline-block',background:'#f3e5f5',color:'#6a0dad',padding:'2px 8px',borderRadius:99,fontSize:'.68rem',fontWeight:700}}>
                      {form.category}
                    </span>
                    {form.uploadedAt && (
                      <span style={{fontSize:'.68rem',color:'#5a6a7a'}}>{'\u{1F4C5}'} {form.uploadedAt}</span>
                    )}
                    <span style={{fontSize:'.68rem',color:'#5a6a7a'}}>{'\u2B07\uFE0F'} {form.downloads.toLocaleString()} views</span>
                  </div>
                  <div style={{ background:'#f0f4f8',borderRadius:8,padding:'8px 11px',fontSize:'.75rem',color:'#5a6a7a',display:'flex',alignItems:'center',gap:7,marginBottom:10 }}>
                    <span style={{ fontSize:'1rem' }}>{'\u{1F517}'}</span>
                    <span>Stored on <strong style={{color:'#0d1b2a'}}>Google Drive</strong> {'\u2014'} opens in browser</span>
                  </div>
                  <div style={{
                    display:'flex', alignItems:'center', justifyContent:'space-between',
                    padding:'8px 12px', background:'#f0f4f8', borderRadius:9,
                    fontSize:'.78rem', color:'#00b4d8', fontWeight:700
                  }}>
                    <span>{'\u{1F4C4}'} View Full Details &amp; Download</span>
                    <span>{'\u2192'}</span>
                  </div>
                </Link>
              )
            })}
          </div>
        )}

      </div>

      {/* FOOTER */}
      <footer style={{ background:'#0d1b2a',padding:'18px',textAlign:'center' as const,fontSize:'.73rem',color:'rgba(255,255,255,.28)' }}>
        {'\u00A9'} 2025{'\u2013'}2026 Assam Career Point &amp; Info {'\u2014'} <Link href="/" style={{color:'rgba(255,255,255,.28)',textDecoration:'none'}}>Home</Link>
      </footer>
    </>
  )
}
