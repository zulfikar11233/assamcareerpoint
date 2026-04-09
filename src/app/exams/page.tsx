'use client'
// src/app/exams/page.tsx — Public Exams Listing
import Link from 'next/link'
import { useState, useEffect } from 'react'

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
  description: string; applicationStart: string; applicationLastDate: string
  paymentLastDate: string; examDate: string; examTime: string
  admitCardDate?: string; resultDate?: string; fee: string; eligibility: string
  syllabus: string; officialSite: string; applyLink: string; admitCardLink?: string
  status: 'Upcoming' | 'Registration Open' | 'Registration Closed' | 'Exam Ongoing' | 'Result Declared'
  createdAt: string; slug?: string  // ✅ slug added
}

const STATUS_COLOR: Record<string, string> = {
  'Registration Open':   '#22c55e',
  'Upcoming':            '#f59e0b',
  'Registration Closed': '#ef4444',
  'Exam Ongoing':        '#3b82f6',
  'Result Declared':     '#8b5cf6',
}

const CATS = ['All', 'Teaching', 'Engineering', 'Medical', 'Civil Services', 'Banking', 'Railway', 'Defence', 'State PSC', 'Insurance', 'Other']

// ✅ NAV LINKS — same as homepage for consistency
const NAV_LINKS: [string, string][] = [
  ['🏠 Home', '/'],
  ['💼 Jobs', '/govt-jobs'],
  ['📚 Exams', '/exams'],
  ['ℹ️ Info', '/information'],
  ['📄 PDF Forms', '/pdf-forms'],
  ['📊 Results', '/results'],
]

const FALLBACK: Exam[] = [
  { id:1, emoji:'📚', title:'CTET 2026 — Central Teacher Eligibility Test', conductedBy:'CBSE', category:'Teaching', description:'National eligibility test for teachers for Class 1–8.', applicationStart:'2026-02-15', applicationLastDate:'2026-03-15', paymentLastDate:'2026-03-17', examDate:'2026-05-22', examTime:'9:30 AM – 12:00 PM', admitCardDate:'2026-05-10', resultDate:'2026-06-30', fee:'1 Paper: Gen ₹1,000 | Both: Gen ₹1,200', eligibility:'Graduation + B.Ed / D.El.Ed', syllabus:'Child Dev., Language I & II, Maths / Science / Social', officialSite:'ctet.nic.in', applyLink:'https://ctet.nic.in', status:'Registration Open', createdAt: new Date().toISOString() },
  { id:2, emoji:'🏥', title:'NEET UG 2026 – Medical Entrance', conductedBy:'NTA', category:'Medical', description:'National Eligibility cum Entrance Test for MBBS, BDS, BAMS.', applicationStart:'2026-02-01', applicationLastDate:'2026-03-31', paymentLastDate:'2026-04-01', examDate:'2026-05-04', examTime:'2:00 PM – 5:20 PM', admitCardDate:'2026-04-20', resultDate:'2026-06-14', fee:'Gen ₹1,700 · SC/ST ₹1,000', eligibility:'10+2 with PCB (min 50%)', syllabus:'Physics, Chemistry, Biology (Class 11 & 12)', officialSite:'neet.nta.nic.in', applyLink:'https://neet.nta.nic.in', status:'Registration Open', createdAt: new Date().toISOString() },
]

export default function ExamsPage() {
  const [exams,  setExams]  = useState<Exam[]>([])
  const [cat,    setCat]    = useState('All')
  const [q,      setQ]      = useState('')
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    fetch('/api/data/exams', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) setExams(data)
        else {
          try { const s = localStorage.getItem('acp_exams_v6'); setExams(s ? JSON.parse(s) : FALLBACK) }
          catch { setExams(FALLBACK) }
        }
        setLoaded(true)
      })
      .catch(() => {
        try { const s = localStorage.getItem('acp_exams_v6'); setExams(s ? JSON.parse(s) : FALLBACK) }
        catch { setExams(FALLBACK) }
        setLoaded(true)
      })
  }, [])

  const filtered = exams.filter(e =>
  (cat === 'All' || e.category === cat) &&
  (!q || (e.title||'').toLowerCase().includes(q.toLowerCase()) || 
   (e.conductedBy||'').toLowerCase().includes(q.toLowerCase()))
)

  const fmt = (d: string) => { try { return new Date(d).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' }) } catch { return d } }

  const daysLeft = (d: string) => {
    try {
      const diff = Math.ceil((new Date(d).getTime() - Date.now()) / 86400000)
      if (diff < 0)  return null
      if (diff === 0) return '⚠️ Today!'
      if (diff <= 3)  return `⚠️ ${diff}d left`
      return `${diff} days left`
    } catch { return null }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800&family=Nunito:wght@400;600;700&display=swap');
        *,*::before,*::after{box-sizing:border-box}
        html,body{margin:0;font-family:Nunito,sans-serif;background:#f0f4f8;color:#1a1a2e;overflow-x:hidden}

        /* ✅ NAV LINKS — bordered pill style on ALL, gold highlight on active */
        .nav-a{
          color:rgba(255,255,255,.65);
          font-size:.82rem;font-weight:700;
          padding:6px 13px;
          border-radius:99px;
          border:1.5px solid rgba(255,255,255,.15);
          text-decoration:none;
          white-space:nowrap;
          transition:.15s;
        }
        .nav-a:hover{
          color:${G};
          border-color:${G}88;
          background:rgba(201,162,39,.08);
        }
        .nav-a.on{
          color:${G};
          border-color:${G};
          background:rgba(201,162,39,.12);
        }

        .cat-btn{padding:7px 14px;border-radius:99px;font-size:.76rem;font-weight:700;cursor:pointer;border:1.5px solid #d4e0ec;background:#fff;color:#5a6a7a;font-family:Nunito,sans-serif;transition:.15s;white-space:nowrap}
        .cat-btn.on{background:${N};color:${G};border-color:${G}}
        .cat-btn:hover:not(.on){border-color:${T};color:${T}}
        .ecard{background:#fff;border:1.5px solid #d4e0ec;border-radius:15px;padding:0;overflow:hidden;display:flex;flex-direction:column;transition:.2s;text-decoration:none;color:inherit}
        .ecard:hover{transform:translateY(-3px);box-shadow:0 10px 30px rgba(0,0,0,.1);border-color:${T}}
        .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:18px}
        @media(max-width:700px){.grid{grid-template-columns:1fr!important}}
        .pill{display:inline-flex;align-items:center;padding:3px 10px;border-radius:99px;font-size:.67rem;font-weight:800}
        .shimmer{background:linear-gradient(90deg,#f0f4f8 25%,#e4eaf2 50%,#f0f4f8 75%);background-size:200% 100%;animation:shimmer 1.5s infinite}
        @keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
      `}</style>

      {/* HEADER */}
      <header style={{background:N,borderBottom:`2px solid ${G}`,position:'sticky',top:0,zIndex:100,boxShadow:'0 2px 20px rgba(0,0,0,.4)'}}>
        <div style={{maxWidth:1180,margin:'0 auto',padding:'10px 20px',display:'flex',alignItems:'center',gap:14,flexWrap:'wrap' as const}}>
          <Link href="/" style={{display:'flex',alignItems:'center',gap:10,textDecoration:'none',flexShrink:0}}>
            <Logo size={40}/>
            <div>
              <div style={{fontFamily:'Arial Black,sans-serif',fontSize:'.78rem',fontWeight:900}}>
                <span style={{color:G}}>ASSAM </span><span style={{color:W}}>CAREER</span>
              </div>
              <div style={{fontFamily:'Arial Black,sans-serif',fontSize:'.65rem',color:T,letterSpacing:'.12em'}}>◆ POINT ◆</div>
            </div>
          </Link>
          {/* ✅ CONSISTENT NAV — same links as homepage */}
          <nav style={{display:'flex',gap:6,flexWrap:'wrap' as const}}>
            {NAV_LINKS.map(([l, h]) => (
              <Link key={h} href={h} className={`nav-a${h === '/exams' ? ' on' : ''}`}>{l}</Link>
            ))}
          </nav>
        </div>
      </header>

      {/* HERO */}
      <div style={{background:`linear-gradient(135deg,${N},#0a3050)`,padding:'36px 20px 28px',textAlign:'center' as const}}>
        <div style={{fontSize:'2.5rem',marginBottom:10}}>📚</div>
        <h1 style={{fontFamily:'Sora,sans-serif',fontWeight:800,fontSize:'clamp(1.4rem,3vw,2rem)',color:W,margin:'0 0 8px'}}>
          Competitive Exams 2026
        </h1>
        <p style={{color:'rgba(255,255,255,.55)',fontSize:'.92rem',marginBottom:18,maxWidth:520,margin:'0 auto 18px'}}>
          CTET, NEET, JEE, UPSC, APSC, SSC, Railway & all major exams — registration dates, admit cards, results
        </p>
        <div style={{maxWidth:480,margin:'0 auto',position:'relative' as const}}>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search exams (e.g. CTET, NEET, UPSC...)"
            style={{width:'100%',padding:'12px 44px 12px 16px',borderRadius:99,border:`2px solid ${G}`,background:'rgba(255,255,255,.08)',color:W,fontFamily:'Nunito,sans-serif',fontSize:'.9rem',outline:'none'}}/>
          <span style={{position:'absolute' as const,right:15,top:'50%',transform:'translateY(-50%)',fontSize:'1.1rem'}}>🔍</span>
        </div>
        <div style={{display:'flex',justifyContent:'center',gap:20,marginTop:18,flexWrap:'wrap' as const}}>
          {[
            {v:exams.filter(e=>e.status==='Registration Open').length, l:'Registration Open', c:'#22c55e'},
            {v:exams.filter(e=>e.status==='Upcoming').length,           l:'Upcoming',          c:G},
            {v:exams.length,                                             l:'Total Exams',       c:T},
          ].map(s=>(
            <div key={s.l} style={{textAlign:'center' as const}}>
              <div style={{fontFamily:'Arial Black,sans-serif',fontWeight:900,fontSize:'1.3rem',color:s.c}}>{s.v}</div>
              <div style={{fontSize:'.7rem',color:'rgba(255,255,255,.45)'}}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{maxWidth:1180,margin:'0 auto',padding:'22px 20px 60px'}}>
        <div style={{display:'flex',gap:8,flexWrap:'wrap' as const,marginBottom:22,overflowX:'auto' as const,paddingBottom:4}}>
          {CATS.map(c=>(
            <button key={c} className={`cat-btn${cat===c?' on':''}`} onClick={()=>setCat(c)}>{c}</button>
          ))}
        </div>

        <div style={{fontSize:'.82rem',color:'#5a6a7a',marginBottom:14,fontWeight:700}}>
          {loaded ? `Showing ${filtered.length} exam${filtered.length!==1?'s':''}${cat!=='All'?` in ${cat}`:''}${q?` matching "${q}"`:''}` : 'Loading exams...'}
        </div>

        {!loaded && (
          <div className="grid">
            {[1,2,3,4,5,6].map(i=>(
              <div key={i} style={{borderRadius:15,overflow:'hidden',height:220}}>
                <div className="shimmer" style={{height:'100%'}}/>
              </div>
            ))}
          </div>
        )}

        {loaded && (
          <div className="grid">
            {filtered.map(exam=>{
              const dl = daysLeft(exam.applicationLastDate)
              const sc = STATUS_COLOR[exam.status] || '#8fa3b8'
              return (
                // ✅ FIX — use slug || id (was exam.id only before)
                <Link key={exam.id} href={`/exams/${exam.slug || exam.id}`} className="ecard">
                  <div style={{height:4,background:`linear-gradient(90deg,${sc},${sc}88)`}}/>
                  <div style={{padding:'18px 20px',flex:1,display:'flex',flexDirection:'column' as const,gap:12}}>
                    <div style={{display:'flex',gap:12,alignItems:'flex-start'}}>
                      <div style={{width:52,height:52,borderRadius:12,background:`${sc}18`,border:`2px solid ${sc}44`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.6rem',flexShrink:0}}>
                        {exam.emoji}
                      </div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{display:'flex',gap:6,flexWrap:'wrap' as const,marginBottom:5}}>
                          <span className="pill" style={{background:`${sc}20`,color:sc,border:`1px solid ${sc}44`}}>● {exam.status}</span>
                          <span className="pill" style={{background:'#f0f4f8',color:'#5a6a7a',border:'1px solid #d4e0ec'}}>{exam.category}</span>
                        </div>
                        <h2 style={{fontFamily:'Sora,sans-serif',fontWeight:700,fontSize:'.9rem',color:N,lineHeight:1.35,margin:0,overflow:'hidden',display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical' as const}}>
                          {exam.title}
                        </h2>
                        <div style={{fontSize:'.76rem',color:'#5a6a7a',marginTop:4}}>by {exam.conductedBy}</div>
                      </div>
                    </div>
                    <div style={{background:'#f8fbff',borderRadius:10,padding:'10px 12px',display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
                      {[
                        {l:'Apply By',  v:exam.applicationLastDate, urgent: dl !== null && dl.includes('⚠️')},
                        {l:'Exam Date', v:exam.examDate,             urgent: false},
                        ...(exam.admitCardDate ? [{l:'Admit Card', v:exam.admitCardDate, urgent:false}] : []),
                        ...(exam.resultDate    ? [{l:'Result',     v:exam.resultDate,    urgent:false}] : []),
                      ].slice(0,4).map(d=>(
                        <div key={d.l}>
                          <div style={{fontSize:'.63rem',fontWeight:700,color:'#8fa3b8',textTransform:'uppercase' as const,letterSpacing:'.04em'}}>{d.l}</div>
                          <div style={{fontSize:'.78rem',fontWeight:700,color:d.urgent?'#ef4444':N}}>{fmt(d.v)}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap' as const,gap:6,marginTop:'auto'}}>
                      <div style={{fontSize:'.76rem',color:'#5a6a7a'}}>
  <span style={{fontWeight:700,color:N}}>Fee:</span> {(exam.fee||'').slice(0,40)}{(exam.fee||'').length>40?'…':''}
</div>
                      {dl && (
                        <span style={{background:dl.includes('⚠️')?'#fde8ea':'#e8f5e9',color:dl.includes('⚠️')?'#ef4444':'#22c55e',border:`1px solid ${dl.includes('⚠️')?'#f7bcc0':'#a5d6a7'}`,padding:'3px 9px',borderRadius:99,fontSize:'.68rem',fontWeight:800}}>
                          {dl}
                        </span>
                      )}
                    </div>
                  </div>
                  <div style={{padding:'10px 20px',background:`${N}08`,borderTop:'1px solid #e8eef6',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                    <span style={{fontSize:'.75rem',color:'#5a6a7a'}}>{exam.officialSite}</span>
                    <span style={{fontSize:'.75rem',fontWeight:700,color:T}}>View Details →</span>
                  </div>
                </Link>
              )
            })}
          </div>
        )}

        {loaded && filtered.length === 0 && (
          <div style={{textAlign:'center' as const,padding:'60px 20px',color:'#8fa3b8'}}>
            <div style={{fontSize:'3rem',marginBottom:14}}>📭</div>
            <h3 style={{fontFamily:'Sora,sans-serif',fontWeight:700,fontSize:'1.1rem',color:N,marginBottom:8}}>No exams found</h3>
            <p style={{fontSize:'.88rem'}}>Try a different category or search term.</p>
            <button onClick={()=>{setCat('All');setQ('')}} style={{marginTop:14,padding:'9px 20px',borderRadius:99,background:N,color:G,fontWeight:900,border:'none',cursor:'pointer',fontSize:'.82rem',fontFamily:'Arial Black,sans-serif'}}>
              Clear Filters
            </button>
          </div>
        )}
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