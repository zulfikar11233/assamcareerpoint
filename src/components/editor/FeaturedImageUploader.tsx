'use client'

function toPreviewSrc(url: string): string {
  if (!url) return ''
  const u = url.trim()
  if (!u.startsWith('http')) return ''
  if (u.includes('drive.google.com')) {
    const m = u.match(/\/d\/([a-zA-Z0-9_-]+)/) || u.match(/[?&]id=([a-zA-Z0-9_-]+)/)
    if (m) return `https://lh3.googleusercontent.com/d/${m[1]}`
  }
  return u
}

export default function FeaturedImageUploader({ value, onChange, label = 'Featured Image' }: { value: string; onChange: (url: string) => void; label?: string }) {
  const preview = toPreviewSrc(value)
  return (
    <div style={{ display: 'grid', gap: 8 }}>
      <label style={{ fontWeight: 700, fontSize: '.8rem' }}>{label}</label>
      {preview && (
        <img src={preview} alt="Featured image preview" style={{ width: '100%', maxWidth: 360, height: 'auto', borderRadius: 8, border: '1px solid var(--border,#d4e0ec)' }} />
      )}
      <input
        type="text"
        value={value || ''}
        onChange={e => onChange(e.target.value)}
        placeholder="Paste Google Drive share link here"
        style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1.5px solid #d4e0ec', fontSize: '.84rem', fontFamily: 'inherit', outline: 'none' }}
      />
      <p style={{ fontSize: '.7rem', color: '#8fa3b8', margin: 0 }}>
        In Google Drive: right-click the image → Share → "Anyone with the link" → Copy link, then paste it here.
      </p>
      {value && !preview && (
        <p role="alert" style={{ color: '#b5202d', fontSize: 12, margin: 0 }}>
          This doesn't look like a valid link — make sure it starts with https://
        </p>
      )}
    </div>
  )
}
