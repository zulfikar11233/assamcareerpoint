// src/app/tools/image-to-pdf/imagesToPdfClient
'use client'
import { useState, useRef } from 'react'
import { C, S, ToolsNavbar, ToolHeader, Toggle } from '../_shared'

interface ImgItem { id:string; file:File; dataUrl:string; rotation:number; name:string }

export default function ImagesToPdfClient() {
  const [images, setImages]       = useState<ImgItem[]>([])
  const [pageSize, setPageSize]   = useState<'A4'|'A3'|'Letter'>('A4')
  const [orient, setOrient]       = useState<'portrait'|'landscape'>('portrait')
  const [margin, setMargin]       = useState<'none'|'small'|'medium'>('small')
  const [quality, setQuality]     = useState<'low'|'medium'|'high'>('high')
  const [fitMode, setFitMode]     = useState<'fit'|'fill'|'actual'>('fit')
  const [pageNums, setPageNums]   = useState(false)
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress]   = useState(0)
  const [dragOver, setDragOver]   = useState(false)
  const [error, setError]         = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const addFiles = (files: FileList) => {
    Array.from(files).filter(f=>f.type.startsWith('image/')).forEach(f => {
      const r = new FileReader()
      r.onload = e => setImages(prev => [...prev, { id:crypto.randomUUID(), file:f, dataUrl:e.target?.result as string, rotation:0, name:f.name }])
      r.readAsDataURL(f)
    })
  }

  const rotate = (id:string) => setImages(prev => prev.map(i => i.id===id ? {...i, rotation:(i.rotation+90)%360} : i))
  const remove = (id:string) => setImages(prev => prev.filter(i=>i.id!==id))
  const moveUp   = (idx:number) => { if(idx===0) return; setImages(p=>{const a=[...p];[a[idx-1],a[idx]]=[a[idx],a[idx-1]];return a}) }
  const moveDown = (idx:number) => { if(idx===images.length-1) return; setImages(p=>{const a=[...p];[a[idx],a[idx+1]]=[a[idx+1],a[idx]];return a}) }

  const generate = async () => {
    if (images.length===0) { setError('Please add at least one image.'); return }
    setProcessing(true); setError(''); setProgress(0)
    try {
      const { jsPDF } = await import('jspdf')
      const dims:Record<string,[number,number]> = { A4:[210,297], A3:[297,420], Letter:[215.9,279.4] }
      const [pw,ph] = orient==='portrait' ? dims[pageSize] : [dims[pageSize][1],dims[pageSize][0]] as [number,number]
      const m = { none:0, small:5, medium:10 }[margin]
      const q = { low:0.4, medium:0.7, high:0.95 }[quality]
      const pdf = new jsPDF({ unit:'mm', format:pageSize.toLowerCase() as any, orientation:orient })

      for (let i=0; i<images.length; i++) {
        if(i>0) pdf.addPage()
        setProgress(Math.round(((i+1)/images.length)*90))
        const img = new Image(); img.src = images[i].dataUrl
        await new Promise(r => { img.onload=r })
        const canvas = document.createElement('canvas')
        const rot = images[i].rotation; const rotated = rot===90||rot===270
        canvas.width = rotated ? img.height : img.width; canvas.height = rotated ? img.width : img.height
        const ctx = canvas.getContext('2d')!
        ctx.translate(canvas.width/2, canvas.height/2); ctx.rotate(rot*Math.PI/180); ctx.drawImage(img,-img.width/2,-img.height/2)
        const imgData = canvas.toDataURL('image/jpeg', q)
        const avW=pw-2*m, avH=ph-2*m-(pageNums?8:0)
        let iw=canvas.width, ih=canvas.height
        if(fitMode==='fit'){const sc=Math.min(avW/iw,avH/ih);iw*=sc;ih*=sc}
        else if(fitMode==='fill'){const sc=Math.max(avW/iw,avH/ih);iw*=sc;ih*=sc}
        else{const sc=Math.min(1,avW/iw,avH/ih);iw*=sc;ih*=sc}
        pdf.addImage(imgData,'JPEG',m+(avW-iw)/2, m+(avH-ih)/2, iw, ih)
        if(pageNums){pdf.setFontSize(9);pdf.setTextColor(130);pdf.text(`${i+1}/${images.length}`,pw/2,ph-3,{align:'center'})}
      }
      setProgress(95); pdf.save('converted-images.pdf'); setProgress(100)
    } catch { setError('PDF generation failed. Please try again.') }
    setProcessing(false); setTimeout(()=>setProgress(0),2000)
  }

  const seg = (opts:string[], val:string, set:(v:any)=>void) => (
    <div style={{ display:'flex', gap:'8px', flexWrap:'wrap' }}>
      {opts.map(o=>(
        <button key={o} onClick={()=>set(o)} style={{
          padding:'10px 18px', borderRadius:'10px', fontSize:'14px', fontWeight:700, fontFamily:'inherit',
          border:`2px solid ${val===o ? C.teal : C.gray200}`,
          background: val===o ? '#e6faf8' : C.white, color: val===o ? C.teal2 : C.gray500, cursor:'pointer',
        }}>{o}</button>
      ))}
    </div>
  )

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
      <ToolHeader title="Images to PDF Converter"
        desc="Convert multiple photos and scanned certificates into a single PDF. Supports compression, reordering, rotation, A4/Letter size and page numbers." />

      <div style={S.wrap}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(min(100%, 300px), 1fr))', gap:'24px' }}>

          {/* Settings */}
          <div style={{ ...S.card, position:'sticky', top:'20px', alignSelf:'start' }}>
            <h2 style={S.cardTitle}>PDF Settings</h2>
            <div style={{ display:'flex', flexDirection:'column', gap:'20px' }}>

              <div><label style={S.label}>Page Size</label>{seg(['A4','A3','Letter'],pageSize,setPageSize)}</div>
              <div><label style={S.label}>Orientation</label>{seg(['portrait','landscape'],orient,setOrient)}</div>
              <div><label style={S.label}>Image Fit</label>{seg(['fit','fill','actual'],fitMode,setFitMode)}
                <p style={S.hint}>Fit: preserve ratio · Fill: cover page · Actual: original size</p>
              </div>
              <div><label style={S.label}>Margin</label>{seg(['none','small','medium'],margin,setMargin)}</div>
              <div><label style={S.label}>Quality</label>{seg(['low','medium','high'],quality,setQuality)}
                <p style={S.hint}>Lower quality = smaller PDF file size</p>
              </div>

              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px', background:C.gray50, borderRadius:'12px', border:`1px solid ${C.gray200}` }}>
                <div>
                  <p style={{ margin:'0 0 2px', fontSize:'15px', fontWeight:700, color:C.gray700 }}>Page Numbers</p>
                  <p style={{ margin:0, fontSize:'13px', color:C.gray400 }}>Show number at bottom of each page</p>
                </div>
                <Toggle on={pageNums} onChange={setPageNums} />
              </div>

              {error && <div style={S.error}>{error}</div>}

              <button style={{ ...S.btnPrimary, fontSize:'17px', padding:'18px' }} onClick={generate} disabled={processing||images.length===0}>
                {processing ? `⏳ Creating PDF... ${progress}%` : `📄 Create PDF (${images.length} image${images.length!==1?'s':''})`}
              </button>

              {processing && (
                <div style={{ background:C.gray200, borderRadius:'99px', height:'8px', overflow:'hidden' }}>
                  <div style={{ height:'100%', background:C.teal, width:`${progress}%`, transition:'width 0.3s', borderRadius:'99px' }} />
                </div>
              )}
            </div>
          </div>

          {/* Images */}
          <div>
            {/* Upload zone */}
            <div
              onClick={()=>fileRef.current?.click()}
              onDrop={e=>{e.preventDefault();setDragOver(false);addFiles(e.dataTransfer.files)}}
              onDragOver={e=>{e.preventDefault();setDragOver(true)}}
              onDragLeave={()=>setDragOver(false)}
              style={{
                border:`2px dashed ${dragOver ? C.teal : C.gray200}`, borderRadius:'16px', padding:'40px 20px',
                textAlign:'center', cursor:'pointer', background: dragOver ? '#e6faf8' : C.gray50,
                marginBottom:'20px', transition:'all 0.2s', minHeight:'160px',
              }}
            >
              <div style={{ fontSize:'48px', marginBottom:'12px' }}>📸</div>
              <p style={{ fontSize:'17px', fontWeight:700, color:C.gray600, margin:'0 0 6px' }}>Click or drag & drop images here</p>
              <p style={{ fontSize:'14px', color:C.gray400, margin:0 }}>Supports JPG, PNG, WEBP · Multiple files allowed</p>
            </div>
            <input ref={fileRef} type="file" accept="image/*" multiple style={{ display:'none' }} onChange={e=>e.target.files && addFiles(e.target.files)} />

            {images.length>0 && (
              <div>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'16px' }}>
                  <p style={{ margin:0, fontSize:'17px', fontWeight:700, color:C.navy }}>{images.length} Image{images.length!==1?'s':''} Added</p>
                  <button onClick={()=>setImages([])} style={{ background:'none', border:'none', color:'#ef4444', fontSize:'14px', fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}>Clear All</button>
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
                  {images.map((img,idx)=>(
                    <div key={img.id} style={{ ...S.card, padding:'14px', display:'flex', alignItems:'center', gap:'14px' }}>
                      <div style={{ width:'56px', height:'56px', borderRadius:'10px', overflow:'hidden', background:C.gray100, flexShrink:0 }}>
                        <img src={img.dataUrl} alt={img.name} style={{ width:'100%', height:'100%', objectFit:'cover', transform:`rotate(${img.rotation}deg)`, transition:'transform 0.3s' }} />
                      </div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <p style={{ margin:'0 0 3px', fontSize:'15px', fontWeight:600, color:C.gray700, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{img.name}</p>
                        <p style={{ margin:0, fontSize:'13px', color:C.gray400 }}>Page {idx+1} · {(img.file.size/1024).toFixed(0)} KB</p>
                      </div>
                      <div style={{ display:'flex', gap:'4px', flexShrink:0 }}>
                        {[
                          { icon:'↑', action:()=>moveUp(idx),   disabled:idx===0 },
                          { icon:'↓', action:()=>moveDown(idx), disabled:idx===images.length-1 },
                          { icon:'↻', action:()=>rotate(img.id),disabled:false },
                        ].map(b=>(
                          <button key={b.icon} onClick={b.action} disabled={b.disabled} style={{
                            width:'34px', height:'34px', borderRadius:'8px', border:`1px solid ${C.gray200}`,
                            background:C.white, color:C.gray500, fontSize:'16px', cursor:'pointer',
                            opacity: b.disabled ? 0.3 : 1, fontFamily:'inherit',
                          }}>{b.icon}</button>
                        ))}
                        <button onClick={()=>remove(img.id)} style={{ width:'34px', height:'34px', borderRadius:'8px', border:`1px solid #fca5a5`, background:'#fef2f2', color:'#ef4444', fontSize:'16px', cursor:'pointer', fontFamily:'inherit' }}>✕</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div style={{ ...S.card, marginTop:'32px' }}>
          <h2 style={S.sectionTitle}>Why Use This Images to PDF Tool?</h2>
          <div style={S.grid2}>
            <div>
              <h3 style={{ fontSize:'17px', fontWeight:700, color:C.navy, marginBottom:'10px' }}>Perfect for Government Job Applications</h3>
              <p style={{ fontSize:'15px', color:C.gray600, lineHeight:1.7, margin:0 }}>Most government portals (ADRE, APSC, SLPRB, SSC, IBPS) require documents uploaded as PDF. Combine your mark sheets, certificates, ID proof and photo into one organized PDF — exactly what exam portals ask for.</p>
            </div>
            <div>
              <h3 style={{ fontSize:'17px', fontWeight:700, color:C.navy, marginBottom:'10px' }}>Key Features</h3>
              <ul style={{ paddingLeft:'20px', lineHeight:2, color:C.gray600, fontSize:'15px', margin:0 }}>
                <li>Add multiple images and reorder with ↑ ↓ buttons</li>
                <li>Rotate individual pages by 90° increments</li>
                <li>Low/Medium/High quality to control PDF size</li>
                <li>A4, A3 or Letter page size options</li>
                <li>Portrait and Landscape orientation</li>
                <li>All processing in your browser — 100% private</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
