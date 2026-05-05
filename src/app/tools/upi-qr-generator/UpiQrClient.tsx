'use client'
import { useState } from 'react'
import { C, S, ToolsNavbar, ToolHeader, ModeTab, Divider } from '../_shared'

type Mode = 'upi' | 'bank' | 'mobile'

const UPI_APPS = [
  { name: 'GPay', emoji: '🟢' }, { name: 'PhonePe', emoji: '🟣' },
  { name: 'Paytm', emoji: '🔵' }, { name: 'BHIM', emoji: '🟠' },
  { name: 'Amazon Pay', emoji: '🟡' }, { name: 'WhatsApp Pay', emoji: '🟤' },
]

// ── Canvas helper: draw rounded rect ─────────────────────────────────────────
function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.arcTo(x + w, y, x + w, y + r, r)
  ctx.lineTo(x + w, y + h - r)
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r)
  ctx.lineTo(x + r, y + h)
  ctx.arcTo(x, y + h, x, y + h - r, r)
  ctx.lineTo(x, y + r)
  ctx.arcTo(x, y, x + r, y, r)
  ctx.closePath()
}

// ── Canvas helper: wrap text ──────────────────────────────────────────────────
function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxW: number, lineH: number): number {
  const words = text.split(' ')
  let line = ''
  let cy = y
  for (const word of words) {
    const test = line ? line + ' ' + word : word
    if (ctx.measureText(test).width > maxW && line) {
      ctx.fillText(line, x, cy)
      line = word
      cy += lineH
    } else { line = test }
  }
  if (line) ctx.fillText(line, x, cy)
  return cy
}

export default function UpiQrClient() {
  const [mode, setMode]           = useState<Mode>('upi')
  const [upiId, setUpiId]         = useState('')
  const [payeeName, setPayeeName] = useState('')
  const [amount, setAmount]       = useState('')
  const [note, setNote]           = useState('')
  const [bankAcc, setBankAcc]     = useState('')
  const [ifsc, setIfsc]           = useState('')
  const [mobile, setMobile]       = useState('')
  const [qrDataUrl, setQrDataUrl] = useState('')
  const [error, setError]         = useState('')
  const [copied, setCopied]       = useState(false)
  const [loading, setLoading]     = useState(false)
  const [downloading, setDownloading] = useState(false)

  const validate = () => {
    if (!payeeName.trim()) return 'Please enter Payee Name.'
    if (mode === 'upi' && !upiId.trim()) return 'Please enter your UPI ID.'
    if (mode === 'upi' && !upiId.includes('@')) return 'UPI ID must contain @ (e.g. name@okaxis).'
    if (mode === 'bank' && !bankAcc.trim()) return 'Please enter your Account Number.'
    if (mode === 'bank' && !ifsc.trim()) return 'Please enter your IFSC Code.'
    if (mode === 'bank' && ifsc.trim().length < 11) return 'IFSC Code must be 11 characters (e.g. SBIN0004569).'
    if (mode === 'mobile' && mobile.length !== 10) return 'Enter a valid 10-digit mobile number.'
    if (amount && isNaN(Number(amount))) return 'Amount must be a number.'
    return ''
  }

  const buildUpiString = () => {
    let pa = ''
    if (mode === 'upi') pa = upiId.trim()
    else if (mode === 'bank') pa = `${bankAcc.trim()}@${ifsc.trim().toUpperCase()}.ifsc.npci`
    else if (mode === 'mobile') pa = `${mobile.trim()}@upi`

    let s = `upi://pay?pa=${encodeURIComponent(pa)}&pn=${encodeURIComponent(payeeName.trim())}&cu=INR`
    if (amount.trim()) s += `&am=${encodeURIComponent(amount.trim())}`
    if (note.trim())   s += `&tn=${encodeURIComponent(note.trim())}`
    return s
  }

  const generate = async () => {
    const err = validate()
    if (err) { setError(err); return }
    setError(''); setLoading(true)
    try {
      const QRCode = (await import('qrcode')).default
      const url = await QRCode.toDataURL(buildUpiString(), {
        width: 500, margin: 2,
        color: { dark: '#000000', light: '#ffffff' },
        errorCorrectionLevel: 'H',
      })
      setQrDataUrl(url)
    } catch { setError('Failed to generate QR. Please try again.') }
    setLoading(false)
  }

  // ── ✅ NEW: Download full portrait card using Canvas ──────────────────────
  const downloadCard = async () => {
    if (!qrDataUrl) return
    setDownloading(true)
    try {
      const canvas = document.createElement('canvas')
      const W = 600
      const H = 960
      canvas.width  = W
      canvas.height = H
      const ctx = canvas.getContext('2d')!

      // ── Background gradient ──
      const bgGrad = ctx.createLinearGradient(0, 0, W, H)
      bgGrad.addColorStop(0, '#0b1f33')
      bgGrad.addColorStop(0.5, '#0d2a44')
      bgGrad.addColorStop(1, '#071828')
      ctx.fillStyle = bgGrad
      ctx.fillRect(0, 0, W, H)

      // ── Subtle dot pattern ──
      ctx.fillStyle = 'rgba(201,162,39,0.04)'
      for (let y = 20; y < H; y += 24) {
        for (let x = 20; x < W; x += 24) {
          ctx.beginPath(); ctx.arc(x, y, 1.2, 0, Math.PI * 2); ctx.fill()
        }
      }

      // ── Outer gold border ──
      ctx.strokeStyle = '#c9a227'
      ctx.lineWidth = 5
      roundRect(ctx, 14, 14, W - 28, H - 28, 22)
      ctx.stroke()

      // ── Inner teal thin border ──
      ctx.strokeStyle = 'rgba(29,191,173,0.35)'
      ctx.lineWidth = 1.5
      roundRect(ctx, 25, 25, W - 50, H - 50, 16)
      ctx.stroke()

      // ── Corner gold diamonds ──
      const corners = [[40,40],[W-40,40],[40,H-40],[W-40,H-40]]
      ctx.fillStyle = '#c9a227'
      for (const [cx, cy] of corners) {
        ctx.save(); ctx.translate(cx, cy); ctx.rotate(Math.PI / 4)
        ctx.fillRect(-6, -6, 12, 12)
        ctx.restore()
      }

      // ── Header bar ──
      const headerGrad = ctx.createLinearGradient(0, 50, W, 50)
      headerGrad.addColorStop(0, 'rgba(201,162,39,0.15)')
      headerGrad.addColorStop(0.5, 'rgba(201,162,39,0.08)')
      headerGrad.addColorStop(1, 'rgba(201,162,39,0.15)')
      ctx.fillStyle = headerGrad
      roundRect(ctx, 40, 46, W - 80, 70, 12)
      ctx.fill()

      ctx.strokeStyle = 'rgba(201,162,39,0.3)'
      ctx.lineWidth = 1
      roundRect(ctx, 40, 46, W - 80, 70, 12)
      ctx.stroke()

      // ── "SCAN & PAY" header ──
      ctx.fillStyle = '#c9a227'
      ctx.font = 'bold 26px "Arial Black", Arial'
      ctx.textAlign = 'center'
      ctx.fillText('📲  SCAN & PAY', W / 2, 91)

      // ── "UPI Payment QR Code" subtext ──
      ctx.fillStyle = 'rgba(29,191,173,0.9)'
      ctx.font = '15px Arial'
      ctx.fillText('UPI Payment — Works with all Indian apps', W / 2, 132)

      // ── Teal line under header ──
      ctx.strokeStyle = 'rgba(29,191,173,0.4)'
      ctx.lineWidth = 1
      ctx.beginPath(); ctx.moveTo(80, 148); ctx.lineTo(W - 80, 148); ctx.stroke()

      // ── QR code white card ──
      const QR_SIZE = 300
      const qrX = (W - QR_SIZE) / 2
      const qrY = 164

      // White shadow glow
      ctx.shadowColor = 'rgba(201,162,39,0.4)'
      ctx.shadowBlur = 30
      ctx.fillStyle = '#ffffff'
      roundRect(ctx, qrX - 20, qrY - 20, QR_SIZE + 40, QR_SIZE + 40, 18)
      ctx.fill()
      ctx.shadowBlur = 0

      // Gold border around QR card
      ctx.strokeStyle = '#c9a227'
      ctx.lineWidth = 3
      roundRect(ctx, qrX - 20, qrY - 20, QR_SIZE + 40, QR_SIZE + 40, 18)
      ctx.stroke()

      // Draw QR image
      const qrImg = new Image()
      qrImg.src = qrDataUrl
      await new Promise<void>(res => { qrImg.onload = () => res() })
      ctx.drawImage(qrImg, qrX, qrY, QR_SIZE, QR_SIZE)

      // ── UPI logo area inside QR card ──
      ctx.fillStyle = '#0b1f33'
      roundRect(ctx, qrX - 20, qrY + QR_SIZE + 10, QR_SIZE + 40, 30, '0 0 18px 18px' as any)
      ctx.fillStyle = '#0b1f33'
      roundRect(ctx, qrX - 18, qrY + QR_SIZE + 10, QR_SIZE + 36, 28, 0)
      ctx.fill()
      ctx.fillStyle = '#1dbfad'
      ctx.font = 'bold 13px Arial'
      ctx.textAlign = 'center'
      ctx.fillText('BHIM UPI', W / 2, qrY + QR_SIZE + 28)

      // ── Name section ──
      const nameY = qrY + QR_SIZE + 82

      // Gold underline decoration
      ctx.strokeStyle = 'rgba(201,162,39,0.5)'
      ctx.lineWidth = 1
      ctx.beginPath(); ctx.moveTo(120, nameY - 18); ctx.lineTo(W - 120, nameY - 18); ctx.stroke()

      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 34px "Arial Black", Arial'
      ctx.textAlign = 'center'
      ctx.fillText(payeeName.toUpperCase().slice(0, 24), W / 2, nameY + 14)

      // ── Amount ──
      let nextY = nameY + 50
      if (amount) {
        // Amount pill background
        const amtW = 200
        ctx.fillStyle = 'rgba(29,191,173,0.15)'
        roundRect(ctx, (W - amtW) / 2, nextY - 34, amtW, 52, 12)
        ctx.fill()
        ctx.strokeStyle = 'rgba(29,191,173,0.5)'
        ctx.lineWidth = 1.5
        roundRect(ctx, (W - amtW) / 2, nextY - 34, amtW, 52, 12)
        ctx.stroke()

        ctx.fillStyle = '#1dbfad'
        ctx.font = 'bold 38px "Arial Black", Arial'
        ctx.textAlign = 'center'
        ctx.fillText(`₹ ${Number(amount).toLocaleString('en-IN')}`, W / 2, nextY + 6)
        nextY += 58
      }

      // ── Note ──
      if (note) {
        ctx.fillStyle = 'rgba(255,255,255,0.55)'
        ctx.font = '16px Arial'
        ctx.textAlign = 'center'
        nextY = wrapText(ctx, note, W / 2, nextY, W - 120, 24) + 28
      }

      // ── Divider ──
      const divY = Math.max(nextY + 10, H - 185)
      ctx.strokeStyle = 'rgba(201,162,39,0.25)'
      ctx.lineWidth = 1
      ctx.beginPath(); ctx.moveTo(60, divY); ctx.lineTo(W - 60, divY); ctx.stroke()

      // Small diamond center on divider
      ctx.fillStyle = '#c9a227'
      ctx.save(); ctx.translate(W / 2, divY); ctx.rotate(Math.PI / 4)
      ctx.fillRect(-5, -5, 10, 10)
      ctx.restore()

      // ── "Scan with" text ──
      ctx.fillStyle = 'rgba(255,255,255,0.35)'
      ctx.font = 'bold 11px Arial'
      ctx.textAlign = 'center'
      ctx.fillText('SCAN WITH ANY UPI APP', W / 2, divY + 26)

      // ── App badges ──
      const apps = ['GPay', 'PhonePe', 'Paytm', 'BHIM', 'Amazon Pay', 'WhatsApp Pay']
      const emojis = ['🟢', '🟣', '🔵', '🟠', '🟡', '🟤']
      ctx.font = 'bold 12px Arial'
      const totalAppW = apps.reduce((a, app) => a + ctx.measureText(`${app}`).width + 28, 0) + (apps.length - 1) * 4
      let appX = (W - Math.min(totalAppW, W - 80)) / 2

      // Two rows of apps
      const row1 = apps.slice(0, 3); const row2 = apps.slice(3)
      const emoRow1 = emojis.slice(0, 3); const emoRow2 = emojis.slice(3)

      const drawAppRow = (rowApps: string[], rowEmojis: string[], rowY: number) => {
        const rowItems = rowApps.map((a, i) => ({ label: `${rowEmojis[i]} ${a}`, w: ctx.measureText(`${rowEmojis[i]} ${a}`).width + 22 }))
        const rowTotalW = rowItems.reduce((a, it) => a + it.w, 0) + (rowItems.length - 1) * 7
        let rx = (W - rowTotalW) / 2
        for (const item of rowItems) {
          ctx.fillStyle = 'rgba(255,255,255,0.07)'
          roundRect(ctx, rx, rowY, item.w, 26, 13)
          ctx.fill()
          ctx.strokeStyle = 'rgba(255,255,255,0.12)'
          ctx.lineWidth = 1
          roundRect(ctx, rx, rowY, item.w, 26, 13)
          ctx.stroke()
          ctx.fillStyle = 'rgba(255,255,255,0.7)'
          ctx.textAlign = 'left'
          ctx.font = '11.5px Arial'
          ctx.fillText(item.label, rx + 10, rowY + 17)
          rx += item.w + 7
        }
      }

      drawAppRow(row1, emoRow1, divY + 40)
      drawAppRow(row2, emoRow2, divY + 76)

      // ── Footer ──
      const footerY = H - 40
      ctx.strokeStyle = 'rgba(201,162,39,0.15)'
      ctx.lineWidth = 1
      ctx.beginPath(); ctx.moveTo(60, footerY - 16); ctx.lineTo(W - 60, footerY - 16); ctx.stroke()

      ctx.fillStyle = 'rgba(201,162,39,0.5)'
      ctx.font = 'bold 11px Arial'
      ctx.textAlign = 'center'
      ctx.fillText('Generated by assamcareerpoint-info.com', W / 2, footerY)

      // ── Download ──
      const a = document.createElement('a')
      a.href = canvas.toDataURL('image/png', 1.0)
      a.download = `upi-payment-${payeeName.replace(/\s+/g, '-').toLowerCase()}.png`
      a.click()
    } catch (e) {
      console.error('Card download failed:', e)
      // Fallback: download raw QR
      const a = document.createElement('a')
      a.href = qrDataUrl
      a.download = `upi-qr-${payeeName.replace(/\s+/g, '-').toLowerCase()}.png`
      a.click()
    }
    setDownloading(false)
  }

  const copyId = () => {
    const t = mode === 'upi' ? upiId : mode === 'mobile' ? mobile : bankAcc
    navigator.clipboard.writeText(t).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000) })
  }

  const reset = () => {
    setUpiId(''); setPayeeName(''); setAmount(''); setNote('')
    setBankAcc(''); setIfsc(''); setMobile(''); setQrDataUrl(''); setError('')
  }

  const row = { display: 'flex', flexDirection: 'column' as const, gap: '14px' }

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
        title="UPI QR Code Generator"
        desc="Create a payment QR code for GPay, PhonePe, Paytm, BHIM and all UPI apps. Supports UPI ID, Bank Account and Mobile. Free, instant and 100% private."
      />

      <div style={S.wrap}>
        <div style={S.grid2}>

          {/* ── FORM ── */}
          <div style={S.card}>
            <h2 style={S.cardTitle}>Enter Payment Details</h2>

            <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: '12px', padding: '5px', gap: '4px', marginBottom: '22px' }}>
              {(['upi', 'bank', 'mobile'] as Mode[]).map(m => (
                <ModeTab key={m} active={mode === m}
                  onClick={() => { setMode(m); setQrDataUrl(''); setError('') }}
                  label={m === 'upi' ? 'UPI ID' : m === 'bank' ? 'Bank A/C' : 'Mobile'} />
              ))}
            </div>

            <div style={row}>
              {mode === 'upi' && (
                <div>
                  <label style={S.label}>UPI ID *</label>
                  <input style={S.input} value={upiId} onChange={e => setUpiId(e.target.value)} placeholder="e.g. name@okaxis, 9876543210@paytm" />
                  <p style={S.hint}>Your UPI ID linked to your bank account</p>
                </div>
              )}
              {mode === 'bank' && (<>
                <div>
                  <label style={S.label}>Account Number *</label>
                  <input style={S.input} value={bankAcc} onChange={e => setBankAcc(e.target.value.replace(/\D/g, ''))} placeholder="Enter account number" />
                </div>
                <div>
                  <label style={S.label}>IFSC Code * <span style={{ color: C.gray400, fontWeight: 500 }}>(11 characters)</span></label>
                  <input style={S.input} value={ifsc} onChange={e => setIfsc(e.target.value.toUpperCase())} placeholder="e.g. SBIN0000001" maxLength={11} />
                  <p style={S.hint}>Find IFSC on your cheque book or bank passbook</p>
                </div>
              </>)}
              {mode === 'mobile' && (
                <div>
                  <label style={S.label}>Mobile Number *</label>
                  <input style={S.input} value={mobile} onChange={e => setMobile(e.target.value.replace(/\D/g, ''))} maxLength={10} placeholder="10-digit mobile number" />
                </div>
              )}

              <div>
                <label style={S.label}>Payee Name *</label>
                <input style={S.input} value={payeeName} onChange={e => setPayeeName(e.target.value)} placeholder="Your name or shop name" />
              </div>

              <div>
                <label style={S.label}>Amount <span style={{ color: C.gray400, fontWeight: 500 }}>(Optional — leave blank for open amount)</span></label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', fontWeight: 700, color: C.gray600, fontSize: '15px' }}>₹</span>
                  <input style={{ ...S.input, paddingLeft: '34px' }} value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" type="number" min="0" step="0.01" />
                </div>
              </div>

              <div>
                <label style={S.label}>Note / Remark <span style={{ color: C.gray400, fontWeight: 500 }}>(Optional)</span></label>
                <input style={S.input} value={note} onChange={e => setNote(e.target.value)} placeholder="e.g. Payment for invoice #123" />
              </div>

              {error && <div style={S.error}>⚠ {error}</div>}

              <button style={S.btnPrimary} onClick={generate} disabled={loading}>
                {loading ? '⏳ Generating...' : '📲 Generate QR Code'}
              </button>
            </div>
          </div>

          {/* ── PREVIEW ── */}
          <div style={S.card}>
            <h2 style={S.cardTitle}>QR Code Preview</h2>
            {!qrDataUrl ? (
              <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                <div style={{ fontSize: '72px', opacity: 0.12, marginBottom: '14px' }}>📲</div>
                <p style={{ color: C.gray400, fontSize: '15px' }}>Fill the form and click<br /><strong style={{ color: C.gray600 }}>Generate QR Code</strong></p>
              </div>
            ) : (
              <div style={{ textAlign: 'center' }}>
                {/* Preview card — matches download card design */}
                <div style={{
                  background: 'linear-gradient(135deg, #0b1f33, #0d2a44, #071828)',
                  border: '3px solid #c9a227',
                  borderRadius: '18px',
                  padding: '20px 16px 18px',
                  marginBottom: '18px',
                  display: 'inline-block',
                  width: '100%',
                  maxWidth: 320,
                  boxShadow: '0 8px 40px rgba(0,0,0,0.4)',
                }}>
                  {/* Header */}
                  <div style={{ background: 'rgba(201,162,39,0.12)', border: '1px solid rgba(201,162,39,0.25)', borderRadius: '10px', padding: '8px 14px', marginBottom: '14px' }}>
                    <div style={{ color: '#c9a227', fontWeight: 900, fontSize: '15px', fontFamily: 'Arial Black, sans-serif' }}>📲 SCAN & PAY</div>
                    <div style={{ color: 'rgba(29,191,173,0.9)', fontSize: '11px', marginTop: 2 }}>UPI Payment — All apps accepted</div>
                  </div>

                  {/* QR */}
                  <div style={{ background: '#fff', borderRadius: '12px', padding: '12px', border: '2px solid #c9a227', display: 'inline-block', marginBottom: '14px', boxShadow: '0 0 20px rgba(201,162,39,0.3)' }}>
                    <img src={qrDataUrl} alt="UPI QR Code" width={180} height={180} style={{ display: 'block' }} />
                    <div style={{ background: '#0b1f33', borderRadius: '0 0 6px 6px', padding: '4px', marginTop: 4, fontSize: '11px', fontWeight: 700, color: '#1dbfad', textAlign: 'center' }}>BHIM UPI</div>
                  </div>

                  {/* Name */}
                  <div style={{ color: '#fff', fontWeight: 900, fontSize: '18px', fontFamily: 'Arial Black, sans-serif', letterSpacing: '.04em', marginBottom: amount ? 8 : 0 }}>{payeeName.toUpperCase()}</div>

                  {/* Amount */}
                  {amount && (
                    <div style={{ background: 'rgba(29,191,173,0.15)', border: '1px solid rgba(29,191,173,0.4)', borderRadius: '10px', padding: '6px 20px', display: 'inline-block', marginBottom: 8 }}>
                      <span style={{ color: '#1dbfad', fontWeight: 900, fontSize: '22px', fontFamily: 'Arial Black, sans-serif' }}>₹ {Number(amount).toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  {/* Note */}
                  {note && <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: '13px', marginBottom: 12 }}>{note}</div>}

                  {/* Divider */}
                  <div style={{ borderTop: '1px solid rgba(201,162,39,0.25)', margin: '12px 0 10px', position: 'relative' }}>
                    <span style={{ position: 'absolute', top: -7, left: '50%', transform: 'translateX(-50%)', background: '#0d2a44', padding: '0 8px', color: '#c9a227', fontSize: '10px' }}>◆</span>
                  </div>

                  {/* App badges */}
                  <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)', fontWeight: 700, marginBottom: 7, letterSpacing: '.05em' }}>SCAN WITH ANY UPI APP</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', justifyContent: 'center', marginBottom: 10 }}>
                    {UPI_APPS.map(a => (
                      <span key={a.name} style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '99px', padding: '3px 9px', fontSize: '11px', color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>
                        {a.emoji} {a.name}
                      </span>
                    ))}
                  </div>

                  {/* Footer */}
                  <div style={{ borderTop: '1px solid rgba(201,162,39,0.1)', paddingTop: 8, fontSize: '10px', color: 'rgba(201,162,39,0.45)', fontWeight: 700 }}>
                    assamcareerpoint-info.com
                  </div>
                </div>

                {/* Action buttons */}
                <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                  <button
                    style={{ ...S.btnGold, flex: 1, opacity: downloading ? 0.7 : 1 }}
                    onClick={downloadCard}
                    disabled={downloading}
                  >
                    {downloading ? '⏳ Creating...' : '⬇ Download Card'}
                  </button>
                  <button style={{ ...S.btnOutline, flex: 1 }} onClick={copyId}>
                    {copied ? '✓ Copied!' : '📋 Copy ID'}
                  </button>
                </div>
                <div style={{ fontSize: '12px', color: C.gray400, marginBottom: 10 }}>
                  Downloads a portrait PNG card with name, amount & branding
                </div>
                <button onClick={reset} style={{ background: 'none', border: 'none', color: C.gray400, fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit' }}>
                  Reset & Start Over
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Info cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginTop: '28px' }}>
          {[
            { icon: '⚡', t: 'Instant Generation', d: 'QR code created instantly in your browser — no server, no wait time.' },
            { icon: '🔒', t: '100% Private', d: 'Your UPI ID and payment details never leave your device.' },
            { icon: '📱', t: 'All UPI Apps', d: 'Compatible with GPay, PhonePe, Paytm, BHIM, WhatsApp Pay and all NPCI UPI apps.' },
          ].map(i => (
            <div key={i.t} style={S.card}>
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>{i.icon}</div>
              <p style={{ fontSize: '15px', fontWeight: 800, color: C.navy, margin: '0 0 5px' }}>{i.t}</p>
              <p style={{ fontSize: '13px', color: C.gray500, margin: 0, lineHeight: 1.6 }}>{i.d}</p>
            </div>
          ))}
        </div>

        {/* SEO */}
        <div style={{ ...S.card, marginTop: '28px' }}>
          <h2 style={S.sectionTitle}>How to Generate a UPI QR Code Online — Free</h2>
          <div style={S.grid2}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: C.navy, marginBottom: '10px' }}>Step-by-step guide</h3>
              <ol style={{ paddingLeft: '18px', lineHeight: 2, color: C.gray600, fontSize: '14px', margin: 0 }}>
                <li>Select <strong>UPI ID</strong>, <strong>Bank Account</strong> or <strong>Mobile Number</strong> mode</li>
                <li>Enter your UPI ID (e.g. <code style={{ background: C.gray100, padding: '1px 5px', borderRadius: '4px' }}>name@okaxis</code>) or account details</li>
                <li>Enter your name or shop name as Payee Name</li>
                <li>Set a fixed amount or leave blank for open payment</li>
                <li>Click <strong>Generate QR Code</strong></li>
                <li>Click <strong>Download Card</strong> to save the full portrait PNG with name, amount and branding</li>
              </ol>
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: C.navy, marginBottom: '10px' }}>Popular use cases</h3>
              <ul style={{ paddingLeft: '18px', lineHeight: 2, color: C.gray600, fontSize: '14px', margin: 0 }}>
                <li>Small shops and street vendors accepting UPI payment</li>
                <li>Coaching centres and tutorial classes for fee collection</li>
                <li>Freelancers to include payment QR in invoices</li>
                <li>Individuals to receive money via WhatsApp</li>
                <li>Print on visiting cards or display at counter</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
