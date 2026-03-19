'use client'
import Link from 'next/link'
import { useState } from 'react'

const G = '#c9a227', T = '#1dbfad', N = '#0b1f33', W = '#ffffff'
const EMAIL = 'assam.cpi123@gmail.com'
// ✅ Formspree form ID
const FORMSPREE_ID = 'xwvryorl'

function Logo({ size = 38 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs><linearGradient id="lg3" x1="30" y1="15" x2="70" y2="55" gradientUnits="userSpaceOnUse"><stop offset="0%" stopColor={T} /><stop offset="100%" stopColor={G} /></linearGradient></defs>
      <circle cx="50" cy="50" r="47" fill={N} stroke={G} strokeWidth="3" />
      <circle cx="50" cy="50" r="41" fill="none" stroke={T} strokeWidth="0.6" opacity="0.5" />
      <rect x="33" y="16" width="34" height="34" rx="8" fill="url(#lg3)" />
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

const faqs = [
  { q: 'Is this website free to use?', a: 'Yes, completely free. You can browse all job listings, exam updates, and information without any registration or payment.' },
  { q: 'How often is the content updated?', a: 'Our team monitors official government websites daily. New job notifications are typically published within 24 hours of official release.' },
  { q: 'Are the job details 100% accurate?', a: 'We source all information from official government websites. However, always verify from the official portal before paying any application fee.' },
  { q: 'Can I submit a job notification I found?', a: 'Yes! Use the contact form below with subject "Job Submission" and we will verify and publish it.' },
  { q: 'How can I advertise on this portal?', a: 'If you are a coaching centre, education platform, or business targeting job seekers in Assam, email us for advertising rates.' },
  { q: 'Is there a mobile app?', a: 'Not yet, but our website is fully optimised for mobile. You can add it to your home screen from your browser for an app-like experience.' },
]

const socials = [
  { ico: '✈️', name: 'Telegram',  color: '#0088cc', sub: 'Instant alerts',  href: 'https://t.me/assamcareerpoint' },
  { ico: '💬', name: 'WhatsApp',  color: '#25d366', sub: 'Join our channel', href: 'https://whatsapp.com/channel/0029Vb7IqrK42DcoItnDXy3x' },
  { ico: '▶️', name: 'YouTube',   color: '#ff0000', sub: 'Video guides',     href: 'https://youtube.com/@atech_way?si=PZfu2G3k7xlI0gz7' },
  { ico: '📘', name: 'Facebook',  color: '#1877f2', sub: 'Like our page',    href: 'https://www.facebook.com/share/1CZ2MGDNG9/' },
  { ico: '📸', name: 'Instagram', color: '#e1306c', sub: 'Follow us',        href: 'https://www.instagram.com/assam.cpi/' },
  { ico: '🐦', name: 'Twitter/X', color: '#000000', sub: 'Latest updates',   href: 'https://x.com/assam_cpi' },
]

export default function ContactPage() {
  const [form,    setForm]    = useState({ name: '', email: '', subject: 'General Enquiry', message: '' })
  const [honey,   setHoney]   = useState('')
  const [status,  setStatus]  = useState<'idle'|'sending'|'sent'|'error'>('idle')
  const [formErr, setFormErr] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFormErr('')

    // Honeypot bot check
    if (honey) return

    // Validation
    if (!form.name.trim() || form.name.length > 100)
      return setFormErr('Please enter your name (max 100 characters).')
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email))
      return setFormErr('Please enter a valid email address.')
    if (form.message.trim().length < 10)
      return setFormErr('Message is too short (minimum 10 characters).')
    if (form.message.length > 2000)
      return setFormErr('Message is too long (maximum 2000 characters).')

    setStatus('sending')

    try {
      // ✅ Send via Formspree — messages go directly to your email inbox!
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          name:    form.name,
          email:   form.email,
          subject: form.subject,
          message: form.message,
          _subject: `[ACPI Contact] ${form.subject} — ${form.name}`,
        }),
      })

      if (res.ok) {
        setStatus('sent')
        setForm({ name: '', email: '', subject: 'General Enquiry', message: '' })
        setTimeout(() => setStatus('idle'), 6000)
      } else {
        setStatus('error')
        setFormErr('Failed to send. Please try again or email us directly.')
      }
    } catch {
      setStatus('error')
      setFormErr('Network error. Please try again or email us directly.')
    }
  }

  const si: React.CSSProperties = {
    width: '100%', background: '#f0f4f8', border: '1.5px solid #d4e0ec',
    borderRadius: 9, padding: '11px 14px', fontFamily: 'Nunito, sans-serif',
    fontSize: '.87rem', color: '#1a1a2e', outline: 'none',
  }
  const lb: React.CSSProperties = {
    display: 'block', fontSize: '.72rem', fontWeight: 700, color: '#5a6a7a',
    marginBottom: 6, textTransform: 'uppercase' as const, letterSpacing: '.04em',
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800&family=Nunito:wght@400;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        html, body { margin: 0; font-family: Nunito, sans-serif; background: #f0f4f8; color: #1a1a2e; overflow-x: hidden; max-width:100vw; }
        .nav-a { color: rgba(255,255,255,.6); font-size: .82rem; font-weight: 700; padding: 7px 11px; border-radius: 8px; text-decoration: none; white-space: nowrap; }
        .nav-a:hover { color: ${G}; }
        input:focus, select:focus, textarea:focus { border-color: ${T} !important; background: #fff !important; }
        .soc-btn { display: flex; align-items: center; gap: 11px; padding: 13px 16px; border-radius: 11px; border: 1.5px solid #d4e0ec; background: #fff; text-decoration: none; transition: .18s; }
        .soc-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,.1); }
        .faq-item { background: #fff; border: 1.5px solid #d4e0ec; border-radius: 12px; padding: 16px 20px; margin-bottom: 10px; }
        @media(max-width:860px){ .layout{flex-direction:column!important} .layout>div:last-child{width:100%!important} }
        @media(max-width:600px){ .name-row{grid-template-columns:1fr!important} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:none} }
        .sent-msg { animation: fadeUp .4s ease; }
        @keyframes spin { to{transform:rotate(360deg)} }
      `}</style>

      {/* HEADER */}
      <header style={{ background: N, borderBottom: `2px solid ${G}`, position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 20px rgba(0,0,0,.4)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '10px 20px', display: 'flex', alignItems: 'center', gap: 14, flexWrap:'wrap' as const }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', flexShrink: 0 }}>
            <Logo size={40} />
            <div>
              <div style={{ fontFamily: 'Arial Black, sans-serif', fontSize: '.78rem', fontWeight: 900 }}>
                <span style={{ color: G }}>ASSAM </span><span style={{ color: W }}>CAREER</span>
              </div>
              <div style={{ fontFamily: 'Arial Black, sans-serif', fontSize: '.65rem', color: T, letterSpacing: '.12em' }}>◆ POINT ◆</div>
            </div>
          </Link>
          <nav style={{ display: 'flex', gap: 2, flexWrap:'wrap' as const }}>
            {([['🏠 Home', '/'], ['💼 Jobs', '/govt-jobs'], ['📚 Exams', '/exams'], ['ℹ️ Info', '/information']] as [string,string][]).map(([l, h]) => (
              <Link key={h} href={h} className="nav-a">{l}</Link>
            ))}
          </nav>
        </div>
      </header>

      {/* HERO */}
      <div style={{ background: `linear-gradient(135deg, ${N}, #112240)`, padding: '40px 20px 34px', textAlign: 'center' as const }}>
        <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>📬</div>
        <h1 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 800, fontSize: 'clamp(1.5rem,3vw,2.2rem)', color: W, marginBottom: 10 }}>Contact Us</h1>
        <p style={{ color: 'rgba(255,255,255,.55)', fontSize: '.92rem', maxWidth: 460, margin: '0 auto' }}>
          Have a question, correction, or business enquiry? We respond within 24–48 hours.
        </p>
      </div>

      <div style={{ maxWidth: 1060, margin: '0 auto', padding: '30px 20px 60px' }}>
        <div className="layout" style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>

          {/* ── CONTACT FORM ── */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ background: '#fff', border: '1.5px solid #d4e0ec', borderRadius: 16, padding: '26px 28px', marginBottom: 24, borderLeft: `5px solid ${G}` }}>
              <h2 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: '1.05rem', color: N, marginBottom: 6 }}>✉️ Send Us a Message</h2>
              <p style={{ fontSize:'.82rem', color:'#5a6a7a', marginBottom:20 }}>
                Messages are sent directly to our inbox via Formspree. No email app needed!
              </p>

              {/* Success message */}
              {status === 'sent' && (
                <div className="sent-msg" style={{ background: '#e8f5e9', border: '1.5px solid #a5d6a7', borderRadius: 10, padding: '13px 16px', marginBottom: 18, fontSize: '.87rem', color: '#2e7d32', fontWeight: 700 }}>
                  ✅ Message sent successfully! We will reply to <strong>{form.email || 'your email'}</strong> within 24–48 hours.
                </div>
              )}

              {/* Error message */}
              {formErr && (
                <div style={{ background:'#fde8ea', border:'1.5px solid #f7bcc0', borderRadius:9, padding:'10px 14px', marginBottom:14, fontSize:'.83rem', color:'#c62828' }}>
                  ⚠ {formErr}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* Honeypot — hidden from humans */}
                <div style={{ display: 'none' }} aria-hidden="true">
                  <input type="text" name="website" value={honey} onChange={e => setHoney(e.target.value)} tabIndex={-1} autoComplete="off" />
                </div>

                <div className="name-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                  <div>
                    <label style={lb}>Your Name *</label>
                    <input required style={si} placeholder="e.g. Rahul Bora" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
                  </div>
                  <div>
                    <label style={lb}>Email Address *</label>
                    <input required type="email" style={si} placeholder="your@email.com" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
                  </div>
                </div>

                <div style={{ marginBottom: 14 }}>
                  <label style={lb}>Subject</label>
                  <select style={{ ...si, cursor: 'pointer' }} value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}>
                    <option>General Enquiry</option>
                    <option>Job Correction / Update</option>
                    <option>Job Submission (New Vacancy)</option>
                    <option>Exam Date Correction</option>
                    <option>Advertisement / Sponsorship</option>
                    <option>Affiliate Partnership</option>
                    <option>Technical Issue</option>
                    <option>Other</option>
                  </select>
                </div>

                <div style={{ marginBottom: 18 }}>
                  <label style={lb}>Message *</label>
                  <textarea required style={{ ...si, minHeight: 130, resize: 'vertical' as const }}
                    placeholder="Describe your query in detail. For job corrections, please include the job title, what is wrong, and the correct information with source link."
                    value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} />
                </div>

                <button type="submit" disabled={status === 'sending'}
                  style={{ width: '100%', padding: '13px', borderRadius: 10, background: status === 'sending' ? '#5a6a7a' : N, border: `2px solid ${G}`, color: G, fontWeight: 900, fontSize: '.92rem', fontFamily: 'Arial Black, sans-serif', cursor: status === 'sending' ? 'not-allowed' : 'pointer', letterSpacing: '.04em', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
                  {status === 'sending' ? (
                    <>
                      <span style={{ width:18,height:18,border:'2px solid rgba(201,162,39,.3)',borderTopColor:G,borderRadius:'50%',animation:'spin 1s linear infinite',display:'inline-block' }}/>
                      Sending...
                    </>
                  ) : '📧 SEND MESSAGE'}
                </button>

                <div style={{ fontSize: '.72rem', color: '#8fa3b8', marginTop: 10, textAlign: 'center' as const }}>
                  🔒 Powered by <a href="https://formspree.io" target="_blank" rel="noopener noreferrer" style={{color:T,textDecoration:'none'}}>Formspree</a> — your message goes directly to our inbox
                </div>
              </form>
            </div>

            {/* FAQ */}
            <div>
              <h2 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: '1.05rem', color: N, marginBottom: 16 }}>❓ Frequently Asked Questions</h2>
              {faqs.map((f, i) => (
                <div key={i} className="faq-item">
                  <div style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: '.88rem', color: N, marginBottom: 7 }}>Q: {f.q}</div>
                  <div style={{ fontSize: '.84rem', color: '#4a5a6a', lineHeight: 1.75 }}>{f.a}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── SIDEBAR ── */}
          <div style={{ width: 290, flexShrink: 0, minWidth:0 }}>

            {/* Contact Info */}
            <div style={{ background: N, border: `2px solid ${G}`, borderRadius: 14, padding: '20px', marginBottom: 18 }}>
              <h3 style={{ fontFamily: 'Arial Black, sans-serif', color: G, fontSize: '.8rem', letterSpacing: '.06em', marginBottom: 16 }}>📋 CONTACT INFO</h3>
              {[
                { e: '📧', l: 'Email', v: EMAIL, href: `mailto:${EMAIL}` },
                { e: '🌐', l: 'Website', v: 'assamcareerpoint-info.com', href: 'https://www.assamcareerpoint-info.com' },
                { e: '📍', l: 'Location', v: 'Assam, India', href: null },
                { e: '⏰', l: 'Response Time', v: 'Within 24–48 hrs', href: null },
              ].map(c => (
                <div key={c.l} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 13 }}>
                  <span style={{ fontSize: '1.1rem', marginTop: 1, flexShrink: 0 }}>{c.e}</span>
                  <div>
                    <div style={{ fontSize: '.67rem', color: 'rgba(255,255,255,.4)', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '.04em', marginBottom: 2 }}>{c.l}</div>
                    {c.href
                      ? <a href={c.href} style={{ fontSize: '.8rem', color: T, fontWeight: 700, textDecoration: 'none', wordBreak: 'break-all' as const }}>{c.v}</a>
                      : <div style={{ fontSize: '.8rem', color: W, fontWeight: 600 }}>{c.v}</div>
                    }
                  </div>
                </div>
              ))}
            </div>

            {/* Social Links */}
            <div style={{ background: '#fff', border: '1.5px solid #d4e0ec', borderRadius: 14, padding: '18px', marginBottom: 18 }}>
              <h3 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: '.88rem', color: N, marginBottom: 14 }}>📲 Follow Us</h3>
              <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 8 }}>
                {socials.map(s => (
                  <a key={s.name} href={s.href} target="_blank" rel="noreferrer" className="soc-btn">
                    <div style={{ width: 36, height: 36, borderRadius: 9, background: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0 }}>{s.ico}</div>
                    <div>
                      <div style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: '.83rem', color: N }}>{s.name}</div>
                      <div style={{ fontSize: '.7rem', color: '#5a6a7a' }}>{s.sub}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Advertising */}
            <div style={{ background: `${G}18`, border: `2px solid ${G}44`, borderRadius: 14, padding: '18px' }}>
              <h3 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: '.88rem', color: N, marginBottom: 10 }}>📢 Advertise With Us</h3>
              <p style={{ fontSize: '.81rem', color: '#3a4a5a', lineHeight: 1.75, marginBottom: 14 }}>
                Reach thousands of active job seekers in Assam & NE India.
              </p>
              <a href={`mailto:${EMAIL}?subject=Advertising Enquiry`}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, padding: '10px', borderRadius: 9, background: N, color: G, fontWeight: 900, fontSize: '.82rem', textDecoration: 'none', fontFamily: 'Arial Black, sans-serif' }}>
                📧 GET AD RATES
              </a>
            </div>
          </div>
        </div>
      </div>

      <footer style={{ background: N, borderTop: `3px solid ${G}`, padding: '18px', textAlign: 'center' as const }}>
        <div style={{ fontSize: '.72rem', color: 'rgba(255,255,255,.3)' }}>
          © 2025–2026 Assam Career Point & Info ·{' '}
          {([['Privacy', '/privacy-policy'], ['About', '/about-us'], ['Affiliate', '/affiliate'], ['Home', '/']] as [string,string][]).map(([l, h]) => (
            <span key={h}><Link href={h} style={{ color: `${G}88`, textDecoration: 'none' }}>{l}</Link> · </span>
          ))}
        </div>
      </footer>
    </>
  )
}
