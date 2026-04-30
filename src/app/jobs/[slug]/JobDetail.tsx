'use client'
// src/app/jobs/[slug]/JobDetail.tsx
import Link from 'next/link'
import { getTargetDate } from '@/lib/dataHelper'
import { useState, useEffect } from 'react'

const G = '#c9a227', T = '#1dbfad', N = '#0b1f33', W = '#ffffff'

type JobAffiliate = { id:string; title:string; link:string; img:string; badge:string }
type Post    = { id:string; name:string; dept:string; vacancy:number; qualification:string; ageMin:number; ageMax:number; salary:string; lastDate:string; applyLink:string }
type AdvPdf  = { name:string; url:string; size?:string; label?:string; type?:string }
type DateExt = { date:string; note:string; extendedOn:string }
type Job     = {
  id:number; slug?: string; logo:string; title:string; org:string; category:string
  district:string; status:string; vacancy:string; qualification:string; ageLimit:string
  salary:string; lastDate:string; applyLink:string
  posts?:Post[]; advPdfs?:AdvPdf[]; dateHistory?:DateExt[]
  fee?:string; selection?:string; website?:string
  howToApply?:string; youtubeLink?:string; createdAt?:string
  description?:string; advtNo?:string; ageLimitDate?:string; ageRelaxation?:string
  feeRefund?:string; lastDateTime?:string; paymentLastDate?:string; paymentLastDateTime?:string
  correctionWindow?:string; applicationStart?:string
  helplineEmail?:string; helplinePhone?:string; selectionDetails?:string
  syllabusDetails?:string; zoneWiseVacancy?:string
  ageBirthRange?:string
  jobAffiliates?:JobAffiliate[]
  titleAs?:string; orgAs?:string; descriptionAs?:string; howToApplyAs?:string; selectionAs?:string
  howToApplyImages?:string[]
  detailsImages?:string[]
}

// ─────────────────────────────────────────────────────────────
// RichContent helper – renders HTML from TinyMCE or plain text
// ─────────────────────────────────────────────────────────────
function RichContent({ content, className, style }: { content?: string | null; className?: string; style?: React.CSSProperties }) {
  if (!content) return null
  const isHtml = /<[a-z][\s\S]*>/i.test(content)
  if (isHtml) {
    return <div className={className} style={style} dangerouslySetInnerHTML={{ __html: content }} />
  }
  // Legacy plain text – preserve line breaks
  return (
    <div className={className} style={style}>
      {content.split('\n').map((line, i) => <p key={i} style={{ margin: '4px 0' }}>{line}</p>)}
    </div>
  )
}

const fmt     = (d:string|undefined|null) => { if(!d) return '—'; try { return new Date(d).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'}) } catch { return d } }
const fmtLong = (d:string|undefined|null) => { if(!d) return '—'; try { return new Date(d).toLocaleDateString('en-IN',{day:'2-digit',month:'long',year:'numeric'}) } catch { return d } }

function driveId(url: string): string {
  if (!url) return ''
  const m = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || url.match(/[?&]id=([a-zA-Z0-9_-]+)/)
  return m ? m[1] : ''
}
function driveViewUrl(url: string): string {
  const id = driveId(url)
  if (!id) return url
  return `https://drive.google.com/file/d/${id}/preview`
}
function driveDownloadUrl(url: string): string {
  const id = driveId(url)
  if (!id) return url
  return `https://drive.google.com/uc?export=download&id=${id}`
}
function driveImgUrl(url: string): string {
  const id = driveId(url)
  if (!id) return url
  return `https://lh3.googleusercontent.com/d/${id}`
}

function sanitizeHttpUrl(raw: string | undefined | null): string {
  if (!raw || typeof raw !== 'string') return ''
  const t = raw.trim()
  if (!t) return ''
  let u = t
  if (!/^https?:\/\//i.test(u)) {
    if (/^[\w.-]+\.[a-z]{2,}/i.test(u)) u = `https://${u}`
    else return ''
  }
  try {
    const parsed = new URL(u)
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return ''
    return parsed.href
  } catch { return '' }
}

function safePdfHref(raw: string): string {
  const id = driveId(raw)
  if (id) return `https://drive.google.com/uc?export=download&id=${id}`
  return sanitizeHttpUrl(raw)
}

function CountdownInline({ dateStr, timeStr, now }: { dateStr: string; timeStr?: string; now: number }) {
  const targetDate = getTargetDate(dateStr, timeStr)
  const diff = targetDate.getTime() - now
  if (diff <= 0) return <span style={{color:'#ef4444',fontWeight:800,fontSize:'.85rem'}}>Application Closed</span>

  const d = Math.floor(diff / 86400000)
  const h = Math.floor((diff % 86400000) / 3600000)
  const m = Math.floor((diff % 3600000) / 60000)
  const s = Math.floor((diff % 60000) / 1000)
  const pad = (n: number) => String(n).padStart(2, '0')
  const G = '#c9a227'

  return (
    <div style={{display:'flex',gap:6,alignItems:'center',flexWrap:'wrap' as const}}>
      {[{v:d,l:'Days'},{v:h,l:'Hrs'},{v:m,l:'Min'},{v:s,l:'Sec'}].map(({v,l}) => (
        <div key={l} style={{background:'rgba(0,0,0,.4)',borderRadius:7,padding:'4px 9px',textAlign:'center' as const,minWidth:42}}>
          <div style={{fontFamily:'Arial Black,sans-serif',fontWeight:900,fontSize:'1rem',color:G,lineHeight:1.1}}>{pad(v)}</div>
          <div style={{fontSize:'.55rem',color:'rgba(255,255,255,.4)',letterSpacing:'.05em',marginTop:1}}>{l}</div>
        </div>
      ))}
    </div>
  )
}
function Logo({ size=38 }:{size?:number}) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <defs><linearGradient id="ig" x1="30" y1="15" x2="70" y2="55" gradientUnits="userSpaceOnUse"><stop offset="0%" stopColor={T}/><stop offset="100%" stopColor={G}/></linearGradient></defs>
      <circle cx="50" cy="50" r="47" fill={N} stroke={G} strokeWidth="3"/>
      <rect x="33" y="16" width="34" height="34" rx="8" fill="url(#ig)"/>
      <circle cx="50" cy="33" r="10" stroke={N} strokeWidth="2.2" fill="none"/>
      <circle cx="50" cy="33" r="5.5" stroke={N} strokeWidth="2" fill="none"/>
      <circle cx="50" cy="33" r="2" fill={N}/>
      <text x="50" y="66" textAnchor="middle" fontFamily="Arial Black,sans-serif" fontWeight="900" fontSize="10.5" fill={G} letterSpacing="1.5">ASSAM</text>
      <text x="50" y="77" textAnchor="middle" fontFamily="Arial Black,sans-serif" fontWeight="900" fontSize="10.5" fill={W}>CAREER</text>
      <line x1="22" y1="80" x2="78" y2="80" stroke={T} strokeWidth="0.8"/>
      <text x="50" y="90" textAnchor="middle" fontFamily="Arial,sans-serif" fontWeight="700" fontSize="8" fill={T} letterSpacing="2">POINT</text>
    </svg>
  )
}

export default function JobDetail({ job, others }: { job: Job; others: Job[] }) {
  const [timerOn, setTimerOn] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true
    try {
      const s = localStorage.getItem('acp_settings_v1')
      return s ? JSON.parse(s).timerEnabled !== false : true
    } catch { return true }
  })
  const [now, setNow] = useState<number>(Date.now())
  const [activeTab, setActiveTab] = useState<'details'|'syllabus'|'howapply'>('details')

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])


  // safe defaults
   const safeTitle = job.title || 'Job Vacancy'
  const posts     = job.posts || []
  const totalV    = posts.reduce((a,p)=>a+p.vacancy,0) || Number(job.vacancy)||0
  const ageMin    = posts.length ? Math.min(...posts.map(p=>Number(p.ageMin)||0)) : 0
  const ageMax    = posts.length ? Math.max(...posts.map(p=>Number(p.ageMax)||0)) : 0
  const steps     = (job.howToApply||'').split('\n').filter(s=>s.trim())
  const ageRows   = (job.ageRelaxation||'').split('\n').filter(s=>s.trim())
  const selLines  = (job.selectionDetails||'').split('\n')
  const sylSecs   = (job.syllabusDetails||'').split('\n\n').filter(s=>s.trim())
  const zones     = (job.zoneWiseVacancy||'').split('\n').filter(s=>s.trim())
  const sc        = job.status==='Live'?'#22c55e':job.status==='Closing'?'#f59e0b':'#8fa3b8'

    const dl = (() => {
    try {
      const target = getTargetDate(job.lastDate, job.lastDateTime)
      const diff = Math.ceil((target.getTime() - Date.now()) / 86400000)
      if(diff<0)  return {t:'Closed',          c:'#ef4444'}
      if(diff===0)return {t:'Last Day!',        c:'#ef4444'}
      if(diff<=5) return {t:`⚠️ ${diff}d left`, c:'#f59e0b'}
      return        {t:`${diff} days left`,     c:'#22c55e'}
    } catch { return null }
  })()

  const selSections: {title:string;lines:string[]}[] = []
  let cur: {title:string;lines:string[]}|null = null
  for (const line of selLines) {
    const isHead = /^Stage\s+\d|^CBT|^PET|^Physical|^Document|^Medical/.test(line.trim())
    if (isHead) { if(cur)selSections.push(cur); cur={title:line.trim(),lines:[]} }
    else if(cur && line.trim()) { cur.lines.push(line.startsWith('-')?line.slice(1).trim():line.trim()) }
  }
  if(cur) selSections.push(cur)

  const applyHrefMain =
    sanitizeHttpUrl(job.applyLink) ||
    (job.website ? sanitizeHttpUrl(`https://${job.website.trim()}`) : '')
  const siteHref = job.website ? sanitizeHttpUrl(`https://${job.website.trim()}`) : ''

  return (
    <div className="job-detail-root" style={{overflowX:'hidden',maxWidth:'100vw'}}>
      <style>{`
        
        *,*::before,*::after{box-sizing:border-box}
        html,body{margin:0;font-family:Nunito,sans-serif;background:#f0f4f8;color:#1a1a2e;overflow-x:hidden;max-width:100%}
        .job-detail-root{width:100%;max-width:100%;overflow-x:hidden;position:relative}
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
        .nav-a:hover{color:${G};border-color:${G}88;background:rgba(201,162,39,.08)}
        .nav-wrap{display:flex;gap:6px;flex-wrap:wrap;min-width:0}
        .tab-btn{flex:1;min-width:0;padding:10px 6px;border:none;background:transparent;font-family:Nunito,sans-serif;font-weight:700;font-size:.8rem;cursor:pointer;color:#5a6a7a;border-bottom:3px solid transparent;transition:.18s}
        .tab-btn.on{color:${N};border-bottom-color:${G}}
        .tbl{width:100%;border-collapse:separate;border-spacing:0;font-size:.8rem;min-width:700px}
        .tbl th{background:#0b1f33;color:#c9a227;padding:9px 12px;text-align:left;font-family:Arial Black,sans-serif;font-size:.72rem;position:sticky;top:0;z-index:2}
        .tbl td{padding:9px 12px;border-bottom:1px solid #f0f4f8;vertical-align:top}
        .tbl td:first-child,.tbl th:first-child{position:sticky;left:0;background:#0b1f33;z-index:1}
        .tbl tr:hover td{background:#f8fbff}
        .tbl tr:last-child td{border-bottom:none}
        .re-card{background:#fff;border:1.5px solid #d4e0ec;border-radius:11px;text-decoration:none;color:inherit;display:flex;gap:12px;padding:12px;transition:.18s;min-width:0}
        .re-card:hover{border-color:${T};transform:translateX(3px)}
        @media(max-width:860px){
          .layout{flex-direction:column!important;flex-wrap:wrap!important}
          .layout>div:last-child{width:100%!important;min-width:0!important}
          .sidebar-col{width:100%!important;max-width:100%!important;flex-shrink:1!important;order:2}
          .layout>div:first-child{width:100%!important;min-width:0!important;order:1}
        }
        @media(max-width:600px){
          .header-inner{padding:10px 12px!important}
          .nav-wrap{flex-wrap:nowrap;overflow-x:auto;-webkit-overflow-scrolling:touch;max-width:100%;padding-bottom:4px;gap:4px}
          .nav-a{flex-shrink:0;font-size:.74rem;padding:6px 8px}
          .breadcrumb-bar{padding-left:12px!important;padding-right:12px!important}
          .hero-sec{padding:20px 12px 18px!important}
          .layout{padding:14px 12px 40px!important;overflow-x:hidden!important}
          .tab-row{overflow-x:auto!important;-webkit-overflow-scrolling:touch!important;flex-wrap:nowrap!important}
          .tab-btn{font-size:.68rem;padding:9px 4px;line-height:1.25;flex-shrink:0}
          .tbl{font-size:.7rem}
          .tbl th,.tbl td{padding:5px 7px;white-space:nowrap}
          .tbl td:first-child,.tbl th:first-child{position:static!important}
          .tbl-wrap{max-width:100%!important;overflow-x:auto!important;-webkit-overflow-scrolling:touch!important;display:block!important}
          .sel-stages{flex-direction:column!important;align-items:stretch!important}
          .sel-stages > div{max-width:100%}
          .stats-strip{grid-template-columns:1fr!important}
          .stats-strip > div{min-width:0!important}
          .age-fee-grid{grid-template-columns:1fr!important}
          .dates-grid{grid-template-columns:1fr!important}
          .tab-panel{padding:14px 12px!important;overflow-x:hidden!important}
          .re-card{overflow:hidden!important;max-width:100%!important;flex-wrap:wrap!important}
          .safe-wrap{overflow-wrap:anywhere!important;word-break:break-word!important}
          .job-detail-root{overflow-x:hidden!important;max-width:100vw!important}
        }
      `}</style>

      {/* HEADER */}
      <header style={{background:N,borderBottom:`2px solid ${G}`,position:'sticky',top:0,zIndex:100,boxShadow:'0 2px 20px rgba(0,0,0,.4)'}}>
        <div className="header-inner" style={{maxWidth:1200,margin:'0 auto',padding:'10px 20px',display:'flex',alignItems:'center',gap:14,flexWrap:'wrap' as const,minWidth:0}}>
          <Link href="/" style={{display:'flex',alignItems:'center',gap:10,textDecoration:'none',flexShrink:0}}>
            <Logo size={40}/><div>
              <div style={{fontFamily:'Arial Black,sans-serif',fontSize:'.78rem'}}><span style={{color:G}}>ASSAM </span><span style={{color:W}}>CAREER</span></div>
              <div style={{fontFamily:'Arial Black,sans-serif',fontSize:'.65rem',color:T,letterSpacing:'.12em'}}>◆ POINT ◆</div>
            </div>
          </Link>
          <nav className="nav-wrap">
            {([['🏠 Home','/'],['💼 Jobs','/govt-jobs'],['📚 Exams','/exams'],['ℹ️ Info','/information'],['📄 PDFs','/pdf-forms'],['📊 Results','/results']] as [string,string][]).map(([l,h])=>(
              <Link key={h} href={h} className="nav-a">{l}</Link>
            ))}
          </nav>
        </div>
      </header>

      <main id="main-content">
      {/* Breadcrumb */}
      <div className="breadcrumb-bar" style={{background:'#fff',borderBottom:'1px solid #e8eef6',padding:'9px 20px',fontSize:'.77rem',color:'#5a6a7a'}}>
        <div style={{maxWidth:1200,margin:'0 auto',display:'flex',gap:6,alignItems:'center',flexWrap:'wrap' as const}}>
          <Link href="/" style={{color:'#0e8a7e',textDecoration:'none',fontWeight:600}}>Home</Link> <span>›</span>
          <Link href="/govt-jobs" style={{color:'#0e8a7e',textDecoration:'none',fontWeight:600}}>Govt Jobs</Link> <span>›</span>
          <span style={{color:N,fontWeight:700}}>{safeTitle.slice(0,55)}{safeTitle.length>55?'…':''}</span>
        </div>
      </div>

      {/* HERO */}
      <div className="hero-sec" style={{background:`linear-gradient(135deg,${N},#0a3050)`,padding:'26px 20px 22px'}}>
        <div style={{maxWidth:1200,margin:'0 auto'}}>
          <div style={{display:'flex',gap:16,alignItems:'flex-start',flexWrap:'wrap' as const}}>
            <div style={{width:66,height:66,borderRadius:15,background:`${sc}22`,border:`2px solid ${sc}55`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'2.1rem',flexShrink:0}}>{job.logo||'🏛️'}</div>
            <div style={{flex:1,minWidth:0,maxWidth:'100%'}}>
              <div style={{display:'flex',gap:7,flexWrap:'wrap' as const,marginBottom:9}}>
                <span style={{background:`${sc}28`,color:sc,border:`1px solid ${sc}55`,padding:'3px 11px',borderRadius:99,fontSize:'.72rem',fontWeight:800}}>● {job.status}</span>
                <span style={{background:'rgba(255,255,255,.1)',color:'rgba(255,255,255,.65)',padding:'3px 11px',borderRadius:99,fontSize:'.72rem',fontWeight:700}}>{job.category}</span>
                <span style={{background:'rgba(255,255,255,.1)',color:'rgba(255,255,255,.65)',padding:'3px 11px',borderRadius:99,fontSize:'.72rem',fontWeight:700}}>📍 {job.district}</span>
                {job.advtNo&&<span style={{background:`${G}22`,color:G,border:`1px solid ${G}44`,padding:'3px 11px',borderRadius:99,fontSize:'.72rem',fontWeight:700}}>Advt: {job.advtNo}</span>}
              </div>
              <h1 className="safe-wrap" style={{fontFamily:'Sora,sans-serif',fontWeight:800,fontSize:'clamp(1rem,2.5vw,1.5rem)',color:W,margin:'0 0 7px',lineHeight:1.3}}>
                {safeTitle}
                {job.titleAs&&<><br/><span style={{fontSize:'clamp(.8rem,1.8vw,1.1rem)',color:G,fontWeight:700}}>{job.titleAs}</span></>}
              </h1>
              <div style={{color:'rgba(255,255,255,.5)',fontSize:'.85rem',marginBottom:10}}>
                by <strong style={{color:G}}>{job.org||'—'}</strong>
                {job.orgAs&&<><span style={{color:'rgba(255,255,255,.25)'}}> · </span><strong style={{color:'#ffd54f'}}>{job.orgAs}</strong></>}
              </div>
              {(job.description||job.descriptionAs)&&(
                <div className="safe-wrap" style={{maxWidth:700}}>
                  {job.description && <RichContent content={job.description} className="rte-content" style={{color:'rgba(255,255,255,.7)', fontSize:'.84rem', lineHeight:1.8, margin:'0 0 4px'}} />}
                  {job.descriptionAs && <RichContent content={job.descriptionAs} className="rte-content" style={{color:'rgba(255,255,255,.55)', fontSize:'.82rem', lineHeight:1.8, fontStyle:'italic'}} />}
                </div>
              )}
            </div>
          </div>

          {/* Stats strip */}
<div className="stats-strip" style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))',gap:10,marginTop:18}}>
  {(() => {
    // ✅ Compute the local date string once before the array
    let lastDateDisplay = '—'
    if (job.lastDate) {
      const localDate = getTargetDate(job.lastDate, '00:00')
      lastDateDisplay = localDate.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      })
    }
    // Append time if available
    const lastDateFull = lastDateDisplay + (job.lastDateTime ? ` · ${job.lastDateTime}` : '')

    return [
      { l: 'Total Vacancies', v: totalV > 0 ? totalV.toLocaleString('en-IN') : 'As per notification', c: G },
      { l: 'Last Date',       v: lastDateFull, c: dl?.c || W },
      { l: 'Age Limit',       v: posts.length ? `${ageMin}–${ageMax} yrs${job.ageLimitDate ? ` (as on ${fmt(job.ageLimitDate)})` : ''}` : job.ageLimit || '—', c: T },
      { l: 'App. Fee',        v: job.fee ? (job.fee.split('\n')[0] || '').slice(0, 32) : 'Check Notice', c: '#c0622a' },
    ].map(s => (
      <div key={s.l} style={{background:'rgba(255,255,255,.06)',border:'1px solid rgba(255,255,255,.12)',borderRadius:10,padding:'10px 14px',flex:'1 1 160px',minWidth:0}}>
        <div style={{fontSize:'.63rem',color:'rgba(255,255,255,.4)',fontWeight:700,textTransform:'uppercase' as const,letterSpacing:'.04em',marginBottom:4}}>{s.l}</div>
        <div className="safe-wrap" style={{fontFamily:'Sora,sans-serif',fontWeight:700,fontSize:'.83rem',color:s.c,lineHeight:1.3}}>{s.v}</div>
      </div>
    ))
  })()}
</div>
          {/* Countdown Timer */}
          {timerOn && job.lastDate && getTargetDate(job.lastDate, job.lastDateTime).getTime() > Date.now() && (
            <div suppressHydrationWarning style={{marginTop:16,background:'rgba(0,0,0,.25)',border:'1px solid rgba(201,162,39,.3)',borderRadius:10,padding:'10px 16px',display:'flex',alignItems:'center',gap:16,flexWrap:'wrap' as const}}>
              <span style={{fontSize:'.72rem',color:'rgba(255,255,255,.45)',fontWeight:700,textTransform:'uppercase' as const,letterSpacing:'.06em',flexShrink:0}}>⏱ Time Remaining</span>
               <CountdownInline dateStr={job.lastDate} timeStr={job.lastDateTime} now={now} />
            </div>
          )}
        </div>
      </div>

      <div className="layout" style={{maxWidth:1200,margin:'0 auto',padding:'20px 20px 60px',display:'flex',gap:20,alignItems:'flex-start',flexWrap:'wrap' as const}}>

        {/* MAIN */}
        <div style={{flex:1,minWidth:0}}>

          {/* Tabs */}
          <div style={{background:'#fff',border:'1.5px solid #d4e0ec',borderRadius:13,marginBottom:18,overflow:'hidden',maxWidth:'100%'}}>
            <div className="tab-row" style={{display:'flex',borderBottom:'1px solid #e8eef6',minWidth:0,overflowX:'auto',WebkitOverflowScrolling:'touch' as any}}>
              {(['details','syllabus','howapply'] as const).map(k=>(
                <button key={k} className={`tab-btn${activeTab===k?' on':''}`} onClick={()=>setActiveTab(k)}>
                  {k==='details'?'📋 Details':k==='syllabus'?'📚 Syllabus & Selection':'✅ How to Apply'}
                </button>
              ))}
            </div>

            {/* ── DETAILS TAB ── */}
            {activeTab==='details'&&(
              <div className="tab-panel" style={{padding:'20px'}}>

                {/* Important Dates */}
                <h2 style={{fontFamily:'Sora,sans-serif',fontWeight:700,fontSize:'.93rem',color:N,margin:'0 0 12px',paddingBottom:8,borderBottom:`2px solid ${G}`}}>📅 Important Dates</h2>
                <div className="dates-grid" style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))',gap:10,marginBottom:22}}>
                  {[
                    ...(job.applicationStart?[{l:'Application Opens',v:job.applicationStart,hi:false,d:true}]:[]),
                    {l:'Last Date to Apply',v:job.lastDate,hi:true,d:true},
                    ...(job.lastDateTime?[{l:'Last Date Time',v:job.lastDateTime,hi:true,d:false}]:[]),
                    ...(job.paymentLastDate?[{l:'Fee Payment Last Date',v:job.paymentLastDate,hi:false,d:true}]:[]),
                    ...(job.paymentLastDateTime?[{l:'Payment Last Time',v:job.paymentLastDateTime,hi:false,d:false}]:[]),
                    ...(job.correctionWindow?[{l:'Correction Window',v:job.correctionWindow,hi:false,d:false}]:[]),
                  ].map((item:any,i:number)=>(
                    <div key={i} style={{background:item.hi?`${G}14`:'#f8fbff',border:`1.5px solid ${item.hi?G+'55':'#d4e0ec'}`,borderRadius:10,padding:'11px 14px'}}>
                      <div style={{fontSize:'.62rem',fontWeight:700,color:'#5a6a7a',textTransform:'uppercase' as const,letterSpacing:'.05em',marginBottom:5}}>{item.l}</div>
                      <div style={{fontFamily:'Sora,sans-serif',fontWeight:700,fontSize:'.87rem',color:item.hi?G:N}}>{item.d?fmtLong(item.v):item.v}</div>
                    </div>
                  ))}
                </div>

                {/* Post-wise table */}
                {posts.length>0&&(
                  <>
                    <h2 style={{fontFamily:'Sora,sans-serif',fontWeight:700,fontSize:'.93rem',color:N,margin:'0 0 12px',paddingBottom:8,borderBottom:`2px solid ${G}`}}>📋 Post-wise Vacancy Details</h2>
                    <div className="tbl-wrap" style={{overflowX:'auto',borderRadius:10,border:'1.5px solid #d4e0ec',marginBottom:22}}>
                      <table className="tbl">
                        <thead>
                          <tr>
                            {['Post Name','Dept/Category','Vacancy','Qualification','Age (Min–Max)','Salary','Last Date','Apply'].map(h=>(
                              <th key={h}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {posts.map((p,i)=>(
                            <tr key={p.id||i}>
                              <td style={{fontWeight:700,color:N,minWidth:140}}>{p.name||'—'}</td>
                              <td style={{color:'#5a6a7a',minWidth:120}}>{p.dept||'—'}</td>
                              <td style={{fontWeight:700,color:T,textAlign:'center' as const}}>{Number(p.vacancy||0).toLocaleString('en-IN')}</td>
                              <td style={{color:'#5a6a7a',minWidth:140}}>{p.qualification||'—'}</td>
                              <td style={{color:N,fontWeight:600,textAlign:'center' as const,whiteSpace:'nowrap' as const}}>{p.ageMin||0}–{p.ageMax||0} yrs</td>
                              <td style={{color:'#5a6a7a',whiteSpace:'nowrap' as const}}>{p.salary||'—'}</td>
                              <td style={{color:N,fontWeight:600,whiteSpace:'nowrap' as const}}>{fmt(p.lastDate)}</td>
                              <td>
                                {sanitizeHttpUrl(p.applyLink)?(
                                  <a href={sanitizeHttpUrl(p.applyLink)} target="_blank" rel="noopener noreferrer"
                                    style={{display:'inline-block',padding:'5px 11px',borderRadius:6,background:G,color:N,fontWeight:900,fontSize:'.72rem',textDecoration:'none',fontFamily:'Arial Black,sans-serif',whiteSpace:'nowrap' as const}}>
                                    Apply →
                                  </a>
                                ):<span style={{color:'#8fa3b8',fontSize:'.76rem'}}>—</span>}
                              </td>
                            </tr>
                          ))}
                          <tr style={{background:`${G}08`}}>
                            <td colSpan={2} style={{fontWeight:700,color:N,fontSize:'.82rem'}}>TOTAL</td>
                            <td style={{fontWeight:900,color:G,textAlign:'center' as const,fontSize:'.9rem'}}>{totalV.toLocaleString('en-IN')}</td>
                            <td colSpan={5}/>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </>
                )}

                {/* Age & Fee grid */}
                <div className="age-fee-grid" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14,marginBottom:20}}>
                  {/* Age */}
                  <div style={{background:'#f8fbff',border:'1.5px solid #d4e0ec',borderRadius:11,padding:'14px 16px'}}>
                    <h2 style={{fontFamily:'Sora,sans-serif',fontWeight:700,fontSize:'.88rem',color:N,margin:'0 0 10px',paddingBottom:6,borderBottom:`2px solid ${T}`}}>👤 Age Limit</h2>
                    <div style={{fontSize:'.84rem',color:'#2a3a4a',fontWeight:700,marginBottom:6}}>
                      {posts.length?`${ageMin}–${ageMax} years`:job.ageLimit||'—'}
                    </div>
                    {job.ageLimitDate&&<div style={{fontSize:'.76rem',color:'#5a6a7a',marginBottom:6}}>As on: {fmtLong(job.ageLimitDate)}</div>}
                    {job.ageBirthRange&&<div style={{fontSize:'.76rem',color:'#5a6a7a',marginBottom:6}}>{job.ageBirthRange}</div>}
                    {ageRows.length>0&&(
                      <div style={{marginTop:8,borderTop:'1px solid #e8eef6',paddingTop:8}}>
                        <div style={{fontSize:'.7rem',fontWeight:700,color:'#8fa3b8',textTransform:'uppercase' as const,letterSpacing:'.04em',marginBottom:6}}>Relaxation</div>
                        <RichContent content={job.ageRelaxation} className="rte-content" style={{ fontSize:'.78rem', color:'#3a4a5a', padding:'2px 0' }} />
                      </div>
                    )}
                  </div>

                  {/* Fee */}
                  <div style={{background:'#fff8e1',border:'1.5px solid #ffe082',borderRadius:11,padding:'14px 16px'}}>
                    <h2 style={{fontFamily:'Sora,sans-serif',fontWeight:700,fontSize:'.88rem',color:N,margin:'0 0 10px',paddingBottom:6,borderBottom:'2px solid #ffe082'}}>💳 Application Fee</h2>
                    {job.fee?(
                      job.fee.split('\n').filter(Boolean).map((line,i)=>(
                        <div key={i} style={{fontSize:'.82rem',color:'#3a4a5a',padding:'3px 0',borderBottom:i<job.fee!.split('\n').filter(Boolean).length-1?'1px dashed #ffe082':undefined}}>
                          {line}
                        </div>
                      ))
                    ):<div style={{fontSize:'.82rem',color:'#5a6a7a'}}>Check official notification</div>}
                    {job.feeRefund && <RichContent content={job.feeRefund} className="rte-content" style={{ fontSize:'.74rem', color:'#2e7d32', marginTop:8, fontWeight:700 }} />}
                  </div>
                </div>

                {/* Zone-wise vacancy */}
                {zones.length>0&&(
                  <>
                    <h2 style={{fontFamily:'Sora,sans-serif',fontWeight:700,fontSize:'.93rem',color:N,margin:'0 0 12px',paddingBottom:8,borderBottom:`2px solid ${T}`}}>🗺️ Zone / District-wise Vacancy</h2>
                    <div style={{background:'#f8fbff',border:'1.5px solid #d4e0ec',borderRadius:10,padding:'14px 16px',marginBottom:20}}>
                      <RichContent content={job.zoneWiseVacancy} className="rte-content" />
                    </div>
                  </>
                )}

                {/* Selection process (brief) */}
                {job.selection&&(
                  <>
                    <h2 style={{fontFamily:'Sora,sans-serif',fontWeight:700,fontSize:'.93rem',color:N,margin:'0 0 12px',paddingBottom:8,borderBottom:`2px solid ${T}`}}>🏆 Selection Process</h2>
                    <div className="sel-stages" style={{display:'flex',gap:4,flexWrap:'wrap' as const,alignItems:'center',marginBottom:12}}>
                      {(job.selection||'').split('→').map((s,i,arr)=>(
                        <div key={i} style={{display:'flex',alignItems:'center',gap:4,flexWrap:'wrap' as const,minWidth:0,maxWidth:'100%'}}>
                          <div className="safe-wrap" style={{background:N,color:G,padding:'7px 11px',borderRadius:8,fontSize:'.75rem',fontWeight:800,fontFamily:'Arial Black,sans-serif',border:`1.5px solid ${G}44`,whiteSpace:'normal' as const}}>{s.trim()}</div>
                          {i<arr.length-1&&<span style={{color:G,fontWeight:900,fontSize:'1rem'}}>→</span>}
                        </div>
                      ))}
                    </div>
                    <button onClick={()=>setActiveTab('syllabus')} style={{background:'transparent',border:'none',color:T,fontWeight:700,fontSize:'.82rem',cursor:'pointer',padding:'0 0 18px',fontFamily:'Nunito,sans-serif'}}>📋 See detailed CBT pattern, PET criteria & syllabus →</button>
                  </>
                )}

                {/* Helpline */}
                {(job.helplineEmail||job.helplinePhone)&&(
                  <>
                    <h2 style={{fontFamily:'Sora,sans-serif',fontWeight:700,fontSize:'.93rem',color:N,margin:'0 0 12px',paddingBottom:8,borderBottom:`2px solid ${T}`}}>📞 Helpline for Candidates</h2>
                    <div style={{background:`${N}08`,border:'1.5px solid #d4e0ec',borderRadius:10,padding:'14px 18px',marginBottom:20,display:'flex',gap:22,flexWrap:'wrap' as const}}>
                      {job.helplineEmail&&(
                        <div>
                          <div style={{fontSize:'.65rem',fontWeight:700,color:'#8fa3b8',textTransform:'uppercase' as const,letterSpacing:'.05em',marginBottom:4}}>📧 Email</div>
                          <a href={`mailto:${job.helplineEmail}`} style={{color:T,fontWeight:700,fontSize:'.85rem',textDecoration:'none'}}>{job.helplineEmail}</a>
                        </div>
                      )}
                      {job.helplinePhone&&(
                        <div>
                          <div style={{fontSize:'.65rem',fontWeight:700,color:'#8fa3b8',textTransform:'uppercase' as const,letterSpacing:'.05em',marginBottom:4}}>📱 Phone</div>
                          <div style={{color:N,fontWeight:700,fontSize:'.85rem'}}>{job.helplinePhone}</div>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {/* Official PDFs */}
                {(job.advPdfs||[]).length>0&&(
                  <>
                    <h2 style={{fontFamily:'Sora,sans-serif',fontWeight:700,fontSize:'.93rem',color:N,margin:'0 0 12px',paddingBottom:8,borderBottom:`2px solid ${T}`}}>📄 Official PDFs</h2>
                    {(job.advPdfs||[]).map((pdf,i)=>{
                      const pdfHref = safePdfHref(pdf.url)
                      if (!pdfHref) return null
                      return (
                        <a key={i} href={pdfHref} target="_blank" rel="noopener noreferrer" style={{display:'flex',alignItems:'center',gap:12,padding:'11px 15px',background:'#f8fbff',border:'1.5px solid #d4e0ec',borderRadius:10,textDecoration:'none',color:N,marginBottom:9}}>
                          <span style={{fontSize:'1.3rem'}}>📄</span>
                          <div style={{flex:1,minWidth:0}} className="safe-wrap">
                            <div style={{fontWeight:700,fontSize:'.84rem'}}>{pdf.name||'PDF Document'}</div>
                            {pdf.size&&<div style={{fontSize:'.72rem',color:'#5a6a7a'}}>{pdf.size}</div>}
                          </div>
                          <span style={{background:T,color:N,padding:'5px 11px',borderRadius:7,fontWeight:800,fontSize:'.74rem',fontFamily:'Arial Black,sans-serif',flexShrink:0}}>Download</span>
                        </a>
                      )
                    })}
                  </>
                )}

                {/* Date history */}
                {(job.dateHistory||[]).length>0&&(
                  <div style={{background:'#fff8e1',border:'1.5px solid #ffe082',borderRadius:10,padding:'14px 18px'}}>
                    <div style={{fontFamily:'Sora,sans-serif',fontWeight:700,fontSize:'.85rem',color:'#e65100',marginBottom:10}}>📅 Date Extension History</div>
                    {(job.dateHistory||[]).map((h,i)=>(
                      <div key={i} style={{fontSize:'.8rem',color:'#5a3a00',padding:'4px 0',borderBottom:i<(job.dateHistory||[]).length-1?'1px solid #ffe082':undefined}}>
                        <strong>{fmtLong(h.date)}</strong> — {h.note}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Details Tab Images */}
            {activeTab==='details' && (job.detailsImages||[]).filter(Boolean).length > 0 && (
              <>
                <h2 style={{fontFamily:'Sora,sans-serif',fontWeight:700,fontSize:'.93rem',color:N,margin:'22px 0 12px',paddingBottom:8,borderBottom:`2px solid ${T}`}}>🖼️ Additional Images</h2>
                {(job.detailsImages||[]).map((u:string)=>u.trim()).filter(Boolean).map((imgUrl,idx)=>{
                  const src = imgUrl.includes('drive.google.com') ? driveImgUrl(imgUrl) : imgUrl
                  return (
                    <div key={idx} style={{borderRadius:10,overflow:'hidden',border:'1.5px solid #d4e0ec',marginBottom:12}}>
                      <img src={src} alt={`Job image ${idx+1}`}
                        style={{width:'100%',height:'auto',display:'block',maxHeight:500,objectFit:'contain',background:'#f8fbff'}}
                        onError={e=>{(e.target as HTMLImageElement).parentElement!.style.display='none'}}
                      />
                    </div>
                  )
                })}
              </>
            )}

            {/* Full Description */}
            {activeTab==='details' && (job as any).fullDescription && (
              <div style={{margin:'22px 20px 0'}}>
                <h2 style={{fontFamily:'Sora,sans-serif',fontWeight:700,fontSize:'.93rem',color:N,margin:'0 0 12px',paddingBottom:8,borderBottom:`2px solid ${T}`}}>
                  📄 {(job as any).fullDescTitle || 'Detailed Information'}
                </h2>
                <RichContent content={(job as any).fullDescription} className="rte-content" style={{ fontSize:'.88rem', color:'#2a3a4a', lineHeight:1.9, background:'#f8fbff', border:'1.5px solid #d4e0ec', borderRadius:10, padding:'16px 18px' }} />
              </div>
            )}

            {/* ── SYLLABUS TAB ── */}
            {activeTab==='syllabus'&&(
              <div className="tab-panel" style={{padding:'20px'}}>
                {selSections.length>0&&(
                  <>
                    <h2 style={{fontFamily:'Sora,sans-serif',fontWeight:700,fontSize:'.93rem',color:N,margin:'0 0 14px',paddingBottom:8,borderBottom:`2px solid ${G}`}}>🏆 Detailed Selection Process & Exam Pattern</h2>
                    <RichContent content={job.selectionDetails} className="rte-content" />
                    <div style={{marginBottom:20}}/>
                  </>
                )}
                {sylSecs.length>0&&(
                  <>
                    <h2 style={{fontFamily:'Sora,sans-serif',fontWeight:700,fontSize:'.93rem',color:N,margin:'0 0 14px',paddingBottom:8,borderBottom:`2px solid ${G}`}}>📚 Detailed Syllabus</h2>
                    <RichContent content={job.syllabusDetails} className="rte-content" />
                  </>
                )}
                {!selSections.length&&!sylSecs.length&&(
                  <div style={{textAlign:'center' as const,padding:'40px',color:'#8fa3b8'}}>
                    <div style={{fontSize:'2.5rem',marginBottom:12}}>📋</div>
                    <p>Detailed syllabus and selection process will be added soon.</p>
                  </div>
                )}
              </div>
            )}

            {/* ── HOW TO APPLY TAB ── */}
            {activeTab==='howapply'&&(
              <div className="tab-panel" style={{padding:'20px'}}>
                <h2 style={{fontFamily:'Sora,sans-serif',fontWeight:700,fontSize:'.93rem',color:N,margin:'0 0 14px',paddingBottom:8,borderBottom:`2px solid ${G}`}}>✅ How to Apply Online</h2>
                <RichContent content={job.howToApply} className="rte-content" />
                {job.howToApplyAs&&(
                  <div style={{background:'#fff8e1',border:'1.5px solid #ffe082',borderRadius:11,padding:'14px',marginTop:8,marginBottom:4}}>
                    <div style={{fontFamily:'Sora,sans-serif',fontWeight:700,fontSize:'.78rem',color:'#5d4037',marginBottom:10}}>🇮🇳 অসমীয়াত আবেদন পদ্ধতি</div>
                    <RichContent content={job.howToApplyAs} className="rte-content" />
                  </div>
                )}
                {(job.howToApplyImages||[]).map((u:string)=>u.trim()).filter(Boolean).map((imgUrl,idx)=>{
                  const src = imgUrl.includes('drive.google.com') ? driveImgUrl(imgUrl) : imgUrl
                  return (
                    <div key={idx} style={{borderRadius:10,overflow:'hidden',border:'1.5px solid #d4e0ec',marginBottom:12}}>
                      <img src={src} alt={`How to apply step ${idx+1}`}
                        style={{width:'100%',height:'auto',display:'block',maxHeight:480,objectFit:'contain',background:'#f8fbff'}}
                        onError={e=>{(e.target as HTMLImageElement).parentElement!.style.display='none'}}
                      />
                    </div>
                  )
                })}
                <div style={{display:'flex',gap:10,flexWrap:'wrap' as const,marginTop:18}}>
                  {applyHrefMain ? (
                    <a href={applyHrefMain} target="_blank" rel="noopener noreferrer"
                      style={{flex:1,minWidth:0,maxWidth:'100%',display:'flex',alignItems:'center',justifyContent:'center',gap:8,padding:'13px',borderRadius:11,background:T,color:N,fontWeight:900,fontSize:'.88rem',textDecoration:'none',fontFamily:'Arial Black,sans-serif'}}>
                      📝 APPLY ONLINE
                    </a>
                  ) : (
                    <span style={{flex:1,minWidth:0,padding:'13px',borderRadius:11,background:'#d4e0ec',color:'#5a6a7a',fontWeight:700,fontSize:'.85rem',textAlign:'center' as const}}>Apply link not available</span>
                  )}
                  {siteHref&&(
                    <a href={siteHref} target="_blank" rel="noopener noreferrer"
                      style={{display:'flex',alignItems:'center',justifyContent:'center',gap:7,padding:'13px 18px',borderRadius:11,background:'#f0f4f8',color:N,fontWeight:900,fontSize:'.88rem',textDecoration:'none',border:'1.5px solid #d4e0ec',fontFamily:'Arial Black,sans-serif',overflowWrap:'anywhere',wordBreak:'break-word',minWidth:0,maxWidth:'100%'}}>
                      🌐 Official Site
                    </a>
                  )}
                </div>
                {(() => {
                  const yt = sanitizeHttpUrl(job.youtubeLink)
                  return yt ? (
                    <a href={yt} target="_blank" rel="noopener noreferrer" style={{display:'flex',alignItems:'center',gap:10,padding:'12px 16px',background:'#fde8ea',border:'1.5px solid #f7bcc0',borderRadius:10,textDecoration:'none',color:'#c62828',fontWeight:700,fontSize:'.84rem',marginTop:12}}>▶️ Watch Video Guide on YouTube</a>
                  ) : null
                })()}
              </div>
            )}
          </div>

          {/* Affiliate Products */}
          {(job.jobAffiliates||[]).filter(ja=>ja.title&&ja.link).length > 0 && (
            <div style={{marginBottom:18}}>
              <h2 style={{fontFamily:'Sora,sans-serif',fontWeight:700,fontSize:'.95rem',color:N,marginBottom:12}}>📚 Recommended Books & Study Material</h2>
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(150px,1fr))',gap:12}}>
                {(job.jobAffiliates||[]).filter(ja=>ja.title&&ja.link&&sanitizeHttpUrl(ja.link)).map(ja=>(
                  <a key={ja.id} href={sanitizeHttpUrl(ja.link)} target="_blank" rel="noopener noreferrer sponsored"
                    style={{background:'#fff',border:'1.5px solid #d4e0ec',borderRadius:12,overflow:'hidden',textDecoration:'none',color:'inherit',display:'flex',flexDirection:'column' as const,transition:'.18s',boxShadow:'0 2px 8px rgba(0,0,0,.06)'}}>
                    <div style={{position:'relative' as const}}>
                      {ja.img
                        ? <img src={ja.img} alt={ja.title} style={{width:'100%',height:120,objectFit:'cover',display:'block'}}/>
                        : <div style={{width:'100%',height:120,background:`linear-gradient(135deg,${N},#0a3050)`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'2.5rem'}}>📖</div>
                      }
                      {ja.badge&&<span style={{position:'absolute' as const,top:7,left:7,background:G,color:N,fontSize:'.62rem',fontWeight:900,padding:'2px 8px',borderRadius:99,fontFamily:'Arial Black,sans-serif'}}>{ja.badge}</span>}
                    </div>
                    <div style={{padding:'10px 11px',flex:1,display:'flex',flexDirection:'column' as const,gap:8}}>
                      <div style={{fontFamily:'Sora,sans-serif',fontWeight:700,fontSize:'.78rem',color:N,lineHeight:1.4}}>{ja.title}</div>
                      <div style={{marginTop:'auto',background:T,color:N,borderRadius:7,padding:'6px',textAlign:'center' as const,fontWeight:900,fontSize:'.72rem',fontFamily:'Arial Black,sans-serif'}}>Buy Now →</div>
                    </div>
                  </a>
                ))}
              </div>
              <div style={{fontSize:'.7rem',color:'#8fa3b8',marginTop:8}}>* Affiliate links — purchasing supports this portal</div>
            </div>
          )}

          {/* Optional Sections */}
          {((job as any).sections||[]).filter((s:any)=>s.title||s.content||s.links?.length||s.pdfLink).map((sec:any,idx:number)=>(
            <div key={sec.id||idx} style={{background:'#fff',border:'1.5px solid #e8eef4',borderRadius:13,overflow:'hidden',marginBottom:18}}>
              <div style={{background:`linear-gradient(90deg,${N},#102a45)`,padding:'13px 20px',display:'flex',alignItems:'center',gap:10}}>
                <span style={{width:24,height:24,borderRadius:6,background:G,display:'inline-flex',alignItems:'center',justifyContent:'center',fontSize:'.75rem',fontWeight:800,color:N,flexShrink:0}}>{idx+1}</span>
                <h2 style={{fontFamily:'Sora,sans-serif',fontWeight:700,color:W,fontSize:'1rem',margin:0}}>{sec.title}</h2>
              </div>
              <div style={{padding:'18px 20px',display:'flex',flexDirection:'column' as const,gap:14}}>
                {sec.content && <RichContent content={sec.content} className="rte-content" />}
                {sec.links?.length>0&&(
                  <div>
                    <div style={{fontSize:'.74rem',fontWeight:800,color:'#3a5068',marginBottom:7,textTransform:'uppercase' as const,letterSpacing:.5}}>🔗 Important Links</div>
                    <div style={{border:'1.5px solid #e8eef4',borderRadius:10,overflow:'hidden'}}>
                      {sec.links.map((lnk:any,li:number)=>(
                        <a key={lnk.id||li} href={lnk.url} target="_blank" rel="noopener noreferrer"
                          style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'11px 16px',borderBottom:li<sec.links.length-1?'1px solid #f0f4f8':'none',textDecoration:'none',background:'#fff'}}>
                          <span style={{fontSize:'.88rem',fontWeight:600,color:N}}>{lnk.label||lnk.url}</span>
                          <span style={{fontSize:'.76rem',fontWeight:800,color:T,fontFamily:'Arial Black,sans-serif',whiteSpace:'nowrap' as const}}>Click Here →</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
                {sec.pdfLink&&(
                  <a href={sec.pdfLink} target="_blank" rel="noopener noreferrer"
                    style={{display:'inline-flex',alignItems:'center',gap:8,padding:'10px 20px',borderRadius:30,background:N,color:G,fontWeight:900,textDecoration:'none',fontSize:'.84rem',fontFamily:'Arial Black,sans-serif'}}>
                    📄 {sec.pdfName||'Download PDF'}
                  </a>
                )}
              </div>
            </div>
          ))}

          {/* Related jobs */}
          {others.length>0&&(
            <div>
              <h2 style={{fontFamily:'Sora,sans-serif',fontWeight:700,fontSize:'.95rem',color:N,marginBottom:12}}>💼 Other Job Vacancies</h2>
              <div style={{display:'flex',flexDirection:'column' as const,gap:9}}>
                {others.map(j=>{
                  const jsc=j.status==='Live'?'#22c55e':j.status==='Closing'?'#f59e0b':'#8fa3b8'
                  return (
                    <Link key={j.id} href={`/jobs/${j.slug || j.id}`} className="re-card">
                      <div style={{width:42,height:42,borderRadius:10,background:`${jsc}18`,border:`1.5px solid ${jsc}44`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.3rem',flexShrink:0}}>{j.logo||'🏛️'}</div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontFamily:'Sora,sans-serif',fontWeight:700,fontSize:'.83rem',color:N,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'normal' as const,wordBreak:'break-word',lineHeight:1.3}}>{j.title||'Job Vacancy'}</div>
                        <div style={{fontSize:'.72rem',color:'#5a6a7a',marginTop:2}}>{j.org||'—'} · Last: {fmt(j.lastDate)}</div>
                      </div>
                      <span style={{background:`${jsc}20`,color:jsc,padding:'3px 9px',borderRadius:99,fontSize:'.65rem',fontWeight:800,flexShrink:0,border:`1px solid ${jsc}44`}}>{j.status}</span>
                    </Link>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* SIDEBAR */}
        <div className="sidebar-col" style={{width:285,maxWidth:'100%',flexShrink:0,minWidth:0}}>
          {job.status!=='Draft'&&(
            <div style={{background:N,border:`2px solid ${G}`,borderRadius:14,padding:'18px',marginBottom:15}}>
              <div style={{fontFamily:'Arial Black,sans-serif',color:G,fontSize:'.72rem',letterSpacing:'.06em',marginBottom:12}}>📋 QUICK APPLY</div>
              {dl&&<div style={{background:`${dl.c}20`,color:dl.c,border:`1px solid ${dl.c}44`,padding:'7px 12px',borderRadius:8,fontSize:'.78rem',fontWeight:800,marginBottom:12,textAlign:'center' as const}}>🗓 {dl.t}</div>}
              {applyHrefMain ? (
                <a href={applyHrefMain} target="_blank" rel="noopener noreferrer"
                  style={{display:'flex',alignItems:'center',justifyContent:'center',gap:8,width:'100%',padding:'13px',borderRadius:11,background:G,color:N,fontWeight:900,fontSize:'.88rem',textDecoration:'none',fontFamily:'Arial Black,sans-serif',boxSizing:'border-box' as const,marginBottom:10}}>
                  📝 APPLY NOW
                </a>
              ) : (
                <div style={{width:'100%',padding:'13px',borderRadius:11,background:'rgba(255,255,255,.08)',color:'rgba(255,255,255,.45)',fontWeight:700,fontSize:'.82rem',textAlign:'center' as const,marginBottom:10}}>Apply link not set</div>
              )}
              {siteHref&&<a href={siteHref} target="_blank" rel="noopener noreferrer" style={{display:'flex',alignItems:'center',justifyContent:'center',gap:7,width:'100%',padding:'10px',borderRadius:10,background:'rgba(255,255,255,.06)',color:'rgba(255,255,255,.6)',fontWeight:700,fontSize:'.82rem',textDecoration:'none',border:'1px solid rgba(255,255,255,.15)',boxSizing:'border-box' as const,overflowWrap:'anywhere',wordBreak:'break-word',whiteSpace:'normal' as const}}>🌐 {job.website}</a>}
            </div>
          )}
          <div style={{background:'#fff',border:'1.5px solid #d4e0ec',borderRadius:13,padding:'16px',marginBottom:15}}>
            <h3 style={{fontFamily:'Sora,sans-serif',fontWeight:700,fontSize:'.87rem',color:N,marginBottom:12}}>📌 Quick Info</h3>
            {[
              {l:'Organisation',  v:job.org},
              {l:'Category',      v:job.category},
              {l:'District',      v:job.district},
              ...(job.advtNo?[{l:'Advt. No',v:job.advtNo}]:[]),
              ...(job.paymentLastDate?[{l:'Fee Last Date',v:fmtLong(job.paymentLastDate)+(job.paymentLastDateTime?' · '+job.paymentLastDateTime:'')}]:[]),
              {l:'Total Posts',   v:totalV.toLocaleString('en-IN')},
              {l:'Pay Scale',     v:job.salary},
              {l:'Qualification', v:job.qualification||(posts[0]?.qualification||'—')},
            ].map(r=>(
              <div key={r.l} style={{display:'flex',justifyContent:'space-between',padding:'6px 0',borderBottom:'1px solid #f0f4f8',gap:8}}>
                <span style={{fontSize:'.72rem',color:'#8fa3b8',fontWeight:700,flexShrink:0}}>{r.l}</span>
                <span className="safe-wrap" style={{fontSize:'.76rem',fontWeight:700,color:N,textAlign:'right' as const,lineHeight:1.4,minWidth:0}}>{r.v||'—'}</span>
              </div>
            ))}
          </div>
          <div style={{background:'#f8fbff',border:'1px solid #d4e0ec',borderRadius:12,padding:'14px',textAlign:'center' as const,marginBottom:15}}>
            <div style={{fontSize:'.74rem',color:'#5a6a7a',fontWeight:700,marginBottom:10}}>📢 Share this job</div>
            <div style={{display:'flex',gap:8,justifyContent:'center',flexWrap:'wrap' as const}}>
              {[
                {l:'WhatsApp',c:'#25d366',ico:'💬',href:`https://wa.me/?text=${encodeURIComponent(safeTitle+'\nVacancy: '+totalV.toLocaleString('en-IN')+' Posts | Last Date: '+fmt(job.lastDate)+'\n\nhttps://www.assamcareerpoint-info.com/jobs/'+(job.slug||job.id))}`},
                {l:'Telegram',c:'#0088cc',ico:'✈️',href:`https://t.me/share/url?url=${encodeURIComponent('https://www.assamcareerpoint-info.com/jobs/'+(job.slug||job.id))}&text=${encodeURIComponent(safeTitle)}`},
              ].map(s=>(
                <a key={s.l} href={s.href} target="_blank" rel="noopener noreferrer" style={{display:'flex',alignItems:'center',gap:5,padding:'8px 12px',borderRadius:8,background:s.c,color:W,fontSize:'.74rem',fontWeight:700,textDecoration:'none'}}>
                  {s.ico} {s.l}
                </a>
              ))}
            </div>
          </div>
          <div style={{background:'#fff8e1',border:'1px solid #ffe082',borderRadius:10,padding:'11px 13px',fontSize:'.72rem',color:'#5a3a00',lineHeight:1.75}}>
            ⚠️ <strong>Disclaimer:</strong> Always verify from the official website. Assam Career Point & Info is not affiliated with any government body.
          </div>
        </div>
      </div>

      </main>

      <footer style={{background:N,borderTop:`3px solid ${G}`,padding:'18px',textAlign:'center' as const}}>
        <div style={{fontSize:'.72rem',color:'rgba(255,255,255,.3)'}}>
          © 2025–2026 Assam Career Point & Info ·{' '}
          {([['Privacy','/privacy-policy'],['About','/about-us'],['Contact','/contact'],['Home','/']] as [string,string][]).map(([l,h])=>(
            <span key={h}><Link href={h} style={{color:'#c9a227',textDecoration:'none'}}>{l}</Link> · </span>
          ))}
        </div>
      </footer>
    </div>
  )
}