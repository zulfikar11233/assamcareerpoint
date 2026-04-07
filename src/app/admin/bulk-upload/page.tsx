// src\app\admin\bulk-upload
'use client'
export const dynamic = 'force-dynamic'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import * as XLSX from 'xlsx'

const G = '#c9a227', T = '#1dbfad', N = '#0b1f33', W = '#ffffff'

const SHEET_MAP: Record<string, string> = {
  'jobs':'jobs','job':'jobs',
  'exams':'exams','exam':'exams',
  'information':'info','info':'info',
  'results':'results','result':'results',
  'announcements':'announcements','announcement':'announcements',
  'guides':'guides','guide':'guides',
  'services':'services','service':'services',
}

const DEFAULTS: Record<string, object> = {
  jobs:          { logo:'🏛️', category:'Govt Job', district:'All Districts', status:'Live', vacancy:'0', lastDateTime:'23:59 Hrs', posts:[], advPdfs:[], jobAffiliates:[], dateHistory:[], sections:[], howToApplyImages:[], detailsImages:[] },
  exams:         { emoji:'📚', category:'Teaching', status:'Upcoming', examPdfs:[], examAffiliates:[], sections:[] },
  info:          { emoji:'🗳️', category:'Electoral', status:'Active', importantDates:[], sections:[], processImages:[] },
  results:       { status:'Upcoming', sections:[] },
  announcements: { status:'Published', category:'General', isImportant:false, sections:[] },
  guides:        { emoji:'📖', status:'Published', sections:[] },
  services:      { emoji:'⚙️', status:'Active', sections:[] },
}

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
  return title.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'') + '-' + id
}

function normalizeKey(raw: string): string {
  const lower = raw.trim().toLowerCase()
  return COL_MAP[lower] || lower.replace(/\s+/g,'')
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
  headers: string[]
  status: 'pending'|'uploading'|'done'|'error'
  message: string
  count: number
}

const COLLECTION_LABELS: Record<string,string> = {
  jobs:'💼 Jobs', exams:'📚 Exams', info:'ℹ️ Information',
  results:'📊 Results', announcements:'📢 Announcements',
  guides:'📖 Guides', services:'⚙️ Services',
}
const STATUS_COLORS: Record<string,string> = {
  pending:'#5a6a7a', uploading:T, done:'#22c55e', error:'#ef4444'
}
const SKIP_PREVIEW = ['id','slug','createdAt','posts','advPdfs','jobAffiliates',
  'dateHistory','sections','examPdfs','examAffiliates','importantDates',
  'processImages','howToApplyImages','detailsImages']

export default function BulkUploadPage() {
  // ── FIX: safe destructure — useSession may return undefined during SSR ──
  const sessionResult = useSession()
  const session = sessionResult?.data
  const status  = sessionResult?.status ?? 'loading'

  const router  = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)

  const [sheets,    setSheets]    = useState<SheetResult[]>([])
  const [dragging,  setDragging]  = useState(false)
  const [fileName,  setFileName]  = useState('')
  const [uploading, setUploading] = useState(false)

  // Preview modal state
  const [previewIdx,    setPreviewIdx]    = useState<number|null>(null)
  const [previewSearch, setPreviewSearch] = useState('')
  const [previewPage,   setPreviewPage]   = useState(1)
  const PAGE_SIZE = 10

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/admin/login')
  }, [status, router])

  if (status === 'loading') return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#f0f4f8'}}>
      <div style={{fontFamily:'Nunito,sans-serif',color:N,fontWeight:700}}>Loading...</div>
    </div>
  )
  if (!session || (session.user as any)?.role !== 'admin') return null

  // ── Parse Excel ──────────────────────────────────────────────
  function parseFile(file: File) {
    setFileName(file.name)
    setSheets([])
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const wb = XLSX.read(e.target!.result, { type:'binary', cellDates:true })
        const results: SheetResult[] = []
        for (const sheetName of wb.SheetNames) {
          const collection = SHEET_MAP[sheetName.toLowerCase().trim()]
          if (!collection) continue
          const ws = wb.Sheets[sheetName]
          const rawRows: Record<string,any>[] = XLSX.utils.sheet_to_json(ws, { defval:'' })
          const filtered = rawRows.filter(r => Object.values(r).some(v => String(v).trim() !== ''))
          if (filtered.length === 0) continue
          const rows = filtered.map((r,i) => parseRow(r, collection, i))
          // Visible headers for preview (original Excel column names, skip internal)
          const headers = Object.keys(filtered[0] || {})
          results.push({ sheetName, collection, rows, headers, status:'pending', message:'', count:rows.length })
        }
        if (results.length === 0) {
          alert('No recognised sheets found.\nSheet names must be: Jobs, Exams, Information, Results, Announcements, Guides, Services')
          return
        }
        setSheets(results)
      } catch {
        alert('Failed to read file. Make sure it is a valid .xlsx file.')
      }
    }
    reader.readAsBinaryString(file)
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) parseFile(file)
    e.target.value = ''
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault(); setDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file?.name.endsWith('.xlsx')) parseFile(file)
    else alert('Please drop a .xlsx file')
  }

  // ── Upload one sheet ─────────────────────────────────────────
  async function uploadSheet(idx: number) {
    setSheets(prev => prev.map((s,i) => i===idx ? {...s, status:'uploading', message:'Fetching existing data...'} : s))
    try {
      const sheet = sheets[idx]
      const res   = await fetch(`/api/data/${sheet.collection}`, { cache:'no-store' })
      const existing: any[] = res.ok ? await res.json() : []
      const existingTitles  = new Set(existing.map((x:any) => String(x.title||'').toLowerCase()))
      const toAdd   = sheet.rows.filter(r => !existingTitles.has(String(r.title||'').toLowerCase()))
      const skipped = sheet.rows.length - toAdd.length
      const merged  = [...existing, ...toAdd]
      setSheets(prev => prev.map((s,i) => i===idx ? {...s, message:`Saving ${toAdd.length} entries...`} : s))
      const postRes = await fetch(`/api/data/${sheet.collection}`, {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify(merged),
      })
      if (!postRes.ok) throw new Error('Server returned ' + postRes.status)
      setSheets(prev => prev.map((s,i) => i===idx ? {
        ...s, status:'done',
        message:`✅ ${toAdd.length} added${skipped>0?`, ${skipped} skipped (duplicate title)`:''}`
      } : s))
    } catch (err: any) {
      setSheets(prev => prev.map((s,i) => i===idx ? {
        ...s, status:'error', message:'❌ Failed: ' + (err.message||'Unknown error')
      } : s))
    }
  }

  async function uploadAll() {
    setUploading(true)
    for (let i=0; i<sheets.length; i++) {
      if (sheets[i].status !== 'done') await uploadSheet(i)
    }
    setUploading(false)
  }

  const pendingCount = sheets.filter(s => s.status==='pending').length
  const doneCount    = sheets.filter(s => s.status==='done').length

  // ── Preview modal data ───────────────────────────────────────
  const previewSheet = previewIdx !== null ? sheets[previewIdx] : null
  const previewRows  = previewSheet
    ? previewSheet.rows.filter(r =>
        !previewSearch ||
        Object.values(r).some(v => String(v).toLowerCase().includes(previewSearch.toLowerCase()))
      )
    : []
  const previewTotalPages = Math.ceil(previewRows.length / PAGE_SIZE)
  const previewVisible    = previewRows.slice((previewPage-1)*PAGE_SIZE, previewPage*PAGE_SIZE)
  const previewHeaders    = previewSheet
    ? Object.keys(previewSheet.rows[0]||{}).filter(k => !SKIP_PREVIEW.includes(k))
    : []

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800&family=Nunito:wght@400;600;700&display=swap');
        *,*::before,*::after{box-sizing:border-box}
        body{margin:0;font-family:Nunito,sans-serif;background:#f0f4f8;color:#1a1a2e}
        .card{background:#fff;border:1.5px solid #d4e0ec;border-radius:14px;padding:22px;margin-bottom:18px}
        .drop-zone{border:2.5px dashed #d4e0ec;border-radius:14px;padding:44px 20px;text-align:center;cursor:pointer;transition:.2s;background:#f8fbff}
        .drop-zone.drag,.drop-zone:hover{border-color:${T};background:#e8faf9}
        .btn{padding:10px 20px;border-radius:10px;border:none;font-family:Nunito,sans-serif;font-weight:700;font-size:.86rem;cursor:pointer;transition:.18s;display:inline-flex;align-items:center;gap:6px}
        .btn:disabled{opacity:.5;cursor:not-allowed}
        .btn-gold{background:${G};color:${N}}
        .btn-gold:hover:not(:disabled){filter:brightness(1.08)}
        .btn-teal{background:${T};color:${N}}
        .btn-teal:hover:not(:disabled){filter:brightness(1.05)}
        .btn-navy{background:${N};color:${G};border:1.5px solid ${G}44}
        .btn-nav{background:rgba(255,255,255,.08);color:rgba(255,255,255,.65);padding:7px 13px;border-radius:8px;text-decoration:none;font-size:.82rem;font-weight:700}
        .btn-nav:hover{color:${G}}
        .sheet-row{background:#fff;border:1.5px solid #d4e0ec;border-radius:12px;padding:16px 18px;display:flex;align-items:flex-start;gap:14px;flex-wrap:wrap;margin-bottom:10px;transition:.18s}
        .sheet-row:hover{border-color:#b0c4d8}
        /* Preview modal */
        .modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:1000;display:flex;align-items:flex-start;justify-content:center;padding:20px;overflow-y:auto}
        .modal{background:#fff;border-radius:16px;width:100%;max-width:1100px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,.3)}
        .modal-header{background:${N};padding:18px 22px;display:flex;align-items:center;justify-content:space-between}
        .modal-body{padding:20px;overflow-x:auto}
        .preview-table{width:100%;border-collapse:collapse;font-size:.78rem;min-width:500px}
        .preview-table th{background:${N};color:${G};padding:8px 11px;text-align:left;font-size:.72rem;font-family:Arial Black,sans-serif;white-space:nowrap;position:sticky;top:0}
        .preview-table td{padding:8px 11px;border-bottom:1px solid #f0f4f8;color:#2a3a4a;max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
        .preview-table tr:hover td{background:#f0f9ff}
        .preview-table tr:nth-child(even) td{background:#f8fbff}
        .preview-table tr:nth-child(even):hover td{background:#e8f5ff}
        .pg-btn{padding:5px 11px;border-radius:7px;border:1.5px solid #d4e0ec;background:#fff;cursor:pointer;font-family:Nunito,sans-serif;font-weight:700;font-size:.8rem;color:${N}}
        .pg-btn.active{background:${N};color:${G};border-color:${N}}
        .pg-btn:hover:not(.active){background:#f0f4f8}
        .search-input{padding:8px 14px;border:1.5px solid #d4e0ec;border-radius:9px;font-family:Nunito,sans-serif;font-size:.85rem;width:260px;outline:none}
        .search-input:focus{border-color:${T}}
      `}</style>

      {/* Header */}
      <header style={{background:N,borderBottom:`2px solid ${G}`,position:'sticky',top:0,zIndex:200,padding:'12px 24px',display:'flex',alignItems:'center',gap:14,flexWrap:'wrap' as const}}>
        <Link href="/" style={{fontFamily:'Arial Black,sans-serif',fontSize:'.9rem',textDecoration:'none'}}>
          <span style={{color:G}}>ASSAM </span><span style={{color:W}}>CAREER</span><span style={{color:T}}> POINT</span>
        </Link>
        <nav style={{display:'flex',gap:8,marginLeft:8}}>
          <Link href="/admin/dashboard" className="btn-nav">← Dashboard</Link>
          <span style={{color:G,fontSize:'.82rem',fontWeight:700,padding:'7px 13px'}}>📤 Bulk Upload</span>
        </nav>
      </header>

      <div style={{maxWidth:920,margin:'0 auto',padding:'28px 20px 60px'}}>

        {/* Title */}
        <div style={{marginBottom:22}}>
          <h1 style={{fontFamily:'Sora,sans-serif',fontWeight:800,fontSize:'1.5rem',color:N,margin:'0 0 6px'}}>📤 Bulk Excel Upload</h1>
          <p style={{color:'#5a6a7a',fontSize:'.88rem',margin:0}}>Upload a single Excel file with multiple sheets. Preview your data before uploading — nothing is saved until you click Upload.</p>
        </div>

        {/* Template download */}
        <div className="card" style={{borderLeft:`4px solid ${G}`,background:'#fffdf0'}}>
          <div style={{display:'flex',alignItems:'center',gap:14,flexWrap:'wrap' as const}}>
            <div style={{flex:1}}>
              <div style={{fontFamily:'Sora,sans-serif',fontWeight:700,fontSize:'.92rem',color:N,marginBottom:4}}>📥 Download Excel Template</div>
              <div style={{fontSize:'.82rem',color:'#5a6a7a'}}>
                Sheet names must be exactly: <strong>Jobs · Exams · Information · Results · Announcements · Guides · Services</strong>
              </div>
            </div>
            <a href="/bulk-upload-template.xlsx" download
              style={{padding:'10px 20px',borderRadius:10,background:N,color:G,fontWeight:900,textDecoration:'none',fontFamily:'Arial Black,sans-serif',fontSize:'.82rem',flexShrink:0}}>
              ⬇ Download Template
            </a>
          </div>
        </div>

        {/* Drop zone */}
        <div className={`drop-zone${dragging?' drag':''}`}
          onClick={() => fileRef.current?.click()}
          onDragOver={e=>{e.preventDefault();setDragging(true)}}
          onDragLeave={()=>setDragging(false)}
          onDrop={onDrop}>
          <input ref={fileRef} type="file" accept=".xlsx" style={{display:'none'}} onChange={onFileChange}/>
          <div style={{fontSize:'3rem',marginBottom:10}}>📂</div>
          <div style={{fontFamily:'Sora,sans-serif',fontWeight:700,fontSize:'1rem',color:N,marginBottom:5}}>
            {fileName ? `📄 ${fileName}` : 'Click or drag & drop your Excel file here'}
          </div>
          <div style={{fontSize:'.8rem',color:'#8fa3b8'}}>.xlsx files only · Multiple sheets supported</div>
          {fileName && (
            <div style={{marginTop:10,fontSize:'.78rem',color:T,fontWeight:700}}>
              Click again to load a different file
            </div>
          )}
        </div>

        {/* Detected sheets */}
        {sheets.length > 0 && (
          <div style={{marginTop:26}}>
            {/* Summary bar */}
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:14,flexWrap:'wrap' as const,gap:10}}>
              <div>
                <h2 style={{fontFamily:'Sora,sans-serif',fontWeight:700,fontSize:'1rem',color:N,margin:'0 0 2px'}}>
                  📋 {sheets.length} sheet{sheets.length>1?'s':''} detected
                </h2>
                <div style={{fontSize:'.8rem',color:'#5a6a7a'}}>
                  Preview each sheet below, then upload individually or all at once.
                </div>
              </div>
              <div style={{display:'flex',gap:8,flexWrap:'wrap' as const}}>
                {pendingCount > 0 && (
                  <button className="btn btn-gold" onClick={uploadAll} disabled={uploading}>
                    {uploading ? '⏳ Uploading...' : `🚀 Upload All (${pendingCount})`}
                  </button>
                )}
                {doneCount === sheets.length && doneCount > 0 && (
                  <span style={{color:'#22c55e',fontWeight:700,fontSize:'.88rem',padding:'10px 0'}}>✅ All complete!</span>
                )}
              </div>
            </div>

            {/* Progress bar */}
            {sheets.length > 0 && (
              <div style={{background:'#f0f4f8',borderRadius:99,height:8,marginBottom:18,overflow:'hidden'}}>
                <div style={{
                  height:'100%',borderRadius:99,
                  background:`linear-gradient(90deg,${T},${G})`,
                  width:`${(doneCount/sheets.length)*100}%`,
                  transition:'width .4s ease'
                }}/>
              </div>
            )}

            {/* Sheet cards */}
            {sheets.map((sheet, idx) => (
              <div key={idx} className="sheet-row">

                {/* Left: label + count + message */}
                <div style={{flex:1,minWidth:200}}>
                  <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:4,flexWrap:'wrap' as const}}>
                    <span style={{fontFamily:'Sora,sans-serif',fontWeight:700,fontSize:'.95rem',color:N}}>
                      {COLLECTION_LABELS[sheet.collection]||sheet.collection}
                    </span>
                    <span style={{
                      background: STATUS_COLORS[sheet.status]+'22',
                      color: STATUS_COLORS[sheet.status],
                      border:`1px solid ${STATUS_COLORS[sheet.status]}44`,
                      padding:'2px 10px',borderRadius:99,fontSize:'.68rem',fontWeight:800
                    }}>
                      {sheet.status==='pending'?'⏳ Pending':sheet.status==='uploading'?'⚡ Uploading':sheet.status==='done'?'✅ Done':'❌ Error'}
                    </span>
                  </div>
                  <div style={{fontSize:'.8rem',color:'#5a6a7a',marginBottom:4}}>
                    <strong style={{color:N}}>{sheet.count}</strong> row{sheet.count!==1?'s':''} · sheet: <em>"{sheet.sheetName}"</em>
                  </div>
                  {sheet.message && (
                    <div style={{fontSize:'.8rem',color:STATUS_COLORS[sheet.status],fontWeight:700}}>
                      {sheet.message}
                    </div>
                  )}
                </div>

                {/* Right: buttons */}
                <div style={{display:'flex',gap:8,flexShrink:0,flexWrap:'wrap' as const}}>
                  {/* PREVIEW BUTTON */}
                  <button className="btn btn-navy"
                    onClick={()=>{setPreviewIdx(idx);setPreviewSearch('');setPreviewPage(1)}}
                    style={{fontSize:'.8rem',padding:'8px 14px'}}>
                    🔍 Preview {sheet.count} rows
                  </button>

                  {sheet.status==='pending' && (
                    <button className="btn btn-teal" onClick={()=>uploadSheet(idx)} disabled={uploading}>
                      Upload →
                    </button>
                  )}
                  {sheet.status==='error' && (
                    <button className="btn" style={{background:'#fde8ea',color:'#ef4444',border:'1.5px solid #f7bcc0'}}
                      onClick={()=>uploadSheet(idx)}>
                      🔄 Retry
                    </button>
                  )}
                  {sheet.status==='done' && (
                    <Link href="/admin/dashboard" className="btn btn-teal" style={{textDecoration:'none',fontSize:'.8rem',padding:'8px 14px'}}>
                      View in Dashboard →
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* How it works */}
        <div className="card" style={{marginTop:24,background:'#f8fbff',borderLeft:`3px solid ${T}`}}>
          <h3 style={{fontFamily:'Sora,sans-serif',fontWeight:700,fontSize:'.9rem',color:N,margin:'0 0 10px'}}>ℹ️ How It Works</h3>
          <div style={{fontSize:'.83rem',color:'#4a5a6a',lineHeight:2}}>
            <div>1. Download the template · fill data · save as <strong>.xlsx</strong></div>
            <div>2. Upload here — all sheets are detected automatically</div>
            <div>3. Click <strong>🔍 Preview</strong> to review your data before saving</div>
            <div>4. Click <strong>Upload</strong> — entries are added to existing data, nothing deleted</div>
            <div>5. Duplicate entries (same title) are skipped automatically</div>
            <div style={{color:'#e63946',fontWeight:700,marginTop:4}}>⚠️ <strong>Title</strong> column is required for every row</div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          PREVIEW MODAL
      ══════════════════════════════════════════════════════ */}
      {previewSheet && (
        <div className="modal-overlay">
          <div className="modal">

            {/* Modal header */}
            <div className="modal-header">
              <div>
                <div style={{fontFamily:'Sora,sans-serif',fontWeight:800,fontSize:'1rem',color:W}}>
                  🔍 Preview — {COLLECTION_LABELS[previewSheet.collection]||previewSheet.collection}
                </div>
                <div style={{fontSize:'.78rem',color:'rgba(255,255,255,.5)',marginTop:3}}>
                  {previewSheet.count} total rows · showing {previewVisible.length} on this page
                </div>
              </div>
              <button onClick={()=>setPreviewIdx(null)}
                style={{background:'rgba(255,255,255,.1)',border:'none',color:W,fontSize:'1.3rem',cursor:'pointer',borderRadius:8,padding:'4px 10px',lineHeight:1}}>
                ✕
              </button>
            </div>

            {/* Search + stats bar */}
            <div style={{padding:'14px 20px',borderBottom:'1px solid #e8eef6',display:'flex',gap:12,alignItems:'center',flexWrap:'wrap' as const}}>
              <input
                className="search-input"
                placeholder="🔍 Search rows..."
                value={previewSearch}
                onChange={e=>{setPreviewSearch(e.target.value);setPreviewPage(1)}}
              />
              <div style={{fontSize:'.82rem',color:'#5a6a7a',marginLeft:'auto'}}>
                {previewSearch
                  ? <span><strong style={{color:N}}>{previewRows.length}</strong> matching rows</span>
                  : <span><strong style={{color:N}}>{previewSheet.count}</strong> total rows · <strong>{previewHeaders.length}</strong> columns</span>
                }
              </div>
            </div>

            {/* Table */}
            <div className="modal-body">
              {previewVisible.length === 0 ? (
                <div style={{textAlign:'center' as const,padding:'40px',color:'#8fa3b8'}}>
                  <div style={{fontSize:'2rem',marginBottom:8}}>🔍</div>
                  <div style={{fontWeight:700}}>No rows match your search</div>
                </div>
              ) : (
                <table className="preview-table">
                  <thead>
                    <tr>
                      <th style={{width:40}}>#</th>
                      {previewHeaders.map(h=><th key={h}>{h}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {previewVisible.map((row, ri) => {
                      const rowNum = (previewPage-1)*PAGE_SIZE + ri + 1
                      const isValid = !!row.title
                      return (
                        <tr key={ri} style={!isValid?{background:'#fff0f0'}:{}}>
                          <td style={{color:'#8fa3b8',fontWeight:700,textAlign:'center' as const}}>
                            {rowNum}
                            {!isValid && <span style={{color:'#ef4444',fontSize:'.65rem',display:'block'}}>⚠️ No title</span>}
                          </td>
                          {previewHeaders.map(h => {
                            const val = String(row[h]||'')
                            const isEmpty = !val || val==='undefined'
                            return (
                              <td key={h} title={val}
                                style={{color:isEmpty?'#c8d4e0':h==='title'?N:'#3a4a5a',fontWeight:h==='title'?700:400}}>
                                {isEmpty ? '—' : val.length>35 ? val.slice(0,35)+'…' : val}
                              </td>
                            )
                          })}
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              )}
            </div>

            {/* Pagination + footer actions */}
            <div style={{padding:'14px 20px',borderTop:'1px solid #e8eef6',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap' as const,gap:10}}>
              {/* Pagination */}
              <div style={{display:'flex',gap:5,alignItems:'center',flexWrap:'wrap' as const}}>
                <button className="pg-btn" disabled={previewPage===1}
                  onClick={()=>setPreviewPage(p=>Math.max(1,p-1))}>← Prev</button>
                {Array.from({length:Math.min(previewTotalPages,7)},(_,i)=>{
                  let page = i+1
                  if (previewTotalPages>7) {
                    if (previewPage<=4)       page = i+1
                    else if (previewPage>=previewTotalPages-3) page = previewTotalPages-6+i
                    else page = previewPage-3+i
                  }
                  return (
                    <button key={page} className={`pg-btn${previewPage===page?' active':''}`}
                      onClick={()=>setPreviewPage(page)}>{page}</button>
                  )
                })}
                <button className="pg-btn" disabled={previewPage===previewTotalPages||previewTotalPages===0}
                  onClick={()=>setPreviewPage(p=>Math.min(previewTotalPages,p+1))}>Next →</button>
                <span style={{fontSize:'.78rem',color:'#8fa3b8',marginLeft:4}}>
                  Page {previewPage} of {previewTotalPages||1}
                </span>
              </div>

              {/* Action buttons inside modal */}
              <div style={{display:'flex',gap:8}}>
                <button className="btn btn-navy" onClick={()=>setPreviewIdx(null)}>
                  Close
                </button>
                {previewIdx !== null && sheets[previewIdx].status==='pending' && (
                  <button className="btn btn-gold"
                    onClick={()=>{setPreviewIdx(null); uploadSheet(previewIdx!)}}
                    disabled={uploading}>
                    ✅ Looks Good — Upload Now
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}