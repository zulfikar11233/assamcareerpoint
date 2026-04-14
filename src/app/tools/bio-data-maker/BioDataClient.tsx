'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import { C, S, ToolsNavbar, ToolHeader } from '../_shared'

interface Edu { id: string; exam: string; board: string; year: string; pct: string; div: string }
interface OQ  { id: string; name: string; inst: string; year: string; score: string }
interface Exp { id: string; org: string; post: string; from: string; to: string; nature: string }
interface Ref { id: string; name: string; desig: string; org: string; contact: string }

const mkEdu = (): Edu => ({ id: crypto.randomUUID(), exam: '', board: '', year: '', pct: '', div: '' })
const mkOQ  = (): OQ  => ({ id: crypto.randomUUID(), name: '', inst: '', year: '', score: '' })
const mkExp = (): Exp => ({ id: crypto.randomUUID(), org: '', post: '', from: '', to: '', nature: '' })
const mkRef = (): Ref => ({ id: crypto.randomUUID(), name: '', desig: '', org: '', contact: '' })

const STEPS = ['Personal', 'Education', 'Experience', 'References', 'Preview & Download']
const DISTRICTS = ['Baksa','Barpeta','Biswanath','Bongaigaon','Cachar','Charaideo','Chirang','Darrang','Dhemaji','Dhubri','Dibrugarh','Dima Hasao','Goalpara','Golaghat','Hailakandi','Hojai','Jorhat','Kamrup','Kamrup Metropolitan','Karbi Anglong','Karimganj','Kokrajhar','Lakhimpur','Majuli','Morigaon','Nagaon','Nalbari','Sivasagar','Sonitpur','South Salmara-Mankachar','Tinsukia','Udalguri','West Karbi Anglong']

// ✅ FIX: FormField defined OUTSIDE the component — prevents re-mount on every keystroke
function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={S.label}>{label}</label>
      {children}
    </div>
  )
}

function SectionBar({ title }: { title: string }) {
  return (
    <div style={{ background: C.navy, color: C.white, padding: '8px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: 700, margin: '20px 0 12px', letterSpacing: '0.04em' }}>
      {title}
    </div>
  )
}

const gr2: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: '14px' }

export default function BioDataClient() {
  const [step, setStep]         = useState(0)
  const [photo, setPhoto]       = useState('')
  const [name, setName]         = useState('')
  const [father, setFather]     = useState('')
  const [mother, setMother]     = useState('')
  const [dob, setDob]           = useState('')
  const [gender, setGender]     = useState('')
  const [religion, setReligion] = useState('')
  const [bloodGroup, setBG]     = useState('')
  const [marital, setMarital]   = useState('')
  const [mobile, setMobile]     = useState('')
  const [email, setEmail]       = useState('')
  const [address, setAddress]   = useState('')
  const [district, setDistrict] = useState('')
  const [pin, setPin]           = useState('')
  const [category, setCategory] = useState('')
  const [empExch, setEmpExch]   = useState('')
  const [prc, setPrc]           = useState('')
  const [languages, setLang]    = useState('')
  const [computer, setComp]     = useState('')
  const [ncc, setNcc]           = useState('')
  const [sports, setSports]     = useState('')
  const [education, setEdu]     = useState<Edu[]>([mkEdu()])
  const [otherQ, setOtherQ]     = useState<OQ[]>([mkOQ()])
  const [exps, setExps]         = useState<Exp[]>([])
  const [refs, setRefs]         = useState<Ref[]>([mkRef(), mkRef()])
  const [downloading, setDl]    = useState(false)
  const previewRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const s = localStorage.getItem('acpi_bd')
    if (s) {
      try {
        const d = JSON.parse(s)
        if (d.name) setName(d.name)
        if (d.father) setFather(d.father)
        if (d.mobile) setMobile(d.mobile)
        if (d.education?.length) setEdu(d.education)
      } catch {}
    }
  }, [])

  const save = () => localStorage.setItem('acpi_bd', JSON.stringify({ name, father, mobile, education }))

  const calcAge = () => {
    if (!dob) return ''
    const b = new Date(dob), n = new Date()
    let a = n.getFullYear() - b.getFullYear()
    if (n.getMonth() < b.getMonth() || (n.getMonth() === b.getMonth() && n.getDate() < b.getDate())) a--
    return a > 0 ? `${a} years` : ''
  }

  const downloadPdf = async () => {
    if (!previewRef.current) return
    setDl(true)
    try {
      const h2c = (await import('html2canvas')).default
      const { jsPDF } = await import('jspdf')
      const canvas = await h2c(previewRef.current, { scale: 2, useCORS: true, backgroundColor: '#fff' })
      const imgData = canvas.toDataURL('image/jpeg', 0.95)
      const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' })
      const pw = pdf.internal.pageSize.getWidth()
      const ph = (canvas.height * pw) / canvas.width
      if (ph > 297) {
        let y = 0
        while (y < ph) { if (y > 0) pdf.addPage(); pdf.addImage(imgData, 'JPEG', 0, -y, pw, ph); y += 297 }
      } else {
        pdf.addImage(imgData, 'JPEG', 0, 0, pw, ph)
      }
      pdf.save(`biodata-${name.replace(/\s+/g, '-').toLowerCase() || 'candidate'}.pdf`)
    } catch { alert('PDF download failed. Please try again.') }
    setDl(false)
  }

  // ✅ Edu field updaters — stable references prevent re-render issues
  const updEdu = useCallback((id: string, field: keyof Edu, val: string) =>
    setEdu(prev => prev.map(x => x.id === id ? { ...x, [field]: val } : x)), [])
  const updOQ = useCallback((id: string, field: keyof OQ, val: string) =>
    setOtherQ(prev => prev.map(x => x.id === id ? { ...x, [field]: val } : x)), [])
  const updExp = useCallback((id: string, field: keyof Exp, val: string) =>
    setExps(prev => prev.map(x => x.id === id ? { ...x, [field]: val } : x)), [])
  const updRef = useCallback((id: string, field: keyof Ref, val: string) =>
    setRefs(prev => prev.map(x => x.id === id ? { ...x, [field]: val } : x)), [])

  const addBtn = (label: string, onClick: () => void) => (
    <button onClick={onClick} style={{ padding: '10px 20px', border: `2px dashed ${C.teal}`, borderRadius: '11px', background: 'transparent', color: C.teal2, fontSize: '14px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>{label}</button>
  )

  const removeBtn = (onClick: () => void) => (
    <button onClick={onClick} style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Remove</button>
  )

  return (
    <main style={S.page}>
      <ToolsNavbar />
      <ToolHeader
        title="Bio-Data / Resume Maker"
        desc="Government-format bio-data with Assam-specific fields — Employment Exchange No., PRC, District. Download as PDF instantly. Auto-saved in browser. Free, private, no login."
      />

      <div style={S.wrap}>
        {/* Steps */}
        <div style={{ display: 'flex', overflowX: 'auto', gap: '4px', marginBottom: '24px', paddingBottom: '4px' }}>
          {STEPS.map((s, i) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '3px', flexShrink: 0 }}>
              <button
                onClick={() => setStep(i)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '7px', padding: '9px 13px', borderRadius: '11px',
                  border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: '13px', fontWeight: 700,
                  background: step === i ? C.teal : i < step ? '#e6faf8' : C.white,
                  color: step === i ? C.white : i < step ? C.teal2 : C.gray400,
                  boxShadow: step === i ? '0 2px 8px rgba(29,191,173,0.3)' : '0 1px 4px rgba(0,0,0,0.06)',
                }}
              >
                <span style={{
                  width: '22px', height: '22px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 800, flexShrink: 0,
                  background: step === i ? 'rgba(255,255,255,0.25)' : i < step ? C.teal : C.gray200,
                  color: step === i ? C.white : i < step ? C.white : C.gray500,
                }}>{i < step ? '✓' : i + 1}</span>
                <span style={{ display: 'block' }}>{s}</span>
              </button>
              {i < STEPS.length - 1 && <span style={{ color: C.gray200, fontSize: '16px' }}>›</span>}
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 270px', gap: '20px', alignItems: 'start' }}>
          <div>

            {/* ── STEP 0: Personal ── */}
            {step === 0 && (
              <div style={S.card}>
                <h2 style={S.cardTitle}>Personal Details</h2>

                <div style={{ display: 'flex', gap: '18px', flexWrap: 'wrap', marginBottom: '18px' }}>
                  <div>
                    <label style={S.label}>Passport Photo</label>
                    <div
                      onClick={() => document.getElementById('phu')?.click()}
                      style={{ width: '88px', height: '106px', border: `2px dashed ${C.gray200}`, borderRadius: '11px', overflow: 'hidden', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', background: C.gray50 }}
                    >
                      {photo ? <img src={photo} alt="Photo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: '32px', opacity: 0.25 }}>👤</span>}
                    </div>
                    <input id="phu" type="file" accept="image/*" style={{ display: 'none' }} onChange={e => {
                      const f = e.target.files?.[0]; if (!f) return
                      const r = new FileReader(); r.onload = ev => setPhoto(ev.target?.result as string); r.readAsDataURL(f)
                    }} />
                    <p style={S.hint}>Click to upload</p>
                  </div>
                  <div style={{ flex: 1, minWidth: '180px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <FormField label="Full Name *">
                      <input style={S.input} value={name} onChange={e => setName(e.target.value)} placeholder="As per documents" />
                    </FormField>
                    <div style={gr2}>
                      <FormField label="Date of Birth *">
                        <input style={S.input} type="date" value={dob} onChange={e => setDob(e.target.value)} />
                      </FormField>
                      <FormField label="Gender *">
                        <select style={S.select} value={gender} onChange={e => setGender(e.target.value)}>
                          <option value="">Select</option>
                          <option>Male</option><option>Female</option><option>Transgender</option>
                        </select>
                      </FormField>
                    </div>
                  </div>
                </div>

                <div style={gr2}>
                  <FormField label="Father's Name *"><input style={S.input} value={father} onChange={e => setFather(e.target.value)} placeholder="Father's full name" /></FormField>
                  <FormField label="Mother's Name"><input style={S.input} value={mother} onChange={e => setMother(e.target.value)} placeholder="Mother's full name" /></FormField>
                  <FormField label="Mobile Number *"><input style={S.input} value={mobile} onChange={e => setMobile(e.target.value)} placeholder="10-digit mobile" /></FormField>
                  <FormField label="Email Address"><input style={S.input} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" /></FormField>
                  <FormField label="Marital Status">
                    <select style={S.select} value={marital} onChange={e => setMarital(e.target.value)}>
                      <option value="">Select</option>
                      <option>Unmarried</option><option>Married</option><option>Widowed</option><option>Divorced</option>
                    </select>
                  </FormField>
                  <FormField label="Blood Group">
                    <select style={S.select} value={bloodGroup} onChange={e => setBG(e.target.value)}>
                      <option value="">Select</option>
                      {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(g => <option key={g}>{g}</option>)}
                    </select>
                  </FormField>
                  <FormField label="Religion">
                    <select style={S.select} value={religion} onChange={e => setReligion(e.target.value)}>
                      <option value="">Select</option>
                      {['Hindu', 'Muslim', 'Christian', 'Sikh', 'Buddhist', 'Jain', 'Others'].map(r => <option key={r}>{r}</option>)}
                    </select>
                  </FormField>
                  <FormField label="Category *">
                    <select style={S.select} value={category} onChange={e => setCategory(e.target.value)}>
                      <option value="">Select</option>
                      <option>General/Unreserved</option><option>OBC / MOBC</option>
                      <option>Schedule Caste (SC)</option><option>Schedule Tribe (ST-H)</option>
                      <option>Schedule Tribe (ST-P)</option><option>EWS</option>
                    </select>
                  </FormField>
                </div>

                <div style={{ marginTop: '18px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <FormField label="Permanent Address *">
                    <textarea style={{ ...S.textarea, minHeight: '65px' }} value={address} onChange={e => setAddress(e.target.value)} placeholder="Village/Town, Post Office, District, State" />
                  </FormField>
                  <div style={gr2}>
                    <FormField label="District *">
                      <select style={S.select} value={district} onChange={e => setDistrict(e.target.value)}>
                        <option value="">Select District</option>
                        {DISTRICTS.map(d => <option key={d}>{d}</option>)}
                        <option>Other State</option>
                      </select>
                    </FormField>
                    <FormField label="PIN Code">
                      <input style={S.input} value={pin} onChange={e => setPin(e.target.value)} placeholder="6-digit PIN" maxLength={6} />
                    </FormField>
                  </div>
                </div>

                <div style={{ marginTop: '18px', padding: '18px', background: C.gray50, borderRadius: '12px', border: `1px solid ${C.gray200}` }}>
                  <p style={{ margin: '0 0 14px', fontSize: '15px', fontWeight: 800, color: C.navy }}>Assam-Specific Fields</p>
                  <div style={gr2}>
                    <FormField label="Employment Exchange Reg. No.">
                      <input style={S.input} value={empExch} onChange={e => setEmpExch(e.target.value)} placeholder="e.g. KMR/12345/2020" />
                      <p style={S.hint}>Required for most Assam state govt jobs</p>
                    </FormField>
                    <FormField label="PRC No. / Certificate No.">
                      <input style={S.input} value={prc} onChange={e => setPrc(e.target.value)} placeholder="Permanent Resident Certificate No." />
                    </FormField>
                    <FormField label="Languages Known">
                      <input style={S.input} value={languages} onChange={e => setLang(e.target.value)} placeholder="e.g. Assamese, English, Hindi" />
                    </FormField>
                    <FormField label="Computer Knowledge">
                      <input style={S.input} value={computer} onChange={e => setComp(e.target.value)} placeholder="e.g. MS Office, Tally" />
                    </FormField>
                    <FormField label="NCC / NSS">
                      <input style={S.input} value={ncc} onChange={e => setNcc(e.target.value)} placeholder="e.g. NCC B Certificate" />
                    </FormField>
                    <FormField label="Sports / Games">
                      <input style={S.input} value={sports} onChange={e => setSports(e.target.value)} placeholder="e.g. Football (District Level)" />
                    </FormField>
                  </div>
                </div>
              </div>
            )}

            {/* ── STEP 1: Education ── */}
            {step === 1 && (
              <div style={S.card}>
                <h2 style={S.cardTitle}>Educational Qualifications</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {education.map((e, i) => (
                    <div key={e.id} style={{ border: `1px solid ${C.gray200}`, borderRadius: '12px', padding: '18px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px' }}>
                        <span style={{ fontSize: '13px', fontWeight: 700, color: C.gray400 }}>Qualification {i + 1}</span>
                        {education.length > 1 && removeBtn(() => setEdu(p => p.filter(x => x.id !== e.id)))}
                      </div>
                      <div style={gr2}>
                        <FormField label="Exam / Degree *">
                          <input style={S.input} value={e.exam} onChange={ev => updEdu(e.id, 'exam', ev.target.value)} placeholder="e.g. HSLC, HS, B.A." />
                        </FormField>
                        <FormField label="Board / University *">
                          <input style={S.input} value={e.board} onChange={ev => updEdu(e.id, 'board', ev.target.value)} placeholder="e.g. SEBA, AHSEC, GU" />
                        </FormField>
                        <FormField label="Passing Year">
                          <input style={S.input} value={e.year} onChange={ev => updEdu(e.id, 'year', ev.target.value)} placeholder="e.g. 2022" />
                        </FormField>
                        <FormField label="Percentage / CGPA">
                          <input style={S.input} value={e.pct} onChange={ev => updEdu(e.id, 'pct', ev.target.value)} placeholder="e.g. 75% or 8.5 CGPA" />
                        </FormField>
                        <FormField label="Division / Grade">
                          <select style={S.select} value={e.div} onChange={ev => updEdu(e.id, 'div', ev.target.value)}>
                            <option value="">Select</option>
                            <option>1st Division</option><option>2nd Division</option><option>3rd Division</option><option>Distinction</option><option>Pass</option>
                          </select>
                        </FormField>
                      </div>
                    </div>
                  ))}
                  {addBtn('+ Add More Education', () => setEdu(p => [...p, mkEdu()]))}
                </div>

                <h3 style={{ fontSize: '16px', fontWeight: 700, color: C.navy, margin: '24px 0 14px' }}>Other Qualifications & Certifications</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {otherQ.map((q, i) => (
                    <div key={q.id} style={{ border: `1px solid ${C.gray200}`, borderRadius: '12px', padding: '18px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px' }}>
                        <span style={{ fontSize: '13px', fontWeight: 700, color: C.gray400 }}>Qualification {i + 1}</span>
                        {otherQ.length > 1 && removeBtn(() => setOtherQ(p => p.filter(x => x.id !== q.id)))}
                      </div>
                      <div style={gr2}>
                        <FormField label="Qualification Name"><input style={S.input} value={q.name} onChange={e => updOQ(q.id, 'name', e.target.value)} placeholder="e.g. DCA, Tally, Typing" /></FormField>
                        <FormField label="Institute"><input style={S.input} value={q.inst} onChange={e => updOQ(q.id, 'inst', e.target.value)} placeholder="Institution name" /></FormField>
                        <FormField label="Year"><input style={S.input} value={q.year} onChange={e => updOQ(q.id, 'year', e.target.value)} placeholder="Passing year" /></FormField>
                        <FormField label="Score / Grade"><input style={S.input} value={q.score} onChange={e => updOQ(q.id, 'score', e.target.value)} placeholder="Score or grade" /></FormField>
                      </div>
                    </div>
                  ))}
                  {addBtn('+ Add More', () => setOtherQ(p => [...p, mkOQ()]))}
                </div>
              </div>
            )}

            {/* ── STEP 2: Experience ── */}
            {step === 2 && (
              <div style={S.card}>
                <h2 style={S.cardTitle}>Work Experience <span style={{ fontSize: '13px', fontWeight: 500, color: C.gray400 }}>(if any)</span></h2>
                {exps.length === 0 && <p style={{ color: C.gray400, fontStyle: 'italic', fontSize: '14px', marginBottom: '14px' }}>No experience added yet.</p>}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {exps.map((e, i) => (
                    <div key={e.id} style={{ border: `1px solid ${C.gray200}`, borderRadius: '12px', padding: '18px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px' }}>
                        <span style={{ fontSize: '13px', fontWeight: 700, color: C.gray400 }}>Experience {i + 1}</span>
                        {removeBtn(() => setExps(p => p.filter(x => x.id !== e.id)))}
                      </div>
                      <div style={gr2}>
                        <FormField label="Organization"><input style={S.input} value={e.org} onChange={ev => updExp(e.id, 'org', ev.target.value)} placeholder="Organization name" /></FormField>
                        <FormField label="Post / Designation"><input style={S.input} value={e.post} onChange={ev => updExp(e.id, 'post', ev.target.value)} placeholder="Your designation" /></FormField>
                        <FormField label="From"><input style={S.input} type="month" value={e.from} onChange={ev => updExp(e.id, 'from', ev.target.value)} /></FormField>
                        <FormField label="To"><input style={S.input} type="month" value={e.to} onChange={ev => updExp(e.id, 'to', ev.target.value)} /></FormField>
                        <div style={{ gridColumn: '1 / -1' }}>
                          <FormField label="Nature of Work"><input style={S.input} value={e.nature} onChange={ev => updExp(e.id, 'nature', ev.target.value)} placeholder="Brief description of duties" /></FormField>
                        </div>
                      </div>
                    </div>
                  ))}
                  {addBtn('+ Add Experience', () => setExps(p => [...p, mkExp()]))}
                </div>
              </div>
            )}

            {/* ── STEP 3: References ── */}
            {step === 3 && (
              <div style={S.card}>
                <h2 style={S.cardTitle}>References</h2>
                <p style={{ color: C.gray500, fontSize: '14px', marginBottom: '16px' }}>Provide 2 persons who know you professionally.</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {refs.map((r, i) => (
                    <div key={r.id} style={{ border: `1px solid ${C.gray200}`, borderRadius: '12px', padding: '18px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px' }}>
                        <span style={{ fontSize: '13px', fontWeight: 700, color: C.gray400 }}>Reference {i + 1}</span>
                        {refs.length > 1 && removeBtn(() => setRefs(p => p.filter(x => x.id !== r.id)))}
                      </div>
                      <div style={gr2}>
                        <FormField label="Name"><input style={S.input} value={r.name} onChange={e => updRef(r.id, 'name', e.target.value)} placeholder="Reference person's name" /></FormField>
                        <FormField label="Designation"><input style={S.input} value={r.desig} onChange={e => updRef(r.id, 'desig', e.target.value)} placeholder="Their designation" /></FormField>
                        <FormField label="Organization"><input style={S.input} value={r.org} onChange={e => updRef(r.id, 'org', e.target.value)} placeholder="Their organization" /></FormField>
                        <FormField label="Contact Number"><input style={S.input} value={r.contact} onChange={e => updRef(r.id, 'contact', e.target.value)} placeholder="Their mobile number" /></FormField>
                      </div>
                    </div>
                  ))}
                  {addBtn('+ Add Reference', () => setRefs(p => [...p, mkRef()]))}
                </div>
                <div style={{ marginTop: '18px' }}>
                  <button onClick={save} style={{ ...S.btnOutline, fontSize: '14px' }}>💾 Save Progress to Browser</button>
                </div>
              </div>
            )}

            {/* ── STEP 4: Preview ── */}
            {step === 4 && (
              <div>
                <div style={{ ...S.card, display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', gap: '14px', flexWrap: 'wrap' }}>
                  <div>
                    <p style={{ margin: '0 0 3px', fontSize: '17px', fontWeight: 800, color: C.navy }}>Ready to Download</p>
                    <p style={{ margin: 0, fontSize: '13px', color: C.gray500 }}>Review the preview and click Download PDF</p>
                  </div>
                  <button onClick={downloadPdf} disabled={downloading} style={{ ...S.btnGold, width: 'auto', padding: '14px 28px', fontSize: '15px', opacity: downloading ? 0.6 : 1 }}>
                    {downloading ? '⏳ Preparing...' : '⬇ Download PDF'}
                  </button>
                </div>

                {/* A4 preview */}
                <div ref={previewRef} style={{ fontFamily: 'Georgia, serif', background: '#fff', padding: '32px', fontSize: '13px', color: '#000', lineHeight: '1.6', border: '1px solid #ccc' }}>
                  <div style={{ borderBottom: '3px double #000', paddingBottom: '14px', marginBottom: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <h1 style={{ fontSize: '20px', fontWeight: 'bold', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '3px', margin: '0 0 3px' }}>BIO-DATA</h1>
                      <p style={{ textAlign: 'center', fontSize: '11px', color: '#555', margin: 0 }}>Generated by Assam Career Point — assamcareerpoint-info.com</p>
                    </div>
                    {photo && <div style={{ width: '76px', height: '92px', border: '1px solid #999', marginLeft: '14px', flexShrink: 0, overflow: 'hidden' }}><img src={photo} alt="Photo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>}
                  </div>

                  <SectionBar title="PERSONAL DETAILS" />
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <tbody>
                      {[
                        ['Name', name],
                        ["Father's Name", father],
                        ["Mother's Name", mother],
                        ['Date of Birth', dob ? `${new Date(dob).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })} (Age: ${calcAge()})` : ''],
                        ['Gender', gender], ['Religion', religion], ['Blood Group', bloodGroup],
                        ['Marital Status', marital], ['Category', category],
                        ['Mobile', mobile], ['Email', email],
                        ['Permanent Address', address + (district ? `, ${district} District` : '') + (pin ? ` – ${pin}` : '')],
                        ['Emp. Exchange Reg. No.', empExch], ['PRC No.', prc],
                        ['Languages Known', languages], ['Computer Knowledge', computer],
                        ['NCC / NSS', ncc], ['Sports / Games', sports],
                      ].filter(([, v]) => v).map(([k, v], i) => (
                        <tr key={k as string} style={{ background: i % 2 === 0 ? '#f9f9f9' : '#fff' }}>
                          <td style={{ padding: '4px 10px', width: '38%', fontWeight: 'bold', fontSize: '12px', borderBottom: '0.5px solid #e0e0e0' }}>{k}</td>
                          <td style={{ padding: '4px 10px', fontSize: '12px', borderBottom: '0.5px solid #e0e0e0' }}>: {v}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <SectionBar title="EDUCATIONAL QUALIFICATIONS" />
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                    <thead><tr style={{ background: '#e8edf2' }}>{['Exam/Degree', 'Board/University', 'Year', 'Percentage', 'Division'].map(h => <th key={h} style={{ padding: '5px 8px', textAlign: 'left', border: '0.5px solid #ccc' }}>{h}</th>)}</tr></thead>
                    <tbody>{education.filter(e => e.exam).map((e, i) => <tr key={e.id} style={{ background: i % 2 === 0 ? '#fff' : '#f9f9f9' }}><td style={{ padding: '4px 8px', border: '0.5px solid #ddd' }}>{e.exam}</td><td style={{ padding: '4px 8px', border: '0.5px solid #ddd' }}>{e.board}</td><td style={{ padding: '4px 8px', border: '0.5px solid #ddd', textAlign: 'center' }}>{e.year}</td><td style={{ padding: '4px 8px', border: '0.5px solid #ddd', textAlign: 'center' }}>{e.pct}</td><td style={{ padding: '4px 8px', border: '0.5px solid #ddd', textAlign: 'center' }}>{e.div}</td></tr>)}</tbody>
                  </table>

                  {otherQ.filter(q => q.name).length > 0 && (<>
                    <SectionBar title="OTHER QUALIFICATIONS" />
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                      <thead><tr style={{ background: '#e8edf2' }}>{['Qualification', 'Institute', 'Year', 'Score'].map(h => <th key={h} style={{ padding: '5px 8px', textAlign: 'left', border: '0.5px solid #ccc' }}>{h}</th>)}</tr></thead>
                      <tbody>{otherQ.filter(q => q.name).map((q, i) => <tr key={q.id} style={{ background: i % 2 === 0 ? '#fff' : '#f9f9f9' }}><td style={{ padding: '4px 8px', border: '0.5px solid #ddd' }}>{q.name}</td><td style={{ padding: '4px 8px', border: '0.5px solid #ddd' }}>{q.inst}</td><td style={{ padding: '4px 8px', border: '0.5px solid #ddd', textAlign: 'center' }}>{q.year}</td><td style={{ padding: '4px 8px', border: '0.5px solid #ddd', textAlign: 'center' }}>{q.score}</td></tr>)}</tbody>
                    </table>
                  </>)}

                  {exps.filter(e => e.org).length > 0 && (<>
                    <SectionBar title="WORK EXPERIENCE" />
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                      <thead><tr style={{ background: '#e8edf2' }}>{['Organization', 'Post', 'Period', 'Nature of Work'].map(h => <th key={h} style={{ padding: '5px 8px', textAlign: 'left', border: '0.5px solid #ccc' }}>{h}</th>)}</tr></thead>
                      <tbody>{exps.filter(e => e.org).map((e, i) => <tr key={e.id} style={{ background: i % 2 === 0 ? '#fff' : '#f9f9f9' }}><td style={{ padding: '4px 8px', border: '0.5px solid #ddd' }}>{e.org}</td><td style={{ padding: '4px 8px', border: '0.5px solid #ddd' }}>{e.post}</td><td style={{ padding: '4px 8px', border: '0.5px solid #ddd' }}>{e.from}{e.from && e.to ? ' – ' : ''}{e.to}</td><td style={{ padding: '4px 8px', border: '0.5px solid #ddd' }}>{e.nature}</td></tr>)}</tbody>
                    </table>
                  </>)}

                  {refs.filter(r => r.name).length > 0 && (<>
                    <SectionBar title="REFERENCES" />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                      {refs.filter(r => r.name).map(r => (
                        <div key={r.id} style={{ border: '0.5px solid #ddd', padding: '8px', fontSize: '12px' }}>
                          <p style={{ fontWeight: 'bold', margin: '0 0 2px' }}>{r.name}</p>
                          <p style={{ color: '#444', margin: '0 0 1px' }}>{r.desig}</p>
                          <p style={{ color: '#444', margin: '0 0 1px' }}>{r.org}</p>
                          <p style={{ color: '#666', margin: 0 }}>📞 {r.contact}</p>
                        </div>
                      ))}
                    </div>
                  </>)}

                  <div style={{ marginTop: '18px', borderTop: '1px solid #ccc', paddingTop: '12px' }}>
                    <p style={{ fontSize: '11px', fontStyle: 'italic', marginBottom: '24px' }}>I hereby declare that all the information given above is true, correct and complete to the best of my knowledge and belief.</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <div><p style={{ fontSize: '12px' }}>Date: _______________</p><p style={{ fontSize: '12px' }}>Place: _______________</p></div>
                      <div style={{ textAlign: 'right' }}><p style={{ fontSize: '12px', marginBottom: '26px' }}>Signature</p><p style={{ fontSize: '12px', fontWeight: 'bold' }}>{name}</p></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Nav buttons */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '18px' }}>
              {step > 0 && <button onClick={() => setStep(s => s - 1)} style={{ ...S.btnOutline, flex: 1, fontSize: '15px', padding: '15px' }}>← Previous</button>}
              {step < STEPS.length - 1 && <button onClick={() => setStep(s => s + 1)} style={{ ...S.btnPrimary, flex: 1, fontSize: '15px', padding: '15px' }}>Next →</button>}
            </div>
          </div>

          {/* Sidebar tips */}
          <div style={{ ...S.card, position: 'sticky', top: '80px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 800, color: C.navy, margin: '0 0 14px' }}>Tips for Bio-Data</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                'Use your name exactly as on HSLC certificate',
                'Employment Exchange Reg. No. is mandatory for Assam state jobs',
                'PRC is required for reserved category candidates',
                'Upload a passport-size photo with white/blue background',
                'List education from latest to earliest',
                'Data auto-saves — safe to close and return later',
              ].map((tip, i) => (
                <div key={i} style={{ display: 'flex', gap: '7px', fontSize: '13px', color: C.gray600, lineHeight: 1.5 }}>
                  <span style={{ color: C.teal, flexShrink: 0, fontWeight: 700 }}>✓</span>
                  <span>{tip}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: '14px', padding: '12px', background: C.gray50, borderRadius: '10px', border: `1px solid ${C.gray200}` }}>
              <p style={{ fontSize: '12px', color: C.gray400, margin: 0 }}>🔒 All data stays in your browser. Nothing is sent to any server.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
