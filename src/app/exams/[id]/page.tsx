'use client'
// src/app/exams/[id]/page.tsx
// ✅ Multiple exam dates support
// ✅ Multiple PDF links with labels
// ✅ Affiliate links section
// ✅ Mobile responsive
export const dynamic = 'force-dynamic'
import Link from 'next/link'
import { useState, useEffect, use } from 'react'

const G = '#c9a227', T = '#1dbfad', N = '#0b1f33', W = '#ffffff'

function Logo({ size = 38 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <defs><linearGradient id="lg" x1="30" y1="15" x2="70" y2="55" gradientUnits="userSpaceOnUse"><stop offset="0%" stopColor={T}/><stop offset="100%" stopColor={G}/></linearGradient></defs>
      <circle cx="50" cy="50" r="47" fill={N} stroke={G} strokeWidth="3"/>
      <circle cx="50" cy="50" r="41" fill="none" stroke={T} strokeWidth="0.6" opacity="0.5"/>
      <rect x="33" y="16" width="34" height="34" rx="8" fill="url(#lg)"/>
      <circle cx="50" cy="33" r="10" stroke={N} strokeWidth="2.2" fill="none"/>
      <circle cx="50" cy="33" r="5.5" stroke={N} strokeWidth="2" fill="none"/>
      <circle cx="50" cy="33" r="2" fill={N}/>
      <text x="50" y="66" textAnchor="middle" fontFamily="Arial Black,sans-serif" fontWeight="900" fontSize="10.5" fill={G} letterSpacing="1.5">ASSAM</text>
      <text x="50" y="77" textAnchor="middle" fontFamily="Arial Black,sans-serif" fontWeight="900" fontSize="10.5" fill={W}>CAREER</text>
      <line x1="22" y1="80" x2="78" y2="80" stroke={T} strokeWidth="0.8"/>
      <text x="27" y="90" textAnchor="middle" fontSize="5" fill={T}>◆</text>
      <text x="50" y="90" textAnchor="middle" fontFamily="Arial,sans-serif" fontWeight="700" fontSize="8" fill={T} letterSpacing="2">POINT</text>
      <text x="73" y="90" textAnchor="middle" fontSize="5" fill={T}>◆</text>
    </svg>
  )
}

// ── Types ─────────────────────────────────────────────────────────
type ExamPdf = { label: string; url: string }
type ExamAffiliate = { id: string; title: string; link: string; img?: string; badge?: string }

type Exam = {
  id: number; emoji: string; title: string; conductedBy: string; category: string
  description?: string; applicationStart?: string; applicationLastDate?: string
  paymentLastDate?: string
  // Multiple exam dates support — stored as text e.g. "27 Mar to 30 Mar" or "27 Mar, 29 Mar, 05 Apr"
  examDate?: string; examTime?: string
  // Multiple admit card dates support
  admitCardDate?: string
  resultDate?: string; fee?: string; eligibility?: string
  syllabus?: string; officialSite?: string; applyLink?: string; admitCardLink?: string
  status: 'Upcoming' | 'Registration Open' | 'Registration Closed' | 'Exam Ongoing' | 'Result Declared'
  createdAt?: string
  titleAs?: string; descriptionAs?: string; eligibilityAs?: string
  // ✅ Multiple PDFs with labels
  examPdfs?: ExamPdf[]
  // ✅ Affiliate links
  examAffiliates?: ExamAffiliate[]
}

const SC: Record<string, string> = {
  'Registration Open':   '#22c55e',
  'Upcoming':            '#f59e0b',
  'Registration Closed': '#ef4444',
  'Exam Ongoing':        '#3b82f6',
  'Result Declared':     '#8b5cf6',
}

// Google Drive helpers
function driveId(url: string): string {
  if (!url) return ''
  const m = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || url.match(/[?&]id=([a-zA-Z0-9_-]+)/)
  return m ? m[1] : ''
}
function driveDownloadUrl(url: string): string {
  const id = driveId(url)
  return id ? `https://drive.google.com/uc?export=download&id=${id}` : url
}

const FALLBACK: Exam[] = [
  { id:1, emoji:'📚', title:'CTET 2026 — Central Teacher Eligibility Test', conductedBy:'CBSE', category:'Teaching',
    description:'The Central Teacher Eligibility Test (CTET) is a national level examination conducted by CBSE for teaching eligibility in central government schools.',
    applicationStart:'2026-02-15', applicationLastDate:'2026-03-15', paymentLastDate:'2026-03-17',
    examDate:'22 May 2026', examTime:'Paper I: 9:30 AM – 12:00 PM | Paper II: 2:30 PM – 5:00 PM',
    admitCardDate:'10 May 2026', resultDate:'30 June 2026',
    fee:'1 Paper: Gen ₹1,000 · SC/ST/PWD ₹500 | Both Papers: Gen ₹1,200 · SC/ST/PWD ₹600',
    eligibility:'Paper I (Class 1–5): Graduation + 2-year D.El.Ed or B.Ed.\nPaper II (Class 6–8): Graduation + B.Ed',
    syllabus:'Child Development & Pedagogy\nLanguage I (English/Hindi/Assamese)\nLanguage II\nMathematics\nScience / Social Studies',
    officialSite:'ctet.nic.in', applyLink:'https://ctet.nic.in', status:'Registration Open',
    createdAt: new Date().toISOString(), examPdfs: [], examAffiliates: [] },
]

export default function ExamDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [exam,      setExam]      = useState<Exam | null>(null)
  const [allExams,  setAllExams]  = useState<Exam[]>([])
  const [countdown, setCountdown] = useState({ d:0, h:0, m:0, s:0 })
  const [activeDate,setActiveDate]= useState<'apply'|'exam'>('apply')
  const [timerOn,   setTimerOn]   = useState<boolean>(true)

  useEffect(() => {
    fetch('/api/data/exams', { cache: 'no-store' })
      .then(r => r.json())
      .then((list: Exam[]) => {
        if (Array.isArray(list) && list.length > 0) {
          setAllExams(list)
          setExam(list.find(e => String(e.id) === String(id)) || null)
        } else {
          try {
            const saved = localStorage.getItem('acp_exams_v6')
            const local: Exam[] = saved ? JSON.parse(saved) : FALLBACK
            setAllExams(local)
            setExam(local.find(e => String(e.id) === String(id)) || null)
          } catch { setAllExams(FALLBACK); setExam(null) }
        }
      })
      .catch(() => {
        try {
          const saved = localStorage.getItem('acp_exams_v6')
          const local: Exam[] = saved ? JSON.parse(saved) : FALLBACK
          setAllExams(local)
          setExam(local.find(e => String(e.id) === String(id)) || null)
        } catch { setAllExams(FALLBACK); setExam(null) }
      })
    try {
      const s = localStorage.getItem('acp_settings_v1')
      setTimerOn(s ? JSON.parse(s).timerEnabled !== false : true)
    } catch {}
  }, [id])

  // Countdown — only if applicationLastDate is a valid ISO date
  useEffect(() => {
    if (!exam) return
    const rawTarget = activeDate === 'apply' ? exam.applicationLastDate : ''
    if (!rawTarget) return
    const target = new Date(rawTarget)
    if (isNaN(target.getTime())) return
    const tick = () => {
      const diff = target.getTime() - Date.now()
      if (diff <= 0) { setCountdown({ d:0, h:0, m:0, s:0 }); return }
      setCountdown({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      })
    }
    tick()
    const t = setInterval(tick, 1000)
    return () => clearInterval(t)
  }, [exam, activeDate])

  // fmt: try ISO date first, else return as-is (supports text like "22 May to 25 May 2026")
  const fmt = (d?: string) => {
    if (!d) return '—'
    const parsed = new Date(d)
    if (!isNaN(parsed.getTime())) {
      return parsed.toLocaleDateString('en-IN', { day:'2-digit', month:'long', year:'numeric' })
    }
    return d // return text as-is for multi-date strings
  }

  if (!exam) return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column' as const,gap:16,background:'#f0f4f8'}}>
      <div style={{fontSize:'3rem'}}>📭</div>
      <h2 style={{fontFamily:'Sora,sans-serif',fontWeight:700,fontSize:'1.2rem',color:N}}>Exam not found</h2>
      <Link href="/exams" style={{padding:'10px 22px',borderRadius:99,background:N,color:G,fontWeight:900,textDecoration:'none',fontFamily:'Arial Black,sans-serif',fontSize:'.85rem'}}>← Back to All Exams</Link>
    </div>
  )

  const sc = SC[exam.status] || '#8fa3b8'
  const otherExams = allExams.filter(e => e.id !== exam.id && e.status !== 'Result Declared').slice(0, 4)
  const pdfs = exam.examPdfs?.filter(p => p.url && p.label) || []
  const affiliates = exam.examAffiliates?.filter(a => a.title && a.link) || []

  // Check if applicationLastDate is a valid future ISO date for countdown
  const canCountdown = !!exam.applicationLastDate && !isNaN(new Date(exam.applicationLastDate).getTime()) && new Date(exam.applicationLastDate).getTime() > Date.now()

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800&family=Nunito:wght@400;600;700&display=swap');
        *,*::before,*::after{box-sizing:border-box}
        html,body{margin:0;font-family:Nunito,sans-serif;background:#f0f4f8;color:#1a1a2e;overflow-x:hidden;max-width:100vw}
        .nav-a{color:rgba(255,255,255,.6);font-size:.82rem;font-weight:700;padding:7px 11px;border-radius:8px;text-decoration:none;white-space:nowrap}
        .nav-a:hover{color:${G}}
        .card{background:#fff;border:1.5px solid #d4e0ec;border-radius:14px;padding:20px;margin-bottom:16px}
        .cd-box{background:rgba(255,255,255,.06);border-radius:10px;padding:10px 6px;text-align:center}
        .cd-val{font-family:'Arial Black',sans-serif;font-weight:900;font-size:1.6rem;line-height:1}
        .cd-lbl{font-size:.58rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;margin-top:3px}
        .re-card{background:#fff;border:1.5px solid #d4e0ec;border-radius:12px;overflow:hidden;text-decoration:none;color:inherit;display:flex;gap:12px;padding:12px;transition:.18s;align-items:center}
        .re-card:hover{border-color:${T};transform:translateX(3px)}
        .pdf-row{display:flex;align-items:center;gap:12px;padding:11px 14px;background:#f8fbff;border:1.5px solid #d4e0ec;border-radius:10px;text-decoration:none;color:inherit;transition:.15s;margin-bottom:8px}
        .pdf-row:hover{border-color:${T};background:#e0f7fc}
        @media(max-width:860px){
          .layout{flex-direction:column!important}
          .layout>div:last-child{width:100%!important;min-width:0!important}
        }
        @media(max-width:600px){
          .dates-grid{grid-template-columns:1fr 1fr!important}
          .apply-btns{flex-direction:column!important}
          .apply-btns a{width:100%!important}
        }
      `}</style>

      {/* HEADER */}
      <header style={{background:N,borderBottom:`2px solid ${G}`,position:'sticky',top:0,zIndex:100,boxShadow:'0 2px 20px rgba(0,0,0,.4)'}}>
        <div style={{maxWidth:1180,margin:'0 auto',padding:'10px 20px',display:'flex',alignItems:'center',gap:14,flexWrap:'wrap' as const}}>
          <Link href="/" style={{display:'flex',alignItems:'center',gap:10,textDecoration:'none',flexShrink:0}}>
            <Logo size={40}/><div>
              <div style={{fontFamily:'Arial Black,sans-serif',fontSize:'.78rem'}}><span style={{color:G}}>ASSAM </span><span style={{color:W}}>CAREER</span></div>
              <div style={{fontFamily:'Arial Black,sans-serif',fontSize:'.65rem',color:T,letterSpacing:'.12em'}}>◆ POINT ◆</div>
            </div>
          </Link>
          <nav style={{display:'flex',gap:2,flexWrap:'wrap' as const}}>
            {([['🏠','/'],[' Jobs','/govt-jobs'],['📚 Exams','/exams'],['ℹ️ Info','/information'],['📄 PDFs','/pdf-forms']] as [string,string][]).map(([l,h])=>(
              <Link key={h} href={h} className="nav-a">{l}</Link>
            ))}
          </nav>
        </div>
      </header>

      {/* Breadcrumb */}
      <div style={{background:'#fff',borderBottom:'1px solid #e8eef6',padding:'10px 20px',fontSize:'.78rem',color:'#5a6a7a'}}>
        <div style={{maxWidth:1180,margin:'0 auto',display:'flex',gap:6,alignItems:'center',flexWrap:'wrap' as const}}>
          <Link href="/" style={{color:T,textDecoration:'none'}}>Home</Link> <span>›</span>
          <Link href="/exams" style={{color:T,textDecoration:'none'}}>Exams</Link> <span>›</span>
          <span style={{color:N,fontWeight:700,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' as const}}>{exam.title.slice(0,50)}</span>
        </div>
      </div>

      {/* HERO */}
      <div style={{background:`linear-gradient(135deg,${N},#0a3050)`,padding:'28px 20px 22px'}}>
        <div style={{maxWidth:1180,margin:'0 auto'}}>
          <div style={{display:'flex',gap:16,alignItems:'flex-start',flexWrap:'wrap' as const}}>
            <div style={{width:64,height:64,borderRadius:14,background:`${sc}22`,border:`2px solid ${sc}55`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'2rem',flexShrink:0}}>{exam.emoji}</div>
            <div style={{flex:1,minWidth:200}}>
              <div style={{display:'flex',gap:8,flexWrap:'wrap' as const,marginBottom:10}}>
                <span style={{background:`${sc}22`,color:sc,border:`1px solid ${sc}44`,padding:'4px 12px',borderRadius:99,fontSize:'.72rem',fontWeight:800}}>● {exam.status}</span>
                <span style={{background:'rgba(255,255,255,.1)',color:'rgba(255,255,255,.7)',padding:'4px 12px',borderRadius:99,fontSize:'.72rem',fontWeight:700}}>{exam.category}</span>
              </div>
              <h1 style={{fontFamily:'Sora,sans-serif',fontWeight:800,fontSize:'clamp(1rem,2.5vw,1.55rem)',color:W,margin:'0 0 6px',lineHeight:1.3}}>{exam.title}{exam.titleAs&&<><br/><span style={{fontSize:'clamp(.78rem,1.6vw,1rem)',color:'#ffd54f',fontWeight:700}}>{exam.titleAs}</span></>}</h1>
              <div style={{color:'rgba(255,255,255,.55)',fontSize:'.85rem'}}>Conducted by: <strong style={{color:G}}>{exam.conductedBy}</strong></div>
            </div>
          </div>

          {/* Key dates strip */}
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))',gap:10,marginTop:18}}>
            {[
              {l:'Apply By',    v:fmt(exam.applicationLastDate), hi:true},
              {l:'Payment By',  v:fmt(exam.paymentLastDate),     hi:false},
              {l:'Exam Date',   v:exam.examDate||'—',            hi:false},
              {l:'Admit Card',  v:exam.admitCardDate||'—',       hi:false},
            ].map(s=>(
              <div key={s.l} style={{background:'rgba(255,255,255,.07)',border:`1px solid ${s.hi?`${G}55`:'rgba(255,255,255,.12)'}`,borderRadius:10,padding:'10px 13px'}}>
                <div style={{fontSize:'.62rem',color:'rgba(255,255,255,.4)',fontWeight:700,textTransform:'uppercase' as const,letterSpacing:'.04em',marginBottom:4}}>{s.l}</div>
                <div style={{fontFamily:'Sora,sans-serif',fontWeight:700,fontSize:'.82rem',color:s.hi?G:W,lineHeight:1.3}}>{s.v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="layout" style={{maxWidth:1180,margin:'0 auto',padding:'20px 20px 60px',display:'flex',gap:20,alignItems:'flex-start'}}>

        {/* ── MAIN ── */}
        <div style={{flex:1,minWidth:0}}>

          {/* About */}
          {exam.description && (
            <div className="card">
              <h2 style={{fontFamily:'Sora,sans-serif',fontWeight:700,fontSize:'.93rem',color:N,margin:'0 0 12px',paddingBottom:8,borderBottom:`2px solid ${G}`}}>📋 About This Exam</h2>
              <p style={{fontSize:'.88rem',color:'#3a4a5a',lineHeight:1.85,margin:'0 0 4px'}}>{exam.description}</p>
              {exam.descriptionAs&&<p style={{fontSize:'.86rem',color:'#5d4037',lineHeight:1.8,margin:'8px 0 0',background:'#fff8e1',borderRadius:8,padding:'8px 12px',borderLeft:'3px solid #ffe082'}}>{exam.descriptionAs}</p>}
            </div>
          )}

          {/* Important Dates — supports text dates */}
          <div className="card">
            <h2 style={{fontFamily:'Sora,sans-serif',fontWeight:700,fontSize:'.93rem',color:N,margin:'0 0 14px',paddingBottom:8,borderBottom:`2px solid ${G}`}}>📅 Important Dates & Schedule</h2>
            <div className="dates-grid" style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:11,marginBottom:14}}>
              {[
                ...(exam.applicationStart       ? [{l:'Application Opens',   v:fmt(exam.applicationStart),       hi:false}] : []),
                ...(exam.applicationLastDate    ? [{l:'Last Date to Apply',   v:fmt(exam.applicationLastDate),    hi:true }] : []),
                ...(exam.paymentLastDate        ? [{l:'Fee Payment Deadline', v:fmt(exam.paymentLastDate),        hi:true }] : []),
                ...(exam.examDate               ? [{l:'Exam Date / Schedule', v:exam.examDate,                   hi:false}] : []),
                ...(exam.admitCardDate          ? [{l:'Admit Card Available', v:exam.admitCardDate,              hi:false}] : []),
                ...(exam.resultDate             ? [{l:'Result Date',          v:fmt(exam.resultDate),            hi:false}] : []),
              ].map(d=>(
                <div key={d.l} style={{background:d.hi?`${G}12`:'#f8fbff',border:`1.5px solid ${d.hi?`${G}44`:'#d4e0ec'}`,borderRadius:10,padding:'12px 14px'}}>
                  <div style={{fontSize:'.63rem',fontWeight:700,color:'#8fa3b8',textTransform:'uppercase' as const,letterSpacing:'.05em',marginBottom:5}}>{d.l}</div>
                  <div style={{fontFamily:'Sora,sans-serif',fontWeight:700,fontSize:'.87rem',color:d.hi?G:N,lineHeight:1.3}}>{d.v}</div>
                </div>
              ))}
            </div>
            {exam.examTime && (
              <div style={{background:`${T}12`,border:`1px solid ${T}44`,borderRadius:10,padding:'11px 14px',fontSize:'.84rem',color:N}}>
                ⏰ <strong>Exam Timing:</strong> {exam.examTime}
              </div>
            )}
          </div>

          {/* Fee */}
          {exam.fee && (
            <div className="card">
              <h2 style={{fontFamily:'Sora,sans-serif',fontWeight:700,fontSize:'.93rem',color:N,margin:'0 0 12px',paddingBottom:8,borderBottom:`2px solid ${G}`}}>💳 Application Fee</h2>
              <div style={{background:'#fff8e1',border:'1.5px solid #ffe082',borderRadius:10,padding:'14px 16px',fontSize:'.88rem',color:'#2a3a4a',lineHeight:1.9,whiteSpace:'pre-line' as const}}>
                {exam.fee}
              </div>
            </div>
          )}

          {/* Eligibility */}
          {exam.eligibility && (
            <div className="card">
              <h2 style={{fontFamily:'Sora,sans-serif',fontWeight:700,fontSize:'.93rem',color:N,margin:'0 0 12px',paddingBottom:8,borderBottom:`2px solid ${G}`}}>✅ Eligibility Criteria</h2>
              <div style={{fontSize:'.88rem',color:'#3a4a5a',lineHeight:1.85,whiteSpace:'pre-line' as const}}>{exam.eligibility}</div>
              {exam.eligibilityAs && (
                <div style={{marginTop:12,background:'#fff8e1',border:'1.5px solid #ffe082',borderRadius:9,padding:'10px 13px',fontSize:'.84rem',color:'#5d4037',lineHeight:1.8,whiteSpace:'pre-line' as const,borderLeft:'3px solid #ffe082'}}>
                  {exam.eligibilityAs}
                </div>
              )}
            </div>
          )}

          {/* Syllabus */}
          {exam.syllabus && (
            <div className="card">
              <h2 style={{fontFamily:'Sora,sans-serif',fontWeight:700,fontSize:'.93rem',color:N,margin:'0 0 12px',paddingBottom:8,borderBottom:`2px solid ${G}`}}>📚 Exam Syllabus / Pattern</h2>
              <div style={{fontSize:'.88rem',color:'#3a4a5a',lineHeight:1.9,whiteSpace:'pre-line' as const}}>{exam.syllabus}</div>
            </div>
          )}

          {/* ✅ PDF Links with labels */}
          {pdfs.length > 0 && (
            <div className="card">
              <h2 style={{fontFamily:'Sora,sans-serif',fontWeight:700,fontSize:'.93rem',color:N,margin:'0 0 14px',paddingBottom:8,borderBottom:`2px solid ${G}`}}>📄 Official Documents & PDFs</h2>
              {pdfs.map((pdf, i) => (
                <a key={i} href={driveDownloadUrl(pdf.url)} target="_blank" rel="noopener noreferrer" className="pdf-row">
                  <span style={{fontSize:'1.4rem',flexShrink:0}}>📄</span>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontWeight:700,fontSize:'.85rem',color:N}}>{pdf.label}</div>
                    <div style={{fontSize:'.72rem',color:'#5a6a7a',marginTop:2}}>Google Drive · Click to open/download</div>
                  </div>
                  <span style={{background:T,color:N,padding:'5px 12px',borderRadius:7,fontWeight:800,fontSize:'.74rem',fontFamily:'Arial Black,sans-serif',flexShrink:0}}>Open</span>
                </a>
              ))}
            </div>
          )}

          {/* Apply buttons */}
          <div className="apply-btns" style={{display:'flex',gap:12,flexWrap:'wrap' as const,marginBottom:18}}>
            {exam.applyLink && (
              <a href={exam.applyLink} target="_blank" rel="noopener noreferrer"
                style={{flex:1,minWidth:160,display:'flex',alignItems:'center',justifyContent:'center',gap:8,padding:'13px 18px',borderRadius:12,background:T,color:N,fontWeight:900,fontSize:'.88rem',textDecoration:'none',fontFamily:'Arial Black,sans-serif'}}>
                📝 Apply Online
              </a>
            )}
            {exam.admitCardLink && (
              <a href={exam.admitCardLink} target="_blank" rel="noopener noreferrer"
                style={{flex:1,minWidth:160,display:'flex',alignItems:'center',justifyContent:'center',gap:8,padding:'13px 18px',borderRadius:12,background:'#3b82f6',color:W,fontWeight:900,fontSize:'.88rem',textDecoration:'none',fontFamily:'Arial Black,sans-serif'}}>
                🪪 Admit Card
              </a>
            )}
            {exam.officialSite && (
              <a href={`https://${exam.officialSite}`} target="_blank" rel="noopener noreferrer"
                style={{display:'flex',alignItems:'center',justifyContent:'center',gap:8,padding:'13px 18px',borderRadius:12,background:'#f0f4f8',color:N,fontWeight:900,fontSize:'.88rem',textDecoration:'none',border:'1.5px solid #d4e0ec',fontFamily:'Arial Black,sans-serif'}}>
                🌐 Official Site
              </a>
            )}
          </div>

          {/* ✅ Affiliate links for exam */}
          {affiliates.length > 0 && (
            <div className="card">
              <h2 style={{fontFamily:'Sora,sans-serif',fontWeight:700,fontSize:'.93rem',color:N,margin:'0 0 14px',paddingBottom:8,borderBottom:`2px solid ${G}`}}>📚 Recommended Books & Study Material</h2>
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(140px,1fr))',gap:12}}>
                {affiliates.map(aff => (
                  <a key={aff.id} href={aff.link} target="_blank" rel="noopener noreferrer sponsored"
                    style={{background:'#fff',border:'1.5px solid #d4e0ec',borderRadius:12,overflow:'hidden',textDecoration:'none',color:'inherit',display:'flex',flexDirection:'column',transition:'.18s',boxShadow:'0 2px 8px rgba(0,0,0,.06)'}}>
                    {/* Image box — same style as job vacancies */}
                    <div style={{position:'relative',width:'100%',paddingBottom:'70%',overflow:'hidden',background:`linear-gradient(135deg,#0d1b2a,#0a3050)`}}>
                      {aff.img
                        ? <img src={aff.img} alt={aff.title} style={{position:'absolute',top:0,left:0,width:'100%',height:'100%',objectFit:'cover',display:'block'}}/>
                        : <div style={{position:'absolute',top:0,left:0,width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'2.5rem'}}>📖</div>
                      }
                      {aff.badge && (
                        <span style={{position:'absolute',top:6,left:6,background:'#c9a227',color:'#0b1f33',fontSize:'.6rem',fontWeight:900,padding:'2px 7px',borderRadius:99,fontFamily:'Arial Black,sans-serif'}}>
                          {aff.badge}
                        </span>
                      )}
                    </div>
                    {/* Content */}
                    <div style={{padding:'10px 11px',flex:1,display:'flex',flexDirection:'column',gap:6}}>
                      <div style={{fontFamily:'Sora,sans-serif',fontWeight:700,fontSize:'.78rem',color:'#0b1f33',lineHeight:1.4}}>{aff.title}</div>
                      <div style={{marginTop:'auto',background:'#1dbfad',color:'#0b1f33',borderRadius:7,padding:'7px',textAlign:'center',fontWeight:900,fontSize:'.72rem',fontFamily:'Arial Black,sans-serif'}}>
                        Buy Now →
                      </div>
                    </div>
                  </a>
                ))}
              </div>
              <div style={{fontSize:'.7rem',color:'#8fa3b8',marginTop:10}}>
                * Affiliate links — purchasing supports this free portal
              </div>
            </div>
          )}

          {/* Related exams */}
          {otherExams.length > 0 && (
            <div>
              <h2 style={{fontFamily:'Sora,sans-serif',fontWeight:700,fontSize:'1rem',color:N,marginBottom:12}}>📋 Other Exams</h2>
              <div style={{display:'flex',flexDirection:'column' as const,gap:9}}>
                {otherExams.map(e=>(
                  <Link key={e.id} href={`/exams/${e.id}`} className="re-card">
                    <div style={{width:42,height:42,borderRadius:10,background:`${SC[e.status]||'#8fa3b8'}18`,border:`1.5px solid ${SC[e.status]||'#8fa3b8'}44`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.3rem',flexShrink:0}}>{e.emoji}</div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontFamily:'Sora,sans-serif',fontWeight:700,fontSize:'.84rem',color:N,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' as const}}>{e.title}</div>
                      <div style={{fontSize:'.73rem',color:'#5a6a7a',marginTop:3}}>{e.conductedBy} · Apply by {fmt(e.applicationLastDate)}</div>
                    </div>
                    <span style={{background:`${SC[e.status]||'#8fa3b8'}20`,color:SC[e.status]||'#8fa3b8',padding:'3px 9px',borderRadius:99,fontSize:'.65rem',fontWeight:800,flexShrink:0}}>{e.status}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── SIDEBAR ── */}
        <div style={{width:290,flexShrink:0,minWidth:0}}>

          {/* Countdown */}
          {timerOn && canCountdown && (
            <div style={{background:N,border:`2px solid ${G}`,borderRadius:16,padding:'18px',marginBottom:16}}>
              <h3 style={{fontFamily:'Arial Black,sans-serif',color:G,fontSize:'.76rem',letterSpacing:'.06em',marginBottom:12}}>⏳ TIME REMAINING</h3>
              <div style={{display:'flex',gap:6,marginBottom:12}}>
                {(['apply'] as const).map(t=>(
                  <div key={t} style={{flex:1,padding:'6px',borderRadius:7,background:`${G}22`,border:`1px solid ${G}55`,color:G,fontWeight:700,fontSize:'.72rem',textAlign:'center' as const}}>
                    Apply Deadline
                  </div>
                ))}
              </div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:5}}>
                {([['d','Days'],['h','Hours'],['m','Mins'],['s','Secs']] as [keyof typeof countdown,string][]).map(([k,l])=>(
                  <div key={k} className="cd-box">
                    <div className="cd-val" style={{color:k==='d'?G:k==='h'?T:W}}>{String(countdown[k]).padStart(2,'0')}</div>
                    <div className="cd-lbl" style={{color:'rgba(255,255,255,.4)'}}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick info */}
          <div style={{background:'#fff',border:'1.5px solid #d4e0ec',borderRadius:14,padding:'16px',marginBottom:14}}>
            <h3 style={{fontFamily:'Sora,sans-serif',fontWeight:700,fontSize:'.87rem',color:N,marginBottom:12}}>📌 Quick Info</h3>
            {[
              {l:'Status',       v:exam.status,                           c:sc},
              {l:'Category',     v:exam.category,                         c:''},
              {l:'Conducted By', v:exam.conductedBy,                      c:''},
              {l:'Exam Date',    v:exam.examDate||'—',                    c:''},
              {l:'Admit Card',   v:exam.admitCardDate||'—',               c:''},
              ...(exam.officialSite ? [{l:'Official Site', v:exam.officialSite, c:T, href:`https://${exam.officialSite}`}] : []),
            ].map((r: any) => (
              <div key={r.l} style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',padding:'6px 0',borderBottom:'1px solid #f0f4f8',gap:8}}>
                <span style={{fontSize:'.73rem',color:'#8fa3b8',fontWeight:700,flexShrink:0}}>{r.l}</span>
                {r.href
                  ? <a href={r.href} target="_blank" rel="noopener noreferrer" style={{fontSize:'.76rem',fontWeight:700,color:T,textDecoration:'none',textAlign:'right' as const,wordBreak:'break-all' as const}}>{r.v}</a>
                  : <span style={{fontSize:'.76rem',fontWeight:700,color:r.c||N,textAlign:'right' as const,lineHeight:1.3}}>{r.v}</span>
                }
              </div>
            ))}
          </div>

          {/* Apply CTA */}
          {exam.applyLink && exam.status === 'Registration Open' && (
            <a href={exam.applyLink} target="_blank" rel="noopener noreferrer"
              style={{display:'flex',alignItems:'center',justifyContent:'center',gap:8,width:'100%',padding:'13px',borderRadius:11,background:G,color:N,fontWeight:900,fontSize:'.88rem',textDecoration:'none',fontFamily:'Arial Black,sans-serif',marginBottom:10,boxSizing:'border-box' as const}}>
              📝 APPLY NOW
            </a>
          )}
          {exam.admitCardLink && (
            <a href={exam.admitCardLink} target="_blank" rel="noopener noreferrer"
              style={{display:'flex',alignItems:'center',justifyContent:'center',gap:8,width:'100%',padding:'11px',borderRadius:11,background:'#3b82f6',color:W,fontWeight:900,fontSize:'.85rem',textDecoration:'none',fontFamily:'Arial Black,sans-serif',marginBottom:10,boxSizing:'border-box' as const}}>
              🪪 DOWNLOAD ADMIT CARD
            </a>
          )}

          {/* Share */}
          <div style={{background:'#f8fbff',border:'1px solid #d4e0ec',borderRadius:12,padding:'13px',textAlign:'center' as const}}>
            <div style={{fontSize:'.74rem',color:'#5a6a7a',fontWeight:700,marginBottom:10}}>📢 Share with friends</div>
            <div style={{display:'flex',gap:8,justifyContent:'center'}}>
              {[
                {l:'WhatsApp',c:'#25d366',ico:'💬',href:`https://wa.me/?text=${encodeURIComponent(`${exam.title}\nApply by: ${fmt(exam.applicationLastDate)}\n\nhttps://www.assamcareerpoint-info.com/exams/${exam.id}`)}`},
                {l:'Telegram',c:'#0088cc',ico:'✈️',href:`https://t.me/share/url?url=${encodeURIComponent(`https://www.assamcareerpoint-info.com/exams/${exam.id}`)}&text=${encodeURIComponent(exam.title)}`},
              ].map(s=>(
                <a key={s.l} href={s.href} target="_blank" rel="noopener noreferrer"
                  style={{display:'flex',alignItems:'center',gap:6,padding:'7px 12px',borderRadius:8,background:s.c,color:W,fontSize:'.74rem',fontWeight:700,textDecoration:'none'}}>
                  {s.ico} {s.l}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <footer style={{background:N,borderTop:`3px solid ${G}`,padding:'18px',textAlign:'center' as const}}>
        <div style={{fontSize:'.72rem',color:'rgba(255,255,255,.3)'}}>
          © 2025–2026 Assam Career Point & Info ·{' '}
          {([['Privacy','/privacy-policy'],['About','/about-us'],['Contact','/contact'],['Home','/']] as [string,string][]).map(([l,h])=>(
            <span key={h}><Link href={h} style={{color:`${G}88`,textDecoration:'none'}}>{l}</Link> · </span>
          ))}
        </div>
      </footer>
    </>
  )
}
