'use client'
export const dynamic = 'force-dynamic'

import { useState } from 'react'

const G = '#c9a227', T = '#1dbfad', N = '#0b1f33'

export default function ClearStorage() {
  const [done,   setDone]   = useState(false)
  const [report, setReport] = useState<string[]>([])

  function migrate() {
    const lines: string[] = []
    try {
      const raw = localStorage.getItem('acp_jobs_v6')
      if (!raw) { setReport(['No jobs found in storage.']); setDone(true); return }
      const jobs = JSON.parse(raw)
      let cleaned = 0
      const fixed = jobs.map((j: Record<string, unknown>) => {
        if (typeof j.bannerData === 'string' && (j.bannerData as string).startsWith('data:')) {
          lines.push('Stripped base64 banner from: "' + String(j.title) + '"')
          delete j.bannerData
          j.bannerUrl = j.bannerUrl || ''
          cleaned++
        }
        if (Array.isArray(j.advPdfs) && j.advPdfs.length > 0) {
          const hadBase64 = j.advPdfs.some((p: Record<string, string>) => p.data?.startsWith('data:'))
          if (hadBase64) {
            j.advPdfs = j.advPdfs.map((p: Record<string, string>) => ({ name: p.name || 'PDF', url: p.url || '' }))
            lines.push('Converted PDFs in: "' + String(j.title) + '" — re-add Google Drive links')
            cleaned++
          }
        }
        return j
      })
      localStorage.setItem('acp_jobs_v6', JSON.stringify(fixed))
      if (cleaned === 0) lines.push('No base64 data found — storage was already clean!')
      lines.push('Done! Cleaned ' + cleaned + ' job(s).')
      setReport(lines); setDone(true)
    } catch (e) {
      setReport(['Error: ' + String(e)]); setDone(true)
    }
  }

  function clearAll() {
    if (!confirm('This will DELETE ALL site data permanently. Are you absolutely sure?')) return
    if (!confirm('SECOND CONFIRMATION: This cannot be undone. Delete everything?')) return
    ;['acp_jobs_v6', 'acp_exams_v6', 'acp_info_v6', 'acp_pdfforms_v6', 'acp_affiliate_v1'].forEach(k => localStorage.removeItem(k))
    setReport(['All localStorage data cleared. Reload admin dashboard.'])
    setDone(true)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f0f4f8', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, fontFamily: 'Nunito,sans-serif' }}>
      <div style={{ background: '#fff', border: '2px solid #d4e0ec', borderRadius: 16, padding: 32, maxWidth: 540, width: '100%' }}>
        <div style={{ fontFamily: 'Arial Black,sans-serif', fontSize: '1.1rem', color: N, marginBottom: 8 }}>
          🔧 Storage Fix Tool
        </div>
        <div style={{ background: '#fff8e1', border: '1.5px solid #ffe082', borderRadius: 8, padding: '8px 12px', marginBottom: 16, fontSize: '.78rem', color: '#5d4037' }}>
          Protected by admin login via middleware.
        </div>
        <p style={{ color: '#5a6a7a', fontSize: '.87rem', lineHeight: 1.75, marginBottom: 20 }}>
          Removes old base64 image/PDF data from jobs that caused QuotaExceededError.
        </p>
        {!done ? (
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 10 }}>
            <button onClick={migrate} style={{ padding: '13px', borderRadius: 11, background: T, color: N, fontWeight: 900, fontSize: '.9rem', cursor: 'pointer', border: 'none', fontFamily: 'Arial Black,sans-serif' }}>
              Run Migration (Safe)
            </button>
            <button onClick={clearAll} style={{ padding: '13px', borderRadius: 11, background: '#fde8ea', color: '#c62828', fontWeight: 900, fontSize: '.9rem', cursor: 'pointer', border: '1.5px solid #f7bcc0', fontFamily: 'Arial Black,sans-serif' }}>
              Clear ALL localStorage (Fresh Start)
            </button>
          </div>
        ) : (
          <>
            <div style={{ background: '#f8fbff', border: '1.5px solid #d4e0ec', borderRadius: 10, padding: '14px', marginBottom: 16, fontSize: '.82rem', lineHeight: 2 }}>
              {report.map((l, i) => <div key={i}>{l}</div>)}
            </div>
            <a href="/admin/dashboard" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '12px', borderRadius: 11, background: N, color: G, fontWeight: 900, fontSize: '.88rem', textDecoration: 'none', fontFamily: 'Arial Black,sans-serif' }}>
              Go to Admin Dashboard
            </a>
          </>
        )}
      </div>
    </div>
  )
}
