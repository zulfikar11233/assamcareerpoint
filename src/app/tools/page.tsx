import type { Metadata } from 'next'
import Link from 'next/link'
import { ToolsNavbar } from './_shared'

export const metadata: Metadata = {
  title: 'Free Online Tools for Government Job Seekers | Assam Career Point',
  description:
    'Free online tools for Assam government job applicants – Photo Resizer, UPI QR Generator, Images to PDF, Bio-Data Maker, Word Counter and Age Calculator with exam eligibility checker. All browser-based, 100% private.',
  keywords:
    'free tools assam government job, photo resize ADRE APSC, UPI QR code generator India, images to PDF converter, bio data maker assam government job, age calculator exam eligibility OBC SC ST, word counter essay UPSC SSC, passport size photo resize online, image resize online free',
  openGraph: {
    title: 'Free Online Tools for Government Job Seekers | Assam Career Point',
    description: '6 free tools: resize photos, check exam eligibility, count words, generate UPI QR, convert images to PDF and create bio-data.',
    url: 'https://assamcareerpoint-info.com/tools',
  },
}

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

export default function ToolsHubPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#f9fafb', fontFamily: 'var(--font-nunito), Nunito, system-ui, sans-serif' }}>
      <ToolsNavbar />

      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, #0b1f33 0%, #1a3a5c 100%)', padding: '52px 20px 44px', textAlign: 'center' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <span style={{ display: 'inline-block', background: 'rgba(201,162,39,0.2)', color: '#c9a227', borderRadius: '99px', padding: '6px 18px', fontSize: '14px', fontWeight: 700, marginBottom: '20px' }}>
            6 Free Tools · Works in Browser · No Login Required
          </span>
          <h1 style={{ fontSize: 'clamp(28px, 6vw, 46px)', fontWeight: 800, color: '#fff', margin: '0 0 14px', lineHeight: 1.2 }}>
            Free Tools for <span style={{ color: '#1dbfad' }}>Job Seekers</span>
          </h1>
          <p style={{ fontSize: '16px', color: '#cbd5e1', maxWidth: '560px', margin: '0 auto', lineHeight: 1.75 }}>
            Designed for Assam government job applicants. Resize photos, check exam eligibility, count words, generate UPI QR codes, convert images to PDF and build your bio-data — all free, private, in your browser.
          </p>
        </div>
      </section>

      {/* Tools Grid */}
      <section style={{ maxWidth: '1040px', margin: '0 auto', padding: '44px 16px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '18px',
        }}>
          {tools.map((tool) => (
            <a
              key={tool.href}
              href={tool.href}
              style={{
                position: 'relative',
                background: tool.bg,
                border: `1.5px solid ${tool.border}`,
                borderRadius: '18px',
                padding: '26px',
                textDecoration: 'none',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 1px 6px rgba(0,0,0,0.05)',
                transition: 'box-shadow 0.2s, transform 0.2s',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.10)'
                ;(e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-3px)'
              }}
              onMouseLeave={e => {
                ;(e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 1px 6px rgba(0,0,0,0.05)'
                ;(e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)'
              }}
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
      <section style={{ maxWidth: '680px', margin: '0 auto', padding: '0 16px 52px' }}>
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '18px', padding: '32px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: '36px', marginBottom: '10px' }}>🔒</div>
          <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0b1f33', margin: '0 0 10px' }}>Your Privacy is Fully Protected</h3>
          <p style={{ fontSize: '15px', color: '#4b5563', lineHeight: 1.7, margin: 0 }}>
            All tools process your files and data entirely in your browser. No files are uploaded to any server. Your photos, documents and personal details never leave your device. No login, no signup, no tracking.
          </p>
        </div>
      </section>

      {/* SEO content */}
      <section style={{ maxWidth: '1040px', margin: '0 auto', padding: '0 16px 52px' }}>
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '18px', padding: '32px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0b1f33', margin: '0 0 20px', paddingBottom: '12px', borderBottom: '2px solid #f3f4f6' }}>
            Free Tools for Assam Government Job Applicants
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px', fontSize: '14px', color: '#4b5563', lineHeight: 1.75 }}>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0b1f33', marginBottom: '8px' }}>Photo Resizer for Govt Exams</h3>
              <p style={{ margin: 0 }}>Resize passport photos, crop images and compress photos to meet exact size and KB requirements for ADRE, APSC, SLPRB, SSC, Railway and Bank exam applications.</p>
            </div>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0b1f33', marginBottom: '8px' }}>Age Calculator with Relaxation</h3>
              <p style={{ margin: 0 }}>Calculate your age online and instantly see which government exams you are eligible for. Automatically applies OBC, MOBC, SC, ST age relaxations for Assam state recruitment.</p>
            </div>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0b1f33', marginBottom: '8px' }}>Bio-Data Maker for Govt Jobs</h3>
              <p style={{ margin: 0 }}>Create a government-format bio-data with Assam-specific fields like Employment Exchange Registration Number, PRC number and all 33 Assam districts. Download as PDF instantly.</p>
            </div>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0b1f33', marginBottom: '8px' }}>Images to PDF Converter</h3>
              <p style={{ margin: 0 }}>Combine multiple scanned certificates and documents into one PDF file. Essential for government job applications where a single PDF of all documents is required.</p>
            </div>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0b1f33', marginBottom: '8px' }}>Word Counter for Essays</h3>
              <p style={{ margin: 0 }}>Count words, characters and check reading time. Set exam word limits for UPSC essays (1200 words), SSC descriptive answers (250 words) and APSC essays (500 words).</p>
            </div>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0b1f33', marginBottom: '8px' }}>UPI QR Code Generator</h3>
              <p style={{ margin: 0 }}>Generate a UPI QR code for GPay, PhonePe, Paytm and all UPI apps. Enter your UPI ID or bank account, download as PNG and print or share digitally.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
