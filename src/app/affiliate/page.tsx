'use client'
// src/app/affiliate/page.tsx
// ✅ Affiliate disclosure page (required by law + AdSense policy)
// ✅ Testbook, Adda247, Unacademy, Amazon affiliate links
// ✅ Admin can update links — stored in localStorage
// ✅ Organized by category: Exam Prep, Books, Tools

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

// ── Types ─────────────────────────────────────────────────────────
type AffItem = {
  id: number
  category: string
  title: string
  description: string
  badge: string        // "Best Value", "Top Rated" etc.
  badgeColor: string
  logo: string         // emoji
  logoColor: string
  price: string
  originalPrice?: string
  commission: string   // "Earn ₹300 per sale"
  link: string
  highlights: string[]
  buttonText: string
  buttonColor: string
  tag: string          // "RECOMMENDED" | "POPULAR" | "NEW" | ""
}

// ── Default affiliate items — REPLACE LINKS WITH YOUR AFFILIATE URLs ──
const DEFAULT_ITEMS: AffItem[] = [
  // ── EXAM PREP PLATFORMS ──
  {
    id: 1, category: 'Exam Preparation',
    title: 'Testbook Pass — All Govt Exam Prep',
    description: 'India\'s #1 platform for SSC, Railway, Banking, UPSC, APSC & more. 10,000+ mock tests, live classes, and previous year papers in Assamese + English.',
    badge: 'Best for Assam', badgeColor: T,
    logo: '📚', logoColor: '#1a73e8',
    price: '₹299/month', originalPrice: '₹999/month',
    commission: '💰 You earn ₹200–500 per referral',
    link: 'https://testbook.com/?ref=YOUR_AFFILIATE_ID',   // ← replace with your Testbook affiliate link
    highlights: ['10,000+ Mock Tests', 'Live Classes in Assamese', 'APSC + SLPRB coverage', 'Current Affairs daily'],
    buttonText: 'Start Free Trial →',
    buttonColor: '#1a73e8',
    tag: 'RECOMMENDED',
  },
  {
    id: 2, category: 'Exam Preparation',
    title: 'Adda247 — SSC, Banking & Railway',
    description: 'Trusted by 5 crore+ students. Best for SSC CGL, CHSL, Banking (SBI/IBPS), Railway RRB. Complete study material, video courses, and test series.',
    badge: 'Top Rated', badgeColor: '#e53935',
    logo: '🏆', logoColor: '#e53935',
    price: '₹399/month', originalPrice: '₹1,199/month',
    commission: '💰 You earn ₹250–600 per referral',
    link: 'https://adda247.com/?ref=YOUR_AFFILIATE_ID',    // ← replace with your Adda247 affiliate link
    highlights: ['5 Cr+ Students Trust', 'SSC + Banking + Railway', 'Hindi & English medium', 'Expert faculty'],
    buttonText: 'Enrol Now →',
    buttonColor: '#e53935',
    tag: 'POPULAR',
  },
  {
    id: 3, category: 'Exam Preparation',
    title: 'BYJU\'s Exam Prep (Gradeup)',
    description: 'Comprehensive preparation for UPSC, State PSC, Defence, Teaching (CTET/TET), and Engineering entrance exams with structured courses.',
    badge: 'For UPSC & PSC', badgeColor: '#7b1fa2',
    logo: '🎯', logoColor: '#7b1fa2',
    price: '₹499/month', originalPrice: '₹1,499/month',
    commission: '💰 You earn ₹350–800 per referral',
    link: 'https://byjusexamprep.com/?ref=YOUR_AFFILIATE_ID',
    highlights: ['UPSC + APSC focused', 'Previous year papers', 'Weekly mock tests', 'Expert mentors'],
    buttonText: 'Explore Courses →',
    buttonColor: '#7b1fa2',
    tag: '',
  },
  {
    id: 4, category: 'Exam Preparation',
    title: 'Unacademy — Live + Recorded Classes',
    description: 'India\'s largest learning platform. UPSC, SSC, Railway, JEE, NEET, Banking — live interactive classes with India\'s top educators.',
    badge: 'Live Classes', badgeColor: '#00897b',
    logo: '🎓', logoColor: '#00897b',
    price: '₹599/month', originalPrice: '₹1,799/month',
    commission: '💰 You earn ₹400–900 per referral',
    link: 'https://unacademy.com/?ref=YOUR_AFFILIATE_ID',
    highlights: ['Live interactive classes', 'Top educators', 'JEE + NEET + UPSC', 'Doubt clearing sessions'],
    buttonText: 'Watch Free →',
    buttonColor: '#00897b',
    tag: '',
  },

  // ── BOOKS ──
  {
    id: 5, category: 'Books & Study Material',
    title: 'Assam GK & Current Affairs Book 2026',
    description: 'Essential book for APSC, SLPRB, Assam Police, and all state-level exams. Covers Assam history, geography, culture, economy, and current affairs.',
    badge: 'Must Have', badgeColor: G,
    logo: '📖', logoColor: '#f57c00',
    price: '₹280', originalPrice: '₹350',
    commission: '💰 You earn ₹30–80 per sale (Amazon)',
    link: 'https://amzn.in/d/YOUR_PRODUCT_ID',             // ← replace with Amazon affiliate link
    highlights: ['Assam-specific content', 'Updated for 2026', 'APSC & SLPRB focused', 'Bilingual (En + As)'],
    buttonText: 'Buy on Amazon →',
    buttonColor: '#f57c00',
    tag: 'NEW',
  },
  {
    id: 6, category: 'Books & Study Material',
    title: 'Lucent General Knowledge 2026',
    description: 'The most popular GK book in India for all competitive exams. Used by crores of students for SSC, Railway, Banking, and State PSC exams.',
    badge: 'Bestseller', badgeColor: '#c62828',
    logo: '📕', logoColor: '#c62828',
    price: '₹290', originalPrice: '₹360',
    commission: '💰 You earn ₹30–70 per sale (Amazon)',
    link: 'https://amzn.in/d/YOUR_PRODUCT_ID_2',
    highlights: ['India\'s #1 GK book', 'All subjects covered', 'Updated 2026 edition', 'Available in Hindi & English'],
    buttonText: 'Buy on Amazon →',
    buttonColor: '#c62828',
    tag: 'POPULAR',
  },

  // ── TOOLS & RESOURCES ──
  {
    id: 7, category: 'Tools & Resources',
    title: 'Current Affairs Monthly Magazine',
    description: 'Stay updated with monthly current affairs PDF + printed magazine. Essential for UPSC, APSC, SSC, and all competitive exams. Covers national, international, and Assam current affairs.',
    badge: 'Monthly', badgeColor: '#1565c0',
    logo: '📰', logoColor: '#1565c0',
    price: '₹50/month', originalPrice: '₹80/month',
    commission: '💰 You earn ₹15–40 per subscription',
    link: 'https://YOUR_CURRENT_AFFAIRS_AFFILIATE_LINK',
    highlights: ['National + International', 'Assam current affairs', 'Monthly PDF + print', 'MCQ practice included'],
    buttonText: 'Subscribe Now →',
    buttonColor: '#1565c0',
    tag: '',
  },
  {
    id: 8, category: 'Tools & Resources',
    title: 'Amazon Prime Student — 6 Months Free',
    description: 'Get 6 months of Amazon Prime FREE for students. Access Prime Reading (1000s of books), Prime Video, and fast delivery on study materials.',
    badge: '6 Months Free', badgeColor: '#f57c00',
    logo: '🛒', logoColor: '#f57c00',
    price: 'FREE for 6 months', originalPrice: '₹599',
    commission: '💰 You earn ₹100–200 per signup',
    link: 'https://amzn.in/d/prime-student-YOUR_ID',
    highlights: ['6 months completely free', 'Prime Reading included', '1000s of books', 'Fast delivery'],
    buttonText: 'Claim Free Trial →',
    buttonColor: '#f57c00',
    tag: 'RECOMMENDED',
  },
]

const CATEGORIES = ['All', 'Exam Preparation', 'Books & Study Material', 'Tools & Resources']
const CAT_ICONS: Record<string, string> = {
  'All': '⭐',
  'Exam Preparation': '📚',
  'Books & Study Material': '📖',
  'Tools & Resources': '🛠️',
}

export default function AffiliatePage() {
  const [cat, setCat]     = useState('All')
  const [items, setItems] = useState<AffItem[]>(DEFAULT_ITEMS)

  useEffect(() => {
    // Admin can override items via localStorage (from admin panel)
    try {
      const saved = localStorage.getItem('acp_affiliate_v1')
      if (saved) setItems(JSON.parse(saved))
    } catch { /* use defaults */ }
  }, [])

  const visible = cat === 'All' ? items : items.filter(i => i.category === cat)

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800&family=Nunito:wght@400;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        html, body { margin: 0; font-family: Nunito, sans-serif; background: #f0f4f8; color: #1a1a2e; overflow-x: hidden; }
        .nav-a { color: rgba(255,255,255,.6); font-size:.82rem; font-weight:700; padding:7px 11px; border-radius:8px; text-decoration:none; white-space:nowrap; }
        .nav-a:hover { color: ${G}; }
        .cat-btn { padding:8px 15px; border-radius:99px; font-size:.78rem; font-weight:700; cursor:pointer; border:1.5px solid #d4e0ec; background:#fff; color:#5a6a7a; font-family:Nunito,sans-serif; transition:.15s; }
        .cat-btn.on { background:${N}; color:${G}; border-color:${G}; }
        .cat-btn:hover:not(.on) { border-color:${T}; color:${T}; }
        .acard { background:#fff; border:1.5px solid #d4e0ec; border-radius:16px; overflow:hidden; display:flex; flex-direction:column; transition:.2s; }
        .acard:hover { transform:translateY(-4px); box-shadow:0 12px 36px rgba(0,0,0,.11); }
        .grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(320px,1fr)); gap:20px; }
        .hi-chip { display:inline-flex; align-items:center; gap:5px; background:#f0f4f8; border-radius:99px; padding:3px 10px; font-size:.7rem; font-weight:700; color:#3a4a5a; }
        @media(max-width:700px) { .grid{grid-template-columns:1fr!important} }
      `}</style>

      {/* HEADER */}
      <header style={{ background:N, borderBottom:`2px solid ${G}`, position:'sticky', top:0, zIndex:100, boxShadow:'0 2px 20px rgba(0,0,0,.4)' }}>
        <div style={{ maxWidth:1180, margin:'0 auto', padding:'10px 20px', display:'flex', alignItems:'center', gap:14 }}>
          <Link href="/" style={{ display:'flex', alignItems:'center', gap:10, textDecoration:'none', flexShrink:0 }}>
            <Logo size={40} />
            <div>
              <div style={{ fontFamily:'Arial Black,sans-serif', fontSize:'.78rem', fontWeight:900 }}>
                <span style={{color:G}}>ASSAM </span><span style={{color:W}}>CAREER</span>
              </div>
              <div style={{ fontFamily:'Arial Black,sans-serif', fontSize:'.65rem', color:T, letterSpacing:'.12em' }}>◆ POINT ◆</div>
            </div>
          </Link>
          <nav style={{ display:'flex', gap:2, marginLeft:10 }}>
            {[['🏠 Home','/'],['💼 Jobs','/govt-jobs'],['📚 Exams','/exams'],['ℹ️ Info','/information']].map(([l,h])=>(
              <Link key={h} href={h} className="nav-a">{l}</Link>
            ))}
          </nav>
        </div>
      </header>

      {/* HERO */}
      <div style={{ background:`linear-gradient(135deg,${N},#0a3050,${N})`, padding:'44px 20px 36px', textAlign:'center' }}>
        <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:`${G}22`, border:`1px solid ${G}44`, borderRadius:99, padding:'5px 16px', fontSize:'.75rem', fontWeight:700, color:G, marginBottom:16, letterSpacing:'.04em' }}>
          🤝 AFFILIATE PARTNERS
        </div>
        <h1 style={{ fontFamily:'Sora,sans-serif', fontWeight:800, fontSize:'clamp(1.5rem,3.5vw,2.3rem)', color:W, marginBottom:12 }}>
          Recommended Courses & Resources
        </h1>
        <p style={{ color:'rgba(255,255,255,.55)', fontSize:'.95rem', maxWidth:560, margin:'0 auto 10px', lineHeight:1.75 }}>
          Hand-picked study materials, exam prep platforms, and books trusted by lakhs of government job aspirants across India.
        </p>

        {/* Disclosure banner */}
        <div style={{ maxWidth:640, margin:'20px auto 0', background:'rgba(255,255,255,.07)', border:'1px solid rgba(255,255,255,.12)', borderRadius:10, padding:'11px 18px', fontSize:'.78rem', color:'rgba(255,255,255,.5)', lineHeight:1.7 }}>
          <strong style={{color:`${G}cc`}}>📢 Affiliate Disclosure:</strong> Some links on this page are affiliate links. If you click and make a purchase, we earn a small commission at <strong style={{color:W}}>no extra cost to you</strong>. This helps us keep the portal free. We only recommend products we genuinely believe are useful.
        </div>
      </div>

      {/* STATS BAR */}
      <div style={{ background:G, padding:'14px 20px' }}>
        <div style={{ maxWidth:900, margin:'0 auto', display:'flex', justifyContent:'space-around', flexWrap:'wrap' as const, gap:10 }}>
          {[['₹0 Extra Cost','You pay the same price'],['Verified Platforms','All links checked manually'],['Instant Access','Most platforms start immediately'],['Best Discounts','Exclusive deals for ACPI readers']].map(([v,l])=>(
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
              {CAT_ICONS[c]} {c} {cat!=='All'&&c==='All'?'':''}{c!=='All'?`(${items.filter(i=>i.category===c).length})`:``}
            </button>
          ))}
          <span style={{ marginLeft:'auto', fontSize:'.76rem', color:'#8fa3b8' }}>{visible.length} resources shown</span>
        </div>

        {/* Cards Grid */}
        <div className="grid">
          {visible.map(item => (
            <div key={item.id} className="acard">

              {/* Tag ribbon */}
              {item.tag && (
                <div style={{ background: item.tag==='RECOMMENDED'?T:item.tag==='POPULAR'?'#e53935':item.tag==='NEW'?G:'#5a6a7a', color: item.tag==='NEW'?N:W, padding:'5px 14px', fontSize:'.67rem', fontWeight:900, letterSpacing:'.08em', textAlign:'center' as const }}>
                  {item.tag==='RECOMMENDED'?'⭐ RECOMMENDED BY ACPI':item.tag==='POPULAR'?'🔥 MOST POPULAR':item.tag==='NEW'?'✨ NEW':''}
                </div>
              )}

              {/* Card header */}
              <div style={{ padding:'20px 20px 0' }}>
                <div style={{ display:'flex', gap:14, alignItems:'flex-start', marginBottom:14 }}>
                  <div style={{ width:54, height:54, borderRadius:13, background:`${item.logoColor}18`, border:`2px solid ${item.logoColor}44`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.7rem', flexShrink:0 }}>
                    {item.logo}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:5, flexWrap:'wrap' as const }}>
                      <span style={{ background:`${item.badgeColor}22`, color:item.badgeColor, border:`1px solid ${item.badgeColor}44`, padding:'2px 9px', borderRadius:99, fontSize:'.68rem', fontWeight:800 }}>{item.badge}</span>
                      <span style={{ background:'#f0f4f8', color:'#5a6a7a', padding:'2px 9px', borderRadius:99, fontSize:'.67rem', fontWeight:700 }}>{item.category}</span>
                    </div>
                    <h3 style={{ fontFamily:'Sora,sans-serif', fontWeight:700, fontSize:'.92rem', color:N, lineHeight:1.35, margin:0 }}>{item.title}</h3>
                  </div>
                </div>

                <p style={{ fontSize:'.83rem', color:'#4a5a6a', lineHeight:1.75, marginBottom:14 }}>{item.description}</p>

                {/* Highlights */}
                <div style={{ display:'flex', flexWrap:'wrap' as const, gap:6, marginBottom:14 }}>
                  {item.highlights.map(h => (
                    <span key={h} className="hi-chip">✓ {h}</span>
                  ))}
                </div>
              </div>

              {/* Price + Commission */}
              <div style={{ margin:'0 20px 16px', background:`${N}08`, border:`1px solid ${N}12`, borderRadius:10, padding:'12px 14px' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap' as const, gap:8 }}>
                  <div>
                    <span style={{ fontFamily:'Arial Black,sans-serif', fontWeight:900, fontSize:'1.1rem', color:N }}>{item.price}</span>
                    {item.originalPrice && (
                      <span style={{ fontSize:'.77rem', color:'#9a9a9a', textDecoration:'line-through', marginLeft:8 }}>{item.originalPrice}</span>
                    )}
                  </div>
                  <div style={{ fontSize:'.72rem', color:T, fontWeight:700, background:`${T}15`, padding:'4px 10px', borderRadius:99, border:`1px solid ${T}44` }}>
                    {item.commission}
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <div style={{ padding:'0 20px 20px', marginTop:'auto' }}>
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer nofollow sponsored"
                  style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8, padding:'13px', borderRadius:10, background:item.buttonColor, color:'#fff', fontWeight:900, fontSize:'.88rem', textDecoration:'none', fontFamily:'Arial Black,sans-serif', letterSpacing:'.02em' }}
                >
                  {item.buttonText}
                </a>
                <div style={{ textAlign:'center' as const, marginTop:7, fontSize:'.65rem', color:'#a0b0c0' }}>
                  🔗 Affiliate link — you pay the same price
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* HOW IT WORKS */}
        <div style={{ background:N, borderRadius:16, padding:'28px 32px', marginTop:36, border:`2px solid ${G}` }}>
          <h2 style={{ fontFamily:'Sora,sans-serif', fontWeight:800, fontSize:'1.1rem', color:G, marginBottom:22, textAlign:'center' as const }}>
            🤝 How Our Affiliate Programme Works
          </h2>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:20 }}>
            {[
              { n:'1', t:'You Click a Link',         d:'You click any "Buy Now" or "Enrol" button on this page',         e:'👆' },
              { n:'2', t:'You Make a Purchase',      d:'You buy the course or book at the normal price — no markup',      e:'🛒' },
              { n:'3', t:'We Earn a Commission',     d:'The platform pays us a small referral fee (5–15% typically)',     e:'💰' },
              { n:'4', t:'We Keep ACPI Free',        d:'This commission helps us keep all job & exam content 100% free',  e:'🆓' },
            ].map(s => (
              <div key={s.n} style={{ textAlign:'center' as const }}>
                <div style={{ width:48, height:48, borderRadius:'50%', background:`${G}22`, border:`2px solid ${G}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.4rem', margin:'0 auto 10px' }}>{s.e}</div>
                <div style={{ fontFamily:'Arial Black,sans-serif', color:G, fontSize:'.78rem', letterSpacing:'.04em', marginBottom:6 }}>STEP {s.n}: {s.t.toUpperCase()}</div>
                <div style={{ fontSize:'.79rem', color:'rgba(255,255,255,.55)', lineHeight:1.7 }}>{s.d}</div>
              </div>
            ))}
          </div>
        </div>

        {/* BECOME A PARTNER */}
        <div style={{ background:'#fff', border:`2px dashed ${G}`, borderRadius:16, padding:'26px', marginTop:22, textAlign:'center' as const }}>
          <div style={{ fontSize:'2rem', marginBottom:10 }}>📢</div>
          <h2 style={{ fontFamily:'Sora,sans-serif', fontWeight:800, fontSize:'1.05rem', color:N, marginBottom:10 }}>
            Are You an Exam Prep Platform or Publisher?
          </h2>
          <p style={{ fontSize:'.87rem', color:'#4a5a6a', lineHeight:1.75, marginBottom:18, maxWidth:520, margin:'0 auto 18px' }}>
            If you offer courses, books, or tools for government job aspirants in Assam and NE India, we'd love to partner with you. We reach thousands of active job seekers every day.
          </p>
          <Link href="/contact?subject=Affiliate+Partnership" style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'12px 26px', borderRadius:99, background:N, border:`2px solid ${G}`, color:G, fontWeight:900, fontSize:'.88rem', textDecoration:'none', fontFamily:'Arial Black,sans-serif' }}>
            🤝 Partner With Us
          </Link>
        </div>

      </div>

      {/* FOOTER */}
      <footer style={{ background:N, borderTop:`3px solid ${G}`, padding:'18px', textAlign:'center' as const }}>
        <div style={{ fontSize:'.72rem', color:'rgba(255,255,255,.3)', marginBottom:6 }}>
          ⚠️ Affiliate Disclosure: We earn commissions on qualifying purchases. All recommendations are genuine.
        </div>
        <div style={{ fontSize:'.72rem', color:'rgba(255,255,255,.25)' }}>
          © 2025–2026 Assam Career Point & Info ·{' '}
          {[['Privacy','/privacy-policy'],['About','/about-us'],['Contact','/contact'],['Home','/']].map(([l,h])=>(
            <span key={h}><Link href={h} style={{color:`${G}77`,textDecoration:'none'}}>{l}</Link> · </span>
          ))}
        </div>
      </footer>
    </>
  )
}
