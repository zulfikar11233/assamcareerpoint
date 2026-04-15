'use client'
import { useState } from 'react'
import { C, S, ToolsNavbar, ToolHeader, ModeTab, Divider } from '../_shared'

type Mode = 'upi' | 'bank' | 'mobile'

const UPI_APPS = [
  { name: 'GPay', emoji: '🟢' }, { name: 'PhonePe', emoji: '🟣' },
  { name: 'Paytm', emoji: '🔵' }, { name: 'BHIM', emoji: '🟠' },
  { name: 'Amazon Pay', emoji: '🟡' }, { name: 'WhatsApp Pay', emoji: '🟤' },
]

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

  // ✅ FIXED: Correct NPCI-standard UPI string for Bank A/C
  const buildUpiString = () => {
    let pa = ''
    if (mode === 'upi') pa = upiId.trim()
    else if (mode === 'bank') pa = `${bankAcc.trim()}@${ifsc.trim().toUpperCase()}.ifsc.npci`
    else if (mode === 'mobile') pa = `${mobile.trim()}@upi`

    let s = `upi://pay?pa=${encodeURIComponent(pa)}&pn=${encodeURIComponent(payeeName.trim())}&cu=INR`
    if (amount.trim()) s += `&am=${encodeURIComponent(amount.trim())}`
    if (note.trim()) s += `&tn=${encodeURIComponent(note.trim())}`
    return s
  }

  const generate = async () => {
    const err = validate()
    if (err) { setError(err); return }
    setError(''); setLoading(true)
    try {
      const QRCode = (await import('qrcode')).default
      const url = await QRCode.toDataURL(buildUpiString(), {
        width: 400, margin: 2,
        color: { dark: '#000000', light: '#ffffff' },
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

          {/* Form */}
          <div style={S.card}>
            <h2 style={S.cardTitle}>Enter Payment Details</h2>

            {/* Mode tabs */}
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
                  <input style={S.input} value={bankAcc} onChange={e => setBankAcc(e.target.value.replace(/\D/g, ''))} placeholder="e.g. 33283091321" />
                </div>
                <div>
                  <label style={S.label}>IFSC Code * <span style={{ color: C.gray400, fontWeight: 500 }}>(11 characters)</span></label>
                  <input style={S.input} value={ifsc} onChange={e => setIfsc(e.target.value.toUpperCase())} placeholder="e.g. SBIN0004569" maxLength={11} />
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

          {/* Preview */}
          <div style={S.card}>
            <h2 style={S.cardTitle}>QR Code Preview</h2>
            {!qrDataUrl ? (
              <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                <div style={{ fontSize: '72px', opacity: 0.12, marginBottom: '14px' }}>📲</div>
                <p style={{ color: C.gray400, fontSize: '15px' }}>Fill the form and click<br /><strong style={{ color: C.gray600 }}>Generate QR Code</strong></p>
              </div>
            ) : (
              <div style={{ textAlign: 'center' }}>
                <div style={{ display: 'inline-block', border: `6px solid ${C.gray100}`, borderRadius: '14px', overflow: 'hidden', marginBottom: '18px' }}>
                  <img src={qrDataUrl} alt="UPI QR Code" width={220} height={220} />
                </div>
                <p style={{ fontSize: '20px', fontWeight: 800, color: C.navy, margin: '0 0 5px' }}>{payeeName}</p>
                {amount && <p style={{ fontSize: '26px', fontWeight: 800, color: C.teal, margin: '0 0 5px' }}>₹{amount}</p>}
                {note && <p style={{ fontSize: '14px', color: C.gray500, margin: '0 0 18px' }}>{note}</p>}

                <Divider title="Scan with any UPI app" />
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px', justifyContent: 'center', marginBottom: '20px' }}>
                  {UPI_APPS.map(a => (
                    <span key={a.name} style={{ background: C.gray50, border: `1px solid ${C.gray200}`, borderRadius: '99px', padding: '5px 12px', fontSize: '13px', fontWeight: 600, color: C.gray600 }}>
                      {a.emoji} {a.name}
                    </span>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                  <button style={{ ...S.btnGold, flex: 1 }} onClick={download}>⬇ Download PNG</button>
                  <button style={{ ...S.btnOutline, flex: 1 }} onClick={copyId}>{copied ? '✓ Copied!' : '📋 Copy ID'}</button>
                </div>
                <button onClick={reset} style={{ background: 'none', border: 'none', color: C.gray400, fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit', marginTop: '4px' }}>
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
                <li>Download as PNG to print or share via WhatsApp</li>
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
