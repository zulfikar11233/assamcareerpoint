'use client'
type LinkItem = { label: string; url?: string; icon?: string }

export default function ImportantLinks({ links }: { links: LinkItem[] }) {
  const valid = links.filter(l => l.url)
  if (valid.length === 0) return null
  return (
    <div style={{background:'#fff', border:'1.5px solid #d4e0ec', borderRadius:13, overflow:'hidden', marginBottom:15}}>
      <div style={{background:'#0d1b2a', color:'#c9a227', fontWeight:700, fontSize:'.83rem', padding:'11px 15px'}}>
        🔗 Important Links
      </div>
      {valid.map((l,i) => (
        <a key={i} href={l.url} target="_blank" rel="noopener noreferrer" style={{
          display:'flex', justifyContent:'space-between', alignItems:'center', gap:8,
          padding:'11px 15px', textDecoration:'none',
          borderBottom: i<valid.length-1 ? '1px solid #f0f4f8' : 'none',
        }}>
          <span style={{color:'#1a1a2e', fontWeight:700, fontSize:'.8rem'}}>{l.icon ? `${l.icon} ` : ''}{l.label}</span>
          <span style={{color:'#1dbfad', fontWeight:700, fontSize:'.75rem', flexShrink:0}}>Click Here →</span>
        </a>
      ))}
    </div>
  )
}