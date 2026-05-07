'use client'
// Client component – handles UI, links, and interactivity
import Link from 'next/link'

// Type definition for the PDF form data
type PdfForm = {
  id: number          // Unique identifier
  title: string       // Document title
  category: string    // Category (Syllabus, Application Forms, etc.)
  driveLink: string   // Google Drive shareable link
  uploadedAt: string  // Upload date (e.g., "15 Feb 2026")
  downloads: number   // Number of downloads
}

// Map category names to emoji icons
const CAT_ICONS: Record<string, string> = {
  'Application Forms':'📝',
  'Syllabus':'📖',
  'Question Papers':'📋',
  'Answer Keys':'🔑',
  'Govt Documents':'🏛️',
  'Results':'📊',
  'Other':'📄',
}

// Header navigation links
const NAV = [
  ['Home','/'],
  ['Govt Jobs','/govt-jobs'],
  ['Exams','/exams'],
  ['Information','/information'],
  ['PDF Forms','/pdf-forms'],
  ['Results','/results'],
  ['Tools','/tools']
]

export default function PdfDetailClient({ form }: { form: PdfForm }) {
  return (
    <>
      {/* Global styles for this page */}
      <style>{`
        *,*::before,*::after{box-sizing:border-box}
        html,body{margin:0;font-family:Nunito,sans-serif;background:#f0f4f8;color:#1a1a2e;overflow-x:hidden}
        .nav-link{color:rgba(255,255,255,.65);font-size:.82rem;font-weight:600;padding:7px 11px;border-radius:8px;text-decoration:none;white-space:nowrap;transition:.15s}
        .nav-link:hover,.nav-link.active{color:#00b4d8;background:rgba(255,255,255,.07)}
        .dl-btn{display:flex;align-items:center;justify-content:center;gap:8px;padding:14px 24px;border-radius:10px;background:linear-gradient(135deg,#0d1b2a,#1b2f45);color:#fff;font-weight:700;font-size:.95rem;border:none;cursor:pointer;font-family:Nunito,sans-serif;text-decoration:none;transition:.15s}
        .dl-btn:hover{background:linear-gradient(135deg,#1b2f45,#0a3050);transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,.2)}
      `}</style>

      {/* Header – Sticky navigation bar */}
      <header style={{background:'#0d1b2a',position:'sticky',top:0,zIndex:100,boxShadow:'0 2px 20px rgba(0,0,0,.28)'}}>
        <div style={{maxWidth:1180,margin:'0 auto',padding:'11px 20px',display:'flex',alignItems:'center',justifyContent:'space-between',gap:14}}>
          <Link href="/" style={{display:'flex',alignItems:'center',gap:10,textDecoration:'none',flexShrink:0}}>
            <div style={{width:36,height:36,background:'linear-gradient(135deg,#e63946,#f4a261)',borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800,color:'#fff',fontSize:'.95rem'}}>A</div>
            <div>
              <div style={{fontWeight:800,fontSize:'.86rem',color:'#fff',lineHeight:1.1}}>Assam Career<span style={{color:'#00b4d8'}}>Point</span></div>
              <div style={{fontSize:'.6rem',color:'rgba(255,255,255,.35)'}}>& Info</div>
            </div>
          </Link>
          <nav style={{display:'flex',gap:2,flexWrap:'wrap'}}>
            {NAV.map(([l,h]) => (
              <Link key={h} href={h} className={`nav-link${h==='/pdf-forms'?' active':''}`}>{l}</Link>
            ))}
          </nav>
        </div>
      </header>

      {/* Hero banner */}
      <div style={{background:'linear-gradient(135deg,#0d1b2a,#1b2f45)',padding:'40px 20px 34px',textAlign:'center'}}>
        <Link href="/pdf-forms" style={{display:'inline-flex',alignItems:'center',gap:6,color:'rgba(255,255,255,.5)',fontSize:'.8rem',textDecoration:'none',marginBottom:14}}>
          ← Back to PDF Library
        </Link>
        <div style={{display:'inline-flex',alignItems:'center',gap:7,background:'rgba(107,0,173,.2)',border:'1px solid rgba(107,0,173,.4)',borderRadius:99,padding:'4px 13px',fontSize:'.73rem',fontWeight:700,color:'#ce93d8',marginBottom:14,marginLeft:12}}>
          {CAT_ICONS[form.category]||'📄'} {form.category}
        </div>
        <h1 style={{fontFamily:'Sora,sans-serif',fontSize:'clamp(1.4rem,3vw,2rem)',fontWeight:800,color:'#fff',maxWidth:700,margin:'0 auto 12px'}}>{form.title}</h1>
        <p style={{color:'rgba(255,255,255,.45)',fontSize:'.8rem'}}>📅 Added: {form.uploadedAt} &nbsp;·&nbsp; ⬇️ {(form.downloads||0).toLocaleString()} downloads</p>
      </div>

      {/* Main content area – 680px max width */}
      <div style={{maxWidth:680,margin:'40px auto',padding:'0 20px 60px'}}>
        
        {/* Download card */}
        <div style={{background:'#fff',border:'1.5px solid #d4e0ec',borderRadius:14,padding:'28px 24px',textAlign:'center'}}>
          <div style={{fontSize:'3rem',marginBottom:16}}>{CAT_ICONS[form.category]||'📄'}</div>
          <h2 style={{fontFamily:'Sora,sans-serif',fontWeight:700,fontSize:'1.1rem',color:'#1a1a2e',marginBottom:8}}>{form.title}</h2>
          <p style={{color:'#5a6a7a',fontSize:'.85rem',marginBottom:24}}>This document is stored on Google Drive. Click below to open it in your browser or download it for free.</p>
          <div style={{background:'#f0f4f8',borderRadius:10,padding:'12px 16px',fontSize:'.78rem',color:'#5a6a7a',marginBottom:24,textAlign:'left'}}>
            📌 <strong>How to download:</strong> After opening in Google Drive, click the ⬇️ download icon at the top right corner.
          </div>
          <a href={form.driveLink} target="_blank" rel="nofollow noopener" className="dl-btn" style={{display:'flex',maxWidth:320,margin:'0 auto 12px'}}>
            ⬇️ Open & Download PDF
          </a>
          <a href={form.driveLink} target="_blank" rel="nofollow noopener" style={{display:'inline-block',color:'#5a6a7a',fontSize:'.8rem',textDecoration:'underline'}}>
            👁️ Preview in browser
          </a>
        </div>

        {/* ── SEO CONTENT SECTION (300-500 words of unique text) ── */}
        <div style={{background:'#fff',border:'1.5px solid #d4e0ec',borderRadius:14,padding:'24px',marginTop:16}}>
          <h2 style={{fontFamily:'Sora,sans-serif',fontWeight:700,fontSize:'1rem',color:'#1a1a2e',marginBottom:12}}>
            📋 About this Document
          </h2>
          <p style={{fontSize:'.86rem',color:'#5a6a7a',lineHeight:1.7,marginBottom:12}}>
            <strong>{form.title}</strong> is an official document under the <strong>{form.category}</strong> category,
            made available for free download on Assam Career Point & Info. This document is sourced from
            official government sources and is relevant for candidates, students, and citizens in Assam.
          </p>
          <p style={{fontSize:'.86rem',color:'#5a6a7a',lineHeight:1.7,marginBottom:0}}>
            You can view this document directly in your browser via Google Drive, or download it for
            offline use. No login or registration is required to access this document.
          </p>
        </div>

        {/* ── FAQ SECTION (helps get featured snippet in search) ── */}
        <div style={{background:'#fff',border:'1.5px solid #d4e0ec',borderRadius:14,padding:'24px',marginTop:16}}>
          <h2 style={{fontFamily:'Sora,sans-serif',fontWeight:700,fontSize:'1rem',color:'#1a1a2e',marginBottom:16}}>
            ❓ Frequently Asked Questions
          </h2>
          {[
            [`Is "${form.title}" free to download?`, `Yes, this document is completely free to download. Click the "Open & Download PDF" button above.`],
            [`Is this the official version?`, `This document has been sourced from official government sources. We recommend verifying at the official website before use.`],
            [`How do I download this on mobile?`, `Tap "Open & Download PDF" → the document opens in Google Drive → tap the ⋮ menu → "Download".`],
            [`In which format is this document?`, `This document is available in PDF format, viewable on any device.`],
          ].map(([q,a],i)=>(
            <div key={i} style={{borderBottom: i<3?'1px solid #f0f4f8':'none',paddingBottom:14,marginBottom:14}}>
              <div style={{fontFamily:'Sora,sans-serif',fontWeight:700,fontSize:'.84rem',color:'#0d1b2a',marginBottom:5}}>
                Q: {q}
              </div>
              <div style={{fontSize:'.82rem',color:'#5a6a7a',lineHeight:1.6}}>
                A: {a}
              </div>
            </div>
          ))}
        </div>

        {/* Related documents – link to more of the same category */}
        <div style={{marginTop:20,background:'#fff',border:'1.5px solid #d4e0ec',borderRadius:14,padding:'20px 24px'}}>
          <h3 style={{fontFamily:'Sora,sans-serif',fontWeight:700,fontSize:'.9rem',color:'#1a1a2e',marginBottom:14}}>More {form.category} Documents</h3>
          <Link href={`/pdf-forms?cat=${encodeURIComponent(form.category)}`} style={{display:'inline-flex',alignItems:'center',gap:6,background:'#f0f4f8',border:'1.5px solid #d4e0ec',borderRadius:8,padding:'9px 14px',color:'#0d1b2a',textDecoration:'none',fontSize:'.82rem',fontWeight:700}}>
            Browse all {form.category} →
          </Link>
        </div>
      </div>

      {/* Simple footer */}
      <footer style={{background:'#0d1b2a',padding:'18px',textAlign:'center',fontSize:'.73rem',color:'rgba(255,255,255,.28)'}}>
        © 2025–2026 Assam Career Point & Info — <Link href="/" style={{color:'rgba(255,255,255,.28)',textDecoration:'none'}}>Home</Link>
      </footer>
    </>
  )
}