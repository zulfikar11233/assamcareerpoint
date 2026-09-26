'use client'
export default function BackupPage() {
  const handleDownload = async () => {
    const res = await fetch('/api/admin/backup')
    if (!res.ok) { alert('Backup failed — make sure you are logged into admin.'); return }
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `acpi-backup-${new Date().toISOString().slice(0,10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div style={{ minHeight:'100vh', background:'#f0f4f8', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Nunito,sans-serif' }}>
      <div style={{ background:'#fff', border:'1.5px solid #d4e0ec', borderRadius:16, padding:'32px 40px', textAlign:'center', maxWidth:400 }}>
        <div style={{ fontSize:'2rem', marginBottom:10 }}>🗄️</div>
        <h1 style={{ fontFamily:'Sora,sans-serif', fontSize:'1.2rem', color:'#0b1f33', marginBottom:8 }}>Database Backup</h1>
        <p style={{ fontSize:'.85rem', color:'#5a6a7a', marginBottom:20 }}>
          Downloads all your site content (jobs, exams, info, etc.) and admin login accounts as one JSON file.
        </p>
        <button onClick={handleDownload} style={{
          padding:'12px 28px', borderRadius:10, background:'#0b1f33', color:'#c9a227',
          fontWeight:800, fontSize:'.9rem', border:'none', cursor:'pointer', fontFamily:'Arial Black,sans-serif'
        }}>
          ⬇️ Download Backup
        </button>
      </div>
    </div>
  )
}
