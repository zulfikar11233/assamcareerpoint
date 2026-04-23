'use client'
// src/app/salary-calculator/page.tsx
// ✅ Assam & Central Govt Salary Calculator
// ✅ Bilingual: English + Assamese
// ✅ SEO optimised with JSON-LD schema
// ✅ Mobile friendly, PageSpeed optimised
// ✅ All terms explained in simple language

import { useState, useCallback } from 'react'
import Head from 'next/head'

// ─── Types ────────────────────────────────────────────────────────────────────

type GovType = 'assam' | 'central'
type CityType = 'x' | 'y' | 'z'
type ActiveTab = 'calculator' | 'glossary' | 'contact'

interface SalaryInputs {
  govType: GovType
  payLevel: number
  basic: number
  gradePay: number
  daRate: number
  city: CityType
  ta: number
  ma: number
  special: number
  other: number
  npsRate: number
  gis: number
  ptax: number
  tds: number
  recovery: number
  otherDed: number
  mmlsay: number
}

interface SalaryResult {
  da: number
  hra: number
  gross: number
  nps: number
  totalDed: number
  net: number
  components: { label: string; labelAs: string; value: number; color: string }[]
}

// ─── Constants ────────────────────────────────────────────────────────────────

const PAY_LEVELS: Record<number, number> = {
  1: 18000, 2: 19900, 3: 21700, 4: 25500, 5: 29200,
  6: 35400, 7: 44900, 8: 47600, 9: 53100, 10: 56100,
  11: 67700, 12: 78800, 13: 123100, 14: 144200,
}

const HRA_PCT: Record<CityType, number> = { x: 0.27, y: 0.18, z: 0.09 }

const GLOSSARY_TERMS = [
  {
    term: 'Basic Pay',
    termAs: 'মূল দৰমহা',
    en: 'The foundation of your salary. All allowances and deductions are calculated based on this. Fixed as per Pay Level (1–14) in the 7th Pay Commission pay matrix.',
    as: 'দৰমহাৰ মূল ভিত্তি। সকলো ভাট্টা আৰু কৰ্তন ইয়াৰ ওপৰত নিৰ্ভৰ কৰে। 7th Pay Commission ৰ Pay Matrix অনুসৰি নিৰ্ধাৰিত।',
    color: '#1e40af',
  },
  {
    term: 'Grade Pay',
    termAs: 'গ্ৰেড পে',
    en: 'Used in pre-2016 (6th CPC) pay structure. Replaced by Pay Levels in 7th CPC. Still relevant in some Assam state categories.',
    as: '2016 ৰ আগৰ (6th CPC) পে কাঠামোত ব্যৱহাৰ হৈছিল। 7th CPC ত Pay Level-এ ইয়াক সলনি কৰিছে।',
    color: '#1e40af',
  },
  {
    term: 'DA — Dearness Allowance',
    termAs: 'মহার্ঘ ভাট্টা',
    en: 'Paid to offset inflation. Calculated as % of Basic Pay. Central DA revised twice a year (Jan & Jul). Currently ~55% for Central Govt employees.',
    as: 'মূল্যবৃদ্ধিৰ ক্ষতিপূৰণ হিচাপে দিয়া হয়। মূল দৰমহাৰ শতাংশ হিচাপে গণনা কৰা হয়। কেন্দ্ৰীয় DA বছৰত দুবাৰ সংশোধন হয়।',
    color: '#065f46',
  },
  {
    term: 'HRA — House Rent Allowance',
    termAs: 'গৃহ ভাড়া ভাট্টা',
    en: 'Given for rented accommodation. X cities (metros) = 27%, Y cities = 18%, Z towns = 9% of Basic Pay. Not paid if govt quarter is allotted.',
    as: 'ভাড়া ঘৰৰ খৰচৰ বাবে দিয়া হয়। X = 27%, Y = 18%, Z = 9%। চৰকাৰী বাসস্থান পালে HRA নাপায়।',
    color: '#065f46',
  },
  {
    term: 'TA — Transport Allowance',
    termAs: 'পৰিবহন ভাট্টা',
    en: 'For commuting to office. Fixed by Pay Level and city category. Ranges ₹1,350–₹7,200/month. Not given if free transport is provided.',
    as: 'কাৰ্যালয়লৈ যাতায়াতৰ বাবে দিয়া হয়। Pay Level আৰু চহৰ অনুযায়ী ₹1,350 ৰ পৰা ₹7,200 পৰ্যন্ত।',
    color: '#065f46',
  },
  {
    term: 'MA — Medical Allowance',
    termAs: 'চিকিৎসা ভাট্টা',
    en: 'Fixed monthly amount for medical expenses. Usually ₹500–₹1,000/month. CGHS members get cashless hospital treatment instead.',
    as: 'চিকিৎসা ব্যয়ৰ বাবে নিৰ্দিষ্ট মাহিলী পৰিমাণ। সাধাৰণতে ₹500–₹1,000। CGHS সদস্যসকলে নগদৰহিত চিকিৎসা পায়।',
    color: '#065f46',
  },
  {
    term: 'MMLSAY',
    termAs: 'মুখ্যমন্ত্ৰী লোকসেৱক আৰোগ্য যোজনা',
    en: 'Mukhya Mantri Loksevak Arogya Yojana — Assam govt health insurance for state employees. Small monthly deduction covers cashless treatment at empanelled hospitals.',
    as: 'অসম চৰকাৰী কৰ্মচাৰীৰ স্বাস্থ্য বীমা আঁচনি। সৰু মাহিলী কৰ্তনৰ বিনিময়ত নগদৰহিত চিকিৎসা সুবিধা।',
    color: '#7c3aed',
  },
  {
    term: 'NPS — National Pension System',
    termAs: 'ৰাষ্ট্ৰীয় পেনচন প্ৰণালী',
    en: 'Mandatory for govt employees who joined after 2004. Employee contributes 10% of (Basic+DA). Govt contributes 14% (Central) or 10% (Assam). Cannot withdraw until retirement.',
    as: '2004 ৰ পিছত যোগদান কৰা কৰ্মচাৰীৰ বাবে বাধ্যতামূলক। কৰ্মচাৰীয়ে 10% অৱদান দিয়ে। অৱসৰলৈকে উঠাব নোৱাৰি।',
    color: '#b45309',
  },
  {
    term: 'GIS / AGIS — Group Insurance Scheme',
    termAs: 'গোট বীমা আঁচনি',
    en: 'Small monthly premium for group life insurance. Assam uses AGIS. Group D ≈ ₹10, Group C ≈ ₹20–30, Group B/A ≈ ₹60–120. Family gets sum assured on death.',
    as: 'দলীয় জীৱন বীমাৰ বাবে সৰু মাহিলী প্ৰিমিয়াম। অসমত AGIS। মৃত্যুৰ ক্ষেত্ৰত পৰিয়ালে বীমা পায়।',
    color: '#b45309',
  },
  {
    term: 'P.Tax — Professional Tax',
    termAs: 'বৃত্তি কৰ',
    en: 'State tax on salaried employees. In Assam: ₹208/month for salary above ₹10,000. Maximum ₹2,500/year. Deductible under Section 16 of Income Tax Act.',
    as: 'ৰাজ্য চৰকাৰৰ কৰ। অসমত ₹10,000 ৰ ওপৰৰ দৰমহাত মাহে ₹208। আয়কৰৰ Section 16 ৰ অধীনত ছাড় পোৱা যায়।',
    color: '#b45309',
  },
  {
    term: 'Income Tax / TDS',
    termAs: 'আয়কৰ / TDS',
    en: 'Tax Deducted at Source. Based on annual income and tax slab. Standard deduction ₹50,000 available. HRA and NPS contributions reduce taxable income.',
    as: 'উৎসতে কৰ্তন কৰা আয়কৰ। বাৰ্ষিক আয় অনুযায়ী। ₹50,000 Standard Deduction পোৱা যায়।',
    color: '#b45309',
  },
  {
    term: 'Gross Salary',
    termAs: 'মুঠ দৰমহা',
    en: 'Total of ALL earnings BEFORE any deductions. = Basic + DA + HRA + TA + MA + all allowances. This is NOT your take-home pay.',
    as: 'সকলো কৰ্তনৰ আগত মুঠ দৰমহা। = মূল + DA + HRA + TA + MA + অন্যান্য ভাট্টা। এইটো হাতত পোৱা দৰমহা নহয়।',
    color: '#1e3a5f',
  },
  {
    term: 'Net Payable',
    termAs: 'হাতত পোৱা দৰমহা',
    en: 'Actual amount credited to your bank account. = Gross Salary − Total Deductions. Also called "In-hand Salary" or "Take-home Pay".',
    as: 'বেংক একাউণ্টত জমা হোৱা প্ৰকৃত পৰিমাণ। = মুঠ দৰমহা − মুঠ কৰ্তন। ইয়াকে "In-hand Salary" বা "Take-home Pay" বোলে।',
    color: '#1e3a5f',
  },
]

// ─── Helper Functions ─────────────────────────────────────────────────────────

function fmt(n: number): string {
  return '₹' + Math.round(n).toLocaleString('en-IN')
}

function toWords(n: number): string {
  n = Math.round(n)
  if (n >= 10000000) return (n / 10000000).toFixed(2) + ' Crore'
  if (n >= 100000) return (n / 100000).toFixed(2) + ' Lakh'
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K'
  return n.toString()
}

function calcSalary(inputs: SalaryInputs): SalaryResult {
  const { basic, gradePay, daRate, city, ta, ma, special, other,
    npsRate, gis, ptax, tds, recovery, otherDed, mmlsay } = inputs

  const baseForDa = basic + gradePay
  const da = Math.round(baseForDa * daRate / 100)
  const hra = Math.round(basic * HRA_PCT[city])
  const nps = Math.round((basic + da) * npsRate / 100)

  const gross = basic + da + hra + ta + ma + special + other
  const totalDed = nps + gis + ptax + tds + recovery + otherDed + mmlsay
  const net = gross - totalDed

  const components = [
    { label: 'Basic', labelAs: 'মূল', value: basic, color: '#1e40af' },
    { label: 'DA', labelAs: 'DA', value: da, color: '#065f46' },
    { label: 'HRA', labelAs: 'HRA', value: hra, color: '#0f766e' },
    { label: 'TA', labelAs: 'TA', value: ta, color: '#b45309' },
    { label: 'MA', labelAs: 'MA', value: ma, color: '#7c3aed' },
    { label: 'Other', labelAs: 'অন্যান্য', value: special + other, color: '#be185d' },
  ].filter(c => c.value > 0)

  return { da, hra, gross, nps, totalDed, net, components }
}

// ─── JSON-LD Schema ───────────────────────────────────────────────────────────

const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Assam & Central Govt Salary Calculator 2026',
  description: 'Calculate exact take-home salary for Assam State and Central Government employees. Includes DA, HRA, TA, NPS, GIS, Professional Tax and all deductions. Bilingual English and Assamese.',
  url: 'https://assamcareerpoint-info.com/salary-calculator',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
  provider: {
    '@type': 'Organization',
    name: 'Assam Career Point & Info',
    url: 'https://assamcareerpoint-info.com',
  },
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function SalaryCalculatorPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('calculator')
  const [inputs, setInputs] = useState<SalaryInputs>({
    govType: 'assam',
    payLevel: 3,
    basic: 21700,
    gradePay: 0,
    daRate: 55,
    city: 'z',
    ta: 1800,
    ma: 500,
    special: 0,
    other: 0,
    npsRate: 10,
    gis: 30,
    ptax: 208,
    tds: 0,
    recovery: 0,
    otherDed: 0,
    mmlsay: 0,
  })

  const setField = useCallback(<K extends keyof SalaryInputs>(key: K, value: SalaryInputs[K]) => {
    setInputs(prev => ({ ...prev, [key]: value }))
  }, [])

  const result = calcSalary(inputs)
  const grossPct = result.gross > 0 ? Math.round((result.net / result.gross) * 100) : 0

  return (
    <>
      {/* ── SEO Meta ── */}
      <Head>
        <title>Salary Calculator — Assam & Central Govt 2026 | Assam Career Point</title>
        <meta name="description" content="Calculate exact take-home salary for Assam State and Central Govt employees. DA, HRA, NPS, GIS, P.Tax all included. Free bilingual tool — English & Assamese." />
        <meta name="keywords" content="assam govt salary calculator, central govt salary calculator, pay level calculator assam, DA HRA NPS calculator, government employee salary assam 2026" />
        <meta property="og:title" content="Govt Salary Calculator — Assam & Central | assamcareerpoint-info.com" />
        <meta property="og:description" content="Free tool to calculate Assam & Central Govt employee take-home salary with all allowances and deductions." />
        <meta property="og:url" content="https://assamcareerpoint-info.com/salary-calculator" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://assamcareerpoint-info.com/salary-calculator" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
        />
      </Head>

      <div style={styles.page}>

        {/* ── Hero ── */}
        <div style={styles.hero}>
          <div style={styles.heroBadge}>🧮 Free Tool</div>
          <h1 style={styles.heroTitle}>Govt Salary Calculator</h1>
          <p style={styles.heroSub}>Assam State &amp; Central Government Employees</p>
          <p style={styles.heroSubAs}>অসম ৰাজ্য আৰু কেন্দ্ৰীয় চৰকাৰী কৰ্মচাৰীৰ দৰমহা হিচাপ কৰক</p>
        </div>

        {/* ── Tabs ── */}
        <div style={styles.tabRow}>
          {(['calculator', 'glossary', 'contact'] as ActiveTab[]).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{ ...styles.tabBtn, ...(activeTab === tab ? styles.tabBtnActive : {}) }}
            >
              {tab === 'calculator' ? '🧮 Calculator' : tab === 'glossary' ? '📖 Terms Guide / পদবাচ্য' : '✉️ Contact & Feedback'}
            </button>
          ))}
        </div>

        {/* ══════════════════════════════════════════════
            TAB 1 — CALCULATOR
        ══════════════════════════════════════════════ */}
        {activeTab === 'calculator' && (
          <div>

            {/* ── Inputs: Basic Info ── */}
            <div style={styles.card}>
              <div style={styles.cardHead}>
                <span style={styles.cardHeadIcon}>👤</span>
                Employee Details / কৰ্মচাৰীৰ বিৱৰণ
              </div>

              <div style={styles.grid2}>
                <div style={styles.field}>
                  <label style={styles.fieldLabel}>Government Type</label>
                  <select
                    style={styles.select}
                    value={inputs.govType}
                    onChange={e => {
                      const g = e.target.value as GovType
                      setField('govType', g)
                      setField('daRate', g === 'central' ? 55 : 19)
                      setField('npsRate', g === 'central' ? 10 : 10)
                      setField('mmlsay', g === 'assam' ? 100 : 0)
                    }}
                  >
                    <option value="assam">Assam State Govt</option>
                    <option value="central">Central Govt (GoI)</option>
                  </select>
                </div>

                <div style={styles.field}>
                  <label style={styles.fieldLabel}>Pay Level (7th CPC)</label>
                  <select
                    style={styles.select}
                    value={inputs.payLevel}
                    onChange={e => {
                      const lvl = parseInt(e.target.value)
                      setField('payLevel', lvl)
                      setField('basic', PAY_LEVELS[lvl] || 21700)
                    }}
                  >
                    {Object.entries(PAY_LEVELS).map(([lvl, base]) => (
                      <option key={lvl} value={lvl}>Level {lvl} — ₹{base.toLocaleString('en-IN')}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ ...styles.grid3, marginTop: 12 }}>
                <div style={styles.field}>
                  <label style={styles.fieldLabel}>Basic Pay (₹)</label>
                  <input type="number" style={styles.input} value={inputs.basic}
                    onChange={e => setField('basic', parseFloat(e.target.value) || 0)} />
                </div>
                <div style={styles.field}>
                  <label style={styles.fieldLabel}>Grade Pay (₹) <span style={styles.hint}>pre-7th CPC</span></label>
                  <input type="number" style={styles.input} value={inputs.gradePay}
                    onChange={e => setField('gradePay', parseFloat(e.target.value) || 0)} />
                </div>
                <div style={styles.field}>
                  <label style={styles.fieldLabel}>City Category</label>
                  <select style={styles.select} value={inputs.city}
                    onChange={e => setField('city', e.target.value as CityType)}>
                    <option value="x">X — Metro (HRA 27%)</option>
                    <option value="y">Y — City (HRA 18%)</option>
                    <option value="z">Z — Other (HRA 9%)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* ── Inputs: Allowances ── */}
            <div style={styles.card}>
              <div style={styles.cardHead}>
                <span style={styles.cardHeadIcon}>➕</span>
                Allowances / ভাট্টাসমূহ
                <span style={styles.tagGreen}>Earnings</span>
              </div>
              <div style={styles.grid3}>
                <div style={styles.field}>
                  <label style={styles.fieldLabel}>DA % (current)</label>
                  <input type="number" style={styles.input} value={inputs.daRate}
                    onChange={e => setField('daRate', parseFloat(e.target.value) || 0)} />
                  <span style={styles.fieldNote}>Central=55% | Assam≈19%</span>
                </div>
                <div style={styles.field}>
                  <label style={styles.fieldLabel}>TA / Transport (₹)</label>
                  <input type="number" style={styles.input} value={inputs.ta}
                    onChange={e => setField('ta', parseFloat(e.target.value) || 0)} />
                </div>
                <div style={styles.field}>
                  <label style={styles.fieldLabel}>Medical Allowance (₹)</label>
                  <input type="number" style={styles.input} value={inputs.ma}
                    onChange={e => setField('ma', parseFloat(e.target.value) || 0)} />
                </div>
                <div style={styles.field}>
                  <label style={styles.fieldLabel}>Special Allowance (₹)</label>
                  <input type="number" style={styles.input} value={inputs.special}
                    onChange={e => setField('special', parseFloat(e.target.value) || 0)} />
                </div>
                <div style={styles.field}>
                  <label style={styles.fieldLabel}>Other Allowance (₹)</label>
                  <input type="number" style={styles.input} value={inputs.other}
                    onChange={e => setField('other', parseFloat(e.target.value) || 0)} />
                </div>
              </div>
            </div>

            {/* ── Inputs: Deductions ── */}
            <div style={styles.card}>
              <div style={styles.cardHead}>
                <span style={styles.cardHeadIcon}>➖</span>
                Deductions / কৰ্তনসমূহ
                <span style={styles.tagRed}>Deductions</span>
              </div>
              <div style={styles.grid3}>
                <div style={styles.field}>
                  <label style={styles.fieldLabel}>NPS % (Basic+DA)</label>
                  <input type="number" style={styles.input} value={inputs.npsRate}
                    onChange={e => setField('npsRate', parseFloat(e.target.value) || 0)} />
                  <span style={styles.fieldNote}>Employee share = 10%</span>
                </div>
                <div style={styles.field}>
                  <label style={styles.fieldLabel}>GIS / AGIS (₹/month)</label>
                  <input type="number" style={styles.input} value={inputs.gis}
                    onChange={e => setField('gis', parseFloat(e.target.value) || 0)} />
                </div>
                <div style={styles.field}>
                  <label style={styles.fieldLabel}>Professional Tax (₹)</label>
                  <input type="number" style={styles.input} value={inputs.ptax}
                    onChange={e => setField('ptax', parseFloat(e.target.value) || 0)} />
                  <span style={styles.fieldNote}>Assam: ₹208/month</span>
                </div>
                <div style={styles.field}>
                  <label style={styles.fieldLabel}>
                    MMLSAY (₹)
                    {inputs.govType === 'assam' && <span style={{ ...styles.tagPurple, marginLeft: 4 }}>Assam</span>}
                  </label>
                  <input type="number" style={styles.input} value={inputs.mmlsay}
                    onChange={e => setField('mmlsay', parseFloat(e.target.value) || 0)} />
                  <span style={styles.fieldNote}>Assam health insurance</span>
                </div>
                <div style={styles.field}>
                  <label style={styles.fieldLabel}>Income Tax TDS (₹)</label>
                  <input type="number" style={styles.input} value={inputs.tds}
                    onChange={e => setField('tds', parseFloat(e.target.value) || 0)} />
                </div>
                <div style={styles.field}>
                  <label style={styles.fieldLabel}>Recovery / Loan EMI (₹)</label>
                  <input type="number" style={styles.input} value={inputs.recovery}
                    onChange={e => setField('recovery', parseFloat(e.target.value) || 0)} />
                </div>
                <div style={styles.field}>
                  <label style={styles.fieldLabel}>Other Deduction (₹)</label>
                  <input type="number" style={styles.input} value={inputs.otherDed}
                    onChange={e => setField('otherDed', parseFloat(e.target.value) || 0)} />
                </div>
              </div>
            </div>

            {/* ── Result Card ── */}
            <div style={styles.resultCard}>

              {/* Summary metrics */}
              <div style={styles.metricsRow}>
                <div style={styles.metric}>
                  <div style={styles.metricLabel}>Gross Salary / মুঠ আয়</div>
                  <div style={{ ...styles.metricVal, color: '#065f46' }}>{fmt(result.gross)}</div>
                </div>
                <div style={styles.metric}>
                  <div style={styles.metricLabel}>Total Deduction / মুঠ কৰ্তন</div>
                  <div style={{ ...styles.metricVal, color: '#991b1b' }}>{fmt(result.totalDed)}</div>
                </div>
                <div style={{ ...styles.metric, background: '#eff6ff' }}>
                  <div style={styles.metricLabel}>Net Payable / হাতত পোৱা</div>
                  <div style={{ ...styles.metricVal, color: '#1e40af', fontSize: 22 }}>{fmt(result.net)}</div>
                </div>
              </div>

              {/* Earnings breakdown bar */}
              <div style={{ marginBottom: 20 }}>
                <div style={styles.barRow}>
                  {result.components.map((c, i) => (
                    <div
                      key={i}
                      style={{
                        flex: c.value / result.gross,
                        background: c.color,
                        height: 10,
                        borderRadius: i === 0 ? '5px 0 0 5px' : i === result.components.length - 1 ? '0 5px 5px 0' : 0,
                        minWidth: 4,
                      }}
                    />
                  ))}
                </div>
                <div style={styles.legendRow}>
                  {result.components.map((c, i) => (
                    <span key={i} style={styles.legendItem}>
                      <span style={{ ...styles.legendDot, background: c.color }} />
                      {c.label} {result.gross > 0 ? Math.round(c.value / result.gross * 100) : 0}%
                    </span>
                  ))}
                </div>
              </div>

              {/* Earnings detail */}
              <div style={styles.resultSection}>Earnings Detail / আয়ৰ বিৱৰণ</div>
              <ResultRow label="Basic Pay / মূল দৰমহা" value={fmt(inputs.basic)} type="add" />
              <ResultRow label={`DA (${inputs.daRate}% of Basic) / মহার্ঘ ভাট্টা`} value={fmt(result.da)} type="add" />
              <ResultRow label={`HRA (${Math.round(HRA_PCT[inputs.city] * 100)}% of Basic) / গৃহ ভাড়া ভাট্টা`} value={fmt(result.hra)} type="add" />
              <ResultRow label="TA — Transport Allowance / পৰিবহন ভাট্টা" value={fmt(inputs.ta)} type="add" />
              <ResultRow label="MA — Medical Allowance / চিকিৎসা ভাট্টা" value={fmt(inputs.ma)} type="add" />
              {inputs.special > 0 && <ResultRow label="Special Allowance / বিশেষ ভাট্টা" value={fmt(inputs.special)} type="add" />}
              {inputs.other > 0 && <ResultRow label="Other Allowance / অন্যান্য ভাট্টা" value={fmt(inputs.other)} type="add" />}
              <div style={styles.totalRow}>
                <span>Gross Total / মুঠ আয়</span>
                <span style={{ color: '#065f46', fontWeight: 600 }}>{fmt(result.gross)}</span>
              </div>

              <div style={styles.divider} />

              {/* Deductions detail */}
              <div style={styles.resultSection}>Deductions / কৰ্তনৰ বিৱৰণ</div>
              <ResultRow label={`NPS (${inputs.npsRate}% of Basic+DA) — Employee Share`} value={fmt(result.nps)} type="ded" />
              <ResultRow label="GIS / AGIS — Group Insurance Scheme" value={fmt(inputs.gis)} type="ded" />
              <ResultRow label="P.Tax — Professional Tax / বৃত্তি কৰ" value={fmt(inputs.ptax)} type="ded" />
              {inputs.mmlsay > 0 && <ResultRow label="MMLSAY — Loksevak Arogya Yojana" value={fmt(inputs.mmlsay)} type="ded" />}
              {inputs.tds > 0 && <ResultRow label="Income Tax (TDS)" value={fmt(inputs.tds)} type="ded" />}
              {inputs.recovery > 0 && <ResultRow label="Recovery / Loan EMI" value={fmt(inputs.recovery)} type="ded" />}
              {inputs.otherDed > 0 && <ResultRow label="Other Deduction" value={fmt(inputs.otherDed)} type="ded" />}
              <div style={styles.totalRow}>
                <span>Total Deduction / মুঠ কৰ্তন</span>
                <span style={{ color: '#991b1b', fontWeight: 600 }}>{fmt(result.totalDed)}</span>
              </div>

              {/* Net payable highlight */}
              <div style={styles.netBox}>
                <div>
                  <div style={styles.netLabel}>Net Payable / হাতত পোৱা দৰমহা</div>
                  <div style={styles.netSub}>≈ {toWords(result.net)} per month</div>
                  <div style={styles.netSub}>{grossPct}% of Gross Salary</div>
                </div>
                <div style={styles.netAmount}>{fmt(result.net)}</div>
              </div>

              {/* NPS employer note */}
              <div style={styles.infoBox}>
                <strong>📌 Note:</strong> Your employer also contributes NPS{' '}
                {inputs.govType === 'central' ? '14% (Central Govt)' : '10% (Assam Govt)'} of Basic+DA
                = {fmt((inputs.basic + result.da) * (inputs.govType === 'central' ? 0.14 : 0.10))}/month —{' '}
                this goes to your pension account and is an additional benefit, NOT deducted from your salary.
                <br /><br />
                <span style={{ color: '#6b7280' }}>
                  অসমীয়া টোকা: নিয়োগকৰ্তাই NPS-ত{' '}
                  {inputs.govType === 'central' ? '14%' : '10%'}
                  {' '}অৱদান দিয়ে — এইটো আপোনাৰ পেনচন একাউণ্টলৈ যায়, দৰমহাৰ পৰা কৰ্তন নহয়।
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════
            TAB 2 — GLOSSARY
        ══════════════════════════════════════════════ */}
        {activeTab === 'glossary' && (
          <div>
            <div style={styles.card}>
              <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 16, lineHeight: 1.7 }}>
                All salary terms explained in simple English and Assamese. Click any term to learn more.
                <br />
                <span style={{ fontStyle: 'italic' }}>সকলো দৰমহা পদবাচ্য সহজ ইংৰাজী আৰু অসমীয়াত বুজোৱা হৈছে।</span>
              </p>
              <div style={styles.glossaryGrid}>
                {GLOSSARY_TERMS.map((t, i) => (
                  <div key={i} style={styles.gcard}>
                    <div style={{ ...styles.gtermBadge, borderColor: t.color, color: t.color }}>{t.term}</div>
                    <div style={styles.gtermAs}>{t.termAs}</div>
                    <div style={styles.gtermEn}>{t.en}</div>
                    <div style={styles.gtermAsText}>{t.as}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={styles.card}>
              <div style={styles.cardHead}><span style={styles.cardHeadIcon}>📊</span>Salary Slip Formula / দৰমহাৰ সূত্ৰ</div>
              <div style={styles.formulaBox}>
                <div style={styles.formulaRow}>
                  <span style={styles.formulaLabel}>Gross Pay =</span>
                  <span style={{ color: '#065f46' }}>Basic + DA + HRA + TA + MA + All Allowances</span>
                </div>
                <div style={styles.formulaRow}>
                  <span style={styles.formulaLabel}>NPS (Employee) =</span>
                  <span style={{ color: '#991b1b' }}>10% × (Basic + DA)</span>
                </div>
                <div style={styles.formulaRow}>
                  <span style={styles.formulaLabel}>DA =</span>
                  <span style={{ color: '#991b1b' }}>DA% × (Basic + Grade Pay)</span>
                </div>
                <div style={styles.formulaRow}>
                  <span style={styles.formulaLabel}>HRA =</span>
                  <span style={{ color: '#991b1b' }}>X=27%, Y=18%, Z=9% of Basic</span>
                </div>
                <div style={{ ...styles.formulaRow, borderTop: '1.5px solid #d1d5db', paddingTop: 10, marginTop: 4 }}>
                  <span style={{ ...styles.formulaLabel, fontSize: 14, fontWeight: 600 }}>Net Payable =</span>
                  <span style={{ color: '#1e40af', fontWeight: 600 }}>Gross Pay − Total Deductions</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════
            TAB 3 — CONTACT
        ══════════════════════════════════════════════ */}
        {activeTab === 'contact' && (
          <div>
            <div style={styles.card}>
              <div style={styles.cardHead}><span style={styles.cardHeadIcon}>✉️</span>Contact & Feedback</div>

              <div style={styles.contactBox}>
                <div style={styles.contactIcon}>📧</div>
                <div>
                  <div style={styles.contactTitle}>Send Us Your Query or Suggestion</div>
                  <div style={styles.contactSubtitle}>আপোনাৰ প্ৰশ্ন বা পৰামৰ্শ পঠিয়াওক</div>
                  <a href="mailto:assam.cpi123@gmail.com" style={styles.contactEmail}>
                    assam.cpi123@gmail.com
                  </a>
                </div>
              </div>

              <div style={{ height: 1, background: '#e5e7eb', margin: '20px 0' }} />

              <div style={styles.feedbackTitle}>What to write in your email? / ইমেইলত কি লিখব?</div>
              <div style={styles.feedbackGrid}>
                {[
                  { icon: '❓', en: 'Any question about your salary calculation', as: 'দৰমহা হিচাপৰ বিষয়ে কোনো প্ৰশ্ন' },
                  { icon: '➕', en: 'Request to add a new allowance or deduction (e.g. MMLSAY update, new DA rate)', as: 'নতুন ভাট্টা বা কৰ্তন যোগ কৰাৰ অনুৰোধ (যেনে MMLSAY আপডেট, নতুন DA হাৰ)' },
                  { icon: '🐛', en: 'Report a calculation error or wrong formula', as: 'হিচাপৰ ভুল বা ভুল সূত্ৰৰ বিষয়ে জনাওক' },
                  { icon: '💡', en: 'Suggest new features for the calculator', as: 'কেলকুলেটৰৰ নতুন বৈশিষ্ট্যৰ পৰামৰ্শ দিয়ক' },
                  { icon: '📋', en: 'Inform about new Assam/Central Govt salary rules', as: 'নতুন অসম/কেন্দ্ৰীয় চৰকাৰৰ দৰমহা নিয়মৰ বিষয়ে জনাওক' },
                  { icon: '🔗', en: 'Share your salary slip (anonymously) to help us verify accuracy', as: 'শুদ্ধতা পৰীক্ষাৰ বাবে আপোনাৰ দৰমহাৰ পৰ্চা (নামবিহীনকৈ) শ্বেয়াৰ কৰক' },
                ].map((item, i) => (
                  <div key={i} style={styles.feedbackCard}>
                    <div style={styles.feedbackIcon}>{item.icon}</div>
                    <div>
                      <div style={styles.feedbackEn}>{item.en}</div>
                      <div style={styles.feedbackAs}>{item.as}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={styles.infoBox}>
                <strong>🔄 How we update the calculator:</strong><br />
                When the Government of Assam or Government of India announces new DA rates, new allowances (like MMLSAY changes), or new deduction rules — we update this calculator within 48 hours. Send us an email if you notice any discrepancy.
                <br /><br />
                <span style={{ color: '#6b7280', fontStyle: 'italic' }}>
                  যেতিয়াই অসম চৰকাৰ বা কেন্দ্ৰীয় চৰকাৰে নতুন DA হাৰ বা নতুন নিয়ম ঘোষণা কৰে, আমি 48 ঘণ্টাৰ ভিতৰত এই কেলকুলেটৰ আপডেট কৰোঁ।
                </span>
              </div>
            </div>

            <div style={styles.card}>
              <div style={styles.cardHead}><span style={styles.cardHeadIcon}>🌐</span>More Tools on Our Portal</div>
              <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 14 }}>
                Visit assamcareerpoint-info.com for latest job notifications, exam updates, and career information for Assam.
              </p>
              <a href="https://assamcareerpoint-info.com" style={styles.portalLink}>
                Visit assamcareerpoint-info.com →
              </a>
            </div>
          </div>
        )}

        {/* ── Footer ── */}
        <div style={styles.footer}>
          <p>Last Updated: April 2026 &nbsp;|&nbsp; DA Rate: Central 55% &nbsp;|&nbsp; Assam P.Tax: ₹208/month</p>
          <p style={{ marginTop: 4 }}>
            Queries: <a href="mailto:assam.cpi123@gmail.com" style={{ color: '#1e40af' }}>assam.cpi123@gmail.com</a>
            &nbsp;|&nbsp;
            <a href="https://assamcareerpoint-info.com" style={{ color: '#1e40af' }}>assamcareerpoint-info.com</a>
          </p>
          <p style={{ marginTop: 4, color: '#9ca3af' }}>
            * This calculator is for reference only. Actual salary may vary based on individual pay orders and departmental rules.
          </p>
        </div>

      </div>
    </>
  )
}

// ─── Helper Sub-component ─────────────────────────────────────────────────────

function ResultRow({ label, value, type }: { label: string; value: string; type: 'add' | 'ded' }) {
  return (
    <div style={styles.resultRow}>
      <span style={{ fontSize: 13, color: '#6b7280' }}>{label}</span>
      <span style={{ fontSize: 14, fontWeight: 500, color: type === 'add' ? '#065f46' : '#991b1b' }}>{value}</span>
    </div>
  )
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles: Record<string, React.CSSProperties> = {
  page: { maxWidth: 760, margin: '0 auto', padding: '0 16px 40px', fontFamily: "'Nunito', 'Segoe UI', sans-serif", color: '#111827' },
  hero: { textAlign: 'center', padding: '32px 16px 20px' },
  heroBadge: { display: 'inline-block', fontSize: 11, fontWeight: 700, background: '#eff6ff', color: '#1e40af', padding: '3px 10px', borderRadius: 99, marginBottom: 10, letterSpacing: '.05em' },
  heroTitle: { fontSize: 28, fontWeight: 700, color: '#0f172a', margin: '0 0 6px', lineHeight: 1.2 },
  heroSub: { fontSize: 14, color: '#4b5563', margin: '0 0 4px' },
  heroSubAs: { fontSize: 13, color: '#9ca3af', fontStyle: 'italic' },
  tabRow: { display: 'flex', gap: 8, marginBottom: 18, flexWrap: 'wrap' as const },
  tabBtn: { padding: '8px 16px', borderRadius: 8, border: '1.5px solid #d1d5db', fontSize: 13, cursor: 'pointer', background: '#fff', color: '#6b7280', fontFamily: 'inherit', fontWeight: 500 },
  tabBtnActive: { background: '#1e40af', color: '#fff', borderColor: '#1e40af' },
  card: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: 14, padding: '20px 22px', marginBottom: 14, boxShadow: '0 1px 4px rgba(0,0,0,.04)' },
  cardHead: { fontSize: 14, fontWeight: 600, color: '#0f172a', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 7 },
  cardHeadIcon: { fontSize: 16 },
  grid2: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 },
  grid3: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 },
  field: { display: 'flex', flexDirection: 'column' as const, gap: 4 },
  fieldLabel: { fontSize: 12, fontWeight: 600, color: '#374151' },
  fieldNote: { fontSize: 10, color: '#9ca3af', marginTop: 2 },
  hint: { fontSize: 10, color: '#9ca3af', fontWeight: 400, marginLeft: 4 },
  select: { width: '100%', padding: '9px 11px', border: '1.5px solid #d1d5db', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', background: '#fff', color: '#111827', cursor: 'pointer' },
  input: { width: '100%', padding: '9px 11px', border: '1.5px solid #d1d5db', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', background: '#f9fafb', color: '#111827' },
  tagGreen: { marginLeft: 'auto', fontSize: 10, fontWeight: 700, background: '#d1fae5', color: '#065f46', padding: '2px 8px', borderRadius: 99 },
  tagRed: { marginLeft: 'auto', fontSize: 10, fontWeight: 700, background: '#fee2e2', color: '#991b1b', padding: '2px 8px', borderRadius: 99 },
  tagPurple: { fontSize: 10, fontWeight: 700, background: '#ede9fe', color: '#6d28d9', padding: '2px 6px', borderRadius: 99 },
  resultCard: { background: '#fff', border: '1.5px solid #bfdbfe', borderRadius: 14, padding: '22px', marginBottom: 14 },
  metricsRow: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10, marginBottom: 20 },
  metric: { background: '#f9fafb', borderRadius: 10, padding: '14px 16px', textAlign: 'center' as const },
  metricLabel: { fontSize: 11, color: '#6b7280', marginBottom: 5 },
  metricVal: { fontSize: 18, fontWeight: 700 },
  barRow: { display: 'flex', gap: 2, height: 10, borderRadius: 5, overflow: 'hidden', marginBottom: 8 },
  legendRow: { display: 'flex', gap: 12, flexWrap: 'wrap' as const },
  legendItem: { display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#6b7280' },
  legendDot: { width: 8, height: 8, borderRadius: 2, flexShrink: 0 },
  resultSection: { fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8, paddingBottom: 6, borderBottom: '1px solid #f3f4f6' },
  resultRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', borderBottom: '1px solid #f9fafb' },
  totalRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', fontSize: 14, fontWeight: 600 },
  divider: { height: 1, background: '#e5e7eb', margin: '14px 0' },
  netBox: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#eff6ff', borderRadius: 10, padding: '16px 18px', marginTop: 12 },
  netLabel: { fontSize: 13, fontWeight: 600, color: '#1e40af', marginBottom: 3 },
  netSub: { fontSize: 11, color: '#3b82f6' },
  netAmount: { fontSize: 26, fontWeight: 700, color: '#1e40af' },
  infoBox: { background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, padding: '12px 14px', marginTop: 14, fontSize: 12, color: '#166534', lineHeight: 1.7 },
  glossaryGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 },
  gcard: { background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 10, padding: '14px 16px' },
  gtermBadge: { fontSize: 13, fontWeight: 700, borderLeft: '3px solid', paddingLeft: 8, marginBottom: 3 },
  gtermAs: { fontSize: 11, color: '#9ca3af', fontStyle: 'italic', marginBottom: 6 },
  gtermEn: { fontSize: 12, color: '#4b5563', lineHeight: 1.6, marginBottom: 6 },
  gtermAsText: { fontSize: 11, color: '#9ca3af', lineHeight: 1.6, fontStyle: 'italic' },
  formulaBox: { background: '#f9fafb', borderRadius: 8, padding: '14px 16px' },
  formulaRow: { display: 'flex', gap: 10, alignItems: 'flex-start', padding: '6px 0', borderBottom: '1px solid #f3f4f6', fontSize: 13 },
  formulaLabel: { fontWeight: 600, color: '#374151', minWidth: 150, flexShrink: 0 },
  contactBox: { display: 'flex', gap: 16, alignItems: 'flex-start', background: '#eff6ff', borderRadius: 10, padding: '16px 18px', marginBottom: 20 },
  contactIcon: { fontSize: 28, flexShrink: 0 },
  contactTitle: { fontSize: 15, fontWeight: 600, color: '#1e40af', marginBottom: 3 },
  contactSubtitle: { fontSize: 12, color: '#6b7280', fontStyle: 'italic', marginBottom: 8 },
  contactEmail: { fontSize: 15, fontWeight: 700, color: '#1e40af', textDecoration: 'none', background: '#dbeafe', padding: '4px 12px', borderRadius: 6, display: 'inline-block' },
  feedbackTitle: { fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 12 },
  feedbackGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 10, marginBottom: 16 },
  feedbackCard: { display: 'flex', gap: 10, alignItems: 'flex-start', background: '#f9fafb', borderRadius: 8, padding: '10px 12px' },
  feedbackIcon: { fontSize: 18, flexShrink: 0, marginTop: 2 },
  feedbackEn: { fontSize: 12, color: '#374151', lineHeight: 1.5, marginBottom: 3 },
  feedbackAs: { fontSize: 11, color: '#9ca3af', fontStyle: 'italic', lineHeight: 1.5 },
  portalLink: { display: 'inline-block', background: '#1e40af', color: '#fff', padding: '10px 20px', borderRadius: 8, textDecoration: 'none', fontSize: 13, fontWeight: 600 },
  footer: { textAlign: 'center' as const, fontSize: 11, color: '#6b7280', lineHeight: 1.8, borderTop: '1px solid #e5e7eb', paddingTop: 16, marginTop: 20 },
}
