'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'

const G = '#c9a227', T = '#1dbfad', N = '#0b1f33', W = '#ffffff'

function Logo({ size=38 }:{size?:number}) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs><linearGradient id="hig" x1="30" y1="15" x2="70" y2="55" gradientUnits="userSpaceOnUse"><stop offset="0%" stopColor={T}/><stop offset="100%" stopColor={G}/></linearGradient></defs>
      <circle cx="50" cy="50" r="47" fill={N} stroke={G} strokeWidth="3"/>
      <circle cx="50" cy="50" r="41" fill="none" stroke={T} strokeWidth="0.6" opacity="0.5"/>
      <rect x="33" y="16" width="34" height="34" rx="8" fill="url(#hig)"/>
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

type Job    = { id:number; logo:string; title:string; org:string; category:string; district:string; status:string; vacancy:string; lastDate:string; posts?:{vacancy:number}[] }
type Exam   = { id:number; emoji:string; title:string; conductedBy:string; category:string; applicationLastDate:string; paymentLastDate:string; examDate:string; examTime:string; status:string }
type Info   = { id:number; emoji:string; title:string; category:string; description:string; lastDate?:string; status:string; importantDates:{label:string;date:string;time?:string}[] }
type Result = { id:number; emoji:string; title:string; org:string; category:string; resultDate?:string; slug:string }
type Announcement = { id:number; emoji:string; title:string; category?:string; description?:string; createdAt:string; slug:string; published:boolean }

const CATS = [
  {name:'Govt Jobs',   emoji:'🏛️',href:'/govt-jobs',  count:'Assam & India', color:'#e63946'},
  {name:'Central Govt',emoji:'🇮🇳',href:'/govt-jobs',  count:'All India Jobs', color:'#c1121f'},
  {name:'Exams',       emoji:'📚',href:'/exams',      count:'Open Now',      color:'#f4a261'},
  {name:'Information', emoji:'ℹ️', href:'/information',count:'Schemes & Info', color:'#2a9d8f'},
  {name:'Banking',     emoji:'🏦',href:'/govt-jobs',  count:'Bank Jobs',     color:'#0096b7'},
  {name:'Teaching',    emoji:'🎓',href:'/govt-jobs',  count:'Teacher Jobs',  color:'#6a0dad'},
  {name:'PDF Forms',   emoji:'📄',href:'/pdf-forms',  count:'Govt Docs',     color:'#00b4d8'},
  {name:'Results',     emoji:'📊',href:'/results',    count:'Latest Results', color:'#457b9d'},
]

const NAV_LINKS = [
  ['Home','/'],['Govt Jobs','/govt-jobs'],['Exams','/exams'],
  ['Information','/information'],['PDF Forms','/pdf-forms'],['Results','/results'],
]

const fmt  = (d:string) => { try { return new Date(d).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'}) } catch { return d } }
const days = (d:string) => Math.ceil((new Date(d + 'T23:59:59').getTime()-Date.now())/86400000)

function fmtCount(n:number):string {
  if (n === 0) return '0'
  if (n >= 100) return `${Math.floor(n/100)*100}+`
  return `${n}+`
}

export default function HomePage() {
  const [lang,      setLang]      = useState<'en'|'as'>('en')
  const [jobs,      setJobs]      = useState<Job[]>([])
  const [exams,     setExams]     = useState<Exam[]>([])
  const [info,      setInfo]      = useState<Info[]>([])
  const [results,   setResults]   = useState<Result[]>([])
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [sec,       setSec]       = useState<'jobs'|'exams'|'info'|'results'|'announcements'>('jobs')
  const [menuOpen,  setMenuOpen]  = useState(false)
  const [totalJobs,  setTotalJobs]  = useState(0)
  const [totalExams, setTotalExams] = useState(0)
  const [totalInfo,  setTotalInfo]  = useState(0)
  const [tickerItems, setTickerItems] = useState<string[]>([])

  useEffect(() => {
    Promise.all([
      fetch('/api/data/jobs',          { cache: 'no-store' }).then(r => r.json()).catch(() => []),
      fetch('/api/data/exams',         { cache: 'no-store' }).then(r => r.json()).catch(() => []),
      fetch('/api/data/info',          { cache: 'no-store' }).then(r => r.json()).catch(() => []),
      fetch('/api/data/results',       { cache: 'no-store' }).then(r => r.json()).catch(() => []),
      fetch('/api/data/announcements', { cache: 'no-store' }).then(r => r.json()).catch(() => []),
    ]).then(([jobsData, examsData, infoData, resultsData, announcementsData]) => {
      // Jobs
      if (Array.isArray(jobsData) && jobsData.length > 0) {
        setTotalJobs(jobsData.length)
        const live = jobsData.filter((j: Job) => j.status === 'Live')
        setJobs(live.length ? live.slice(0, 8) : jobsData.slice(0, 8))
      }
      // Exams
      if (Array.isArray(examsData) && examsData.length > 0) {
        setTotalExams(examsData.length)
        setExams(examsData.slice(0, 6))
      }
      // Info
      if (Array.isArray(infoData) && infoData.length > 0) {
        setTotalInfo(infoData.length)
        const active = infoData.filter((i: Info) => i.status === 'Active')
        setInfo(active.length ? active.slice(0, 6) : infoData.slice(0, 6))
      }
      // Results
      if (Array.isArray(resultsData) && resultsData.length > 0) {
        setResults(resultsData.slice(0, 5))
      }
      // Announcements
      if (Array.isArray(announcementsData) && announcementsData.length > 0) {
        const pub = announcementsData.filter((a: Announcement) => a.published)
        setAnnouncements(pub.slice(0, 5))
      }
      // Build dynamic ticker from real data
      const tickers: string[] = []
      if (Array.isArray(jobsData)) {
        jobsData.filter((j: Job) => j.status === 'Live').slice(0, 4).forEach((j: Job) => {
          const v = j.posts?.reduce((a: number, p: {vacancy:number}) => a + p.vacancy, 0) || parseInt(j.vacancy || '0')
          tickers.push(`${j.logo} ${j.title} — ${v.toLocaleString()} Posts — Last Date: ${fmt(j.lastDate)}`)
        })
      }
      if (Array.isArray(examsData)) {
        examsData.slice(0, 3).forEach((e: Exam) => {
          tickers.push(`${e.emoji} ${e.title} — Exam: ${fmt(e.examDate)}`)
        })
      }
      if (tickers.length > 0) setTickerItems(tickers)
    }).catch((err) => {
  console.error('Homepage fetch error:', err)
})
  }, [])

  const closeMenu = () => setMenuOpen(false)

  const TEXTS = {
    headline: lang==='en' ? 'Assam Career Point' : 'অসম কেৰিয়াৰ পইণ্ট',
    sub1:     lang==='en' ? '& Info' : 'আৰু তথ্য',
    tagline:  lang==='en' ? 'Jobs · Exams · Information — updated daily for Assam & NE India' : 'চাকৰি · পৰীক্ষা · তথ্য — প্ৰতিদিন আপডেট',
  }

  const STATS = [
    { num: fmtCount(totalJobs),  label: 'Jobs' },
    { num: fmtCount(totalExams), label: 'Exams' },
    { num: fmtCount(totalInfo),  label: 'Info' },
    { num: 'Free',               label: 'Access' },
  ]

  // Build Latest Alerts from REAL data only
  const alertItems = [
    ...jobs.slice(0,4).map(j => ({ id:`j${j.id}`, icon: j.logo, title: j.title, sub: `${(j.posts?.reduce((a,p)=>a+p.vacancy,0)||parseInt(j.vacancy||'0')).toLocaleString()} posts`, tag:'JOB', tagBg:'#e63946', tagCl:'#fff', href:`/jobs/${j.id}`, subCl:'#e63946' })),
    ...exams.slice(0,3).map(e => ({ id:`e${e.id}`, icon: e.emoji, title: e.title, sub: `Exam: ${fmt(e.examDate)}`, tag:'EXAM', tagBg:'#f4a261', tagCl:'#0d1b2a', href:`/exams/${e.id}`, subCl:'#f4a261' })),
    ...info.slice(0,3).map(i  => ({ id:`i${i.id}`, icon: i.emoji, title: i.title, sub: i.lastDate?`Deadline: ${fmt(i.lastDate)}`:'Active', tag:'INFO', tagBg:'#2a9d8f', tagCl:'#fff', href:`/information/${i.id}`, subCl:'#2a9d8f' })),
  ]

  // Available tabs based on data
  const tabs: {id:string;label:string}[] = [
    { id:'jobs',  label:'💼 Latest Jobs' },
    { id:'exams', label:'📚 Exams' },
    { id:'info',  label:'ℹ️ Information' },
    ...(results.length > 0          ? [{ id:'results',       label:'📊 Results' }] : []),
    ...(announcements.length > 0    ? [{ id:'announcements', label:'📢 Announcements' }] : []),
  ]

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        html, body { overflow-x: hidden; max-width: 100vw; margin: 0; font-family: Nunito, sans-serif; background: #f0f4f8; color: #1a1a2e; }
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800&family=Nunito:wght@400;600;700&display=swap');
        @keyframes ticker   { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        @keyframes scroll   { 0%{transform:translateY(0)} 100%{transform:translateY(-50%)} }
        @keyframes pulse    { 0%,100%{opacity:1} 50%{opacity:.4} }
        @keyframes fadeUp   { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:none} }
        @keyframes slideDown{ from{opacity:0;transform:translateY(-10px)} to{opacity:1;transform:none} }
        .tk  { display:inline-flex; animation: ticker 30s linear infinite; white-space:nowrap; }
        .sc  { animation: scroll 22s linear infinite; }
        .sc:hover { animation-play-state:paused; }
        .alerts { height:310px; overflow:hidden; }
        .cc  { transition:.2s; } .cc:hover { transform:translateY(-3px); box-shadow:0 8px 24px rgba(0,0,0,.1); }
        .jr:hover { background:#f8fbff !important; }
        .stab { padding:10px 16px;border:none;font-family:Nunito,sans-serif;font-weight:700;font-size:.85rem;cursor:pointer;transition:.15s;background:none;white-space:nowrap; }
        .stab.on  { color:#e63946; border-bottom:3px solid #e63946; }
        .stab.off { color:#5a6a7a; border-bottom:3px solid transparent; }
        .ec { background:#fff;border:1.5px solid #d4e0ec;border-radius:13px;padding:15px 17px;transition:.2s; }
        .ec:hover { transform:translateY(-3px);box-shadow:0 8px 28px rgba(0,0,0,.1); }
        .ic { background:#fff;border:1.5px solid #d4e0ec;border-radius:13px;padding:15px 17px;transition:.2s; }
        .ic:hover { transform:translateY(-3px);box-shadow:0 8px 28px rgba(0,0,0,.1); }
        .rc { background:#fff;border:1.5px solid #d4e0ec;border-radius:13px;padding:14px 16px;transition:.2s;text-decoration:none;color:inherit;display:flex;gap:10px;align-items:center; }
        .rc:hover { transform:translateY(-2px);box-shadow:0 6px 20px rgba(0,0,0,.08);border-color:#1dbfad; }
        .mob-menu { animation: slideDown .2s ease; }
        .mob-nav-link { display:block;padding:13px 20px;color:rgba(255,255,255,.85);font-size:1rem;font-weight:600;text-decoration:none;border-bottom:1px solid rgba(255,255,255,.07);font-family:Nunito,sans-serif; }
        .mob-nav-link:hover { background:rgba(255,255,255,.06); }
        .desk-nav  { display:flex; }
        .desk-lang { display:flex; }
        .ham-btn   { display:none; }
        .exam-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(300px,1fr)); gap:14px; }
        .info-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(290px,1fr)); gap:14px; }
        .res-grid  { display:grid; grid-template-columns:repeat(auto-fill,minmax(290px,1fr)); gap:12px; }
        @media(max-width:900px) {
          .hg { grid-template-columns:1fr !important; }
          .alerts-box { display:none !important; }
          .cg { grid-template-columns:repeat(2,1fr) !important; }
          .exam-grid,.info-grid,.res-grid { grid-template-columns:1fr !important; }
          .desk-nav  { display:none !important; }
          .desk-lang { display:none !important; }
          .ham-btn   { display:flex !important; }
          .job-badges { flex-direction:column; align-items:flex-end; }
          .hero-section { padding:32px 0 28px !important; }
        }
        @media(max-width:480px) {
  .cg { grid-template-columns:repeat(2,1fr) !important; }
  .stat-num { font-size:1.1rem !important; }
  .jr { flex-wrap:wrap !important; padding:12px 14px !important; }
  .job-badges { width:100% !important; justify-content:flex-start !important; flex-direction:row !important; flex-shrink:1 !important; }
}
      `}</style>

      {/* TICKER — dynamic from real data */}
      {tickerItems.length > 0 && (
        <div style={{ background:'#e63946',padding:'5px 0',overflow:'hidden' }}>
          <div style={{ overflow:'hidden', width:'100%' }}>
            <div className="tk" style={{ gap:48,color:'#fff',fontSize:'.82rem',fontWeight:700 }}>
              {[...tickerItems,...tickerItems].map((t,i)=><span key={i} style={{paddingRight:48}}>• {t}</span>)}
            </div>
          </div>
        </div>
      )}

      {/* HEADER */}
      <header style={{ background:'#0d1b2a',position:'sticky',top:0,zIndex:200,boxShadow:'0 2px 20px rgba(0,0,0,.28)' }}>
        <div style={{ maxWidth:1180,margin:'0 auto',padding:'11px 20px',display:'flex',alignItems:'center',justifyContent:'space-between',gap:14 }}>
          <Link href="/" style={{ display:'flex',alignItems:'center',gap:10,textDecoration:'none',flexShrink:0 }}>
            <Logo size={42}/>
            <div style={{ lineHeight:1.15 }}>
              <div style={{ fontFamily:'Arial Black,sans-serif',fontWeight:900,fontSize:'.78rem',letterSpacing:'.05em' }}>
                <span style={{color:G}}>ASSAM </span><span style={{color:W}}>CAREER</span>
              </div>
              <div style={{ fontFamily:'Arial Black,sans-serif',fontWeight:900,fontSize:'.65rem',color:T,letterSpacing:'.14em' }}>◆ POINT ◆</div>
              <div style={{ fontSize:'.5rem',color:'rgba(255,255,255,.25)' }}>assamcareerpoint-info.com</div>
            </div>
          </Link>
          <nav className="desk-nav" style={{ gap:2 }}>
            {NAV_LINKS.map(([l,h])=>(
              <Link key={h} href={h} style={{ color:'rgba(255,255,255,.7)',fontSize:'.86rem',fontWeight:600,padding:'7px 11px',borderRadius:8,textDecoration:'none',whiteSpace:'nowrap' }}>{l}</Link>
            ))}
          </nav>
          <div className="desk-lang" style={{ gap:11,alignItems:'center',flexShrink:0 }}>
            <div style={{ display:'flex',background:'rgba(255,255,255,.1)',borderRadius:99,padding:3 }}>
              {(['en','as'] as const).map(l=>(
                <button key={l} onClick={()=>setLang(l)} style={{ padding:'5px 10px',borderRadius:99,fontSize:'.73rem',fontWeight:700,background:lang===l?'#00b4d8':'transparent',color:lang===l?'#fff':'rgba(255,255,255,.5)',border:'none',cursor:'pointer',fontFamily:'Nunito,sans-serif' }}>
                  {l==='en'?'EN':'অস'}
                </button>
              ))}
            </div>
          </div>
          <button className="ham-btn" onClick={() => setMenuOpen(v => !v)} aria-label="Open navigation menu"
            style={{ alignItems:'center',justifyContent:'center',width:42,height:42,borderRadius:9,background:'rgba(255,255,255,.1)',border:'none',cursor:'pointer',flexDirection:'column',gap:5,padding:10,flexShrink:0 }}>
            <span style={{ display:'block',width:22,height:2,background:menuOpen?G:W,borderRadius:2,transition:'.2s',transform:menuOpen?'rotate(45deg) translate(5px,5px)':'none' }}/>
            <span style={{ display:'block',width:22,height:2,background:W,borderRadius:2,transition:'.2s',opacity:menuOpen?0:1 }}/>
            <span style={{ display:'block',width:22,height:2,background:menuOpen?G:W,borderRadius:2,transition:'.2s',transform:menuOpen?'rotate(-45deg) translate(5px,-5px)':'none' }}/>
          </button>
        </div>
        {menuOpen && (
          <div className="mob-menu" style={{ background:'#0d1b2a',borderTop:'1px solid rgba(255,255,255,.1)',paddingBottom:8 }}>
            {NAV_LINKS.map(([l,h])=>(
              <Link key={h} href={h} className="mob-nav-link" onClick={closeMenu}>{l}</Link>
            ))}
            <div style={{ padding:'12px 20px',display:'flex',gap:8 }}>
              {(['en','as'] as const).map(l=>(
                <button key={l} onClick={()=>{setLang(l);closeMenu()}} style={{ padding:'7px 18px',borderRadius:99,fontSize:'.82rem',fontWeight:700,background:lang===l?'#00b4d8':'rgba(255,255,255,.1)',color:lang===l?'#fff':'rgba(255,255,255,.6)',border:'none',cursor:'pointer',fontFamily:'Nunito,sans-serif' }}>
                  {l==='en'?'English':'অসমীয়া'}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* HERO */}
      <section className="hero-section" style={{ background:'linear-gradient(135deg,#0d1b2a 0%,#1b2f45 60%,#0a3050 100%)',padding:'50px 0 42px' }}>
        <div style={{ maxWidth:1180,margin:'0 auto',padding:'0 20px' }}>
          <div className="hg" style={{ display:'grid',gridTemplateColumns:'1fr 340px',gap:36,alignItems:'center' }}>
            <div style={{ animation:'fadeUp .6s ease' }}>
              <div style={{ display:'inline-flex',alignItems:'center',gap:7,background:'rgba(0,180,216,.15)',border:'1px solid rgba(0,180,216,.3)',borderRadius:99,padding:'5px 14px',fontSize:'.78rem',fontWeight:700,color:'#00b4d8',marginBottom:16 }}>
                🔴 Live — Jobs · Exams · Information
              </div>
              <h1 style={{ fontFamily:"'Sora',sans-serif",fontSize:'clamp(1.9rem,4vw,2.9rem)',fontWeight:800,color:'#fff',lineHeight:1.15,marginBottom:14 }}>
                {TEXTS.headline}<br/><span style={{color:'#00b4d8'}}>{TEXTS.sub1}</span>
              </h1>
              <p style={{ color:'rgba(255,255,255,.62)',fontSize:'1.05rem',marginBottom:26,lineHeight:1.7,maxWidth:430 }}>{TEXTS.tagline}</p>
              <div style={{ display:'flex',gap:10,flexWrap:'wrap' as const }}>
                <Link href="/govt-jobs"   style={{ display:'inline-flex',gap:6,alignItems:'center',padding:'12px 22px',borderRadius:99,background:'#e63946',color:'#fff',fontWeight:700,fontSize:'.92rem',textDecoration:'none' }}>🏛️ Govt Jobs</Link>
                <Link href="/exams"       style={{ display:'inline-flex',gap:6,alignItems:'center',padding:'12px 22px',borderRadius:99,background:'#f4a261',color:'#0d1b2a',fontWeight:700,fontSize:'.92rem',textDecoration:'none' }}>📚 Exams</Link>
                <Link href="/information" style={{ display:'inline-flex',gap:6,alignItems:'center',padding:'12px 22px',borderRadius:99,background:'transparent',color:'#fff',fontWeight:700,fontSize:'.92rem',border:'2px solid rgba(255,255,255,.3)',textDecoration:'none' }}>ℹ️ Information</Link>
              </div>
              <div style={{ display:'flex',gap:28,marginTop:26,flexWrap:'wrap' as const }}>
                {STATS.map(({num,label})=>(
                  <div key={label}>
                    <div className="stat-num" style={{ fontFamily:"'Sora',sans-serif",fontWeight:800,fontSize:'1.35rem',color:'#00b4d8' }}>{num}</div>
                    <div style={{ fontSize:'.75rem',color:'rgba(255,255,255,.5)',marginTop:2 }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Latest Alerts — only shown on desktop, only real data */}
            <div className="alerts-box" style={{ background:'rgba(255,255,255,.06)',border:'1.5px solid rgba(255,255,255,.1)',borderRadius:16,overflow:'hidden' }}>
              <div style={{ padding:'11px 16px',borderBottom:'1px solid rgba(255,255,255,.08)',display:'flex',alignItems:'center',justifyContent:'space-between' }}>
                <div style={{ fontFamily:"'Sora',sans-serif",fontWeight:700,fontSize:'.86rem',color:'rgba(255,255,255,.85)',display:'flex',alignItems:'center',gap:7 }}>
                  <span style={{ width:7,height:7,borderRadius:'50%',background:'#00b4d8',display:'inline-block',animation:'pulse 2s infinite' }} />
                  Latest Alerts
                </div>
                <span style={{ fontSize:'.66rem',color:'rgba(255,255,255,.3)',background:'rgba(255,255,255,.07)',padding:'2px 7px',borderRadius:99 }}>hover to pause</span>
              </div>
              {alertItems.length > 0 ? (
                <div className="alerts">
                  <div className="sc">
                    {[...alertItems,...alertItems].map((item,i) => (
                      <Link key={i} href={item.href} style={{ display:'block',padding:'10px 16px',borderBottom:'1px solid rgba(255,255,255,.05)',textDecoration:'none' }}>
                        <div style={{ display:'flex',gap:9,alignItems:'center' }}>
                          <span style={{ fontSize:'1.1rem',flexShrink:0 }}>{item.icon}</span>
                          <div style={{ flex:1,minWidth:0 }}>
                            <div style={{ fontSize:'.82rem',fontWeight:700,color:'#fff',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' as const }}>{item.title}</div>
                            <div style={{ fontSize:'.71rem',color:item.subCl,fontWeight:700,marginTop:2 }}>{item.sub}</div>
                          </div>
                          <span style={{ background:item.tagBg,color:item.tagCl,fontSize:'.64rem',fontWeight:700,padding:'2px 6px',borderRadius:99,flexShrink:0 }}>{item.tag}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <div style={{ padding:'40px 20px',textAlign:'center' as const,color:'rgba(255,255,255,.3)',fontSize:'.82rem' }}>
                  No alerts yet — add content from admin panel
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section style={{ padding:'34px 0 26px' }}>
        <div style={{ maxWidth:1180,margin:'0 auto',padding:'0 20px' }}>
          <h2 style={{ fontFamily:"'Sora',sans-serif",fontSize:'1.45rem',fontWeight:800,color:'#0d1b2a',marginBottom:5 }}>Browse by Category</h2>
          <p style={{ color:'#5a6a7a',fontSize:'.95rem',marginBottom:18 }}>Jobs, exams, information and documents — all in one place</p>
          <div className="cg" style={{ display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12 }}>
            {CATS.map(c=>(
              <Link key={c.name} href={c.href} style={{ textDecoration:'none' }}>
                <div className="cc" style={{ background:'#fff',border:'1.5px solid #d4e0ec',borderRadius:13,padding:'14px 16px',display:'flex',alignItems:'center',gap:11 }}>
                  <div style={{ width:42,height:42,borderRadius:9,background:`${c.color}15`,border:`1.5px solid ${c.color}30`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.3rem',flexShrink:0 }}>{c.emoji}</div>
                  <div>
                    <div style={{ fontFamily:"'Sora',sans-serif",fontWeight:700,fontSize:'.91rem',color:'#0d1b2a' }}>{c.name}</div>
                    <div style={{ fontSize:'.76rem',color:c.color,fontWeight:700,marginTop:2 }}>{c.count}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* LATEST CONTENT — TABBED */}
      <section style={{ padding:'8px 0 50px' }}>
        <div style={{ maxWidth:1180,margin:'0 auto',padding:'0 20px' }}>
          <div style={{ background:'#fff',borderRadius:14,border:'1.5px solid #d4e0ec',overflow:'hidden',marginBottom:20 }}>
            {/* Tabs */}
            <div style={{ display:'flex',borderBottom:'1px solid #d4e0ec',overflowX:'auto',scrollbarWidth:'none' as const }}>
              {tabs.map(({id,label})=>(
                <button key={id} onClick={()=>setSec(id as any)} className={`stab ${sec===id?'on':'off'}`}>{label}</button>
              ))}
              <Link href={sec==='jobs'?'/govt-jobs':sec==='exams'?'/exams':sec==='results'?'/results':sec==='announcements'?'/announcements':'/information'}
                style={{ marginLeft:'auto',padding:'10px 18px',fontSize:'.86rem',fontWeight:700,color:'#e63946',textDecoration:'none',display:'flex',alignItems:'center',whiteSpace:'nowrap' as const }}>View All →</Link>
            </div>

            {/* JOBS */}
            {sec==='jobs' && (
  jobs.length === 0 ? (
    <div style={{ padding:'40px',textAlign:'center',color:'#5a6a7a' }}>
      <div style={{ fontSize:'2rem',marginBottom:8 }}>💼</div>
      <div style={{ fontWeight:700 }}>No job vacancies yet</div>
    </div>
  ) : jobs.map((j,i)=>{
    const totalV = j.posts?.reduce((a,p)=>a+p.vacancy,0) || parseInt(j.vacancy||'0')
    const d = days(j.lastDate)

    return (
      <Link key={j.id} href={`/jobs/${j.id}`} style={{ textDecoration:'none' }}>
        <div className="jr" style={{
          display:'flex',alignItems:'center',gap:14,padding:'15px 22px',
          borderBottom:i<jobs.length-1?'1px solid #f0f4f8':'none',
          cursor:'pointer'
        }}>
          <div style={{
            width:46,height:46,borderRadius:10,
            background:'linear-gradient(135deg,#e0f7fc,#b2ebf5)',
            border:'1.5px solid #d4e0ec',
            display:'flex',alignItems:'center',justifyContent:'center',
            fontSize:'1.35rem',flexShrink:0
          }}>
            {j.logo}
          </div>

          <div style={{ flex:1,minWidth:0 }}>
            <div style={{
              fontFamily:"'Sora',sans-serif",
              fontWeight:700,fontSize:'.97rem',color:'#1a1a2e',
              overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'
            }}>
              {j.title}
            </div>
            <div style={{ fontSize:'.80rem',color:'#5a6a7a',marginTop:3 }}>
              {j.org} · {j.district}
            </div>
          </div>

          <div className="job-badges" style={{
            display:'flex',gap:7,flexShrink:0,flexWrap:'wrap',justifyContent:'flex-end'
          }}>
            <span style={{
              background:'#fde8ea',color:'#e63946',
              padding:'4px 11px',borderRadius:99,fontSize:'.77rem',fontWeight:700
            }}>
              {totalV.toLocaleString()} Posts
            </span>

            <span style={{
              background:d<=7?'#fde8ea':'#f0f4f8',
              color:d<=7?'#e63946':'#5a6a7a',
              padding:'4px 11px',borderRadius:99,fontSize:'.77rem',fontWeight:700
            }}>
              {d<=0?'⚠️ Expired':d<=7?`⚡ ${d}d left`:`📅 ${fmt(j.lastDate)}`}
            </span>
          </div>
        </div>
      </Link>
    )
  })
)}

            {/* EXAMS */}
            {sec==='exams' && (
              exams.length === 0 ? (
                <div style={{ padding:'40px',textAlign:'center' as const,color:'#5a6a7a' }}>
                  <div style={{ fontSize:'2rem',marginBottom:8 }}>📚</div>
                  <div style={{ fontWeight:700 }}>No exams yet</div>
                </div>
              ) : (
                <div style={{ padding:'16px 20px' }}>
                  <div className="exam-grid">
                    {exams.map(ex=>(
                      <Link key={ex.id} href={`/exams/${ex.id}`} style={{ textDecoration:'none' }}>
                        <div className="ec">
                          <div style={{ display:'flex',gap:10,marginBottom:10 }}>
                            <div style={{ width:42,height:42,borderRadius:9,background:'#fff3e0',border:'1.5px solid #ffe0b2',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.3rem',flexShrink:0 }}>{ex.emoji}</div>
                            <div>
                              <div style={{ fontFamily:"'Sora',sans-serif",fontWeight:700,fontSize:'.92rem',color:'#1a1a2e',lineHeight:1.3 }}>{ex.title}</div>
                              <div style={{ fontSize:'.78rem',color:'#5a6a7a',marginTop:2 }}>{ex.conductedBy}</div>
                            </div>
                          </div>
                          <div style={{ background:'#f8fbff',borderRadius:8,padding:'9px 11px',fontSize:'.80rem',display:'flex',flexDirection:'column' as const,gap:5 }}>
                            <div style={{ display:'flex',justifyContent:'space-between' }}><span style={{color:'#5a6a7a'}}>📝 Apply by:</span><strong style={{color:'#e63946'}}>{fmt(ex.applicationLastDate)}</strong></div>
                            <div style={{ display:'flex',justifyContent:'space-between' }}><span style={{color:'#5a6a7a'}}>💳 Payment by:</span><strong style={{color:'#6a0dad'}}>{fmt(ex.paymentLastDate)}</strong></div>
                            <div style={{ display:'flex',justifyContent:'space-between' }}><span style={{color:'#5a6a7a'}}>📅 Exam date:</span><strong style={{color:'#0d1b2a'}}>{fmt(ex.examDate)}</strong></div>
                            {ex.examTime&&<div style={{ fontSize:'.75rem',color:'#5a6a7a',marginTop:2 }}>⏰ {ex.examTime}</div>}
                          </div>
                          <div style={{ marginTop:8,display:'flex',justifyContent:'space-between',alignItems:'center' }}>
                            <span style={{ fontSize:'.75rem',background:'#e8f5e9',color:'#2e7d32',padding:'3px 10px',borderRadius:99,fontWeight:700 }}>{ex.status}</span>
                            <span style={{ fontSize:'.78rem',color:'#0096b7',fontWeight:700 }}>Details →</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )
            )}

            {/* INFO */}
            {sec==='info' && (
              info.length === 0 ? (
                <div style={{ padding:'40px',textAlign:'center' as const,color:'#5a6a7a' }}>
                  <div style={{ fontSize:'2rem',marginBottom:8 }}>ℹ️</div>
                  <div style={{ fontWeight:700 }}>No information yet</div>
                </div>
              ) : (
                <div style={{ padding:'16px 20px' }}>
                  <div className="info-grid">
                    {info.map(item=>(
                      <Link key={item.id} href={`/information/${item.id}`} style={{ textDecoration:'none' }}>
                        <div className="ic">
                          <div style={{ display:'flex',gap:10,marginBottom:10 }}>
                            <div style={{ width:42,height:42,borderRadius:9,background:'#e8f5e9',border:'1.5px solid #a5d6a7',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.3rem',flexShrink:0 }}>{item.emoji}</div>
                            <div>
                              <div style={{ fontFamily:"'Sora',sans-serif",fontWeight:700,fontSize:'.92rem',color:'#1a1a2e',lineHeight:1.3 }}>{item.title}</div>
                              <span style={{ fontSize:'.74rem',background:'#e0f7fc',color:'#0096b7',padding:'2px 8px',borderRadius:99,fontWeight:700 }}>{item.category}</span>
                            </div>
                          </div>
                          <p style={{ fontSize:'.86rem',color:'#5a6a7a',lineHeight:1.65,marginBottom:10 }}>{item.description.slice(0,100)}{item.description.length>100?'…':''}</p>
                          {item.importantDates.length>0 && (
                            <div style={{ background:'#fde8ea',borderRadius:8,padding:'8px 11px',fontSize:'.78rem' }}>
                              {item.importantDates.slice(0,2).map((d,idx)=>(
                                <div key={idx} style={{ display:'flex',justifyContent:'space-between',marginBottom:idx<Math.min(2,item.importantDates.length)-1?3:0 }}>
                                  <span style={{color:'#5a6a7a'}}>{d.label}:</span>
                                  <strong style={{color:'#e63946'}}>{fmt(d.date)}{d.time?` at ${d.time}`:''}</strong>
                                </div>
                              ))}
                            </div>
                          )}
                          <div style={{ marginTop:8,textAlign:'right' as const,fontSize:'.78rem',color:'#0096b7',fontWeight:700 }}>Read More →</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )
            )}

            {/* RESULTS */}
            {sec==='results' && (
              <div style={{ padding:'16px 20px' }}>
                <div className="res-grid">
                  {results.map(r=>(
                    <Link key={r.id} href={`/results/${r.slug}`} className="rc">
                      <div style={{ width:42,height:42,borderRadius:9,background:'#e0f7fc',border:'1.5px solid #b2ebf5',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.3rem',flexShrink:0 }}>{r.emoji}</div>
                      <div style={{ flex:1,minWidth:0 }}>
                        <div style={{ fontFamily:"'Sora',sans-serif",fontWeight:700,fontSize:'.88rem',color:'#1a1a2e',lineHeight:1.3 }}>{r.title}</div>
                        <div style={{ fontSize:'.75rem',color:'#5a6a7a',marginTop:3 }}>{r.org}{r.resultDate?` · ${fmt(r.resultDate)}`:''}</div>
                        <span style={{ fontSize:'.72rem',background:'#e8f5e9',color:'#2e7d32',padding:'2px 8px',borderRadius:99,fontWeight:700 }}>{r.category}</span>
                      </div>
                      <span style={{ fontSize:'.75rem',color:'#0096b7',fontWeight:700,flexShrink:0 }}>View →</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* ANNOUNCEMENTS */}
            {sec==='announcements' && (
              <div style={{ padding:'16px 20px',display:'flex',flexDirection:'column' as const,gap:10 }}>
                {announcements.map(a=>(
                  <Link key={a.id} href={`/announcements/${a.slug}`} style={{ textDecoration:'none' }}>
                    <div style={{ background:'#f8fbff',border:'1.5px solid #d4e0ec',borderRadius:11,padding:'14px 16px',display:'flex',gap:12,alignItems:'center',transition:'.18s' }}>
                      <div style={{ width:40,height:40,borderRadius:9,background:'#fde8ea',border:'1.5px solid #f7bcc0',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.2rem',flexShrink:0 }}>{a.emoji}</div>
                      <div style={{ flex:1,minWidth:0 }}>
                        <div style={{ fontFamily:"'Sora',sans-serif",fontWeight:700,fontSize:'.88rem',color:'#1a1a2e',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' as const }}>{a.title}</div>
                        <div style={{ fontSize:'.74rem',color:'#5a6a7a',marginTop:3 }}>
                          {a.category&&<span style={{ background:'#fde8ea',color:'#e63946',padding:'1px 7px',borderRadius:99,fontWeight:700,marginRight:6 }}>{a.category}</span>}
                          {new Date(a.createdAt).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'})}
                        </div>
                      </div>
                      <span style={{ fontSize:'.75rem',color:'#0096b7',fontWeight:700,flexShrink:0 }}>Read →</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background:'#0d1b2a',padding:'30px 0 18px' }}>
        <div style={{ maxWidth:1180,margin:'0 auto',padding:'0 20px' }}>
          <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(170px,1fr))',gap:26,marginBottom:22 }}>
            <div>
              <div style={{ display:'flex',alignItems:'center',gap:9,marginBottom:11 }}>
                <Logo size={36}/>
                <div style={{ fontFamily:'Arial Black,sans-serif',fontWeight:900,fontSize:'.79rem' }}>
                  <span style={{color:G}}>ASSAM </span><span style={{color:W}}>CAREER </span><span style={{color:T}}>POINT</span>
                </div>
              </div>
              <p style={{ fontSize:'.77rem',color:'rgba(255,255,255,.38)',lineHeight:1.7 }}>Your trusted source for jobs, exams, and important information in Assam & NE India.</p>
            </div>
            {[
              ['Quick Links',[['Govt Jobs','/govt-jobs'],['Exams','/exams'],['Information','/information'],['PDF Forms','/pdf-forms']]],
              ['More',[['Results','/results'],['Announcements','/announcements'],['Guides','/guides'],['Services','/services']]],
              ['Legal & Info',[['About Us','/about-us'],['Contact Us','/contact'],['Privacy Policy','/privacy-policy'],['Affiliate','/affiliate']]],
            ].map(([title,links])=>(
              <div key={title as string}>
                <h4 style={{ fontFamily:"'Sora',sans-serif",fontWeight:700,fontSize:'.80rem',color:'rgba(255,255,255,.55)',marginBottom:10,textTransform:'uppercase',letterSpacing:'.06em' }}>{title as string}</h4>
                {(links as [string,string][]).map(([l,h])=><div key={l}><Link href={h} style={{ fontSize:'.79rem',color:'rgba(255,255,255,.38)',textDecoration:'none',display:'block',marginBottom:5 }}>{l}</Link></div>)}
              </div>
            ))}
          </div>
          <div style={{ borderTop:'1px solid rgba(255,255,255,.07)',paddingTop:14,display:'flex',justifyContent:'space-between',flexWrap:'wrap' as const,gap:8,fontSize:'.74rem',color:'rgba(255,255,255,.28)' }}>
            <div>© 2025–2026 Assam Career Point & Info. Informational portal only — verify from official sources.</div>
            <div style={{ display:'flex',gap:12,alignItems:'center',flexWrap:'wrap' }}>
              {[['Privacy Policy','/privacy-policy'],['About Us','/about-us'],['Contact','/contact'],['Affiliate','/affiliate']].map(([l,h])=>(
                <Link key={h} href={h} style={{ color:'#c9a22777',textDecoration:'none',fontWeight:700 }}>{l}</Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
