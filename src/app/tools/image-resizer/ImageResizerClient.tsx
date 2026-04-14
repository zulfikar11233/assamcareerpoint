'use client'
import { useState, useRef } from 'react'
import { C, S, ToolHeader, Divider } from '../_shared'

const PRESETS = [
  { group:'Assam State Exams', label:'ADRE Photo (210×310)',     w:210,  h:310 },
  { group:'Assam State Exams', label:'ADRE Signature (210×110)', w:210,  h:110 },
  { group:'Assam State Exams', label:'APSC Photo (413×531)',     w:413,  h:531 },
  { group:'Assam State Exams', label:'APSC Signature (413×155)', w:413,  h:155 },
  { group:'Assam State Exams', label:'SLPRB Photo (413×531)',    w:413,  h:531 },
  { group:'Assam State Exams', label:'SLPRB Signature (472×236)',w:472,  h:236 },
  { group:'Assam State Exams', label:'DHS Photo (210×310)',      w:210,  h:310 },
  { group:'Assam State Exams', label:'DHS Signature (210×110)',  w:210,  h:110 },
  { group:'Assam State Exams', label:'NHM Assam Photo (200×230)',w:200,  h:230 },
  { group:'Assam State Exams', label:'APDCL Photo (150×200)',    w:150,  h:200 },
  { group:'Central Govt',      label:'SSC Photo (100×120)',      w:100,  h:120 },
  { group:'Central Govt',      label:'SSC Signature (140×60)',   w:140,  h:60  },
  { group:'Central Govt',      label:'Railway Photo (150×200)',  w:150,  h:200 },
  { group:'Central Govt',      label:'UPSC Photo (300×300)',     w:300,  h:300 },
  { group:'Central Govt',      label:'Bank Photo (200×200)',     w:200,  h:200 },
  { group:'Central Govt',      label:'Bank Signature (140×60)', w:140,  h:60  },
  { group:'Central Govt',      label:'Defence Photo (200×240)',  w:200,  h:240 },
  { group:'General',           label:'Passport Size (450×600)',  w:450,  h:600 },
  { group:'General',           label:'Stamp Size (250×300)',     w:250,  h:300 },
  { group:'Social Media',      label:'Facebook Post (1200×630)', w:1200, h:630 },
  { group:'Social Media',      label:'Instagram Post (1080×1080)',w:1080,h:1080},
  { group:'Social Media',      label:'Instagram Story (1080×1920)',w:1080,h:1920},
  { group:'Social Media',      label:'X/Twitter (1600×900)',     w:1600, h:900 },
  { group:'Social Media',      label:'WhatsApp DP (800×800)',    w:800,  h:800 },
  { group:'Social Media',      label:'YouTube Thumb (1280×720)', w:1280, h:720 },
]
const GROUPS = [...new Set(PRESETS.map(p => p.group))]

const BG_PRESETS = [
  { label:'White',       v:'#ffffff' },
  { label:'Blue',        v:'#0000ff' },
  { label:'Light Blue',  v:'#add8e6' },
  { label:'Red',         v:'#ff0000' },
  { label:'Transparent', v:'transparent' },
]

export default function ImageResizerClient() {
  const [file, setFile]         = useState<File|null>(null)
  const [preview, setPreview]   = useState('')
  const [preset, setPreset]     = useState('')
  const [cw, setCw]             = useState('')
  const [ch, setCh]             = useState('')
  const [bg, setBg]             = useState('#ffffff')
  const [customBg, setCustomBg] = useState('#ffffff')
  const [format, setFormat]     = useState<'jpeg'|'png'|'webp'>('jpeg')
  const [quality, setQuality]   = useState(90)
  const [targetKb, setTargetKb] = useState('')
  const [rotation, setRotation] = useState(0)
  const [fit, setFit]           = useState<'contain'|'cover'|'stretch'>('contain')
  const [result, setResult]     = useState('')
  const [resultSize, setResultSize] = useState('')
  const [resultDims, setResultDims] = useState('')
  const [error, setError]       = useState('')
  const [processing, setProcessing] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFile = (f: File) => {
    if (!f.type.startsWith('image/')) { setError('Please upload an image file.'); return }
    setFile(f); setError(''); setResult('')
    const r = new FileReader(); r.onload = e => setPreview(e.target?.result as string); r.readAsDataURL(f)
  }

  const getDims = () => {
    if (preset && preset !== 'custom') { const p = PRESETS.find(p => p.label === preset); return p ? { w: p.w, h: p.h } : null }
    const w = parseInt(cw), h = parseInt(ch)
    return (!w || !h) ? null : { w, h }
  }

  const process = async () => {
    if (!file) { setError('Please upload an image first.'); return }
    const dims = getDims()
    if (!dims) { setError('Please select a preset or enter custom dimensions.'); return }
    setProcessing(true); setError('')

    const img = new Image(); img.src = preview
    await new Promise(r => { img.onload = r })

    const canvas = document.createElement('canvas')
    const rot = rotation; const rotated = rot === 90 || rot === 270
    canvas.width = rotated ? dims.h : dims.w
    canvas.height = rotated ? dims.w : dims.h
    const ctx = canvas.getContext('2d')!

    const bgCol = bg === 'custom' ? customBg : bg
    if (bgCol !== 'transparent') { ctx.fillStyle = bgCol; ctx.fillRect(0, 0, canvas.width, canvas.height) }

    ctx.save(); ctx.translate(canvas.width/2, canvas.height/2); ctx.rotate(rot * Math.PI/180)
    const tw = rotated ? dims.h : dims.w, th = rotated ? dims.w : dims.h
    let sw = tw, sh = th
    if (fit === 'contain') { const sc = Math.min(tw/img.width, th/img.height); sw = img.width*sc; sh = img.height*sc }
    else if (fit === 'cover') { const sc = Math.max(tw/img.width, th/img.height); sw = img.width*sc; sh = img.height*sc }
    ctx.drawImage(img, -sw/2, -sh/2, sw, sh); ctx.restore()

    const toBlob = (q: number) => new Promise<Blob>(res => canvas.toBlob(b => res(b!), `image/${format}`, q/100))

    let blob: Blob
    if (targetKb && Number(targetKb) > 0) {
      const target = Number(targetKb)*1024; let lo=1, hi=100, best: Blob|null = null
      for (let i=0; i<10; i++) { const mid=Math.floor((lo+hi)/2); const b=await toBlob(mid); if(b.size<=target){best=b;lo=mid+1}else hi=mid-1 }
      blob = best || await toBlob(10)
    } else blob = await toBlob(quality)

    setResult(URL.createObjectURL(blob)); setResultSize(`${(blob.size/1024).toFixed(1)} KB`); setResultDims(`${dims.w}×${dims.h} px`)
    setProcessing(false)
  }

  const download = () => {
    const d = getDims(); const n = file?.name.replace(/\.[^.]+$/,'') || 'image'
    const a = document.createElement('a'); a.href = result; a.download = `${n}-${d?.w}x${d?.h}.${format}`; a.click()
  }

  const seg = (opts: string[], val: string, set: (v: any)=>void) => (
    <div style={{ display:'flex', gap:'8px', flexWrap:'wrap' }}>
      {opts.map(o => (
        <button key={o} onClick={() => set(o)} style={{
          padding:'10px 16px', borderRadius:'10px', fontSize:'14px', fontWeight:700,
          border:`2px solid ${val===o ? C.teal : C.gray200}`,
          background: val===o ? '#e6faf8' : C.white,
          color: val===o ? C.teal2 : C.gray500,
          cursor:'pointer', fontFamily:'inherit',
        }}>{o}</button>
      ))}
    </div>
  )

  return (
    <main style={S.page}>
      <ToolHeader title="Photo & Image Resizer"
        desc="Resize photos for ADRE, APSC, SLPRB, SSC, Railway, Bank exams. 25+ presets with compression, background color, crop and rotation tools." />

      <div style={S.wrap}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr', gap:'24px' }}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(320px,1fr))', gap:'24px' }}>

            {/* Upload */}
            <div style={S.card}>
              <h2 style={S.cardTitle}>1. Upload Image</h2>
              <div
                onClick={() => fileRef.current?.click()}
                onDrop={e=>{e.preventDefault(); e.dataTransfer.files[0] && handleFile(e.dataTransfer.files[0])}}
                onDragOver={e=>e.preventDefault()}
                style={{ border:`2px dashed ${C.gray200}`, borderRadius:'14px', padding:'32px 20px', textAlign:'center', cursor:'pointer', background:C.gray50 }}
              >
                {preview ? (
                  <div>
                    <img src={preview} alt="Preview" style={{ maxHeight:'140px', maxWidth:'100%', borderRadius:'10px', objectFit:'contain', marginBottom:'10px' }} />
                    <p style={{ color:C.gray500, fontSize:'14px', margin:0 }}>{file?.name} — Click to change</p>
                  </div>
                ) : (
                  <>
                    <div style={{ fontSize:'48px', marginBottom:'12px' }}>🖼️</div>
                    <p style={{ fontSize:'16px', fontWeight:700, color:C.gray600, margin:'0 0 6px' }}>Click or drag & drop to upload</p>
                    <p style={{ fontSize:'14px', color:C.gray400, margin:0 }}>Supports JPG, PNG, WEBP</p>
                  </>
                )}
              </div>
              <input ref={fileRef} type="file" accept="image/*" style={{ display:'none' }} onChange={e=>e.target.files?.[0] && handleFile(e.target.files[0])} />
            </div>

            {/* Size */}
            <div style={S.card}>
              <h2 style={S.cardTitle}>2. Select Size</h2>
              <label style={S.label}>Choose Preset</label>
              <select style={S.select} value={preset} onChange={e=>setPreset(e.target.value)}>
                <option value="">-- Select Preset --</option>
                <option value="custom">✏️ Custom Size</option>
                {GROUPS.map(g => (
                  <optgroup key={g} label={g}>
                    {PRESETS.filter(p=>p.group===g).map(p=><option key={p.label} value={p.label}>{p.label}</option>)}
                  </optgroup>
                ))}
              </select>
              {(!preset || preset==='custom') && (
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px', marginTop:'16px' }}>
                  <div>
                    <label style={S.label}>Width (px)</label>
                    <input style={S.input} value={cw} onChange={e=>setCw(e.target.value)} placeholder="e.g. 450" type="number" min="1" />
                  </div>
                  <div>
                    <label style={S.label}>Height (px)</label>
                    <input style={S.input} value={ch} onChange={e=>setCh(e.target.value)} placeholder="e.g. 600" type="number" min="1" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Advanced Options */}
          <div style={S.card}>
            <h2 style={S.cardTitle}>3. Advanced Options</h2>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(240px,1fr))', gap:'24px' }}>
              <div>
                <label style={S.label}>Fit Mode</label>
                {seg(['contain','cover','stretch'], fit, setFit)}
                <p style={S.hint}>Contain: fit inside · Cover: fill & crop · Stretch: force fit</p>
              </div>
              <div>
                <label style={S.label}>Rotation</label>
                {seg(['0','90','180','270'], String(rotation), v=>setRotation(Number(v)))}
              </div>
              <div>
                <label style={S.label}>Output Format</label>
                {seg(['jpeg','png','webp'], format, setFormat)}
              </div>
              <div>
                <label style={S.label}>Background Color</label>
                <div style={{ display:'flex', gap:'8px', flexWrap:'wrap', marginBottom:'8px' }}>
                  {BG_PRESETS.map(b=>(
                    <button key={b.v} onClick={()=>setBg(b.v)} title={b.label} style={{
                      width:'36px', height:'36px', borderRadius:'10px', cursor:'pointer',
                      border:`3px solid ${bg===b.v ? C.teal : C.gray200}`,
                      background: b.v==='transparent' ? 'repeating-conic-gradient(#ccc 0% 25%,white 0% 50%) 0 0/12px 12px' : b.v,
                      transform: bg===b.v ? 'scale(1.1)' : 'scale(1)',
                    }} />
                  ))}
                  <button onClick={()=>setBg('custom')} style={{
                    padding:'6px 12px', borderRadius:'10px', fontSize:'13px', fontWeight:700,
                    border:`3px solid ${bg==='custom' ? C.teal : C.gray200}`,
                    background: bg==='custom' ? '#e6faf8' : C.white,
                    color: bg==='custom' ? C.teal2 : C.gray500, cursor:'pointer', fontFamily:'inherit',
                  }}>Custom</button>
                </div>
                {bg==='custom' && (
                  <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                    <input type="color" value={customBg} onChange={e=>setCustomBg(e.target.value)} style={{ width:'40px', height:'40px', borderRadius:'8px', border:`1px solid ${C.gray200}`, cursor:'pointer' }} />
                    <span style={{ fontSize:'14px', color:C.gray600 }}>{customBg}</span>
                  </div>
                )}
              </div>
              <div>
                <label style={S.label}>Quality: {quality}%</label>
                <input type="range" min="10" max="100" value={quality} onChange={e=>setQuality(Number(e.target.value))} style={{ width:'100%', accentColor:C.teal }} />
              </div>
              <div>
                <label style={S.label}>Target File Size (KB)</label>
                <input style={S.input} value={targetKb} onChange={e=>setTargetKb(e.target.value)} placeholder="e.g. 50 (overrides quality)" type="number" min="1" />
              </div>
            </div>
          </div>

          {error && <div style={S.error}>{error}</div>}

          <button style={{ ...S.btnPrimary, fontSize:'18px', padding:'18px' }} onClick={process} disabled={processing}>
            {processing ? '⏳ Processing...' : '✅ Resize Image'}
          </button>

          {/* Result */}
          {result && (
            <div style={S.card}>
              <h2 style={S.cardTitle}>Result</h2>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(240px,1fr))', gap:'24px', alignItems:'center' }}>
                <div style={{ background:'repeating-conic-gradient(#f0f0f0 0% 25%,white 0% 50%) 0 0/16px 16px', borderRadius:'14px', overflow:'hidden', display:'flex', alignItems:'center', justifyContent:'center', minHeight:'160px' }}>
                  <img src={result} alt="Resized" style={{ maxWidth:'100%', maxHeight:'240px', objectFit:'contain', display:'block' }} />
                </div>
                <div>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px', marginBottom:'20px' }}>
                    <div style={S.statCard}>
                      <p style={S.statVal}>{resultDims}</p>
                      <p style={S.statLabel}>Dimensions</p>
                    </div>
                    <div style={S.statCard}>
                      <p style={S.statVal}>{resultSize}</p>
                      <p style={S.statLabel}>File Size</p>
                    </div>
                  </div>
                  <button style={S.btnGold} onClick={download}>⬇ Download Image</button>
                </div>
              </div>
            </div>
          )}

          {/* Reference table */}
          <div style={S.card}>
            <h2 style={S.sectionTitle}>Government Exam Photo Size Reference</h2>
            <div style={{ overflowX:'auto' }}>
              <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'15px' }}>
                <thead>
                  <tr style={{ background:C.gray50 }}>
                    {['Exam / Organization','Photo Size','Signature Size','Max File Size'].map(h=>(
                      <th key={h} style={{ padding:'12px 16px', textAlign:'left', fontWeight:700, color:C.gray700, borderBottom:`2px solid ${C.gray200}` }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['ADRE / Assam Direct Recruitment','210×310 px','210×110 px','100 KB'],
                    ['APSC (Combined Competitive)','413×531 px','413×155 px','150 KB'],
                    ['SLPRB (Assam Police)','413×531 px','472×236 px','100 KB'],
                    ['DHS Assam','210×310 px','210×110 px','100 KB'],
                    ['SSC (CGL/CHSL/MTS)','100×120 px','140×60 px','50 KB'],
                    ['RRB Railway','150×200 px','100×50 px','100 KB'],
                    ['IBPS / SBI Bank','200×200 px','140×60 px','100 KB'],
                    ['UPSC Civil Services','300×300 px','300×100 px','300 KB'],
                  ].map((r,i)=>(
                    <tr key={r[0]} style={{ background: i%2===0 ? C.gray50 : C.white }}>
                      {r.map((c,j)=>(
                        <td key={j} style={{ padding:'12px 16px', borderBottom:`1px solid ${C.gray100}`, color: j===0 ? C.gray800 : C.gray600, fontWeight: j===0 ? 600 : 400 }}>{c}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p style={{ fontSize:'13px', color:C.gray400, marginTop:'12px' }}>* Always check the official notification PDF for exact dimensions before uploading.</p>
          </div>
        </div>
      </div>
    </main>
  )
}
