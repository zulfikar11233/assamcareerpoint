'use client'
import Link from 'next/link'
import { useState } from 'react'

type PdfForm = {
  id: number; title: string; titleAs?: string; category: string
  driveLink: string; uploadedAt?: string; downloads?: number
  slug?: string; imageUrl?: string; year?: string; pages?: string
  fileSize?: string; language?: string; source?: string; officialUrl?: string
  description?: string; descriptionAs?: string; keywords?: string
  howToFill?: string; howToFillAs?: string
}

const CAT_ICONS: Record<string,string> = {
  'Application Forms':'📝','Syllabus':'📖','Question Papers':'📋',
  'Answer Keys':'🔑','Govt Documents':'🏛️','Results':'📊','Other':'📄',
}

const TOOLS = [
  { name:'Bio-Data Maker',  emoji:'📋', href:'/tools/bio-data-maker',  desc:'Create professional bio-data for job applications' },
  { name:'Images to PDF',   emoji:'📄', href:'/tools/images-to-pdf',   desc:'Convert JPG/PNG images to a single PDF' },
  { name:'Age Calculator',  emoji:'🎂', href:'/tools/age-calculator',  desc:'Check exact age & eligibility for exams/jobs' },
  { name:'Word Counter',    emoji:'✍️', href:'/tools/word-counter',    desc:'Count words, characters, reading time' },
  { name:'Salary Calculator',emoji:'💰',href:'/salary-calculator',     desc:'Calculate in-hand salary after deductions' },
]

const NAV = [
  ['Home','/'],['Govt Jobs','/govt-jobs'],['Exams','/exams'],
  ['Information','/information'],['PDF Forms','/pdf-forms'],
  ['Results','/results'],['Tools','/tools'],
]

function getDriveId(link: string): string {
  const m = link?.match(/\/d\/([a-zA-Z0-9_-]+)/)
  return m ? m[1] : ''
}

function getDriveDownload(link: string): string {
  const id = getDriveId(link)
  return id ? `https://drive.google.com/uc?export=download&id=${id}` : link
}

export default function PdfDetailClient({ form }: { form: PdfForm }) {
  const [tab, setTab] = useState<'preview'|'info'>('preview')
  const [copied, setCopied] = useState(false)

  function copyLink() {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const catColor: Record<string,string> = {
    'Application Forms':'#7b1fa2','Syllabus':'#1565c0','Question Papers':'#2e7d32',
    'Answer Keys':'#e65100','Govt Documents':'#c62828','Results':'#00695c','Other':'#455a64',
  }
  const cc = catColor[form.category] || '#455a64'

  return (
    <>
      <style>{`
        *,*::before,*::after{box-sizing:border-box}
        html,body{margin:0;font-family:Nunito,sans-serif;background:#f0f4f8;color:#1a1a2e;overflow-x:hidden}
        .nav-lnk{color:rgba(255,255,255,.65);font-size:.82rem;font-weight:600;padding:7px 11px;border-radius:8px;text-decoration:none;white-space:nowrap;transition:.15s}
        .nav-lnk:hover,.nav-lnk.act{color:#00b4d8;background:rgba(255,255,255,.07)}
        .tab-btn{padding:9px 18px;border-radius:9px;font-size:.82rem;font-weight:700;cursor:pointer;border:1.5px solid #d4e0ec;background:#fff;color:#5a6a7a;font-family:Nunito,sans-serif;transition:.15s;flex:1;text-align:center}
        .tab-btn.on{background:#0d1b2a;color:#fff;border-color:#0d1b2a}
        .tab-btn:hover:not(.on){border-color:#00b4d8;color:#00b4d8}
        .tool-card{display:flex;align-items:flex-start;gap:10;padding:12px 14px;background:#fff;border:1.5px solid #e0eaf5;border-radius:11px;text-decoration:none;color:inherit;transition:.18s;flex:1;min-width:0}
        .tool-card:hover{transform:translateY(-2px);box-shadow:0 6px 20px rgba(0,0,0,.09);border-color:#00b4d8}
        .dl-btn{display:flex;align-items:center;justify-content:center;gap:8px;padding:14px 0;border-radius:11px;font-weight:800;font-size:.95rem;border:none;cursor:pointer;font-family:Nunito,sans-serif;transition:.15s;text-decoration:none;width:100%}
        .dl-btn:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,.2)}
        .info-row{display:flex;justify-content:space-between;padding:9px 0;border-bottom:1px solid #f0f4f8;font-size:.83rem;gap:12px}
        .faq-item{border-bottom:1px solid #f0f4f8;padding:12px 0}
        .faq-q{font-family:'Sora',sans-serif;font-weight:700;font-size:.84rem;color:#0d1b2a;margin-bottom:5px}
        .faq-a{font-size:.81rem;color:#5a6a7a;line-height:1.65}
        .preview-frame{width:100%;height:500px;border:none;border-radius:10px;background:#f8fafc}
        @media(max-width:700px){.main-grid{grid-template-columns:1fr!important}.preview-frame{height:360px!important}}
        @media(max-width:500px){.tools-row{grid-template-columns:1fr 1fr!important}}
      `}</style>

      {/* HEADER */}
      <header style={{background:'#0d1b2a',position:'sticky',top:0,zIndex:100,boxShadow:'0 2px 20px rgba(0,0,0,.28)'}}>
        <div style={{maxWidth:1180,margin:'0 auto',padding:'11px 20px',display:'flex',alignItems:'center',justifyContent:'space-between',gap:14}}>
          <Link href="/" style={{display:'flex',alignItems:'center',gap:10,textDecoration:'none',flexShrink:0}}>
            <div style={{width:36,height:36,background:'linear-gradient(135deg,#e63946,#f4a261)',borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800,color:'#fff',fontSize:'.95rem'}}>A</div>
            <div>
              <div style={{fontWeight:800,fontSize:'.86rem',color:'#fff',lineHeight:1.1}}>Assam Career<span style={{color:'#00b4d8'}}>Point</span></div>
              <div style={{fontSize:'.6rem',color:'rgba(255,255,255,.35)'}}>& Info</div>
            </div>
          </Link>
          <nav style={{display:'flex',gap:2,flexWrap:'wrap' as const}}>
            {NAV.map(([l,h]) => (
              <Link key={h} href={h} className={`nav-lnk${h==='/pdf-forms'?' act':''}`}>{l}</Link>
            ))}
          </nav>
        </div>
      </header>

      {/* BREADCRUMB */}
      <div style={{maxWidth:1180,margin:'0 auto',padding:'12px 20px 0',fontSize:'.76rem',color:'#8fa3b8',display:'flex',gap:6,alignItems:'center',flexWrap:'wrap' as const}}>
        <Link href="/" style={{color:'#8fa3b8',textDecoration:'none'}}>Home</Link>
        <span>›</span>
        <Link href="/pdf-forms" style={{color:'#8fa3b8',textDecoration:'none'}}>PDF Forms</Link>
        <span>›</span>
        <Link href={`/pdf-forms?cat=${form.category}`} style={{color:'#8fa3b8',textDecoration:'none'}}>{form.category}</Link>
        <span>›</span>
        <span style={{color:'#0d1b2a',fontWeight:600}}>{form.title.slice(0,40)}{form.title.length>40?'...':''}</span>
      </div>

      {/* HERO */}
      <div style={{background:'linear-gradient(135deg,#0d1b2a,#1b2f45)',padding:'28px 20px 32px',marginTop:8,textAlign:'center' as const}}>
        <div style={{display:'inline-flex',alignItems:'center',gap:7,background:`${cc}22`,border:`1px solid ${cc}55`,borderRadius:99,padding:'4px 13px',fontSize:'.73rem',fontWeight:700,color:'#fff',marginBottom:12,opacity:.9}}>
          {CAT_ICONS[form.category]||'📄'} {form.category}
          {form.year && <>&nbsp;·&nbsp;{form.year}</>}
        </div>
        <h1 style={{fontFamily:'Sora,sans-serif',fontSize:'clamp(1.2rem,3vw,1.8rem)',fontWeight:800,color:'#fff',maxWidth:700,margin:'0 auto 6px',lineHeight:1.3}}>
          {form.title}
        </h1>
        {form.titleAs && (
          <p style={{color:'rgba(255,255,255,.5)',fontSize:'.85rem',margin:'4px 0 0'}}>{form.titleAs}</p>
        )}
        <div style={{display:'flex',justifyContent:'center',gap:16,marginTop:14,flexWrap:'wrap' as const}}>
          {form.language && <span style={{fontSize:'.72rem',color:'rgba(255,255,255,.5)'}}>🌐 {form.language}</span>}
          {form.pages && <span style={{fontSize:'.72rem',color:'rgba(255,255,255,.5)'}}>📑 {form.pages} pages</span>}
          {form.fileSize && <span style={{fontSize:'.72rem',color:'rgba(255,255,255,.5)'}}>💾 {form.fileSize}</span>}
          {form.source && <span style={{fontSize:'.72rem',color:'rgba(255,255,255,.5)'}}>🏛️ {form.source}</span>}
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={{maxWidth:1180,margin:'0 auto',padding:'24px 20px 50px'}}>
        <div className="main-grid" style={{display:'grid',gridTemplateColumns:'1fr 340px',gap:20,alignItems:'start'}}>

          {/* LEFT — PREVIEW + CONTENT */}
          <div style={{display:'flex',flexDirection:'column' as const,gap:16}}>

            {/* Tab Switcher */}
            <div style={{display:'flex',gap:8}}>
              <button onClick={()=>setTab('preview')} className={`tab-btn${tab==='preview'?' on':''}`}>👁️ Preview PDF</button>
              <button onClick={()=>setTab('info')} className={`tab-btn${tab==='info'?' on':''}`}>📋 Details & FAQ</button>
            </div>

            {/* PREVIEW TAB */}
            {tab==='preview' && (
              <div style={{background:'#fff',border:'1.5px solid #d4e0ec',borderRadius:13,overflow:'hidden'}}>
                <div style={{padding:'10px 16px',background:'#f8fafc',borderBottom:'1px solid #e8eef5',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <span style={{fontSize:'.78rem',fontWeight:600,color:'#5a6a7a'}}>📄 PDF Preview</span>
                  <a href={form.driveLink} target="_blank" rel="nofollow noopener"
                    style={{fontSize:'.75rem',color:'#00b4d8',fontWeight:700,textDecoration:'none'}}>
                    Open full screen ↗
                  </a>
                </div>

                <div style={{padding:'20px',textAlign:'center' as const}}>
                  {/* Thumbnail — first page of PDF from Google Drive */}
                  {getDriveId(form.driveLink) && (
                    <div style={{marginBottom:20}}>
                      <img
                        src={`https://drive.google.com/thumbnail?id=${getDriveId(form.driveLink)}&sz=w600`}
                        alt={`Preview of ${form.title}`}
                        style={{
                          maxWidth:'100%', borderRadius:10,
                          border:'1.5px solid #e8eef5',
                          boxShadow:'0 4px 20px rgba(0,0,0,.08)',
                          display:'block', margin:'0 auto'
                        }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none'
                        }}
                      />
                      <p style={{fontSize:'.72rem',color:'#8fa3b8',marginTop:8}}>
                        ↑ Preview of first page
                      </p>
                    </div>
                  )}

                  {/* Primary open button */}
                  <a
                    href={form.driveLink}
                    target="_blank"
                    rel="nofollow noopener"
                    style={{
                      display:'inline-flex',alignItems:'center',gap:10,
                      padding:'14px 28px',borderRadius:12,
                      background:'linear-gradient(135deg,#0d1b2a,#1b3a5c)',
                      color:'#fff',fontWeight:800,fontSize:'1rem',
                      textDecoration:'none',marginBottom:12,
                      boxShadow:'0 4px 16px rgba(0,0,0,.2)'
                    }}
                  >
                    👁️ View PDF in Google Drive
                  </a>

                  <div style={{display:'flex',gap:10,justifyContent:'center',flexWrap:'wrap' as const}}>
                    <a href={getDriveDownload(form.driveLink)} target="_blank" rel="nofollow noopener"
                      style={{
                        display:'inline-flex',alignItems:'center',gap:7,
                        padding:'10px 20px',borderRadius:9,
                        background:'#e8f5e9',color:'#2e7d32',
                        fontWeight:700,fontSize:'.85rem',textDecoration:'none',
                        border:'1.5px solid #a5d6a7'
                      }}>
                      ⬇️ Download PDF
                    </a>
                  </div>

                  <p style={{fontSize:'.72rem',color:'#8fa3b8',marginTop:16,lineHeight:1.6}}>
                    PDF opens in Google Drive viewer. <br/>
                    To download: click ⬇️ or tap <strong>⋮ → Download</strong> inside Google Drive.
                  </p>
                </div>
              </div>
            )}

            {/* INFO TAB */}
            {tab==='info' && (
              <div style={{display:'flex',flexDirection:'column' as const,gap:14}}>

                {/* Document Details */}
                <div style={{background:'#fff',border:'1.5px solid #d4e0ec',borderRadius:13,padding:'20px 22px'}}>
                  <h2 style={{fontFamily:'Sora,sans-serif',fontWeight:700,fontSize:'.95rem',color:'#0d1b2a',margin:'0 0 14px'}}>
                    📋 Document Details
                  </h2>
                  {[
                    ['Category', form.category],
                    ['Language', form.language],
                    ['Year', form.year],
                    ['Number of Pages', form.pages],
                    ['File Size', form.fileSize],
                    ['Official Source', form.source],
                    ['Added On', form.uploadedAt],
                  ].filter(([,v])=>v).map(([label,val])=>(
                    <div key={label} className="info-row">
                      <span style={{color:'#8fa3b8',fontWeight:600}}>{label}</span>
                      <span style={{fontWeight:700,color:'#0d1b2a',textAlign:'right' as const}}>{val}</span>
                    </div>
                  ))}
                  {form.officialUrl && (
                    <div className="info-row">
                      <span style={{color:'#8fa3b8',fontWeight:600}}>Official Website</span>
                      <a href={form.officialUrl} target="_blank" rel="nofollow noopener"
                        style={{fontWeight:700,color:'#00b4d8',textDecoration:'none',textAlign:'right' as const}}>
                        Visit ↗
                      </a>
                    </div>
                  )}
                </div>

                {/* About — English */}
                {form.description && (
                  <div style={{background:'#fff',border:'1.5px solid #d4e0ec',borderRadius:13,padding:'20px 22px'}}>
                    <h2 style={{fontFamily:'Sora,sans-serif',fontWeight:700,fontSize:'.95rem',color:'#0d1b2a',margin:'0 0 10px'}}>
                      📝 About this Document
                    </h2>
                    <p style={{fontSize:'.86rem',color:'#5a6a7a',lineHeight:1.75,margin:0}}>
                      {form.description}
                    </p>
                    {form.howToFill && (
                      <>
                        <h3 style={{fontFamily:'Sora,sans-serif',fontWeight:700,fontSize:'.85rem',color:'#0d1b2a',margin:'16px 0 8px'}}>
                          ✏️ How to Fill / Use
                        </h3>
                        <p style={{fontSize:'.84rem',color:'#5a6a7a',lineHeight:1.75,margin:0,whiteSpace:'pre-line' as const}}>
                          {form.howToFill}
                        </p>
                      </>
                    )}
                  </div>
                )}

                {/* About — Assamese */}
                {form.descriptionAs && (
                  <div style={{background:'#fff',border:'1.5px solid #1dbfad33',borderRadius:13,padding:'20px 22px'}}>
                    <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:10}}>
                      <span style={{fontSize:'1.2rem'}}>🇮🇳</span>
                      <h2 style={{fontFamily:'Sora,sans-serif',fontWeight:700,fontSize:'.95rem',color:'#0d1b2a',margin:0}}>
                        অসমীয়াত বিৱৰণ
                      </h2>
                    </div>
                    <p style={{fontSize:'.86rem',color:'#5a6a7a',lineHeight:1.9,margin:0}}>
                      {form.descriptionAs}
                    </p>
                    {form.howToFillAs && (
                      <>
                        <h3 style={{fontFamily:'Sora,sans-serif',fontWeight:700,fontSize:'.85rem',color:'#0d1b2a',margin:'16px 0 8px'}}>
                          ✏️ কেনেকৈ পূৰণ কৰিব
                        </h3>
                        <p style={{fontSize:'.84rem',color:'#5a6a7a',lineHeight:1.9,margin:0,whiteSpace:'pre-line' as const}}>
                          {form.howToFillAs}
                        </p>
                      </>
                    )}
                  </div>
                )}

                {/* FAQ */}
                <div style={{background:'#fff',border:'1.5px solid #d4e0ec',borderRadius:13,padding:'20px 22px'}}>
                  <h2 style={{fontFamily:'Sora,sans-serif',fontWeight:700,fontSize:'.95rem',color:'#0d1b2a',margin:'0 0 14px'}}>
                    ❓ Frequently Asked Questions
                  </h2>
                  {[
                    [`Is "${form.title}" free to download?`,
                     `Yes — completely free. Click "⬇️ Download PDF" to get it instantly. No registration required.`],
                    [`Is this the official document?`,
                     `This document has been sourced from ${form.source||'official government sources'}. We recommend verifying at the official website before use.`],
                    [`How to download on mobile?`,
                     `Tap "⬇️ Download PDF" → opens in Google Drive → tap the ⋮ menu (3 dots) → "Download". Or tap "Open in Drive ↗" to view in full screen.`],
                    [`What format is this document?`,
                     `This document is in PDF format. You can view it on any device using a PDF viewer, or print it directly.`],
                    [`Can I share this document?`,
                     `Yes. Use the "📋 Copy Link" button to share this page. The link is permanent and will always work.`],
                  ].map(([q,a],i)=>(
                    <div key={i} className="faq-item" style={{borderBottom: i<4?'1px solid #f0f4f8':'none'}}>
                      <div className="faq-q">Q: {q}</div>
                      <div className="faq-a">A: {a}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT SIDEBAR */}
          <div style={{display:'flex',flexDirection:'column' as const,gap:14,position:'sticky',top:80}}>

            {/* Download Card */}
            <div style={{background:'#fff',border:'1.5px solid #d4e0ec',borderRadius:13,padding:'20px 18px'}}>
              <div style={{display:'flex',gap:10,alignItems:'flex-start',marginBottom:16}}>
                <div style={{width:50,height:50,borderRadius:10,background:`${cc}18`,border:`1.5px solid ${cc}33`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.6rem',flexShrink:0,overflow:'hidden'}}>
                  {form.imageUrl && form.imageUrl.startsWith('http')
                    ? <img src={form.imageUrl} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}} />
                    : CAT_ICONS[form.category]||'📄'
                  }
                </div>
                <div>
                  <div style={{fontFamily:'Sora,sans-serif',fontWeight:700,fontSize:'.84rem',color:'#0d1b2a',lineHeight:1.35}}>
                    {form.title}
                  </div>
                  <div style={{fontSize:'.7rem',color:'#8fa3b8',marginTop:3}}>
                    {form.category} {form.year && `· ${form.year}`}
                  </div>
                </div>
              </div>

              <a href={getDriveDownload(form.driveLink)} target="_blank" rel="nofollow noopener"
                className="dl-btn"
                style={{background:'linear-gradient(135deg,#0d1b2a,#1b3a5c)',color:'#fff',marginBottom:8}}>
                ⬇️ Download PDF
              </a>

              <a href={form.driveLink} target="_blank" rel="nofollow noopener"
                className="dl-btn"
                style={{background:'#f0f4f8',color:'#0d1b2a',border:'1.5px solid #d4e0ec'}}>
                👁️ Open in Google Drive
              </a>

              <div style={{marginTop:12,paddingTop:12,borderTop:'1px solid #f0f4f8',display:'flex',gap:8}}>
                {/* WhatsApp Share */}
                <a href={`https://wa.me/?text=${encodeURIComponent(`📄 ${form.title}\n\nFree PDF Download: ${typeof window!=='undefined'?window.location.href:''}`)}`}
                  target="_blank" rel="nofollow noopener"
                  style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',gap:5,padding:'9px 0',background:'#dcfce7',color:'#16a34a',borderRadius:9,fontSize:'.75rem',fontWeight:700,textDecoration:'none',border:'1.5px solid #bbf7d0'}}>
                  💬 WhatsApp
                </a>
                <button onClick={copyLink}
                  style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',gap:5,padding:'9px 0',background:'#f0f4f8',color:'#0d1b2a',borderRadius:9,fontSize:'.75rem',fontWeight:700,cursor:'pointer',border:'1.5px solid #d4e0ec',fontFamily:'Nunito,sans-serif'}}>
                  {copied ? '✅ Copied!' : '📋 Copy Link'}
                </button>
              </div>
            </div>

            {/* Disclaimer */}
            <div style={{background:'#fff8e1',border:'1.5px solid #ffe082',borderRadius:11,padding:'12px 14px',fontSize:'.74rem',color:'#7c5e0a',lineHeight:1.6}}>
              ⚠️ <strong>Disclaimer:</strong> This document is sourced from official government sources.
              Always verify at the official website before submission. Assam Career Point & Info is not
              responsible for any changes made to the document after publication.
            </div>

            {/* Back link */}
            <Link href="/pdf-forms"
              style={{display:'flex',alignItems:'center',gap:6,padding:'10px 14px',background:'#fff',border:'1.5px solid #d4e0ec',borderRadius:10,color:'#5a6a7a',textDecoration:'none',fontSize:'.82rem',fontWeight:600}}>
              ← Back to PDF Library
            </Link>
          </div>
        </div>

        {/* FREE TOOLS SECTION */}
        <div style={{marginTop:28,background:'#fff',border:'1.5px solid #d4e0ec',borderRadius:13,padding:'20px 22px'}}>
          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:4}}>
            <span style={{fontSize:'1.3rem'}}>🛠️</span>
            <h2 style={{fontFamily:'Sora,sans-serif',fontWeight:800,fontSize:'1rem',color:'#0d1b2a',margin:0}}>
              Free Tools — Available on This Portal
            </h2>
            <span style={{marginLeft:'auto',fontSize:'.72rem',color:'#8fa3b8',fontWeight:600}}>All Free · No Sign-up</span>
          </div>
          <p style={{fontSize:'.78rem',color:'#8fa3b8',margin:'0 0 14px'}}>
            Useful government job & exam preparation tools
          </p>
          <div className="tools-row" style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10}}>
            {TOOLS.map(t=>(
              <Link key={t.name} href={t.href} className="tool-card" style={{textDecoration:'none',color:'inherit',display:'flex',alignItems:'flex-start',gap:10,padding:'12px 14px',background:'#fff',border:'1.5px solid #e0eaf5',borderRadius:11,transition:'.18s'}}>
                <span style={{fontSize:'1.5rem',flexShrink:0}}>{t.emoji}</span>
                <div>
                  <div style={{fontFamily:'Sora,sans-serif',fontWeight:700,fontSize:'.8rem',color:'#0d1b2a',marginBottom:2}}>{t.name}</div>
                  <div style={{fontSize:'.7rem',color:'#8fa3b8',lineHeight:1.4}}>{t.desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>

      {/* FOOTER */}
      <footer style={{background:'#0d1b2a',padding:'18px',textAlign:'center' as const,fontSize:'.73rem',color:'rgba(255,255,255,.28)'}}>
        © 2025–2026 Assam Career Point & Info —{' '}
        <Link href="/" style={{color:'rgba(255,255,255,.28)',textDecoration:'none'}}>Home</Link>
        {' · '}
        <Link href="/pdf-forms" style={{color:'rgba(255,255,255,.28)',textDecoration:'none'}}>PDF Forms</Link>
      </footer>
    </>
  )
}
