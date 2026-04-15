'use client'
import { useState, useRef } from 'react'
import { C, S, ToolsNavbar, ToolHeader, Seg } from '../_shared'

const PRESETS = [
  { group:'Assam State Exams', label:'ADRE Photo (210×310)',      w:210,  h:310 },
  { group:'Assam State Exams', label:'ADRE Signature (210×110)',  w:210,  h:110 },
  { group:'Assam State Exams', label:'APSC Photo (413×531)',      w:413,  h:531 },
  { group:'Assam State Exams', label:'APSC Signature (413×155)',  w:413,  h:155 },
  { group:'Assam State Exams', label:'SLPRB Photo (413×531)',     w:413,  h:531 },
  { group:'Assam State Exams', label:'SLPRB Signature (472×236)', w:472,  h:236 },
  { group:'Assam State Exams', label:'DHS Photo (210×310)',       w:210,  h:310 },
  { group:'Assam State Exams', label:'DHS Signature (210×110)',   w:210,  h:110 },
  { group:'Assam State Exams', label:'NHM Assam Photo (200×230)', w:200,  h:230 },
  { group:'Assam State Exams', label:'APDCL Photo (150×200)',     w:150,  h:200 },
  { group:'Central Govt',      label:'SSC Photo (100×120)',       w:100,  h:120 },
  { group:'Central Govt',      label:'SSC Signature (140×60)',    w:140,  h:60  },
  { group:'Central Govt',      label:'Railway Photo (150×200)',   w:150,  h:200 },
  { group:'Central Govt',      label:'UPSC Photo (300×300)',      w:300,  h:300 },
  { group:'Central Govt',      label:'Bank Photo (200×200)',      w:200,  h:200 },
  { group:'Central Govt',      label:'Bank Signature (140×60)',   w:140,  h:60  },
  { group:'Central Govt',      label:'Defence Photo (200×240)',   w:200,  h:240 },
  { group:'General',           label:'Passport Size (450×600)',   w:450,  h:600 },
  { group:'General',           label:'Stamp Size (250×300)',      w:250,  h:300 },
  { group:'Social Media',      label:'Facebook Post (1200×630)',  w:1200, h:630 },
  { group:'Social Media',      label:'Instagram Post (1080×1080)',w:1080,h:1080 },
  { group:'Social Media',      label:'Instagram Story (1080×1920)',w:1080,h:1920 },
  { group:'Social Media',      label:'X / Twitter (1600×900)',    w:1600, h:900 },
  { group:'Social Media',      label:'WhatsApp DP (800×800)',     w:800,  h:800 },
  { group:'Social Media',      label:'YouTube Thumb (1280×720)',  w:1280, h:720 },
]
const GROUPS = [...new Set(PRESETS.map(p => p.group))]

const BG_PRESETS = [
  { label: 'White',       v: '#ffffff' },
  { label: 'Blue',        v: '#0000ff' },
  { label: 'Light Blue',  v: '#add8e6' },
  { label: 'Red',         v: '#ff0000' },
]

export default function ImageResizerClient() {
  const [file, setFile]           = useState<File | null>(null)
  const [preview, setPreview]     = useState('')
  const [preset, setPreset]       = useState('')
  const [cw, setCw]               = useState('')
  const [ch, setCh]               = useState('')
  const [bgMode, setBgMode]       = useState<'preset' | 'custom' | 'transparent'>('preset')
  const [bgPreset, setBgPreset]   = useState('#ffffff')
  const [customBg, setCustomBg]   = useState('#ffffff')
  const [format, setFormat]       = useState<'jpeg' | 'png' | 'webp'>('jpeg')
  const [quality, setQuality]     = useState(90)
  const [targetKb, setTargetKb]   = useState('')
  const [rotation, setRotation]   = useState(0)
  const [fit, setFit]             = useState<'contain' | 'cover' | 'stretch'>('contain')
  const [result, setResult]       = useState('')
  const [resultSize, setResultSize] = useState('')
  const [resultDims, setResultDims] = useState('')
  const [error, setError]         = useState('')
  const [processing, setProcessing] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFile = (f: File) => {
    if (!f.type.startsWith('image/')) { setError('Please upload an image file (JPG, PNG, WEBP).'); return }
    setFile(f); setError(''); setResult('')
    const r = new FileReader(); r.onload = e => setPreview(e.target?.result as string); r.readAsDataURL(f)
  }

  const getDims = () => {
    if (preset && preset !== 'custom') {
      const p = PRESETS.find(p => p.label === preset); return p ? { w: p.w, h: p.h } : null
    }
    const w = parseInt(cw), h = parseInt(ch)
    return (!w || !h || w < 1 || h < 1) ? null : { w, h }
  }

  const process = async () => {
    if (!file) { setError('Please upload an image first.'); return }
    const dims = getDims()
    if (!dims) { setError('Please select a preset or enter custom dimensions.'); return }
    setProcessing(true); setError('')

    const img = new Image(); img.src = preview
    await new Promise(r => { img.onload = r })

    // ✅ FIXED: Always use the target dimensions for canvas (not swapped by rotation)
    const canvas = document.createElement('canvas')
    canvas.width = dims.w
    canvas.height = dims.h
    const ctx = canvas.getContext('2d')!

    // ✅ FIXED: Fill background FIRST before any transform
    const useTransparent = bgMode === 'transparent' && format !== 'jpeg'
    if (!useTransparent) {
      const bgColor = bgMode === 'custom' ? customBg : bgPreset
      ctx.fillStyle = bgColor
      ctx.fillRect(0, 0, dims.w, dims.h)
    }

    // Calculate draw dimensions
    let drawW = dims.w, drawH = dims.h
    const srcW = img.width, srcH = img.height

    if (fit === 'contain') {
      const scale = Math.min(dims.w / srcW, dims.h / srcH)
      drawW = srcW * scale; drawH = srcH * scale
    } else if (fit === 'cover') {
      const scale = Math.max(dims.w / srcW, dims.h / srcH)
      drawW = srcW * scale; drawH = srcH * scale
    }

    // Draw image centered, with rotation applied
    ctx.save()
    ctx.translate(dims.w / 2, dims.h / 2)
    ctx.rotate((rotation * Math.PI) / 180)
    if (rotation === 90 || rotation === 270) {
      ctx.drawImage(img, -drawH / 2, -drawW / 2, drawH, drawW)
    } else {
      ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH)
    }
    ctx.restore()

    const toBlob = (q: number) => new Promise<Blob>(res => canvas.toBlob(b => res(b!), `image/${format}`, q / 100))

    let blob: Blob
    if (targetKb && Number(targetKb) > 0) {
      const target = Number(targetKb) * 1024
      let lo = 10, hi = 95, best: Blob | null = null
      for (let i = 0; i < 8; i++) {
        const mid = Math.floor((lo + hi) / 2)
        const b = await toBlob(mid)
        if (b.size <= target) { best = b; lo = mid + 1 } else hi = mid - 1
      }
      blob = best || await toBlob(10)
    } else {
      blob = await toBlob(quality)
    }

    setResult(URL.createObjectURL(blob))
    setResultSize(`${(blob.size / 1024).toFixed(1)} KB`)
    setResultDims(`${dims.w} × ${dims.h} px`)
    setProcessing(false)
  }

  const download = () => {
    const d = getDims()
    const n = file?.name.replace(/\.[^.]+$/, '') || 'image'
    const a = document.createElement('a'); a.href = result; a.download = `${n}-${d?.w}x${d?.h}.${format}`; a.click()
  }

  return (
    <main style={S.page}>
      <ToolsNavbar />

      <style>{`
        .tool-wrap { max-width: 1040px; margin: 0 auto; padding: 28px 16px; }
        .tool-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 300px), 1fr)); gap: 18px; }
        .tool-sidebar { position: sticky; top: 78px; }
        @media (max-width: 700px) {
          .tool-grid-sidebar { grid-template-columns: 1fr !important; }
          .tool-sidebar { position: static !important; }
          .tool-hide-mobile { display: none !important; }
        }
      `}</style>
      <ToolHeader
        title="Photo & Image Resizer"
        desc="Resize photos for ADRE, APSC, SLPRB, SSC, Railway, Bank exams. 25+ presets with compression, background color, rotation and crop. Free online photo resizer."
      />

      <div style={S.wrap}>
        {/* Upload + Size - row 1 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '20px' }}>

          {/* Upload */}
          <div style={S.card}>
            <h2 style={S.cardTitle}>1. Upload Image</h2>
            <div
              onClick={() => fileRef.current?.click()}
              onDrop={e => { e.preventDefault(); e.dataTransfer.files[0] && handleFile(e.dataTransfer.files[0]) }}
              onDragOver={e => e.preventDefault()}
              style={{ border: `2px dashed ${C.gray200}`, borderRadius: '12px', padding: '28px 16px', textAlign: 'center', cursor: 'pointer', background: C.gray50 }}
            >
              {preview ? (
                <div>
                  <img src={preview} alt="Preview" style={{ maxHeight: '130px', maxWidth: '100%', borderRadius: '8px', objectFit: 'contain', marginBottom: '8px' }} />
                  <p style={{ color: C.gray500, fontSize: '13px', margin: 0 }}>{file?.name} — Click to change</p>
                </div>
              ) : (
                <>
                  <div style={{ fontSize: '40px', marginBottom: '10px' }}>🖼️</div>
                  <p style={{ fontSize: '15px', fontWeight: 700, color: C.gray600, margin: '0 0 4px' }}>Click or drag & drop</p>
                  <p style={{ fontSize: '13px', color: C.gray400, margin: 0 }}>JPG, PNG, WEBP supported</p>
                </>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
          </div>

          {/* Size selection */}
          <div style={S.card}>
            <h2 style={S.cardTitle}>2. Select Size</h2>
            <label style={S.label}>Choose a Preset</label>
            <select style={S.select} value={preset} onChange={e => setPreset(e.target.value)}>
              <option value="">-- Select Preset --</option>
              <option value="custom">✏️ Custom Size</option>
              {GROUPS.map(g => (
                <optgroup key={g} label={g}>
                  {PRESETS.filter(p => p.group === g).map(p => (
                    <option key={p.label} value={p.label}>{p.label}</option>
                  ))}
                </optgroup>
              ))}
            </select>
            {(!preset || preset === 'custom') && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '14px' }}>
                <div>
                  <label style={S.label}>Width (px)</label>
                  <input style={S.input} value={cw} onChange={e => setCw(e.target.value)} placeholder="e.g. 450" type="number" min="1" />
                </div>
                <div>
                  <label style={S.label}>Height (px)</label>
                  <input style={S.input} value={ch} onChange={e => setCh(e.target.value)} placeholder="e.g. 600" type="number" min="1" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Advanced options */}
        <div style={{ ...S.card, marginBottom: '20px' }}>
          <h2 style={S.cardTitle}>3. Advanced Options</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '22px' }}>

            <div>
              <label style={S.label}>Fit Mode</label>
              <Seg opts={['contain', 'cover', 'stretch']} val={fit} set={setFit} />
              <p style={S.hint}>Contain: fit with padding · Cover: fill & crop · Stretch: force fill</p>
            </div>

            <div>
              <label style={S.label}>Rotation</label>
              <Seg opts={['0°', '90°', '180°', '270°']} val={`${rotation}°`} set={v => setRotation(parseInt(v))} />
            </div>

            <div>
              <label style={S.label}>Output Format</label>
              <Seg opts={['jpeg', 'png', 'webp']} val={format} set={setFormat} />
            </div>

            {/* ✅ FIXED: Background color — clear state separation */}
            <div>
              <label style={S.label}>Background Color</label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '10px' }}>
                {BG_PRESETS.map(b => (
                  <button
                    key={b.v}
                    onClick={() => { setBgMode('preset'); setBgPreset(b.v) }}
                    title={b.label}
                    style={{
                      width: '34px', height: '34px', borderRadius: '8px', cursor: 'pointer',
                      border: `3px solid ${bgMode === 'preset' && bgPreset === b.v ? C.teal : C.gray200}`,
                      background: b.v, flexShrink: 0,
                    }}
                  />
                ))}
                <button
                  onClick={() => setBgMode('transparent')}
                  title="Transparent"
                  style={{
                    width: '34px', height: '34px', borderRadius: '8px', cursor: 'pointer',
                    border: `3px solid ${bgMode === 'transparent' ? C.teal : C.gray200}`,
                    background: 'repeating-conic-gradient(#ccc 0% 25%, white 0% 50%) 0 0/10px 10px',
                    flexShrink: 0,
                  }}
                />
                <button
                  onClick={() => setBgMode('custom')}
                  style={{
                    padding: '6px 12px', borderRadius: '8px', fontSize: '13px', fontWeight: 700,
                    border: `3px solid ${bgMode === 'custom' ? C.teal : C.gray200}`,
                    background: bgMode === 'custom' ? '#e6faf8' : C.white,
                    color: bgMode === 'custom' ? C.teal2 : C.gray500, cursor: 'pointer', fontFamily: 'inherit',
                  }}
                >Custom</button>
              </div>
              {bgMode === 'custom' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input type="color" value={customBg} onChange={e => setCustomBg(e.target.value)}
                    style={{ width: '40px', height: '36px', borderRadius: '8px', border: `1px solid ${C.gray200}`, cursor: 'pointer', padding: '2px' }} />
                  <span style={{ fontSize: '14px', color: C.gray600, fontWeight: 600 }}>{customBg}</span>
                </div>
              )}
              {bgMode === 'transparent' && <p style={S.hint}>Transparent only works with PNG format</p>}
            </div>

            <div>
              <label style={S.label}>Quality: {quality}%</label>
              <input type="range" min="10" max="100" value={quality} onChange={e => setQuality(Number(e.target.value))}
                style={{ width: '100%', accentColor: C.teal, height: '6px' }} />
            </div>

            <div>
              <label style={S.label}>Target File Size (KB)</label>
              <input style={S.input} value={targetKb} onChange={e => setTargetKb(e.target.value)} placeholder="e.g. 50 (overrides quality)" type="number" min="1" />
              <p style={S.hint}>Auto-compresses to fit under this size</p>
            </div>
          </div>
        </div>

        {error && <div style={{ ...S.error, marginBottom: '16px' }}>⚠ {error}</div>}

        <button
          style={{ ...S.btnPrimary, fontSize: '17px', padding: '17px', marginBottom: '20px' }}
          onClick={process} disabled={processing}
        >
          {processing ? '⏳ Processing...' : '✅ Resize Image'}
        </button>

        {/* Result */}
        {result && (
          <div style={{ ...S.card, marginBottom: '24px' }}>
            <h2 style={S.cardTitle}>Result</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px,1fr))', gap: '20px', alignItems: 'center' }}>
              <div style={{ background: 'repeating-conic-gradient(#e0e0e0 0% 25%, white 0% 50%) 0 0/16px 16px', borderRadius: '12px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '140px', padding: '8px' }}>
                <img src={result} alt="Resized" style={{ maxWidth: '100%', maxHeight: '220px', objectFit: 'contain', display: 'block' }} />
              </div>
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
                  <div style={S.statCard}><p style={S.statVal}>{resultDims}</p><p style={S.statLabel}>Dimensions</p></div>
                  <div style={S.statCard}><p style={S.statVal}>{resultSize}</p><p style={S.statLabel}>File Size</p></div>
                </div>
                <button style={S.btnGold} onClick={download}>⬇ Download Image</button>
              </div>
            </div>
          </div>
        )}

        {/* Reference table */}
        <div style={S.card}>
          <h2 style={S.sectionTitle}>Government Exam Photo Size Reference — ADRE, APSC, SSC, Railway</h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr style={{ background: C.gray50 }}>
                  {['Exam / Organization', 'Photo Size', 'Signature Size', 'Max File Size'].map(h => (
                    <th key={h} style={{ padding: '11px 14px', textAlign: 'left', fontWeight: 700, color: C.gray700, borderBottom: `2px solid ${C.gray200}`, whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ['ADRE / Assam Direct Recruitment', '210×310 px', '210×110 px', '100 KB'],
                  ['APSC (Combined Competitive)', '413×531 px', '413×155 px', '150 KB'],
                  ['SLPRB (Assam Police)', '413×531 px', '472×236 px', '100 KB'],
                  ['DHS Assam', '210×310 px', '210×110 px', '100 KB'],
                  ['SSC (CGL/CHSL/MTS)', '100×120 px', '140×60 px', '50 KB'],
                  ['RRB Railway', '150×200 px', '100×50 px', '100 KB'],
                  ['IBPS / SBI Bank', '200×200 px', '140×60 px', '100 KB'],
                  ['UPSC Civil Services', '300×300 px', '300×100 px', '300 KB'],
                ].map((r, i) => (
                  <tr key={r[0]} style={{ background: i % 2 === 0 ? C.gray50 : C.white }}>
                    {r.map((c, j) => (
                      <td key={j} style={{ padding: '11px 14px', borderBottom: `1px solid ${C.gray100}`, color: j === 0 ? C.gray800 : C.gray600, fontWeight: j === 0 ? 600 : 400, whiteSpace: 'nowrap' }}>{c}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ fontSize: '12px', color: C.gray400, marginTop: '10px' }}>* Always check the official notification PDF for exact requirements before uploading.</p>
        </div>
      </div>
    </main>
  )
}
