// src/components/FreeToolsBar.tsx
import Link from 'next/link'

type Context = 'job' | 'exam' | 'info' | 'pdf' | 'result' | 'general'

const ALL_TOOLS = [
  {
    name: 'Photo & Image Resizer',
    emoji: '🖼️',
    href: '/tools/image-resizer',
    desc: 'Resize photos for ADRE, APSC, SLPRB, SSC, Passport',
    tags: ['job', 'exam', 'pdf', 'general'],
  },
  {
    name: 'Age Calculator',
    emoji: '🎂',
    href: '/tools/age-calculator',
    desc: 'Check exam eligibility with OBC/SC/ST relaxation',
    tags: ['job', 'exam', 'info', 'general'],
  },
  {
    name: 'Word Counter',
    emoji: '✍️',
    href: '/tools/word-counter',
    desc: 'Count words for UPSC/SSC/APSC essays',
    tags: ['exam', 'pdf', 'info', 'general'],
  },
  {
    name: 'Bio-Data Maker',
    emoji: '📋',
    href: '/tools/bio-data-maker',
    desc: 'Govt-format bio-data with Assam fields, PDF download',
    tags: ['job', 'exam', 'general'],
  },
  {
    name: 'Images to PDF',
    emoji: '📄',
    href: '/tools/images-to-pdf',
    desc: 'Combine certificates into one PDF for applications',
    tags: ['job', 'exam', 'pdf', 'general'],
  },
  {
    name: 'UPI QR Generator',
    emoji: '📲',
    href: '/tools/upi-qr-generator',
    desc: 'Create UPI QR for GPay, PhonePe, Paytm, BHIM',
    tags: ['result', 'general'],
  },
  {
    name: 'Salary Calculator',
    emoji: '💰',
    href: '/salary-calculator',
    desc: 'Calculate Assam Govt & Central Govt in-hand salary',
    tags: ['job', 'result', 'general'],
  },
]

export default function FreeToolsBar({ context = 'general' }: { context?: Context }) {
  const tools = ALL_TOOLS
    .filter(t => t.tags.includes(context) || t.tags.includes('general'))
    .sort((a,b) => (b.tags.includes(context) ? 1 : 0) - (a.tags.includes(context) ? 1 : 0))
    .slice(0, 5)

  return (
    <div style={{
      background: 'linear-gradient(135deg,#0d1b2a08,#1dbfad08)',
      border: '1.5px solid #d4e0ec',
      borderRadius: 13,
      padding: '18px 20px',
      marginTop: 24,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <span style={{ fontSize: '1.1rem' }}>🛠️</span>
        <span style={{ fontFamily: 'Sora,sans-serif', fontWeight: 800, fontSize: '.9rem', color: '#0d1b2a' }}>
          Free Tools from Assam Career Point
        </span>
        <span style={{ marginLeft: 'auto', background: '#1dbfad', color: '#fff', fontSize: '.62rem', fontWeight: 800, padding: '2px 8px', borderRadius: 99 }}>
          ALL FREE
        </span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 8 }}>
        {tools.map(t => (
          <Link key={t.name} href={t.href} style={{
            display: 'flex', alignItems: 'center', gap: 9, padding: '10px 12px',
            background: '#fff', border: '1.5px solid #e0eaf5', borderRadius: 10,
            textDecoration: 'none', color: 'inherit', transition: '.15s'
          }}>
            <span style={{ fontSize: '1.3rem', flexShrink: 0 }}>{t.emoji}</span>
            <div>
              <div style={{ fontFamily: 'Sora,sans-serif', fontWeight: 700, fontSize: '.76rem', color: '#0d1b2a' }}>{t.name}</div>
              <div style={{ fontSize: '.66rem', color: '#8fa3b8', marginTop: 1, lineHeight: 1.3 }}>{t.desc}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}