'use client'
// src/app/information/page.tsx — Public Information Listing
// Reads from localStorage 'acp_info_v6'

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

type InfoItem = { id:number; emoji:string; title:string; category:string; description:string; lastDate?:string; importantDates:{label:string;date:string;time?:string}[]; status:'Active'|'Upcoming'|'Expired'; createdAt:string }

const CATS = ['All','Electoral','ID & Documents','Government Scheme','Finance','Health','Education','Legal','Other']
const STATUS_COLOR: Record<string,string> = { 'Active':'#22c55e', 'Upcoming':'#f59e0b', 'Expired':'#8fa3b8' }

const FALLBACK: InfoItem[] = [
  {id:1,emoji:'🗳️',title:'Voter ID Registration / Correction 2026',category:'Electoral',description:'Register as a new voter or correct existing voter ID details via Form 6/6A/8 online or offline.',lastDate:'2026-04-30',importantDates:[{label:'Last Date to Apply',date:'2026-04-30',time:'11:59 PM'}],status:'Active',createdAt:new Date().toISOString()},
  {id:2,emoji:'🔗',title:'PAN–Aadhaar Linking Deadline 2026',category:'ID & Documents',description:'Link PAN with Aadhaar to avoid PAN becoming inoperative. ₹1,000 penalty applies.',lastDate:'2026-06-30',importantDates:[{label:'Final Deadline',date:'2026-06-30',time:'11:59 PM'}],status:'Active',createdAt:new Date().toISOString()},
]

export default function InformationPage() {
  const [items,  setItems]  = useState<InfoItem[]>([])
  const [cat,    setCat]    = useState('All')
  const [q,      setQ]      = useState('')
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    fetch('/api/data/info')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setItems(data)
        } else {
          try {
            const saved = localStorage.getItem('acp_info_v6')
            setItems(saved ? JSON.parse(saved) : FALLBACK)
          } catch { setItems(FALLBACK) }
        }
        setLoaded(true)
      })
      .catch(() => {
        try {
          const saved = localStorage.getItem('acp_info_v6')
          setItems(saved ? JSON.parse(saved) : FALLBACK)
        } catch { setItems(FALLBACK) }
        setLoaded(true)
      })
  }, [])

  const filtered = items.filter(i =>
    i.status !== 'Expired' &&
    (cat === 'All' || i.category === cat) &&
    (!q || i.title.toLowerCase().includes(q.toLowerCase()))
  )

  const fmt = (d?: string) => { if(!d) return '—'; try { return new Date(d).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'}) } catch { return d } }

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
        .icard{background:#fff;border:1.5px solid #d4e0ec;border-radius:14px;overflow:hidden;text-decoration:none;color:inherit;display:flex;flex-direction:column;transition:.2s}
        .icard:hover{transform:translateY(-3px);box-shadow:0 10px 28px rgba(0,0,0,.1);border-color:${T}}
        .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:18px}
        @media(max-width:700px){.grid{grid-template-columns:1fr!important}}
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
              <Link key={h} href={h} className={`nav-a${h==='/information'?' on':''}`}>{l}</Link>
            ))}
          </nav>
        </div>
      </header>

      <div style={{background:`linear-gradient(135deg,${N},#0a3050)`,padding:'32px 20px 26px',textAlign:'center' as const}}>
        <div style={{fontSize:'2.2rem',marginBottom:8}}>ℹ️</div>
        <h1 style={{fontFamily:'Sora,sans-serif',fontWeight:800,fontSize:'clamp(1.3rem,3vw,2rem)',color:W,margin:'0 0 8px'}}>Government Information</h1>
        <p style={{color:'rgba(255,255,255,.55)',fontSize:'.9rem',maxWidth:500,margin:'0 auto 18px'}}>Voter ID, PAN-Aadhaar, Government Schemes, Documents & more — step-by-step guides for every citizen</p>
        <div style={{maxWidth:480,margin:'0 auto',position:'relative' as const}}>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search information..."
            style={{width:'100%',padding:'12px 44px 12px 16px',borderRadius:99,border:`2px solid ${G}`,background:'rgba(255,255,255,.08)',color:W,fontFamily:'Nunito,sans-serif',fontSize:'.88rem',outline:'none'}}/>
          <span style={{position:'absolute' as const,right:15,top:'50%',transform:'translateY(-50%)',fontSize:'1.1rem'}}>🔍</span>
        </div>
      </div>

      <div style={{maxWidth:1180,margin:'0 auto',padding:'22px 20px 60px'}}>
        <div style={{display:'flex',gap:7,flexWrap:'wrap' as const,marginBottom:20}}>
          {CATS.map(c=><button key={c} className={`cat-btn${cat===c?' on':''}`} onClick={()=>setCat(c)}>{c}</button>)}
        </div>

        <div style={{fontSize:'.82rem',color:'#5a6a7a',marginBottom:14,fontWeight:700}}>
          {loaded ? `${filtered.length} article${filtered.length!==1?'s':''} found` : 'Loading...'}
        </div>

        <div className="grid">
          {filtered.map(item=>{
            const sc = STATUS_COLOR[item.status] || '#8fa3b8'
            const nextDate = item.importantDates?.[0]
            return (
              <Link key={item.id} href={`/information/${item.id}`} className="icard">
                <div style={{height:4,background:`linear-gradient(90deg,${T},${G})`}}/>
                <div style={{padding:'18px 20px',flex:1,display:'flex',flexDirection:'column' as const,gap:12}}>
                  <div style={{display:'flex',gap:12,alignItems:'flex-start'}}>
                    <div style={{width:52,height:52,borderRadius:12,background:`${T}18`,border:`2px solid ${T}44`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.6rem',flexShrink:0}}>
                      {item.emoji}
                    </div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{display:'flex',gap:6,flexWrap:'wrap' as const,marginBottom:5}}>
                        <span style={{background:`${sc}20`,color:sc,padding:'2px 9px',borderRadius:99,fontSize:'.67rem',fontWeight:800,border:`1px solid ${sc}44`}}>● {item.status}</span>
                        <span style={{background:'#f0f4f8',color:'#5a6a7a',padding:'2px 9px',borderRadius:99,fontSize:'.67rem',fontWeight:700}}>{item.category}</span>
                      </div>
                      <h2 style={{fontFamily:'Sora,sans-serif',fontWeight:700,fontSize:'.9rem',color:N,lineHeight:1.35,margin:0,overflow:'hidden',display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical' as const}}>{item.title}</h2>
                    </div>
                  </div>
                  <p style={{fontSize:'.82rem',color:'#4a5a6a',lineHeight:1.7,margin:0,overflow:'hidden',display:'-webkit-box',WebkitLineClamp:3,WebkitBoxOrient:'vertical' as const}}>{item.description}</p>
                  {nextDate && (
                    <div style={{background:`${G}12`,border:`1px solid ${G}44`,borderRadius:9,padding:'8px 12px',fontSize:'.76rem',color:N,fontWeight:700}}>
                      📅 {nextDate.label}: <span style={{color:G}}>{fmt(nextDate.date)}{nextDate.time?` · ${nextDate.time}`:''}</span>
                    </div>
                  )}
                </div>
                <div style={{padding:'10px 20px',background:`${N}08`,borderTop:'1px solid #e8eef6',display:'flex',justifyContent:'flex-end'}}>
                  <span style={{fontSize:'.75rem',fontWeight:700,color:T}}>Read More →</span>
                </div>
              </Link>
            )
          })}
        </div>

        {loaded && filtered.length === 0 && (
          <div style={{textAlign:'center' as const,padding:'60px 20px',color:'#8fa3b8'}}>
            <div style={{fontSize:'3rem',marginBottom:14}}>📭</div>
            <h3 style={{fontFamily:'Sora,sans-serif',color:N,marginBottom:8}}>No articles found</h3>
            <button onClick={()=>{setCat('All');setQ('')}} style={{padding:'9px 20px',borderRadius:99,background:N,color:G,fontWeight:900,border:'none',cursor:'pointer',fontFamily:'Arial Black,sans-serif',fontSize:'.82rem'}}>Clear Filters</button>
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
