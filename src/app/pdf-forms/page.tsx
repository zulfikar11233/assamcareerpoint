'use client'
// src/app/pdf-forms/page.tsx — ACPI PDF Forms Library
// ✅ Shows ONLY government PDF forms (syllabus, application forms, question papers etc.)
// ✅ All stored as Google Drive links — NOT base64, NOT job advertisement PDFs
// ✅ Job advertisement PDFs are on the job detail page, NOT here

import Link from 'next/link'
import { useState, useEffect } from 'react'

type PdfForm = {
  id: number
  title: string
  category: string
  driveLink: string
  uploadedAt: string
  downloads: number
}

const SAMPLE: PdfForm[] = [
  { id:1,  title:'APSC CCE Prelims Syllabus 2026',                category:'Syllabus',         driveLink:'https://drive.google.com/file/d/example1/view', uploadedAt:'15 Feb 2026', downloads:12450 },
  { id:2,  title:'Assam Police SI Application Form 2026',         category:'Application Forms', driveLink:'https://drive.google.com/file/d/example2/view', uploadedAt:'20 Feb 2026', downloads:8200  },
  { id:3,  title:'CTET Previous Year Question Paper 2025',        category:'Question Papers',   driveLink:'https://drive.google.com/file/d/example3/view', uploadedAt:'10 Jan 2026', downloads:6780  },
  { id:4,  title:'NEET UG Answer Key 2025 Official',              category:'Answer Keys',       driveLink:'https://drive.google.com/file/d/example4/view', uploadedAt:'05 Jun 2025', downloads:9100  },
  { id:5,  title:'Voter ID Form 6 — New Voter Registration',      category:'Govt Documents',    driveLink:'https://drive.google.com/file/d/example5/view', uploadedAt:'01 Jan 2026', downloads:3400  },
  { id:6,  title:'RRB Group D Syllabus & Exam Pattern 2026',      category:'Syllabus',         driveLink:'https://drive.google.com/file/d/example6/view', uploadedAt:'12 Mar 2026', downloads:5600  },
  { id:7,  title:'SBI Clerk Prelims Question Paper 2024',         category:'Question Papers',   driveLink:'https://drive.google.com/file/d/example7/view', uploadedAt:'28 Nov 2024', downloads:7200  },
  { id:8,  title:'UPSC CSE Prelims GS Paper I 2025',              category:'Question Papers',   driveLink:'https://drive.google.com/file/d/example8/view', uploadedAt:'02 Jun 2025', downloads:11300 },
  { id:9,  title:'Assam TET Syllabus — Paper I & II',             category:'Syllabus',         driveLink:'https://drive.google.com/file/d/example9/view', uploadedAt:'18 Feb 2026', downloads:4500  },
  { id:10, title:'PAN–Aadhaar Link Form — Income Tax Dept',       category:'Govt Documents',    driveLink:'https://drive.google.com/file/d/example10/view',uploadedAt:'01 Mar 2026', downloads:2800  },
]

const ALL_CATS = ['All','Application Forms','Syllabus','Question Papers','Answer Keys','Govt Documents','Results','Other']

const CAT_ICONS: Record<string,string> = {
  'All':'📂','Application Forms':'📝','Syllabus':'📖','Question Papers':'📋',
  'Answer Keys':'🔑','Govt Documents':'🏛️','Results':'📊','Other':'📄',
}

const NAV = [['Home','/'],['Govt Jobs','/govt-jobs'],['Exams','/exams'],['Information','/information'],['PDF Forms','/pdf-forms']]

export default function PdfFormsPage() {
  const [forms,    setForms]   = useState<PdfForm[]>([])
  const [cat,      setCat]     = useState('All')
  const [search,   setSearch]  = useState('')
  const [tracked,  setTracked] = useState<Record<number,number>>({})

  useEffect(() => {
    try {
      const sp = localStorage.getItem('acp_pdfforms_v6')
      setForms(sp ? JSON.parse(sp) : SAMPLE)
      const st = localStorage.getItem('acp_pdf_dl')
      if (st) setTracked(JSON.parse(st))
    } catch { setForms(SAMPLE) }
  }, [])

  function openDrive(form: PdfForm) {
    // Track download count locally
    const updated = { ...tracked, [form.id]: (tracked[form.id] || 0) + 1 }
    setTracked(updated)
    localStorage.setItem('acp_pdf_dl', JSON.stringify(updated))
    window.open(form.driveLink, '_blank')
  }

  const visible = forms.filter(f =>
    (cat === 'All' || f.category === cat) &&
    f.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        html, body { overflow-x: hidden; max-width: 100vw; margin: 0; font-family: Nunito, sans-serif; background: #f0f4f8; color: #1a1a2e; }
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800&family=Nunito:wght@400;600;700&display=swap');
        .nav a:hover { color:#fff !important; }
        .cat-btn { padding:7px 14px;border-radius:99px;font-size:.77rem;font-weight:700;cursor:pointer;border:1.5px solid #d4e0ec;background:#fff;color:#5a6a7a;font-family:Nunito,sans-serif;transition:.15s; }
        .cat-btn.on { background:#0d1b2a;color:#fff;border-color:#0d1b2a; }
        .cat-btn:hover:not(.on) { border-color:#00b4d8;color:#00b4d8; }
        .pcard { background:#fff;border:1.5px solid #d4e0ec;border-radius:13px;padding:18px 20px;transition:.2s;display:flex;flex-direction:column;gap:10px; }
        .pcard:hover { transform:translateY(-3px);box-shadow:0 8px 28px rgba(0,0,0,.09); }
        .pgrid { display:grid;grid-template-columns:repeat(auto-fill,minmax(310px,1fr));gap:16px; }
        .dl-btn { display:flex;align-items:center;justify-content:center;gap:7px;padding:10px 16px;border-radius:9px;background:linear-gradient(135deg,#0d1b2a,#1b2f45);color:#fff;font-weight:700;font-size:.82rem;border:none;cursor:pointer;font-family:Nunito,sans-serif;width:100%;transition:.15s; }
        .dl-btn:hover { background:linear-gradient(135deg,#1b2f45,#0a3050);transform:translateY(-1px); }
        .prev-btn { display:flex;align-items:center;justify-content:center;gap:7px;padding:10px 16px;border-radius:9px;background:#f0f4f8;color:#0d1b2a;font-weight:700;font-size:.82rem;border:1.5px solid #d4e0ec;cursor:pointer;font-family:Nunito,sans-serif;width:100%;transition:.15s; }
        .prev-btn:hover { background:#e0f7fc;border-color:#00b4d8;color:#0096b7; }
      `}</style>

      {/* HEADER */}
      <header style={{ background:'#0d1b2a',position:'sticky',top:0,zIndex:100,boxShadow:'0 2px 20px rgba(0,0,0,.28)' }}>
        <div style={{ maxWidth:1180,margin:'0 auto',padding:'11px 20px',display:'flex',alignItems:'center',justifyContent:'space-between',gap:14 }}>
          <Link href="/" style={{ display:'flex',alignItems:'center',gap:10,textDecoration:'none',flexShrink:0 }}>
            <div style={{ width:36,height:36,background:'linear-gradient(135deg,#e63946,#f4a261)',borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Sora',sans-serif",fontWeight:800,color:'#fff',fontSize:'.95rem' }}>A</div>
            <div>
              <div style={{ fontFamily:"'Sora',sans-serif",fontWeight:800,fontSize:'.86rem',color:'#fff',lineHeight:1.1 }}>Assam Career<span style={{color:'#00b4d8'}}>Point</span></div>
              <div style={{ fontSize:'.6rem',color:'rgba(255,255,255,.35)' }}>& Info</div>
            </div>
          </Link>
          <nav style={{ display:'flex',gap:2 }}>
            {NAV.map(([l,h])=>(
              <Link key={h} href={h} style={{ color: h==='/pdf-forms' ? '#00b4d8' : 'rgba(255,255,255,.65)', fontSize:'.82rem',fontWeight:600,padding:'7px 10px',borderRadius:8,textDecoration:'none',whiteSpace:'nowrap' }}>{l}</Link>
            ))}
          </nav>
        </div>
      </header>

      {/* HERO */}
      <div style={{ background:'linear-gradient(135deg,#0d1b2a,#1b2f45)',padding:'40px 20px 34px',textAlign:'center' }}>
        <div style={{ display:'inline-flex',alignItems:'center',gap:7,background:'rgba(107,0,173,.2)',border:'1px solid rgba(107,0,173,.4)',borderRadius:99,padding:'4px 13px',fontSize:'.73rem',fontWeight:700,color:'#ce93d8',marginBottom:14 }}>
          📄 PDF Forms Library
        </div>
        <h1 style={{ fontFamily:"'Sora',sans-serif",fontSize:'clamp(1.6rem,3.5vw,2.3rem)',fontWeight:800,color:'#fff',marginBottom:10 }}>
          Government PDF Forms & Documents
        </h1>
        <p style={{ color:'rgba(255,255,255,.55)',fontSize:'.95rem',marginBottom:6 }}>
          Application Forms · Syllabus · Question Papers · Answer Keys · Official Documents
        </p>
        <p style={{ color:'rgba(255,255,255,.35)',fontSize:'.78rem' }}>
          All documents hosted on Google Drive — open directly in browser or download
        </p>

        {/* Info box */}
        <div style={{ maxWidth:680,margin:'20px auto 0',background:'rgba(255,255,255,.07)',border:'1px solid rgba(255,255,255,.12)',borderRadius:12,padding:'13px 20px',fontSize:'.8rem',color:'rgba(255,255,255,.6)',textAlign:'left' }}>
          <strong style={{color:'rgba(255,255,255,.8)'}}>📌 About this section:</strong> This library contains <strong style={{color:'#00b4d8'}}>official government forms, syllabi, question papers</strong> and similar documents.
          Job vacancy advertisement PDFs are separate — find them on each individual job page.
        </div>
      </div>

      <div style={{ maxWidth:1180,margin:'0 auto',padding:'28px 20px 50px' }}>

        {/* Search + Category Filter */}
        <div style={{ background:'#fff',border:'1.5px solid #d4e0ec',borderRadius:13,padding:'18px 20px',marginBottom:24 }}>
          <div style={{ display:'flex',gap:12,alignItems:'center',flexWrap:'wrap' as const,marginBottom:14 }}>
            <input
              value={search}
              onChange={e=>setSearch(e.target.value)}
              placeholder="🔍 Search forms, syllabus, papers..."
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

        {/* Grid */}
        {visible.length === 0 ? (
          <div style={{ textAlign:'center' as const,padding:'60px 20px',color:'#5a6a7a' }}>
            <div style={{ fontSize:'2.5rem',marginBottom:12 }}>📭</div>
            <div style={{ fontFamily:"'Sora',sans-serif",fontWeight:700 }}>No documents found</div>
            <div style={{ fontSize:'.83rem',marginTop:6 }}>Try a different search or category</div>
          </div>
        ) : (
          <div className="pgrid">
            {visible.map(form => (
              <div key={form.id} className="pcard">
                <div style={{ display:'flex',gap:12,alignItems:'flex-start' }}>
                  <div style={{ width:44,height:44,borderRadius:10,background:'#f3e5f5',border:'1.5px solid #ce93d8',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.4rem',flexShrink:0 }}>
                    {CAT_ICONS[form.category]||'📄'}
                  </div>
                  <div style={{ flex:1,minWidth:0 }}>
                    <div style={{ fontFamily:"'Sora',sans-serif",fontWeight:700,fontSize:'.86rem',color:'#1a1a2e',lineHeight:1.35,marginBottom:5 }}>{form.title}</div>
                    <div style={{ display:'flex',gap:7,flexWrap:'wrap' as const,alignItems:'center' }}>
                      <span style={{ display:'inline-block',background:'#f3e5f5',color:'#6a0dad',padding:'2px 8px',borderRadius:99,fontSize:'.68rem',fontWeight:700 }}>{form.category}</span>
                      <span style={{ fontSize:'.68rem',color:'#5a6a7a' }}>📅 {form.uploadedAt}</span>
                      <span style={{ fontSize:'.68rem',color:'#5a6a7a' }}>⬇️ {((tracked[form.id]||0)+(form.downloads||0)).toLocaleString()} views</span>
                    </div>
                  </div>
                </div>

                {/* Drive info */}
                <div style={{ background:'#f0f4f8',borderRadius:8,padding:'8px 11px',fontSize:'.75rem',color:'#5a6a7a',display:'flex',alignItems:'center',gap:7 }}>
                  <span style={{ fontSize:'1rem' }}>🔗</span>
                  <span>Stored on <strong style={{color:'#0d1b2a'}}>Google Drive</strong> — opens in browser</span>
                </div>

                {/* Buttons */}
                <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:8 }}>
                  <button className="prev-btn" onClick={()=>window.open(form.driveLink,'_blank')}>
                    👁️ View
                  </button>
                  <button className="dl-btn" onClick={()=>openDrive(form)}>
                    ⬇️ Open / Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* How to upload */}
        <div style={{ background:'#fff',border:'1.5px solid #d4e0ec',borderRadius:13,padding:'20px 24px',marginTop:32 }}>
          <h3 style={{ fontFamily:"'Sora',sans-serif",fontWeight:700,fontSize:'.95rem',color:'#1a1a2e',marginBottom:14 }}>
            💡 How to add new documents (for Admin)
          </h3>
          <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:14 }}>
            {[
              ['1','Upload to Drive','Upload the PDF to your Google Drive account'],
              ['2','Set Sharing','Right-click → Share → "Anyone with the link" → Copy'],
              ['3','Paste in Admin','Go to Admin → PDF Forms → Add PDF Form → Paste link'],
              ['4','Publish','Click "Add to Library" — it appears here immediately'],
            ].map(([n,t,d])=>(
              <div key={n} style={{ display:'flex',gap:11,alignItems:'flex-start' }}>
                <div style={{ width:28,height:28,borderRadius:8,background:'#0d1b2a',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Sora',sans-serif",fontWeight:800,fontSize:'.8rem',flexShrink:0 }}>{n}</div>
                <div>
                  <div style={{ fontFamily:"'Sora',sans-serif",fontWeight:700,fontSize:'.82rem',color:'#0d1b2a',marginBottom:2 }}>{t}</div>
                  <div style={{ fontSize:'.76rem',color:'#5a6a7a' }}>{d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* FOOTER */}
      <footer style={{ background:'#0d1b2a',padding:'18px',textAlign:'center' as const,fontSize:'.73rem',color:'rgba(255,255,255,.28)' }}>
        © 2025–2026 Assam Career Point & Info — <Link href="/" style={{color:'rgba(255,255,255,.28)',textDecoration:'none'}}>Home</Link>
      </footer>
    </>
  )
}
