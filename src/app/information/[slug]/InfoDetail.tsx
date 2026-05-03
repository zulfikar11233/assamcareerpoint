'use client'
// src/app/information/[slug]/InfoDetail.tsx — with countdown timer (IST‑fixed)
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { getTargetDate } from '@/lib/dataHelper'   // ✅ import the helper

const G = '#c9a227', T = '#1dbfad', N = '#0b1f33', W = '#ffffff'

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

type InfoItem = {
  id: number
  slug?: string
  emoji: string
  title: string
  category: string
  description?: string
  lastDate?: string          // ✅ used for countdown
  process?: string
  officialLink?: string
  importantDates?: { label: string; date: string; time?: string }[]
  status: 'Active' | 'Upcoming' | 'Expired'
  createdAt?: string
  titleAs?: string
  descriptionAs?: string
  processAs?: string
  processImages?: string[]
  fullDescription?: string
  fullDescTitle?: string
  sections?: any[]
}

const SC: Record<string,string> = { 'Active':'#22c55e', 'Upcoming':'#f59e0b', 'Expired':'#8fa3b8' }

export default function InfoDetail({ item, others }: { item: InfoItem; others: InfoItem[] }) {
  // ─────────────────────────────────────────────────────────
  // ✅ Countdown timer for lastDate (if exists)
  // ─────────────────────────────────────────────────────────
  const [timerOn] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true
    try {
      const s = localStorage.getItem('acp_settings_v1')
      return s ? JSON.parse(s).timerEnabled !== false : true
    } catch { return true }
  })
  const [now, setNow] = useState<number>(Date.now())
  const [countdown, setCountdown] = useState({ d:0, h:0, m:0, s:0 })

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    if (!item.lastDate) return
    // ✅ Use getTargetDate with default end-of-day time
    const target = getTargetDate(item.lastDate, '23:59 Hrs')
    if (isNaN(target.getTime())) return
    const tick = () => {
      const diff = target.getTime() - now
      if (diff <= 0) {
        setCountdown({ d:0, h:0, m:0, s:0 })
        return
      }
      setCountdown({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      })
    }
    tick()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item.lastDate, now]) // re-run when now changes

  // JSON-LD structured data
  useEffect(() => {
    const existing = document.getElementById('acp-jsonld')
    if (existing) existing.remove()
    const script = document.createElement('script')
    script.id = 'acp-jsonld'
    script.type = 'application/ld+json'
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: item.title,
      description: item.description,
      datePublished: item.createdAt,
      author: { '@type': 'Organization', name: 'Assam Career Point & Info' },
      url: `https://www.assamcareerpoint-info.com/information/${item.slug || item.id}`,
    })
    document.head.appendChild(script)
  }, [item])

  const fmt = (d?: string) => {
    if(!d) return '—'
    try { return new Date(d).toLocaleDateString('en-IN',{day:'2-digit',month:'long',year:'numeric'}) }
    catch { return d }
  }

  const sc = SC[item.status] || '#8fa3b8'
  const canCountdown = !!item.lastDate && getTargetDate(item.lastDate, '23:59 Hrs').getTime() > Date.now()

  return (
    <>
      <style>{`
        *,*::before,*::after{box-sizing:border-box}
        html,body{margin:0;font-family:Nunito,sans-serif;background:#f0f4f8;color:#1a1a2e;overflow-x:hidden}
        .nav-a{color:rgba(255,255,255,.65);font-size:.82rem;font-weight:700;padding:6px 13px;border-radius:99px;border:1.5px solid rgba(255,255,255,.15);text-decoration:none;white-space:nowrap;transition:.15s}
        .nav-a:hover{color:${G};border-color:${G}88;background:rgba(201,162,39,.08)}
        .card{background:#fff;border:1.5px solid #d4e0ec;border-radius:14px;padding:20px;margin-bottom:18px}
        .re-card{background:#fff;border:1.5px solid #d4e0ec;border-radius:12px;overflow:hidden;text-decoration:none;color:inherit;display:flex;gap:12px;padding:12px;transition:.18s}
        .re-card:hover{border-color:${T};transform:translateX(3px)}
        .cd-box{background:rgba(0,0,0,.4);border-radius:10px;padding:10px 6px;text-align:center}
        .cd-val{font-family:'Arial Black',sans-serif;font-weight:900;font-size:1.6rem;line-height:1;color:${G}}
        .cd-lbl{font-size:.58rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:rgba(255,255,255,.5);margin-top:3px}

        @media(max-width:860px){
          .detail-header{padding:10px 12px!important}
          .detail-nav{display:flex!important;gap:6px!important;width:100%!important;overflow-x:auto!important;flex-wrap:nowrap!important;padding-bottom:4px}
          .detail-nav a{flex-shrink:0}
          .detail-crumb{flex-wrap:wrap!important}
          .detail-hero{padding:14px 12px 10px!important}
          .detail-content{padding:16px 12px 44px!important}
          .layout{flex-direction:column!important}
          .side{width:100%!important}
          /* ✅ FIX: main column prevents overflow */
          .layout>div:first-child{width:100%!important;max-width:100%!important;overflow-x:hidden!important}
          .layout>div:last-child{width:100%!important;max-width:100%!important}
        }
      `}</style>

      <header className="detail-header" style={{background:N,borderBottom:`2px solid ${G}`,position:'sticky',top:0,zIndex:100,boxShadow:'0 2px 20px rgba(0,0,0,.4)'}}>
        <div style={{maxWidth:1180,margin:'0 auto',padding:'10px 20px',display:'flex',alignItems:'center',gap:14,flexWrap:'wrap' as const}}>
          <Link href="/" style={{display:'flex',alignItems:'center',gap:10,textDecoration:'none',flexShrink:0}}>
            <Logo size={40}/><div>
              <div style={{fontFamily:'Arial Black,sans-serif',fontSize:'.78rem'}}><span style={{color:G}}>ASSAM </span><span style={{color:W}}>CAREER</span></div>
              <div style={{fontFamily:'Arial Black,sans-serif',fontSize:'.65rem',color:T,letterSpacing:'.12em'}}>◆ POINT ◆</div>
            </div>
          </Link>
          <nav className="detail-nav" style={{display:'flex',gap:2,flexWrap:'wrap' as const}}>
            {([['🏠 Home','/'],['💼 Jobs','/govt-jobs'],['📚 Exams','/exams'],['ℹ️ Info','/information'],['📄 PDF Forms','/pdf-forms'],['📊 Results','/results']] as [string,string][]).map(([l,h])=>(
              <Link key={h} href={h} className="nav-a">{l}</Link>
            ))}
          </nav>
        </div>
      </header>

      <main id="main-content">
      {/* Breadcrumb */}
      <div style={{background:'#fff',borderBottom:'1px solid #e8eef6',padding:'10px 20px',fontSize:'.78rem',color:'#5a6a7a'}}>
        <div className="detail-crumb" style={{maxWidth:1180,margin:'0 auto',display:'flex',gap:6,alignItems:'center'}}>
          <Link href="/" style={{color:'#0e8a7e',textDecoration:'none',fontWeight:600}}>Home</Link> <span>›</span>
          <Link href="/information" style={{color:'#0e8a7e',textDecoration:'none',fontWeight:600}}>Information</Link> <span>›</span>
          <span style={{color:N,fontWeight:700,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' as const,maxWidth:'min(72vw,680px)'}}>{item.title.slice(0,50)}</span>
        </div>
      </div>

      {/* HERO */}
      <div className="detail-hero" style={{background:`linear-gradient(135deg,${N},#0a3050)`,padding:'16px 20px 12px'}}>
        <div style={{maxWidth:1180,margin:'0 auto',display:'flex',gap:16,alignItems:'flex-start',flexWrap:'wrap' as const}}>
          <div style={{width:64,height:64,borderRadius:15,background:`${T}22`,border:`2px solid ${T}55`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'2rem',flexShrink:0}}>{item.emoji}</div>
          <div style={{flex:1,minWidth:220}}>
            <div style={{display:'flex',gap:8,flexWrap:'wrap' as const,marginBottom:9}}>
              <span style={{background:`${sc}22`,color:sc,border:`1px solid ${sc}44`,padding:'3px 12px',borderRadius:99,fontSize:'.72rem',fontWeight:800}}>● {item.status}</span>
              <span style={{background:'rgba(255,255,255,.1)',color:'rgba(255,255,255,.65)',padding:'3px 12px',borderRadius:99,fontSize:'.72rem',fontWeight:700}}>{item.category}</span>
            </div>
            <h1 style={{fontFamily:'Sora,sans-serif',fontWeight:800,fontSize:'clamp(1.05rem,2.2vw,1.45rem)',color:W,margin:'0 0 8px',lineHeight:1.3,overflowWrap:'anywhere'}}>
              {item.title}
              {item.titleAs && <><br/><span style={{fontSize:'clamp(.78rem,1.6vw,1rem)',color:'#ffd54f',fontWeight:700}}>{item.titleAs}</span></>}
            </h1>
            {item.description && <RichContent content={item.description} className="rte-content" style={{color:'rgba(255,255,255,.55)', fontSize:'.86rem', lineHeight:1.65, margin:'0 0 4px',overflowWrap:'anywhere'}} />}
            {item.descriptionAs && <RichContent content={item.descriptionAs} className="rte-content" style={{color:'rgba(255,255,255,.4)', fontSize:'.84rem', lineHeight:1.65, margin:0, fontStyle:'italic',overflowWrap:'anywhere'}} />}
          </div>
        </div>

        {/* ✅ Countdown Timer for lastDate */}
        {timerOn && canCountdown && (
          <div suppressHydrationWarning style={{marginTop:12, background:'rgba(0,0,0,.3)', border:`1px solid ${G}66`, borderRadius:12, padding:'10px 14px', maxWidth:390}}>
            <div style={{fontSize:'.7rem', color:'rgba(255,255,255,.5)', fontWeight:700, textTransform:'uppercase', letterSpacing:'.06em', marginBottom:8}}>⏱ Deadline Countdown</div>
            <div style={{display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8}}>
              {[
                {v:countdown.d, l:'Days'},
                {v:countdown.h, l:'Hrs'},
                {v:countdown.m, l:'Mins'},
                {v:countdown.s, l:'Secs'}
              ].map(({v,l}) => (
                <div key={l} className="cd-box">
                  <div className="cd-val">{String(v).padStart(2,'0')}</div>
                  <div className="cd-lbl">{l}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="layout detail-content" style={{maxWidth:1180,margin:'0 auto',padding:'22px 20px 60px',display:'flex',gap:22,alignItems:'flex-start'}}>

        {/* MAIN */}
        <div style={{flex:1,minWidth:0}}>

          {/* Important Dates */}
          {item.importantDates?.length > 0 && (
            <div className="card">
              <h2 style={{fontFamily:'Sora,sans-serif',fontWeight:700,fontSize:'.95rem',color:N,margin:'0 0 14px',paddingBottom:10,borderBottom:'2px solid #f0f4f8'}}>📅 Important Dates</h2>
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(min(100%,160px),1fr))',gap:12}}>
                {(item.importantDates||[]).map((d,i)=>(
                  <div key={i} style={{background:`${G}10`,border:`1.5px solid ${G}33`,borderRadius:10,padding:'12px 14px'}}>
                    <div style={{fontSize:'.65rem',fontWeight:700,color:'#5a6a7a',textTransform:'uppercase' as const,letterSpacing:'.05em',marginBottom:5}}>{d.label}</div>
                    <div style={{fontFamily:'Sora,sans-serif',fontWeight:700,fontSize:'.9rem',color:G}}>{fmt(d.date)}</div>
                    {d.time && <div style={{fontSize:'.73rem',color:'#5a6a7a',marginTop:3}}>⏰ {d.time}</div>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step-by-step process */}
          {item.process && (
            <div className="card">
              <h2 style={{fontFamily:'Sora,sans-serif',fontWeight:700,fontSize:'.95rem',color:N,margin:'0 0 16px',paddingBottom:10,borderBottom:'2px solid #f0f4f8'}}>📋 Step-by-Step Process</h2>
              <RichContent content={item.process} className="rte-content" />
              {item.processAs && (
                <div style={{marginTop:14,background:'#fff8e1',border:'1.5px solid #ffe082',borderRadius:10,padding:'12px'}}>
                  <div style={{fontFamily:'Sora,sans-serif',fontWeight:700,fontSize:'.78rem',color:'#5d4037',marginBottom:8}}>🇮🇳 অসমীয়াত প্ৰক্ৰিয়া</div>
                  <RichContent content={item.processAs} className="rte-content" />
                </div>
              )}
            </div>
          )}

          {/* Process Images */}
          {(item.processImages||[]).filter(Boolean).length > 0 && (
            <div className="card">
              <h2 style={{fontFamily:'Sora,sans-serif',fontWeight:700,fontSize:'.95rem',color:N,margin:'0 0 14px',paddingBottom:10,borderBottom:'2px solid #f0f4f8'}}>🖼️ Reference Images</h2>
              {(item.processImages||[]).map((u:string)=>u.trim()).filter(Boolean).map((imgUrl,idx)=>{
                const src = imgUrl.includes('drive.google.com')
                  ? `https://lh3.googleusercontent.com/d/${(imgUrl.match(/\/d\/([a-zA-Z0-9_-]+)/)||[])[1]}`
                  : imgUrl
                return (
                  <div key={idx} style={{borderRadius:10,overflow:'hidden',border:'1.5px solid #d4e0ec',marginBottom:12,boxShadow:'0 2px 12px rgba(0,0,0,.06)'}}>
                    <img src={src} alt={`Reference image ${idx+1}`} width={800} height={500} loading="lazy" decoding="async"
                      style={{width:'100%',height:'auto',display:'block',maxHeight:500,objectFit:'contain',background:'#f8fbff'}}
                      onError={e=>{(e.target as HTMLImageElement).parentElement!.style.display='none'}}
                    />
                  </div>
                )
              })}
            </div>
          )}

          {/* Official Link */}
          {item.officialLink && (
            <div className="card" style={{borderLeft:`5px solid ${T}`}}>
              <h2 style={{fontFamily:'Sora,sans-serif',fontWeight:700,fontSize:'.95rem',color:N,margin:'0 0 12px',paddingBottom:10,borderBottom:'2px solid #f0f4f8'}}>🌐 Official Resource</h2>
              <p style={{fontSize:'.87rem',color:'#4a5a6a',lineHeight:1.75,margin:'0 0 14px'}}>For the most accurate and up-to-date information, always refer to the official government website.</p>
              <a href={item.officialLink} target="_blank" rel="noopener noreferrer"
                style={{display:'inline-flex',alignItems:'center',gap:8,padding:'12px 22px',borderRadius:10,background:T,color:N,fontWeight:900,fontSize:'.88rem',textDecoration:'none',fontFamily:'Arial Black,sans-serif'}}>
                🔗 Visit Official Website
              </a>
            </div>
          )}

          {item.fullDescription && (
            <div style={{marginTop:22}}>
              <h2 style={{fontFamily:'Sora,sans-serif',fontWeight:700,fontSize:'.93rem',color:N,margin:'0 0 12px',paddingBottom:8,borderBottom:`2px solid ${G}`}}>
                📄 {item.fullDescTitle || 'Detailed Information'}
              </h2>
              <RichContent content={item.fullDescription} className="rte-content" style={{background:'#f8fbff',border:'1.5px solid #d4e0ec',borderRadius:10,padding:'16px 18px'}} />
            </div>
          )}

          {/* Optional Sections */}
          {(item.sections||[]).filter((s:any)=>s.title||s.content||s.links?.length||s.pdfLink).map((sec:any,idx:number)=>(
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
                  <div>
                    <a href={sec.pdfLink} target="_blank" rel="noopener noreferrer"
                      style={{display:'inline-flex',alignItems:'center',gap:8,padding:'10px 20px',borderRadius:30,background:N,color:G,fontWeight:900,textDecoration:'none',fontSize:'.84rem',fontFamily:'Arial Black,sans-serif'}}>
                      📄 {sec.pdfName||'Download PDF'}
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Disclaimer */}
          <div style={{background:'#fff8e1',border:'1.5px solid #ffe082',borderRadius:12,padding:'14px 18px',fontSize:'.82rem',color:'#5a3a00',lineHeight:1.8}}>
            <strong>⚠️ Disclaimer:</strong> This information is for awareness purposes only. Always verify from the official government website before taking any action. Assam Career Point & Info is not affiliated with any government body.
          </div>

          {/* Related */}
          {others.length > 0 && (
            <div style={{marginTop:20}}>
              <h2 style={{fontFamily:'Sora,sans-serif',fontWeight:700,fontSize:'1rem',color:N,marginBottom:14}}>📋 Related Information</h2>
              <div style={{display:'flex',flexDirection:'column' as const,gap:10}}>
                {others.map(o=>(
                  <Link key={o.id} href={`/information/${o.slug || o.id}`} className="re-card">
                    <div style={{width:42,height:42,borderRadius:10,background:`${T}18`,border:`1.5px solid ${T}44`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.3rem',flexShrink:0}}>{o.emoji}</div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontFamily:'Sora,sans-serif',fontWeight:700,fontSize:'.84rem',color:N,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' as const}}>{o.title}</div>
                      <div style={{fontSize:'.73rem',color:'#5a6a7a',marginTop:3}}>{o.category}</div>
                    </div>
                    <span style={{background:`${SC[o.status]||'#8fa3b8'}20`,color:SC[o.status]||'#8fa3b8',padding:'3px 9px',borderRadius:99,fontSize:'.65rem',fontWeight:800,flexShrink:0}}>{o.status}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* SIDEBAR */}
        <div className="side" style={{width:270,flexShrink:0,minWidth:0}}>
          {/* QUICK INFO */}
          <div style={{background:N,border:`2px solid ${G}`,borderRadius:14,padding:'18px',marginBottom:16}}>
            <h3 style={{fontFamily:'Arial Black,sans-serif',color:G,fontSize:'.78rem',letterSpacing:'.06em',marginBottom:14}}>📌 QUICK INFO</h3>
            {[
              {l:'Category', v:item.category},
              {l:'Status',   v:item.status, c:sc},
              ...(item.lastDate ? [{l:'Last Date', v:fmt(item.lastDate), c:G}] : []),
              ...(item.officialLink ? [{l:'Official Site', v:new URL(item.officialLink).hostname, href:item.officialLink}] : []),
            ].map((r:any) => (
              <div key={r.l} style={{display:'flex',justifyContent:'space-between',padding:'7px 0',borderBottom:'1px solid rgba(255,255,255,.06)',gap:8}}>
                <span style={{fontSize:'.73rem',color:'rgba(255,255,255,.65)',fontWeight:700}}>{r.l}</span>
                {r.href
                  ? <a href={r.href} target="_blank" rel="noopener noreferrer" style={{fontSize:'.76rem',color:T,fontWeight:700,textDecoration:'none',textAlign:'right',wordBreak:'break-all'}}>{r.v}</a>
                  : <span style={{fontSize:'.76rem',color:r.c||W,fontWeight:700,textAlign:'right'}}>{r.v}</span>
                }
              </div>
            ))}
          </div>

          {item.officialLink && (
            <a href={item.officialLink} target="_blank" rel="noopener noreferrer"
              style={{display:'flex',alignItems:'center',justifyContent:'center',gap:8,width:'100%',padding:'13px',borderRadius:12,background:G,color:N,fontWeight:900,fontSize:'.88rem',textDecoration:'none',fontFamily:'Arial Black,sans-serif',boxSizing:'border-box',marginBottom:14}}>
              🔗 OFFICIAL WEBSITE
            </a>
          )}

          {/* Share */}
          <div style={{background:'#f8fbff',border:'1px solid #d4e0ec',borderRadius:12,padding:'14px',textAlign:'center' as const}}>
            <div style={{fontSize:'.75rem',color:'#5a6a7a',fontWeight:700,marginBottom:10}}>📢 Share this info</div>
            <div style={{display:'flex',gap:8,justifyContent:'center'}}>
              {[
                {l:'WhatsApp',c:'#25d366',ico:'💬',href:`https://wa.me/?text=${encodeURIComponent(`${item.title}\n\nhttps://www.assamcareerpoint-info.com/information/${item.slug || item.id}`)}`},
                {l:'Telegram',c:'#0088cc',ico:'✈️',href:`https://t.me/share/url?url=${encodeURIComponent(`https://www.assamcareerpoint-info.com/information/${item.slug || item.id}`)}&text=${encodeURIComponent(item.title)}`},
              ].map(s=>(
                <a key={s.l} href={s.href} target="_blank" rel="noopener noreferrer"
                  style={{display:'flex',alignItems:'center',gap:6,padding:'8px 14px',borderRadius:8,background:s.c,color:W,fontSize:'.75rem',fontWeight:700,textDecoration:'none'}}>
                  {s.ico} {s.l}
                </a>
              ))}
            </div>
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
    </>
  )
}