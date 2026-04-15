'use client'
import { ToolsNavbar } from './_shared'
import { C } from './_shared'

const tools = [
  {
    href: '/tools/image-resizer',
    icon: '🖼️',
    title: 'Photo & Image Resizer',
    desc: 'Resize photos for ADRE, APSC, SLPRB, SSC, Railway, Bank exams. 25+ presets, compress to KB, background color, rotation.',
    tags: ['ADRE', 'APSC', 'SLPRB', 'Passport Size'],
    bg: '#f0fdfb', border: '#99f6e4', badge: 'Most Popular', badgeBg: '#c9a227', badgeCl: '#0b1f33',
  },
  {
    href: '/tools/age-calculator',
    icon: '🎂',
    title: 'Age Calculator',
    desc: 'Calculate exact age and check eligibility for ADRE, APSC, SSC, Railway, Bank and UPSC. Includes OBC/SC/ST age relaxation.',
    tags: ['Exam Eligibility', 'OBC/SC/ST', 'ADRE', 'APSC'],
    bg: '#f0fdf4', border: '#bbf7d0', badge: 'New', badgeBg: '#1dbfad', badgeCl: '#fff',
  },
  {
    href: '/tools/word-counter',
    icon: '📝',
    title: 'Word Counter',
    desc: 'Count words, characters, reading time. Exam word limit checker for UPSC/SSC/APSC essays, keyword density, find & replace.',
    tags: ['UPSC Essay', 'SSC', 'Keyword Density'],
    bg: '#f5f3ff', border: '#ddd6fe', badge: 'New', badgeBg: '#1dbfad', badgeCl: '#fff',
  },
  {
    href: '/tools/bio-data-maker',
    icon: '📋',
    title: 'Bio-Data / Resume Maker',
    desc: 'Government-format bio-data with Assam fields — Employment Exchange No., PRC, Category, District. Download as PDF instantly.',
    tags: ['Employment Exchange', 'PRC', 'PDF'],
    bg: '#fff1f2', border: '#fecdd3', badge: null, badgeBg: '', badgeCl: '',
  },
  {
    href: '/tools/images-to-pdf',
    icon: '📄',
    title: 'Images to PDF Converter',
    desc: 'Convert photos and scanned certificates into a single PDF. Compress, reorder, rotate, A4/Letter size, page numbers.',
    tags: ['Certificates', 'A4', 'Compress'],
    bg: '#eff6ff', border: '#bfdbfe', badge: null, badgeBg: '', badgeCl: '',
  },
  {
    href: '/tools/upi-qr-generator',
    icon: '📲',
    title: 'UPI QR Code Generator',
    desc: 'Create UPI payment QR codes for GPay, PhonePe, Paytm, BHIM. Supports UPI ID, Bank Account and Mobile modes.',
    tags: ['GPay', 'PhonePe', 'BHIM', 'Paytm'],
    bg: '#fffbeb', border: '#fde68a', badge: null, badgeBg: '', badgeCl: '',
  },
]

export default function ToolsHubClient() {
  return (
    <main style={{ minHeight: '100vh', background: '#f9fafb', fontFamily: 'var(--font-nunito), Nunito, system-ui, sans-serif' }}>
      <style>{`
        .tool-card {
          position: relative;
          border-radius: 18px;
          padding: 26px;
          text-decoration: none;
          display: flex;
          flex-direction: column;
          box-shadow: 0 1px 6px rgba(0,0,0,0.05);
          transition: box-shadow 0.2s, transform 0.2s;
          border-width: 1.5px;
          border-style: solid;
        }
        .tool-card:hover {
          box-shadow: 0 8px 24px rgba(0,0,0,0.10);
          transform: translateY(-3px);
        }
        .tools-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(min(100%, 280px), 1fr));
          gap: 18px;
        }
      `}</style>

      <ToolsNavbar />

      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, #0b1f33 0%, #1a3a5c 100%)', padding: '52px 20px 44px', textAlign: 'center' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <span style={{ display: 'inline-block', background: 'rgba(201,162,39,0.2)', color: '#c9a227', borderRadius: '99px', padding: '6px 18px', fontSize: '14px', fontWeight: 700, marginBottom: '20px' }}>
            6 Free Tools · Works in Browser · No Login Required
          </span>
          <h1 style={{ fontSize: 'clamp(26px, 6vw, 44px)', fontWeight: 800, color: '#fff', margin: '0 0 14px', lineHeight: 1.2 }}>
            Free Tools for <span style={{ color: '#1dbfad' }}>Job Seekers</span>
          </h1>
          <p style={{ fontSize: '16px', color: '#cbd5e1', maxWidth: '560px', margin: '0 auto', lineHeight: 1.75 }}>
            Designed for Assam government job applicants. Resize photos, check exam eligibility, count words, generate UPI QR codes, convert images to PDF and build your bio-data — all free, private, in your browser.
          </p>
        </div>
      </section>

      {/* Tools Grid */}
      <section style={{ maxWidth: '1040px', margin: '0 auto', padding: '44px 16px' }}>
        <div className="tools-grid">
          {tools.map((tool) => (
            <a
              key={tool.href}
              href={tool.href}
              className="tool-card"
              style={{ background: tool.bg, borderColor: tool.border }}
            >
              {tool.badge && (
                <span style={{ position: 'absolute', top: '16px', right: '16px', background: tool.badgeBg, color: tool.badgeCl, borderRadius: '99px', padding: '3px 10px', fontSize: '11px', fontWeight: 800 }}>
                  {tool.badge}
                </span>
              )}
              <div style={{ fontSize: '38px', marginBottom: '12px' }}>{tool.icon}</div>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0b1f33', margin: '0 0 8px', lineHeight: 1.3 }}>{tool.title}</h2>
              <p style={{ fontSize: '14px', color: '#4b5563', lineHeight: 1.7, margin: '0 0 14px', flex: 1 }}>{tool.desc}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
                {tool.tags.map(tag => (
                  <span key={tag} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '99px', padding: '4px 10px', fontSize: '12px', fontWeight: 600, color: '#6b7280' }}>{tag}</span>
                ))}
              </div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#1dbfad' }}>Open Tool →</div>
            </a>
          ))}
        </div>
      </section>

      {/* Privacy */}
      <section style={{ maxWidth: '680px', margin: '0 auto', padding: '0 16px 48px' }}>
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '18px', padding: '30px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: '34px', marginBottom: '10px' }}>🔒</div>
          <h3 style={{ fontSize: '19px', fontWeight: 800, color: '#0b1f33', margin: '0 0 10px' }}>Your Privacy is Fully Protected</h3>
          <p style={{ fontSize: '15px', color: '#4b5563', lineHeight: 1.7, margin: 0 }}>
            All tools process your files and data entirely in your browser. No files are uploaded to any server. Your photos, documents and personal details never leave your device. No login, no signup, no tracking.
          </p>
        </div>
      </section>

      {/* SEO content */}
      <section style={{ maxWidth: '1040px', margin: '0 auto', padding: '0 16px 52px' }}>
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '18px', padding: '30px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <h2 style={{ fontSize: '21px', fontWeight: 800, color: '#0b1f33', margin: '0 0 18px', paddingBottom: '12px', borderBottom: '2px solid #f3f4f6' }}>
            Free Tools for Assam Government Job Applicants
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 260px), 1fr))', gap: '20px', fontSize: '14px', color: '#4b5563', lineHeight: 1.75 }}>
            {[
              { t: 'Photo Resizer for Govt Exams', d: 'Resize passport photos, crop images and compress photos to meet exact size and KB requirements for ADRE, APSC, SLPRB, SSC, Railway and Bank exam applications.' },
              { t: 'Age Calculator with Relaxation', d: 'Calculate your age online and instantly see which government exams you are eligible for. Automatically applies OBC, MOBC, SC, ST age relaxations for Assam state recruitment.' },
              { t: 'Bio-Data Maker for Govt Jobs', d: 'Create a government-format bio-data with Assam-specific fields like Employment Exchange Registration Number, PRC number and all 33 Assam districts. Download as PDF instantly.' },
              { t: 'Images to PDF Converter', d: 'Combine multiple scanned certificates and documents into one PDF file. Essential for government job applications where a single PDF of all documents is required.' },
              { t: 'Word Counter for Essays', d: 'Count words, characters and check reading time. Set exam word limits for UPSC essays (1200 words), SSC descriptive answers (250 words) and APSC essays (500 words).' },
              { t: 'UPI QR Code Generator', d: 'Generate a UPI QR code for GPay, PhonePe, Paytm and all UPI apps. Enter your UPI ID or bank account, download as PNG and print or share digitally.' },
            ].map(item => (
              <div key={item.t}>
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0b1f33', marginBottom: '8px', marginTop: 0 }}>{item.t}</h3>
                <p style={{ margin: 0 }}>{item.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
