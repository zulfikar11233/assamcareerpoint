'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'

interface ExamProfile {
  name: string
  minAge: number
  maxAge: { general: number; obc: number; sc: number; stp: number; sth: number; ews: number; pwd: number }
  cutoffNote: string
  category: string
}

const EXAMS: ExamProfile[] = [
  { name: 'ADRE / Assam Direct Recruitment (Grade III)', minAge: 18, maxAge: { general: 40, obc: 43, sc: 45, stp: 45, sth: 45, ews: 40, pwd: 50 }, cutoffNote: 'As per Assam Govt rules (Jan 1 of notification year)', category: 'Assam State' },
  { name: 'ADRE / Assam Direct Recruitment (Grade IV)', minAge: 18, maxAge: { general: 40, obc: 43, sc: 45, stp: 45, sth: 45, ews: 40, pwd: 50 }, cutoffNote: 'As per Assam Govt rules', category: 'Assam State' },
  { name: 'APSC Combined Competitive Exam (CCE)', minAge: 21, maxAge: { general: 38, obc: 41, sc: 43, stp: 43, sth: 43, ews: 38, pwd: 48 }, cutoffNote: 'As per APSC notification', category: 'Assam State' },
  { name: 'SLPRB – Assam Police SI', minAge: 20, maxAge: { general: 26, obc: 29, sc: 31, stp: 31, sth: 31, ews: 26, pwd: 36 }, cutoffNote: 'As per SLPRB notification', category: 'Assam State' },
  { name: 'SLPRB – Assam Police Constable', minAge: 18, maxAge: { general: 25, obc: 28, sc: 30, stp: 30, sth: 30, ews: 25, pwd: 35 }, cutoffNote: 'As per SLPRB notification', category: 'Assam State' },
  { name: 'SSC CGL (Staff Selection Commission)', minAge: 18, maxAge: { general: 32, obc: 35, sc: 37, stp: 37, sth: 37, ews: 32, pwd: 42 }, cutoffNote: '1st August of the exam year', category: 'Central Govt' },
  { name: 'SSC CHSL (10+2 Level)', minAge: 18, maxAge: { general: 27, obc: 30, sc: 32, stp: 32, sth: 32, ews: 27, pwd: 37 }, cutoffNote: '1st August of the exam year', category: 'Central Govt' },
  { name: 'SSC MTS (Multi-Tasking Staff)', minAge: 18, maxAge: { general: 25, obc: 28, sc: 30, stp: 30, sth: 30, ews: 25, pwd: 35 }, cutoffNote: '1st August of the exam year', category: 'Central Govt' },
  { name: 'SSC GD Constable', minAge: 18, maxAge: { general: 23, obc: 26, sc: 28, stp: 28, sth: 28, ews: 23, pwd: 33 }, cutoffNote: '1st August of the exam year', category: 'Central Govt' },
  { name: 'RRB NTPC (Railway)', minAge: 18, maxAge: { general: 33, obc: 36, sc: 38, stp: 38, sth: 38, ews: 33, pwd: 43 }, cutoffNote: 'As per RRB notification', category: 'Railway' },
  { name: 'RRB Group D (Railway)', minAge: 18, maxAge: { general: 33, obc: 36, sc: 38, stp: 38, sth: 38, ews: 33, pwd: 43 }, cutoffNote: 'As per RRB notification', category: 'Railway' },
  { name: 'IBPS PO / Clerk (Bank)', minAge: 20, maxAge: { general: 30, obc: 33, sc: 35, stp: 35, sth: 35, ews: 30, pwd: 40 }, cutoffNote: 'As per IBPS notification', category: 'Banking' },
  { name: 'SBI PO / Clerk', minAge: 20, maxAge: { general: 30, obc: 33, sc: 35, stp: 35, sth: 35, ews: 30, pwd: 40 }, cutoffNote: 'As per SBI notification', category: 'Banking' },
  { name: 'UPSC Civil Services (IAS/IPS)', minAge: 21, maxAge: { general: 32, obc: 35, sc: 37, stp: 37, sth: 37, ews: 32, pwd: 42 }, cutoffNote: '1st August of the exam year', category: 'UPSC' },
]

const CATEGORY_LABELS: Record<string, string> = {
  general: 'General / Unreserved',
  ews: 'EWS',
  obc: 'OBC / MOBC',
  sc: 'Schedule Caste (SC)',
  stp: 'Schedule Tribe (ST-P)',
  sth: 'Schedule Tribe (ST-H)',
  pwd: 'PwD (Persons with Disability)',
}

function calcAge(dob: Date, ref: Date) {
  let years = ref.getFullYear() - dob.getFullYear()
  let months = ref.getMonth() - dob.getMonth()
  let days = ref.getDate() - dob.getDate()
  if (days < 0) { months--; days += new Date(ref.getFullYear(), ref.getMonth(), 0).getDate() }
  if (months < 0) { years--; months += 12 }
  return { years, months, days }
}

const CATEGORY_GROUPS = ['Assam State', 'Central Govt', 'Railway', 'Banking', 'UPSC']

export default function AgeCalculatorClient() {
  const [dob, setDob] = useState('')
  const [refDate, setRefDate] = useState(new Date().toISOString().split('T')[0])
  const [category, setCategory] = useState<keyof ExamProfile['maxAge']>('general')
  const [mode, setMode] = useState<'basic' | 'exam'>('basic')
  const [selectedGroup, setSelectedGroup] = useState('Assam State')

  const dobDate = dob ? new Date(dob) : null
  const refDateObj = refDate ? new Date(refDate) : new Date()

  const age = useMemo(() => {
    if (!dobDate) return null
    return calcAge(dobDate, refDateObj)
  }, [dob, refDate])

  const totalDays = useMemo(() => {
    if (!dobDate) return 0
    return Math.floor((refDateObj.getTime() - dobDate.getTime()) / (1000 * 60 * 60 * 24))
  }, [dob, refDate])

  const nextBirthday = useMemo(() => {
    if (!dobDate) return null
    const today = new Date()
    let next = new Date(today.getFullYear(), dobDate.getMonth(), dobDate.getDate())
    if (next <= today) next.setFullYear(next.getFullYear() + 1)
    const diff = Math.floor((next.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    return diff
  }, [dob])

  const eligibleExams = useMemo(() => {
    if (!age) return []
    return EXAMS.filter(e => e.category === selectedGroup).map(e => {
      const max = e.maxAge[category]
      const ageYears = age.years + (age.months > 0 || age.days > 0 ? 0 : 0)
      const eligible = ageYears >= e.minAge && ageYears <= max
      const yearsLeft = max - ageYears
      return { ...e, eligible, maxForCat: max, yearsLeft }
    })
  }, [age, category, selectedGroup])

  const inputClass = 'w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition bg-white'
  const labelClass = 'block text-sm font-semibold text-gray-700 mb-1.5'

  const zodiac = (d: Date) => {
    const m = d.getMonth() + 1, day = d.getDate()
    if ((m === 3 && day >= 21) || (m === 4 && day <= 19)) return '♈ Aries'
    if ((m === 4 && day >= 20) || (m === 5 && day <= 20)) return '♉ Taurus'
    if ((m === 5 && day >= 21) || (m === 6 && day <= 20)) return '♊ Gemini'
    if ((m === 6 && day >= 21) || (m === 7 && day <= 22)) return '♋ Cancer'
    if ((m === 7 && day >= 23) || (m === 8 && day <= 22)) return '♌ Leo'
    if ((m === 8 && day >= 23) || (m === 9 && day <= 22)) return '♍ Virgo'
    if ((m === 9 && day >= 23) || (m === 10 && day <= 22)) return '♎ Libra'
    if ((m === 10 && day >= 23) || (m === 11 && day <= 21)) return '♏ Scorpio'
    if ((m === 11 && day >= 22) || (m === 12 && day <= 21)) return '♐ Sagittarius'
    if ((m === 12 && day >= 22) || (m === 1 && day <= 19)) return '♑ Capricorn'
    if ((m === 1 && day >= 20) || (m === 2 && day <= 18)) return '♒ Aquarius'
    return '♓ Pisces'
  }

  const dayOfWeek = dobDate ? dobDate.toLocaleDateString('en-IN', { weekday: 'long' }) : ''

  return (
    <main className="min-h-screen bg-gray-50">
      <div style={{ background: 'linear-gradient(135deg, #0b1f33 0%, #1a3a5c 100%)' }} className="py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <Link href="/tools" className="text-sm text-gray-400 hover:text-white mb-3 inline-block">← Back to Tools</Link>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Age Calculator</h1>
          <p className="text-gray-300 text-lg">Calculate your exact age and check eligibility for ADRE, APSC, SSC, Railway, Bank and other government exams with OBC/SC/ST age relaxation.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10">

        {/* Mode toggle */}
        <div className="flex gap-2 bg-white border border-gray-200 rounded-2xl p-1.5 mb-7 w-fit shadow-sm">
          {(['basic', 'exam'] as const).map(m => (
            <button key={m} onClick={() => setMode(m)} className={`px-5 py-2.5 text-sm font-bold rounded-xl transition-all capitalize ${mode === m ? 'text-white' : 'text-gray-500'}`} style={mode === m ? { background: '#1dbfad' } : {}}>
              {m === 'basic' ? '🧮 Basic Age' : '📋 Exam Eligibility'}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* LEFT: Input */}
          <div className="space-y-5">
            <div className="bg-white rounded-2xl border border-gray-200 p-7 shadow-sm">
              <div className="space-y-5">
                <div>
                  <label className={labelClass}>Date of Birth *</label>
                  <input className={inputClass} type="date" value={dob} onChange={e => setDob(e.target.value)} max={new Date().toISOString().split('T')[0]} />
                </div>
                <div>
                  <label className={labelClass}>Calculate Age As On (Reference Date)</label>
                  <input className={inputClass} type="date" value={refDate} onChange={e => setRefDate(e.target.value)} />
                  <p className="text-xs text-gray-400 mt-1">For exam eligibility, enter the cut-off date mentioned in the official notification</p>
                </div>
                {mode === 'exam' && (
                  <div>
                    <label className={labelClass}>Your Category</label>
                    <select className={inputClass} value={category} onChange={e => setCategory(e.target.value as any)}>
                      {Object.entries(CATEGORY_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* Quick reference */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-3 text-sm">Common Cut-Off Dates</h3>
              <div className="space-y-2 text-sm">
                {[
                  ['ADRE / Assam Govt', 'January 1 of notification year'],
                  ['SSC CGL/CHSL/MTS', 'August 1 of exam year'],
                  ['UPSC Civil Services', 'August 1 of exam year'],
                  ['IBPS / Bank exams', 'Date mentioned in notification'],
                  ['Railway RRB', 'Date mentioned in notification'],
                ].map(([exam, note]) => (
                  <div key={exam} className="flex justify-between items-start gap-2">
                    <span className="text-gray-600">{exam}</span>
                    <span className="text-xs font-semibold text-right flex-shrink-0" style={{ color: '#1dbfad' }}>{note}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: Result */}
          <div className="space-y-5">
            {!age ? (
              <div className="bg-white rounded-2xl border border-gray-200 p-10 shadow-sm flex flex-col items-center justify-center text-center">
                <div className="text-6xl opacity-20 mb-4">🎂</div>
                <p className="text-gray-400">Enter your date of birth to calculate your age</p>
              </div>
            ) : (
              <>
                {/* Main age display */}
                <div className="bg-white rounded-2xl border border-gray-200 p-7 shadow-sm text-center">
                  <p className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wide">Your Age As On {new Date(refDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                  <div className="flex justify-center gap-6 mb-5">
                    {[
                      { val: age.years, label: 'Years' },
                      { val: age.months, label: 'Months' },
                      { val: age.days, label: 'Days' },
                    ].map(({ val, label }) => (
                      <div key={label} className="text-center">
                        <div className="text-5xl font-bold" style={{ color: '#0b1f33' }}>{val}</div>
                        <div className="text-sm text-gray-500 mt-1">{label}</div>
                      </div>
                    ))}
                  </div>
                  <div className="text-sm text-gray-500">= {totalDays.toLocaleString()} total days</div>
                </div>

                {/* Extra fun stats */}
                <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
                  <h3 className="font-bold text-gray-800 mb-4">More Details</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {[
                      { label: 'Total Weeks', val: Math.floor(totalDays / 7).toLocaleString() },
                      { label: 'Total Hours', val: (totalDays * 24).toLocaleString() },
                      { label: 'Day of Birth', val: dayOfWeek },
                      { label: 'Zodiac Sign', val: zodiac(dobDate!) },
                      { label: 'Days to Birthday', val: nextBirthday === 0 ? '🎉 Today!' : `${nextBirthday} days` },
                    ].map(({ label, val }) => (
                      <div key={label} className="bg-gray-50 rounded-xl p-3">
                        <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                        <p className="font-bold text-gray-800">{val}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Exam eligibility table */}
        {mode === 'exam' && age && (
          <div className="mt-8 bg-white rounded-2xl border border-gray-200 p-7 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <h2 className="text-xl font-bold" style={{ color: '#0b1f33' }}>Exam Eligibility Check</h2>
              <div className="flex flex-wrap gap-2">
                {CATEGORY_GROUPS.map(g => (
                  <button key={g} onClick={() => setSelectedGroup(g)} className={`text-sm font-semibold px-4 py-2 rounded-xl border transition-all ${selectedGroup === g ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                    {g}
                  </button>
                ))}
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-4">Based on: Age {age.years} years {age.months} months · Category: <strong>{CATEGORY_LABELS[category]}</strong> · Reference date: {new Date(refDate).toLocaleDateString('en-IN')}</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-3 font-bold text-gray-700">Exam / Post</th>
                    <th className="text-center py-3 px-3 font-bold text-gray-700">Min Age</th>
                    <th className="text-center py-3 px-3 font-bold text-gray-700">Max Age ({CATEGORY_LABELS[category].split(' ')[0]})</th>
                    <th className="text-center py-3 px-3 font-bold text-gray-700">Years Left</th>
                    <th className="text-center py-3 px-3 font-bold text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {eligibleExams.map((exam, i) => (
                    <tr key={exam.name} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="py-3 px-3 font-medium text-gray-800">{exam.name}</td>
                      <td className="py-3 px-3 text-center text-gray-600">{exam.minAge}</td>
                      <td className="py-3 px-3 text-center text-gray-600">{exam.maxForCat}</td>
                      <td className="py-3 px-3 text-center">
                        {exam.eligible ? (
                          <span className="font-bold text-green-600">{exam.yearsLeft} yr{exam.yearsLeft !== 1 ? 's' : ''}</span>
                        ) : age.years < exam.minAge ? (
                          <span className="text-blue-500">Too young</span>
                        ) : (
                          <span className="text-red-400">—</span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-center">
                        {age.years < exam.minAge ? (
                          <span className="inline-block text-xs font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-600">Too Young</span>
                        ) : exam.eligible ? (
                          <span className="inline-block text-xs font-bold px-2.5 py-1 rounded-full bg-green-50 text-green-600">✓ Eligible</span>
                        ) : (
                          <span className="inline-block text-xs font-bold px-2.5 py-1 rounded-full bg-red-50 text-red-500">✗ Over Age</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-400 mt-3">⚠ Always verify exact age limits from the official notification before applying. Age relaxations may vary per notification.</p>
          </div>
        )}

        {/* SEO content */}
        <div className="mt-8 bg-white rounded-2xl border border-gray-200 p-8">
          <h2 className="text-2xl font-bold mb-5" style={{ color: '#0b1f33' }}>Age Relaxation Rules for Assam Government Jobs</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-bold text-gray-700">Category</th>
                  <th className="text-center py-3 px-4 font-bold text-gray-700">Relaxation</th>
                  <th className="text-left py-3 px-4 font-bold text-gray-700">General Upper Limit</th>
                  <th className="text-left py-3 px-4 font-bold text-gray-700">After Relaxation</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { cat: 'General / Unreserved', rel: '—', gen: '40 years', after: '40 years' },
                  { cat: 'EWS', rel: '—', gen: '40 years', after: '40 years' },
                  { cat: 'OBC / MOBC', rel: '+3 years', gen: '40 years', after: '43 years' },
                  { cat: 'Schedule Caste (SC)', rel: '+5 years', gen: '40 years', after: '45 years' },
                  { cat: 'Schedule Tribe (ST-P / ST-H)', rel: '+5 years', gen: '40 years', after: '45 years' },
                  { cat: 'PwD (all categories)', rel: '+10 years', gen: '40 years', after: '50 years' },
                ].map((row, i) => (
                  <tr key={row.cat} className={i % 2 === 0 ? 'bg-gray-50' : ''}>
                    <td className="py-3 px-4 font-medium text-gray-800">{row.cat}</td>
                    <td className="py-3 px-4 text-center font-bold" style={{ color: '#1dbfad' }}>{row.rel}</td>
                    <td className="py-3 px-4 text-gray-600">{row.gen}</td>
                    <td className="py-3 px-4 font-semibold text-gray-800">{row.after}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 mt-3">* Above table is for Assam state government direct recruitment. Central govt and other exam limits may differ.</p>
        </div>
      </div>
    </main>
  )
}
