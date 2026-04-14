'use client'
import { useState, useRef } from 'react'
import { C, S, ToolHeader, ModeTab, Divider } from '../_shared'

type Mode = 'upi' | 'bank' | 'mobile'

const UPI_APPS = [
  { name: 'GPay', emoji: '🟢' }, { name: 'PhonePe', emoji: '🟣' },
  { name: 'Paytm', emoji: '🔵' }, { name: 'BHIM', emoji: '🟠' },
  { name: 'Amazon Pay', emoji: '🟡' }, { name: 'WhatsApp Pay', emoji: '🟤' },
]

export default function UpiQrClient() {
  const [mode, setMode]         = useState<Mode>('upi')
  const [upiId, setUpiId]       = useState('')
  const [payeeName, setPayeeName] = useState('')
  const [amount, setAmount]     = useState('')
  const [note, setNote]         = useState('')
  const [bankAcc, setBankAcc]   = useState('')
  const [ifsc, setIfsc]         = useState('')
  const [mobile, setMobile]     = useState('')
  const [qrDataUrl, setQrDataUrl] = useState('')
  const [error, setError]       = useState('')
  const [copied, setCopied]     = useState(false)
  const [loading, setLoading]   = useState(false)

  const validate = () => {
    if (!payeeName.trim()) return 'Please enter Payee Name.'
    if (mode === 'upi' && !upiId.includes('@')) return 'UPI ID must contain @ (e.g. name@okaxis).'
    if (mode === 'bank' && (!bankAcc.trim() || !ifsc.trim())) return 'Enter Account Number and IFSC Code.'
    if (mode === 'mobile' && mobile.length !== 10) return 'Enter a valid 10-digit mobile number.'
    if (amount && isNaN(Number(amount))) return 'Amount must be a number.'
    return ''
  }

  const buildUpiString = () => {
    let pa = mode === 'upi' ? upiId.trim()
           : mode === 'bank' ? `${bankAcc}@${ifsc.toLowerCase()}`
           : `${mobile}@upi`
    let s = `upi://pay?pa=${encodeURIComponent(pa)}&pn=${encodeURIComponent(payeeName.trim())}&cu=INR`
    if (amount.trim()) s += `&am=${encodeURIComponent(amount.trim())}`
    if (note.trim())   s += `&tn=${encodeURIComponent(note.trim())}`
    return s
  }

  const generate = async () => {
    const err = validate()
    if (err) { setError(err); return }
    setError(''); setLoading(true)
    const QRCode = (await import('qrcode')).default
    try {
      const url = await QRCode.toDataURL(buildUpiString(), {
        width: 400, margin: 2,
        color: { dark: C.navy, light: '#ffffff' },
        errorCorrectionLevel: 'H',
      })
      setQrDataUrl(url)
    } catch { setError('Failed to generate QR. Please try again.') }
    setLoading(false)
  }

  const download = () => {
    const a = document.createElement('a')
    a.href = qrDataUrl
    a.download = `upi-qr-${payeeName.replace(/\s+/g, '-').toLowerCase()}.png`
    a.click()
  }

  const copyId = () => {
    const t = mode === 'upi' ? upiId : mode === 'mobile' ? mobile : bankAcc
    navigator.clipboard.writeText(t).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000) })
  }

  const reset = () => {
    setUpiId(''); setPayeeName(''); setAmount(''); setNote('')
    setBankAcc(''); setIfsc(''); setMobile(''); setQrDataUrl(''); setError('')
  }

  const fw = { display: 'flex', flexDirection: 'column' as const, gap: '16px' }

  return (
    <main style={S.page}>
      <ToolHeader
        title="UPI QR Code Generator"
        desc="Create a payment QR code for GPay, PhonePe, Paytm, BHIM and all UPI apps. Free, instant and 100% private."
      />

      <div style={S.wrap}>
        <div style={S.grid2}>

          {/* ── LEFT: Form ── */}
          <div style={S.card}>
            <h2 style={S.cardTitle}>Enter Payment Details</h2>

            {/* Mode tabs */}
            <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: '14px', padding: '6px', gap: '4px', marginBottom: '24px' }}>
              {(['upi', 'bank', 'mobile'] as Mode[]).map(m => (
                <ModeTab key={m} active={mode === m} onClick={() => { setMode(m); setQrDataUrl('') }}
                  label={m === 'upi' ? 'UPI ID' : m === 'bank' ? 'Bank A/C' : 'Mobile'} />
              ))}
            </div>

            <div style={fw}>
              {mode === 'upi' && (
                <div>
                  <label style={S.label}>UPI ID *</label>
                  <input style={S.input} value={upiId} onChange={e => setUpiId(e.target.value)} placeholder="e.g. name@okaxis, 9876543210@paytm" />
                  <p style={S.hint}>Your UPI ID linked to bank account</p>
                </div>
              )}
              {mode === 'bank' && (<>
                <div>
                  <label style={S.label}>Account Number *</label>
                  <input style={S.input} value={bankAcc} onChange={e => setBankAcc(e.target.value)} placeholder="Bank account number" />
                </div>
                <div>
                  <label style={S.label}>IFSC Code *</label>
                  <input style={S.input} value={ifsc} onChange={e => setIfsc(e.target.value.toUpperCase())} placeholder="e.g. SBIN0001234" />
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
                <label style={S.label}>Amount <span style={{ color: C.gray400, fontWeight: 500 }}>(Optional)</span></label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', fontWeight: 700, color: C.gray600, fontSize: '16px' }}>₹</span>
                  <input style={{ ...S.input, paddingLeft: '36px' }} value={amount} onChange={e => setAmount(e.target.value)} placeholder="Leave empty for open amount" type="number" min="0" />
                </div>
              </div>

              <div>
                <label style={S.label}>Note / Remark <span style={{ color: C.gray400, fontWeight: 500 }}>(Optional)</span></label>
                <input style={S.input} value={note} onChange={e => setNote(e.target.value)} placeholder="e.g. Payment for invoice #123" />
              </div>

              {error && <div style={S.error}>{error}</div>}

              <button style={S.btnPrimary} onClick={generate} disabled={loading}>
                {loading ? '⏳ Generating...' : '📲 Generate QR Code'}
              </button>
            </div>
          </div>

          {/* ── RIGHT: Preview ── */}
          <div style={S.card}>
            <h2 style={S.cardTitle}>QR Code Preview</h2>

            {!qrDataUrl ? (
              <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                <div style={{ fontSize: '80px', opacity: 0.15, marginBottom: '16px' }}>📲</div>
                <p style={{ color: C.gray400, fontSize: '16px' }}>Fill the form and click<br /><strong style={{ color: C.gray600 }}>Generate QR Code</strong></p>
              </div>
            ) : (
              <div style={{ textAlign: 'center' }}>
                <div style={{ display: 'inline-block', border: `6px solid ${C.gray100}`, borderRadius: '16px', overflow: 'hidden', marginBottom: '20px' }}>
                  <img src={qrDataUrl} alt="UPI QR Code" width={220} height={220} />
                </div>

                <p style={{ fontSize: '22px', fontWeight: 800, color: C.navy, margin: '0 0 6px' }}>{payeeName}</p>
                {amount && <p style={{ fontSize: '28px', fontWeight: 800, color: C.teal, margin: '0 0 6px' }}>₹{amount}</p>}
                {note && <p style={{ fontSize: '15px', color: C.gray500, margin: '0 0 20px' }}>{note}</p>}

                <Divider title="Scan with any UPI app" />
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', marginBottom: '24px' }}>
                  {UPI_APPS.map(a => (
                    <span key={a.name} style={{ background: C.gray50, border: `1px solid ${C.gray200}`, borderRadius: '99px', padding: '6px 14px', fontSize: '14px', fontWeight: 600, color: C.gray600 }}>
                      {a.emoji} {a.name}
                    </span>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                  <button style={{ ...S.btnGold, flex: 1 }} onClick={download}>⬇ Download PNG</button>
                  <button style={{ ...S.btnOutline, flex: 1 }} onClick={copyId}>{copied ? '✓ Copied!' : '📋 Copy ID'}</button>
                </div>
                <button onClick={reset} style={{ background: 'none', border: 'none', color: C.gray400, fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit' }}>
                  Reset & Start Over
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Info cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginTop: '32px' }}>
          {[
            { icon: '⚡', t: 'Instant Generation', d: 'QR code created instantly in your browser — no server, no wait.' },
            { icon: '🔒', t: '100% Private', d: 'Your UPI ID and payment details never leave your device.' },
            { icon: '📱', t: 'All UPI Apps', d: 'Compatible with GPay, PhonePe, Paytm, BHIM, WhatsApp Pay and all NPCI UPI apps.' },
          ].map(i => (
            <div key={i.t} style={S.card}>
              <div style={{ fontSize: '32px', marginBottom: '10px' }}>{i.icon}</div>
              <p style={{ fontSize: '16px', fontWeight: 800, color: C.navy, margin: '0 0 6px' }}>{i.t}</p>
              <p style={{ fontSize: '14px', color: C.gray500, margin: 0, lineHeight: 1.6 }}>{i.d}</p>
            </div>
          ))}
        </div>

        {/* SEO content */}
        <div style={{ ...S.card, marginTop: '32px' }}>
          <h2 style={S.sectionTitle}>How to Use the UPI QR Code Generator</h2>
          <div style={S.grid2}>
            <div>
              <h3 style={{ fontSize: '17px', fontWeight: 700, color: C.navy, marginBottom: '12px' }}>Step-by-step guide</h3>
              <ol style={{ paddingLeft: '20px', lineHeight: 2, color: C.gray600, fontSize: '15px' }}>
                <li>Select UPI ID, Bank Account or Mobile Number mode</li>
                <li>Enter your UPI ID (e.g. <code style={{ background: C.gray100, padding: '2px 6px', borderRadius: '6px' }}>name@okaxis</code>)</li>
                <li>Enter your name or shop name as Payee Name</li>
                <li>Optionally set a fixed amount or leave blank</li>
                <li>Click <strong>Generate QR Code</strong></li>
                <li>Download as PNG or copy the QR to share</li>
              </ol>
            </div>
            <div>
              <h3 style={{ fontSize: '17px', fontWeight: 700, color: C.navy, marginBottom: '12px' }}>Popular use cases</h3>
              <ul style={{ paddingLeft: '20px', lineHeight: 2, color: C.gray600, fontSize: '15px' }}>
                <li>Small shops and street vendors</li>
                <li>Coaching centres and tutorial classes</li>
                <li>Freelancers to share in invoices</li>
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
