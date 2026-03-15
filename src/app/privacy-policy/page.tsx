'use client'
// src/app/privacy-policy/page.tsx
// ✅ Required by Google AdSense — must exist before applying
// ✅ Covers: data collection, cookies, AdSense/Analytics, third-party links
// ✅ Fully branded with ACPI real logo colours

import Link from 'next/link'

const G = '#c9a227', T = '#1dbfad', N = '#0b1f33', W = '#ffffff'
const SITE = 'Assam Career Point & Info'
const DOMAIN = 'assamcareerpoint-info.com'
const EMAIL = 'assam.cpi123@gmail.com'
const DATE = '04 March 2026'

function Logo({ size = 38 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs><linearGradient id="lg1" x1="30" y1="15" x2="70" y2="55" gradientUnits="userSpaceOnUse"><stop offset="0%" stopColor={T} /><stop offset="100%" stopColor={G} /></linearGradient></defs>
      <circle cx="50" cy="50" r="47" fill={N} stroke={G} strokeWidth="3" />
      <circle cx="50" cy="50" r="41" fill="none" stroke={T} strokeWidth="0.6" opacity="0.5" />
      <rect x="33" y="16" width="34" height="34" rx="8" fill="url(#lg1)" />
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

const sections = [
  {
    title: '1. Information We Collect',
    content: `When you visit ${DOMAIN}, we may collect certain information automatically, including:
    
• Your IP address and browser type
• Pages you visit and time spent on each page
• Search queries you enter on our site
• Device type (mobile, desktop, tablet)
• Referring website (how you found us)

We do NOT collect your name, email, Aadhaar number, or any personal identification unless you voluntarily contact us through our Contact form.`,
  },
  {
    title: '2. How We Use Your Information',
    content: `The information collected is used solely to:

• Improve the quality and relevance of our content
• Understand which job listings and exam updates are most useful
• Fix technical issues and improve site performance
• Respond to your queries sent via the Contact form
• Show relevant advertisements through Google AdSense`,
  },
  {
    title: '3. Cookies',
    content: `Our website uses cookies — small text files stored on your browser — to improve your experience. Cookies help us remember your preferences (such as language choice) and analyse site traffic.

Types of cookies we use:
• Essential cookies: Required for the site to function properly
• Analytics cookies: Google Analytics to understand visitor behaviour
• Advertising cookies: Google AdSense to show relevant ads

You can disable cookies at any time through your browser settings. Disabling cookies may affect some features of the site.`,
  },
  {
    title: '4. Google AdSense & Advertising',
    content: `We use Google AdSense to display advertisements on our site. Google AdSense uses cookies to show ads relevant to your interests based on your browsing history.

• Google may use the DoubleClick cookie to serve ads
• You can opt out of personalised advertising at: https://adssettings.google.com
• For more information: https://policies.google.com/privacy

We do not control the content of ads shown by Google. We are not responsible for the products or services advertised.`,
  },
  {
    title: '5. Affiliate Links',
    content: `${SITE} participates in affiliate marketing programmes. Some links on our site — particularly in our "Study Resources" and "Recommended Courses" sections — are affiliate links.

This means if you click a link and make a purchase, we may earn a small commission at NO extra cost to you. We only recommend products and services we genuinely believe are useful for job seekers and exam aspirants in Assam and North East India.

Affiliate partners may include: Testbook, Adda247, Unacademy, BYJU's, Amazon India, and other education platforms.`,
  },
  {
    title: '6. Third-Party Links',
    content: `Our portal contains links to official government websites (slprbassam.in, apsc.nic.in etc.), job application portals, and external resources. Once you leave our website, we are not responsible for the privacy practices of those external sites.

We recommend reading the privacy policy of any third-party site you visit.`,
  },
  {
    title: '7. Google Analytics',
    content: `We use Google Analytics 4 to track and analyse website traffic. Google Analytics collects anonymous data about how visitors use our site, including pages visited, session duration, and traffic sources.

This data is anonymous and cannot identify you personally. You can opt out of Google Analytics tracking by installing the Google Analytics Opt-out Browser Add-on.`,
  },
  {
    title: '8. Data Security',
    content: `We take reasonable steps to protect your information. Our website uses HTTPS (SSL encryption) to protect data transmitted between your browser and our server.

We do not store credit card numbers, Aadhaar details, or other sensitive personal information. We do not sell or rent your data to any third party.`,
  },
  {
    title: '9. Children\'s Privacy',
    content: `${SITE} is not directed at children under 13 years of age. We do not knowingly collect personal information from children. If you believe a child has provided us with personal information, please contact us and we will delete it.`,
  },
  {
    title: '10. Changes to This Policy',
    content: `We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. The "Last Updated" date at the top of this page will be revised accordingly.

We encourage you to review this policy periodically. Continued use of our website after changes constitutes your acceptance of the updated policy.`,
  },
  {
    title: '11. Contact Us',
    content: `If you have any questions about this Privacy Policy or how we handle your data, please contact us:

📧 Email: ${EMAIL}
🌐 Website: ${DOMAIN}
📍 Location: Assam, India

We will respond to all privacy-related queries within 5 business days.`,
  },
]

export default function PrivacyPolicy() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800&family=Nunito:wght@400;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        html, body { margin: 0; font-family: Nunito, sans-serif; background: #f0f4f8; color: #1a1a2e; overflow-x: hidden; }
        .nav-a { color: rgba(255,255,255,.6); font-size: .82rem; font-weight: 700; padding: 7px 11px; border-radius: 8px; text-decoration: none; white-space: nowrap; }
        .nav-a:hover { color: ${G}; }
        .sec { background: #fff; border: 1.5px solid #d4e0ec; border-radius: 14px; padding: 22px 26px; margin-bottom: 18px; }
        .sec h2 { font-family: 'Sora', sans-serif; font-weight: 700; font-size: 1rem; color: ${N}; margin: 0 0 12px; padding-bottom: 10px; border-bottom: 2px solid #f0f4f8; display: flex; align-items: center; gap: 9px; }
        .sec h2::before { content: ''; display: inline-block; width: 4px; height: 18px; background: ${G}; border-radius: 2px; flex-shrink: 0; }
        .sec p { font-size: .88rem; color: #3a4a5a; line-height: 1.9; margin: 0; white-space: pre-line; }
        @media(max-width:700px) { .sec { padding: 16px 18px; } }
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
      <div style={{ background: `linear-gradient(135deg, ${N} 0%, #112240 100%)`, padding: '40px 20px 32px', textAlign: 'center' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🔒</div>
        <h1 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 800, fontSize: 'clamp(1.5rem,3vw,2.2rem)', color: W, marginBottom: 10 }}>
          Privacy Policy
        </h1>
        <p style={{ color: 'rgba(255,255,255,.5)', fontSize: '.9rem', marginBottom: 8 }}>
          {SITE} — {DOMAIN}
        </p>
        <div style={{ display: 'inline-block', background: `${G}22`, border: `1px solid ${G}44`, borderRadius: 99, padding: '5px 16px', fontSize: '.75rem', color: G, fontWeight: 700 }}>
          Last Updated: {DATE}
        </div>
      </div>

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '28px 20px 60px' }}>

        {/* Intro box */}
        <div style={{ background: `${T}12`, border: `1.5px solid ${T}44`, borderRadius: 12, padding: '16px 20px', marginBottom: 24, fontSize: '.87rem', color: '#1a1a2e', lineHeight: 1.8 }}>
          <strong style={{ color: N }}>Your privacy is important to us.</strong> This Privacy Policy explains how <strong>{SITE}</strong> ("<strong>{DOMAIN}</strong>") collects, uses, and protects information when you visit our portal. By using our website, you agree to the terms described in this policy.
        </div>

        {/* Sections */}
        {sections.map(s => (
          <div key={s.title} className="sec">
            <h2>{s.title}</h2>
            <p>{s.content}</p>
          </div>
        ))}

        {/* Quick links */}
        <div style={{ background: N, borderRadius: 14, padding: '20px 24px', marginTop: 28, border: `2px solid ${G}` }}>
          <h3 style={{ fontFamily: 'Arial Black, sans-serif', color: G, fontSize: '.82rem', letterSpacing: '.06em', marginBottom: 14 }}>QUICK LINKS</h3>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' as const }}>
            {[['About Us', '/about-us'], ['Contact Us', '/contact'], ['Affiliate Disclosure', '/affiliate'], ['Home', '/']].map(([l, h]) => (
              <Link key={h} href={h} style={{ padding: '8px 16px', borderRadius: 8, background: `${G}22`, border: `1px solid ${G}44`, color: G, fontWeight: 700, fontSize: '.8rem', textDecoration: 'none' }}>{l}</Link>
            ))}
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{ background: N, borderTop: `3px solid ${G}`, padding: '18px', textAlign: 'center' as const }}>
        <div style={{ fontSize: '.72rem', color: 'rgba(255,255,255,.3)' }}>
          © 2025–2026 {SITE} · <Link href="/privacy-policy" style={{ color: `${G}88`, textDecoration: 'none' }}>Privacy</Link> · <Link href="/about-us" style={{ color: `${G}88`, textDecoration: 'none' }}>About</Link> · <Link href="/contact" style={{ color: `${G}88`, textDecoration: 'none' }}>Contact</Link>
        </div>
      </footer>
    </>
  )
}
