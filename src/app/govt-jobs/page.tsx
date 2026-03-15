'use client'
// src/app/govt-jobs/page.tsx — Public Govt Jobs Listing
// Reads from localStorage 'acp_jobs_v6'

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

type Job = { id:number; logo:string; title:string; org:string; category:string; district:string; status:string; vacancy:string; lastDate:string; fee:string; salary:string; createdAt:string; posts?:{vacancy:number}[] }

const CATS = ['All','Govt Job','Central Govt','State Govt','Banking','Teaching','Railway','Defence','PSC','Private Job']
const DISTRICTS = ['All Districts','Kamrup','Kamrup (Metro)','Dibrugarh','Jorhat','Kokrajhar','Nagaon','Sonitpur','Silchar','Lakhimpur','Barpeta','Dhubri','Tinsukia','Sivasagar','All India']

const STATUS_COLOR: Record<string,string> = { 'Live':'#22c55e', 'Closing':'#f59e0b', 'Draft':'#8fa3b8' }

const FALLBACK: Job[] = [
  {id:1,logo:'👮',title:'Assam Police Recruitment 2026 – SI, Constable & Other Posts',org:'SLPRB Assam',category:'Govt Job',district:'All Districts',status:'Live',vacancy:'5734',lastDate:'2026-03-25',fee:'₹285',salary:'₹12,000–1,10,000',createdAt:new Date().toISOString()},
  {id:2,logo:'🌲',title:'BTC Kokrajhar Forest Guard & Forest Protection Force 2026',org:'BTC, Kokrajhar',category:'Govt Job',district:'Kokrajhar',status:'Live',vacancy:'157',lastDate:'2026-03-15',fee:'₹230',salary:'₹14,000–60,500',createdAt:new Date().toISOString()},
]

export default function GovtJobsPage() {
  const [jobs,    setJobs]    = useState<Job[]>([])
  const [cat,     setCat]     = useState('All')
  const [dist,    setDist]    = useState('All Districts')
  const [q,       setQ]       = useState('')
  const [loaded,  setLoaded]  = useState(false)
  const [sortBy,  setSortBy]  = useState<'latest'|'lastDate'>('latest')

useEffect(() => {
    fetch('/api/data/jobs')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setJobs(data.filter((j: Job) => j.status !== 'Draft'))
        } else {
          try {
            const saved = localStorage.getItem('acp_jobs_v6')
            const list: Job[] = saved ? JSON.parse(saved) : FALLBACK
            setJobs(list.filter(j => j.status !== 'Draft'))
          } catch { setJobs(FALLBACK) }
        }
        setLoaded(true)
      })
      .catch(() => {
        try {
          const saved = localStorage.getItem('acp_jobs_v6')
          const list: Job[] = saved ? JSON.parse(saved) : FALLBACK
          setJobs(list.filter(j => j.status !== 'Draft'))
        } catch { setJobs(FALLBACK) }
        setLoaded(true)
      })
  }, [])

  const filtered = jobs
    .filter(j =>
      (cat === 'All' || j.category === cat) &&
      (dist === 'All Districts' || j.district === dist || j.district === 'All Districts') &&
      (!q || j.title.toLowerCase().includes(q.toLowerCase()) || j.org.toLowerCase().includes(q.toLowerCase()))
    )
    .sort((a,b) => sortBy === 'latest'
      ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      : new Date(a.lastDate).getTime() - new Date(b.lastDate).getTime()
    )

  const fmt = (d: string) => { try { return new Date(d).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'}) } catch { return d } }

  const daysLeft = (d: string) => {
    try {
      const diff = Math.ceil((new Date(d).getTime() - Date.now()) / 86400000)
      if (diff < 0)  return {t:`Closed ${Math.abs(diff)}d ago`, c:'#ef4444', bg:'#fde8ea'}
      if (diff === 0) return {t:'⚠️ Last Day!', c:'#ef4444', bg:'#fde8ea'}
      if (diff <= 5)  return {t:`⚠️ ${diff} days left`, c:'#f59e0b', bg:'#fff8e1'}
      return {t:`${diff} days left`, c:'#22c55e', bg:'#e8f5e9'}
    } catch { return null }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800&family=Nunito:wght@400;600;700&display=swap');
        *,*::before,*::after{box-sizing:border-box}
        html,body{margin:0;font-family:Nunito,sans-serif;background:#f0f4f8;color:#1a1a2e;overflow-x:hidden}
        .nav-a{color:rgba(255,255,255,.6);font-size:.82rem;font-weight:700;padding:7px 11px;border-radius:8px;text-decoration:none;white-space:nowrap}
        .nav-a:hover,.nav-a.on{color:${G}}
        .cat-btn{padding:6px 13px;border-radius:99px;font-size:.74rem;font-weight:700;cursor:pointer;border:1.5px solid #d4e0ec;background:#fff;color:#5a6a7a;font-family:Nunito,sans-serif;transition:.15s;white-space:nowrap}
        .cat-btn.on{background:${N};color:${G};border-color:${G}}
        .cat-btn:hover:not(.on){border-color:${T};color:${T}}
        .jcard{background:#fff;border:1.5px solid #d4e0ec;border-radius:14px;overflow:hidden;text-decoration:none;color:inherit;display:block;transition:.2s}
        .jcard:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,.09);border-color:${T}}
        .si{width:100%;background:#f8fbff;border:1.5px solid #d4e0ec;border-radius:9px;padding:9px 12px;font-family:Nunito,sans-serif;font-size:.82rem;color:#1a1a2e;outline:none}
        @media(max-width:700px){.filters{flex-direction:column!important}}
      `}</style>

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
              <Link key={h} href={h} className={`nav-a${h==='/govt-jobs'?' on':''}`}>{l}</Link>
            ))}
          </nav>
        </div>
      </header>

      <div style={{background:`linear-gradient(135deg,${N},#0a3050)`,padding:'32px 20px 26px',textAlign:'center' as const}}>
        <div style={{fontSize:'2.2rem',marginBottom:8}}>💼</div>
        <h1 style={{fontFamily:'Sora,sans-serif',fontWeight:800,fontSize:'clamp(1.3rem,3vw,2rem)',color:W,margin:'0 0 8px'}}>Govt Jobs 2026</h1>
        <p style={{color:'rgba(255,255,255,.55)',fontSize:'.9rem',maxWidth:500,margin:'0 auto 18px'}}>SLPRB, APSC, SSC, Railway, Banking, Teaching & all government vacancies in Assam & NE India</p>
        <div style={{maxWidth:500,margin:'0 auto',position:'relative' as const}}>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search jobs (e.g. Assam Police, APSC, SBI...)"
            style={{width:'100%',padding:'12px 44px 12px 16px',borderRadius:99,border:`2px solid ${G}`,background:'rgba(255,255,255,.08)',color:W,fontFamily:'Nunito,sans-serif',fontSize:'.88rem',outline:'none'}}/>
          <span style={{position:'absolute' as const,right:15,top:'50%',transform:'translateY(-50%)',fontSize:'1.1rem'}}>🔍</span>
        </div>
        <div style={{display:'flex',justifyContent:'center',gap:22,marginTop:16,flexWrap:'wrap' as const}}>
          {[{v:jobs.filter(j=>j.status==='Live').length,l:'Live Jobs',c:'#22c55e'},{v:jobs.filter(j=>j.status==='Closing').length,l:'Closing Soon',c:G},{v:jobs.reduce((s,j)=>s+Number(j.vacancy||0),0).toLocaleString('en-IN'),l:'Total Vacancies',c:T}].map(s=>(
            <div key={s.l} style={{textAlign:'center' as const}}>
              <div style={{fontFamily:'Arial Black,sans-serif',fontWeight:900,fontSize:'1.2rem',color:s.c}}>{s.v}</div>
              <div style={{fontSize:'.68rem',color:'rgba(255,255,255,.4)'}}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{maxWidth:1180,margin:'0 auto',padding:'20px 20px 60px'}}>

        {/* Filters */}
        <div className="filters" style={{display:'flex',gap:12,marginBottom:18,flexWrap:'wrap' as const}}>
          <div style={{flex:1,minWidth:140}}>
            <select value={dist} onChange={e=>setDist(e.target.value)} className="si">
              {DISTRICTS.map(d=><option key={d}>{d}</option>)}
            </select>
          </div>
          <div style={{flex:1,minWidth:140}}>
            <select value={sortBy} onChange={e=>setSortBy(e.target.value as 'latest'|'lastDate')} className="si">
              <option value="latest">Sort: Latest First</option>
              <option value="lastDate">Sort: Deadline First</option>
            </select>
          </div>
        </div>

        {/* Category pills */}
        <div style={{display:'flex',gap:7,flexWrap:'wrap' as const,marginBottom:18}}>
          {CATS.map(c=><button key={c} className={`cat-btn${cat===c?' on':''}`} onClick={()=>setCat(c)}>{c}</button>)}
        </div>

        <div style={{fontSize:'.82rem',color:'#5a6a7a',marginBottom:14,fontWeight:700}}>
          {loaded ? `${filtered.length} job${filtered.length!==1?'s':''} found` : 'Loading jobs...'}
        </div>

        {/* Job cards */}
        <div style={{display:'flex',flexDirection:'column' as const,gap:14}}>
          {filtered.map(job=>{
            const dl = daysLeft(job.lastDate)
            const sc = STATUS_COLOR[job.status] || '#8fa3b8'
            const vac = job.posts?.reduce((s,p)=>s+p.vacancy,0) || Number(job.vacancy) || 0
            return (
              <Link key={job.id} href={`/jobs/${job.id}`} className="jcard">
                <div style={{display:'flex',gap:14,padding:'16px 20px',alignItems:'flex-start'}}>
                  {/* Logo */}
                  <div style={{width:54,height:54,borderRadius:13,background:`${sc}18`,border:`2px solid ${sc}44`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.7rem',flexShrink:0}}>{job.logo}</div>
                  {/* Main */}
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:'flex',gap:7,flexWrap:'wrap' as const,marginBottom:6}}>
                      <span style={{background:`${sc}20`,color:sc,padding:'2px 10px',borderRadius:99,fontSize:'.67rem',fontWeight:800,border:`1px solid ${sc}44`}}>● {job.status}</span>
                      <span style={{background:'#f0f4f8',color:'#5a6a7a',padding:'2px 10px',borderRadius:99,fontSize:'.67rem',fontWeight:700}}>{job.category}</span>
                      <span style={{background:'#f0f4f8',color:'#5a6a7a',padding:'2px 10px',borderRadius:99,fontSize:'.67rem',fontWeight:700}}>📍 {job.district}</span>
                    </div>
                    <h2 style={{fontFamily:'Sora,sans-serif',fontWeight:700,fontSize:'.92rem',color:N,lineHeight:1.35,margin:'0 0 5px',overflow:'hidden',display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical' as const}}>{job.title}</h2>
                    <div style={{fontSize:'.77rem',color:'#5a6a7a'}}>{job.org}</div>
                    {/* Key info chips */}
                    <div style={{display:'flex',gap:10,flexWrap:'wrap' as const,marginTop:10}}>
                      <span style={{fontSize:'.75rem',color:N,fontWeight:700}}>👥 <span style={{color:T}}>{vac.toLocaleString('en-IN')}</span> Vacancies</span>
                      <span style={{fontSize:'.75rem',color:N,fontWeight:700}}>💰 {job.salary || '—'}</span>
                      <span style={{fontSize:'.75rem',color:N,fontWeight:700}}>💳 {job.fee || '—'}</span>
                    </div>
                  </div>
                  {/* Right: deadline */}
                  <div style={{textAlign:'right' as const,flexShrink:0,minWidth:100}}>
                    <div style={{fontSize:'.65rem',color:'#8fa3b8',fontWeight:700,textTransform:'uppercase' as const,marginBottom:4}}>Last Date</div>
                    <div style={{fontFamily:'Sora,sans-serif',fontWeight:700,fontSize:'.82rem',color:N,marginBottom:6}}>{fmt(job.lastDate)}</div>
                    {dl && <span style={{background:dl.bg,color:dl.c,padding:'3px 9px',borderRadius:99,fontSize:'.67rem',fontWeight:800,border:`1px solid ${dl.c}44`}}>{dl.t}</span>}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {loaded && filtered.length === 0 && (
          <div style={{textAlign:'center' as const,padding:'60px 20px',color:'#8fa3b8'}}>
            <div style={{fontSize:'3rem',marginBottom:14}}>📭</div>
            <h3 style={{fontFamily:'Sora,sans-serif',color:N,marginBottom:8}}>No jobs found</h3>
            <button onClick={()=>{setCat('All');setDist('All Districts');setQ('')}} style={{padding:'9px 20px',borderRadius:99,background:N,color:G,fontWeight:900,border:'none',cursor:'pointer',fontFamily:'Arial Black,sans-serif',fontSize:'.82rem'}}>Clear Filters</button>
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
