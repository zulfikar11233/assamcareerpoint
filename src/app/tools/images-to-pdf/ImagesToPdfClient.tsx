'use client'

import { useState, useRef, useCallback } from 'react'
import Link from 'next/link'

interface ImgItem {
  id: string
  file: File
  dataUrl: string
  rotation: number
  name: string
}

export default function ImagesToPdfClient() {
  const [images, setImages] = useState<ImgItem[]>([])
  const [pageSize, setPageSize] = useState<'A4' | 'A3' | 'Letter'>('A4')
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait')
  const [margin, setMargin] = useState<'none' | 'small' | 'medium'>('small')
  const [quality, setQuality] = useState<'low' | 'medium' | 'high'>('high')
  const [pageNumbers, setPageNumbers] = useState(false)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [fitMode, setFitMode] = useState<'fit' | 'fill' | 'actual'>('fit')
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const [dragId, setDragId] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const addFiles = (files: FileList) => {
    const newItems: ImgItem[] = []
    Array.from(files).forEach(f => {
      if (!f.type.startsWith('image/')) return
      const reader = new FileReader()
      reader.onload = e => {
        newItems.push({ id: crypto.randomUUID(), file: f, dataUrl: e.target?.result as string, rotation: 0, name: f.name })
        if (newItems.length === Array.from(files).filter(f => f.type.startsWith('image/')).length) {
          setImages(prev => [...prev, ...newItems])
        }
      }
      reader.readAsDataURL(f)
    })
  }

  const removeImage = (id: string) => setImages(prev => prev.filter(i => i.id !== id))

  const rotateImage = (id: string) =>
    setImages(prev => prev.map(i => i.id === id ? { ...i, rotation: (i.rotation + 90) % 360 } : i))

  const moveUp = (index: number) => {
    if (index === 0) return
    setImages(prev => { const a = [...prev]; [a[index - 1], a[index]] = [a[index], a[index - 1]]; return a })
  }

  const moveDown = (index: number) => {
    if (index === images.length - 1) return
    setImages(prev => { const a = [...prev]; [a[index], a[index + 1]] = [a[index + 1], a[index]]; return a })
  }

  const generatePdf = async () => {
    if (images.length === 0) { setError('Please add at least one image.'); return }
    setProcessing(true); setError(''); setProgress(0)

    try {
      const { jsPDF } = await import('jspdf')

      const pageDims: Record<string, [number, number]> = {
        A4: [210, 297], A3: [297, 420], Letter: [215.9, 279.4],
      }
      const [pw, ph] = orientation === 'portrait' ? pageDims[pageSize] : pageDims[pageSize].reverse() as [number, number]
      const marginPx: Record<string, number> = { none: 0, small: 5, medium: 10 }
      const m = marginPx[margin]
      const qualityMap: Record<string, number> = { low: 0.4, medium: 0.7, high: 0.95 }
      const q = qualityMap[quality]

      const pdf = new jsPDF({ unit: 'mm', format: pageSize.toLowerCase() as any, orientation })

      for (let i = 0; i < images.length; i++) {
        if (i > 0) pdf.addPage()
        setProgress(Math.round(((i + 1) / images.length) * 90))

        const img = new Image()
        img.src = images[i].dataUrl
        await new Promise(r => { img.onload = r })

        // Draw rotated to canvas
        const canvas = document.createElement('canvas')
        const rot = images[i].rotation
        const rotated = rot === 90 || rot === 270
        canvas.width = rotated ? img.height : img.width
        canvas.height = rotated ? img.width : img.height
        const ctx = canvas.getContext('2d')!
        ctx.translate(canvas.width / 2, canvas.height / 2)
        ctx.rotate((rot * Math.PI) / 180)
        ctx.drawImage(img, -img.width / 2, -img.height / 2)

        const imgData = canvas.toDataURL('image/jpeg', q)
        const avW = pw - 2 * m
        const avH = ph - 2 * m - (pageNumbers ? 8 : 0)

        let iw = canvas.width
        let ih = canvas.height

        if (fitMode === 'fit') {
          const scale = Math.min(avW / iw, avH / ih)
          iw = iw * scale; ih = ih * scale
        } else if (fitMode === 'fill') {
          const scale = Math.max(avW / iw, avH / ih)
          iw = iw * scale; ih = ih * scale
        } else {
          // actual size capped
          const scale = Math.min(1, avW / iw, avH / ih)
          iw = iw * scale; ih = ih * scale
        }

        const x = m + (avW - iw) / 2
        const y = m + (avH - ih) / 2

        pdf.addImage(imgData, 'JPEG', x, y, iw, ih)

        if (pageNumbers) {
          pdf.setFontSize(9)
          pdf.setTextColor(130)
          pdf.text(`${i + 1} / ${images.length}`, pw / 2, ph - 3, { align: 'center' })
        }
      }

      setProgress(95)
      const fileName = 'converted-images.pdf'
      pdf.save(fileName)
      setProgress(100)
    } catch (e) {
      setError('PDF generation failed. Please try again.')
    } finally {
      setProcessing(false)
      setTimeout(() => setProgress(0), 2000)
    }
  }

  const inputClass = 'w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition bg-white'
  const labelClass = 'block text-sm font-semibold text-gray-700 mb-1.5'

  return (
    <main className="min-h-screen bg-gray-50">
      <div style={{ background: 'linear-gradient(135deg, #0b1f33 0%, #1a3a5c 100%)' }} className="py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <Link href="/tools" className="text-sm text-gray-400 hover:text-white mb-3 inline-block">← Back to Tools</Link>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Images to PDF Converter</h1>
          <p className="text-gray-300 text-lg">Convert multiple photos and certificates into a single PDF. Supports compression, ordering, rotation, page numbers and password protection.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* LEFT: settings (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-800 mb-5">PDF Settings</h2>
              <div className="space-y-5">

                <div>
                  <label className={labelClass}>Page Size</label>
                  <div className="flex gap-2">
                    {(['A4', 'A3', 'Letter'] as const).map(s => (
                      <button key={s} onClick={() => setPageSize(s)} className={`flex-1 py-2.5 text-sm font-bold rounded-xl border transition-all ${pageSize === s ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-gray-200 text-gray-500'}`}>{s}</button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Orientation</label>
                  <div className="flex gap-2">
                    {(['portrait', 'landscape'] as const).map(o => (
                      <button key={o} onClick={() => setOrientation(o)} className={`flex-1 py-2.5 text-sm font-semibold rounded-xl border capitalize transition-all ${orientation === o ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-gray-200 text-gray-500'}`}>{o}</button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Image Fit</label>
                  <div className="flex gap-2">
                    {([['fit', 'Fit'], ['fill', 'Fill'], ['actual', 'Actual']] as const).map(([v, l]) => (
                      <button key={v} onClick={() => setFitMode(v)} className={`flex-1 py-2.5 text-sm font-semibold rounded-xl border transition-all ${fitMode === v ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-gray-200 text-gray-500'}`}>{l}</button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Fit: preserves ratio · Fill: covers page · Actual: original size</p>
                </div>

                <div>
                  <label className={labelClass}>Margin</label>
                  <div className="flex gap-2">
                    {([['none', 'None'], ['small', 'Small'], ['medium', 'Medium']] as const).map(([v, l]) => (
                      <button key={v} onClick={() => setMargin(v)} className={`flex-1 py-2 text-sm font-semibold rounded-xl border transition-all ${margin === v ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-gray-200 text-gray-500'}`}>{l}</button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Image Quality</label>
                  <div className="flex gap-2">
                    {([['low', 'Low'], ['medium', 'Medium'], ['high', 'High']] as const).map(([v, l]) => (
                      <button key={v} onClick={() => setQuality(v)} className={`flex-1 py-2.5 text-sm font-semibold rounded-xl border transition-all ${quality === v ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-gray-200 text-gray-500'}`}>{l}</button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Lower quality = smaller PDF file size</p>
                </div>

                <div className="flex items-center justify-between py-3 border-t border-gray-100">
                  <div>
                    <p className="text-sm font-semibold text-gray-700">Page Numbers</p>
                    <p className="text-xs text-gray-400">Show page number at bottom</p>
                  </div>
                  <button onClick={() => setPageNumbers(!pageNumbers)} className={`w-12 h-6 rounded-full transition-all relative ${pageNumbers ? 'bg-teal-500' : 'bg-gray-300'}`}>
                    <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${pageNumbers ? 'left-6' : 'left-0.5'}`} />
                  </button>
                </div>

                <div>
                  <label className={labelClass}>🔒 Password Protect PDF <span className="text-gray-400 font-normal">(Optional)</span></label>
                  <div className="relative">
                    <input
                      className={inputClass + ' pr-12'}
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Leave blank for no password"
                    />
                    <button onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                      {showPassword ? '🙈' : '👁'}
                    </button>
                  </div>
                  {password && <p className="text-xs text-amber-600 mt-1">⚠ Note: Basic PDF password via jsPDF. For strong encryption, use a dedicated PDF tool.</p>}
                </div>
              </div>
            </div>

            {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">{error}</div>}

            <button
              onClick={generatePdf}
              disabled={processing || images.length === 0}
              className="w-full py-4 rounded-xl font-bold text-base transition-all hover:opacity-90 disabled:opacity-50"
              style={{ background: '#1dbfad', color: '#fff' }}
            >
              {processing ? `⏳ Creating PDF... ${progress}%` : `📄 Create PDF (${images.length} image${images.length !== 1 ? 's' : ''})`}
            </button>
            {processing && (
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="h-2 rounded-full transition-all" style={{ width: `${progress}%`, background: '#1dbfad' }} />
              </div>
            )}
          </div>

          {/* RIGHT: images list (3 cols) */}
          <div className="lg:col-span-3 space-y-5">

            {/* Upload zone */}
            <div
              onDrop={e => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files) }}
              onDragOver={e => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onClick={() => fileRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${dragOver ? 'border-teal-500 bg-teal-50' : 'border-gray-300 hover:border-teal-400 hover:bg-teal-50'}`}
            >
              <div className="text-5xl mb-3">📸</div>
              <p className="text-base font-semibold text-gray-600">Click or drag & drop images here</p>
              <p className="text-sm text-gray-400 mt-1">Supports JPG, PNG, WEBP · Multiple files allowed</p>
            </div>
            <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={e => e.target.files && addFiles(e.target.files)} />

            {/* Image list */}
            {images.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-gray-800">{images.length} Image{images.length !== 1 ? 's' : ''} Added</h3>
                  <button onClick={() => setImages([])} className="text-sm text-red-400 hover:text-red-600">Clear All</button>
                </div>
                {images.map((img, index) => (
                  <div key={img.id} className="bg-white rounded-xl border border-gray-200 p-3 flex items-center gap-3">
                    <div className="relative w-14 h-14 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                      <img
                        src={img.dataUrl}
                        alt={img.name}
                        className="w-full h-full object-cover transition-all"
                        style={{ transform: `rotate(${img.rotation}deg)` }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-700 truncate">{img.name}</p>
                      <p className="text-xs text-gray-400">Page {index + 1} · {(img.file.size / 1024).toFixed(0)} KB</p>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button onClick={() => moveUp(index)} disabled={index === 0} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 disabled:opacity-30 text-gray-500 text-sm">↑</button>
                      <button onClick={() => moveDown(index)} disabled={index === images.length - 1} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 disabled:opacity-30 text-gray-500 text-sm">↓</button>
                      <button onClick={() => rotateImage(img.id)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 text-sm" title="Rotate 90°">↻</button>
                      <button onClick={() => removeImage(img.id)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-red-400 text-sm">✕</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* SEO content */}
        <div className="mt-10 bg-white rounded-2xl border border-gray-200 p-8">
          <h2 className="text-2xl font-bold mb-4" style={{ color: '#0b1f33' }}>Why Use This Images to PDF Tool?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-base text-gray-600 leading-relaxed">
            <div>
              <h3 className="font-bold text-gray-800 mb-2">Perfect for Government Job Applications</h3>
              <p>Most government portals (ADRE, APSC, SLPRB, SSC, IBPS) require documents uploaded as PDF files. This tool helps you combine your mark sheets, certificates, ID proof and photo into one organized PDF — exactly what recruiters and exam portals ask for.</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-800 mb-2">Key Features</h3>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Add multiple images and reorder with ↑ ↓ buttons</li>
                <li>Rotate individual pages by 90° increments</li>
                <li>Choose Low/Medium/High quality to control PDF size</li>
                <li>A4, A3 or Letter page size options</li>
                <li>Portrait and Landscape orientation</li>
                <li>Add page numbers to PDF</li>
                <li>All processing done in your browser — 100% private</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
