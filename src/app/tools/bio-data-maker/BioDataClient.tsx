'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

interface Education {
  id: string; exam: string; board: string; year: string; percentage: string; division: string
}
interface OtherQual {
  id: string; name: string; institute: string; year: string; score: string; duration: string
}
interface Experience {
  id: string; org: string; post: string; from: string; to: string; nature: string
}
interface Reference {
  id: string; name: string; designation: string; org: string; contact: string
}

const STEPS = ['Personal', 'Education', 'Experience', 'References', 'Preview & Download']

const mkEdu = (): Education => ({ id: crypto.randomUUID(), exam: '', board: '', year: '', percentage: '', division: '' })
const mkOtherQual = (): OtherQual => ({ id: crypto.randomUUID(), name: '', institute: '', year: '', score: '', duration: '' })
const mkExp = (): Experience => ({ id: crypto.randomUUID(), org: '', post: '', from: '', to: '', nature: '' })
const mkRef = (): Reference => ({ id: crypto.randomUUID(), name: '', designation: '', org: '', contact: '' })

export default function BioDataClient() {
  const [step, setStep] = useState(0)
  const [template, setTemplate] = useState<'govt' | 'modern'>('govt')
  const [photo, setPhoto] = useState('')
  const [name, setName] = useState('')
  const [father, setFather] = useState('')
  const [mother, setMother] = useState('')
  const [dob, setDob] = useState('')
  const [gender, setGender] = useState('')
  const [nationality, setNationality] = useState('Indian')
  const [religion, setReligion] = useState('')
  const [bloodGroup, setBloodGroup] = useState('')
  const [marital, setMarital] = useState('')
  const [mobile, setMobile] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [district, setDistrict] = useState('')
  const [pin, setPin] = useState('')
  const [category, setCategory] = useState('')
  const [empExchNo, setEmpExchNo] = useState('')
  const [prcNo, setPrcNo] = useState('')
  const [nccNss, setNccNss] = useState('')
  const [sports, setSports] = useState('')
  const [computer, setComputer] = useState('')
  const [languages, setLanguages] = useState('')
  const [education, setEducation] = useState<Education[]>([mkEdu()])
  const [otherQual, setOtherQual] = useState<OtherQual[]>([mkOtherQual()])
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [references, setReferences] = useState<Reference[]>([mkRef(), mkRef()])
  const [downloading, setDownloading] = useState(false)
  const previewRef = useRef<HTMLDivElement>(null)

  // Save to localStorage
  useEffect(() => {
    const saved = localStorage.getItem('acpi_biodata')
    if (saved) {
      try {
        const d = JSON.parse(saved)
        if (d.name) setName(d.name)
        if (d.father) setFather(d.father)
        if (d.mother) setMother(d.mother)
        if (d.dob) setDob(d.dob)
        if (d.gender) setGender(d.gender)
        if (d.mobile) setMobile(d.mobile)
        if (d.email) setEmail(d.email)
        if (d.address) setAddress(d.address)
        if (d.district) setDistrict(d.district)
        if (d.category) setCategory(d.category)
        if (d.empExchNo) setEmpExchNo(d.empExchNo)
        if (d.education?.length) setEducation(d.education)
      } catch {}
    }
  }, [])

  const save = () => {
    localStorage.setItem('acpi_biodata', JSON.stringify({ name, father, mother, dob, gender, mobile, email, address, district, category, empExchNo, education }))
  }

  const calcAge = () => {
    if (!dob) return ''
    const b = new Date(dob), now = new Date()
    let age = now.getFullYear() - b.getFullYear()
    if (now.getMonth() < b.getMonth() || (now.getMonth() === b.getMonth() && now.getDate() < b.getDate())) age--
    return age > 0 ? `${age} years` : ''
  }

  const downloadPdf = async () => {
    if (!previewRef.current) return
    setDownloading(true)
    try {
      const html2canvas = (await import('html2canvas')).default
      const { jsPDF } = await import('jspdf')
      const canvas = await html2canvas(previewRef.current, { scale: 2, useCORS: true, backgroundColor: '#ffffff' })
      const imgData = canvas.toDataURL('image/jpeg', 0.95)
      const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' })
      const pdfW = pdf.internal.pageSize.getWidth()
      const pdfH = (canvas.height * pdfW) / canvas.width
      if (pdfH > 297) {
        // Multi-page handling
        const pageH = 297
        let y = 0
        while (y < pdfH) {
          if (y > 0) pdf.addPage()
          pdf.addImage(imgData, 'JPEG', 0, -y, pdfW, pdfH)
          y += pageH
        }
      } else {
        pdf.addImage(imgData, 'JPEG', 0, 0, pdfW, pdfH)
      }
      pdf.save(`biodata-${name.replace(/\s+/g, '-').toLowerCase() || 'candidate'}.pdf`)
    } catch {
      alert('PDF download failed. Please try again.')
    }
    setDownloading(false)
  }

  const inputClass = 'w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition bg-white'
  const labelClass = 'block text-sm font-semibold text-gray-700 mb-1.5'
  const secTitle = (t: string) => (
    <h3 className="text-base font-bold mb-4 pb-2 border-b border-gray-200" style={{ color: '#0b1f33' }}>{t}</h3>
  )

  const ASSAM_DISTRICTS = [
    'Baksa', 'Barpeta', 'Biswanath', 'Bongaigaon', 'Cachar', 'Charaideo', 'Chirang', 'Darrang',
    'Dhemaji', 'Dhubri', 'Dibrugarh', 'Dima Hasao', 'Goalpara', 'Golaghat', 'Hailakandi',
    'Hojai', 'Jorhat', 'Kamrup', 'Kamrup Metropolitan', 'Karbi Anglong', 'Karimganj',
    'Kokrajhar', 'Lakhimpur', 'Majuli', 'Morigaon', 'Nagaon', 'Nalbari', 'Sivasagar',
    'Sonitpur', 'South Salmara-Mankachar', 'Tinsukia', 'Udalguri', 'West Karbi Anglong'
  ]

  return (
    <main className="min-h-screen bg-gray-50">
      <div style={{ background: 'linear-gradient(135deg, #0b1f33 0%, #1a3a5c 100%)' }} className="py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <Link href="/tools" className="text-sm text-gray-400 hover:text-white mb-3 inline-block">← Back to Tools</Link>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Bio-Data / Resume Maker</h1>
          <p className="text-gray-300 text-lg">Government-format bio-data with Assam-specific fields. Fill the form, preview and download as PDF — free, private, no login needed.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">

        {/* Step Progress */}
        <div className="flex items-center mb-8 overflow-x-auto gap-1 pb-2">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-1 flex-shrink-0">
              <button
                onClick={() => setStep(i)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition-all ${step === i ? 'text-white' : 'text-gray-500 hover:text-gray-700'}`}
                style={step === i ? { background: '#1dbfad' } : {}}
              >
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${step === i ? 'bg-white text-teal-600' : i < step ? 'bg-teal-100 text-teal-600' : 'bg-gray-200 text-gray-500'}`}>{i < step ? '✓' : i + 1}</span>
                <span className="hidden sm:inline">{s}</span>
              </button>
              {i < STEPS.length - 1 && <span className="text-gray-300">→</span>}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2">

            {/* STEP 0: Personal */}
            {step === 0 && (
              <div className="bg-white rounded-2xl border border-gray-200 p-7 shadow-sm space-y-6">
                {secTitle('Personal Details')}

                {/* Photo */}
                <div className="flex items-start gap-5">
                  <div>
                    <label className={labelClass}>Passport Photo</label>
                    <div
                      onClick={() => document.getElementById('photo-upload')?.click()}
                      className="w-24 h-28 border-2 border-dashed border-gray-300 rounded-xl overflow-hidden cursor-pointer hover:border-teal-400 flex items-center justify-center bg-gray-50"
                    >
                      {photo ? <img src={photo} alt="Photo" className="w-full h-full object-cover" /> : <span className="text-3xl opacity-30">👤</span>}
                    </div>
                    <input id="photo-upload" type="file" accept="image/*" className="hidden" onChange={e => {
                      const f = e.target.files?.[0]; if (!f) return
                      const r = new FileReader(); r.onload = ev => setPhoto(ev.target?.result as string); r.readAsDataURL(f)
                    }} />
                    <p className="text-xs text-gray-400 mt-1">Click to upload</p>
                  </div>
                  <div className="flex-1 space-y-4">
                    <div>
                      <label className={labelClass}>Full Name *</label>
                      <input className={inputClass} value={name} onChange={e => setName(e.target.value)} placeholder="Your full name (as per documents)" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>Date of Birth *</label>
                        <input className={inputClass} type="date" value={dob} onChange={e => setDob(e.target.value)} />
                      </div>
                      <div>
                        <label className={labelClass}>Gender *</label>
                        <select className={inputClass} value={gender} onChange={e => setGender(e.target.value)}>
                          <option value="">Select</option>
                          <option>Male</option><option>Female</option><option>Transgender</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label className={labelClass}>Father's Name *</label><input className={inputClass} value={father} onChange={e => setFather(e.target.value)} placeholder="Father's full name" /></div>
                  <div><label className={labelClass}>Mother's Name</label><input className={inputClass} value={mother} onChange={e => setMother(e.target.value)} placeholder="Mother's full name" /></div>
                  <div><label className={labelClass}>Mobile Number *</label><input className={inputClass} value={mobile} onChange={e => setMobile(e.target.value)} placeholder="10-digit mobile" /></div>
                  <div><label className={labelClass}>Email Address</label><input className={inputClass} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" /></div>
                  <div>
                    <label className={labelClass}>Marital Status</label>
                    <select className={inputClass} value={marital} onChange={e => setMarital(e.target.value)}>
                      <option value="">Select</option>
                      <option>Unmarried</option><option>Married</option><option>Widowed</option><option>Divorced</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Blood Group</label>
                    <select className={inputClass} value={bloodGroup} onChange={e => setBloodGroup(e.target.value)}>
                      <option value="">Select</option>
                      {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(g => <option key={g}>{g}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Religion</label>
                    <select className={inputClass} value={religion} onChange={e => setReligion(e.target.value)}>
                      <option value="">Select</option>
                      {['Hindu', 'Muslim', 'Christian', 'Sikh', 'Buddhist', 'Jain', 'Others'].map(r => <option key={r}>{r}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Category *</label>
                    <select className={inputClass} value={category} onChange={e => setCategory(e.target.value)}>
                      <option value="">Select</option>
                      <option>General/Unreserved</option>
                      <option>OBC / MOBC</option>
                      <option>Schedule Caste (SC)</option>
                      <option>Schedule Tribe (ST-H)</option>
                      <option>Schedule Tribe (ST-P)</option>
                      <option>EWS</option>
                    </select>
                  </div>
                </div>

                {secTitle('Address')}
                <div className="space-y-4">
                  <div>
                    <label className={labelClass}>Permanent Address *</label>
                    <textarea className={inputClass} rows={2} value={address} onChange={e => setAddress(e.target.value)} placeholder="Village/Town, Post Office, District, State" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>District *</label>
                      <select className={inputClass} value={district} onChange={e => setDistrict(e.target.value)}>
                        <option value="">Select District</option>
                        {ASSAM_DISTRICTS.map(d => <option key={d}>{d}</option>)}
                        <option>Other State</option>
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>PIN Code</label>
                      <input className={inputClass} value={pin} onChange={e => setPin(e.target.value)} placeholder="6-digit PIN" maxLength={6} />
                    </div>
                  </div>
                </div>

                {secTitle('Assam-Specific Fields')}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Employment Exchange Reg. No.</label>
                    <input className={inputClass} value={empExchNo} onChange={e => setEmpExchNo(e.target.value)} placeholder="e.g. KMR/12345/2020" />
                    <p className="text-xs text-gray-400 mt-1">Required for most Assam state jobs</p>
                  </div>
                  <div>
                    <label className={labelClass}>PRC No. / Certificate No.</label>
                    <input className={inputClass} value={prcNo} onChange={e => setPrcNo(e.target.value)} placeholder="Permanent Resident Certificate No." />
                  </div>
                </div>

                {secTitle('Additional Information')}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Known Languages</label>
                    <input className={inputClass} value={languages} onChange={e => setLanguages(e.target.value)} placeholder="e.g. Assamese, English, Hindi" />
                  </div>
                  <div>
                    <label className={labelClass}>Computer Knowledge</label>
                    <input className={inputClass} value={computer} onChange={e => setComputer(e.target.value)} placeholder="e.g. MS Office, Tally, DTP" />
                  </div>
                  <div>
                    <label className={labelClass}>NCC / NSS</label>
                    <input className={inputClass} value={nccNss} onChange={e => setNccNss(e.target.value)} placeholder="e.g. NCC B Certificate" />
                  </div>
                  <div>
                    <label className={labelClass}>Sports / Games</label>
                    <input className={inputClass} value={sports} onChange={e => setSports(e.target.value)} placeholder="e.g. Football (District Level)" />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 1: Education */}
            {step === 1 && (
              <div className="bg-white rounded-2xl border border-gray-200 p-7 shadow-sm space-y-6">
                {secTitle('Educational Qualifications')}
                {education.map((edu, i) => (
                  <div key={edu.id} className="border border-gray-200 rounded-xl p-5 relative">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-sm font-bold text-gray-500">Qualification {i + 1}</span>
                      {education.length > 1 && <button onClick={() => setEducation(prev => prev.filter(e => e.id !== edu.id))} className="text-red-400 text-sm hover:text-red-600">Remove</button>}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>Exam / Degree *</label>
                        <input className={inputClass} value={edu.exam} onChange={e => setEducation(prev => prev.map(x => x.id === edu.id ? { ...x, exam: e.target.value } : x))} placeholder="e.g. HSLC, HS, B.A., B.Sc." />
                      </div>
                      <div>
                        <label className={labelClass}>Board / University *</label>
                        <input className={inputClass} value={edu.board} onChange={e => setEducation(prev => prev.map(x => x.id === edu.id ? { ...x, board: e.target.value } : x))} placeholder="e.g. SEBA, AHSEC, GU" />
                      </div>
                      <div>
                        <label className={labelClass}>Passing Year</label>
                        <input className={inputClass} value={edu.year} onChange={e => setEducation(prev => prev.map(x => x.id === edu.id ? { ...x, year: e.target.value } : x))} placeholder="e.g. 2022" />
                      </div>
                      <div>
                        <label className={labelClass}>Percentage / CGPA</label>
                        <input className={inputClass} value={edu.percentage} onChange={e => setEducation(prev => prev.map(x => x.id === edu.id ? { ...x, percentage: e.target.value } : x))} placeholder="e.g. 75% or 8.5 CGPA" />
                      </div>
                      <div>
                        <label className={labelClass}>Division / Grade</label>
                        <select className={inputClass} value={edu.division} onChange={e => setEducation(prev => prev.map(x => x.id === edu.id ? { ...x, division: e.target.value } : x))}>
                          <option value="">Select</option>
                          <option>1st Division</option><option>2nd Division</option><option>3rd Division</option>
                          <option>Distinction</option><option>Pass</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
                <button onClick={() => setEducation(prev => [...prev, mkEdu()])} className="text-sm font-semibold py-2.5 px-5 border-2 border-dashed border-teal-300 text-teal-600 rounded-xl hover:bg-teal-50 transition-all">
                  + Add More Education
                </button>

                {secTitle('Other Qualifications & Certifications')}
                {otherQual.map((q, i) => (
                  <div key={q.id} className="border border-gray-200 rounded-xl p-5">
                    <div className="flex justify-between mb-4">
                      <span className="text-sm font-bold text-gray-500">Qualification {i + 1}</span>
                      {otherQual.length > 1 && <button onClick={() => setOtherQual(prev => prev.filter(x => x.id !== q.id))} className="text-red-400 text-sm">Remove</button>}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div><label className={labelClass}>Qualification Name</label><input className={inputClass} value={q.name} onChange={e => setOtherQual(prev => prev.map(x => x.id === q.id ? { ...x, name: e.target.value } : x))} placeholder="e.g. DCA, Tally, Typing" /></div>
                      <div><label className={labelClass}>Institute / Organization</label><input className={inputClass} value={q.institute} onChange={e => setOtherQual(prev => prev.map(x => x.id === q.id ? { ...x, institute: e.target.value } : x))} placeholder="Institution name" /></div>
                      <div><label className={labelClass}>Year</label><input className={inputClass} value={q.year} onChange={e => setOtherQual(prev => prev.map(x => x.id === q.id ? { ...x, year: e.target.value } : x))} placeholder="Passing year" /></div>
                      <div><label className={labelClass}>Score / Grade</label><input className={inputClass} value={q.score} onChange={e => setOtherQual(prev => prev.map(x => x.id === q.id ? { ...x, score: e.target.value } : x))} placeholder="Score or grade" /></div>
                    </div>
                  </div>
                ))}
                <button onClick={() => setOtherQual(prev => [...prev, mkOtherQual()])} className="text-sm font-semibold py-2.5 px-5 border-2 border-dashed border-teal-300 text-teal-600 rounded-xl hover:bg-teal-50 transition-all">
                  + Add More
                </button>
              </div>
            )}

            {/* STEP 2: Experience */}
            {step === 2 && (
              <div className="bg-white rounded-2xl border border-gray-200 p-7 shadow-sm space-y-6">
                {secTitle('Work Experience (if any)')}
                {experiences.length === 0 && (
                  <p className="text-sm text-gray-400 italic">No experience added. Click below to add.</p>
                )}
                {experiences.map((exp, i) => (
                  <div key={exp.id} className="border border-gray-200 rounded-xl p-5">
                    <div className="flex justify-between mb-4">
                      <span className="text-sm font-bold text-gray-500">Experience {i + 1}</span>
                      <button onClick={() => setExperiences(prev => prev.filter(x => x.id !== exp.id))} className="text-red-400 text-sm">Remove</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div><label className={labelClass}>Organization</label><input className={inputClass} value={exp.org} onChange={e => setExperiences(prev => prev.map(x => x.id === exp.id ? { ...x, org: e.target.value } : x))} placeholder="Organization name" /></div>
                      <div><label className={labelClass}>Post / Designation</label><input className={inputClass} value={exp.post} onChange={e => setExperiences(prev => prev.map(x => x.id === exp.id ? { ...x, post: e.target.value } : x))} placeholder="Your designation" /></div>
                      <div><label className={labelClass}>From</label><input className={inputClass} type="month" value={exp.from} onChange={e => setExperiences(prev => prev.map(x => x.id === exp.id ? { ...x, from: e.target.value } : x))} /></div>
                      <div><label className={labelClass}>To</label><input className={inputClass} type="month" value={exp.to} onChange={e => setExperiences(prev => prev.map(x => x.id === exp.id ? { ...x, to: e.target.value } : x))} /></div>
                      <div className="md:col-span-2"><label className={labelClass}>Nature of Work</label><input className={inputClass} value={exp.nature} onChange={e => setExperiences(prev => prev.map(x => x.id === exp.id ? { ...x, nature: e.target.value } : x))} placeholder="Brief description of duties" /></div>
                    </div>
                  </div>
                ))}
                <button onClick={() => setExperiences(prev => [...prev, mkExp()])} className="text-sm font-semibold py-2.5 px-5 border-2 border-dashed border-teal-300 text-teal-600 rounded-xl hover:bg-teal-50 transition-all">
                  + Add Experience
                </button>
              </div>
            )}

            {/* STEP 3: References */}
            {step === 3 && (
              <div className="bg-white rounded-2xl border border-gray-200 p-7 shadow-sm space-y-6">
                {secTitle('References (2 persons who know you professionally)')}
                {references.map((ref, i) => (
                  <div key={ref.id} className="border border-gray-200 rounded-xl p-5">
                    <div className="flex justify-between mb-4">
                      <span className="text-sm font-bold text-gray-500">Reference {i + 1}</span>
                      {references.length > 1 && <button onClick={() => setReferences(prev => prev.filter(x => x.id !== ref.id))} className="text-red-400 text-sm">Remove</button>}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div><label className={labelClass}>Name</label><input className={inputClass} value={ref.name} onChange={e => setReferences(prev => prev.map(x => x.id === ref.id ? { ...x, name: e.target.value } : x))} placeholder="Reference person's name" /></div>
                      <div><label className={labelClass}>Designation</label><input className={inputClass} value={ref.designation} onChange={e => setReferences(prev => prev.map(x => x.id === ref.id ? { ...x, designation: e.target.value } : x))} placeholder="Their post/designation" /></div>
                      <div><label className={labelClass}>Organization</label><input className={inputClass} value={ref.org} onChange={e => setReferences(prev => prev.map(x => x.id === ref.id ? { ...x, org: e.target.value } : x))} placeholder="Their organization" /></div>
                      <div><label className={labelClass}>Contact Number</label><input className={inputClass} value={ref.contact} onChange={e => setReferences(prev => prev.map(x => x.id === ref.id ? { ...x, contact: e.target.value } : x))} placeholder="Their mobile number" /></div>
                    </div>
                  </div>
                ))}
                <button onClick={() => setReferences(prev => [...prev, mkRef()])} className="text-sm font-semibold py-2.5 px-5 border-2 border-dashed border-teal-300 text-teal-600 rounded-xl hover:bg-teal-50 transition-all">
                  + Add Reference
                </button>
                <div className="mt-2">
                  <button onClick={save} className="text-sm text-gray-500 hover:text-gray-700 border border-gray-300 px-4 py-2 rounded-xl">
                    💾 Save Progress to Browser
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: Preview */}
            {step === 4 && (
              <div className="space-y-5">
                <div className="bg-white rounded-2xl border border-gray-200 p-5 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-gray-800">Ready to Download</p>
                    <p className="text-sm text-gray-500">Review the preview and click Download PDF</p>
                  </div>
                  <button
                    onClick={downloadPdf}
                    disabled={downloading}
                    className="py-3 px-6 rounded-xl font-bold text-base transition-all hover:opacity-90 disabled:opacity-50"
                    style={{ background: '#c9a227', color: '#fff' }}
                  >
                    {downloading ? '⏳ Preparing...' : '⬇ Download PDF'}
                  </button>
                </div>

                {/* Bio-data preview */}
                <div ref={previewRef} style={{ fontFamily: 'serif', background: '#fff', padding: '32px', fontSize: '13px', color: '#000', lineHeight: '1.6', border: '1px solid #ccc', maxWidth: '794px' }}>
                  {/* Header */}
                  <div style={{ borderBottom: '3px double #000', paddingBottom: '16px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <h1 style={{ fontSize: '22px', fontWeight: 'bold', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '4px' }}>
                        BIO-DATA
                      </h1>
                      <p style={{ textAlign: 'center', fontSize: '11px', color: '#555' }}>Generated by Assam Career Point — assamcareerpoint-info.com</p>
                    </div>
                    {photo && (
                      <div style={{ width: '80px', height: '96px', border: '1px solid #999', marginLeft: '16px', flexShrink: 0, overflow: 'hidden' }}>
                        <img src={photo} alt="Photo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    )}
                  </div>

                  {/* Personal */}
                  <section style={{ marginBottom: '16px' }}>
                    <h2 style={{ fontSize: '13px', fontWeight: 'bold', background: '#0b1f33', color: '#fff', padding: '4px 10px', marginBottom: '8px' }}>PERSONAL DETAILS</h2>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <tbody>
                        {[
                          ['Name', name],
                          ['Father\'s Name', father],
                          ['Mother\'s Name', mother],
                          ['Date of Birth', dob ? `${new Date(dob).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })} (Age: ${calcAge()})` : ''],
                          ['Gender', gender],
                          ['Nationality', nationality],
                          ['Religion', religion],
                          ['Blood Group', bloodGroup],
                          ['Marital Status', marital],
                          ['Category', category],
                          ['Mobile', mobile],
                          ['Email', email],
                          ['Permanent Address', address + (district ? `, ${district} District` : '') + (pin ? ` – ${pin}` : '')],
                          ['Emp. Exchange Reg. No.', empExchNo],
                          ['PRC No.', prcNo],
                          ['Languages Known', languages],
                          ['Computer Knowledge', computer],
                          ['NCC / NSS', nccNss],
                          ['Sports / Games', sports],
                        ].filter(([, v]) => v).map(([k, v], i) => (
                          <tr key={k} style={{ background: i % 2 === 0 ? '#f9f9f9' : '#fff' }}>
                            <td style={{ padding: '4px 10px', width: '38%', fontWeight: 'bold', fontSize: '12px', borderBottom: '0.5px solid #e0e0e0' }}>{k}</td>
                            <td style={{ padding: '4px 10px', fontSize: '12px', borderBottom: '0.5px solid #e0e0e0' }}>: {v}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </section>

                  {/* Education */}
                  <section style={{ marginBottom: '16px' }}>
                    <h2 style={{ fontSize: '13px', fontWeight: 'bold', background: '#0b1f33', color: '#fff', padding: '4px 10px', marginBottom: '8px' }}>EDUCATIONAL QUALIFICATIONS</h2>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                      <thead>
                        <tr style={{ background: '#e8edf2' }}>
                          <th style={{ padding: '5px 8px', textAlign: 'left', border: '0.5px solid #ccc' }}>Exam/Degree</th>
                          <th style={{ padding: '5px 8px', textAlign: 'left', border: '0.5px solid #ccc' }}>Board/University</th>
                          <th style={{ padding: '5px 8px', textAlign: 'center', border: '0.5px solid #ccc' }}>Year</th>
                          <th style={{ padding: '5px 8px', textAlign: 'center', border: '0.5px solid #ccc' }}>Percentage</th>
                          <th style={{ padding: '5px 8px', textAlign: 'center', border: '0.5px solid #ccc' }}>Division</th>
                        </tr>
                      </thead>
                      <tbody>
                        {education.filter(e => e.exam).map((e, i) => (
                          <tr key={e.id} style={{ background: i % 2 === 0 ? '#fff' : '#f9f9f9' }}>
                            <td style={{ padding: '4px 8px', border: '0.5px solid #ddd' }}>{e.exam}</td>
                            <td style={{ padding: '4px 8px', border: '0.5px solid #ddd' }}>{e.board}</td>
                            <td style={{ padding: '4px 8px', border: '0.5px solid #ddd', textAlign: 'center' }}>{e.year}</td>
                            <td style={{ padding: '4px 8px', border: '0.5px solid #ddd', textAlign: 'center' }}>{e.percentage}</td>
                            <td style={{ padding: '4px 8px', border: '0.5px solid #ddd', textAlign: 'center' }}>{e.division}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </section>

                  {/* Other Quals */}
                  {otherQual.filter(q => q.name).length > 0 && (
                    <section style={{ marginBottom: '16px' }}>
                      <h2 style={{ fontSize: '13px', fontWeight: 'bold', background: '#0b1f33', color: '#fff', padding: '4px 10px', marginBottom: '8px' }}>OTHER QUALIFICATIONS</h2>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                        <thead>
                          <tr style={{ background: '#e8edf2' }}>
                            <th style={{ padding: '5px 8px', textAlign: 'left', border: '0.5px solid #ccc' }}>Qualification</th>
                            <th style={{ padding: '5px 8px', textAlign: 'left', border: '0.5px solid #ccc' }}>Institute</th>
                            <th style={{ padding: '5px 8px', textAlign: 'center', border: '0.5px solid #ccc' }}>Year</th>
                            <th style={{ padding: '5px 8px', textAlign: 'center', border: '0.5px solid #ccc' }}>Score</th>
                          </tr>
                        </thead>
                        <tbody>
                          {otherQual.filter(q => q.name).map((q, i) => (
                            <tr key={q.id} style={{ background: i % 2 === 0 ? '#fff' : '#f9f9f9' }}>
                              <td style={{ padding: '4px 8px', border: '0.5px solid #ddd' }}>{q.name}</td>
                              <td style={{ padding: '4px 8px', border: '0.5px solid #ddd' }}>{q.institute}</td>
                              <td style={{ padding: '4px 8px', border: '0.5px solid #ddd', textAlign: 'center' }}>{q.year}</td>
                              <td style={{ padding: '4px 8px', border: '0.5px solid #ddd', textAlign: 'center' }}>{q.score}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </section>
                  )}

                  {/* Experience */}
                  {experiences.filter(e => e.org).length > 0 && (
                    <section style={{ marginBottom: '16px' }}>
                      <h2 style={{ fontSize: '13px', fontWeight: 'bold', background: '#0b1f33', color: '#fff', padding: '4px 10px', marginBottom: '8px' }}>WORK EXPERIENCE</h2>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                        <thead>
                          <tr style={{ background: '#e8edf2' }}>
                            <th style={{ padding: '5px 8px', textAlign: 'left', border: '0.5px solid #ccc' }}>Organization</th>
                            <th style={{ padding: '5px 8px', textAlign: 'left', border: '0.5px solid #ccc' }}>Post</th>
                            <th style={{ padding: '5px 8px', textAlign: 'center', border: '0.5px solid #ccc' }}>Period</th>
                            <th style={{ padding: '5px 8px', textAlign: 'left', border: '0.5px solid #ccc' }}>Nature of Work</th>
                          </tr>
                        </thead>
                        <tbody>
                          {experiences.filter(e => e.org).map((e, i) => (
                            <tr key={e.id} style={{ background: i % 2 === 0 ? '#fff' : '#f9f9f9' }}>
                              <td style={{ padding: '4px 8px', border: '0.5px solid #ddd' }}>{e.org}</td>
                              <td style={{ padding: '4px 8px', border: '0.5px solid #ddd' }}>{e.post}</td>
                              <td style={{ padding: '4px 8px', border: '0.5px solid #ddd', textAlign: 'center' }}>{e.from}{e.from && e.to ? ' – ' : ''}{e.to}</td>
                              <td style={{ padding: '4px 8px', border: '0.5px solid #ddd' }}>{e.nature}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </section>
                  )}

                  {/* References */}
                  {references.filter(r => r.name).length > 0 && (
                    <section style={{ marginBottom: '16px' }}>
                      <h2 style={{ fontSize: '13px', fontWeight: 'bold', background: '#0b1f33', color: '#fff', padding: '4px 10px', marginBottom: '8px' }}>REFERENCES</h2>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        {references.filter(r => r.name).map(r => (
                          <div key={r.id} style={{ border: '0.5px solid #ddd', padding: '8px', fontSize: '12px' }}>
                            <p style={{ fontWeight: 'bold', marginBottom: '2px' }}>{r.name}</p>
                            <p style={{ color: '#444' }}>{r.designation}</p>
                            <p style={{ color: '#444' }}>{r.org}</p>
                            <p style={{ color: '#666' }}>📞 {r.contact}</p>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Declaration */}
                  <section style={{ marginTop: '20px', borderTop: '1px solid #ccc', paddingTop: '12px' }}>
                    <p style={{ fontSize: '12px', fontStyle: 'italic', marginBottom: '24px' }}>
                      I hereby declare that all the information given above is true, correct and complete to the best of my knowledge and belief. I understand that in case any information is found to be false or incorrect, my candidature shall be liable to be cancelled.
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <div>
                        <p style={{ fontSize: '12px' }}>Date: _______________</p>
                        <p style={{ fontSize: '12px' }}>Place: _______________</p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontSize: '12px', marginBottom: '32px' }}>Signature</p>
                        <p style={{ fontSize: '12px', fontWeight: 'bold' }}>{name}</p>
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex gap-3 mt-6">
              {step > 0 && (
                <button onClick={() => setStep(s => s - 1)} className="flex-1 py-3.5 rounded-xl font-bold text-base border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-all">
                  ← Previous
                </button>
              )}
              {step < STEPS.length - 1 && (
                <button onClick={() => setStep(s => s + 1)} className="flex-1 py-3.5 rounded-xl font-bold text-base transition-all hover:opacity-90" style={{ background: '#1dbfad', color: '#fff' }}>
                  Next →
                </button>
              )}
            </div>
          </div>

          {/* RIGHT: info card */}
          <div className="space-y-5">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm sticky top-6">
              <h3 className="font-bold text-gray-800 mb-4">Tips for Bio-Data</h3>
              <ul className="space-y-3 text-sm text-gray-600">
                {[
                  'Use your name exactly as it appears on your Madhyamik/HSLC certificate',
                  'Employment Exchange Registration Number is mandatory for most Assam state government jobs',
                  'PRC (Permanent Resident Certificate) is required for reserved category candidates',
                  'Upload a recent passport-size photo with white or light background',
                  'List education from latest to earliest (Graduation first, then HS, then HSLC)',
                  'Your data is saved locally — it will be available if you refresh the page',
                ].map((tip, i) => (
                  <li key={i} className="flex gap-2">
                    <span style={{ color: '#1dbfad' }}>✓</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-5 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-400">🔒 All data stays in your browser only. Nothing is sent to any server.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
