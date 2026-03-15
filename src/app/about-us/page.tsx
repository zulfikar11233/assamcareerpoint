'use client'
// src/app/about-us/page.tsx
// ✅ Required by Google AdSense
// ✅ Builds trust with visitors and Google
// ✅ Tells your story — update the details to match yours

import Link from 'next/link'

const G = '#c9a227', T = '#1dbfad', N = '#0b1f33', W = '#ffffff'

function Logo({ size = 38 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs><linearGradient id="lg2" x1="30" y1="15" x2="70" y2="55" gradientUnits="userSpaceOnUse"><stop offset="0%" stopColor={T} /><stop offset="100%" stopColor={G} /></linearGradient></defs>
      <circle cx="50" cy="50" r="47" fill={N} stroke={G} strokeWidth="3" />
      <circle cx="50" cy="50" r="41" fill="none" stroke={T} strokeWidth="0.6" opacity="0.5" />
      <rect x="33" y="16" width="34" height="34" rx="8" fill="url(#lg2)" />
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

const stats = [
  { n: '1,200+', l: 'Job Listings', e: '💼' },
  { n: '85+',    l: 'Exam Updates', e: '📚' },
  { n: '50+',    l: 'Info Articles', e: 'ℹ️' },
  { n: '1 Lakh+',l: 'Monthly Users', e: '👥' },
]

const values = [
  { e: '🎯', t: 'Accuracy First',    d: 'We only publish verified information from official government websites. We never spread rumours or unconfirmed news about job vacancies.' },
  { e: '⚡', t: 'Daily Updates',     d: 'Our team monitors SLPRB, APSC, SSC, Railway, Banking and other official portals every day to bring you the latest notifications.' },
  { e: '🆓', t: '100% Free',         d: 'All job information, exam alerts, and important dates are completely free. We believe every job seeker in Assam deserves equal access to opportunities.' },
  { e: '🌏', t: 'Local Focus',       d: 'We understand Assam. We cover BTC, district-level, SLPRB, APSC, and NE India jobs that big national portals often miss.' },
  { e: '📱', t: 'Mobile Friendly',   d: 'Over 85% of our users are on mobile phones. Every page is designed to load fast and look perfect on your smartphone.' },
  { e: '🗣️', t: 'Bilingual',        d: 'We support both English and Assamese (অসমীয়া) so no language barrier stops anyone from finding their dream government job.' },
]

const team = [
  { n: 'Founder & Editor',    r: 'Portal Creator',                d: 'From Assam, passionate about helping youth find government jobs. Monitors 20+ official portals daily to keep content updated.',    e: '👨‍💻' },
  { n: 'Content Team',        r: 'Job & Exam Research',           d: 'A team of dedicated researchers who verify every job notification against official sources before publishing.',                    e: '📝' },
  { n: 'Technical Support',   r: 'Website & App Management',      d: 'Ensures the portal is always fast, secure, and accessible — even on slow 2G/3G connections in rural Assam.',                     e: '⚙️' },
]

export default function AboutUs() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800&family=Nunito:wght@400;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        html, body { margin: 0; font-family: Nunito, sans-serif; background: #f0f4f8; color: #1a1a2e; overflow-x: hidden; }
        .nav-a { color: rgba(255,255,255,.6); font-size: .82rem; font-weight: 700; padding: 7px 11px; border-radius: 8px; text-decoration: none; white-space: nowrap; }
        .nav-a:hover { color: ${G}; }
        .card { background: #fff; border: 1.5px solid #d4e0ec; border-radius: 14px; padding: 22px; }
        .val-card { background: #fff; border: 1.5px solid #d4e0ec; border-radius: 13px; padding: 20px; transition: .2s; }
        .val-card:hover { transform: translateY(-3px); box-shadow: 0 8px 28px rgba(0,0,0,.09); }
        .tm-card { background: ${N}; border: 2px solid ${G}44; border-radius: 14px; padding: 22px; text-align: center; }
        @media(max-width:700px){ .g2,.g3,.g4{grid-template-columns:1fr!important} }
      `}</style>

      {/* HEADER */}
      <header style={{ background: N, borderBottom: `2px solid ${G}`, position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 20px rgba(0,0,0,.4)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '10px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', flexShrink: 0 }}>
            <Logo size={40} />
            <div>
              <div style={{ fontFamily: 'Arial Black, sans-serif', fontSize: '.78rem', fontWeight: 900 }}>
                <span style={{ color: G }}>ASSAM </span><span style={{ color: W }}>CAREER</span>
              </div>
              <div style={{ fontFamily: 'Arial Black, sans-serif', fontSize: '.65rem', color: T, letterSpacing: '.12em' }}>◆ POINT ◆</div>
            </div>
          </Link>
          <nav style={{ display: 'flex', gap: 2, marginLeft: 10 }}>
            {[['🏠 Home', '/'], ['💼 Jobs', '/govt-jobs'], ['📚 Exams', '/exams'], ['ℹ️ Info', '/information']].map(([l, h]) => (
              <Link key={h} href={h} className="nav-a">{l}</Link>
            ))}
          </nav>
        </div>
      </header>

      {/* HERO */}
      <div style={{ background: `linear-gradient(135deg, ${N} 0%, #0a3050 60%, ${N} 100%)`, padding: '50px 20px 44px', textAlign: 'center' }}>
        <Logo size={70} />
        <h1 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 800, fontSize: 'clamp(1.6rem,4vw,2.5rem)', color: W, margin: '16px 0 10px', lineHeight: 1.2 }}>
          <span style={{ color: G }}>Assam</span> Career<br />
          <span style={{ color: T }}>Point & Info</span>
        </h1>
        <p style={{ color: 'rgba(255,255,255,.6)', fontSize: '1rem', maxWidth: 520, margin: '0 auto 20px', lineHeight: 1.7 }}>
          Assam's most trusted portal for Government Jobs, Competitive Exams, and Important Government Information — updated every single day.
        </p>
        <div style={{ fontSize: '.75rem', color: `${G}aa`, fontWeight: 700, letterSpacing: '.06em' }}>
          assamcareerpoint-info.com
        </div>
      </div>

      {/* STATS */}
      <div style={{ background: G, padding: '22px 20px' }}>
        <div className="g4" style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
          {stats.map(s => (
            <div key={s.l} style={{ textAlign: 'center' as const }}>
              <div style={{ fontSize: '1.6rem', marginBottom: 4 }}>{s.e}</div>
              <div style={{ fontFamily: 'Arial Black, sans-serif', fontWeight: 900, fontSize: '1.4rem', color: N }}>{s.n}</div>
              <div style={{ fontSize: '.75rem', color: `${N}cc`, fontWeight: 700 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '36px 20px 60px' }}>

        {/* OUR STORY */}
        <div className="card" style={{ marginBottom: 24, borderLeft: `5px solid ${G}` }}>
          <h2 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 800, fontSize: '1.2rem', color: N, marginBottom: 16 }}>
            📖 Our Story
          </h2>
          <p style={{ fontSize: '.9rem', lineHeight: 1.9, color: '#2a3a4a', marginBottom: 14 }}>
            <strong>Assam Career Point & Info</strong> was created with one simple mission: <em>"No job seeker in Assam should miss a government job opportunity just because they didn't know about it."</em>
          </p>
          <p style={{ fontSize: '.9rem', lineHeight: 1.9, color: '#2a3a4a', marginBottom: 14 }}>
            Every year, thousands of young people in Assam miss job application deadlines because they couldn't find the right information on time. Official websites are hard to navigate. News comes too late. Important dates get buried in long PDFs. We built this portal to solve exactly that problem.
          </p>
          <p style={{ fontSize: '.9rem', lineHeight: 1.9, color: '#2a3a4a', marginBottom: 14 }}>
            We started by tracking SLPRB, APSC, SSC, and Railway notifications. Then we added competitive exam updates (CTET, NEET, UPSC). Then came the Information section — voter ID dates, PAN-Aadhaar deadlines, government scheme details — because not everyone who visits us is only looking for jobs.
          </p>
          <p style={{ fontSize: '.9rem', lineHeight: 1.9, color: '#2a3a4a' }}>
            Today, <strong>Assam Career Point & Info</strong> is the single destination for Assam and NE India job seekers, exam aspirants, and anyone who needs clear, accurate, timely government information.
          </p>
        </div>

        {/* MISSION */}
        <div style={{ background: N, borderRadius: 16, padding: '28px 30px', marginBottom: 24, border: `2px solid ${G}` }}>
          <h2 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 800, fontSize: '1.15rem', color: G, marginBottom: 20 }}>🎯 Our Mission</h2>
          <div className="g3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
            {[
              { e: '💼', t: 'Jobs', d: 'Publish every govt job in Assam and NE India within 24 hours of official notification release.' },
              { e: '📚', t: 'Exams', d: 'Cover all major competitive exams with accurate dates, payment deadlines, and exam timings.' },
              { e: 'ℹ️', t: 'Information', d: 'Explain complex government processes (voter ID, Aadhaar, schemes) in simple, step-by-step language.' },
            ].map(m => (
              <div key={m.t} style={{ textAlign: 'center' as const }}>
                <div style={{ fontSize: '2rem', marginBottom: 10 }}>{m.e}</div>
                <div style={{ fontFamily: 'Arial Black, sans-serif', fontWeight: 900, color: G, fontSize: '.9rem', marginBottom: 8, letterSpacing: '.04em' }}>{m.t}</div>
                <div style={{ fontSize: '.8rem', color: 'rgba(255,255,255,.6)', lineHeight: 1.7 }}>{m.d}</div>
              </div>
            ))}
          </div>
        </div>

        {/* OUR VALUES */}
        <h2 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 800, fontSize: '1.2rem', color: N, marginBottom: 18 }}>💎 Our Values</h2>
        <div className="g2" style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 14, marginBottom: 28 }}>
          {values.map(v => (
            <div key={v.t} className="val-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 10 }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: `${G}18`, border: `1.5px solid ${G}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', flexShrink: 0 }}>{v.e}</div>
                <div style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: '.92rem', color: N }}>{v.t}</div>
              </div>
              <p style={{ fontSize: '.84rem', color: '#4a5a6a', lineHeight: 1.75, margin: 0 }}>{v.d}</p>
            </div>
          ))}
        </div>

        {/* TEAM */}
        <h2 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 800, fontSize: '1.2rem', color: N, marginBottom: 18 }}>👥 Our Team</h2>
        <div className="g3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 28 }}>
          {team.map(m => (
            <div key={m.n} className="tm-card">
              <div style={{ width: 60, height: 60, borderRadius: '50%', background: `${G}22`, border: `2px solid ${G}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', margin: '0 auto 12px' }}>{m.e}</div>
              <div style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: '.88rem', color: G, marginBottom: 4 }}>{m.n}</div>
              <div style={{ fontSize: '.74rem', color: T, fontWeight: 700, marginBottom: 10 }}>{m.r}</div>
              <p style={{ fontSize: '.79rem', color: 'rgba(255,255,255,.55)', lineHeight: 1.75, margin: 0 }}>{m.d}</p>
            </div>
          ))}
        </div>

        {/* WHAT WE COVER */}
        <div className="card" style={{ marginBottom: 24 }}>
          <h2 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 800, fontSize: '1.1rem', color: N, marginBottom: 16 }}>📋 What We Cover</h2>
          <div className="g2" style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 10 }}>
            {[
              ['💼 Govt Job Vacancies', 'SLPRB, APSC, SSC, Railway, Banking, Teaching, Defence, BTC, District-level'],
              ['📚 Competitive Exams', 'CTET, NEET, JEE, UPSC, APSC, Assam TET, SBI, IBPS, RRB'],
              ['🗳️ Electoral Information', 'Voter ID registration, correction, electoral roll updates'],
              ['🆔 ID & Documents', 'PAN-Aadhaar linking, Passport, Ration Card, Birth Certificate'],
              ['💊 Government Schemes', 'Ayushman Bharat, PM-KISAN, Free Mobile, Scholarship schemes'],
              ['📄 PDF Forms & Documents', 'Application forms, syllabus PDFs, question papers, answer keys'],
            ].map(([t, d]) => (
              <div key={t} style={{ background: '#f8fbff', borderRadius: 10, padding: '13px 16px', border: '1px solid #d4e0ec' }}>
                <div style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: '.84rem', color: N, marginBottom: 5 }}>{t}</div>
                <div style={{ fontSize: '.78rem', color: '#5a6a7a', lineHeight: 1.6 }}>{d}</div>
              </div>
            ))}
          </div>
        </div>

        {/* DISCLAIMER */}
        <div style={{ background: '#fff3e0', border: '1.5px solid #ffe0b2', borderRadius: 12, padding: '16px 20px', marginBottom: 24, fontSize: '.84rem', color: '#6d4c00', lineHeight: 1.8 }}>
          <strong>⚠️ Disclaimer:</strong> Assam Career Point & Info is an <strong>informational portal only</strong>. We are not affiliated with any government department, SLPRB, APSC, or any official body. All job, exam, and information content is sourced from official government websites. Always verify from the official website before paying any application fee. We are not responsible for any errors in official notifications.
        </div>

        {/* CTA */}
        <div style={{ background: N, borderRadius: 16, padding: '28px', textAlign: 'center' as const, border: `2px solid ${G}` }}>
          <h2 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 800, fontSize: '1.1rem', color: W, marginBottom: 10 }}>
            Have Questions? We're Here to Help!
          </h2>
          <p style={{ color: 'rgba(255,255,255,.55)', fontSize: '.88rem', marginBottom: 20 }}>
            For corrections, suggestions, or business enquiries, feel free to reach out.
          </p>
          <Link href="/contact" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 28px', borderRadius: 99, background: G, color: N, fontWeight: 900, fontSize: '.9rem', textDecoration: 'none', fontFamily: 'Arial Black, sans-serif' }}>
            📧 Contact Us
          </Link>
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{ background: N, borderTop: `3px solid ${G}`, padding: '18px', textAlign: 'center' as const }}>
        <div style={{ fontSize: '.72rem', color: 'rgba(255,255,255,.3)' }}>
          © 2025–2026 Assam Career Point & Info ·{' '}
          {[['Privacy', '/privacy-policy'], ['Contact', '/contact'], ['Affiliate', '/affiliate'], ['Home', '/']].map(([l, h]) => (
            <span key={h}><Link href={h} style={{ color: `${G}88`, textDecoration: 'none' }}>{l}</Link> · </span>
          ))}
        </div>
      </footer>
    </>
  )
}
