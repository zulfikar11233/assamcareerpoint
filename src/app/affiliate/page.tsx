'use client'
export const dynamic = 'force-dynamic'
import Link from 'next/link'
import { useState, useEffect } from 'react'

const G = '#c9a227', T = '#1dbfad', N = '#0b1f33', W = '#ffffff'

function Logo({ size = 38 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs><linearGradient id="lg4" x1="30" y1="15" x2="70" y2="55" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor={T} /><stop offset="100%" stopColor={G} />
      </linearGradient></defs>
      <circle cx="50" cy="50" r="47" fill={N} stroke={G} strokeWidth="3" />
      <circle cx="50" cy="50" r="41" fill="none" stroke={T} strokeWidth="0.6" opacity="0.5" />
      <rect x="33" y="16" width="34" height="34" rx="8" fill="url(#lg4)" />
      <circle cx="50" cy="33" r="10" stroke={N} strokeWidth="2.2" fill="none" />
      <circle cx="50" cy="33" r="5.5" stroke={N} strokeWidth="2" fill="none" />
      <circle cx="50" cy="33" r="2" fill={N} />
      <text x="50" y="66" textAnchor="middle" fontFamily="Arial Black,sans-serif" fontWeight="900" fontSize="10.5" fill={G} letterSpacing="1.5">ASSAM</text>
      <text x="50" y="77" textAnchor="middle" fontFamily="Arial Black,sans-serif" fontWeight="900" fontSize="10.5" fill={W}>CAREER</text>
      <line x1="22" y1="80" x2="78" y2="80" stroke={T} strokeWidth="0.8" />
      <text x="27" y="90" textAnchor="middle" fontSize="5" fill={T}>◆</text>
      <text x="50" y="90" textAnchor="middle" fontFamily="Arial,sans-serif" fontWeight="700" fontSize="8" fill={T} letterSpacing="2">POINT</text>
      <text x="73" y="90" textAnchor="middle" fontSize="5" fill={T}>◆</text>
    </svg>
  )
}

type AffItem = {
  id: number
  category: string
  title: string
  description: string
  badge: string
  badgeColor: string
  logo: string
  logoColor: string
  price: string
  originalPrice?: string
  commission: string
  link: string
  highlights: string[]
  buttonText: string
  buttonColor: string
  tag: string
  active?: boolean  // ✅ respect active flag
}

const CATEGORIES = ['All', 'Exam Preparation', 'Books & Study Material', 'Tools & Resources']
const CAT_ICONS: Record<string, string> = {
  'All': '⭐', 'Exam Preparation': '📚',
  'Books & Study Material': '📖', 'Tools & Resources': '🛠️',
}

export default function AffiliatePage() {
  const [cat,   setCat]   = useState('All')
  const [items, setItems] = useState<AffItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // ✅ Always fetch fresh — no cache
    fetch('/api/data/affiliate', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          // ✅ ONLY show items where active !== false
          setItems(data.filter((i: AffItem) => i.active !== false))
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  // Filter by category
  const visible = items.filter(i => cat === 'All' || i.category === cat)

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800&family=Nunito:wght@400;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        html, body { margin: 0; font-family: Nunito, sans-serif; background: #f0f4f8; color: #1a1a2e; overflow-x: hidden; max-width:100vw; }
        .nav-a { color: rgba(255,255,255,.6); font-size:.82rem; font-weight:700; padding:7px 11px; border-radius:8px; text-decoration:none; white-space:nowrap; }
        .nav-a:hover { color: ${G}; }
        .cat-btn { padding:8px 15px; border-radius:99px; font-size:.78rem; font-weight:700; cursor:pointer; border:1.5px solid #d4e0ec; background:#fff; color:#5a6a7a; font-family:Nunito,sans-serif; transition:.15s; }
        .cat-btn.on { background:${N}; color:${G}; border-color:${G}; }
        .cat-btn:hover:not(.on) { border-color:${T}; color:${T}; }
        .acard { background:#fff; border:1.5px solid #d4e0ec; border-radius:16px; overflow:hidden; display:flex; flex-direction:column; transition:.2s; }
        .acard:hover { transform:translateY(-4px); box-shadow:0 12px 36px rgba(0,0,0,.11); }
        .grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(300px,1fr)); gap:20px; }
        .hi-chip { display:inline-flex; align-items:center; gap:5px; background:#f0f4f8; border-radius:99px; padding:3px 10px; font-size:.7rem; font-weight:700; color:#3a4a5a; }
        @keyframes spin { to{transform:rotate(360deg)} }
        @media(max-width:700px) { .grid{grid-template-columns:1fr!important} }
      `}</style>

      {/* HEADER */}
      <header style={{ background:N, borderBottom:`2px solid ${G}`, position:'sticky', top:0, zIndex:100, boxShadow:'0 2px 20px rgba(0,0,0,.4)' }}>
        <div style={{ maxWidth:1180, margin:'0 auto', padding:'10px 20px', display:'flex', alignItems:'center', gap:14, flexWrap:'wrap' as const }}>
          <Link href="/" style={{ display:'flex', alignItems:'center', gap:10, textDecoration:'none', flexShrink:0 }}>
            <Logo size={40} />
            <div>
              <div style={{ fontFamily:'Arial Black,sans-serif', fontSize:'.78rem', fontWeight:900 }}>
                <span style={{color:G}}>ASSAM </span><span style={{color:W}}>CAREER</span>
              </div>
              <div style={{ fontFamily:'Arial Black,sans-serif', fontSize:'.65rem', color:T, letterSpacing:'.12em' }}>◆ POINT ◆</div>
            </div>
          </Link>
          <nav style={{ display:'flex', gap:2, flexWrap:'wrap' as const }}>
            {([['🏠 Home','/'],['💼 Jobs','/govt-jobs'],['📚 Exams','/exams'],['ℹ️ Info','/information']] as [string,string][]).map(([l,h])=>(
              <Link key={h} href={h} className="nav-a">{l}</Link>
            ))}
          </nav>
        </div>
      </header>

      {/* HERO */}
      <div style={{ background:`linear-gradient(135deg,${N},#0a3050,${N})`, padding:'44px 20px 36px', textAlign:'center' as const }}>
        <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:`${G}22`, border:`1px solid ${G}44`, borderRadius:99, padding:'5px 16px', fontSize:'.75rem', fontWeight:700, color:G, marginBottom:16 }}>
          🤝 AFFILIATE PARTNERS
        </div>
        <h1 style={{ fontFamily:'Sora,sans-serif', fontWeight:800, fontSize:'clamp(1.5rem,3.5vw,2.3rem)', color:W, marginBottom:12 }}>
          Recommended Courses & Resources
        </h1>
        <p style={{ color:'rgba(255,255,255,.55)', fontSize:'.95rem', maxWidth:560, margin:'0 auto 10px', lineHeight:1.75 }}>
          Hand-picked study materials, exam prep platforms, and books trusted by government job aspirants across India.
        </p>
        <div style={{ maxWidth:640, margin:'20px auto 0', background:'rgba(255,255,255,.07)', border:'1px solid rgba(255,255,255,.12)', borderRadius:10, padding:'11px 18px', fontSize:'.78rem', color:'rgba(255,255,255,.5)', lineHeight:1.7 }}>
          <strong style={{color:`${G}cc`}}>📢 Affiliate Disclosure:</strong> Some links are affiliate links. If you purchase, we earn a small commission at <strong style={{color:W}}>no extra cost to you</strong>.
        </div>
      </div>

      {/* STATS BAR */}
      <div style={{ background:G, padding:'14px 20px' }}>
        <div style={{ maxWidth:900, margin:'0 auto', display:'flex', justifyContent:'space-around', flexWrap:'wrap' as const, gap:10 }}>
          {[['₹0 Extra Cost','You pay the same price'],['Verified Platforms','All links checked'],['Instant Access','Start immediately'],['Best Discounts','Exclusive deals']].map(([v,l])=>(
            <div key={v} style={{ textAlign:'center' as const }}>
              <div style={{ fontFamily:'Arial Black,sans-serif', fontWeight:900, fontSize:'.9rem', color:N }}>{v}</div>
              <div style={{ fontSize:'.68rem', color:`${N}99` }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth:1180, margin:'0 auto', padding:'28px 20px 60px' }}>

        {/* Category Filter */}
        <div style={{ background:'#fff', border:'1.5px solid #d4e0ec', borderRadius:12, padding:'16px 20px', marginBottom:24, display:'flex', gap:9, flexWrap:'wrap' as const, alignItems:'center' }}>
          <span style={{ fontSize:'.76rem', fontWeight:700, color:'#5a6a7a', marginRight:4 }}>Filter:</span>
          {CATEGORIES.map(c => (
            <button key={c} className={`cat-btn ${cat===c?'on':''}`} onClick={()=>setCat(c)}>
              {CAT_ICONS[c]} {c}
            </button>
          ))}
          <span style={{ marginLeft:'auto', fontSize:'.76rem', color:'#8fa3b8' }}>{visible.length} resources</span>
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ textAlign:'center' as const, padding:'60px', color:'#8fa3b8' }}>
            <div style={{ width:32,height:32,border:'3px solid #d4e0ec',borderTopColor:T,borderRadius:'50%',animation:'spin 1s linear infinite',margin:'0 auto 12px' }}/>
            Loading resources...
          </div>
        )}

        {/* Empty state */}
        {!loading && visible.length === 0 && (
          <div style={{ textAlign:'center' as const, padding:'60px 20px', color:'#8fa3b8' }}>
            <div style={{ fontSize:'2.5rem', marginBottom:12 }}>📭</div>
            <div style={{ fontWeight:700, fontSize:'1rem' }}>No resources available yet</div>
            <div style={{ fontSize:'.84rem', marginTop:6 }}>Check back soon!</div>
          </div>
        )}

        {/* Cards Grid */}
        {!loading && visible.length > 0 && (
          <div className="grid">
            {visible.map(item => (
              <div key={item.id} className="acard">
                {item.tag && (
                  <div style={{ background: item.tag==='RECOMMENDED'?T:item.tag==='POPULAR'?'#e53935':item.tag==='NEW'?G:'#5a6a7a', color: item.tag==='NEW'?N:W, padding:'5px 14px', fontSize:'.67rem', fontWeight:900, letterSpacing:'.08em', textAlign:'center' as const }}>
                    {item.tag==='RECOMMENDED'?'⭐ RECOMMENDED':item.tag==='POPULAR'?'🔥 MOST POPULAR':item.tag==='NEW'?'✨ NEW':''}
                  </div>
                )}
                <div style={{ padding:'20px 20px 0' }}>
                  <div style={{ display:'flex', gap:14, alignItems:'flex-start', marginBottom:14 }}>
                    <div style={{ width:54, height:54, borderRadius:13, background:`${item.logoColor||'#0096b7'}18`, border:`2px solid ${item.logoColor||'#0096b7'}44`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.7rem', flexShrink:0 }}>
                      {item.logo}
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:5, flexWrap:'wrap' as const }}>
                        {item.badge && <span style={{ background:`${item.badgeColor||G}22`, color:item.badgeColor||G, border:`1px solid ${item.badgeColor||G}44`, padding:'2px 9px', borderRadius:99, fontSize:'.68rem', fontWeight:800 }}>{item.badge}</span>}
                        <span style={{ background:'#f0f4f8', color:'#5a6a7a', padding:'2px 9px', borderRadius:99, fontSize:'.67rem', fontWeight:700 }}>{item.category}</span>
                      </div>
                      <h3 style={{ fontFamily:'Sora,sans-serif', fontWeight:700, fontSize:'.92rem', color:N, lineHeight:1.35, margin:0 }}>{item.title}</h3>
                    </div>
                  </div>
                  <p style={{ fontSize:'.83rem', color:'#4a5a6a', lineHeight:1.75, marginBottom:14 }}>{item.description}</p>
                  {item.highlights?.length > 0 && (
                    <div style={{ display:'flex', flexWrap:'wrap' as const, gap:6, marginBottom:14 }}>
                      {item.highlights.map((h,i) => <span key={i} className="hi-chip">✓ {h}</span>)}
                    </div>
                  )}
                </div>
                <div style={{ margin:'0 20px 16px', background:`${N}08`, border:`1px solid ${N}12`, borderRadius:10, padding:'12px 14px' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap' as const, gap:8 }}>
                    <div>
                      <span style={{ fontFamily:'Arial Black,sans-serif', fontWeight:900, fontSize:'1.1rem', color:N }}>{item.price}</span>
                      {item.originalPrice && <span style={{ fontSize:'.77rem', color:'#9a9a9a', textDecoration:'line-through', marginLeft:8 }}>{item.originalPrice}</span>}
                    </div>
                    {item.commission && <div style={{ fontSize:'.72rem', color:T, fontWeight:700, background:`${T}15`, padding:'4px 10px', borderRadius:99 }}>{item.commission}</div>}
                  </div>
                </div>
                <div style={{ padding:'0 20px 20px', marginTop:'auto' }}>
                  <a href={item.link} target="_blank" rel="noopener noreferrer nofollow sponsored"
                    style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8, padding:'13px', borderRadius:10, background:item.buttonColor||N, color:'#fff', fontWeight:900, fontSize:'.88rem', textDecoration:'none', fontFamily:'Arial Black,sans-serif' }}>
                    {item.buttonText || 'Learn More →'}
                  </a>
                  <div style={{ textAlign:'center' as const, marginTop:7, fontSize:'.65rem', color:'#a0b0c0' }}>
                    🔗 Affiliate link — you pay the same price
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* HOW IT WORKS */}
        <div style={{ background:N, borderRadius:16, padding:'28px 24px', marginTop:36, border:`2px solid ${G}` }}>
          <h2 style={{ fontFamily:'Sora,sans-serif', fontWeight:800, fontSize:'1.05rem', color:G, marginBottom:20, textAlign:'center' as const }}>🤝 How Our Affiliate Programme Works</h2>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:18 }}>
            {[
              {n:'1',t:'You Click a Link',e:'👆',d:'Click any button on this page'},
              {n:'2',t:'You Purchase',e:'🛒',d:'Pay the normal price — no extra charge'},
              {n:'3',t:'We Earn Commission',e:'💰',d:'Platform pays us 5–15% referral fee'},
              {n:'4',t:'ACPI Stays Free',e:'🆓',d:'This keeps all job & exam content free'},
            ].map(s=>(
              <div key={s.n} style={{ textAlign:'center' as const }}>
                <div style={{ width:44,height:44,borderRadius:'50%',background:`${G}22`,border:`2px solid ${G}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.3rem',margin:'0 auto 10px' }}>{s.e}</div>
                <div style={{ fontFamily:'Arial Black,sans-serif',color:G,fontSize:'.76rem',marginBottom:5 }}>STEP {s.n}</div>
                <div style={{ fontFamily:'Sora,sans-serif',fontWeight:700,fontSize:'.82rem',color:W,marginBottom:4 }}>{s.t}</div>
                <div style={{ fontSize:'.77rem',color:'rgba(255,255,255,.5)',lineHeight:1.6 }}>{s.d}</div>
              </div>
            ))}
          </div>
        </div>

        {/* PARTNER CTA */}
        <div style={{ background:'#fff', border:`2px dashed ${G}`, borderRadius:16, padding:'26px', marginTop:22, textAlign:'center' as const }}>
          <div style={{ fontSize:'2rem', marginBottom:10 }}>📢</div>
          <h2 style={{ fontFamily:'Sora,sans-serif', fontWeight:800, fontSize:'1.05rem', color:N, marginBottom:10 }}>Are You an Exam Prep Platform or Publisher?</h2>
          <p style={{ fontSize:'.87rem', color:'#4a5a6a', lineHeight:1.75, marginBottom:18, maxWidth:520, margin:'0 auto 18px' }}>
            Partner with us to reach thousands of active job seekers in Assam & NE India.
          </p>
          <Link href="/contact" style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'12px 26px', borderRadius:99, background:N, border:`2px solid ${G}`, color:G, fontWeight:900, fontSize:'.88rem', textDecoration:'none', fontFamily:'Arial Black,sans-serif' }}>
            🤝 Partner With Us
          </Link>
        </div>
      </div>

      <footer style={{ background:N, borderTop:`3px solid ${G}`, padding:'18px', textAlign:'center' as const }}>
        <div style={{ fontSize:'.72rem', color:'rgba(255,255,255,.3)', marginBottom:6 }}>
          ⚠️ Affiliate Disclosure: We earn commissions on qualifying purchases.
        </div>
        <div style={{ fontSize:'.72rem', color:'rgba(255,255,255,.25)' }}>
          © 2025–2026 Assam Career Point & Info ·{' '}
          {([['Privacy','/privacy-policy'],['About','/about-us'],['Contact','/contact'],['Home','/']] as [string,string][]).map(([l,h])=>(
            <span key={h}><Link href={h} style={{color:`${G}77`,textDecoration:'none'}}>{l}</Link> · </span>
          ))}
        </div>
      </footer>
    </>
  )
}
