'use client'

import { useState, useRef, useCallback } from 'react'
import Link from 'next/link'

interface Preset {
  label: string
  w: number
  h: number
  group: string
}

const PRESETS: Preset[] = [
  // Assam State
  { group: 'Assam State Exams', label: 'ADRE Photo (210×310)', w: 210, h: 310 },
  { group: 'Assam State Exams', label: 'ADRE Signature (210×110)', w: 210, h: 110 },
  { group: 'Assam State Exams', label: 'APSC Photo (413×531)', w: 413, h: 531 },
  { group: 'Assam State Exams', label: 'APSC Signature (413×155)', w: 413, h: 155 },
  { group: 'Assam State Exams', label: 'SLPRB Photo (413×531)', w: 413, h: 531 },
  { group: 'Assam State Exams', label: 'SLPRB Signature (472×236)', w: 472, h: 236 },
  { group: 'Assam State Exams', label: 'DHS Photo (210×310)', w: 210, h: 310 },
  { group: 'Assam State Exams', label: 'DHS Signature (210×110)', w: 210, h: 110 },
  { group: 'Assam State Exams', label: 'NHM Assam Photo (200×230)', w: 200, h: 230 },
  { group: 'Assam State Exams', label: 'APDCL Photo (150×200)', w: 150, h: 200 },
  // Central Exams
  { group: 'Central Govt Exams', label: 'SSC Photo (100×120 px)', w: 100, h: 120 },
  { group: 'Central Govt Exams', label: 'SSC Signature (140×60 px)', w: 140, h: 60 },
  { group: 'Central Govt Exams', label: 'RRB/Railway Photo (150×200)', w: 150, h: 200 },
  { group: 'Central Govt Exams', label: 'UPSC Photo (300×300)', w: 300, h: 300 },
  { group: 'Central Govt Exams', label: 'Bank (IBPS/SBI) Photo (200×200)', w: 200, h: 200 },
  { group: 'Central Govt Exams', label: 'Bank Signature (140×60)', w: 140, h: 60 },
  { group: 'Central Govt Exams', label: 'Defence/Army Photo (200×240)', w: 200, h: 240 },
  // General
  { group: 'General Sizes', label: 'Passport Size (450×600)', w: 450, h: 600 },
  { group: 'General Sizes', label: 'Stamp Size (250×300)', w: 250, h: 300 },
  { group: 'General Sizes', label: 'Aadhaar/ID Card (320×200)', w: 320, h: 200 },
  // Social Media
  { group: 'Social Media', label: 'Facebook Post (1200×630)', w: 1200, h: 630 },
  { group: 'Social Media', label: 'Instagram Post (1080×1080)', w: 1080, h: 1080 },
  { group: 'Social Media', label: 'Instagram Story (1080×1920)', w: 1080, h: 1920 },
  { group: 'Social Media', label: 'X / Twitter Post (1600×900)', w: 1600, h: 900 },
  { group: 'Social Media', label: 'WhatsApp DP (800×800)', w: 800, h: 800 },
  { group: 'Social Media', label: 'YouTube Thumbnail (1280×720)', w: 1280, h: 720 },
]

const BG_COLORS = [
  { label: 'White', value: '#ffffff' },
  { label: 'Blue', value: '#0000ff' },
  { label: 'Light Blue', value: '#add8e6' },
  { label: 'Red', value: '#ff0000' },
  { label: 'Transparent', value: 'transparent' },
]

const groups = [...new Set(PRESETS.map(p => p.group))]

export default function ImageResizerClient() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState('')
  const [selectedPreset, setSelectedPreset] = useState<string>('')
  const [customW, setCustomW] = useState('')
  const [customH, setCustomH] = useState('')
  const [bgColor, setBgColor] = useState('#ffffff')
  const [customBg, setCustomBg] = useState('#ffffff')
  const [format, setFormat] = useState<'jpeg' | 'png' | 'webp'>('jpeg')
  const [quality, setQuality] = useState(90)
  const [targetKb, setTargetKb] = useState('')
  const [rotation, setRotation] = useState(0)
  const [fitMode, setFitMode] = useState<'contain' | 'cover' | 'stretch'>('contain')
  const [result, setResult] = useState('')
  const [resultSize, setResultSize] = useState('')
  const [resultDims, setResultDims] = useState('')
  const [error, setError] = useState('')
  const [processing, setProcessing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = (f: File) => {
    if (!f.type.startsWith('image/')) { setError('Please upload an image file (JPG, PNG, WEBP).'); return }
    setFile(f)
    setError('')
    setResult('')
    const reader = new FileReader()
    reader.onload = e => setPreview(e.target?.result as string)
    reader.readAsDataURL(f)
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const f = e.dataTransfer.files[0]
    if (f) handleFile(f)
  }

  const getTargetDims = (): { w: number; h: number } | null => {
    if (selectedPreset && selectedPreset !== 'custom') {
      const p = PRESETS.find(p => p.label === selectedPreset)
      return p ? { w: p.w, h: p.h } : null
    }
    const w = parseInt(customW)
    const h = parseInt(customH)
    if (!w || !h || w < 1 || h < 1) return null
    return { w, h }
  }

  const drawResized = (img: HTMLImageElement, w: number, h: number, bg: string, rot: number, fm: typeof fitMode): HTMLCanvasElement => {
    const canvas = document.createElement('canvas')
    const rotated = rot === 90 || rot === 270
    canvas.width = rotated ? h : w
    canvas.height = rotated ? w : h
    const ctx = canvas.getContext('2d')!

    // Background
    if (bg !== 'transparent') {
      ctx.fillStyle = bg
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    ctx.save()
    ctx.translate(canvas.width / 2, canvas.height / 2)
    ctx.rotate((rot * Math.PI) / 180)

    const tw = rotated ? h : w
    const th = rotated ? w : h

    let sw = tw, sh = th, sx = -tw / 2, sy = -th / 2

    if (fm === 'contain') {
      const scale = Math.min(tw / img.width, th / img.height)
      sw = img.width * scale
      sh = img.height * scale
      sx = -sw / 2
      sy = -sh / 2
    } else if (fm === 'cover') {
      const scale = Math.max(tw / img.width, th / img.height)
      sw = img.width * scale
      sh = img.height * scale
      sx = -sw / 2
      sy = -sh / 2
    }

    ctx.drawImage(img, sx, sy, sw, sh)
    ctx.restore()
    return canvas
  }

  const canvasToBlob = (canvas: HTMLCanvasElement, fmt: string, q: number): Promise<Blob> =>
    new Promise(res => canvas.toBlob(b => res(b!), `image/${fmt}`, q / 100))

  const process = async () => {
    if (!file) { setError('Please upload an image first.'); return }
    const dims = getTargetDims()
    if (!dims) { setError('Please select a preset or enter custom width and height.'); return }
    setProcessing(true); setError('')

    const img = new Image()
    img.src = preview
    await new Promise(r => { img.onload = r })

    const bg = bgColor === 'custom' ? customBg : bgColor
    const canvas = drawResized(img, dims.w, dims.h, bg, rotation, fitMode)

    let blob: Blob
    if (targetKb && !isNaN(Number(targetKb)) && Number(targetKb) > 0) {
      const target = Number(targetKb) * 1024
      let lo = 1, hi = 100, best: Blob | null = null
      for (let i = 0; i < 10; i++) {
        const mid = Math.floor((lo + hi) / 2)
        const b = await canvasToBlob(canvas, format === 'png' ? 'png' : format, mid)
        if (b.size <= target) { best = b; lo = mid + 1 } else hi = mid - 1
      }
      blob = best || await canvasToBlob(canvas, format, 10)
    } else {
      blob = await canvasToBlob(canvas, format, quality)
    }

    const url = URL.createObjectURL(blob)
    setResult(url)
    setResultSize(`${(blob.size / 1024).toFixed(1)} KB`)
    setResultDims(`${dims.w} × ${dims.h} px`)
    setProcessing(false)
  }

  const download = () => {
    if (!result) return
    const dims = getTargetDims()
    const name = file?.name.replace(/\.[^.]+$/, '') || 'image'
    const a = document.createElement('a')
    a.href = result
    a.download = `${name}-${dims?.w}x${dims?.h}.${format}`
    a.click()
  }

  const inputClass = 'w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition bg-white'
  const labelClass = 'block text-sm font-semibold text-gray-700 mb-1.5'

  return (
    <main className="min-h-screen bg-gray-50">
      <div style={{ background: 'linear-gradient(135deg, #0b1f33 0%, #1a3a5c 100%)' }} className="py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <Link href="/tools" className="text-sm text-gray-400 hover:text-white mb-3 inline-block">← Back to Tools</Link>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Photo & Image Resizer</h1>
          <p className="text-gray-300 text-lg">Resize photos for ADRE, APSC, SLPRB, SSC, Railway, Bank exams and more. With compress, crop, rotate & background tools.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* LEFT: controls (3 cols) */}
          <div className="lg:col-span-3 space-y-6">

            {/* Upload */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-800 mb-4">1. Upload Image</h2>
              <div
                onDrop={onDrop}
                onDragOver={e => e.preventDefault()}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-teal-400 hover:bg-teal-50 transition-all"
              >
                {preview ? (
                  <div>
                    <img src={preview} alt="Preview" className="max-h-40 mx-auto rounded-lg object-contain mb-2" />
                    <p className="text-sm text-gray-500">{file?.name} — Click to change</p>
                  </div>
                ) : (
                  <>
                    <div className="text-5xl mb-3">🖼️</div>
                    <p className="text-base font-semibold text-gray-600">Click or drag & drop to upload</p>
                    <p className="text-sm text-gray-400 mt-1">Supports JPG, PNG, WEBP</p>
                  </>
                )}
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
            </div>

            {/* Size Selection */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-800 mb-4">2. Select Size</h2>
              <div>
                <label className={labelClass}>Choose a Preset</label>
                <select
                  className={inputClass}
                  value={selectedPreset}
                  onChange={e => setSelectedPreset(e.target.value)}
                >
                  <option value="">-- Select Preset --</option>
                  <option value="custom">✏️ Custom Size</option>
                  {groups.map(g => (
                    <optgroup key={g} label={g}>
                      {PRESETS.filter(p => p.group === g).map(p => (
                        <option key={p.label} value={p.label}>{p.label}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
              {(selectedPreset === 'custom' || !selectedPreset) && (
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className={labelClass}>Width (px)</label>
                    <input className={inputClass} value={customW} onChange={e => setCustomW(e.target.value)} placeholder="e.g. 450" type="number" min="1" />
                  </div>
                  <div>
                    <label className={labelClass}>Height (px)</label>
                    <input className={inputClass} value={customH} onChange={e => setCustomH(e.target.value)} placeholder="e.g. 600" type="number" min="1" />
                  </div>
                </div>
              )}
            </div>

            {/* Advanced Options */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-800 mb-4">3. Advanced Options</h2>
              <div className="space-y-5">

                {/* Fit Mode */}
                <div>
                  <label className={labelClass}>Fit Mode</label>
                  <div className="flex gap-2">
                    {(['contain', 'cover', 'stretch'] as const).map(m => (
                      <button key={m} onClick={() => setFitMode(m)} className={`flex-1 py-2.5 text-sm font-semibold rounded-xl border transition-all capitalize ${fitMode === m ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                        {m}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Contain: fit inside (with padding) · Cover: fill & crop · Stretch: force fit</p>
                </div>

                {/* Background Color */}
                <div>
                  <label className={labelClass}>Background Color</label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {BG_COLORS.map(c => (
                      <button
                        key={c.value}
                        onClick={() => setBgColor(c.value)}
                        title={c.label}
                        className={`w-9 h-9 rounded-lg border-2 transition-all ${bgColor === c.value ? 'border-teal-500 scale-110' : 'border-gray-200'}`}
                        style={{ background: c.value === 'transparent' ? 'repeating-conic-gradient(#ccc 0% 25%, white 0% 50%) 0 0/12px 12px' : c.value }}
                      />
                    ))}
                    <button
                      onClick={() => setBgColor('custom')}
                      className={`px-3 h-9 rounded-lg border-2 text-sm font-semibold transition-all ${bgColor === 'custom' ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-gray-200 text-gray-600'}`}
                    >
                      Custom
                    </button>
                  </div>
                  {bgColor === 'custom' && (
                    <div className="flex items-center gap-3">
                      <input type="color" value={customBg} onChange={e => setCustomBg(e.target.value)} className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer" />
                      <span className="text-sm text-gray-600">{customBg}</span>
                    </div>
                  )}
                </div>

                {/* Rotation */}
                <div>
                  <label className={labelClass}>Rotation</label>
                  <div className="flex gap-2">
                    {[0, 90, 180, 270].map(r => (
                      <button key={r} onClick={() => setRotation(r)} className={`flex-1 py-2.5 text-sm font-semibold rounded-xl border transition-all ${rotation === r ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                        {r}°
                      </button>
                    ))}
                  </div>
                </div>

                {/* Output Format */}
                <div>
                  <label className={labelClass}>Output Format</label>
                  <div className="flex gap-2">
                    {(['jpeg', 'png', 'webp'] as const).map(f => (
                      <button key={f} onClick={() => setFormat(f)} className={`flex-1 py-2.5 text-sm font-bold rounded-xl border uppercase transition-all ${format === f ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-gray-200 text-gray-500'}`}>
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quality OR Target Size */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Quality: {quality}%</label>
                    <input type="range" min="10" max="100" value={quality} onChange={e => setQuality(Number(e.target.value))} className="w-full accent-teal-500" />
                  </div>
                  <div>
                    <label className={labelClass}>Target Size (KB)</label>
                    <input className={inputClass} value={targetKb} onChange={e => setTargetKb(e.target.value)} placeholder="e.g. 50" type="number" min="1" />
                    <p className="text-xs text-gray-400 mt-1">Overrides quality if set</p>
                  </div>
                </div>
              </div>
            </div>

            {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">{error}</div>}

            <button
              onClick={process}
              disabled={processing}
              className="w-full py-4 rounded-xl font-bold text-base transition-all hover:opacity-90 disabled:opacity-50"
              style={{ background: '#1dbfad', color: '#fff' }}
            >
              {processing ? '⏳ Processing...' : '✅ Resize Image'}
            </button>
          </div>

          {/* RIGHT: result (2 cols) */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm sticky top-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Result Preview</h2>
              {!result ? (
                <div className="border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center h-64">
                  <div className="text-center">
                    <div className="text-5xl opacity-20 mb-3">🖼️</div>
                    <p className="text-gray-400 text-sm">Resized image will appear here</p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="border border-gray-100 rounded-xl overflow-hidden mb-4" style={{ background: 'repeating-conic-gradient(#f0f0f0 0% 25%, white 0% 50%) 0 0/16px 16px' }}>
                    <img src={result} alt="Resized" className="max-w-full max-h-64 mx-auto object-contain block" />
                  </div>
                  <div className="flex gap-4 mb-4 text-sm">
                    <div className="flex-1 bg-gray-50 rounded-xl p-3 text-center">
                      <p className="text-gray-400 text-xs mb-0.5">Dimensions</p>
                      <p className="font-bold text-gray-800">{resultDims}</p>
                    </div>
                    <div className="flex-1 bg-gray-50 rounded-xl p-3 text-center">
                      <p className="text-gray-400 text-xs mb-0.5">File Size</p>
                      <p className="font-bold text-gray-800">{resultSize}</p>
                    </div>
                  </div>
                  <button
                    onClick={download}
                    className="w-full py-3.5 rounded-xl font-bold text-base transition-all hover:opacity-90"
                    style={{ background: '#c9a227', color: '#fff' }}
                  >
                    ⬇ Download Image
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Presets reference table */}
        <div className="mt-10 bg-white rounded-2xl border border-gray-200 p-8">
          <h2 className="text-2xl font-bold mb-6" style={{ color: '#0b1f33' }}>Government Exam Photo Size Reference</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-bold text-gray-700">Exam / Organization</th>
                  <th className="text-left py-3 px-4 font-bold text-gray-700">Photo Size</th>
                  <th className="text-left py-3 px-4 font-bold text-gray-700">Signature Size</th>
                  <th className="text-left py-3 px-4 font-bold text-gray-700">Max File Size</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { exam: 'ADRE / Assam Direct Recruitment', photo: '210×310 px', sign: '210×110 px', size: '100 KB' },
                  { exam: 'APSC (Combined Competitive)', photo: '413×531 px', sign: '413×155 px', size: '150 KB' },
                  { exam: 'SLPRB (Assam Police)', photo: '413×531 px', sign: '472×236 px', size: '100 KB' },
                  { exam: 'DHS Assam', photo: '210×310 px', sign: '210×110 px', size: '100 KB' },
                  { exam: 'SSC (CGL/CHSL/MTS)', photo: '100×120 px', sign: '140×60 px', size: '50 KB' },
                  { exam: 'RRB Railway', photo: '150×200 px', sign: '100×50 px', size: '100 KB' },
                  { exam: 'IBPS / SBI Bank', photo: '200×200 px', sign: '140×60 px', size: '100 KB' },
                  { exam: 'UPSC Civil Services', photo: '300×300 px', sign: '300×100 px', size: '300 KB' },
                ].map((row, i) => (
                  <tr key={row.exam} className={i % 2 === 0 ? 'bg-gray-50' : ''}>
                    <td className="py-3 px-4 font-medium text-gray-800">{row.exam}</td>
                    <td className="py-3 px-4 text-gray-600">{row.photo}</td>
                    <td className="py-3 px-4 text-gray-600">{row.sign}</td>
                    <td className="py-3 px-4 text-gray-600">{row.size}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 mt-4">* Sizes may vary per notification. Always check the official notification PDF before uploading.</p>
        </div>
      </div>
    </main>
  )
}
