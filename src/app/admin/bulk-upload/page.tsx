'use client'
export const dynamic = 'force-dynamic'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import * as XLSX from 'xlsx'

const G = '#c9a227', T = '#1dbfad', N = '#0b1f33', W = '#ffffff'

// ── Sheet name → API collection mapping ───────────────────────
const SHEET_MAP: Record<string, string> = {
  'jobs': 'jobs', 'job': 'jobs',
  'exams': 'exams', 'exam': 'exams',
  'information': 'info', 'info': 'info',
  'results': 'results', 'result': 'results',
  'announcements': 'announcements', 'announcement': 'announcements',
  'guides': 'guides', 'guide': 'guides',
  'services': 'services', 'service': 'services',
}

// ── Default values injected for each type ─────────────────────
const DEFAULTS: Record<string, object> = {
  jobs:          { logo:'🏛️', category:'Govt Job', district:'All Districts', status:'Live', vacancy:'0', lastDateTime:'23:59 Hrs', posts:[], advPdfs:[], jobAffiliates:[], dateHistory:[], sections:[], howToApplyImages:[], detailsImages:[] },
  exams:         { emoji:'📚', category:'Teaching', status:'Upcoming', examPdfs:[], examAffiliates:[], sections:[] },
  info:          { emoji:'🗳️', category:'Electoral', status:'Active', importantDates:[], sections:[], processImages:[] },
  results:       { status:'Upcoming', sections:[] },
  announcements: { status:'Published', category:'General', isImportant:false, sections:[] },
  guides:        { emoji:'📖', status:'Published', sections:[] },
  services:      { emoji:'⚙️', status:'Active', sections:[] },
}

// ── Column header aliases → canonical field names ──────────────
const COL_MAP: Record<string, string> = {
  'job title':'title','exam title':'title','info title':'title',
  'result title':'title','announcement title':'title',
  'guide title':'title','service title':'title',
  'organisation':'org','organization':'org',
  'conducted by':'conductedBy','conductedby':'conductedBy',
  'official site':'officialSite','official website':'officialSite',
  'official link':'officialLink','officiallink':'officialLink',
  'apply link':'applyLink','apply url':'applyLink',
  'admit card date':'admitCardDate','admit card link':'admitCardLink',
  'application start':'applicationStart','app start':'applicationStart',
  'application last date':'applicationLastDate',
  'payment last date':'paymentLastDate',
  'last date':'lastDate','last date to apply':'lastDate',
  'exam date':'examDate','exam time':'examTime',
  'result date':'resultDate','download link':'downloadLink',
  'cut off marks':'cutOffMarks','cutoff marks':'cutOffMarks',
  'exam name':'examName','publish date':'publishDate',
  'expiry date':'expiryDate','is important':'isImportant',
  'age limit':'ageLimit','how to apply':'howToApply',
  'full description':'fullDescription',
}

function slugify(title: string, id: number): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + id
}

function normalizeKey(raw: string): string {
  const lower = raw.trim().toLowerCase()
  return COL_MAP[lower] || lower.replace(/\s+/g, '')
}

function parseRow(row: Record<string, any>, collection: string, index: number): Record<string, any> {
  const id = Date.now() + index
  const item: Record<string, any> = {
    id,
    createdAt: new Date().toISOString(),
    ...(DEFAULTS[collection] || {}),
  }
  for (const [rawKey, val] of Object.entries(row)) {
    if (val === null || val === undefined || String(val).trim() === '') continue
    const field = normalizeKey(rawKey)
    const str = String(val).trim()
    if (['yes','true','1'].includes(str.toLowerCase()))      item[field] = true
    else if (['no','false','0'].includes(str.toLowerCase())) item[field] = false
    else item[field] = str
  }
  if (item.title) item.slug = slugify(String(item.title), id)
  return item
}

type SheetResult = {
  sheetName: string
  collection: string
  rows: Record<string, any>[]
  status: 'pending' | 'uploading' | 'done' | 'error'
  message: string
  count: number
}

export default function BulkUploadPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const [sheets, setSheets] = useState<SheetResult[]>([])
  const [dragging, setDragging] = useState(false)
  const [fileName, setFileName] = useState('')
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/admin/login')
  }, [status, router])

  if (status === 'loading') return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#f0f4f8'}}>
      <div style={{fontFamily:'Nunito,sans-serif',color:N}}>Loading...</div>
    </div>
  )
  if (!session || (session.user as any)?.role !== 'admin') return null

  // ── Parse Excel file ───────────────────────────────────────
  function parseFile(file: File) {
    setFileName(file.name)
    setSheets([])
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const wb = XLSX.read(e.target!.result, { type: 'binary', cellDates: true })
        const results: SheetResult[] = []
        for (const sheetName of wb.SheetNames) {
          const collection = SHEET_MAP[sheetName.toLowerCase().trim()]
          if (!collection) continue   // skip unrecognised sheets
          const ws = wb.Sheets[sheetName]
          const rawRows: Record<string, any>[] = XLSX.utils.sheet_to_json(ws, { defval: '' })
          const rows = rawRows
            .filter(r => Object.values(r).some(v => String(v).trim() !== ''))
            .map((r, i) => parseRow(r, collection, i))
          if (rows.length === 0) continue
          results.push({ sheetName, collection, rows, status: 'pending', message: '', count: rows.length })
        }
        if (results.length === 0) {
          alert('No recognised sheets found.\nSheet names must match: Jobs, Exams, Information, Results, Announcements, Guides, Services')
          return
        }
        setSheets(results)
      } catch (err) {
        alert('Failed to read Excel file. Make sure it is a valid .xlsx file.')
      }
    }
    reader.readAsBinaryString(file)
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) parseFile(file)
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault(); setDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file && file.name.endsWith('.xlsx')) parseFile(file)
    else alert('Please drop a .xlsx file')
  }

  // ── Upload one sheet ───────────────────────────────────────
  async function uploadSheet(idx: number) {
    const sheet = sheets[idx]
    setSheets(prev => prev.map((s, i) => i === idx ? { ...s, status: 'uploading', message: 'Fetching existing data...' } : s))
    try {
      // 1. Fetch existing data
      const res = await fetch(`/api/data/${sheet.collection}`, { cache: 'no-store' })
      const existing: any[] = res.ok ? await res.json() : []
      // 2. Merge — new items appended, skip duplicates by title
      const existingTitles = new Set(existing.map((x: any) => String(x.title || '').toLowerCase()))
      const toAdd = sheet.rows.filter(r => !existingTitles.has(String(r.title || '').toLowerCase()))
      const merged = [...existing, ...toAdd]
      setSheets(prev => prev.map((s, i) => i === idx ? { ...s, message: `Uploading ${toAdd.length} new items...` } : s))
      // 3. POST merged data
      const postRes = await fetch(`/api/data/${sheet.collection}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(merged),
      })
      if (!postRes.ok) throw new Error('API returned ' + postRes.status)
      const skipped = sheet.rows.length - toAdd.length
      setSheets(prev => prev.map((s, i) => i === idx ? {
        ...s, status: 'done',
        message: `✅ ${toAdd.length} added${skipped > 0 ? `, ${skipped} skipped (duplicate title)` : ''}`
      } : s))
    } catch (err: any) {
      setSheets(prev => prev.map((s, i) => i === idx ? { ...s, status: 'error', message: '❌ Failed: ' + (err.message || 'Unknown error') } : s))
    }
  }

  // ── Upload all sheets ──────────────────────────────────────
  async function uploadAll() {
    setUploading(true)
    for (let i = 0; i < sheets.length; i++) {
      if (sheets[i].status !== 'done') await uploadSheet(i)
    }
    setUploading(false)
  }

  const pendingCount = sheets.filter(s => s.status === 'pending').length
  const doneCount    = sheets.filter(s => s.status === 'done').length

  const COLLECTION_LABELS: Record<string, string> = {
    jobs:'💼 Jobs', exams:'📚 Exams', info:'ℹ️ Information',
    results:'📊 Results', announcements:'📢 Announcements',
    guides:'📖 Guides', services:'⚙️ Services',
  }
  const STATUS_COLORS: Record<string, string> = {
    pending:'#5a6a7a', uploading:T, done:'#22c55e', error:'#ef4444'
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800&family=Nunito:wght@400;600;700&display=swap');
        *,*::before,*::after{box-sizing:border-box}
        body{margin:0;font-family:Nunito,sans-serif;background:#f0f4f8;color:#1a1a2e}
        .card{background:#fff;border:1.5px solid #d4e0ec;border-radius:14px;padding:22px;margin-bottom:18px}
        .drop-zone{border:2.5px dashed #d4e0ec;border-radius:14px;padding:40px 20px;text-align:center;cursor:pointer;transition:.2s;background:#f8fbff}
        .drop-zone.drag{border-color:${T};background:#e8faf9}
        .drop-zone:hover{border-color:${T}}
        .btn{padding:11px 22px;border-radius:10px;border:none;font-family:Nunito,sans-serif;font-weight:700;font-size:.88rem;cursor:pointer;transition:.18s}
        .btn-primary{background:${G};color:${N}}
        .btn-primary:hover{filter:brightness(1.08)}
        .btn-teal{background:${T};color:${N}}
        .btn-nav{background:rgba(255,255,255,.08);color:rgba(255,255,255,.65);padding:7px 13px;border-radius:8px;text-decoration:none;font-size:.82rem;font-weight:700}
        .btn-nav:hover{color:${G}}
        .sheet-row{background:#fff;border:1.5px solid #d4e0ec;border-radius:12px;padding:16px 18px;display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin-bottom:10px}
        .preview-table{width:100%;border-collapse:collapse;font-size:.78rem;margin-top:10px}
        .preview-table th{background:${N};color:${G};padding:7px 10px;text-align:left;font-size:.72rem}
        .preview-table td{padding:7px 10px;border-bottom:1px solid #f0f4f8;color:#2a3a4a;max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
        .preview-table tr:hover td{background:#f8fbff}
        details summary{cursor:pointer;font-size:.8rem;color:${T};font-weight:700;margin-top:8px;user-select:none}
      `}</style>

      {/* Header */}
      <header style={{background:N,borderBottom:`2px solid ${G}`,position:'sticky',top:0,zIndex:100,padding:'12px 24px',display:'flex',alignItems:'center',gap:14,flexWrap:'wrap'}}>
        <Link href="/" style={{fontFamily:'Arial Black,sans-serif',fontSize:'.9rem',textDecoration:'none'}}>
          <span style={{color:G}}>ASSAM </span><span style={{color:W}}>CAREER</span><span style={{color:T}}> POINT</span>
        </Link>
        <nav style={{display:'flex',gap:8,marginLeft:8}}>
          <Link href="/admin/dashboard" className="btn-nav">← Dashboard</Link>
          <Link href="/admin/bulk-upload" className="btn-nav" style={{color:G}}>📤 Bulk Upload</Link>
        </nav>
      </header>

      <div style={{maxWidth:900,margin:'0 auto',padding:'28px 20px 60px'}}>

        {/* Title */}
        <div style={{marginBottom:24}}>
          <h1 style={{fontFamily:'Sora,sans-serif',fontWeight:800,fontSize:'1.5rem',color:N,margin:'0 0 6px'}}>📤 Bulk Excel Upload</h1>
          <p style={{color:'#5a6a7a',fontSize:'.88rem',margin:0}}>Upload a single Excel file with multiple sheets — one sheet per content type. New entries are added automatically.</p>
        </div>

        {/* Download Template */}
        <div className="card" style={{borderLeft:`4px solid ${G}`,background:'#fffdf0'}}>
          <div style={{display:'flex',alignItems:'center',gap:14,flexWrap:'wrap'}}>
            <div style={{flex:1}}>
              <div style={{fontFamily:'Sora,sans-serif',fontWeight:700,fontSize:'.92rem',color:N,marginBottom:4}}>📥 Download Excel Template</div>
              <div style={{fontSize:'.82rem',color:'#5a6a7a'}}>Use this template — sheet names must match exactly: <strong>Jobs, Exams, Information, Results, Announcements, Guides, Services</strong></div>
            </div>
            <a href="/bulk-upload-template.xlsx" download
              style={{padding:'10px 20px',borderRadius:10,background:N,color:G,fontWeight:900,textDecoration:'none',fontFamily:'Arial Black,sans-serif',fontSize:'.82rem',flexShrink:0}}>
              ⬇ Download Template
            </a>
          </div>
        </div>

        {/* Drop Zone */}
        <div className={`drop-zone${dragging?' drag':''}`}
          onClick={() => fileRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}>
          <input ref={fileRef} type="file" accept=".xlsx" style={{display:'none'}} onChange={onFileChange} />
          <div style={{fontSize:'3rem',marginBottom:12}}>📂</div>
          <div style={{fontFamily:'Sora,sans-serif',fontWeight:700,fontSize:'1rem',color:N,marginBottom:6}}>
            {fileName || 'Click or drag & drop your Excel file here'}
          </div>
          <div style={{fontSize:'.8rem',color:'#8fa3b8'}}>.xlsx files only</div>
        </div>

        {/* Detected Sheets */}
        {sheets.length > 0 && (
          <div style={{marginTop:24}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:14,flexWrap:'wrap',gap:10}}>
              <h2 style={{fontFamily:'Sora,sans-serif',fontWeight:700,fontSize:'1rem',color:N,margin:0}}>
                📋 Detected Sheets — {sheets.length} content type{sheets.length>1?'s':''} found
              </h2>
              {pendingCount > 0 && (
                <button className="btn btn-primary" onClick={uploadAll} disabled={uploading}>
                  {uploading ? '⏳ Uploading...' : `🚀 Upload All (${pendingCount} pending)`}
                </button>
              )}
              {doneCount === sheets.length && (
                <span style={{color:'#22c55e',fontWeight:700,fontSize:'.88rem'}}>✅ All uploads complete!</span>
              )}
            </div>

            {sheets.map((sheet, idx) => (
              <div key={idx} className="sheet-row">
                {/* Left: info */}
                <div style={{flex:1,minWidth:180}}>
                  <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:4}}>
                    <span style={{fontFamily:'Sora,sans-serif',fontWeight:700,fontSize:'.92rem',color:N}}>
                      {COLLECTION_LABELS[sheet.collection] || sheet.collection}
                    </span>
                    <span style={{fontSize:'.7rem',color:'#8fa3b8',fontWeight:600}}>sheet: "{sheet.sheetName}"</span>
                  </div>
                  <div style={{fontSize:'.8rem',color:'#5a6a7a'}}>
                    <strong style={{color:N}}>{sheet.count}</strong> rows to upload
                  </div>
                  {sheet.message && (
                    <div style={{fontSize:'.8rem',color:STATUS_COLORS[sheet.status],fontWeight:700,marginTop:4}}>
                      {sheet.message}
                    </div>
                  )}
                </div>

                {/* Status badge */}
                <span style={{
                  background: STATUS_COLORS[sheet.status] + '22',
                  color: STATUS_COLORS[sheet.status],
                  border: `1px solid ${STATUS_COLORS[sheet.status]}44`,
                  padding:'4px 12px',borderRadius:99,fontSize:'.72rem',fontWeight:800,flexShrink:0
                }}>
                  {sheet.status === 'pending'   ? '⏳ Pending'   : ''}
                  {sheet.status === 'uploading' ? '⚡ Uploading' : ''}
                  {sheet.status === 'done'      ? '✅ Done'      : ''}
                  {sheet.status === 'error'     ? '❌ Error'     : ''}
                </span>

                {/* Upload button */}
                {sheet.status === 'pending' && (
                  <button className="btn btn-teal" style={{flexShrink:0}}
                    onClick={() => uploadSheet(idx)} disabled={uploading}>
                    Upload →
                  </button>
                )}
                {sheet.status === 'error' && (
                  <button className="btn" style={{background:'#fde8ea',color:'#ef4444',flexShrink:0}}
                    onClick={() => uploadSheet(idx)}>
                    Retry
                  </button>
                )}

                {/* Preview toggle */}
                <div style={{width:'100%'}}>
                  <details>
                    <summary>Preview first 3 rows</summary>
                    <div style={{overflowX:'auto',marginTop:8}}>
                      <table className="preview-table">
                        <thead>
                          <tr>
                            {Object.keys(sheet.rows[0] || {})
                              .filter(k => !['id','slug','createdAt','posts','advPdfs','jobAffiliates','dateHistory','sections','examPdfs','examAffiliates','importantDates','processImages','howToApplyImages','detailsImages'].includes(k))
                              .slice(0, 8)
                              .map(k => <th key={k}>{k}</th>)
                            }
                          </tr>
                        </thead>
                        <tbody>
                          {sheet.rows.slice(0, 3).map((row, ri) => (
                            <tr key={ri}>
                              {Object.keys(sheet.rows[0] || {})
                                .filter(k => !['id','slug','createdAt','posts','advPdfs','jobAffiliates','dateHistory','sections','examPdfs','examAffiliates','importantDates','processImages','howToApplyImages','detailsImages'].includes(k))
                                .slice(0, 8)
                                .map(k => <td key={k} title={String(row[k] || '')}>{String(row[k] || '—')}</td>)
                              }
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </details>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* How it works */}
        <div className="card" style={{marginTop:24,background:'#f8fbff'}}>
          <h3 style={{fontFamily:'Sora,sans-serif',fontWeight:700,fontSize:'.9rem',color:N,margin:'0 0 12px'}}>ℹ️ How It Works</h3>
          <div style={{fontSize:'.83rem',color:'#4a5a6a',lineHeight:1.9}}>
            <div>1. Download the template above and fill in your data — one row per entry.</div>
            <div>2. Sheet names must be exactly: <strong>Jobs, Exams, Information, Results, Announcements, Guides, Services</strong></div>
            <div>3. Upload the file — it detects each sheet automatically.</div>
            <div>4. Duplicate entries (same title) are skipped automatically.</div>
            <div>5. New entries are added to existing data — nothing is deleted.</div>
            <div style={{marginTop:8,color:'#e63946',fontWeight:700}}>⚠️ Required column: <strong>Title</strong> must be filled for every row.</div>
          </div>
        </div>

      </div>
    </>
  )
}