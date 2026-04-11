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

type Job          = { id:number; logo:string; title:string; org:string; category:string; district:string; status:string; vacancy:string; lastDate:string; description?:string; posts?:{vacancy:number}[]; slug?:string }
type Exam         = { id:number; emoji:string; title:string; conductedBy:string; category:string; applicationLastDate:string; paymentLastDate:string; examDate:string; examTime:string; status:string; slug?:string }
type Info         = { id:number; emoji:string; title:string; category:string; description:string; lastDate?:string; status:string; importantDates:{label:string;date:string;time?:string}[]; slug?:string }
type Result       = { id:number; emoji?:string; title:string; org?:string; category?:string; resultDate?:string; slug?:string }
type Announcement = { id:number; emoji?:string; title:string; category?:string; description?:string; createdAt:string; slug?:string; published?:boolean }
type Guide        = { id:number; emoji?:string; title:string; category?:string; description?:string; createdAt:string; slug?:string; published?:boolean }
type Service      = { id:number; emoji?:string; title:string; category?:string; description?:string; createdAt:string; slug?:string; published?:boolean }

// ── All-Posts unified type ─────────────────────────────────────
type AnyPost = {
  id: string
  icon: string
  title: string
  sub: string
  tag: string
  tagBg: string
  tagCl: string
  href: string
  subCl: string
  date: number // timestamp for sorting
}

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

async function fetchWithRetry(url: string, retries = 2): Promise<any> {
  for (let i = 0; i <= retries; i++) {
    try {
      const res = await fetch(url, { cache: 'no-store', headers: { 'Cache-Control': 'no-cache' } })
      if (res.ok) return await res.json()
    } catch {}
    if (i < retries) await new Promise(r => setTimeout(r, 800))
  }
  return []
}

export default function HomePage() {
  const [lang,          setLang]          = useState<'en'|'as'>('en')
  const [jobs,          setJobs]          = useState<Job[]>([])
  const [exams,         setExams]         = useState<Exam[]>([])
  const [info,          setInfo]          = useState<Info[]>([])
  const [results,       setResults]       = useState<Result[]>([])
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [guides,        setGuides]        = useState<Guide[]>([])
  const [services,      setServices]      = useState<Service[]>([])
  const [sec,           setSec]           = useState<'all'|'jobs'|'exams'|'info'|'results'|'announcements'|'services'|'guides'>('all')
  const [menuOpen,      setMenuOpen]      = useState(false)
  const [totalJobs,     setTotalJobs]     = useState(0)
  const [totalExams,    setTotalExams]    = useState(0)
  const [totalInfo,     setTotalInfo]     = useState(0)
  const [tickerItems,   setTickerItems]   = useState<string[]>([])
  const [loading,       setLoading]       = useState(true)

  useEffect(() => {
    Promise.all([
      fetchWithRetry('/api/data/jobs'),
      fetchWithRetry('/api/data/exams'),
      fetchWithRetry('/api/data/info'),
      fetchWithRetry('/api/data/results'),
      fetchWithRetry('/api/data/announcements'),
      fetchWithRetry('/api/data/guides'),
      fetchWithRetry('/api/data/services'),
    ]).then(([jobsData, examsData, infoData, resultsData, announcementsData, guidesData, servicesData]) => {
      try {
        if (Array.isArray(jobsData)          && jobsData.length > 0)          localStorage.setItem('acp_jobs_v6',       JSON.stringify(jobsData))
        if (Array.isArray(examsData)         && examsData.length > 0)         localStorage.setItem('acp_exams_v6',      JSON.stringify(examsData))
        if (Array.isArray(infoData)          && infoData.length > 0)          localStorage.setItem('acp_info_v6',       JSON.stringify(infoData))
        if (Array.isArray(resultsData)       && resultsData.length > 0)       localStorage.setItem('acp_results',       JSON.stringify(resultsData))
        if (Array.isArray(announcementsData) && announcementsData.length > 0) localStorage.setItem('acp_announcements', JSON.stringify(announcementsData))
        if (Array.isArray(guidesData)        && guidesData.length > 0)        localStorage.setItem('acp_guides',        JSON.stringify(guidesData))
        if (Array.isArray(servicesData)      && servicesData.length > 0)      localStorage.setItem('acp_services',      JSON.stringify(servicesData))
      } catch {}

      if (Array.isArray(jobsData) && jobsData.length > 0) {
        setTotalJobs(jobsData.length)
        const live = jobsData.filter((j:Job) => j.status === 'Live')
        setJobs(live.length ? live.slice(0,8) : jobsData.slice(0,8))
      }
      if (Array.isArray(examsData) && examsData.length > 0) {
        setTotalExams(examsData.length)
        setExams(examsData.slice(0,6))
      }
      if (Array.isArray(infoData) && infoData.length > 0) {
        setTotalInfo(infoData.length)
        const active = infoData.filter((i:Info) => i.status === 'Active')
        setInfo(active.length ? active.slice(0,6) : infoData.slice(0,6))
      }
      if (Array.isArray(resultsData)       && resultsData.length > 0)       setResults(resultsData.slice(0,5))
      if (Array.isArray(announcementsData) && announcementsData.length > 0) {
        const pub = announcementsData.filter((a:Announcement) => a.published !== false)
        setAnnouncements(pub.slice(0,5))
      }
      if (Array.isArray(guidesData)   && guidesData.length > 0)   setGuides(guidesData.filter((g:Guide) => g.published !== false).slice(0,5))
      if (Array.isArray(servicesData) && servicesData.length > 0) setServices(servicesData.filter((s:Service) => s.published !== false).slice(0,5))

      const tickers: string[] = []
      if (Array.isArray(jobsData)) {
        jobsData.filter((j:Job) => j.status === 'Live').slice(0,4).forEach((j:Job) => {
          const v = j.posts?.reduce((a,p)=>a+p.vacancy,0) || parseInt(j.vacancy||'0')
          tickers.push(`${j.logo} ${j.title} — ${v.toLocaleString()} Posts — Last Date: ${fmt(j.lastDate)}`)
        })
      }
      if (Array.isArray(examsData)) {
        examsData.slice(0,3).forEach((e:Exam) => tickers.push(`${e.emoji} ${e.title} — Exam: ${fmt(e.examDate)}`))
      }
      if (tickers.length > 0) setTickerItems(tickers)
    }).catch(() => {
      try {
        const j = JSON.parse(localStorage.getItem('acp_jobs_v6') || '[]')
        const e = JSON.parse(localStorage.getItem('acp_exams_v6') || '[]')
        const i = JSON.parse(localStorage.getItem('acp_info_v6') || '[]')
        if (j.length) setJobs(j.slice(0,8))
        if (e.length) setExams(e.slice(0,6))
        if (i.length) setInfo(i.slice(0,6))
      } catch {}
    }).finally(() => setLoading(false))
  }, [])

  const closeMenu = () => setMenuOpen(false)

  // ── Build ALL POSTS unified list ────────────────────────────
  const allPosts: AnyPost[] = [
    ...jobs.map(j => ({
      id: `j${j.id}`,
      icon: j.logo || '🏛️',
      title: j.title || 'Job Vacancy',
      sub: `${(j.posts?.reduce((a,p)=>a+p.vacancy,0)||parseInt(j.vacancy||'0')).toLocaleString()} posts`,
      tag: 'JOB', tagBg: '#e63946', tagCl: '#fff',
      href: `/jobs/${j.slug || j.id}`,
      subCl: '#e63946',
      date: new Date(j.createdAt||'').getTime() || 0,
    })),
    ...exams.map(e => ({
      id: `e${e.id}`,
      icon: e.emoji || '📚',
      title: e.title || 'Exam',
      sub: `Exam: ${fmt(e.examDate)}`,
      tag: 'EXAM', tagBg: '#f4a261', tagCl: '#0d1b2a',
      href: `/exams/${e.slug || e.id}`,
      subCl: '#f4a261',
      date: new Date(e.applicationLastDate||'').getTime() || 0,
    })),
    ...info.map(i => ({
      id: `i${i.id}`,
      icon: i.emoji || 'ℹ️',
      title: i.title || 'Information',
      sub: i.lastDate ? `Deadline: ${fmt(i.lastDate)}` : 'Active',
      tag: 'INFO', tagBg: '#2a9d8f', tagCl: '#fff',
      href: `/information/${i.slug || i.id}`,
      subCl: '#2a9d8f',
      date: new Date(i.createdAt||'').getTime() || 0,
    })),
    ...results.map(r => ({
      id: `r${r.id}`,
      icon: r.emoji || '📊',
      title: r.title || 'Result',
      sub: r.resultDate ? `Result: ${fmt(r.resultDate)}` : r.org || '—',
      tag: 'RESULT', tagBg: '#457b9d', tagCl: '#fff',
      href: `/results/${r.slug || r.id}`,
      subCl: '#457b9d',
      date: new Date(r.resultDate||'').getTime() || 0,
    })),
    ...announcements.map(a => ({
      id: `a${a.id}`,
      icon: a.emoji || '📢',
      title: a.title || 'Announcement',
      sub: a.category || fmt(a.createdAt),
      tag: 'NEWS', tagBg: '#6a0dad', tagCl: '#fff',
      href: `/announcements/${a.slug || a.id}`,
      subCl: '#6a0dad',
      date: new Date(a.createdAt||'').getTime() || 0,
    })),
    ...services.map(s => ({
      id: `s${s.id}`,
      icon: s.emoji || '🏛️',
      title: s.title || 'Service',
      sub: s.category || fmt(s.createdAt),
      tag: 'SERVICE', tagBg: '#8e44ad', tagCl: '#fff',
      href: `/services/${s.slug || s.id}`,
      subCl: '#8e44ad',
      date: new Date(s.createdAt||'').getTime() || 0,
    })),
    ...guides.map(g => ({
      id: `g${g.id}`,
      icon: g.emoji || '📖',
      title: g.title || 'Guide',
      sub: g.category || fmt(g.createdAt),
      tag: 'GUIDE', tagBg: '#0096b7', tagCl: '#fff',
      href: `/guides/${g.slug || g.id}`,
      subCl: '#0096b7',
      date: new Date(g.createdAt||'').getTime() || 0,
    })),
  ].sort((a, b) => b.date - a.date)

  // ── Latest Alerts for sidebar ────────────────────────────────
  const alertItems = allPosts.slice(0, 10)

  const STATS = [
    { num: fmtCount(totalJobs),  label: 'Jobs' },
    { num: fmtCount(totalExams), label: 'Exams' },
    { num: fmtCount(totalInfo),  label: 'Info' },
    { num: 'Free',               label: 'Access' },
  ]

  // ── Tabs ─────────────────────────────────────────────────────
  const tabs: {id:string;label:string}[] = [
    { id:'all',           label:'📋 All Posts' },
    { id:'jobs',          label:'💼 Jobs' },
    { id:'exams',         label:'📚 Exams' },
    { id:'info',          label:'ℹ️ Info' },
    ...(results.length       > 0 ? [{ id:'results',       label:'📊 Results' }]       : []),
    ...(announcements.length > 0 ? [{ id:'announcements', label:'📢 Announcements' }] : []),
    ...(services.length      > 0 ? [{ id:'services',      label:'🏛️ Services' }]      : []),
    ...(guides.length        > 0 ? [{ id:'guides',        label:'📖 Guides' }]        : []),
  ]

  const viewAllHref =
    sec==='jobs'?'/govt-jobs':sec==='exams'?'/exams':sec==='results'?'/results':
    sec==='announcements'?'/announcements':sec==='guides'?'/guides':
    sec==='services'?'/services':sec==='info'?'/information':'/govt-jobs'

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        html, body { overflow-x: hidden; max-width: 100vw; margin: 0;
          font-family: var(--font-nunito), Nunito, sans-serif;
          background: #f0f4f8; color: #1a1a2e; }
        @keyframes ticker   { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        @keyframes scroll   { 0%{transform:translateY(0)} 100%{transform:translateY(-50%)} }
        @keyframes pulse    { 0%,100%{opacity:1} 50%{opacity:.6} }
        .tk  { display:inline-flex; animation: ticker 30s linear infinite; white-space:nowrap; }
        .sc  { animation: scroll 22s linear infinite; }
        .sc:hover { animation-play-state:paused; }
        .alerts { height:280px; overflow:hidden; }
        /* ✅ Category card — rounded border */
        .cc  {
          transition:.18s;
          border: 1.5px solid #d4e0ec;
          border-radius: 14px;
          background: #fff;
        }
        .cc:hover { transform:translateY(-2px); box-shadow:0 6px 20px rgba(0,0,0,.09); border-color:${T}; }
        .jr { position:relative; overflow:hidden; transition:.15s; }
        .jr:hover { background:#f8fbff !important; }
        .jr::before { content:''; position:absolute; left:0; top:0; width:3px; height:0;
          background:linear-gradient(180deg,${T},${G}); transition:height .3s ease; border-radius:0 3px 3px 0; }
        .jr:hover::before { height:100%; }
        .stab { padding:9px 14px;border:none;
          font-family:var(--font-nunito),Nunito,sans-serif;font-weight:700;font-size:.82rem;
          cursor:pointer;transition:.15s;background:none;white-space:nowrap; }
        .stab.on  { color:#e63946; border-bottom:3px solid #e63946; }
        .stab.off { color:#5a6a7a; border-bottom:3px solid transparent; }
        .ec,.ic { background:#fff;border:1.5px solid #d4e0ec;border-radius:13px;padding:14px 16px;transition:.18s; }
        .ec:hover,.ic:hover { transform:translateY(-2px);box-shadow:0 6px 24px rgba(0,0,0,.09); }
        .rc { background:#fff;border:1.5px solid #d4e0ec;border-radius:13px;padding:13px 15px;
          transition:.18s;text-decoration:none;color:inherit;display:flex;gap:10px;align-items:center; }
        .rc:hover { transform:translateY(-2px);box-shadow:0 4px 16px rgba(0,0,0,.07);border-color:${T}; }
        .mob-menu { animation: slideDown .18s ease; }
        @keyframes slideDown{ from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:none} }
        .mob-nav-link { display:block;padding:12px 20px;color:rgba(255,255,255,.85);font-size:.95rem;
          font-weight:600;text-decoration:none;border-bottom:1px solid rgba(255,255,255,.07);
          font-family:var(--font-nunito),Nunito,sans-serif; }
        .mob-nav-link:hover { background:rgba(255,255,255,.06); }
        .desk-nav  { display:flex; }
        .desk-lang { display:flex; }
        .ham-btn   { display:none; }
        .exam-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); gap:12px; }
        .info-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(270px,1fr)); gap:12px; }
        .res-grid  { display:grid; grid-template-columns:repeat(auto-fill,minmax(270px,1fr)); gap:11px; }
        /* ── Responsive ── */
        @media(max-width:900px) {
          .hg { grid-template-columns:1fr !important; }
          .alerts-box { display:none !important; }
          .cg { grid-template-columns:repeat(2,1fr) !important; }
          .exam-grid,.info-grid,.res-grid { grid-template-columns:1fr !important; }
          .desk-nav  { display:none !important; }
          .desk-lang { display:none !important; }
          .ham-btn   { display:flex !important; }
        }
        @media(max-width:480px) {
          .cg { grid-template-columns:repeat(2,1fr) !important; }
          .stat-num { font-size:1rem !important; }
          .jr { flex-wrap:wrap !important; padding:11px 12px !important; }
          .job-badges { width:100% !important; justify-content:flex-start !important; flex-direction:row !important; }
          .hero-btns { flex-direction:column !important; }
          .hero-btns a { width:100% !important; justify-content:center !important; }
          .tab-scroll { overflow-x:auto; -webkit-overflow-scrolling:touch; scrollbar-width:none; }
          .tab-scroll::-webkit-scrollbar { display:none; }
        }
      `}</style>

      {/* TICKER */}
      {tickerItems.length > 0 && (
        <div style={{background:'#e63946',padding:'5px 0',overflow:'hidden'}}>
          <div className="tk" style={{gap:48,color:'#fff',fontSize:'.8rem',fontWeight:700}}>
            {[...tickerItems,...tickerItems].map((t,i)=><span key={i} style={{paddingRight:48}}>• {t}</span>)}
          </div>
        </div>
      )}

      {/* HEADER */}
      <header style={{background:'#0d1b2a',position:'sticky',top:0,zIndex:200,boxShadow:'0 2px 16px rgba(0,0,0,.28)'}}>
        <div style={{maxWidth:1180,margin:'0 auto',padding:'10px 20px',display:'flex',alignItems:'center',justifyContent:'space-between',gap:14}}>
          <Link href="/" style={{display:'flex',alignItems:'center',gap:10,textDecoration:'none',flexShrink:0}}>
            <Logo size={40}/>
            <div style={{lineHeight:1.15}}>
              <div style={{fontFamily:'Arial Black,sans-serif',fontWeight:900,fontSize:'.78rem',letterSpacing:'.05em'}}>
                <span style={{color:G}}>ASSAM </span><span style={{color:W}}>CAREER</span>
              </div>
              <div style={{fontFamily:'Arial Black,sans-serif',fontWeight:900,fontSize:'.62rem',color:T,letterSpacing:'.14em'}}>◆ POINT ◆</div>
              <div style={{fontSize:'.48rem',color:'rgba(255,255,255,.6)'}}>assamcareerpoint-info.com</div>
            </div>
          </Link>
          <nav className="desk-nav" style={{gap:2}}>
            {NAV_LINKS.map(([l,h])=>(
              <Link key={h} href={h} style={{color:'rgba(255,255,255,.8)',fontSize:'.84rem',fontWeight:600,padding:'6px 10px',borderRadius:7,textDecoration:'none',whiteSpace:'nowrap'}}>{l}</Link>
            ))}
          </nav>
          <div className="desk-lang" style={{gap:10,alignItems:'center',flexShrink:0}}>
            <div style={{display:'flex',background:'rgba(255,255,255,.1)',borderRadius:99,padding:3}}>
              {(['en','as'] as const).map(l=>(
                <button key={l} onClick={()=>setLang(l)} style={{padding:'4px 10px',borderRadius:99,fontSize:'.72rem',fontWeight:700,background:lang===l?'#00b4d8':'transparent',color:lang===l?'#fff':'rgba(255,255,255,.5)',border:'none',cursor:'pointer',fontFamily:'var(--font-nunito),Nunito,sans-serif'}}>
                  {l==='en'?'EN':'অস'}
                </button>
              ))}
            </div>
          </div>
          <button className="ham-btn" onClick={()=>setMenuOpen(v=>!v)} aria-label="Menu"
            style={{alignItems:'center',justifyContent:'center',width:40,height:40,borderRadius:8,background:'rgba(255,255,255,.1)',border:'none',cursor:'pointer',flexDirection:'column',gap:5,padding:9,flexShrink:0}}>
            <span style={{display:'block',width:20,height:2,background:menuOpen?G:W,borderRadius:2,transition:'.2s',transform:menuOpen?'rotate(45deg) translate(4px,5px)':'none'}}/>
            <span style={{display:'block',width:20,height:2,background:W,borderRadius:2,transition:'.2s',opacity:menuOpen?0:1}}/>
            <span style={{display:'block',width:20,height:2,background:menuOpen?G:W,borderRadius:2,transition:'.2s',transform:menuOpen?'rotate(-45deg) translate(4px,-5px)':'none'}}/>
          </button>
        </div>
        {menuOpen && (
          <div className="mob-menu" style={{background:'#0d1b2a',borderTop:'1px solid rgba(255,255,255,.08)',paddingBottom:6}}>
            {NAV_LINKS.map(([l,h])=>(
              <Link key={h} href={h} className="mob-nav-link" onClick={closeMenu}>{l}</Link>
            ))}
            <div style={{padding:'10px 20px',display:'flex',gap:8}}>
              {(['en','as'] as const).map(l=>(
                <button key={l} onClick={()=>{setLang(l);closeMenu()}} style={{padding:'6px 16px',borderRadius:99,fontSize:'.8rem',fontWeight:700,background:lang===l?'#00b4d8':'rgba(255,255,255,.1)',color:lang===l?'#fff':'rgba(255,255,255,.55)',border:'none',cursor:'pointer',fontFamily:'var(--font-nunito),Nunito,sans-serif'}}>
                  {l==='en'?'English':'অসমীয়া'}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      <main id="main-content">

        {/* ✅ HERO — compact, no wasted space */}
        <section style={{background:'linear-gradient(135deg,#0d1b2a 0%,#1b2f45 60%,#0a3050 100%)',padding:'22px 0 18px'}}>
          <div style={{maxWidth:1180,margin:'0 auto',padding:'0 20px'}}>
            <div className="hg" style={{display:'grid',gridTemplateColumns:'1fr 320px',gap:28,alignItems:'center'}}>

              {/* Left — headline */}
              <div>
                <div style={{display:'inline-flex',alignItems:'center',gap:7,background:'rgba(0,180,216,.15)',border:'1px solid rgba(0,180,216,.3)',borderRadius:99,padding:'4px 12px',fontSize:'.74rem',fontWeight:700,color:'#00b4d8',marginBottom:12}}>
                  🔴 Live — Jobs · Exams · Information
                </div>
                {/* ✅ Smaller headline */}
                <h1 style={{fontFamily:'var(--font-sora),Sora,Arial Black,sans-serif',fontSize:'clamp(1.5rem,3.2vw,2.2rem)',fontWeight:800,color:'#fff',lineHeight:1.18,marginBottom:10}}>
                  {lang==='en' ? <>Assam Career Point<br/><span style={{color:'#00b4d8'}}>& Info</span></> : <>অসম কেৰিয়াৰ পইণ্ট<br/><span style={{color:'#00b4d8'}}>আৰু তথ্য</span></>}
                </h1>
                <p style={{color:'rgba(255,255,255,.7)',fontSize:'.92rem',marginBottom:18,lineHeight:1.65,maxWidth:420}}>
                  {lang==='en' ? 'Jobs · Exams · Information — updated daily for Assam & NE India' : 'চাকৰি · পৰীক্ষা · তথ্য — প্ৰতিদিন আপডেট'}
                </p>
                {/* CTA buttons */}
                <div className="hero-btns" style={{display:'flex',gap:9,flexWrap:'wrap' as const}}>
                  <Link href="/govt-jobs"   style={{display:'inline-flex',gap:6,alignItems:'center',padding:'10px 20px',borderRadius:99,background:'#e63946',color:'#fff',fontWeight:700,fontSize:'.88rem',textDecoration:'none'}}>🏛️ Govt Jobs</Link>
                  <Link href="/exams"       style={{display:'inline-flex',gap:6,alignItems:'center',padding:'10px 20px',borderRadius:99,background:'#f4a261',color:'#0d1b2a',fontWeight:700,fontSize:'.88rem',textDecoration:'none'}}>📚 Exams</Link>
                  <Link href="/information" style={{display:'inline-flex',gap:6,alignItems:'center',padding:'10px 20px',borderRadius:99,background:'transparent',color:'#fff',fontWeight:700,fontSize:'.88rem',border:'1.5px solid rgba(255,255,255,.28)',textDecoration:'none'}}>ℹ️ Info</Link>
                </div>
                {/* Stats row */}
                <div style={{display:'flex',gap:22,marginTop:16,flexWrap:'wrap' as const}}>
                  {STATS.map(({num,label})=>(
                    <div key={label}>
                      <div className="stat-num" style={{fontFamily:'var(--font-sora),Sora,sans-serif',fontWeight:800,fontSize:'1.2rem',color:'#00b4d8'}}>{num}</div>
                      <div style={{fontSize:'.72rem',color:'rgba(255,255,255,.45)',marginTop:1}}>{label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right — Latest Alerts (desktop only) */}
              <div className="alerts-box" style={{background:'rgba(255,255,255,.06)',border:'1.5px solid rgba(255,255,255,.1)',borderRadius:14,overflow:'hidden'}}>
                <div style={{padding:'10px 14px',borderBottom:'1px solid rgba(255,255,255,.08)',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                  <div style={{fontFamily:'var(--font-sora),Sora,sans-serif',fontWeight:700,fontSize:'.84rem',color:'rgba(255,255,255,.85)',display:'flex',alignItems:'center',gap:7}}>
                    <span style={{width:7,height:7,borderRadius:'50%',background:'#00b4d8',display:'inline-block',animation:'pulse 2s infinite'}}/>
                    Latest Alerts
                  </div>
                  <span style={{fontSize:'.62rem',color:'rgba(255,255,255,.45)',background:'rgba(255,255,255,.07)',padding:'2px 7px',borderRadius:99}}>hover to pause</span>
                </div>
                {alertItems.length > 0 ? (
                  <div className="alerts">
                    <div className="sc">
                      {[...alertItems,...alertItems].map((item,i)=>(
                        <Link key={i} href={item.href} style={{display:'block',padding:'9px 14px',borderBottom:'1px solid rgba(255,255,255,.05)',textDecoration:'none'}}>
                          <div style={{display:'flex',gap:9,alignItems:'center'}}>
                            <span style={{fontSize:'1rem',flexShrink:0}}>{item.icon}</span>
                            <div style={{flex:1,minWidth:0}}>
                              <div style={{fontSize:'.8rem',fontWeight:700,color:'#fff',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' as const}}>{item.title}</div>
                              <div style={{fontSize:'.69rem',color:item.subCl,fontWeight:700,marginTop:1}}>{item.sub}</div>
                            </div>
                            <span style={{background:item.tagBg,color:item.tagCl,fontSize:'.62rem',fontWeight:700,padding:'2px 6px',borderRadius:99,flexShrink:0}}>{item.tag}</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div style={{padding:'36px 20px',textAlign:'center' as const,color:'rgba(255,255,255,.25)',fontSize:'.8rem'}}>Add content from admin panel</div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ✅ BROWSE BY CATEGORY — rounded borders on each card */}
        <section style={{padding:'24px 0 18px'}}>
          <div style={{maxWidth:1180,margin:'0 auto',padding:'0 20px'}}>
            <h2 style={{fontFamily:'var(--font-sora),Sora,sans-serif',fontSize:'1.25rem',fontWeight:800,color:'#0d1b2a',marginBottom:4}}>Browse by Category</h2>
            <p style={{color:'#5a6a7a',fontSize:'.88rem',marginBottom:16}}>Jobs, exams, information and documents — all in one place</p>
            <div className="cg" style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:10}}>
              {CATS.map(c=>(
                <Link key={c.name} href={c.href} style={{textDecoration:'none'}}>
                  {/* ✅ cc class now has border + rounded corners */}
                  <div className="cc" style={{padding:'13px 14px',display:'flex',alignItems:'center',gap:10}}>
                    <div style={{width:40,height:40,borderRadius:9,background:`${c.color}15`,border:`1.5px solid ${c.color}30`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.25rem',flexShrink:0}}>{c.emoji}</div>
                    <div style={{minWidth:0}}>
                      <div style={{fontFamily:'var(--font-sora),Sora,sans-serif',fontWeight:700,fontSize:'.88rem',color:'#0d1b2a',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{c.name}</div>
                      <div style={{fontSize:'.73rem',color:c.color,fontWeight:700,marginTop:1}}>{c.count}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ✅ TABS — All Posts first, then individual types */}
        <section style={{padding:'4px 0 44px'}}>
          <div style={{maxWidth:1180,margin:'0 auto',padding:'0 20px'}}>
            <div style={{background:'#fff',borderRadius:14,border:'1.5px solid #d4e0ec',overflow:'hidden'}}>

              {/* Tab bar */}
              <div className="tab-scroll" style={{display:'flex',borderBottom:'1px solid #d4e0ec'}}>
                {tabs.map(({id,label})=>(
                  <button key={id} onClick={()=>setSec(id as any)} className={`stab ${sec===id?'on':'off'}`}>{label}</button>
                ))}
                <Link href={viewAllHref}
                  style={{marginLeft:'auto',padding:'9px 16px',fontSize:'.84rem',fontWeight:700,color:'#e63946',textDecoration:'none',display:'flex',alignItems:'center',whiteSpace:'nowrap' as const,flexShrink:0}}>
                  View All →
                </Link>
              </div>

              {/* ── ALL POSTS TAB ── */}
              {sec==='all' && (
                loading ? (
                  <div style={{padding:'18px'}}>
                    {[1,2,3,4].map(i=>(
                      <div key={i} style={{display:'flex',gap:12,padding:'13px 0',borderBottom:'1px solid #f0f4f8',alignItems:'center'}}>
                        <div style={{width:42,height:42,borderRadius:9,background:'#e8eef6',flexShrink:0}}/>
                        <div style={{flex:1}}>
                          <div style={{height:14,background:'#e8eef6',borderRadius:5,marginBottom:7,width:'65%'}}/>
                          <div style={{height:11,background:'#f0f4f8',borderRadius:5,width:'40%'}}/>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : allPosts.length === 0 ? (
                  <div style={{padding:'40px',textAlign:'center' as const,color:'#5a6a7a'}}>
                    <div style={{fontSize:'2rem',marginBottom:8}}>📋</div>
                    <div style={{fontWeight:700}}>No content yet — add from admin panel</div>
                  </div>
                ) : (
                  <div>
                    {allPosts.map((item, i) => (
                      <Link key={item.id} href={item.href} style={{textDecoration:'none'}}>
                        <div className="jr" style={{display:'flex',alignItems:'center',gap:12,padding:'13px 20px',borderBottom:i<allPosts.length-1?'1px solid #f0f4f8':'none',cursor:'pointer'}}>
                          <div style={{width:42,height:42,borderRadius:9,background:`${item.tagBg}18`,border:`1.5px solid ${item.tagBg}33`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.2rem',flexShrink:0}}>
                            {item.icon}
                          </div>
                          <div style={{flex:1,minWidth:0}}>
                            <div style={{fontFamily:'var(--font-sora),Sora,sans-serif',fontWeight:700,fontSize:'.92rem',color:'#1a1a2e',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' as const}}>
                              {item.title}
                            </div>
                            <div style={{fontSize:'.76rem',color:item.subCl,fontWeight:700,marginTop:2}}>{item.sub}</div>
                          </div>
                          {/* Type badge */}
                          <span style={{background:item.tagBg,color:item.tagCl,fontSize:'.65rem',fontWeight:700,padding:'3px 9px',borderRadius:99,flexShrink:0}}>
                            {item.tag}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )
              )}

              {/* ── JOBS TAB ── */}
              {sec==='jobs' && (
                loading ? (
                  <div style={{padding:'18px'}}>
                    {[1,2,3].map(i=>(
                      <div key={i} style={{display:'flex',gap:12,padding:'13px 0',borderBottom:'1px solid #f0f4f8',alignItems:'center'}}>
                        <div style={{width:42,height:42,borderRadius:9,background:'#e8eef6',flexShrink:0}}/>
                        <div style={{flex:1}}>
                          <div style={{height:14,background:'#e8eef6',borderRadius:5,marginBottom:7,width:'65%'}}/>
                          <div style={{height:11,background:'#f0f4f8',borderRadius:5,width:'40%'}}/>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : jobs.length === 0 ? (
                  <div style={{padding:'40px',textAlign:'center' as const,color:'#5a6a7a'}}>
                    <div style={{fontSize:'2rem',marginBottom:8}}>💼</div>
                    <div style={{fontWeight:700}}>No job vacancies yet</div>
                  </div>
                ) : jobs.map((j,i)=>{
                  const totalV = j.posts?.reduce((a,p)=>a+p.vacancy,0) || parseInt(j.vacancy||'0')
                  const d = days(j.lastDate)
                  return (
                    <Link key={j.id} href={`/jobs/${j.slug || j.id}`} style={{textDecoration:'none'}}>
                      <div className="jr" style={{display:'flex',alignItems:'center',gap:12,padding:'13px 20px',borderBottom:i<jobs.length-1?'1px solid #f0f4f8':'none',cursor:'pointer'}}>
                        <div style={{width:44,height:44,borderRadius:10,background:'linear-gradient(135deg,#e0f7fc,#b2ebf5)',border:'1.5px solid #d4e0ec',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.3rem',flexShrink:0}}>
                          {j.logo||'🏛️'}
                        </div>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{fontFamily:'var(--font-sora),Sora,sans-serif',fontWeight:700,fontSize:'.94rem',color:'#1a1a2e',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' as const}}>
                            {j.title||'Job Vacancy'}
                          </div>
                          <div style={{fontSize:'.78rem',color:'#5a6a7a',marginTop:2}}>{j.org||'—'} · {j.district}</div>
                          {j.description&&<div style={{fontSize:'.73rem',color:'#5a6a7a',marginTop:3,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' as const}}>{j.description}</div>}
                        </div>
                        <div className="job-badges" style={{display:'flex',gap:7,flexShrink:0,flexWrap:'wrap' as const,justifyContent:'flex-end'}}>
                          <span style={{background:'#fde8ea',color:'#e63946',padding:'4px 10px',borderRadius:99,fontSize:'.74rem',fontWeight:700}}>
                            {totalV>0?`${totalV.toLocaleString()} Posts`:'See Notification'}
                          </span>
                          <span style={{background:d<=7?'#fde8ea':'#f0f4f8',color:d<=7?'#e63946':'#5a6a7a',padding:'4px 10px',borderRadius:99,fontSize:'.74rem',fontWeight:700}}>
                            {d<=0?'⚠️ Expired':d<=7?`⚡ ${d}d left`:`📅 ${fmt(j.lastDate)}`}
                          </span>
                        </div>
                      </div>
                    </Link>
                  )
                })
              )}

              {/* ── EXAMS TAB ── */}
              {sec==='exams' && (
                exams.length === 0 ? (
                  <div style={{padding:'40px',textAlign:'center' as const,color:'#5a6a7a'}}>
                    <div style={{fontSize:'2rem',marginBottom:8}}>📚</div><div style={{fontWeight:700}}>No exams yet</div>
                  </div>
                ) : (
                  <div style={{padding:'14px 18px'}}>
                    <div className="exam-grid">
                      {exams.map(ex=>(
                        <Link key={ex.id} href={`/exams/${ex.slug || ex.id}`} style={{textDecoration:'none'}}>
                          <div className="ec">
                            <div style={{display:'flex',gap:10,marginBottom:9}}>
                              <div style={{width:40,height:40,borderRadius:9,background:'#fff3e0',border:'1.5px solid #ffe0b2',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.2rem',flexShrink:0}}>{ex.emoji}</div>
                              <div>
                                <div style={{fontFamily:'var(--font-sora),Sora,sans-serif',fontWeight:700,fontSize:'.88rem',color:'#1a1a2e',lineHeight:1.3}}>{ex.title||'Exam'}</div>
                                <div style={{fontSize:'.75rem',color:'#5a6a7a',marginTop:2}}>{ex.conductedBy}</div>
                              </div>
                            </div>
                            <div style={{background:'#f8fbff',borderRadius:8,padding:'8px 10px',fontSize:'.78rem',display:'flex',flexDirection:'column' as const,gap:4}}>
                              <div style={{display:'flex',justifyContent:'space-between'}}><span style={{color:'#5a6a7a'}}>📝 Apply by:</span><strong style={{color:'#e63946'}}>{fmt(ex.applicationLastDate)}</strong></div>
                              <div style={{display:'flex',justifyContent:'space-between'}}><span style={{color:'#5a6a7a'}}>📅 Exam:</span><strong style={{color:'#0d1b2a'}}>{fmt(ex.examDate)}</strong></div>
                              {ex.examTime&&<div style={{fontSize:'.72rem',color:'#5a6a7a'}}>⏰ {ex.examTime}</div>}
                            </div>
                            <div style={{marginTop:8,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                              <span style={{fontSize:'.72rem',background:'#e8f5e9',color:'#2e7d32',padding:'2px 9px',borderRadius:99,fontWeight:700}}>{ex.status}</span>
                              <span style={{fontSize:'.75rem',color:'#0096b7',fontWeight:700}}>Details →</span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )
              )}

              {/* ── INFO TAB ── */}
              {sec==='info' && (
                info.length === 0 ? (
                  <div style={{padding:'40px',textAlign:'center' as const,color:'#5a6a7a'}}>
                    <div style={{fontSize:'2rem',marginBottom:8}}>ℹ️</div><div style={{fontWeight:700}}>No information yet</div>
                  </div>
                ) : (
                  <div style={{padding:'14px 18px'}}>
                    <div className="info-grid">
                      {info.map(item=>(
                        <Link key={item.id} href={`/information/${item.slug || item.id}`} style={{textDecoration:'none'}}>
                          <div className="ic">
                            <div style={{display:'flex',gap:10,marginBottom:9}}>
                              <div style={{width:40,height:40,borderRadius:9,background:'#e8f5e9',border:'1.5px solid #a5d6a7',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.2rem',flexShrink:0}}>{item.emoji}</div>
                              <div>
                                <div style={{fontFamily:'var(--font-sora),Sora,sans-serif',fontWeight:700,fontSize:'.88rem',color:'#1a1a2e',lineHeight:1.3}}>{item.title||'Info'}</div>
                                <span style={{fontSize:'.72rem',background:'#e0f7fc',color:'#0096b7',padding:'1px 7px',borderRadius:99,fontWeight:700}}>{item.category}</span>
                              </div>
                            </div>
                            <p style={{fontSize:'.83rem',color:'#5a6a7a',lineHeight:1.6,marginBottom:9}}>{(item.description||'').slice(0,90)}{(item.description||'').length>90?'…':''}</p>
                            {item.importantDates?.length>0&&(
                              <div style={{background:'#fde8ea',borderRadius:7,padding:'7px 10px',fontSize:'.76rem'}}>
                                {item.importantDates.slice(0,1).map((d,idx)=>(
                                  <div key={idx} style={{display:'flex',justifyContent:'space-between'}}>
                                    <span style={{color:'#5a6a7a'}}>{d.label}:</span>
                                    <strong style={{color:'#e63946'}}>{fmt(d.date)}</strong>
                                  </div>
                                ))}
                              </div>
                            )}
                            <div style={{marginTop:7,textAlign:'right' as const,fontSize:'.75rem',color:'#0096b7',fontWeight:700}}>Read More →</div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )
              )}

              {/* ── RESULTS TAB ── */}
              {sec==='results' && (
                <div style={{padding:'14px 18px'}}>
                  <div className="res-grid">
                    {results.map(r=>(
                      <Link key={r.id} href={`/results/${r.slug || r.id}`} className="rc">
                        <div style={{width:40,height:40,borderRadius:9,background:'#e0f7fc',border:'1.5px solid #b2ebf5',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.2rem',flexShrink:0}}>{r.emoji||'📊'}</div>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{fontFamily:'var(--font-sora),Sora,sans-serif',fontWeight:700,fontSize:'.86rem',color:'#1a1a2e',lineHeight:1.3}}>{r.title||'Result'}</div>
                          <div style={{fontSize:'.73rem',color:'#5a6a7a',marginTop:2}}>{r.org||'—'}{r.resultDate?` · ${fmt(r.resultDate)}`:''}</div>
                        </div>
                        <span style={{fontSize:'.73rem',color:'#0096b7',fontWeight:700,flexShrink:0}}>View →</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* ── ANNOUNCEMENTS TAB ── */}
              {sec==='announcements' && (
                <div style={{padding:'14px 18px',display:'flex',flexDirection:'column' as const,gap:9}}>
                  {announcements.map(a=>(
                    <Link key={a.id} href={`/announcements/${a.slug || a.id}`} style={{textDecoration:'none'}}>
                      <div style={{background:'#f8fbff',border:'1.5px solid #d4e0ec',borderRadius:11,padding:'13px 15px',display:'flex',gap:11,alignItems:'center',transition:'.15s'}}>
                        <div style={{width:38,height:38,borderRadius:9,background:'#fde8ea',border:'1.5px solid #f7bcc0',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.1rem',flexShrink:0}}>{a.emoji||'📢'}</div>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{fontFamily:'var(--font-sora),Sora,sans-serif',fontWeight:700,fontSize:'.86rem',color:'#1a1a2e',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' as const}}>{a.title||'Announcement'}</div>
                          <div style={{fontSize:'.72rem',color:'#5a6a7a',marginTop:2}}>
                            {a.category&&<span style={{background:'#fde8ea',color:'#e63946',padding:'1px 7px',borderRadius:99,fontWeight:700,marginRight:5}}>{a.category}</span>}
                            {new Date(a.createdAt).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'})}
                          </div>
                        </div>
                        <span style={{fontSize:'.73rem',color:'#0096b7',fontWeight:700,flexShrink:0}}>Read →</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* ── SERVICES TAB ── */}
              {sec==='services' && (
                services.length === 0 ? (
                  <div style={{padding:'40px',textAlign:'center' as const,color:'#5a6a7a'}}><div style={{fontSize:'2rem',marginBottom:8}}>🏛️</div><div style={{fontWeight:700}}>No services yet</div></div>
                ) : (
                  <div style={{padding:'14px 18px',display:'flex',flexDirection:'column' as const,gap:9}}>
                    {services.map(s=>(
                      <Link key={s.id} href={`/services/${s.slug || s.id}`} style={{textDecoration:'none'}}>
                        <div style={{background:'#f8fbff',border:'1.5px solid #d4e0ec',borderRadius:11,padding:'13px 15px',display:'flex',gap:11,alignItems:'center',transition:'.15s'}}>
                          <div style={{width:38,height:38,borderRadius:9,background:'#f3e5f5',border:'1.5px solid #ce93d8',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.1rem',flexShrink:0}}>{s.emoji||'⚙️'}</div>
                          <div style={{flex:1,minWidth:0}}>
                            <div style={{fontFamily:'var(--font-sora),Sora,sans-serif',fontWeight:700,fontSize:'.86rem',color:'#1a1a2e',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' as const}}>{s.title||'Service'}</div>
                            {s.description&&<div style={{fontSize:'.73rem',color:'#5a6a7a',marginTop:2,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' as const}}>{s.description}</div>}
                          </div>
                          <span style={{fontSize:'.73rem',color:'#8e44ad',fontWeight:700,flexShrink:0}}>View →</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )
              )}

              {/* ── GUIDES TAB ── */}
              {sec==='guides' && (
                guides.length === 0 ? (
                  <div style={{padding:'40px',textAlign:'center' as const,color:'#5a6a7a'}}><div style={{fontSize:'2rem',marginBottom:8}}>📖</div><div style={{fontWeight:700}}>No guides yet</div></div>
                ) : (
                  <div style={{padding:'14px 18px',display:'flex',flexDirection:'column' as const,gap:9}}>
                    {guides.map(g=>(
                      <Link key={g.id} href={`/guides/${g.slug || g.id}`} style={{textDecoration:'none'}}>
                        <div style={{background:'#f8fbff',border:'1.5px solid #d4e0ec',borderRadius:11,padding:'13px 15px',display:'flex',gap:11,alignItems:'center',transition:'.15s'}}>
                          <div style={{width:38,height:38,borderRadius:9,background:'#e0f7fc',border:'1.5px solid #b2ebf5',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.1rem',flexShrink:0}}>{g.emoji||'📖'}</div>
                          <div style={{flex:1,minWidth:0}}>
                            <div style={{fontFamily:'var(--font-sora),Sora,sans-serif',fontWeight:700,fontSize:'.86rem',color:'#1a1a2e',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' as const}}>{g.title||'Guide'}</div>
                            {g.description&&<div style={{fontSize:'.73rem',color:'#5a6a7a',marginTop:2,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' as const}}>{g.description}</div>}
                          </div>
                          <span style={{fontSize:'.73rem',color:'#0096b7',fontWeight:700,flexShrink:0}}>Read →</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )
              )}

            </div>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer style={{background:'#0d1b2a',padding:'26px 0 16px'}}>
        <div style={{maxWidth:1180,margin:'0 auto',padding:'0 20px'}}>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',gap:22,marginBottom:20}}>
            <div>
              <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:10}}>
                <Logo size={34}/>
                <div style={{fontFamily:'Arial Black,sans-serif',fontWeight:900,fontSize:'.76rem'}}>
                  <span style={{color:G}}>ASSAM </span><span style={{color:W}}>CAREER </span><span style={{color:T}}>POINT</span>
                </div>
              </div>
              <p style={{fontSize:'.75rem',color:'rgba(255,255,255,.55)',lineHeight:1.7,margin:0}}>Your trusted source for jobs, exams, and important information in Assam & NE India.</p>
            </div>
            {[
              ['Quick Links',[['Govt Jobs','/govt-jobs'],['Exams','/exams'],['Information','/information'],['PDF Forms','/pdf-forms']]],
              ['More',[['Results','/results'],['Announcements','/announcements'],['Guides','/guides'],['Services','/services']]],
              ['Legal & Info',[['About Us','/about-us'],['Contact Us','/contact'],['Privacy Policy','/privacy-policy'],['Affiliate','/affiliate']]],
            ].map(([title,links])=>(
              <div key={title as string}>
                <h3 style={{fontFamily:'var(--font-sora),Sora,sans-serif',fontWeight:700,fontSize:'.76rem',color:'rgba(255,255,255,.55)',marginBottom:9,textTransform:'uppercase' as const,letterSpacing:'.06em'}}>{title as string}</h3>
                {(links as [string,string][]).map(([l,h])=>(
                  <div key={l}><Link href={h} style={{fontSize:'.84rem',color:'rgba(255,255,255,.7)',textDecoration:'none',display:'inline-block',padding:'8px 4px',minHeight:'40px',lineHeight:'1.4'}}>{l}</Link></div>
                ))}
              </div>
            ))}
          </div>
          <div style={{borderTop:'1px solid rgba(255,255,255,.07)',paddingTop:12,display:'flex',justifyContent:'space-between',flexWrap:'wrap' as const,gap:8,fontSize:'.72rem',color:'rgba(255,255,255,.45)'}}>
            <div>© 2025–2026 Assam Career Point & Info. Informational portal only — verify from official sources.</div>
            <div style={{display:'flex',gap:10,flexWrap:'wrap' as const}}>
              {[['Privacy Policy','/privacy-policy'],['About Us','/about-us'],['Contact','/contact'],['Affiliate','/affiliate']].map(([l,h])=>(
                <Link key={h} href={h} style={{color:'#d4aa2f',textDecoration:'none',fontWeight:700,padding:'6px 4px',display:'inline-block'}}>{l}</Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
