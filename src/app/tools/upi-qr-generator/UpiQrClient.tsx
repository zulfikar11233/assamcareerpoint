'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

type Mode = 'upi' | 'bank' | 'mobile'

export default function UpiQrClient() {
  const [mode, setMode] = useState<Mode>('upi')
  const [upiId, setUpiId] = useState('')
  const [payeeName, setPayeeName] = useState('')
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')
  const [bankAcc, setBankAcc] = useState('')
  const [ifsc, setIfsc] = useState('')
  const [mobile, setMobile] = useState('')
  const [qrDataUrl, setQrDataUrl] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [generated, setGenerated] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const buildUpiString = (): string => {
    let pa = ''
    if (mode === 'upi') pa = upiId.trim()
    else if (mode === 'bank') pa = `${bankAcc.trim()}@${ifsc.trim().toLowerCase()}`
    else if (mode === 'mobile') pa = `${mobile.trim()}@upi`

    let str = `upi://pay?pa=${encodeURIComponent(pa)}&pn=${encodeURIComponent(payeeName.trim())}&cu=INR`
    if (amount.trim()) str += `&am=${encodeURIComponent(amount.trim())}`
    if (note.trim()) str += `&tn=${encodeURIComponent(note.trim())}`
    return str
  }

  const validate = (): string => {
    if (!payeeName.trim()) return 'Please enter the Payee Name.'
    if (mode === 'upi' && !upiId.trim()) return 'Please enter your UPI ID.'
    if (mode === 'upi' && !upiId.includes('@')) return 'UPI ID must contain @ (e.g. name@okaxis).'
    if (mode === 'bank' && (!bankAcc.trim() || !ifsc.trim()))
      return 'Please enter Account Number and IFSC Code.'
    if (mode === 'mobile' && (!mobile.trim() || mobile.length !== 10))
      return 'Please enter a valid 10-digit mobile number.'
    if (amount && isNaN(Number(amount))) return 'Amount must be a valid number.'
    return ''
  }

  const generateQR = async () => {
    const err = validate()
    if (err) { setError(err); return }
    setError('')

    const QRCode = (await import('qrcode')).default
    const upiString = buildUpiString()

    try {
      const dataUrl = await QRCode.toDataURL(upiString, {
        width: 400,
        margin: 2,
        color: { dark: '#0b1f33', light: '#ffffff' },
        errorCorrectionLevel: 'H',
      })
      setQrDataUrl(dataUrl)
      setGenerated(true)
    } catch {
      setError('Failed to generate QR code. Please try again.')
    }
  }

  const downloadQR = () => {
    if (!qrDataUrl) return
    const a = document.createElement('a')
    a.href = qrDataUrl
    a.download = `upi-qr-${payeeName.replace(/\s+/g, '-').toLowerCase()}.png`
    a.click()
  }

  const copyUpiId = () => {
    const text = mode === 'upi' ? upiId : mode === 'mobile' ? mobile : bankAcc
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const reset = () => {
    setUpiId(''); setPayeeName(''); setAmount(''); setNote('')
    setBankAcc(''); setIfsc(''); setMobile('')
    setQrDataUrl(''); setError(''); setGenerated(false)
  }

  const upiApps = [
    { name: 'GPay', emoji: '🟢' },
    { name: 'PhonePe', emoji: '🟣' },
    { name: 'Paytm', emoji: '🔵' },
    { name: 'BHIM', emoji: '🟠' },
    { name: 'Amazon Pay', emoji: '🟡' },
    { name: 'WhatsApp Pay', emoji: '🟤' },
  ]

  const inputClass =
    'w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition bg-white'
  const labelClass = 'block text-sm font-semibold text-gray-700 mb-1.5'

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #0b1f33 0%, #1a3a5c 100%)' }} className="py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <Link href="/tools" className="text-sm text-gray-400 hover:text-white mb-3 inline-block">
            ← Back to Tools
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            UPI QR Code Generator
          </h1>
          <p className="text-gray-300 text-lg">
            Create a payment QR code for GPay, PhonePe, Paytm, BHIM & all UPI apps. Free, instant, private.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* LEFT — Form */}
          <div className="bg-white rounded-2xl border border-gray-200 p-7 shadow-sm">

            {/* Mode tabs */}
            <div className="flex gap-2 mb-7 bg-gray-100 p-1 rounded-xl">
              {([['upi', 'UPI ID'], ['bank', 'Bank A/C'], ['mobile', 'Mobile']] as [Mode, string][]).map(([m, label]) => (
                <button
                  key={m}
                  onClick={() => { setMode(m); setGenerated(false); setQrDataUrl('') }}
                  className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${
                    mode === m ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="space-y-5">
              {/* Dynamic input based on mode */}
              {mode === 'upi' && (
                <div>
                  <label className={labelClass}>UPI ID *</label>
                  <input
                    className={inputClass}
                    value={upiId}
                    onChange={e => setUpiId(e.target.value)}
                    placeholder="e.g. name@okaxis, 9876543210@paytm"
                  />
                  <p className="text-xs text-gray-400 mt-1">Enter the UPI ID linked to your bank account</p>
                </div>
              )}
              {mode === 'bank' && (
                <>
                  <div>
                    <label className={labelClass}>Account Number *</label>
                    <input className={inputClass} value={bankAcc} onChange={e => setBankAcc(e.target.value)} placeholder="Enter bank account number" />
                  </div>
                  <div>
                    <label className={labelClass}>IFSC Code *</label>
                    <input className={inputClass} value={ifsc} onChange={e => setIfsc(e.target.value.toUpperCase())} placeholder="e.g. SBIN0001234" />
                  </div>
                </>
              )}
              {mode === 'mobile' && (
                <div>
                  <label className={labelClass}>Mobile Number *</label>
                  <input className={inputClass} value={mobile} onChange={e => setMobile(e.target.value.replace(/\D/, ''))} maxLength={10} placeholder="10-digit mobile number" />
                </div>
              )}

              <div>
                <label className={labelClass}>Payee Name *</label>
                <input className={inputClass} value={payeeName} onChange={e => setPayeeName(e.target.value)} placeholder="Your name or business name" />
              </div>

              <div>
                <label className={labelClass}>Amount <span className="text-gray-400 font-normal">(Optional)</span></label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">₹</span>
                  <input className={inputClass + ' pl-8'} value={amount} onChange={e => setAmount(e.target.value)} placeholder="Leave empty for open amount" type="number" min="0" />
                </div>
              </div>

              <div>
                <label className={labelClass}>Note / Remark <span className="text-gray-400 font-normal">(Optional)</span></label>
                <input className={inputClass} value={note} onChange={e => setNote(e.target.value)} placeholder="e.g. Payment for invoice #123" />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
                  {error}
                </div>
              )}

              <button
                onClick={generateQR}
                className="w-full py-3.5 rounded-xl font-bold text-base transition-all hover:opacity-90 active:scale-[0.98]"
                style={{ background: '#1dbfad', color: '#fff' }}
              >
                Generate QR Code
              </button>
            </div>
          </div>

          {/* RIGHT — QR Preview */}
          <div className="bg-white rounded-2xl border border-gray-200 p-7 shadow-sm flex flex-col items-center justify-center">
            {!generated ? (
              <div className="text-center">
                <div className="w-48 h-48 border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-5">
                  <span className="text-6xl opacity-30">📲</span>
                </div>
                <p className="text-gray-400 text-base">Fill the form and click<br /><strong className="text-gray-600">Generate QR Code</strong></p>
              </div>
            ) : (
              <>
                <div className="border-4 border-gray-100 rounded-2xl overflow-hidden mb-5">
                  <img src={qrDataUrl} alt="UPI QR Code" width={240} height={240} />
                </div>

                <div className="text-center mb-5">
                  <p className="font-bold text-gray-800 text-lg">{payeeName}</p>
                  {amount && <p className="text-2xl font-bold mt-1" style={{ color: '#1dbfad' }}>₹{amount}</p>}
                  {note && <p className="text-sm text-gray-500 mt-1">{note}</p>}
                </div>

                {/* UPI app compatibility */}
                <div className="w-full mb-5">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide text-center mb-3">Scan with any UPI app</p>
                  <div className="flex justify-center flex-wrap gap-2">
                    {upiApps.map(app => (
                      <span key={app.name} className="text-xs bg-gray-50 border border-gray-200 px-2.5 py-1 rounded-full text-gray-600">
                        {app.emoji} {app.name}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 w-full">
                  <button
                    onClick={downloadQR}
                    className="flex-1 py-3 rounded-xl font-bold text-sm transition-all hover:opacity-90"
                    style={{ background: '#c9a227', color: '#fff' }}
                  >
                    ⬇ Download PNG
                  </button>
                  <button
                    onClick={copyUpiId}
                    className="flex-1 py-3 rounded-xl font-bold text-sm border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-all"
                  >
                    {copied ? '✓ Copied!' : '📋 Copy ID'}
                  </button>
                </div>
                <button onClick={reset} className="mt-3 text-sm text-gray-400 hover:text-gray-600">
                  Reset & Start Over
                </button>
              </>
            )}
          </div>
        </div>

        {/* Info section */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { icon: '⚡', title: 'Instant Generation', desc: 'QR code is created instantly in your browser — no server, no wait.' },
            { icon: '🔒', title: '100% Private', desc: 'Your UPI ID and payment details never leave your device.' },
            { icon: '📱', title: 'Works with All UPI Apps', desc: 'Compatible with GPay, PhonePe, Paytm, BHIM, WhatsApp Pay, Amazon Pay and all NPCI-standard UPI apps.' },
          ].map(item => (
            <div key={item.title} className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="text-3xl mb-3">{item.icon}</div>
              <h3 className="font-bold text-gray-800 text-base mb-1">{item.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* SEO content */}
        <div className="mt-10 bg-white rounded-2xl border border-gray-200 p-8">
          <h2 className="text-2xl font-bold mb-4" style={{ color: '#0b1f33' }}>
            How to Use the UPI QR Code Generator
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-base text-gray-600 leading-relaxed">
            <div>
              <h3 className="font-bold text-gray-800 mb-2">Step-by-step guide</h3>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Select your preferred mode — UPI ID, Bank Account, or Mobile Number</li>
                <li>Enter your UPI ID (e.g. <code className="bg-gray-100 px-1 rounded">name@okaxis</code>) or account details</li>
                <li>Enter the Payee Name (your name or shop name)</li>
                <li>Optionally set a fixed amount or leave blank for open payment</li>
                <li>Click <strong>Generate QR Code</strong></li>
                <li>Download the PNG or print it to display at your shop</li>
              </ol>
            </div>
            <div>
              <h3 className="font-bold text-gray-800 mb-2">Popular use cases</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Small businesses and street vendors to accept payments</li>
                <li>Freelancers to share payment QR in invoices</li>
                <li>Students and individuals to receive money via WhatsApp</li>
                <li>Coaching centres and tutorial classes for fee collection</li>
                <li>Print on visiting cards or display at your counter</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
