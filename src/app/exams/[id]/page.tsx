'use client'
// src/app/exams/[id]/page.tsx — Public Exam Detail Page
// Reads from localStorage 'acp_exams_v6' — same key admin saves to

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

type Exam = {
  id: number; emoji: string; title: string; conductedBy: string; category: string
  description?: string; applicationStart?: string; applicationLastDate?: string
  paymentLastDate?: string; examDate?: string; examTime?: string
  admitCardDate?: string; resultDate?: string; fee?: string; eligibility?: string
  syllabus?: string; officialSite?: string; applyLink?: string; admitCardLink?: string
  status: 'Upcoming' | 'Registration Open' | 'Registration Closed' | 'Exam Ongoing' | 'Result Declared'
  createdAt?: string
  titleAs?: string; descriptionAs?: string; eligibilityAs?: string; syllabusAs?: string
}

const SC: Record<string, string> = {
  'Registration Open':   '#22c55e',
  'Upcoming':            '#f59e0b',
  'Registration Closed': '#ef4444',
  'Exam Ongoing':        '#3b82f6',
  'Result Declared':     '#8b5cf6',
}

const FALLBACK: Exam[] = [
  { id:1, emoji:'📚', title:'CTET 2026 — Central Teacher Eligibility Test', conductedBy:'CBSE', category:'Teaching', description:'The Central Teacher Eligibility Test (CTET) is a national level examination conducted by CBSE to determine the eligibility of candidates for teaching jobs in central government schools (KVS, NVS, Sainik Schools etc.) for Classes 1–8.', applicationStart:'2026-02-15', applicationLastDate:'2026-03-15', paymentLastDate:'2026-03-17', examDate:'2026-05-22', examTime:'Paper I: 9:30 AM – 12:00 PM | Paper II: 2:30 PM – 5:00 PM', admitCardDate:'2026-05-10', resultDate:'2026-06-30', fee:'1 Paper: Gen ₹1,000 · SC/ST/PWD ₹500 | Both Papers: Gen ₹1,200 · SC/ST/PWD ₹600', eligibility:'For Paper I (Class 1–5): Graduation + 2-year D.El.Ed or B.Ed. For Paper II (Class 6–8): Graduation + B.Ed', syllabus:'Child Development & Pedagogy, Language I (English/Hindi/Assamese), Language II, Mathematics, Science / Social Studies', officialSite:'ctet.nic.in', applyLink:'https://ctet.nic.in', status:'Registration Open', createdAt: new Date().toISOString() },
]

export default function ExamDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [exam, setExam] = useState<Exam | null>(null)
  const [allExams, setAllExams] = useState<Exam[]>([])
  const [countdown, setCountdown] = useState({ d:0, h:0, m:0, s:0 })
  const [activeDate, setActiveDate] = useState<'apply'|'exam'>('apply')
  const [timerOn, setTimerOn] = useState<boolean>(true)

  useEffect(() => {
    try {
      const saved = localStorage.getItem('acp_exams_v6')
      const list: Exam[] = saved ? JSON.parse(saved) : FALLBACK
      setAllExams(list)
      const found = list.find(e => String(e.id) === String(id))
      setExam(found || null)
      // Read timer setting
      const s = localStorage.getItem('acp_settings_v1')
      setTimerOn(s ? JSON.parse(s).timerEnabled !== false : true)
    } catch {
      setAllExams(FALLBACK)
      setExam(FALLBACK.find(e => String(e.id) === String(id)) || null)
    }
  }, [id])

  // Countdown timer
  useEffect(() => {
    if (!exam) return
    const target = activeDate === 'apply' ? exam.applicationLastDate : exam.examDate
    const tick = () => {
      const diff = new Date(target).getTime() - Date.now()
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

  const fmt = (d?: string) => { if (!d) return '—'; try { return new Date(d).toLocaleDateString('en-IN', { day:'2-digit', month:'long', year:'numeric' }) } catch { return d } }

  if (!exam) return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column' as const,gap:16,background:'#f0f4f8'}}>
      <div style={{fontSize:'3rem'}}>📭</div>
      <h2 style={{fontFamily:'Sora,sans-serif',fontWeight:700,fontSize:'1.2rem',color:N}}>Exam not found</h2>
      <p style={{color:'#5a6a7a',fontSize:'.88rem'}}>This exam may have been removed or the link is incorrect.</p>
      <Link href="/exams" style={{padding:'10px 22px',borderRadius:99,background:N,color:G,fontWeight:900,textDecoration:'none',fontFamily:'Arial Black,sans-serif',fontSize:'.85rem'}}>← Back to All Exams</Link>
    </div>
  )

  const sc = SC[exam.status] || '#8fa3b8'
  const otherExams = allExams.filter(e => e.id !== exam.id && e.status !== 'Result Declared').slice(0, 4)

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800&family=Nunito:wght@400;600;700&display=swap');
        *,*::before,*::after{box-sizing:border-box}
        html,body{margin:0;font-family:Nunito,sans-serif;background:#f0f4f8;color:#1a1a2e;overflow-x:hidden}
        .nav-a{color:rgba(255,255,255,.6);font-size:.82rem;font-weight:700;padding:7px 11px;border-radius:8px;text-decoration:none;white-space:nowrap}
        .nav-a:hover{color:${G}}
        .card{background:#fff;border:1.5px solid #d4e0ec;border-radius:14px;padding:22px;margin-bottom:18px}
        .card h2{fontFamily:'Sora',sans-serif;font-weight:700;font-size:.95rem;color:${N};margin:0 0 14px;padding-bottom:10px;border-bottom:2px solid #f0f4f8;display:flex;align-items:center;gap:8px}
        .cd-box{background:${N};border-radius:12px;padding:14px 18px;text-align:center}
        .cd-val{font-family:'Arial Black',sans-serif;font-weight:900;font-size:2rem;line-height:1}
        .cd-lbl{font-size:.63rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;margin-top:3px}
        .step{counter-increment:step;display:flex;gap:12;align-items:flex-start;padding:10px 0;border-bottom:1px solid #f0f4f8}
        .step:last-child{border-bottom:none}
        .sn{width:28px;height:28px;border-radius:50%;background:${G};color:${N};display:flex;align-items:center;justify-content:center;font-weight:900;font-size:.78rem;flex-shrink:0;font-family:'Arial Black',sans-serif}
        .re-card{background:#fff;border:1.5px solid #d4e0ec;border-radius:12px;overflow:hidden;text-decoration:none;color:inherit;display:flex;gap:12;padding:12px;transition:.18s}
        .re-card:hover{border-color:${T};transform:translateX(3px)}
        @media(max-width:860px){.layout{flex-direction:column!important}}
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
            {([['🏠 Home','/'],['💼 Jobs','/govt-jobs'],['📚 Exams','/exams'],['ℹ️ Info','/information'],['📄 PDF Forms','/pdf-forms']] as [string,string][]).map(([l,h])=>(
              <Link key={h} href={h} className="nav-a">{l}</Link>
            ))}
          </nav>
        </div>
      </header>

      {/* Breadcrumb */}
      <div style={{background:'#fff',borderBottom:'1px solid #e8eef6',padding:'10px 20px',fontSize:'.78rem',color:'#5a6a7a'}}>
        <div style={{maxWidth:1180,margin:'0 auto',display:'flex',gap:6,alignItems:'center'}}>
          <Link href="/" style={{color:T,textDecoration:'none'}}>Home</Link> <span>›</span>
          <Link href="/exams" style={{color:T,textDecoration:'none'}}>Exams</Link> <span>›</span>
          <span style={{color:N,fontWeight:700,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' as const}}>{exam.title.slice(0,50)}</span>
        </div>
      </div>

      {/* HERO */}
      <div style={{background:`linear-gradient(135deg,${N},#0a3050)`,padding:'30px 20px 24px'}}>
        <div style={{maxWidth:1180,margin:'0 auto'}}>
          <div style={{display:'flex',gap:16,alignItems:'flex-start',flexWrap:'wrap' as const}}>
            <div style={{width:68,height:68,borderRadius:16,background:`${sc}22`,border:`2px solid ${sc}55`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'2.2rem',flexShrink:0}}>{exam.emoji}</div>
            <div style={{flex:1,minWidth:220}}>
              <div style={{display:'flex',gap:8,flexWrap:'wrap' as const,marginBottom:10}}>
                <span style={{background:`${sc}22`,color:sc,border:`1px solid ${sc}44`,padding:'4px 12px',borderRadius:99,fontSize:'.72rem',fontWeight:800}}>● {exam.status}</span>
                <span style={{background:'rgba(255,255,255,.1)',color:'rgba(255,255,255,.7)',padding:'4px 12px',borderRadius:99,fontSize:'.72rem',fontWeight:700}}>{exam.category}</span>
              </div>
              <h1 style={{fontFamily:'Sora,sans-serif',fontWeight:800,fontSize:'clamp(1.1rem,2.5vw,1.6rem)',color:W,margin:'0 0 6px',lineHeight:1.3}}>{exam.title}{exam.titleAs&&<><br/><span style={{fontSize:'clamp(.78rem,1.6vw,1rem)',color:'#ffd54f',fontWeight:700}}>{exam.titleAs}</span></>}</h1>
              <div style={{color:'rgba(255,255,255,.55)',fontSize:'.85rem'}}>Conducted by: <strong style={{color:G}}>{exam.conductedBy}</strong></div>
            </div>
          </div>
        </div>
      </div>

      <div className="layout" style={{maxWidth:1180,margin:'0 auto',padding:'22px 20px 60px',display:'flex',gap:22,alignItems:'flex-start'}}>

        {/* ── MAIN CONTENT ── */}
        <div style={{flex:1,minWidth:0}}>

          {/* About */}
          <div className="card">
            <h2>📋 About This Exam</h2>
            <p style={{fontSize:'.88rem',color:'#3a4a5a',lineHeight:1.85,margin:'0 0 4px'}}>{exam.description}</p>{exam.descriptionAs&&<p style={{fontSize:'.86rem',color:'#5d4037',lineHeight:1.8,margin:0,background:'#fff8e1',borderRadius:8,padding:'8px 12px',borderLeft:'3px solid #ffe082'}}>{exam.descriptionAs}</p>}
          </div>

          {/* Important Dates */}
          <div className="card">
            <h2>📅 Important Dates</h2>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:12}}>
              {[
                {l:'Application Opens',  v:exam.applicationStart,    hi:false},
                {l:'Last Date to Apply', v:exam.applicationLastDate, hi:true},
                {l:'Fee Payment Deadline',v:exam.paymentLastDate,    hi:true},
                {l:'Exam Date',          v:exam.examDate,            hi:false},
                ...(exam.admitCardDate ? [{l:'Admit Card',v:exam.admitCardDate,hi:false}] : []),
                ...(exam.resultDate    ? [{l:'Result Date',v:exam.resultDate,  hi:false}] : []),
              ].map(d=>(
                <div key={d.l} style={{background:d.hi?`${G}12`:'#f8fbff',border:`1.5px solid ${d.hi?`${G}44`:'#d4e0ec'}`,borderRadius:10,padding:'12px 14px'}}>
                  <div style={{fontSize:'.65rem',fontWeight:700,color:'#8fa3b8',textTransform:'uppercase' as const,letterSpacing:'.05em',marginBottom:5}}>{d.l}</div>
                  <div style={{fontFamily:'Sora,sans-serif',fontWeight:700,fontSize:'.9rem',color:d.hi?G:N}}>{fmt(d.v)}</div>
                </div>
              ))}
            </div>
            {/* Exam Time */}
            {exam.examTime && (
              <div style={{marginTop:14,background:`${T}12`,border:`1px solid ${T}44`,borderRadius:10,padding:'11px 14px',fontSize:'.84rem',color:N}}>
                ⏰ <strong>Exam Timing:</strong> {exam.examTime}
              </div>
            )}
          </div>

          {/* Fee */}
          <div className="card">
            <h2>💳 Application Fee</h2>
            <div style={{background:'#f8fbff',border:'1px solid #d4e0ec',borderRadius:10,padding:'14px 16px',fontSize:'.88rem',color:'#2a3a4a',lineHeight:1.8,whiteSpace:'pre-line' as const}}>
              {exam.fee}
            </div>
          </div>

          {/* Eligibility */}
          <div className="card">
            <h2>✅ Eligibility Criteria</h2>
            <div style={{fontSize:'.88rem',color:'#3a4a5a',lineHeight:1.85,whiteSpace:'pre-line' as const}}>{exam.eligibility}</div>
          </div>

          {/* Syllabus */}
          <div className="card">
            <h2>📚 Exam Syllabus / Pattern</h2>
            <div style={{fontSize:'.88rem',color:'#3a4a5a',lineHeight:1.85,whiteSpace:'pre-line' as const}}>{exam.syllabus}</div>
          </div>

          {/* Apply buttons */}
          <div style={{display:'flex',gap:12,flexWrap:'wrap' as const,marginBottom:18}}>
            <a href={exam.applyLink} target="_blank" rel="noopener noreferrer"
              style={{flex:1,minWidth:180,display:'flex',alignItems:'center',justifyContent:'center',gap:8,padding:'14px 20px',borderRadius:12,background:T,color:N,fontWeight:900,fontSize:'.9rem',textDecoration:'none',fontFamily:'Arial Black,sans-serif'}}>
              📝 Apply Online
            </a>
            {exam.admitCardLink && (
              <a href={exam.admitCardLink} target="_blank" rel="noopener noreferrer"
                style={{flex:1,minWidth:180,display:'flex',alignItems:'center',justifyContent:'center',gap:8,padding:'14px 20px',borderRadius:12,background:'#3b82f6',color:W,fontWeight:900,fontSize:'.9rem',textDecoration:'none',fontFamily:'Arial Black,sans-serif'}}>
                🪪 Download Admit Card
              </a>
            )}
            <a href={`https://${exam.officialSite}`} target="_blank" rel="noopener noreferrer"
              style={{display:'flex',alignItems:'center',justifyContent:'center',gap:8,padding:'14px 20px',borderRadius:12,background:'#f0f4f8',color:N,fontWeight:900,fontSize:'.9rem',textDecoration:'none',border:'1.5px solid #d4e0ec',fontFamily:'Arial Black,sans-serif'}}>
              🌐 Official Site
            </a>
          </div>

          {/* Related exams */}
          {otherExams.length > 0 && (
            <div>
              <h2 style={{fontFamily:'Sora,sans-serif',fontWeight:700,fontSize:'1rem',color:N,marginBottom:14}}>📋 Other Exams</h2>
              <div style={{display:'flex',flexDirection:'column' as const,gap:10}}>
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
        <div style={{width:300,flexShrink:0}}>

          {/* Countdown timer */}
          {timerOn && <div style={{background:N,border:`2px solid ${G}`,borderRadius:16,padding:'20px',marginBottom:18}}>
            <h3 style={{fontFamily:'Arial Black,sans-serif',color:G,fontSize:'.78rem',letterSpacing:'.06em',marginBottom:14}}>⏳ COUNTDOWN</h3>
            <div style={{display:'flex',gap:8,marginBottom:14}}>
              {(['apply','exam'] as const).map(t=>(
                <button key={t} onClick={()=>setActiveDate(t)} style={{flex:1,padding:'7px',borderRadius:8,border:`1.5px solid ${activeDate===t?G:'rgba(255,255,255,.15)'}`,background:activeDate===t?`${G}22`:'transparent',color:activeDate===t?G:'rgba(255,255,255,.45)',fontWeight:700,fontSize:'.72rem',cursor:'pointer',fontFamily:'Nunito,sans-serif'}}>
                  {t==='apply'?'Apply Deadline':'Exam Date'}
                </button>
              ))}
            </div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:6}}>
              {([['d','Days'],['h','Hours'],['m','Mins'],['s','Secs']] as [keyof typeof countdown,string][]).map(([k,l])=>(
                <div key={k} className="cd-box">
                  <div className="cd-val" style={{color:k==='d'?G:k==='h'?T:W}}>{String(countdown[k]).padStart(2,'0')}</div>
                  <div className="cd-lbl" style={{color:'rgba(255,255,255,.4)'}}>{l}</div>
                </div>
              ))}
            </div>
          </div>}

          {/* Quick info */}
          <div style={{background:'#fff',border:'1.5px solid #d4e0ec',borderRadius:14,padding:'18px',marginBottom:18}}>
            <h3 style={{fontFamily:'Sora,sans-serif',fontWeight:700,fontSize:'.88rem',color:N,marginBottom:14}}>📌 Quick Info</h3>
            {[
              {l:'Status',   v:exam.status,       c:sc},
              {l:'Category', v:exam.category,     c:''},
              {l:'Conducted By', v:exam.conductedBy, c:''},
              {l:'Exam Date', v:fmt(exam.examDate), c:''},
              {l:'Official Site', v:exam.officialSite, c:T, href:`https://${exam.officialSite}`},
            ].map(r=>(
              <div key={r.l} style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',padding:'7px 0',borderBottom:'1px solid #f0f4f8',gap:10}}>
                <span style={{fontSize:'.74rem',color:'#8fa3b8',fontWeight:700,flexShrink:0}}>{r.l}</span>
                {r.href
                  ? <a href={r.href} target="_blank" rel="noopener noreferrer" style={{fontSize:'.77rem',fontWeight:700,color:T,textDecoration:'none',textAlign:'right' as const}}>{r.v}</a>
                  : <span style={{fontSize:'.77rem',fontWeight:700,color:r.c||N,textAlign:'right' as const}}>{r.v}</span>
                }
              </div>
            ))}
          </div>

          {/* Apply CTA */}
          {exam.status === 'Registration Open' && (
            <a href={exam.applyLink} target="_blank" rel="noopener noreferrer"
              style={{display:'flex',alignItems:'center',justifyContent:'center',gap:8,width:'100%',padding:'14px',borderRadius:12,background:G,color:N,fontWeight:900,fontSize:'.9rem',textDecoration:'none',fontFamily:'Arial Black,sans-serif',marginBottom:12,boxSizing:'border-box' as const}}>
              📝 APPLY NOW
            </a>
          )}

          {/* Share */}
          <div style={{background:'#f8fbff',border:'1px solid #d4e0ec',borderRadius:12,padding:'14px',textAlign:'center' as const}}>
            <div style={{fontSize:'.75rem',color:'#5a6a7a',fontWeight:700,marginBottom:10}}>📢 Share with friends</div>
            <div style={{display:'flex',gap:8,justifyContent:'center'}}>
              {[
                {l:'WhatsApp',c:'#25d366',ico:'💬',href:`https://wa.me/?text=${encodeURIComponent(`${exam.title} — Apply by ${fmt(exam.applicationLastDate)}\n\nhttps://www.assamcareerpoint-info.com/exams/${exam.id}`)}`},
                {l:'Telegram',c:'#0088cc',ico:'✈️',href:`https://t.me/share/url?url=${encodeURIComponent(`https://www.assamcareerpoint-info.com/exams/${exam.id}`)}&text=${encodeURIComponent(exam.title)}`},
              ].map(s=>(
                <a key={s.l} href={s.href} target="_blank" rel="noopener noreferrer"
                  style={{display:'flex',alignItems:'center',gap:6,padding:'8px 14px',borderRadius:8,background:s.c,color:W,fontSize:'.76rem',fontWeight:700,textDecoration:'none'}}>
                  {s.ico} {s.l}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
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
