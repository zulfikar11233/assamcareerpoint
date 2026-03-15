'use client'
// src/app/page.tsx — Assam Career Point & Info (ACPI) Homepage
// ✅ Mobile friendly: hamburger menu, responsive grids, touch targets
// ✅ SEO: handled in src/app/layout.tsx (metadata export)

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

type Job  = { id:number; logo:string; title:string; org:string; category:string; district:string; status:string; vacancy:string; lastDate:string; posts?:{vacancy:number}[] }
type Exam = { id:number; emoji:string; title:string; conductedBy:string; category:string; applicationLastDate:string; paymentLastDate:string; examDate:string; examTime:string; status:string }
type Info = { id:number; emoji:string; title:string; category:string; description:string; lastDate?:string; status:string; importantDates:{label:string;date:string;time?:string}[] }

const DEF_JOBS: Job[] = [
  {id:1,logo:'👮',title:'Assam Police Recruitment 2026 – SI, Constable, Driver & Other Posts',org:'SLPRB Assam',category:'Govt Job',district:'All Districts',status:'Live',vacancy:'5734',lastDate:'2026-03-25'},
  {id:2,logo:'🌲',title:'BT Kokrajhar Forest Guard & Forest Protection Force 2026',org:'BT, Kokrajhar',category:'Govt Job',district:'Kokrajhar',status:'Live',vacancy:'157',lastDate:'2026-03-15'},
  {id:3,logo:'🚂',title:'RRB Group D Recruitment 2026 – 22195 Posts All India',org:'Railway Recruitment Board',category:'Central Govt',district:'All India',status:'Closing',vacancy:'22195',lastDate:'2026-03-10'},
  {id:4,logo:'🏦',title:'SBI Clerk 2026 – Junior Associates 13735 Posts',org:'State Bank of India',category:'Banking',district:'All India',status:'Live',vacancy:'13735',lastDate:'2026-04-10'},
  {id:5,logo:'🎓',title:'NVS Teaching & Non-Teaching Recruitment 2026',org:'Navodaya Vidyalaya Samiti',category:'Teaching',district:'All India',status:'Live',vacancy:'2500',lastDate:'2026-04-05'},
]
const DEF_EXAMS: Exam[] = [
  {id:1,emoji:'📚',title:'CTET 2026 — Central Teacher Eligibility Test',conductedBy:'CBSE',category:'Teaching',applicationLastDate:'2026-03-15',paymentLastDate:'2026-03-17',examDate:'2026-05-22',examTime:'9:30 AM – 12:00 PM',status:'Registration Open'},
  {id:2,emoji:'🏥',title:'NEET UG 2026 – Medical Entrance',conductedBy:'NTA',category:'Medical',applicationLastDate:'2026-03-31',paymentLastDate:'2026-04-01',examDate:'2026-05-04',examTime:'2:00 PM – 5:20 PM',status:'Registration Open'},
  {id:3,emoji:'⚙️',title:'JEE Main 2026 – Session 2',conductedBy:'NTA',category:'Engineering',applicationLastDate:'2026-03-20',paymentLastDate:'2026-03-21',examDate:'2026-04-02',examTime:'9:00 AM – 12:00 PM',status:'Registration Open'},
  {id:4,emoji:'🎓',title:'UPSC CSE 2026 – Civil Services Prelims',conductedBy:'UPSC',category:'Civil Services',applicationLastDate:'2026-03-18',paymentLastDate:'2026-03-19',examDate:'2026-06-01',examTime:'9:30 AM – 11:30 AM',status:'Upcoming'},
]
const DEF_INFO: Info[] = [
  {id:1,emoji:'🗳️',title:'Voter ID Registration / Correction 2026',category:'Electoral',description:'Register as a new voter or correct existing voter ID details via Form 6/6A/8 online.',lastDate:'2026-04-30',status:'Active',importantDates:[{label:'Last Date to Apply',date:'2026-04-30',time:'11:59 PM'}]},
  {id:2,emoji:'🔗',title:'PAN–Aadhaar Linking Deadline 2026',category:'ID & Documents',description:'Link PAN with Aadhaar to avoid PAN becoming inoperative. ₹1,000 penalty applies.',lastDate:'2026-06-30',status:'Active',importantDates:[{label:'Final Deadline',date:'2026-06-30',time:'11:59 PM'}]},
  {id:3,emoji:'💊',title:'Ayushman Bharat PM-JAY — Free Health Cover ₹5 Lakh',category:'Government Scheme',description:'Free health insurance up to ₹5 lakh per year for eligible families under PM-JAY scheme.',status:'Active',importantDates:[]},
  {id:4,emoji:'📱',title:'Free Mobile Scheme Assam — Eligibility & Process',category:'Government Scheme',description:'Free smartphones for eligible women and students under Assam government scheme.',status:'Active',importantDates:[{label:'Apply by',date:'2026-05-31'}]},
]

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

const TICKER_ITEMS = [
  '👮 Assam Police 5,734 Posts — Last Date 25 Mar',
  '📚 CTET 2026 Registration Open — Apply by 15 Mar',
  '🏥 NEET UG 2026 — Exam on 04 May at 2:00 PM',
  '🔗 PAN–Aadhaar Link Deadline — 30 Jun 2026',
  '🗳️ Voter ID Registration Open — Last Date 30 Apr',
  '🚂 RRB Group D — 22,195 Posts Closing Soon',
  '🏦 SBI Clerk 2026 — 13,735 Posts Open',
]

const NAV_LINKS = [
  ['Home','/'],['Govt Jobs','/govt-jobs'],['Exams','/exams'],
  ['Information','/information'],['PDF Forms','/pdf-forms'],['Results','/results'],
]

const fmt  = (d:string) => { try { return new Date(d).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'}) } catch { return d } }
const days = (d:string) => Math.ceil((new Date(d).getTime()-Date.now())/86400000)

function fmtCount(n:number):string {
  if (n === 0) return '0'
  if (n >= 100) return `${Math.floor(n/100)*100}+`
  return `${n}+`
}

export default function HomePage() {
  const [lang,      setLang]      = useState<'en'|'as'>('en')
  const [jobs,      setJobs]      = useState<Job[]>(DEF_JOBS)
  const [exams,     setExams]     = useState<Exam[]>(DEF_EXAMS)
  const [info,      setInfo]      = useState<Info[]>(DEF_INFO)
  const [sec,       setSec]       = useState<'jobs'|'exams'|'info'>('jobs')
  const [menuOpen,  setMenuOpen]  = useState(false)   // ← mobile hamburger
  const [totalJobs,  setTotalJobs]  = useState(0)
  const [totalExams, setTotalExams] = useState(0)
  const [totalInfo,  setTotalInfo]  = useState(0)

  useEffect(() => {
    try {
      const sj = localStorage.getItem('acp_jobs_v6')
      if (sj) { const a:Job[]=JSON.parse(sj); setTotalJobs(a.length); const l=a.filter(j=>j.status==='Live'); if(l.length) setJobs(l.slice(0,8)) } else setTotalJobs(DEF_JOBS.length)
      const se = localStorage.getItem('acp_exams_v6')
      if (se) { const a:Exam[]=JSON.parse(se); setTotalExams(a.length); if(a.length) setExams(a.slice(0,6)) } else setTotalExams(DEF_EXAMS.length)
      const si = localStorage.getItem('acp_info_v6')
      if (si) { const a:Info[]=JSON.parse(si); setTotalInfo(a.length); const ac=a.filter(i=>i.status==='Active'); if(ac.length) setInfo(ac.slice(0,6)) } else setTotalInfo(DEF_INFO.length)
    } catch {}
  }, [])

  // Close mobile menu when user clicks a link
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

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        html, body { overflow-x: hidden; max-width: 100vw; margin: 0; font-family: Nunito, sans-serif; background: #f0f4f8; color: #1a1a2e; }
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800&family=Nunito:wght@400;600;700&display=swap');

        @keyframes ticker { 0%{transform:translateX(100%)} 100%{transform:translateX(-100%)} }
        @keyframes scroll  { 0%{transform:translateY(0)} 100%{transform:translateY(-50%)} }
        @keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:.4} }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:none} }
        @keyframes slideDown { from{opacity:0;transform:translateY(-10px)} to{opacity:1;transform:none} }

        .tk  { animation: ticker 32s linear infinite; white-space:nowrap; }
        .sc  { animation: scroll 22s linear infinite; }
        .sc:hover { animation-play-state:paused; }
        .alerts { height:310px; overflow:hidden; }
        .nav a:hover { color:#fff !important; }
        .cc  { transition:.2s; } .cc:hover { transform:translateY(-3px); box-shadow:0 8px 24px rgba(0,0,0,.1); }
        .jr:hover { background:#f8fbff !important; }
        .stab { padding:11px 22px;border:none;font-family:Nunito,sans-serif;font-weight:700;font-size:.92rem;cursor:pointer;transition:.15s;background:none; }
        .stab.on  { color:#e63946; border-bottom:3px solid #e63946; }
        .stab.off { color:#5a6a7a; border-bottom:3px solid transparent; }
        .ec { background:#fff;border:1.5px solid #d4e0ec;border-radius:13px;padding:15px 17px;transition:.2s; }
        .ec:hover { transform:translateY(-3px);box-shadow:0 8px 28px rgba(0,0,0,.1); }
        .ic { background:#fff;border:1.5px solid #d4e0ec;border-radius:13px;padding:15px 17px;transition:.2s; }
        .ic:hover { transform:translateY(-3px);box-shadow:0 8px 28px rgba(0,0,0,.1); }
        .mob-menu { animation: slideDown .2s ease; }
        .mob-nav-link { display:block;padding:13px 20px;color:rgba(255,255,255,.85);font-size:1rem;font-weight:600;text-decoration:none;border-bottom:1px solid rgba(255,255,255,.07);font-family:Nunito,sans-serif; }
        .mob-nav-link:hover { background:rgba(255,255,255,.06); }

        /* ── Desktop nav hidden on mobile ── */
        .desk-nav { display:flex; }
        .desk-lang { display:flex; }
        .ham-btn  { display:none; }

        /* ── Exam/info grid: 1 column on small screens ── */
        .exam-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(300px,1fr)); gap:14px; }
        .info-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(290px,1fr)); gap:14px; }

        @media(max-width:900px) {
          /* Hero: single column, hide alerts box */
          .hg { grid-template-columns:1fr !important; }
          .alerts-box { display:none !important; }

          /* Categories: 2 columns */
          .cg { grid-template-columns:repeat(2,1fr) !important; }

          /* Exam/info: 1 column on mobile */
          .exam-grid { grid-template-columns:1fr !important; }
          .info-grid { grid-template-columns:1fr !important; }

          /* Hide desktop nav, show hamburger */
          .desk-nav  { display:none !important; }
          .desk-lang { display:none !important; }
          .ham-btn   { display:flex !important; }

          /* Job badges: stack on very small screens */
          .job-badges { flex-direction:column; align-items:flex-end; }

          /* Hero padding reduced on mobile */
          .hero-section { padding:32px 0 28px !important; }
        }

        @media(max-width:480px) {
          /* Categories: 2 columns still fine */
          .cg { grid-template-columns:repeat(2,1fr) !important; }
          /* Slightly smaller stats on tiny screens */
          .stat-num { font-size:1.1rem !important; }
        }
      `}</style>

      {/* TICKER */}
      <div style={{ background:'#e63946',padding:'5px 0',overflow:'hidden' }}>
        <div className="tk" style={{ display:'inline-flex',gap:48,color:'#fff',fontSize:'.82rem',fontWeight:700 }}>
          {[...TICKER_ITEMS,...TICKER_ITEMS].map((t,i)=><span key={i}>• {t}</span>)}
        </div>
      </div>

      {/* HEADER */}
      <header style={{ background:'#0d1b2a',position:'sticky',top:0,zIndex:200,boxShadow:'0 2px 20px rgba(0,0,0,.28)' }}>
        <div style={{ maxWidth:1180,margin:'0 auto',padding:'11px 20px',display:'flex',alignItems:'center',justifyContent:'space-between',gap:14 }}>

          {/* Logo */}
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

          {/* Desktop nav */}
          <nav className="desk-nav" style={{ gap:2 }}>
            {NAV_LINKS.map(([l,h])=>(
              <Link key={h} href={h} style={{ color:'rgba(255,255,255,.7)',fontSize:'.86rem',fontWeight:600,padding:'7px 11px',borderRadius:8,textDecoration:'none',whiteSpace:'nowrap' }}>{l}</Link>
            ))}
          </nav>

          {/* Desktop language switcher */}
          <div className="desk-lang" style={{ gap:11,alignItems:'center',flexShrink:0 }}>
            <div style={{ display:'flex',background:'rgba(255,255,255,.1)',borderRadius:99,padding:3 }}>
              {(['en','as'] as const).map(l=>(
                <button key={l} onClick={()=>setLang(l)} style={{ padding:'5px 10px',borderRadius:99,fontSize:'.73rem',fontWeight:700,background:lang===l?'#00b4d8':'transparent',color:lang===l?'#fff':'rgba(255,255,255,.5)',border:'none',cursor:'pointer',fontFamily:'Nunito,sans-serif' }}>
                  {l==='en'?'EN':'অস'}
                </button>
              ))}
            </div>
          </div>

          {/* ── Hamburger button — mobile only ── */}
          <button
            className="ham-btn"
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Open navigation menu"
            style={{ alignItems:'center',justifyContent:'center',width:42,height:42,borderRadius:9,background:'rgba(255,255,255,.1)',border:'none',cursor:'pointer',flexDirection:'column',gap:5,padding:10,flexShrink:0 }}
          >
            <span style={{ display:'block',width:22,height:2,background:menuOpen?G:W,borderRadius:2,transition:'.2s',transform:menuOpen?'rotate(45deg) translate(5px,5px)':'none' }}/>
            <span style={{ display:'block',width:22,height:2,background:W,borderRadius:2,transition:'.2s',opacity:menuOpen?0:1 }}/>
            <span style={{ display:'block',width:22,height:2,background:menuOpen?G:W,borderRadius:2,transition:'.2s',transform:menuOpen?'rotate(-45deg) translate(5px,-5px)':'none' }}/>
          </button>
        </div>

        {/* ── Mobile dropdown menu ── */}
        {menuOpen && (
          <div className="mob-menu" style={{ background:'#0d1b2a',borderTop:'1px solid rgba(255,255,255,.1)',paddingBottom:8 }}>
            {NAV_LINKS.map(([l,h])=>(
              <Link key={h} href={h} className="mob-nav-link" onClick={closeMenu}>{l}</Link>
            ))}
            {/* Language switcher in mobile menu */}
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

            {/* Left */}
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

            {/* Right: Alerts box — hidden on mobile via CSS class */}
            <div className="alerts-box" style={{ background:'rgba(255,255,255,.06)',border:'1.5px solid rgba(255,255,255,.1)',borderRadius:16,overflow:'hidden' }}>
              <div style={{ padding:'11px 16px',borderBottom:'1px solid rgba(255,255,255,.08)',display:'flex',alignItems:'center',justifyContent:'space-between' }}>
                <div style={{ fontFamily:"'Sora',sans-serif",fontWeight:700,fontSize:'.86rem',color:'rgba(255,255,255,.85)',display:'flex',alignItems:'center',gap:7 }}>
                  <span style={{ width:7,height:7,borderRadius:'50%',background:'#00b4d8',display:'inline-block',animation:'pulse 2s infinite' }} />
                  Latest Alerts
                </div>
                <span style={{ fontSize:'.66rem',color:'rgba(255,255,255,.3)',background:'rgba(255,255,255,.07)',padding:'2px 7px',borderRadius:99 }}>hover to pause</span>
              </div>
              <div className="alerts">
                <div className="sc">
                  {[...jobs.slice(0,5),...exams.slice(0,3),...info.slice(0,3),...jobs.slice(0,5),...exams.slice(0,3),...info.slice(0,3)].map((item,i) => {
                    const isJob  = 'org' in item
                    const isExam = 'examDate' in item && !('org' in item)
                    const tag    = isJob?'JOB':isExam?'EXAM':'INFO'
                    const tagBg  = isJob?'#e63946':isExam?'#f4a261':'#2a9d8f'
                    const tagCl  = isJob?'#fff':isExam?'#0d1b2a':'#fff'
                    const href   = isJob?`/jobs/${item.id}`:isExam?`/exams/${item.id}`:`/information/${item.id}`
                    const sub    = isJob?`${(item as Job).vacancy} posts`:isExam?`Exam: ${fmt((item as Exam).examDate)}`:((item as Info).lastDate?`Deadline: ${fmt((item as Info).lastDate!)}`:'Active')
                    const subCl  = isJob?'#e63946':isExam?'#f4a261':'#2a9d8f'
                    return (
                      <Link key={i} href={href} style={{ display:'block',padding:'10px 16px',borderBottom:'1px solid rgba(255,255,255,.05)',textDecoration:'none' }}>
                        <div style={{ display:'flex',gap:9,alignItems:'center' }}>
                          <span style={{ fontSize:'1.1rem',flexShrink:0 }}>{(item as Job).logo||(item as Exam|Info).emoji}</span>
                          <div style={{ flex:1,minWidth:0 }}>
                            <div style={{ fontSize:'.82rem',fontWeight:700,color:'#fff',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' as const }}>{item.title}</div>
                            <div style={{ fontSize:'.71rem',color:subCl,fontWeight:700,marginTop:2 }}>{sub}</div>
                          </div>
                          <span style={{ background:tagBg,color:tagCl,fontSize:'.64rem',fontWeight:700,padding:'2px 6px',borderRadius:99,flexShrink:0 }}>{tag}</span>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
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
              {([['jobs','💼 Latest Jobs'],['exams','📚 Exams'],['info','ℹ️ Information']] as const).map(([id,lbl])=>(
                <button key={id} onClick={()=>setSec(id)} className={`stab ${sec===id?'on':'off'}`}>{lbl}</button>
              ))}
              <Link href={sec==='jobs'?'/govt-jobs':sec==='exams'?'/exams':'/information'} style={{ marginLeft:'auto',padding:'10px 18px',fontSize:'.86rem',fontWeight:700,color:'#e63946',textDecoration:'none',display:'flex',alignItems:'center',whiteSpace:'nowrap' as const }}>View All →</Link>
            </div>

            {/* JOBS */}
            {sec==='jobs' && jobs.map((j,i)=>{
              const totalV = j.posts?.reduce((a,p)=>a+p.vacancy,0) || parseInt(j.vacancy||'0')
              const d = days(j.lastDate)
              return (
                <Link key={j.id} href={`/jobs/${j.id}`} style={{ textDecoration:'none' }}>
                  <div className="jr" style={{ display:'flex',alignItems:'center',gap:14,padding:'15px 22px',borderBottom:i<jobs.length-1?'1px solid #f0f4f8':'none',cursor:'pointer' }}>
                    <div style={{ width:46,height:46,borderRadius:10,background:'linear-gradient(135deg,#e0f7fc,#b2ebf5)',border:'1.5px solid #d4e0ec',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.35rem',flexShrink:0 }}>{j.logo}</div>
                    <div style={{ flex:1,minWidth:0 }}>
                      <div style={{ fontFamily:"'Sora',sans-serif",fontWeight:700,fontSize:'.97rem',color:'#1a1a2e',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' as const }}>{j.title}</div>
                      <div style={{ fontSize:'.80rem',color:'#5a6a7a',marginTop:3 }}>{j.org} · {j.district}</div>
                    </div>
                    <div className="job-badges" style={{ display:'flex',gap:7,flexShrink:0,flexWrap:'wrap' as const,justifyContent:'flex-end' }}>
                      <span style={{ background:'#fde8ea',color:'#e63946',padding:'4px 11px',borderRadius:99,fontSize:'.77rem',fontWeight:700 }}>{totalV.toLocaleString()} Posts</span>
                      <span style={{ background:d<=7?'#fde8ea':'#f0f4f8',color:d<=7?'#e63946':'#5a6a7a',padding:'4px 11px',borderRadius:99,fontSize:'.77rem',fontWeight:700,whiteSpace:'nowrap' as const }}>
                        {d<=0?'⚠️ Expired':d<=7?`⚡ ${d}d left`:`📅 ${fmt(j.lastDate)}`}
                      </span>
                    </div>
                  </div>
                </Link>
              )
            })}

            {/* EXAMS */}
            {sec==='exams' && (
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
            )}

            {/* INFO */}
            {sec==='info' && (
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
              ['Study Resources 🤝',[['Exam Prep Courses','/affiliate'],['Best Books','/affiliate'],['Current Affairs','/affiliate'],['All Resources','/affiliate']]],
              ['Legal & Info',[['About Us','/about-us'],['Contact Us','/contact'],['Privacy Policy','/privacy-policy'],['Affiliate Disclosure','/affiliate']]],
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
