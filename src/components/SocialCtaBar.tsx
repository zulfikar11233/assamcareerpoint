// src/components/SocialCtaBar.tsx
const CHANNELS = [
  { name: 'WhatsApp Channel', emoji: '💬', href: 'https://whatsapp.com/channel/0029Vb7IqrK42DcoItnDXy3x', color: '#25d366' },
  { name: 'Telegram Channel', emoji: '✈️', href: 'https://t.me/assamcareerpoint', color: '#0088cc' },
  { name: 'YouTube (Eazy In)', emoji: '▶️', href: 'https://www.youtube.com/channel/UCc-DYGiwBzt-Vyr2PvAxsfw', color: '#ff0000' },
]

export default function SocialCtaBar() {
  return (
    <div style={{
      background: '#0b1f33',
      border: '2px solid #c9a227',
      borderRadius: 13,
      padding: '18px 20px',
      marginTop: 24,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <span style={{ fontSize: '1.1rem' }}>🔔</span>
        <span style={{ fontFamily: 'Sora,sans-serif', fontWeight: 800, fontSize: '.9rem', color: '#c9a227' }}>
          Never Miss a New Job — Join Us
        </span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: 9 }}>
        {CHANNELS.map(c => (
          <a key={c.name} href={c.href} target="_blank" rel="noopener noreferrer" style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            padding: '11px 12px', borderRadius: 10, background: c.color,
            textDecoration: 'none', color: '#fff', fontWeight: 800, fontSize: '.8rem',
            fontFamily: 'Arial Black,sans-serif',
          }}>
            <span style={{ fontSize: '1.05rem' }}>{c.emoji}</span> {c.name}
          </a>
        ))}
      </div>
    </div>
  )
}