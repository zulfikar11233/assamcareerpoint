'use client'
export const dynamic = 'force-dynamic'
import MigrateButton from '@/components/MigrateButton'
// src/app/admin/dashboard/page.tsx — ACPI Admin v6
// ✅ Portal: Assam Career Point & Info
// ✅ Jobs: multi-post (Driver/Grade IV/Peon each with own vacancy/age/salary/date/link)
// ✅ Jobs: image banner upload, multiple advertisement PDFs, last-date extend history
// ✅ NEW: Competitive Exams (exam date + time, payment last date separate from apply last date)
// ✅ NEW: Information (Voter ID, PAN-Aadhaar, schemes — with dates+time)
// ✅ PDF Forms library: SEPARATE from job/exam PDFs (Google Drive links supported)
// ✅ NEW: Results CMS + Others CMS (Announcements, Guides, Services) — sidebar links added

import { useState, useEffect, useRef } from 'react'
import { signOut } from 'next-auth/react'

// ─── TYPES ────────────────────────────────────────────────────────────────────

type Post = {
  id: string
  name: string           // e.g. "Driver Grade III"
  dept: string
  vacancy: number
  qualification: string
  ageMin: number
  ageMax: number
  salary: string
  lastDate: string       // ISO date — each post has its OWN last date
  applyLink: string
}

type JobAffiliate = {
  id: string
  title: string
  link: string
  img: string
  badge: string
}

type AdvPdf = {          // Advertisement / notification PDF for a job
  name: string           // display name e.g. "Official Notification"
  url: string            // Google Drive share link or direct PDF URL
}

type DateExt = {         // Last-date extension history entry
  date: string
  note: string
  extendedOn: string
}

type Job = {
  id: number
  logo: string
  title: string
  org: string
  category: string
  district: string
  status: 'Live' | 'Draft' | 'Closing'
  vacancy: string
  qualification: string
  ageLimit: string
  salary: string
  lastDate: string
  applyLink: string
  posts: Post[]
  advPdfs: AdvPdf[]
  dateHistory: DateExt[]
  // Basic extras
  fee?: string
  selection?: string
  website?: string
  howToApply?: string
  youtubeLink?: string
  createdAt?: string
  // SEO & Description
  description?: string
  advtNo?: string
  // Age Details
  ageLimitDate?: string
  ageRelaxation?: string
  // Fee Details
  feeRefund?: string
  // Important Dates extras
  lastDateTime?: string
  paymentLastDate?: string
  paymentLastDateTime?: string
  correctionWindow?: string
  applicationStart?: string
  // Helpline
  helplineEmail?: string
  helplinePhone?: string
  // Selection & Syllabus
  selectionDetails?: string
  syllabusDetails?: string
  // Zone/Region-wise vacancy
  zoneWiseVacancy?: string
  // Job-specific affiliate products
  jobAffiliates?: JobAffiliate[]
  // Bilingual — Assamese (all optional)
  titleAs?: string
  orgAs?: string
  descriptionAs?: string
  howToApplyAs?: string
  selectionAs?: string
}

type Exam = {
  id: number
  emoji: string
  title: string
  conductedBy: string
  category: string
  description?: string
  applicationStart?: string
  applicationLastDate?: string
  paymentLastDate?: string
  examDate?: string
  examTime?: string
  admitCardDate?: string
  resultDate?: string
  fee?: string
  eligibility?: string
  syllabus?: string
  officialSite?: string
  applyLink?: string
  admitCardLink?: string
  status: 'Upcoming' | 'Registration Open' | 'Registration Closed' | 'Exam Ongoing' | 'Result Declared'
  createdAt?: string
  titleAs?: string
  descriptionAs?: string
  eligibilityAs?: string
  syllabusAs?: string
  examPdfs?:      { label: string; url: string }[]
  examAffiliates?: { id: string; title: string; link: string; img?: string; badge?: string }[]
}

type InfoItem = {
  id: number
  emoji: string
  title: string
  category: string
  description?: string
  lastDate?: string
  process?: string
  officialLink?: string
  importantDates?: { label: string; date: string; time?: string }[]
  status: 'Active' | 'Upcoming' | 'Expired'
  createdAt?: string
  titleAs?: string
  descriptionAs?: string
  processAs?: string
}

// PDF Forms library — Google Drive links only (NOT base64, NOT job advert PDFs)
type PdfForm = {
  id: number
  title: string
  category: string
  driveLink: string      // Google Drive shareable link
  uploadedAt?: string
  downloads?: number
  // SEO fields — shown on public page, indexed by Google
  description?: string   // 2-3 sentence description using search keywords
  keywords?:   string    // comma-separated exact search phrases
  fileSize?:   string    // "1.2 MB"
  pages?:      string    // "12"
  language?:   string    // "English" | "Assamese" | "Both"
  source?:     string    // official source e.g. "Election Commission of India"
}

// Affiliate items
type AffItem = {
  id: number
  category: string       // 'Exam Preparation' | 'Books & Study Material' | 'Tools & Resources'
  title: string
  description?: string
  badge: string          // "Best for Assam", "Top Rated" etc.
  logo: string           // emoji
  price: string
  originalPrice?: string
  commission: string
  link: string           // YOUR affiliate URL — replace with real link
  highlights: string[]   // up to 4 bullet points
  buttonText: string
  tag: string            // 'RECOMMENDED' | 'POPULAR' | 'NEW' | ''
  active: boolean        // show/hide on public page
}

// ─── TAB TYPE ─────────────────────────────────────────────────────────────────
type Tab = 'dashboard' | 'jobs' | 'exams' | 'info' | 'pdfforms' | 'affiliate' | 'settings'

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const JOB_CATS   = ['Govt Job','Central Govt','State Govt','Banking','Teaching','Railway','Defence','PSC','Private Job']
const EXAM_CATS  = ['Teaching','Engineering','Medical','Civil Services','Banking','Railway','Defence','State PSC','Insurance','Other']
const INFO_CATS  = ['Electoral','ID & Documents','Government Scheme','Finance','Health','Education','Legal','Other']
const PDF_CATS   = ['Application Forms','Syllabus','Question Papers','Answer Keys','Govt Documents','Results','Other']
const DISTRICTS  = ['All Districts','Kamrup','Kamrup (Metro)','Dibrugarh','Jorhat','Kokrajhar','Nagaon','Sonitpur','Silchar','Lakhimpur','Barpeta','Dhubri','Goalpara','Tinsukia','Sivasagar','Golaghat','Cachar','All India']
const EXAM_STATUS = ['Upcoming','Registration Open','Registration Closed','Exam Ongoing','Result Declared'] as const
const LOGOS      = ['👮','🌲','🚂','🏦','🏛️','🏥','🎓','📋','⚖️','🏗️','🔬','🚒','🚓','🏫','🏢','📊','🧪','🌾','💼','🔧','✈️','🚢','🎯','📱','🖥️','🌐','🏆','📰','🔑','🎫','🩺','📐','🌿','🎨','🔭','🛡️','⚓','🏋️','🌊']

// ─── SAMPLE DATA ──────────────────────────────────────────────────────────────
const SAMPLE_JOBS: Job[] = [{
  id:1, logo:'👮', title:'Assam Police Recruitment 2026', org:'SLPRB Assam',
  category:'Govt Job', district:'All Districts', status:'Live',
  vacancy:'5734', qualification:'HS Pass', ageLimit:'18-43', salary:'₹12,000–1,10,000', lastDate:'2026-03-25', applyLink:'https://slprbassam.in',
  posts:[
    {id:'p1',name:'Sub Inspector (AB)',dept:'Assam Police',vacancy:312,qualification:'Graduation',ageMin:20,ageMax:38,salary:'₹30,000–1,10,000',lastDate:'2026-03-25',applyLink:'https://slprbassam.in'},
    {id:'p2',name:'Constable (AB)',dept:'Assam Police',vacancy:1850,qualification:'HS (10+2)',ageMin:18,ageMax:38,salary:'₹14,000–60,500',lastDate:'2026-03-25',applyLink:'https://slprbassam.in'},
    {id:'p3',name:'Driver Grade III',dept:'Police Transport',vacancy:120,qualification:'HSLC + Driving Licence',ageMin:18,ageMax:43,salary:'₹14,000–60,500',lastDate:'2026-03-20',applyLink:'https://slprbassam.in'},
    {id:'p4',name:'Peon / Grade IV',dept:'Various',vacancy:280,qualification:'Class VIII Pass',ageMin:18,ageMax:43,salary:'₹12,000–37,500',lastDate:'2026-03-20',applyLink:'https://slprbassam.in'},
    {id:'p5',name:'Safai Karmachari',dept:'Sanitation',vacancy:110,qualification:'Class VIII Pass',ageMin:18,ageMax:43,salary:'₹12,000–37,500',lastDate:'2026-03-20',applyLink:'https://slprbassam.in'},
  ],
  advPdfs:[], dateHistory:[], fee:'₹285 (Gen) · ₹185 (SC/ST)', selection:'Written → PET → Medical', website:'slprbassam.in', howToApply:'Visit slprbassam.in and click Apply', youtubeLink:'', createdAt:new Date().toISOString(),
}]

const SAMPLE_EXAMS: Exam[] = [
  {id:1,emoji:'📚',title:'CTET 2026 — Central Teacher Eligibility Test',conductedBy:'CBSE',category:'Teaching',description:'National eligibility test for teachers for Class 1–8.',applicationStart:'2026-02-15',applicationLastDate:'2026-03-15',paymentLastDate:'2026-03-17',examDate:'2026-05-22',examTime:'9:30 AM – 12:00 PM  &  2:30 PM – 5:00 PM',admitCardDate:'2026-05-10',resultDate:'2026-06-30',fee:'1 Paper: Gen ₹1,000 · SC/ST ₹500 | Both: Gen ₹1,200 · SC/ST ₹600',eligibility:'Graduation + B.Ed / D.El.Ed',syllabus:'Child Dev., Language I & II, Maths / Science / Social Studies',officialSite:'ctet.nic.in',applyLink:'https://ctet.nic.in',admitCardLink:'',status:'Registration Open',createdAt:new Date().toISOString()},
  {id:2,emoji:'🏥',title:'NEET UG 2026',conductedBy:'NTA',category:'Medical',description:'National Eligibility cum Entrance Test for MBBS, BDS, BAMS and other medical courses.',applicationStart:'2026-02-01',applicationLastDate:'2026-03-31',paymentLastDate:'2026-04-01',examDate:'2026-05-04',examTime:'2:00 PM – 5:20 PM',admitCardDate:'2026-04-20',resultDate:'2026-06-14',fee:'Gen ₹1,700 · OBC/EWS ₹1,600 · SC/ST/PWD ₹1,000',eligibility:'10+2 with PCB (min 50% Gen, 45% OBC, 40% SC/ST)',syllabus:'Physics, Chemistry, Biology (Class 11 & 12 NCERT)',officialSite:'neet.nta.nic.in',applyLink:'https://neet.nta.nic.in',admitCardLink:'',status:'Registration Open',createdAt:new Date().toISOString()},
]

const SAMPLE_INFO: InfoItem[] = [
  {id:1,emoji:'🗳️',title:'Voter ID Registration / Correction 2026',category:'Electoral',description:'Register as a new voter or correct existing voter ID details via Form 6/6A/8 online or offline.',lastDate:'2026-04-30',process:'1. Visit voters.eci.gov.in\n2. Click "Register as New Voter"\n3. Fill Form 6 with your details\n4. Upload Aadhaar, address proof, photo\n5. Submit and note acknowledgement number\n6. BLO will verify at your address',officialLink:'https://voters.eci.gov.in',importantDates:[{label:'Registration Opens',date:'2026-01-01'},{label:'Last Date to Apply',date:'2026-04-30',time:'11:59 PM'},{label:'Verification Deadline',date:'2026-05-15'}],status:'Active',createdAt:new Date().toISOString()},
  {id:2,emoji:'🔗',title:'PAN–Aadhaar Linking Deadline 2026',category:'ID & Documents',description:'Link your PAN card with Aadhaar to avoid PAN becoming inoperative. Penalty of ₹1,000 applies after deadline.',lastDate:'2026-06-30',process:'Method 1 (SMS): Send UIDPAN<space>12-digit Aadhaar<space>10-digit PAN to 567678\nMethod 2 (Online): Visit incometax.gov.in → Quick Links → Link Aadhaar → Enter PAN & Aadhaar → Pay ₹1,000 penalty if applicable → Submit',officialLink:'https://incometax.gov.in',importantDates:[{label:'Extended Deadline',date:'2026-06-30',time:'11:59 PM'}],status:'Active',createdAt:new Date().toISOString()},
]

const SAMPLE_PDFS: PdfForm[] = [
  {id:1,title:'APSC CCE Syllabus 2026',category:'Syllabus',driveLink:'https://drive.google.com/file/d/example1/view',uploadedAt:'15 Feb 2026',downloads:12450},
  {id:2,title:'Assam Police SI Application Form',category:'Application Forms',driveLink:'https://drive.google.com/file/d/example2/view',uploadedAt:'20 Feb 2026',downloads:8200},
]

const DEFAULT_AFFILIATES: AffItem[] = [
  { id:1, category:'Exam Preparation', title:'Testbook Pass — All Govt Exam Prep', description:"India's #1 platform for SSC, Railway, Banking, UPSC, APSC & more. 10,000+ mock tests, live classes.", badge:'Best for Assam', logo:'📚', price:'₹299/month', originalPrice:'₹999/month', commission:'You earn ₹200–500 per referral', link:'https://testbook.com/?ref=YOUR_ID', highlights:['10,000+ Mock Tests','Live Classes in Assamese','APSC + SLPRB coverage','Current Affairs daily'], buttonText:'Start Free Trial →', tag:'RECOMMENDED', active:true },
  { id:2, category:'Exam Preparation', title:'Adda247 — SSC, Banking & Railway', description:'Trusted by 5 crore+ students. Best for SSC CGL, CHSL, Banking (SBI/IBPS), Railway RRB.', badge:'Top Rated', logo:'🏆', price:'₹399/month', originalPrice:'₹1,199/month', commission:'You earn ₹250–600 per referral', link:'https://adda247.com/?ref=YOUR_ID', highlights:['5 Cr+ Students Trust','SSC + Banking + Railway','Hindi & English medium','Expert faculty'], buttonText:'Enrol Now →', tag:'POPULAR', active:true },
  { id:3, category:'Exam Preparation', title:"BYJU's Exam Prep (Gradeup)", description:'Comprehensive preparation for UPSC, State PSC, Defence, Teaching (CTET/TET) exams.', badge:'For UPSC & PSC', logo:'🎯', price:'₹499/month', originalPrice:'₹1,499/month', commission:'You earn ₹350–800 per referral', link:'https://byjusexamprep.com/?ref=YOUR_ID', highlights:['UPSC + APSC focused','Previous year papers','Weekly mock tests','Expert mentors'], buttonText:'Explore Courses →', tag:'', active:true },
  { id:4, category:'Exam Preparation', title:'Unacademy — Live + Recorded Classes', description:"India's largest learning platform. UPSC, SSC, Railway, JEE, NEET, Banking live classes.", badge:'Live Classes', logo:'🎓', price:'₹599/month', originalPrice:'₹1,799/month', commission:'You earn ₹400–900 per referral', link:'https://unacademy.com/?ref=YOUR_ID', highlights:['Live interactive classes','Top educators','JEE + NEET + UPSC','Doubt clearing sessions'], buttonText:'Watch Free →', tag:'', active:true },
  { id:5, category:'Books & Study Material', title:'Assam GK & Current Affairs Book 2026', description:'Essential book for APSC, SLPRB, Assam Police and all state-level exams.', badge:'Must Have', logo:'📖', price:'₹280', originalPrice:'₹350', commission:'You earn ₹30–80 per sale (Amazon)', link:'https://amzn.in/d/YOUR_PRODUCT_ID', highlights:['Assam-specific content','Updated for 2026','APSC & SLPRB focused','Bilingual (En + As)'], buttonText:'Buy on Amazon →', tag:'NEW', active:true },
  { id:6, category:'Books & Study Material', title:'Lucent General Knowledge 2026', description:"India's most popular GK book for all competitive exams. Used by crores of students.", badge:'Bestseller', logo:'📕', price:'₹290', originalPrice:'₹360', commission:'You earn ₹30–70 per sale (Amazon)', link:'https://amzn.in/d/YOUR_PRODUCT_ID_2', highlights:["India's #1 GK book",'All subjects covered','Updated 2026 edition','Hindi & English'], buttonText:'Buy on Amazon →', tag:'POPULAR', active:true },
  { id:7, category:'Tools & Resources', title:'Current Affairs Monthly Magazine', description:'Stay updated with monthly current affairs — essential for all competitive exams.', badge:'Monthly', logo:'📰', price:'₹50/month', originalPrice:'₹80/month', commission:'You earn ₹15–40 per subscription', link:'https://YOUR_AFFILIATE_LINK', highlights:['National + International','Assam current affairs','Monthly PDF + print','MCQ practice'], buttonText:'Subscribe Now →', tag:'', active:true },
  { id:8, category:'Tools & Resources', title:'Amazon Prime Student — 6 Months Free', description:'Get 6 months of Amazon Prime FREE for students. Access Prime Reading, Video, and fast delivery.', badge:'6 Months Free', logo:'🛒', price:'FREE for 6 months', originalPrice:'₹599', commission:'You earn ₹100–200 per signup', link:'https://amzn.in/d/prime-student', highlights:['6 months free','Prime Reading','1000s of books','Fast delivery'], buttonText:'Claim Free Trial →', tag:'RECOMMENDED', active:true },
]

// ─── COMPONENT ────────────────────────────────────────────────────────────────
// Google Drive image URL — works publicly without login
function driveImgUrl(url: string): string {
  if (!url) return ''
  const m = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || url.match(/[?&]id=([a-zA-Z0-9_-]+)/)
  if (m) return `https://lh3.googleusercontent.com/d/${m[1]}`
  return url  // not a Drive link, use as-is
}

export default function AdminDashboard() {
  // Auth handled by middleware — no useSession needed

  // ── SECURITY: inactivity auto-logout after 30 minutes ─────────
  useEffect(() => {
    const TIMEOUT_MS = 30 * 60 * 1000
    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart']
    let timer: ReturnType<typeof setTimeout>
    const reset = () => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        signOut({ callbackUrl: '/admin/login' })
      }, TIMEOUT_MS)
    }
    events.forEach(e => window.addEventListener(e, reset))
    reset()
    return () => { clearTimeout(timer); events.forEach(e => window.removeEventListener(e, reset)) }
  }, [])

  const [activeTab, setActiveTab] = useState<Tab>('dashboard')
  const [timerEnabled, setTimerEnabled] = useState<boolean>(() => {
    try { const s=localStorage.getItem('acp_settings_v1'); return s?JSON.parse(s).timerEnabled!==false:true } catch{return true}
  })
  const [lang, setLang]           = useState<'en'|'as'>('en')

  // Data
  const [jobs,     setJobs]     = useState<Job[]>([])
  const [exams,    setExams]    = useState<Exam[]>([])
  const [infoList, setInfoList] = useState<InfoItem[]>([])
  const [pdfForms, setPdfForms] = useState<PdfForm[]>([])
  const [affiliates, setAffiliates] = useState<AffItem[]>([])

  // Modal flags
  const [showJobModal,  setShowJobModal]  = useState(false)
  const [showExamModal, setShowExamModal] = useState(false)
  const [showInfoModal, setShowInfoModal] = useState(false)
  const [showPdfModal,  setShowPdfModal]  = useState(false)
  const [showLogoModal, setShowLogoModal] = useState(false)
  const [showAffModal,  setShowAffModal]  = useState(false)
  const [editAff,       setEditAff]       = useState<AffItem|null>(null)
  const [af, setAf] = useState({ category:"Exam Preparation", title:"", description:"", badge:"", logo:"📚", price:"", originalPrice:"", commission:"", link:"", h1:"", h2:"", h3:"", h4:"", buttonText:"Start Free Trial →", tag:"", active:true })

  // Editing
  const [editJob,  setEditJob]  = useState<Job|null>(null)
  const [editExam, setEditExam] = useState<Exam|null>(null)
  const [editInfo, setEditInfo] = useState<InfoItem|null>(null)
const [dataLoaded, setDataLoaded] = useState(false)
  // Job form
  const BLANK_JF = { logo:'🏛️', title:'', org:'', category:'Govt Job', district:'All Districts', status:'Live' as Job['status'], fee:'', selection:'', website:'', howToApply:'', youtubeLink:'', description:'', advtNo:'', ageLimitDate:'', ageRelaxation:'SC/ST: 5 years\nOBC-MOBC: 3 years\nPwD (Unreserved): 10 years\nPwD (OBC): 13 years\nPwD (SC/ST): 15 years\nEx-Serviceman: 3 years', feeRefund:'', lastDateTime:'23:59 Hrs', paymentLastDate:'', paymentLastDateTime:'23:59 Hrs', correctionWindow:'', applicationStart:'', helplineEmail:'', helplinePhone:'', selectionDetails:'', syllabusDetails:'', zoneWiseVacancy:'', titleAs:'', orgAs:'', descriptionAs:'', howToApplyAs:'', selectionAs:'' }
  const [jf, setJf] = useState(BLANK_JF)
  const [posts,       setPosts]       = useState<Post[]>([])
  const [advPdfs,     setAdvPdfs]     = useState<AdvPdf[]>([])
  const [jobAffiliates, setJobAffiliates] = useState<JobAffiliate[]>([])
  const [jaImgRef] = useState<React.MutableRefObject<HTMLInputElement|null>>({current:null})
  const [dateHistory, setDateHistory] = useState<DateExt[]>([])

  // Exam form
  const blankExam = { emoji:'📚', title:'', conductedBy:'', category:'Teaching', description:'', applicationStart:'', applicationLastDate:'', paymentLastDate:'', examDate:'', examTime:'', admitCardDate:'', resultDate:'', fee:'', eligibility:'', syllabus:'', officialSite:'', applyLink:'', admitCardLink:'', status:'Upcoming' as Exam['status'], titleAs:'', descriptionAs:'', eligibilityAs:'', examPdfs:[] as {label:string;url:string}[], examAffiliates:[] as {id:string;title:string;link:string;img?:string;badge?:string}[] }
  const [ef, setEf] = useState(blankExam)

  // Info form
  const blankInfo = { emoji:'🗳️', title:'', category:'Electoral', description:'', lastDate:'', process:'', officialLink:'', status:'Active' as InfoItem['status'], titleAs:'', descriptionAs:'', processAs:'' }
  const [inf, setInf]       = useState(blankInfo)
  const [infDates, setInfDates] = useState<{label:string;date:string;time:string}[]>([])

  // PDF form form
  const [pf, setPf] = useState({ title:'', category:'Application Forms', driveLink:'', description:'', keywords:'', fileSize:'', pages:'', language:'English', source:'' })

  const [search,   setSearch]   = useState('')
  const [toastMsg, setToastMsg] = useState('')

  // ── Persistence — Load from SERVER first ─────────────────────────────────
  useEffect(() => {
    sessionStorage.setItem('__acp_wk', crypto.randomUUID())

    // Load all data from server — works on ALL devices
    Promise.all([
      fetch('/api/data/jobs',      { cache: 'no-store' }).then(r => r.json()).catch(() => null),
      fetch('/api/data/exams',      { cache: 'no-store' }).then(r => r.json()).catch(() => null),
      fetch('/api/data/info',      { cache: 'no-store' }).then(r => r.json()).catch(() => null),
      fetch('/api/data/pdfforms',      { cache: 'no-store' }).then(r => r.json()).catch(() => null),
      fetch('/api/data/affiliate',      { cache: 'no-store' }).then(r => r.json()).catch(() => null),
    ]).then(([jobs, exams, info, pdfs, aff]) => {
      setJobs(Array.isArray(jobs) && jobs.length > 0 ? jobs :
        (() => { try { const s = localStorage.getItem('acp_jobs_v6'); return s ? JSON.parse(s) : SAMPLE_JOBS } catch { return SAMPLE_JOBS } })())
      setExams(Array.isArray(exams) && exams.length > 0 ? exams :
        (() => { try { const s = localStorage.getItem('acp_exams_v6'); return s ? JSON.parse(s) : SAMPLE_EXAMS } catch { return SAMPLE_EXAMS } })())
      setInfoList(Array.isArray(info) && info.length > 0 ? info :
        (() => { try { const s = localStorage.getItem('acp_info_v6'); return s ? JSON.parse(s) : SAMPLE_INFO } catch { return SAMPLE_INFO } })())
      setPdfForms(Array.isArray(pdfs) && pdfs.length > 0 ? pdfs :
        (() => { try { const s = localStorage.getItem('acp_pdfforms_v6'); return s ? JSON.parse(s) : SAMPLE_PDFS } catch { return SAMPLE_PDFS } })())
      setAffiliates(Array.isArray(aff) && aff.length > 0 ? aff :
        (() => { try { const s = localStorage.getItem('acp_affiliate_v1'); return s ? JSON.parse(s) : DEFAULT_AFFILIATES } catch { return DEFAULT_AFFILIATES } })())
      setDataLoaded(true)
    })
  }, [])
  // ── SECURITY: write key prevents unauthorized localStorage writes ──
  function safeSet(key:string, val:unknown) {
    const wk = sessionStorage.getItem('__acp_wk')
    if (!wk) { console.warn('Write key missing — session may have expired'); return }
    try { localStorage.setItem(key, JSON.stringify(val)) }
    catch(e) { alert('⚠️ Storage quota exceeded!\n\nMake sure job banners and PDFs use Google Drive links — NOT file uploads.\n\nDelete old jobs with uploaded images/PDFs to free space.') }
  }
  useEffect(() => {
    if (!dataLoaded) return
    safeSet('acp_jobs_v6', jobs)
    fetch('/api/data/jobs', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(jobs) })
  }, [jobs])

  useEffect(() => {
    if (!dataLoaded) return
    safeSet('acp_exams_v6', exams)
    fetch('/api/data/exams', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(exams) })
  }, [exams])

  useEffect(() => {
    if (!dataLoaded) return
    safeSet('acp_info_v6', infoList)
    fetch('/api/data/info', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(infoList) })
  }, [infoList])

  useEffect(() => {
    if (!dataLoaded) return
    safeSet('acp_pdfforms_v6', pdfForms)
    fetch('/api/data/pdfforms', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(pdfForms) })
  }, [pdfForms])

  useEffect(() => {
    if (!dataLoaded) return
    safeSet('acp_affiliate_v1', affiliates)
    fetch('/api/data/affiliate', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(affiliates) })
  }, [affiliates])
  const toast = (msg:string) => { setToastMsg(msg); setTimeout(()=>setToastMsg(''), 2800) }
  const fmt   = (d:string|undefined|null) => { if(!d) return '—'; try { return new Date(d).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'}) } catch { return d } }

  // ── JOB HELPERS ──────────────────────────────────────────────────────────
  function openAddJob() {
    setEditJob(null)
    setJf(BLANK_JF)
    setPosts([]); setAdvPdfs([]); setJobAffiliates([]); setDateHistory([])
    setShowJobModal(true)
  }
  function openEditJob(j:Job) {
    setEditJob(j)
    setJf({ logo:j.logo, title:j.title, org:j.org, category:j.category, district:j.district, status:j.status, fee:j.fee||'', selection:j.selection||'', website:j.website||'', howToApply:j.howToApply||'', youtubeLink:j.youtubeLink||'', description:j.description||'', advtNo:j.advtNo||'', ageLimitDate:j.ageLimitDate||'', ageRelaxation:j.ageRelaxation||'SC/ST: 5 years\nOBC-MOBC: 3 years\nPwD (Unreserved): 10 years\nPwD (OBC): 13 years\nPwD (SC/ST): 15 years\nEx-Serviceman: 3 years', feeRefund:j.feeRefund||'', lastDateTime:j.lastDateTime||'23:59 Hrs', paymentLastDate:j.paymentLastDate||'', paymentLastDateTime:j.paymentLastDateTime||'23:59 Hrs', correctionWindow:j.correctionWindow||'', applicationStart:j.applicationStart||'', helplineEmail:j.helplineEmail||'', helplinePhone:j.helplinePhone||'', selectionDetails:j.selectionDetails||'', syllabusDetails:j.syllabusDetails||'', zoneWiseVacancy:j.zoneWiseVacancy||'', titleAs:j.titleAs||'', orgAs:j.orgAs||'', descriptionAs:j.descriptionAs||'', howToApplyAs:j.howToApplyAs||'', selectionAs:j.selectionAs||'' })
    setPosts(j.posts||[]); setAdvPdfs(j.advPdfs||[]); setJobAffiliates(j.jobAffiliates||[]); setDateHistory(j.dateHistory||[])
    setShowJobModal(true)
  }
  function addPost() {
    setPosts(p => [...p, { id:Date.now().toString(), name:'', dept:'', vacancy:0, qualification:'', ageMin:18, ageMax:38, salary:'', lastDate:'', applyLink:'' }])
  }
  function updPost(id:string, field:keyof Post, val:string|number) {
    setPosts(p => p.map(x => x.id===id ? {...x,[field]:val} : x))
  }
  function extendDate() {
    const date = prompt('New last date (YYYY-MM-DD):')
    if (!date) return
    const note = prompt('Reason / Authority:') || 'Extended by authority'
    setDateHistory(h => [...h, { date, note, extendedOn: new Date().toISOString() }])
    setPosts(p => p.map(x => ({ ...x, lastDate: date })))
    toast('✅ Last date extended!')
  }
  function saveJob(e:React.FormEvent) {
    e.preventDefault()
    if (!jf.title) { alert('Job Title is required.'); return }
    if (jf.title.length > 250) { alert('Job title too long (max 250 characters).'); return }
    const urlFields = [jf.website, ...(posts.map(p=>p.applyLink))]
    for (const u of urlFields) {
      if (u && !/^https?:\/\//i.test(u)) { alert('All links must start with https://'); return }
      if (u?.toLowerCase().startsWith('javascript:')) { alert('Invalid link detected.'); return }
    }
    const totalV   = posts.reduce((a,p) => a+(p.vacancy||0), 0)
    const latestLD = posts.length ? [...posts].sort((a,b)=>b.lastDate.localeCompare(a.lastDate))[0].lastDate : editJob?.lastDate||''
    const finalLD  = dateHistory.length ? dateHistory.at(-1)!.date : latestLD
    const base: Partial<Job> = {
      ...jf, posts, advPdfs, jobAffiliates, dateHistory,
      vacancy:     totalV ? String(totalV) : (editJob?.vacancy||'0'),
      lastDate:    finalLD,
      applyLink:   posts[0]?.applyLink || editJob?.applyLink || '',
      qualification: posts[0]?.qualification || editJob?.qualification || '',
      ageLimit:    posts.length ? `${Math.min(...posts.map(p=>p.ageMin))}–${Math.max(...posts.map(p=>p.ageMax))}` : (editJob?.ageLimit||''),
      salary:      posts[0]?.salary || editJob?.salary || '',
    }
    if (editJob) setJobs(prev => prev.map(j => j.id===editJob.id ? {...editJob,...base} as Job : j))
    else         setJobs(prev => [{id:Date.now(),createdAt:new Date().toISOString(),...base} as Job, ...prev])
    setShowJobModal(false); toast('✅ Job saved!')
  }

  // ── EXAM HELPERS ─────────────────────────────────────────────────────────
  function openAddExam()  { setEditExam(null); setEf(blankExam); setShowExamModal(true) }
  function openEditExam(x:Exam) { setEditExam(x); setEf({ emoji:x.emoji, title:x.title, conductedBy:x.conductedBy, category:x.category, description:x.description||'', applicationStart:x.applicationStart||'', applicationLastDate:x.applicationLastDate||'', paymentLastDate:x.paymentLastDate||'', examDate:x.examDate||'', examTime:x.examTime||'', admitCardDate:x.admitCardDate||'', resultDate:x.resultDate||'', fee:x.fee||'', eligibility:x.eligibility||'', syllabus:x.syllabus||'', officialSite:x.officialSite||'', applyLink:x.applyLink||'', admitCardLink:x.admitCardLink||'', status:x.status, titleAs:x.titleAs||'', descriptionAs:x.descriptionAs||'', eligibilityAs:x.eligibilityAs||'', examPdfs:x.examPdfs||[], examAffiliates:x.examAffiliates||[] }); setShowExamModal(true) }
  function saveExam(e:React.FormEvent) {
    e.preventDefault()
    if (!ef.title) { alert('Title required.'); return }
    if (editExam) setExams(prev => prev.map(x => x.id===editExam.id ? {...editExam,...ef} : x))
    else          setExams(prev => [{id:Date.now(),createdAt:new Date().toISOString(),...ef}, ...prev])
    setShowExamModal(false); toast('✅ Exam saved!')
  }

  // ── INFO HELPERS ─────────────────────────────────────────────────────────
  function openAddInfo()  { setEditInfo(null); setInf(blankInfo); setInfDates([]); setShowInfoModal(true) }
  function openEditInfo(i:InfoItem) { setEditInfo(i); setInf({ emoji:i.emoji, title:i.title, category:i.category, description:i.description||'', lastDate:i.lastDate||'', process:i.process||'', officialLink:i.officialLink||'', status:i.status, titleAs:i.titleAs||'', descriptionAs:i.descriptionAs||'', processAs:i.processAs||'' }); setInfDates((i.importantDates||[]).map(d=>({label:d.label,date:d.date,time:d.time||''}))); setShowInfoModal(true) }
  function saveInfo(e:React.FormEvent) {
    e.preventDefault()
    if (!inf.title) { alert('Title required.'); return }
    const dates = infDates.filter(d=>d.label&&d.date).map(d => ({label:d.label,date:d.date,...(d.time?{time:d.time}:{})}))
    if (editInfo) setInfoList(prev => prev.map(x => x.id===editInfo.id ? {...editInfo,...inf,importantDates:dates} : x))
    else          setInfoList(prev => [{id:Date.now(),createdAt:new Date().toISOString(),...inf,importantDates:dates}, ...prev])
    setShowInfoModal(false); toast('✅ Information saved!')
  }

  // ── PDF FORM HELPERS ─────────────────────────────────────────────────────
  function savePdfForm(e:React.FormEvent) {
    e.preventDefault()
    if (!pf.title||!pf.driveLink) { alert('Title and Google Drive link required.'); return }
    setPdfForms(prev => [{
      id:Date.now(), title:pf.title, category:pf.category, driveLink:pf.driveLink,
      uploadedAt:new Date().toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'}),
      downloads:0,
      description:pf.description||undefined, keywords:pf.keywords||undefined,
      fileSize:pf.fileSize||undefined, pages:pf.pages||undefined,
      language:pf.language||undefined, source:pf.source||undefined,
    },...prev])
    setPf({ title:'', category:'Application Forms', driveLink:'', description:'', keywords:'', fileSize:'', pages:'', language:'English', source:'' })
    setShowPdfModal(false); toast('✅ PDF Form added!')
  }

  // ── STYLES ───────────────────────────────────────────────────────────────
  const si: React.CSSProperties = { width:'100%', background:'#f0f4f8', border:'1.5px solid #d4e0ec', borderRadius:8, padding:'9px 12px', color:'#1a1a2e', fontFamily:'Nunito,sans-serif', fontSize:'0.84rem', outline:'none' }
  const lb: React.CSSProperties = { display:'block', fontSize:'0.72rem', fontWeight:700, color:'#5a6a7a', marginBottom:5, letterSpacing:'0.03em', textTransform:'uppercase' as const }
  const bR: React.CSSProperties = { padding:'9px 18px', borderRadius:99, border:'none', background:'#e63946', color:'#fff', fontWeight:700, cursor:'pointer', fontFamily:'Nunito,sans-serif', fontSize:'0.83rem' }
  const bT: React.CSSProperties = { ...bR, background:'#00b4d8' }
  const bG: React.CSSProperties = { ...bR, background:'#2a9d8f' }
  const bO: React.CSSProperties = { ...bR, background:'#f4a261', color:'#1a1a2e' }
  const bP: React.CSSProperties = { ...bR, background:'#6a0dad' }
  const bS: React.CSSProperties = { ...bR, background:'transparent', border:'1.5px solid #d4e0ec', color:'#1a1a2e' }

  const navItems = [
    { icon:'🏠', label:'Dashboard',    tab:'dashboard' as Tab, active: '#00b4d8' },
    { icon:'💼', label:'Job Vacancies',tab:'jobs'      as Tab, active: '#e63946' },
    { icon:'📚', label:'Exams',        tab:'exams'     as Tab, active: '#f4a261' },
    { icon:'ℹ️', label:'Information',  tab:'info'      as Tab, active: '#2a9d8f' },
    { icon:'📄', label:'PDF Forms',    tab:'pdfforms'  as Tab, active: '#6a0dad' },
    { icon:'🤝', label:'Affiliates',   tab:'affiliate' as Tab, active: '#c9a227' },
    { icon:'⚙️', label:'Settings',     tab:'settings'  as Tab, active: '#8fa3b8' },
  ]

  const filt = <T extends {title:string}>(arr: T[]) => arr.filter(x => x.title.toLowerCase().includes(search.toLowerCase()))

  return (
    <>
      {/* ── GLOBAL STYLES ── */}
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        html, body { overflow-x: hidden; max-width: 100vw; margin: 0; font-family: Nunito, sans-serif; }
        .nbtn { display:flex;align-items:center;gap:9px;padding:9px 12px;border-radius:9px;font-size:.83rem;font-weight:600;margin-bottom:2px;cursor:pointer;border:1px solid transparent;transition:.15s;width:100%;background:none;text-align:left;color:rgba(255,255,255,.5);font-family:Nunito,sans-serif; }
        .nbtn:hover { background:rgba(255,255,255,.07); }
        .nbtn.on { color:#00b4d8;background:rgba(0,180,216,.15);border-color:rgba(0,180,216,.2); }
        .ovl { position:fixed;inset:0;background:rgba(13,27,42,.75);backdrop-filter:blur(5px);z-index:300;display:flex;align-items:flex-start;justify-content:center;padding:16px;overflow-y:auto; }
        .mdl { background:#fff;border-radius:18px;width:100%;max-width:820px;box-shadow:0 30px 80px rgba(0,0,0,.35);margin:auto; }
        .mhd { padding:17px 24px;border-bottom:1px solid #d4e0ec;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;background:#fff;z-index:1;border-radius:18px 18px 0 0; }
        .mhd h2 { font-family:'Sora',sans-serif;font-weight:700;font-size:.97rem;color:#1a1a2e; }
        .mbdy { padding:20px 24px;max-height:82vh;overflow-y:auto; }
        .g2 { display:grid;grid-template-columns:1fr 1fr;gap:12px; }
        .g3 { display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px; }
        .fg { margin-bottom:12px; }
        .sh { font-family:'Sora',sans-serif;font-weight:700;font-size:.86rem;color:#0d1b2a;padding:10px 0 8px;border-bottom:2px solid #f0f4f8;margin:4px 0 12px;display:flex;align-items:center;gap:8px; }
        .prow { background:#f8fbff;border:1.5px solid #d4e0ec;border-radius:10px;padding:14px;margin-bottom:10px; }
        .prgrid { display:grid;grid-template-columns:repeat(3,1fr);gap:9px; }
        .tbl { width:100%;border-collapse:collapse;font-size:.8rem; }
        .tbl th { background:#f0f4f8;padding:9px 12px;text-align:left;font-size:.69rem;font-weight:700;color:#5a6a7a;text-transform:uppercase;white-space:nowrap; }
        .tbl td { padding:9px 12px;border-bottom:1px solid #f5f7fa;vertical-align:middle; }
        .chip { display:inline-block;padding:2px 9px;border-radius:99px;font-size:.67rem;font-weight:700; }
        .cR { background:#fde8ea;color:#e63946; } .cT { background:#e0f7fc;color:#0096b7; }
        .cG { background:#e8f5e9;color:#2e7d32; } .cO { background:#fff3e0;color:#c0622a; }
        .cP { background:#f3e5f5;color:#6a0dad; } .cGr { background:#f0f4f8;color:#5a6a7a; }
        .acpdf { display:inline-flex;align-items:center;gap:6px;background:#e0f7fc;border:1.5px solid #b2ebf5;border-radius:7px;padding:4px 9px;font-size:.73rem;font-weight:700;color:#0096b7;margin:3px; }
        .exthip { display:inline-flex;align-items:center;gap:6px;background:#e8f5e9;border:1.5px solid #a5d6a7;border-radius:7px;padding:4px 9px;font-size:.71rem;font-weight:600;color:#2e7d32;margin:3px; }
        .scard { background:#fff;border:1.5px solid #d4e0ec;border-radius:12px;padding:18px 20px;display:flex;align-items:center;gap:14px; }
        .dz { border:2px dashed #d4e0ec;border-radius:9px;padding:18px;text-align:center;cursor:pointer;background:#f8fafd;font-size:.82rem;color:#5a6a7a;transition:.15s; }
        .dz:hover { border-color:#00b4d8;background:#e0f7fc; }
        .lgrid { display:grid;grid-template-columns:repeat(8,1fr);gap:7px; }
        .lopt { width:100%;aspect-ratio:1;border:2px solid #d4e0ec;border-radius:9px;background:#f8fafd;display:flex;align-items:center;justify-content:center;font-size:1.35rem;cursor:pointer;transition:.12s; }
        .lopt.on { border-color:#00b4d8;background:#e0f7fc; }
        .idrow { display:grid;grid-template-columns:1fr 1fr 1fr auto;gap:8px;align-items:end;margin-bottom:8px; }
        @keyframes tst { 0%{opacity:0;transform:translateY(10px)}15%{opacity:1;transform:none}85%{opacity:1}100%{opacity:0} }
        .tst { animation: tst 2.8s forwards; }
        nav::-webkit-scrollbar { width:4px; }
        nav::-webkit-scrollbar-track { background:transparent; }
        nav::-webkit-scrollbar-thumb { background:rgba(255,255,255,.15);border-radius:99px; }
        nav::-webkit-scrollbar-thumb:hover { background:rgba(255,255,255,.3); }
        @media(max-width:900px) { .g2,.g3 { grid-template-columns:1fr; } .prgrid { grid-template-columns:1fr 1fr; } .lgrid { grid-template-columns:repeat(6,1fr); } }
      `}</style>

      {/* TOAST */}
      {toastMsg && (
        <div className="tst" style={{ position:'fixed',bottom:24,right:24,background:'#0d1b2a',color:'#fff',padding:'11px 22px',borderRadius:99,fontWeight:700,fontSize:'.87rem',zIndex:9999,boxShadow:'0 8px 30px rgba(0,0,0,.35)' }}>{toastMsg}</div>
      )}

      <div style={{ display:'flex', minHeight:'100vh', background:'#f0f4f8' }}>

        {/* ══════ SIDEBAR ══════ */}
        <aside style={{ width:200, background:'#0d1b2a', height:'100vh', position:'fixed', top:0, left:0, display:'flex', flexDirection:'column', zIndex:100, overflow:'hidden' }}>
          {/* Brand */}
          <div style={{ padding:'16px 16px 13px', borderBottom:'1px solid rgba(255,255,255,.07)' }}>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <div style={{ width:38,height:38,background:'linear-gradient(135deg,#e63946,#f4a261)',borderRadius:9,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Sora',sans-serif",fontWeight:800,color:'#fff',fontSize:'1.05rem',flexShrink:0 }}>A</div>
              <div>
                <div style={{ fontFamily:"'Sora',sans-serif",fontWeight:800,fontSize:'.83rem',color:'#fff',lineHeight:1.2 }}>Assam Career<br/><span style={{color:'#00b4d8'}}>Point & Info</span></div>
              </div>
            </div>
            <div style={{ fontSize:'.58rem',color:'rgba(255,255,255,.22)',letterSpacing:'.08em',marginTop:6 }}>ADMIN PANEL v6</div>
          </div>

          {/* Lang */}
          <div style={{ padding:'9px 13px', borderBottom:'1px solid rgba(255,255,255,.07)' }}>
            <div style={{ display:'flex',background:'rgba(255,255,255,.08)',borderRadius:99,padding:3 }}>
              {(['en','as'] as const).map(l => (
                <button key={l} onClick={()=>setLang(l)} style={{ flex:1,padding:'5px 0',borderRadius:99,fontSize:'.73rem',fontWeight:700,background:lang===l?'#00b4d8':'transparent',color:lang===l?'#fff':'rgba(255,255,255,.45)',border:'none',cursor:'pointer',fontFamily:'Nunito,sans-serif' }}>
                  {l==='en'?'🇬🇧 EN':'🇮🇳 অস'}
                </button>
              ))}
            </div>
          </div>

          {/* Nav */}
          <nav style={{ flex:1,padding:'11px 10px',overflowY:'auto' }}>
            {navItems.map(n => (
              <button key={n.tab} onClick={()=>setActiveTab(n.tab)} className={`nbtn ${activeTab===n.tab?'on':''}`}>
                <span style={{ width:20,textAlign:'center' as const,fontSize:'.95rem' }}>{n.icon}</span>
                {n.label}
              </button>
            ))}

            {/* ── OTHER CMS section ── */}
            <div style={{ height:1,background:'rgba(255,255,255,.07)',margin:'10px 0' }} />
            <div style={{ fontSize:'.63rem',fontWeight:700,color:'rgba(255,255,255,.22)',letterSpacing:'.08em',marginBottom:5,paddingLeft:10 }}>OTHER CMS ↗</div>
            {([
              ['🏆','Results CMS','/admin/results'],
              ['📢','Others CMS','/admin/others'],
            ] as [string,string,string][]).map(([ico,lbl,href]) => (
              <a key={href} href={href} className="nbtn" style={{ textDecoration:'none',fontSize:'.76rem' }}>
                <span style={{ width:20,textAlign:'center' as const }}>{ico}</span>{lbl}
              </a>
            ))}

            {/* ── PUBLIC PAGES section ── */}
            <div style={{ height:1,background:'rgba(255,255,255,.07)',margin:'10px 0' }} />
            <div style={{ fontSize:'.63rem',fontWeight:700,color:'rgba(255,255,255,.22)',letterSpacing:'.08em',marginBottom:5,paddingLeft:10 }}>PUBLIC PAGES ↗</div>
            {([
              ['🏠','Home','/'],
              ['💼','Govt Jobs','/govt-jobs'],
              ['📚','Exams','/exams'],
              ['ℹ️','Information','/information'],
              ['📄','PDF Forms','/pdf-forms'],
              ['🏆','Results','/results'],
              ['📢','Announcements','/announcements'],
              ['📖','Guides','/guides'],
              ['🛎️','Services','/services'],
            ] as [string,string,string][]).map(([ico,lbl,href]) => (
              <a key={href} href={href} target="_blank" rel="noreferrer" className="nbtn" style={{ textDecoration:'none',fontSize:'.76rem' }}>
                <span style={{ width:20,textAlign:'center' as const }}>{ico}</span>{lbl}
              </a>
            ))}
          </nav>

          {/* Profile */}
          <div style={{ padding:'11px 10px',borderTop:'1px solid rgba(255,255,255,.07)' }}>
            <div style={{ display:'flex',alignItems:'center',gap:9,padding:'9px 10px',borderRadius:10,background:'rgba(255,255,255,.05)' }}>
              <div style={{ width:32,height:32,borderRadius:8,background:'linear-gradient(135deg,#00b4d8,#6a0dad)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,color:'#fff',fontSize:'.8rem',flexShrink:0 }}>AD</div>
              <div style={{ flex:1 }}><div style={{ fontSize:'.78rem',fontWeight:700,color:'rgba(255,255,255,.8)' }}>Admin</div><div style={{ fontSize:'.62rem',color:'rgba(255,255,255,.3)' }}>Super Admin</div></div>
              <button onClick={()=>signOut({callbackUrl:'/admin/login'})} style={{ background:'none',border:'none',color:'rgba(255,255,255,.3)',cursor:'pointer',fontSize:'1rem' }} title="Logout">⏏</button>
            </div>
          </div>
        </aside>

        {/* ══════ MAIN ══════ */}
        <main style={{ marginLeft:200,flex:1,minWidth:0,overflowX:'hidden' }}>

          {/* Top bar */}
          <div style={{ background:'#fff',borderBottom:'1px solid #d4e0ec',padding:'12px 26px',display:'flex',alignItems:'center',justifyContent:'space-between',position:'sticky',top:0,zIndex:50,gap:12 }}>
            <div>
              <h1 style={{ fontFamily:"'Sora',sans-serif",fontSize:'1.05rem',fontWeight:700,color:'#1a1a2e' }}>
                {activeTab==='dashboard'&&'🏠 Dashboard'}{activeTab==='jobs'&&'💼 Job Vacancies'}{activeTab==='exams'&&'📚 Competitive Exams'}{activeTab==='info'&&'ℹ️ Information'}{activeTab==='pdfforms'&&'📄 PDF Forms Library'}{activeTab==='affiliate'&&'🤝 Affiliate Partners'}{activeTab==='settings'&&'⚙️ Settings'}
              </h1>
              <p style={{ fontSize:'.74rem',color:'#5a6a7a',marginTop:1 }}>Assam Career Point & Info — Admin</p>
            </div>
            <div style={{ display:'flex',gap:9,alignItems:'center',flexWrap:'wrap' as const }}>
              {activeTab!=='dashboard'&&activeTab!=='settings' && (
                <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Search..." style={{ ...si,width:190,padding:'7px 12px' }} />
              )}
              {activeTab==='jobs'     && <button onClick={openAddJob}            style={bR}>➕ Add Job</button>}
              {activeTab==='exams'    && <button onClick={openAddExam}           style={bO}>➕ Add Exam</button>}
              {activeTab==='info'     && <button onClick={openAddInfo}           style={bG}>➕ Add Info</button>}
              {activeTab==='pdfforms' && <button onClick={()=>setShowPdfModal(true)} style={bP}>➕ Add PDF Form</button>}
              {activeTab==='affiliate' && <button onClick={()=>{setEditAff(null);setAf({category:'Exam Preparation',title:'',description:'',badge:'',logo:'📚',price:'',originalPrice:'',commission:'',link:'',h1:'',h2:'',h3:'',h4:'',buttonText:'Start Free Trial →',tag:'',active:true});setShowAffModal(true)}} style={{padding:'8px 16px',borderRadius:8,background:'#c9a227',color:'#0b1f33',fontWeight:900,fontSize:'.82rem',border:'none',cursor:'pointer',fontFamily:'Nunito,sans-serif'}}>➕ Add Affiliate</button>}
            </div>
          </div>

          <div style={{ padding:24 }}>

            {/* ── DASHBOARD ── */}
            {activeTab==='dashboard' && (
              <>
                <MigrateButton />
                {/* Stats cards — 3 columns × 2 rows */}
                <div style={{ display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14,marginBottom:24 }}>
                  {[
                    {ico:'💼',bg:'#fde8ea',val:jobs.length,        lbl:'Job Vacancies', sub:`${jobs.filter(j=>j.status==='Live').length} live`},
                    {ico:'📚',bg:'#fff3e0',val:exams.length,       lbl:'Exams',         sub:`${exams.filter(e=>e.status==='Registration Open').length} open`},
                    {ico:'ℹ️',bg:'#e8f5e9',val:infoList.length,    lbl:'Information',   sub:`${infoList.filter(i=>i.status==='Active').length} active`},
                    {ico:'📄',bg:'#f3e5f5',val:pdfForms.length,    lbl:'PDF Forms',     sub:'Google Drive'},
                    {ico:'🏆',bg:'#e0f7fc',val:'→',                lbl:'Results CMS',   sub:<a href="/admin/results" style={{color:'#0096b7',fontWeight:700,textDecoration:'none',fontSize:'.68rem'}}>Open CMS ↗</a>},
                    {ico:'📢',bg:'#e8f5e9',val:'→',                lbl:'Others CMS',    sub:<a href="/admin/others"  style={{color:'#2a9d8f',fontWeight:700,textDecoration:'none',fontSize:'.68rem'}}>Open CMS ↗</a>},
                  ].map(s => (
                    <div key={s.lbl} className="scard">
                      <div style={{ width:44,height:44,borderRadius:11,background:s.bg,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.3rem',flexShrink:0 }}>{s.ico}</div>
                      <div>
                        <div style={{ fontFamily:"'Sora',sans-serif",fontSize:'1.5rem',fontWeight:800,color:'#1a1a2e',lineHeight:1 }}>{s.val}</div>
                        <div style={{ fontSize:'.71rem',color:'#5a6a7a',marginTop:2 }}>{s.lbl}</div>
                        <div style={{ fontSize:'.68rem',color:'#2a9d8f',marginTop:1 }}>↑ {s.sub}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Quick-action buttons — 3 columns × 2 rows */}
                <div style={{ display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12 }}>
                  {[
                    {ico:'➕',lbl:'Add Job Vacancy',  act:openAddJob,                            bg:'#e63946'},
                    {ico:'📚',lbl:'Add Exam',         act:openAddExam,                           bg:'#f4a261'},
                    {ico:'ℹ️',lbl:'Add Information',  act:openAddInfo,                           bg:'#2a9d8f'},
                    {ico:'📄',lbl:'Add PDF Form',     act:()=>setShowPdfModal(true),             bg:'#6a0dad'},
                    {ico:'🏆',lbl:'Results CMS',      act:()=>{ window.location.href='/admin/results' }, bg:'#00b4d8'},
                    {ico:'📢',lbl:'Others CMS',       act:()=>{ window.location.href='/admin/others'  }, bg:'#1dbfad'},
                  ].map(q => (
                    <button key={q.lbl} onClick={q.act} style={{ background:'#fff',border:'1.5px solid #d4e0ec',borderRadius:12,padding:'18px',cursor:'pointer',textAlign:'left' as const,fontFamily:'Nunito,sans-serif' }}>
                      <div style={{ width:38,height:38,borderRadius:10,background:q.bg,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.2rem',marginBottom:10 }}>{q.ico}</div>
                      <div style={{ fontFamily:"'Sora',sans-serif",fontWeight:700,fontSize:'.84rem',color:'#1a1a2e' }}>{q.lbl}</div>
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* ── JOBS TABLE ── */}
            {activeTab==='jobs' && (
              <div style={{ background:'#fff',border:'1.5px solid #d4e0ec',borderRadius:12,overflow:'hidden' }}>
                <div style={{ overflowX:'auto' }}>
                  <table className="tbl">
                    <thead><tr><th>Logo</th><th>Title</th><th>Posts</th><th>Vacancies</th><th>Last Date</th><th>Adv.PDFs</th><th>Status</th><th>Actions</th></tr></thead>
                    <tbody>
                      {filt(jobs).length===0
                        ? <tr><td colSpan={8} style={{ textAlign:'center' as const,padding:40,color:'#5a6a7a' }}>No jobs. Click "Add Job".</td></tr>
                        : filt(jobs).map(j => (
                          <tr key={j.id}>
                            <td style={{ fontSize:'1.3rem' }}>{j.logo}</td>
                            <td><div style={{ fontWeight:700,maxWidth:190,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' as const }}>{j.title}</div><div style={{ fontSize:'.71rem',color:'#5a6a7a' }}>{j.org}</div></td>
                            <td><span className="chip cT">{j.posts?.length||0} posts</span></td>
                            <td style={{ fontWeight:700 }}>{(j.posts||[]).reduce((a,p)=>a+p.vacancy,0)||parseInt(j.vacancy||'0')}</td>
                            <td style={{ fontSize:'.76rem',whiteSpace:'nowrap' as const }}>
                              {fmt(j.lastDate)}
                              {(j.dateHistory?.length||0)>0&&<span title={`Extended ${j.dateHistory.length}x`} style={{ marginLeft:5,fontSize:'.63rem',background:'#e8f5e9',color:'#2e7d32',padding:'1px 6px',borderRadius:99,fontWeight:700 }}>+{j.dateHistory.length} ext</span>}
                            </td>
                            <td><span className="chip cP">{j.advPdfs?.length||0} PDF{(j.advPdfs?.length||0)!==1?'s':''}</span></td>
                            <td>
                              <button onClick={()=>setJobs(p=>p.map(x=>x.id===j.id?{...x,status:x.status==='Live'?'Draft':'Live'}:x))} className={`chip ${j.status==='Live'?'cG':'cGr'}`} style={{ cursor:'pointer',border:'none' }}>
                                {j.status==='Live'?'🟢 Live':'⚪ Draft'}
                              </button>
                            </td>
                            <td>
                              <div style={{ display:'flex',gap:5 }}>
                                <button onClick={()=>openEditJob(j)} style={{ padding:'5px 9px',borderRadius:7,fontSize:'.72rem',fontWeight:700,cursor:'pointer',background:'#e0f7fc',color:'#0096b7',border:'1.5px solid #b2ebf5',fontFamily:'Nunito,sans-serif' }}>✏️</button>
                                <button onClick={()=>{if(confirm('Delete?'))setJobs(p=>p.filter(x=>x.id!==j.id))}} style={{ padding:'5px 9px',borderRadius:7,fontSize:'.72rem',fontWeight:700,cursor:'pointer',background:'#fde8ea',color:'#e63946',border:'1.5px solid #f7bcc0',fontFamily:'Nunito,sans-serif' }}>🗑</button>
                              </div>
                            </td>
                          </tr>
                        ))
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ── EXAMS TABLE ── */}
            {activeTab==='exams' && (
              <div style={{ background:'#fff',border:'1.5px solid #d4e0ec',borderRadius:12,overflow:'hidden' }}>
                <div style={{ overflowX:'auto' }}>
                  <table className="tbl">
                    <thead><tr><th>Exam</th><th>By</th><th>Category</th><th>Apply By</th><th>💳 Payment By</th><th>📅 Exam Date & Time</th><th>Status</th><th>Actions</th></tr></thead>
                    <tbody>
                      {filt(exams).length===0
                        ? <tr><td colSpan={8} style={{ textAlign:'center' as const,padding:40,color:'#5a6a7a' }}>No exams. Click "Add Exam".</td></tr>
                        : filt(exams).map(x => (
                          <tr key={x.id}>
                            <td><div style={{ fontWeight:700,maxWidth:170,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' as const }}>{x.emoji} {x.title}</div></td>
                            <td style={{ fontSize:'.77rem',color:'#5a6a7a',whiteSpace:'nowrap' as const }}>{x.conductedBy}</td>
                            <td><span className="chip cO">{x.category}</span></td>
                            <td style={{ fontSize:'.76rem',color:'#e63946',fontWeight:700,whiteSpace:'nowrap' as const }}>{fmt(x.applicationLastDate)}</td>
                            <td style={{ fontSize:'.76rem',color:'#6a0dad',fontWeight:700,whiteSpace:'nowrap' as const }}>{fmt(x.paymentLastDate)}</td>
                            <td style={{ fontSize:'.76rem',whiteSpace:'nowrap' as const }}><strong>{fmt(x.examDate)}</strong><br/><span style={{ color:'#5a6a7a',fontSize:'.67rem' }}>{x.examTime}</span></td>
                            <td><span className={`chip ${x.status==='Registration Open'?'cG':x.status==='Upcoming'?'cT':'cGr'}`}>{x.status}</span></td>
                            <td>
                              <div style={{ display:'flex',gap:5 }}>
                                <button onClick={()=>openEditExam(x)} style={{ padding:'5px 9px',borderRadius:7,fontSize:'.72rem',fontWeight:700,cursor:'pointer',background:'#e0f7fc',color:'#0096b7',border:'1.5px solid #b2ebf5',fontFamily:'Nunito,sans-serif' }}>✏️</button>
                                <button onClick={()=>{if(confirm('Delete?'))setExams(p=>p.filter(e=>e.id!==x.id))}} style={{ padding:'5px 9px',borderRadius:7,fontSize:'.72rem',fontWeight:700,cursor:'pointer',background:'#fde8ea',color:'#e63946',border:'1.5px solid #f7bcc0',fontFamily:'Nunito,sans-serif' }}>🗑</button>
                              </div>
                            </td>
                          </tr>
                        ))
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ── INFO TABLE ── */}
            {activeTab==='info' && (
              <div style={{ background:'#fff',border:'1.5px solid #d4e0ec',borderRadius:12,overflow:'hidden' }}>
                <div style={{ overflowX:'auto' }}>
                  <table className="tbl">
                    <thead><tr><th>Title</th><th>Category</th><th>Overall Deadline</th><th>Key Dates</th><th>Status</th><th>Actions</th></tr></thead>
                    <tbody>
                      {filt(infoList).length===0
                        ? <tr><td colSpan={6} style={{ textAlign:'center' as const,padding:40,color:'#5a6a7a' }}>No information. Click "Add Info".</td></tr>
                        : filt(infoList).map(i => (
                          <tr key={i.id}>
                            <td><div style={{ fontWeight:700,maxWidth:200,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' as const }}>{i.emoji} {i.title}</div></td>
                            <td><span className="chip cT">{i.category}</span></td>
                            <td style={{ fontSize:'.76rem',color:'#e63946',fontWeight:700,whiteSpace:'nowrap' as const }}>{i.lastDate?fmt(i.lastDate):'—'}</td>
                            <td>
                              {i.importantDates.slice(0,2).map((d,idx) => (
                                <div key={idx} style={{ fontSize:'.71rem',color:'#5a6a7a' }}>{d.label}: <strong style={{color:'#0d1b2a'}}>{fmt(d.date)}{d.time?` at ${d.time}`:''}</strong></div>
                              ))}
                            </td>
                            <td><span className={`chip ${i.status==='Active'?'cG':i.status==='Upcoming'?'cT':'cGr'}`}>{i.status}</span></td>
                            <td>
                              <div style={{ display:'flex',gap:5 }}>
                                <button onClick={()=>openEditInfo(i)} style={{ padding:'5px 9px',borderRadius:7,fontSize:'.72rem',fontWeight:700,cursor:'pointer',background:'#e0f7fc',color:'#0096b7',border:'1.5px solid #b2ebf5',fontFamily:'Nunito,sans-serif' }}>✏️</button>
                                <button onClick={()=>{if(confirm('Delete?'))setInfoList(p=>p.filter(x=>x.id!==i.id))}} style={{ padding:'5px 9px',borderRadius:7,fontSize:'.72rem',fontWeight:700,cursor:'pointer',background:'#fde8ea',color:'#e63946',border:'1.5px solid #f7bcc0',fontFamily:'Nunito,sans-serif' }}>🗑</button>
                              </div>
                            </td>
                          </tr>
                        ))
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ── PDF FORMS TABLE ── */}
            {activeTab==='pdfforms' && (
              <>
                <div style={{ background:'#e8f5e9',border:'1.5px solid #a5d6a7',borderRadius:10,padding:'11px 16px',marginBottom:16,fontSize:'.83rem',color:'#1b5e20' }}>
                  📄 <strong>PDF Forms Library</strong> — Store forms via Google Drive links only (Syllabus, Application Forms, Question Papers etc.).<br/>
                  <span style={{ fontSize:'.77rem',color:'#2e7d32' }}>⚠️ Job advertisement PDFs are attached separately inside each Job entry and do NOT appear here.</span>
                </div>
                <div style={{ background:'#fff',border:'1.5px solid #d4e0ec',borderRadius:12,overflow:'hidden' }}>
                  <div style={{ overflowX:'auto' }}>
                    <table className="tbl">
                      <thead><tr><th>Title</th><th>Category</th><th>Google Drive Link</th><th>Added</th><th>Actions</th></tr></thead>
                      <tbody>
                        {filt(pdfForms).length===0
                          ? <tr><td colSpan={5} style={{ textAlign:'center' as const,padding:40,color:'#5a6a7a' }}>No PDF forms. Click "Add PDF Form".</td></tr>
                          : filt(pdfForms).map(p => (
                            <tr key={p.id}>
                              <td style={{ fontWeight:700,maxWidth:200,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' as const }}>📄 {p.title}</td>
                              <td><span className="chip cT">{p.category}</span></td>
                              <td>
                                <a href={p.driveLink} target="_blank" rel="noreferrer" style={{ color:'#0096b7',fontSize:'.77rem',fontWeight:700,textDecoration:'none' }}>
                                  🔗 Open in Drive ↗
                                </a>
                              </td>
                              <td style={{ fontSize:'.75rem',color:'#5a6a7a',whiteSpace:'nowrap' as const }}>{p.uploadedAt}</td>
                              <td>
                                <button onClick={()=>{if(confirm('Delete?'))setPdfForms(prev=>prev.filter(x=>x.id!==p.id))}} style={{ padding:'5px 9px',borderRadius:7,fontSize:'.72rem',fontWeight:700,cursor:'pointer',background:'#fde8ea',color:'#e63946',border:'1.5px solid #f7bcc0',fontFamily:'Nunito,sans-serif' }}>🗑 Delete</button>
                              </td>
                            </tr>
                          ))
                        }
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {/* ── AFFILIATE PARTNERS ── */}
            {activeTab==='affiliate' && (
              <div>
                {/* Stats row */}
                <div style={{display:'flex',gap:12,marginBottom:20,flexWrap:'wrap' as const}}>
                  {[
                    {v:affiliates.length,         l:'Total Items',  c:'#c9a227'},
                    {v:affiliates.filter(a=>a.active).length,  l:'Active',    c:'#2a9d8f'},
                    {v:affiliates.filter(a=>!a.active).length, l:'Hidden',    c:'#e63946'},
                  ].map(s=>(
                    <div key={s.l} style={{background:'#fff',border:'1.5px solid #d4e0ec',borderRadius:11,padding:'14px 20px',minWidth:120,textAlign:'center' as const}}>
                      <div style={{fontFamily:'Arial Black,sans-serif',fontWeight:900,fontSize:'1.4rem',color:s.c}}>{s.v}</div>
                      <div style={{fontSize:'.72rem',color:'#5a6a7a',marginTop:2}}>{s.l}</div>
                    </div>
                  ))}
                  <div style={{background:'#c9a22718',border:'1.5px solid #c9a22744',borderRadius:11,padding:'14px 20px',fontSize:'.8rem',color:'#5a6a7a',lineHeight:1.7,flex:1,minWidth:200}}>
                    💡 <strong>How it works:</strong> Add your real affiliate links here. They show on the public <strong>/affiliate</strong> page. Toggle Active/Hidden to control what visitors see. Replace placeholder links with your actual affiliate URLs from Testbook, Adda247, Amazon etc.
                  </div>
                </div>

                {/* Items list */}
                <div style={{display:'flex',flexDirection:'column' as const,gap:12}}>
                  {affiliates.map((item,i)=>(
                    <div key={item.id} style={{background:'#fff',border:`1.5px solid ${item.active?'#d4e0ec':'#f7bcc0'}`,borderRadius:13,padding:'16px 20px',display:'flex',alignItems:'center',gap:14,flexWrap:'wrap' as const,opacity:item.active?1:0.65}}>
                      {/* Logo + info */}
                      <div style={{width:46,height:46,borderRadius:10,background:'#f0f4f8',border:'1.5px solid #d4e0ec',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.5rem',flexShrink:0}}>{item.logo}</div>
                      <div style={{flex:1,minWidth:180}}>
                        <div style={{display:'flex',alignItems:'center',gap:7,marginBottom:4,flexWrap:'wrap' as const}}>
                          <span style={{fontFamily:"'Sora',sans-serif",fontWeight:700,fontSize:'.88rem',color:'#1a1a2e'}}>{item.title}</span>
                          {item.tag&&<span style={{background:item.tag==='RECOMMENDED'?'#1dbfad':item.tag==='POPULAR'?'#e63946':'#c9a227',color:item.tag==='NEW'?'#0b1f33':'#fff',padding:'2px 8px',borderRadius:99,fontSize:'.62rem',fontWeight:800}}>{item.tag}</span>}
                          {!item.active&&<span style={{background:'#fde8ea',color:'#e63946',padding:'2px 8px',borderRadius:99,fontSize:'.62rem',fontWeight:700}}>HIDDEN</span>}
                        </div>
                        <div style={{fontSize:'.75rem',color:'#5a6a7a',marginBottom:4}}>{item.category} · {item.price}</div>
                        <div style={{fontSize:'.72rem',color:'#8fa3b8',fontFamily:'monospace',wordBreak:'break-all' as const}}>{item.link.slice(0,60)}{item.link.length>60?'…':''}</div>
                      </div>
                      {/* Commission badge */}
                      <div style={{background:'#1dbfad18',border:'1px solid #1dbfad44',borderRadius:8,padding:'6px 12px',fontSize:'.73rem',color:'#1dbfad',fontWeight:700,whiteSpace:'nowrap' as const,flexShrink:0}}>{item.commission}</div>
                      {/* Actions */}
                      <div style={{display:'flex',gap:7,flexShrink:0}}>
                        <button onClick={()=>{
                          setEditAff(item)
                          setAf({category:item.category,title:item.title,description:item.description,badge:item.badge,logo:item.logo,price:item.price,originalPrice:item.originalPrice||'',commission:item.commission,link:item.link,h1:item.highlights[0]||'',h2:item.highlights[1]||'',h3:item.highlights[2]||'',h4:item.highlights[3]||'',buttonText:item.buttonText,tag:item.tag,active:item.active})
                          setShowAffModal(true)
                        }} style={{padding:'7px 13px',borderRadius:8,background:'#e0f7fc',color:'#0096b7',fontWeight:700,fontSize:'.77rem',border:'1.5px solid #b2ebf5',cursor:'pointer',fontFamily:'Nunito,sans-serif'}}>✏️ Edit</button>
                        <button onClick={()=>{
                          const updated=[...affiliates]; updated[i]={...item,active:!item.active}; setAffiliates(updated); toast(item.active?'Hidden from public page':'Now visible on public page')
                        }} style={{padding:'7px 13px',borderRadius:8,background:item.active?'#fff3e0':'#e8f5e9',color:item.active?'#c0622a':'#2e7d32',fontWeight:700,fontSize:'.77rem',border:`1.5px solid ${item.active?'#ffe0b2':'#a5d6a7'}`,cursor:'pointer',fontFamily:'Nunito,sans-serif'}}>
                          {item.active?'👁 Hide':'👁 Show'}
                        </button>
                        <button onClick={()=>{if(confirm('Delete this affiliate item?')){setAffiliates(affiliates.filter((_,j)=>j!==i));toast('🗑️ Deleted')}}} style={{padding:'7px 13px',borderRadius:8,background:'#fde8ea',color:'#e63946',fontWeight:700,fontSize:'.77rem',border:'1.5px solid #f7bcc0',cursor:'pointer',fontFamily:'Nunito,sans-serif'}}>🗑️</button>
                      </div>
                      {/* Move up/down */}
                      <div style={{display:'flex',flexDirection:'column' as const,gap:3,flexShrink:0}}>
                        <button onClick={()=>{if(i===0)return;const a=[...affiliates];[a[i-1],a[i]]=[a[i],a[i-1]];setAffiliates(a)}} style={{padding:'3px 8px',borderRadius:5,background:'#f0f4f8',border:'1px solid #d4e0ec',cursor:'pointer',fontSize:'.7rem'}} disabled={i===0}>▲</button>
                        <button onClick={()=>{if(i===affiliates.length-1)return;const a=[...affiliates];[a[i],a[i+1]]=[a[i+1],a[i]];setAffiliates(a)}} style={{padding:'3px 8px',borderRadius:5,background:'#f0f4f8',border:'1px solid #d4e0ec',cursor:'pointer',fontSize:'.7rem'}} disabled={i===affiliates.length-1}>▼</button>
                      </div>
                    </div>
                  ))}
                  {affiliates.length===0&&(
                    <div style={{textAlign:'center' as const,padding:'40px',color:'#8fa3b8',background:'#fff',borderRadius:13,border:'1.5px dashed #d4e0ec'}}>
                      No affiliate items yet. Click <strong>➕ Add Affiliate</strong> above to get started.
                    </div>
                  )}
                </div>

                {/* Preview link */}
                <div style={{marginTop:18,background:'#f0f4f8',borderRadius:10,padding:'12px 16px',fontSize:'.82rem',color:'#5a6a7a',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap' as const,gap:10}}>
                  <span>👁 Public page: <strong>/affiliate</strong></span>
                  <a href="/affiliate" target="_blank" style={{color:'#1dbfad',fontWeight:700,fontSize:'.8rem',textDecoration:'none'}}>Open Public Page ↗</a>
                </div>
              </div>
            )}

            {/* ── SETTINGS ── */}
            {activeTab==='settings' && (
              <div style={{ maxWidth:580 }}>

                {/* ── Countdown Timer Toggle ── */}
                <div style={{ background:'#fff',border:'1.5px solid #d4e0ec',borderRadius:14,padding:'20px 22px',marginBottom:18 }}>
                  <h2 style={{ fontFamily:"'Sora',sans-serif",fontWeight:700,fontSize:'.92rem',color:'#0b1f33',marginBottom:16,paddingBottom:10,borderBottom:'1px solid #f0f4f8' }}>⏱️ Countdown Timer</h2>
                  <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap' as const,gap:12}}>
                    <div>
                      <div style={{fontWeight:700,fontSize:'.87rem',color:'#0b1f33',marginBottom:4}}>Show countdown timers on public pages</div>
                      <div style={{fontSize:'.77rem',color:'#5a6a7a',lineHeight:1.6}}>
                        When ON: live "X days HH:MM:SS" countdown appears on job detail, exam detail, admit card pages for last date / exam date.<br/>
                        When OFF: timers are hidden, only the date is shown.
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={()=>{
                        const next = !timerEnabled
                        setTimerEnabled(next)
                        try {
                          const s = localStorage.getItem('acp_settings_v1')
                          const obj = s ? JSON.parse(s) : {}
                          localStorage.setItem('acp_settings_v1', JSON.stringify({...obj, timerEnabled: next}))
                          toast(next ? '✅ Countdown timer turned ON' : '⏸ Countdown timer turned OFF')
                        } catch(e) { toast('⚠️ Could not save setting') }
                      }}
                      style={{
                        width:64, height:34, borderRadius:99, border:'none', cursor:'pointer',
                        background: timerEnabled ? '#1dbfad' : '#d4e0ec',
                        position:'relative' as const, transition:'background .25s', flexShrink:0,
                      }}
                    >
                      <span style={{
                        position:'absolute' as const, top:4, left: timerEnabled ? 34 : 4,
                        width:26, height:26, borderRadius:'50%', background:'#fff',
                        boxShadow:'0 1px 4px rgba(0,0,0,.25)', transition:'left .25s',
                        display:'block'
                      }}/>
                    </button>
                  </div>
                  <div style={{marginTop:14,background:timerEnabled?'#e8fdf9':'#f8f0f0',border:`1px solid ${timerEnabled?'#a5d6a7':'#f7bcc0'}`,borderRadius:8,padding:'8px 13px',fontSize:'.78rem',color:timerEnabled?'#1b5e20':'#c62828',fontWeight:700}}>
                    {timerEnabled ? '🟢 Countdown timers are currently ACTIVE on all public pages' : '🔴 Countdown timers are currently HIDDEN on all public pages'}
                  </div>
                </div>

                {/* ── Other settings ── */}
                {[
                  {title:'🌐 Site Identity',fields:[{l:'Site Name',t:'text',ph:'Assam Career Point & Info'},{l:'Tagline',t:'text',ph:'Jobs · Exams · Information'},{l:'Contact Email',t:'email',ph:'admin@acpinfo.com'}]},
                  {title:'📲 Social / Channels',fields:[{l:'WhatsApp Channel',t:'url',ph:'https://wa.me/...'},{l:'Telegram Channel',t:'url',ph:'https://t.me/...'},{l:'YouTube Channel',t:'url',ph:'https://youtube.com/...'}]},
                  {title:'🔐 Change Password',fields:[{l:'Current Password',t:'password',ph:''},{l:'New Password',t:'password',ph:''},{l:'Confirm Password',t:'password',ph:''}]},
                ].map(s => (
                  <div key={s.title} style={{ background:'#fff',border:'1.5px solid #d4e0ec',borderRadius:14,padding:'20px 22px',marginBottom:18 }}>
                    <h2 style={{ fontFamily:"'Sora',sans-serif",fontWeight:700,fontSize:'.92rem',color:'#1a1a2e',marginBottom:16,paddingBottom:10,borderBottom:'1px solid #f0f4f8' }}>{s.title}</h2>
                    {s.fields.map(f=><div key={f.l} className="fg"><label style={lb}>{f.l}</label><input type={f.t} style={si} placeholder={f.ph}/></div>)}
                    <button onClick={()=>toast('✅ Settings saved!')} style={bR}>💾 Save</button>
                  </div>
                ))}
              </div>
            )}

          </div>
        </main>
      </div>

      {/* ════════════════════ ADD/EDIT JOB MODAL ════════════════════ */}
      {showJobModal && (
        <div className="ovl" onClick={e=>{if(e.target===e.currentTarget)setShowJobModal(false)}}>
          <div className="mdl">
            <div className="mhd">
              <h2>{editJob?'✏️ Edit Job Vacancy':'➕ Add Job Vacancy'}</h2>
              <button onClick={()=>setShowJobModal(false)} style={{ width:28,height:28,borderRadius:7,background:'#f0f4f8',border:'1.5px solid #d4e0ec',cursor:'pointer' }}>✕</button>
            </div>
            <form onSubmit={saveJob}>
              <div className="mbdy">

                {/* ── Section: Basic Info ── */}
                <div className="sh">🏷️ Basic Information</div>

                {/* Logo only */}
                <div style={{ display:'flex',alignItems:'center',gap:12,marginBottom:12 }}>
                  <div style={{ width:52,height:52,borderRadius:11,background:'#e0f7fc',border:'2px solid #00b4d8',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.7rem' }}>{jf.logo}</div>
                  <button type="button" onClick={()=>setShowLogoModal(true)} style={bS}>🎨 Choose Emoji</button>
                </div>

                <div className="g2">
                  <div className="fg"><label style={lb}>Job Title *</label><input required value={jf.title} onChange={e=>setJf(p=>({...p,title:e.target.value}))} style={si} placeholder="e.g. Assam Police Recruitment 2026" /></div>
                  <div className="fg"><label style={lb}>Organization</label><input value={jf.org} onChange={e=>setJf(p=>({...p,org:e.target.value}))} style={si} placeholder="e.g. SLPRB Assam" /></div>
                </div>
                <div className="g3">
                  <div className="fg"><label style={lb}>Category</label><select value={jf.category} onChange={e=>setJf(p=>({...p,category:e.target.value}))} style={{...si,cursor:'pointer'}}>{JOB_CATS.map(c=><option key={c}>{c}</option>)}</select></div>
                  <div className="fg"><label style={lb}>District</label><select value={jf.district} onChange={e=>setJf(p=>({...p,district:e.target.value}))} style={{...si,cursor:'pointer'}}>{DISTRICTS.map(d=><option key={d}>{d}</option>)}</select></div>
                  <div className="fg"><label style={lb}>Status</label><select value={jf.status} onChange={e=>setJf(p=>({...p,status:e.target.value as Job['status']}))} style={{...si,cursor:'pointer'}}><option>Live</option><option>Draft</option><option>Closing</option></select></div>
                </div>
                <div className="g2">
                  <div className="fg"><label style={lb}>Application Fee</label><input value={jf.fee} onChange={e=>setJf(p=>({...p,fee:e.target.value}))} style={si} placeholder="Gen ₹285 · SC/ST ₹185 · EWS ₹185" /></div>
                  <div className="fg"><label style={lb}>Official Website</label><input value={jf.website} onChange={e=>setJf(p=>({...p,website:e.target.value}))} style={si} placeholder="slprbassam.in" /></div>
                </div>
                <div className="fg"><label style={lb}>Selection Process</label><input value={jf.selection} onChange={e=>setJf(p=>({...p,selection:e.target.value}))} style={si} placeholder="Written Test → PET → Medical Exam → Document Verification" /></div>
                <div className="fg"><label style={lb}>How to Apply (steps)</label><textarea value={jf.howToApply} onChange={e=>setJf(p=>({...p,howToApply:e.target.value}))} style={{...si,minHeight:72,resize:'vertical' as const}} placeholder="1. Visit slprbassam.in&#10;2. Click Apply Online&#10;3. Register with mobile & email&#10;4. Fill application form&#10;5. Upload photo & signature&#10;6. Pay fee and submit" /></div>
                <div className="fg"><label style={lb}>YouTube Video Link (optional)</label><input value={jf.youtubeLink} onChange={e=>setJf(p=>({...p,youtubeLink:e.target.value}))} style={si} placeholder="https://youtube.com/watch?v=..." /></div>

                {/* ── Section: SEO Description & Advt No ── */}
                <div className="sh">📝 Job Description & SEO</div>
                <div style={{background:'#e8f5e9',border:'1.5px solid #a5d6a7',borderRadius:9,padding:'9px 13px',marginBottom:12,fontSize:'.78rem',color:'#1b5e20'}}>
                  💡 <strong>SEO Tip:</strong> Write a 2–3 sentence description using searchable phrases like "RRB Group D 2026 Assam", "10th pass railway jobs Northeast India". This appears on Google search previews.
                </div>
                <div className="fg"><label style={lb}>Job Description (SEO paragraph — optional but recommended)</label><textarea value={jf.description} onChange={e=>setJf(p=>({...p,description:e.target.value}))} style={{...si,minHeight:90,resize:'vertical' as const}} placeholder="e.g. Railway Recruitment Board (RRB) has released RRB Group D 2026 notification for 22195 Level-1 posts under various Railway zones including Northeast Frontier Railway (Guwahati) with 1776 vacancies. Eligible 10th pass / ITI candidates from Assam and Northeast India can apply online before 9 March 2026." /></div>
                <div className="g2">
                  <div className="fg"><label style={lb}>Advertisement / Notification No.</label><input value={jf.advtNo} onChange={e=>setJf(p=>({...p,advtNo:e.target.value}))} style={si} placeholder="CEN 09/2025" /></div>
                  <div className="fg"><label style={lb}>Application Opening Date</label><input type="date" value={jf.applicationStart} onChange={e=>setJf(p=>({...p,applicationStart:e.target.value}))} style={si} /></div>
                </div>
                <div className="g2">
                  <div className="fg"><label style={lb}>Last Date Time</label><input value={jf.lastDateTime} onChange={e=>setJf(p=>({...p,lastDateTime:e.target.value}))} style={si} placeholder="23:59 Hrs" /></div>
                  <div className="fg"><label style={lb}>Correction Window Dates</label><input value={jf.correctionWindow} onChange={e=>setJf(p=>({...p,correctionWindow:e.target.value}))} style={si} placeholder="12 March – 21 March 2026" /></div>
                  <div className="fg"><label style={lb}>Payment / Fee Last Date</label><input type="date" value={jf.paymentLastDate} onChange={e=>setJf(p=>({...p,paymentLastDate:e.target.value}))} style={si} /></div>
                  <div className="fg"><label style={lb}>Payment Last Date Time</label><input value={jf.paymentLastDateTime} onChange={e=>setJf(p=>({...p,paymentLastDateTime:e.target.value}))} style={si} placeholder="23:59 Hrs" /></div>
                </div>

                {/* ── Section: Age Details ── */}
                <div className="sh">👤 Age Limit Details</div>
                <div className="g2">
                  <div className="fg"><label style={lb}>Age Limit (range)</label><input value={jf.ageLimitDate?`(as on ${jf.ageLimitDate})`:'as on date'} readOnly style={{...si,color:'#8fa3b8',cursor:'not-allowed'}} /></div>
                  <div className="fg"><label style={lb}>Age Limit "as on" Date</label><input type="date" value={jf.ageLimitDate} onChange={e=>setJf(p=>({...p,ageLimitDate:e.target.value}))} style={si} /></div>
                </div>
                <div className="fg"><label style={lb}>Age Relaxation (category-wise)</label><textarea value={jf.ageRelaxation} onChange={e=>setJf(p=>({...p,ageRelaxation:e.target.value}))} style={{...si,minHeight:90,resize:'vertical' as const}} placeholder={"SC/ST: 5 years\nOBC-MOBC: 3 years\nPwD (Unreserved): 10 years\nPwD (OBC): 13 years\nPwD (SC/ST): 15 years\nEx-Serviceman: 3 years"} /></div>

                {/* ── Section: Fee & Refund ── */}
                <div className="sh">💳 Fee & Refund Details</div>
                <div className="fg"><label style={lb}>Fee Refund Details</label><textarea value={jf.feeRefund} onChange={e=>setJf(p=>({...p,feeRefund:e.target.value}))} style={{...si,minHeight:72,resize:'vertical' as const}} placeholder={"SC/ST/PwBD/Female/EWS: Full refund of ₹250 after exam\nOthers: Refund of ₹400 out of ₹500 after exam"} /></div>

                {/* ── Section: Helpline ── */}
                <div className="sh">📞 Helpline / Contact</div>
                <div className="g2">
                  <div className="fg"><label style={lb}>Helpline Email</label><input type="email" value={jf.helplineEmail} onChange={e=>setJf(p=>({...p,helplineEmail:e.target.value}))} style={si} placeholder="rrb.help@csc.gov.in" /></div>
                  <div className="fg"><label style={lb}>Helpline Phone</label><input value={jf.helplinePhone} onChange={e=>setJf(p=>({...p,helplinePhone:e.target.value}))} style={si} placeholder="9592001188 / 01725653333" /></div>
                </div>

                {/* ── Section: Selection & Syllabus ── */}
                <div className="sh">📋 Selection Process & Syllabus</div>
                <div className="fg">
                  <label style={lb}>Detailed Selection Process</label>
                  <div style={{background:'#e8f5e9',border:'1px solid #a5d6a7',borderRadius:7,padding:'8px 12px',marginBottom:8,fontSize:'.75rem',color:'#1b5e20'}}>Enter CBT exam pattern, PET criteria, DV process etc. Each stage on a new line.</div>
                  <textarea value={jf.selectionDetails} onChange={e=>setJf(p=>({...p,selectionDetails:e.target.value}))} style={{...si,minHeight:110,resize:'vertical' as const}} placeholder={"Stage 1: CBT (Computer Based Test)\n- Duration: 90 minutes, 100 Questions\n- General Science: 25 Marks\n- Mathematics: 25 Marks\n- General Intelligence & Reasoning: 30 Marks\n- General Awareness & Current Affairs: 20 Marks\n- Negative Marking: -1/3 per wrong answer\n- Cut-off: UR/EWS-40%, OBC-30%, SC/ST-30%\n\nStage 2: Physical Efficiency Test (PET)\n- Male: Carry 35kg for 100m in 2 mins; Run 1000m in 4:15\n- Female: Carry 20kg for 100m in 2 mins; Run 1000m in 5:40\n\nStage 3: Document Verification (DV)\nStage 4: Medical Examination (ME)"} />
                </div>
                <div className="fg">
                  <label style={lb}>Exam Syllabus (subject-wise)</label>
                  <textarea value={jf.syllabusDetails} onChange={e=>setJf(p=>({...p,syllabusDetails:e.target.value}))} style={{...si,minHeight:120,resize:'vertical' as const}} placeholder={"Mathematics: Number system, BODMAS, Fractions, LCM, HCF, Ratio & Proportion, Percentages, Mensuration, Time & Work, Time & Distance, Simple & Compound Interest, Profit & Loss, Algebra, Geometry, Statistics\n\nGeneral Intelligence & Reasoning: Analogies, Alphabetical/Number Series, Coding-Decoding, Syllogism, Venn Diagram, Data Interpretation, Analytical Reasoning, Directions\n\nGeneral Science: Physics, Chemistry, Life Sciences (Class 10 CBSE level)\n\nGeneral Awareness & Current Affairs: Science & Technology, Sports, Culture, Economics, Politics"} />
                </div>

                {/* ── Section: Zone-wise Vacancy ── */}
                <div className="sh">🗺️ Zone / Region-wise Vacancy (optional)</div>
                <div className="fg">
                  <label style={lb}>Zone-wise Vacancy Breakdown</label>
                  <div style={{background:'#e3f2fd',border:'1px solid #90caf9',borderRadius:7,padding:'8px 12px',marginBottom:8,fontSize:'.75rem',color:'#0d47a1'}}>Format: "Zone Name: Vacancies" — one per line. e.g. "Northeast Frontier Railway (Guwahati): 1776"</div>
                  <textarea value={jf.zoneWiseVacancy} onChange={e=>setJf(p=>({...p,zoneWiseVacancy:e.target.value}))} style={{...si,minHeight:110,resize:'vertical' as const}} placeholder={"Northeast Frontier Railway (Guwahati): 1776\nNorthern Railway (New Delhi): 3537\nWestern Railway (Mumbai): 3148\nCentral Railway (Mumbai): 2012\nEastern Railway (Kolkata): 1180"} />
                </div>

                {/* ── Section: Posts ── */}
                <div className="sh">
                  📊 Post-wise Vacancy Details
                  <button type="button" onClick={addPost} style={{ ...bT,marginLeft:'auto',fontSize:'.75rem',padding:'5px 13px' }}>+ Add Post</button>
                </div>
                {posts.length===0 && (
                  <div style={{ background:'#f8fbff',border:'1.5px dashed #d4e0ec',borderRadius:9,padding:'16px',textAlign:'center' as const,fontSize:'.82rem',color:'#5a6a7a',marginBottom:12 }}>
                    👆 Click "+ Add Post" to add each post type separately<br/>
                    <span style={{ fontSize:'.76rem' }}>e.g. Driver Grade III, Peon/Grade IV, Constable — each with own vacancy, age, salary, last date, apply link</span>
                  </div>
                )}
                {posts.map((p, i) => (
                  <div key={p.id} className="prow">
                    <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:10 }}>
                      <span style={{ fontFamily:"'Sora',sans-serif",fontWeight:700,fontSize:'.82rem',color:'#0d1b2a' }}>Post #{i+1}</span>
                      <button type="button" onClick={()=>setPosts(prev=>prev.filter(x=>x.id!==p.id))} style={{ background:'#fde8ea',border:'1.5px solid #f7bcc0',borderRadius:7,color:'#e63946',fontWeight:700,fontSize:'.77rem',padding:'3px 9px',cursor:'pointer',fontFamily:'Nunito,sans-serif' }}>✕ Remove</button>
                    </div>
                    <div className="prgrid">
                      <div className="fg"><label style={lb}>Post Name *</label><input value={p.name} onChange={e=>updPost(p.id,'name',e.target.value)} style={si} placeholder="Driver Grade III" /></div>
                      <div className="fg"><label style={lb}>Department</label><input value={p.dept} onChange={e=>updPost(p.id,'dept',e.target.value)} style={si} placeholder="Police Transport" /></div>
                      <div className="fg"><label style={lb}>Vacancies</label><input type="number" min={0} value={p.vacancy||''} onChange={e=>updPost(p.id,'vacancy',parseInt(e.target.value)||0)} style={si} placeholder="120" /></div>
                      <div className="fg"><label style={lb}>Qualification</label><input value={p.qualification} onChange={e=>updPost(p.id,'qualification',e.target.value)} style={si} placeholder="HSLC + Driving Licence" /></div>
                      <div className="fg"><label style={lb}>Age Min</label><input type="number" min={14} value={p.ageMin||''} onChange={e=>updPost(p.id,'ageMin',parseInt(e.target.value)||18)} style={si} placeholder="18" /></div>
                      <div className="fg"><label style={lb}>Age Max</label><input type="number" min={18} value={p.ageMax||''} onChange={e=>updPost(p.id,'ageMax',parseInt(e.target.value)||38)} style={si} placeholder="43" /></div>
                      <div className="fg"><label style={lb}>Pay Scale / Salary</label><input value={p.salary} onChange={e=>updPost(p.id,'salary',e.target.value)} style={si} placeholder="₹14,000–60,500" /></div>
                      <div className="fg"><label style={lb}>Last Date</label><input type="date" value={p.lastDate} onChange={e=>updPost(p.id,'lastDate',e.target.value)} style={si} /></div>
                      <div className="fg"><label style={lb}>Apply Link</label><input type="url" value={p.applyLink} onChange={e=>updPost(p.id,'applyLink',e.target.value)} style={si} placeholder="https://slprbassam.in" /></div>
                    </div>
                  </div>
                ))}
                {posts.length>0 && (
                  <div style={{ background:'#e8f5e9',border:'1px solid #a5d6a7',borderRadius:8,padding:'8px 14px',fontSize:'.79rem',color:'#2e7d32',fontWeight:700,marginBottom:12 }}>
                    ✅ Total: {posts.reduce((a,p)=>a+(p.vacancy||0),0).toLocaleString()} vacancies across {posts.length} post types
                  </div>
                )}

                {/* ── Section: Last Date Extension ── */}
                <div className="sh">⏰ Last Date Extension History</div>
                <div style={{ marginBottom:12 }}>
                  {dateHistory.length===0
                    ? <p style={{ fontSize:'.8rem',color:'#5a6a7a',marginBottom:8 }}>No extensions yet. Click the button below when the last date gets extended.</p>
                    : <div style={{ marginBottom:8 }}>{dateHistory.map((h,i)=><span key={i} className="exthip">📅 {fmt(h.date)} — {h.note}</span>)}</div>
                  }
                  <button type="button" onClick={extendDate} style={{ ...bG,fontSize:'.77rem',padding:'7px 15px' }}>📅 Extend Last Date</button>
                </div>

                {/* ── Section: Advertisement PDFs — Google Drive Links ── */}
                <div className="sh">📄 Official Notification PDFs (Google Drive Links)</div>
                <div style={{background:'#e3f2fd',border:'1px solid #90caf9',borderRadius:9,padding:'10px 14px',fontSize:'.78rem',color:'#0d47a1',marginBottom:12,lineHeight:1.75}}>
                  <strong>📌 How to add PDF links from Google Drive:</strong><br/>
                  1. Upload PDF to Google Drive → Right-click → <strong>Share</strong><br/>
                  2. Change access to <strong>"Anyone with the link"</strong><br/>
                  3. Click <strong>Copy Link</strong> → Paste in the URL field below<br/>
                  <span style={{color:'#1565c0'}}>✅ No file size limits. No localStorage quota. Unlimited PDFs.</span>
                </div>
                {advPdfs.map((pdf,i)=>(
                  <div key={i} style={{display:'flex',gap:8,alignItems:'flex-start',marginBottom:10,background:'#f8fbff',border:'1.5px solid #d4e0ec',borderRadius:10,padding:'11px 13px'}}>
                    <div style={{flex:1,display:'flex',flexDirection:'column' as const,gap:7}}>
                      <input
                        value={pdf.name}
                        onChange={e=>{const n=e.target.value;setAdvPdfs(p=>p.map((x,j)=>j===i?{...x,name:n}:x))}}
                        style={{...si,fontSize:'.82rem',marginBottom:0}}
                        placeholder="Display name e.g. Official Notification PDF"
                      />
                      <input
                        value={pdf.url}
                        onChange={e=>{const u=e.target.value;setAdvPdfs(p=>p.map((x,j)=>j===i?{...x,url:u}:x))}}
                        style={{...si,fontSize:'.82rem',marginBottom:0,borderColor:'#90caf9'}}
                        placeholder="Google Drive share link: https://drive.google.com/file/d/FILE_ID/view?usp=sharing"
                      />
                    </div>
                    <button type="button" onClick={()=>setAdvPdfs(p=>p.filter((_,j)=>j!==i))} style={{background:'#fde8ea',border:'1.5px solid #f7bcc0',borderRadius:7,color:'#e63946',fontWeight:700,fontSize:'.8rem',padding:'6px 10px',cursor:'pointer',flexShrink:0,fontFamily:'Nunito,sans-serif',marginTop:2}}>✕</button>
                  </div>
                ))}
                <button type="button" onClick={()=>setAdvPdfs(p=>[...p,{name:'',url:''}])} style={{...bT,fontSize:'.8rem',padding:'8px 16px',width:'100%',justifyContent:'center',display:'flex',alignItems:'center',gap:7,marginBottom:4}}>
                  ➕ Add PDF Link
                </button>

                {/* ── Section: Assamese / Bilingual ── */}
                <div className="sh">🇮🇳 অসমীয়া (Assamese) — Optional Bilingual Fields</div>
                <div style={{background:'#fff8e1',border:'1.5px solid #ffe082',borderRadius:9,padding:'9px 13px',marginBottom:12,fontSize:'.78rem',color:'#5d4037',lineHeight:1.75}}>
                  অসমীয়া ভাষাত তথ্য দিয়া সম্পূৰ্ণ ঐচ্ছিক। যিবোৰ ক্ষেত্ৰ খালি থাকিব, তাত কেৱল ইংৰাজী দেখা যাব।<br/>
                  <span style={{color:'#795548',fontSize:'.73rem'}}>All fields optional — if empty, English text will be shown instead.</span>
                </div>
                <div className="g2">
                  <div className="fg">
                    <label style={{...lb,color:'#5d4037'}}>শিৰোনাম (Job Title in Assamese)</label>
                    <input value={jf.titleAs||''} onChange={e=>setJf(p=>({...p,titleAs:e.target.value}))} style={{...si,borderColor:'#ffe082'}} placeholder="যেনে: অসম আৰক্ষী নিযুক্তি 2026" />
                  </div>
                  <div className="fg">
                    <label style={{...lb,color:'#5d4037'}}>সংস্থাৰ নাম (Organization in Assamese)</label>
                    <input value={jf.orgAs||''} onChange={e=>setJf(p=>({...p,orgAs:e.target.value}))} style={{...si,borderColor:'#ffe082'}} placeholder="যেনে: এছ এল পি আৰ বি অসম" />
                  </div>
                </div>
                <div className="fg">
                  <label style={{...lb,color:'#5d4037'}}>বিৱৰণ (Description in Assamese — optional)</label>
                  <textarea value={jf.descriptionAs||''} onChange={e=>setJf(p=>({...p,descriptionAs:e.target.value}))} style={{...si,minHeight:72,resize:'vertical' as const,borderColor:'#ffe082'}} placeholder="অসমীয়াত চাকৰিৰ বিৱৰণ লিখক..." />
                </div>
                <div className="fg">
                  <label style={{...lb,color:'#5d4037'}}>বাছনি প্ৰক্ৰিয়া (Selection in Assamese — optional)</label>
                  <input value={jf.selectionAs||''} onChange={e=>setJf(p=>({...p,selectionAs:e.target.value}))} style={{...si,borderColor:'#ffe082'}} placeholder="লিখিত পৰীক্ষা → শাৰীৰিক পৰীক্ষা → চিকিৎসা পৰীক্ষা" />
                </div>
                <div className="fg">
                  <label style={{...lb,color:'#5d4037'}}>আবেদন কৰাৰ পদ্ধতি (How to Apply in Assamese — optional)</label>
                  <textarea value={jf.howToApplyAs||''} onChange={e=>setJf(p=>({...p,howToApplyAs:e.target.value}))} style={{...si,minHeight:72,resize:'vertical' as const,borderColor:'#ffe082'}} placeholder="১. slprbassam.in লৈ যাওক&#10;২. অনলাইনত আবেদন কৰক..." />
                </div>

                {/* ── Section: Job-specific Affiliate Products ── */}
                <div className="sh">🛒 Recommended Books / Products (optional)</div>
                <div style={{background:'#e8f5e9',border:'1px solid #a5d6a7',borderRadius:9,padding:'9px 14px',marginBottom:12,fontSize:'.78rem',color:'#1b5e20',lineHeight:1.75}}>
                  Add books, notes, or courses relevant to this job. Image must be <strong>under 150 KB</strong>. These show as affiliate product cards on the job detail page.
                </div>
                {jobAffiliates.map((ja,i)=>(
                  <div key={ja.id} style={{background:'#f8fbff',border:'1.5px solid #d4e0ec',borderRadius:11,padding:'13px',marginBottom:12}}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
                      <span style={{fontFamily:"'Sora',sans-serif",fontWeight:700,fontSize:'.8rem',color:'#0d1b2a'}}>Product #{i+1}</span>
                      <button type="button" onClick={()=>setJobAffiliates(p=>p.filter(x=>x.id!==ja.id))} style={{background:'#fde8ea',border:'1.5px solid #f7bcc0',borderRadius:7,color:'#e63946',fontWeight:700,fontSize:'.77rem',padding:'3px 9px',cursor:'pointer'}}>✕ Remove</button>
                    </div>
                    <div className="g2">
                      <div className="fg">
                        <label style={lb}>Product Title</label>
                        <input value={ja.title} onChange={e=>setJobAffiliates(p=>p.map(x=>x.id===ja.id?{...x,title:e.target.value}:x))} style={si} placeholder="RRB Group D Complete Guide 2026" />
                      </div>
                      <div className="fg">
                        <label style={lb}>Badge / Tag</label>
                        <input value={ja.badge} onChange={e=>setJobAffiliates(p=>p.map(x=>x.id===ja.id?{...x,badge:e.target.value}:x))} style={si} placeholder="Best Seller / Recommended / New" />
                      </div>
                    </div>
                    <div className="fg">
                      <label style={lb}>Affiliate / Buy Link</label>
                      <input value={ja.link} onChange={e=>setJobAffiliates(p=>p.map(x=>x.id===ja.id?{...x,link:e.target.value}:x))} style={{...si,borderColor:'#90caf9'}} placeholder="https://amzn.to/... or Testbook/Adda247 affiliate link" />
                    </div>
                    <div className="fg">
                      <label style={lb}>Product Image (max 150 KB)</label>
                      <input type="file" accept="image/*" style={{display:'none'}} id={`ja-img-${ja.id}`}
                        onChange={e=>{
                          const f=e.target.files?.[0]; if(!f) return
                          if(f.size>153600){alert('Image must be under 150 KB. Please compress it first.'); e.target.value=''; return}
                          const r=new FileReader(); r.onload=ev=>{setJobAffiliates(p=>p.map(x=>x.id===ja.id?{...x,img:ev.target?.result as string}:x))}; r.readAsDataURL(f)
                        }}
                      />
                      <div style={{display:'flex',gap:10,alignItems:'center',flexWrap:'wrap' as const}}>
                        {ja.img&&<img src={ja.img} alt="product" style={{width:64,height:64,objectFit:'cover',borderRadius:8,border:'1.5px solid #d4e0ec'}}/>}
                        <label htmlFor={`ja-img-${ja.id}`} style={{...bS,cursor:'pointer',display:'inline-flex',alignItems:'center',gap:6,fontSize:'.78rem'}}>
                          📷 {ja.img?'Change Image':'Upload Image'}
                        </label>
                        {ja.img&&<button type="button" onClick={()=>setJobAffiliates(p=>p.map(x=>x.id===ja.id?{...x,img:''}:x))} style={{...bS,fontSize:'.72rem',padding:'4px 9px',color:'#e63946'}}>✕ Remove</button>}
                        <span style={{fontSize:'.7rem',color:'#8fa3b8'}}>JPG/PNG/WEBP · max 150 KB</span>
                      </div>
                    </div>
                  </div>
                ))}
                <button type="button" onClick={()=>setJobAffiliates(p=>[...p,{id:Date.now().toString(),title:'',link:'',img:'',badge:''}])} style={{...bT,fontSize:'.8rem',padding:'8px 16px',width:'100%',display:'flex',alignItems:'center',justifyContent:'center',gap:7,marginBottom:4}}>
                  🛒 Add Product / Book
                </button>

              </div>
              <div style={{ padding:'14px 24px',borderTop:'1px solid #d4e0ec',display:'flex',justifyContent:'flex-end',gap:10 }}>
                <button type="button" onClick={()=>setShowJobModal(false)} style={bS}>Cancel</button>
                <button type="submit" style={bR}>💾 {editJob?'Update Job':'Publish Job'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ════ LOGO PICKER ════ */}
      {showLogoModal && (
        <div className="ovl" onClick={e=>{if(e.target===e.currentTarget)setShowLogoModal(false)}}>
          <div style={{ background:'#fff',borderRadius:18,width:'100%',maxWidth:460,padding:22,boxShadow:'0 30px 80px rgba(0,0,0,.35)',margin:'auto' }}>
            <h3 style={{ fontFamily:"'Sora',sans-serif",fontWeight:700,fontSize:'.95rem',color:'#1a1a2e',marginBottom:16 }}>🎨 Choose Logo</h3>
            <div className="lgrid">
              {LOGOS.map(e=>(
                <button key={e} type="button" onClick={()=>{setJf(p=>({...p,logo:e}));setShowLogoModal(false)}} className={`lopt ${jf.logo===e?'on':''}`}>{e}</button>
              ))}
            </div>
            <button onClick={()=>setShowLogoModal(false)} style={{...bS,width:'100%',marginTop:14}}>Close</button>
          </div>
        </div>
      )}

      {/* ════════════════════ ADD/EDIT EXAM MODAL ════════════════════ */}
      {showExamModal && (
        <div className="ovl" onClick={e=>{if(e.target===e.currentTarget)setShowExamModal(false)}}>
          <div className="mdl">
            <div className="mhd">
              <h2>{editExam?'✏️ Edit Exam':'📚 Add Competitive Exam'}</h2>
              <button onClick={()=>setShowExamModal(false)} style={{ width:28,height:28,borderRadius:7,background:'#f0f4f8',border:'1.5px solid #d4e0ec',cursor:'pointer' }}>✕</button>
            </div>
            <form onSubmit={saveExam}>
              <div className="mbdy">
                <div className="sh">📋 Basic Details</div>
                <div className="g3">
                  <div className="fg"><label style={lb}>Emoji Icon</label><input value={ef.emoji} onChange={e=>setEf(p=>({...p,emoji:e.target.value}))} style={{...si,width:60,textAlign:'center' as const}} maxLength={2} /></div>
                  <div className="fg"><label style={lb}>Category</label><select value={ef.category} onChange={e=>setEf(p=>({...p,category:e.target.value}))} style={{...si,cursor:'pointer'}}>{EXAM_CATS.map(c=><option key={c}>{c}</option>)}</select></div>
                  <div className="fg"><label style={lb}>Status</label><select value={ef.status} onChange={e=>setEf(p=>({...p,status:e.target.value as Exam['status']}))} style={{...si,cursor:'pointer'}}>{EXAM_STATUS.map(s=><option key={s}>{s}</option>)}</select></div>
                </div>
                <div className="fg"><label style={lb}>Exam Full Title *</label><input required value={ef.title} onChange={e=>setEf(p=>({...p,title:e.target.value}))} style={si} placeholder="CTET 2026 — Central Teacher Eligibility Test" /></div>
                <div className="g2">
                  <div className="fg"><label style={lb}>Conducted By *</label><input required value={ef.conductedBy} onChange={e=>setEf(p=>({...p,conductedBy:e.target.value}))} style={si} placeholder="CBSE / NTA / UPSC / State Board" /></div>
                  <div className="fg"><label style={lb}>Eligibility</label><input value={ef.eligibility} onChange={e=>setEf(p=>({...p,eligibility:e.target.value}))} style={si} placeholder="Graduation + B.Ed" /></div>
                </div>
                <div className="fg"><label style={lb}>Description</label><textarea value={ef.description} onChange={e=>setEf(p=>({...p,description:e.target.value}))} style={{...si,minHeight:60,resize:'vertical' as const}} placeholder="Brief description of the exam..." /></div>

                <div className="sh" style={{ marginTop:4 }}>📅 Important Dates</div>
                <div className="g2">
                  <div className="fg"><label style={lb}>Application Opens</label><input type="date" value={ef.applicationStart} onChange={e=>setEf(p=>({...p,applicationStart:e.target.value}))} style={si} /></div>
                  <div className="fg"><label style={lb}>Application Last Date *</label><input type="date" value={ef.applicationLastDate} onChange={e=>setEf(p=>({...p,applicationLastDate:e.target.value}))} style={si} /></div>
                </div>
                <div className="g2">
                  <div className="fg">
                    <label style={{...lb,color:'#6a0dad'}}>💳 Payment Last Date (separate!) *</label>
                    <input type="date" value={ef.paymentLastDate} onChange={e=>setEf(p=>({...p,paymentLastDate:e.target.value}))} style={{...si,borderColor:'#ce93d8'}} />
                    <div style={{ fontSize:'.67rem',color:'#6a0dad',marginTop:3 }}>Often 1–2 days AFTER form last date</div>
                  </div>
                  <div className="fg"><label style={lb}>Admit Card Date</label><input value={ef.admitCardDate||''} onChange={e=>setEf(p=>({...p,admitCardDate:e.target.value}))} style={si} placeholder="e.g. 10 May 2026 OR 10-12 May 2026"/></div>
                </div>
                <div className="g2">
                  <div className="fg"><label style={{...lb,color:'#e63946'}}>📅 Exam Date *</label><input value={ef.examDate} onChange={e=>setEf(p=>({...p,examDate:e.target.value}))} style={si} placeholder="e.g. 22 May 2026 OR 22-25 May 2026"/></div>
                  <div className="fg">
                    <label style={{...lb,color:'#e63946'}}>⏰ Exam Time *</label>
                    <input value={ef.examTime} onChange={e=>setEf(p=>({...p,examTime:e.target.value}))} style={si} placeholder="e.g. 9:30 AM – 12:00 PM  &  2:30 PM – 5:00 PM" />
                    <div style={{ fontSize:'.67rem',color:'#5a6a7a',marginTop:3 }}>Include both shifts if applicable</div>
                  </div>
                </div>
                <div className="fg"><label style={lb}>Expected Result Date</label><input type="date" value={ef.resultDate||''} onChange={e=>setEf(p=>({...p,resultDate:e.target.value}))} style={si} /></div>

                <div className="sh" style={{ marginTop:4 }}>💰 Fee & Syllabus</div>
                <div className="fg"><label style={lb}>Application Fee</label><input value={ef.fee} onChange={e=>setEf(p=>({...p,fee:e.target.value}))} style={si} placeholder="Gen ₹1,000 · OBC ₹800 · SC/ST ₹500 · PWD ₹0" /></div>
                <div className="fg"><label style={lb}>Syllabus (brief)</label><textarea value={ef.syllabus} onChange={e=>setEf(p=>({...p,syllabus:e.target.value}))} style={{...si,minHeight:55,resize:'vertical' as const}} placeholder="Child Development, Language I & II, Mathematics, Environmental Science" /></div>

                <div className="sh" style={{ marginTop:4 }}>🔗 Links</div>
                <div className="g2">
                  <div className="fg"><label style={lb}>Official Website</label><input value={ef.officialSite} onChange={e=>setEf(p=>({...p,officialSite:e.target.value}))} style={si} placeholder="ctet.nic.in" /></div>
                  <div className="fg"><label style={lb}>Apply Online Link</label><input type="url" value={ef.applyLink} onChange={e=>setEf(p=>({...p,applyLink:e.target.value}))} style={si} placeholder="https://ctet.nic.in/apply" /></div>
                </div>
                <div className="fg"><label style={lb}>Admit Card Link (once available)</label><input type="url" value={ef.admitCardLink||''} onChange={e=>setEf(p=>({...p,admitCardLink:e.target.value}))} style={si} placeholder="https://..." /></div>

                {/* ── Assamese Bilingual ── */}
                <div className="sh">🇮🇳 অসমীয়া (Assamese) — Optional</div>
                <div style={{background:'#fff8e1',border:'1.5px solid #ffe082',borderRadius:9,padding:'8px 12px',marginBottom:10,fontSize:'.77rem',color:'#5d4037'}}>
                  সকলো ক্ষেত্ৰ ঐচ্ছিক। খালি ৰাখিলে ইংৰাজী দেখা যাব।
                </div>
                <div className="fg">
                  <label style={{...lb,color:'#5d4037'}}>পৰীক্ষাৰ নাম (Exam Title in Assamese)</label>
                  <input value={ef.titleAs||''} onChange={e=>setEf(p=>({...p,titleAs:e.target.value}))} style={{...si,borderColor:'#ffe082'}} placeholder="যেনে: কেন্দ্ৰীয় শিক্ষক পাত্ৰতা পৰীক্ষা 2026" />
                </div>
                <div className="fg">
                  <label style={{...lb,color:'#5d4037'}}>বিৱৰণ (Description in Assamese)</label>
                  <textarea value={ef.descriptionAs||''} onChange={e=>setEf(p=>({...p,descriptionAs:e.target.value}))} style={{...si,minHeight:60,resize:'vertical' as const,borderColor:'#ffe082'}} placeholder="অসমীয়াত পৰীক্ষাৰ বিৱৰণ..." />
                </div>
                <div className="fg">
                  <label style={{...lb,color:'#5d4037'}}>যোগ্যতা (Eligibility in Assamese)</label>
                  <input value={ef.eligibilityAs||''} onChange={e=>setEf(p=>({...p,eligibilityAs:e.target.value}))} style={{...si,borderColor:'#ffe082'}} placeholder="স্নাতক + বি.এড / ডি.এল.এড" />
                </div>

              </div> {/* ── Section: PDFs ── */}
<div className="sh">📄 Official PDFs / Documents (Google Drive Links)</div>
<div style={{background:'#e3f2fd',border:'1px solid #90caf9',borderRadius:9,padding:'9px 13px',fontSize:'.78rem',color:'#0d47a1',marginBottom:10}}>
  Add notification PDF, syllabus, admit card etc. Enter a label and Google Drive share link for each.
</div>
{(ef.examPdfs||[]).map((pdf,i)=>(
  <div key={i} style={{display:'flex',gap:8,marginBottom:9,background:'#f8fbff',border:'1.5px solid #d4e0ec',borderRadius:10,padding:'10px 12px'}}>
    <div style={{flex:1,display:'flex',flexDirection:'column' as const,gap:7}}>
      <input value={pdf.label} onChange={e=>{const n=[...(ef.examPdfs||[])];n[i]={...n[i],label:e.target.value};setEf(p=>({...p,examPdfs:n}))}} style={si} placeholder="Label e.g. Official Notification, Syllabus PDF, Admit Card"/>
      <input value={pdf.url} onChange={e=>{const n=[...(ef.examPdfs||[])];n[i]={...n[i],url:e.target.value};setEf(p=>({...p,examPdfs:n}))}} style={{...si,borderColor:'#90caf9'}} placeholder="Google Drive share link"/>
    </div>
    <button type="button" onClick={()=>setEf(p=>({...p,examPdfs:(p.examPdfs||[]).filter((_,j)=>j!==i)}))} style={{background:'#fde8ea',border:'1.5px solid #f7bcc0',borderRadius:7,color:'#e63946',fontWeight:700,fontSize:'.8rem',padding:'6px 10px',cursor:'pointer',flexShrink:0}}>✕</button>
  </div>
))}
<button type="button" onClick={()=>setEf(p=>({...p,examPdfs:[...(p.examPdfs||[]),{label:'',url:''}]}))} style={{...bT,fontSize:'.8rem',padding:'8px 16px',width:'100%',display:'flex',alignItems:'center',justifyContent:'center',gap:7,marginBottom:4}}>
  ➕ Add PDF Link
</button>

{/* ── Section: Affiliate ── */}
<div className="sh">🛒 Recommended Books/Courses (optional)</div>
{(ef.examAffiliates||[]).map((aff,i)=>(
  <div key={aff.id} style={{background:'#f8fbff',border:'1.5px solid #d4e0ec',borderRadius:11,padding:'12px',marginBottom:10}}>
    <div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}>
      <span style={{fontFamily:"'Sora',sans-serif",fontWeight:700,fontSize:'.8rem',color:'#0d1b2a'}}>Item #{i+1}</span>
      <button type="button" onClick={()=>setEf(p=>({...p,examAffiliates:(p.examAffiliates||[]).filter((_,j)=>j!==i)}))} style={{background:'#fde8ea',border:'1.5px solid #f7bcc0',borderRadius:7,color:'#e63946',fontWeight:700,fontSize:'.77rem',padding:'3px 9px',cursor:'pointer'}}>✕ Remove</button>
    </div>
    <div className="g2">
      <div className="fg"><label style={lb}>Title</label><input value={aff.title} onChange={e=>{const n=[...(ef.examAffiliates||[])];n[i]={...n[i],title:e.target.value};setEf(p=>({...p,examAffiliates:n}))}} style={si} placeholder="Book/Course title"/></div>
      <div className="fg"><label style={lb}>Badge</label><input value={aff.badge||''} onChange={e=>{const n=[...(ef.examAffiliates||[])];n[i]={...n[i],badge:e.target.value};setEf(p=>({...p,examAffiliates:n}))}} style={si} placeholder="Best Seller"/></div>
    </div>
    <div className="fg"><label style={lb}>Affiliate Link *</label><input value={aff.link} onChange={e=>{const n=[...(ef.examAffiliates||[])];n[i]={...n[i],link:e.target.value};setEf(p=>({...p,examAffiliates:n}))}} style={{...si,borderColor:'#90caf9'}} placeholder="https://amzn.to/..."/></div>
    {/* ← ADD THIS BELOW THE LINK FIELD */}
    <div className="fg">
      <label style={lb}>Product Image (max 150 KB)</label>
      <input type="file" accept="image/*" style={{display:'none'}} id={`ea-img-${aff.id}`}
        onChange={e=>{
          const f=e.target.files?.[0]; if(!f) return
          if(f.size>153600){alert('Image must be under 150 KB. Please compress it first.'); e.target.value=''; return}
          const r=new FileReader(); r.onload=ev=>{
            const n=[...(ef.examAffiliates||[])];
            n[i]={...n[i],img:ev.target?.result as string};
            setEf(p=>({...p,examAffiliates:n}))
          }; r.readAsDataURL(f)
        }}
      />
      <div style={{display:'flex',gap:10,alignItems:'center',flexWrap:'wrap' as const}}>
        {aff.img&&<img src={aff.img} alt="product" style={{width:64,height:64,objectFit:'cover',borderRadius:8,border:'1.5px solid #d4e0ec'}}/>}
        <label htmlFor={`ea-img-${aff.id}`} style={{...bS,cursor:'pointer',display:'inline-flex',alignItems:'center',gap:6,fontSize:'.78rem'}}>
          📷 {aff.img?'Change Image':'Upload Image'}
        </label>
        {aff.img&&<button type="button" onClick={()=>{const n=[...(ef.examAffiliates||[])];n[i]={...n[i],img:''};setEf(p=>({...p,examAffiliates:n}))}} style={{...bS,fontSize:'.72rem',padding:'4px 9px',color:'#e63946'}}>✕ Remove</button>}
        <span style={{fontSize:'.7rem',color:'#8fa3b8'}}>JPG/PNG · max 150 KB</span>
      </div>
    </div>
  </div>
))}
<button type="button" onClick={()=>setEf(p=>({...p,examAffiliates:[...(p.examAffiliates||[]),{id:Date.now().toString(),title:'',link:'',badge:''}]}))} style={{...bT,fontSize:'.8rem',padding:'8px 16px',width:'100%',display:'flex',alignItems:'center',justifyContent:'center',gap:7,marginBottom:4}}>
  🛒 Add Book/Course
</button>
              <div style={{ padding:'14px 24px',borderTop:'1px solid #d4e0ec',display:'flex',justifyContent:'flex-end',gap:10 }}>
                <button type="button" onClick={()=>setShowExamModal(false)} style={bS}>Cancel</button>
                <button type="submit" style={bO}>💾 {editExam?'Update Exam':'Publish Exam'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ════════════════════ ADD/EDIT INFO MODAL ════════════════════ */}
      {showInfoModal && (
        <div className="ovl" onClick={e=>{if(e.target===e.currentTarget)setShowInfoModal(false)}}>
          <div className="mdl">
            <div className="mhd">
              <h2>{editInfo?'✏️ Edit Information':'ℹ️ Add Information'}</h2>
              <button onClick={()=>setShowInfoModal(false)} style={{ width:28,height:28,borderRadius:7,background:'#f0f4f8',border:'1.5px solid #d4e0ec',cursor:'pointer' }}>✕</button>
            </div>
            <form onSubmit={saveInfo}>
              <div className="mbdy">
                <div className="sh">📋 Basic Details</div>
                <div className="g3">
                  <div className="fg"><label style={lb}>Emoji Icon</label><input value={inf.emoji} onChange={e=>setInf(p=>({...p,emoji:e.target.value}))} style={{...si,width:60,textAlign:'center' as const}} maxLength={2} /></div>
                  <div className="fg"><label style={lb}>Category</label><select value={inf.category} onChange={e=>setInf(p=>({...p,category:e.target.value}))} style={{...si,cursor:'pointer'}}>{INFO_CATS.map(c=><option key={c}>{c}</option>)}</select></div>
                  <div className="fg"><label style={lb}>Status</label><select value={inf.status} onChange={e=>setInf(p=>({...p,status:e.target.value as InfoItem['status']}))} style={{...si,cursor:'pointer'}}><option>Active</option><option>Upcoming</option><option>Expired</option></select></div>
                </div>
                <div className="fg"><label style={lb}>Title *</label><input required value={inf.title} onChange={e=>setInf(p=>({...p,title:e.target.value}))} style={si} placeholder="e.g. Voter ID Registration / Correction 2026" /></div>
                <div className="fg"><label style={lb}>Description</label><textarea value={inf.description} onChange={e=>setInf(p=>({...p,description:e.target.value}))} style={{...si,minHeight:72,resize:'vertical' as const}} placeholder="What is this? Who needs to do it? Why is it important?" /></div>
                <div className="g2">
                  <div className="fg"><label style={lb}>Overall Deadline (optional)</label><input type="date" value={inf.lastDate||''} onChange={e=>setInf(p=>({...p,lastDate:e.target.value}))} style={si} /></div>
                  <div className="fg"><label style={lb}>Official Website</label><input type="url" value={inf.officialLink} onChange={e=>setInf(p=>({...p,officialLink:e.target.value}))} style={si} placeholder="https://voters.eci.gov.in" /></div>
                </div>
                <div className="fg">
                  <label style={lb}>Process / Steps (how to do it)</label>
                  <textarea value={inf.process} onChange={e=>setInf(p=>({...p,process:e.target.value}))} style={{...si,minHeight:100,resize:'vertical' as const}} placeholder="1. Visit voters.eci.gov.in&#10;2. Click 'Register as New Voter'&#10;3. Fill Form 6 with your details&#10;4. Upload Aadhaar and address proof&#10;5. Submit and note acknowledgement number" />
                </div>

                <div className="sh" style={{ marginTop:4 }}>
                  📅 Important Dates & Times
                  <button type="button" onClick={()=>setInfDates(d=>[...d,{label:'',date:'',time:''}])} style={{ ...bG,marginLeft:'auto',fontSize:'.72rem',padding:'4px 11px' }}>+ Add Date</button>
                </div>
                {infDates.length===0 && <p style={{ fontSize:'.79rem',color:'#5a6a7a',marginBottom:12 }}>Click "+ Add Date" to add important dates (e.g. "Last Date to Apply", "Verification Date") with optional time.</p>}
                {infDates.map((d,i) => (
                  <div key={i} className="idrow">
                    <div className="fg"><label style={lb}>Label</label><input value={d.label} onChange={e=>{const n=[...infDates];n[i]={...n[i],label:e.target.value};setInfDates(n)}} style={si} placeholder="Last Date to Apply" /></div>
                    <div className="fg"><label style={lb}>Date</label><input type="date" value={d.date} onChange={e=>{const n=[...infDates];n[i]={...n[i],date:e.target.value};setInfDates(n)}} style={si} /></div>
                    <div className="fg"><label style={lb}>Time (optional)</label><input value={d.time} onChange={e=>{const n=[...infDates];n[i]={...n[i],time:e.target.value};setInfDates(n)}} style={si} placeholder="11:59 PM" /></div>
                    <div><button type="button" onClick={()=>setInfDates(d=>d.filter((_,j)=>j!==i))} style={{ ...bR,fontSize:'.72rem',padding:'7px 10px',marginTop:20 }}>✕</button></div>
                  </div>
                ))}

                {/* ── Assamese Bilingual ── */}
                <div className="sh">🇮🇳 অসমীয়া (Assamese) — Optional</div>
                <div style={{background:'#fff8e1',border:'1.5px solid #ffe082',borderRadius:9,padding:'8px 12px',marginBottom:10,fontSize:'.77rem',color:'#5d4037'}}>
                  সকলো ক্ষেত্ৰ ঐচ্ছিক।
                </div>
                <div className="fg">
                  <label style={{...lb,color:'#5d4037'}}>শিৰোনাম (Title in Assamese)</label>
                  <input value={inf.titleAs||''} onChange={e=>setInf(p=>({...p,titleAs:e.target.value}))} style={{...si,borderColor:'#ffe082'}} placeholder="অসমীয়াত শিৰোনাম লিখক" />
                </div>
                <div className="fg">
                  <label style={{...lb,color:'#5d4037'}}>বিৱৰণ (Description in Assamese)</label>
                  <textarea value={inf.descriptionAs||''} onChange={e=>setInf(p=>({...p,descriptionAs:e.target.value}))} style={{...si,minHeight:60,resize:'vertical' as const,borderColor:'#ffe082'}} placeholder="অসমীয়াত বিৱৰণ..." />
                </div>
                <div className="fg">
                  <label style={{...lb,color:'#5d4037'}}>প্ৰক্ৰিয়া (Process/Steps in Assamese)</label>
                  <textarea value={inf.processAs||''} onChange={e=>setInf(p=>({...p,processAs:e.target.value}))} style={{...si,minHeight:72,resize:'vertical' as const,borderColor:'#ffe082'}} placeholder="১. ৱেবছাইটলৈ যাওক&#10;২. ফৰ্ম পূৰণ কৰক..." />
                </div>

              </div>
              <div style={{ padding:'14px 24px',borderTop:'1px solid #d4e0ec',display:'flex',justifyContent:'flex-end',gap:10 }}>
                <button type="button" onClick={()=>setShowInfoModal(false)} style={bS}>Cancel</button>
                <button type="submit" style={bG}>💾 {editInfo?'Update Info':'Publish Info'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ════════════════════ ADD PDF FORM MODAL ════════════════════ */}
      {showPdfModal && (
        <div className="ovl" onClick={e=>{if(e.target===e.currentTarget)setShowPdfModal(false)}}>
          <div style={{ background:'#fff',borderRadius:18,width:'100%',maxWidth:620,boxShadow:'0 30px 80px rgba(0,0,0,.35)',margin:'auto',maxHeight:'90vh',overflow:'auto' }}>
            <div className="mhd"><h2>📄 Add PDF Form to Library</h2><button onClick={()=>setShowPdfModal(false)} style={{ width:28,height:28,borderRadius:7,background:'#f0f4f8',border:'1.5px solid #d4e0ec',cursor:'pointer' }}>✕</button></div>
            <form onSubmit={savePdfForm} style={{ padding:'20px 24px' }}>

              {/* Drive tip */}
              <div style={{ background:'#e8f5e9',border:'1.5px solid #a5d6a7',borderRadius:9,padding:'11px 14px',marginBottom:16,fontSize:'.8rem',color:'#1b5e20' }}>
                📌 Upload PDF to <strong>Google Drive</strong> → Right-click → Share → "Anyone with the link" → Copy link → paste below.
              </div>

              {/* Required fields */}
              <div className="fg"><label style={lb}>Document Title * <span style={{color:'#8fa3b8',fontWeight:400,fontSize:'.72rem'}}>(include year e.g. "APSC CCE Syllabus 2026")</span></label><input required value={pf.title} onChange={e=>setPf(p=>({...p,title:e.target.value}))} style={si} placeholder="e.g. APSC CCE Prelims Syllabus 2026" /></div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
                <div className="fg"><label style={lb}>Category</label><select value={pf.category} onChange={e=>setPf(p=>({...p,category:e.target.value}))} style={{...si,cursor:'pointer'}}>{PDF_CATS.map(c=><option key={c}>{c}</option>)}</select></div>
                <div className="fg"><label style={lb}>Language</label><select value={pf.language} onChange={e=>setPf(p=>({...p,language:e.target.value}))} style={{...si,cursor:'pointer'}}>{['English','Assamese','Both'].map(l=><option key={l}>{l}</option>)}</select></div>
              </div>
              <div className="fg">
                <label style={lb}>Google Drive Link *</label>
                <input required type="url" value={pf.driveLink} onChange={e=>setPf(p=>({...p,driveLink:e.target.value}))} style={si} placeholder="https://drive.google.com/file/d/xxxxx/view?usp=sharing" />
              </div>

              {/* SEO section */}
              <div style={{background:'#c9a22714',border:'1.5px solid #c9a22733',borderRadius:10,padding:'14px',marginBottom:4,marginTop:8}}>
                <div style={{fontFamily:"'Sora',sans-serif",fontWeight:700,fontSize:'.82rem',color:'#0b1f33',marginBottom:12}}>🔍 SEO Fields — Fill these to get Google traffic</div>

                <div className="fg">
                  <label style={{...lb,color:'#c9a227'}}>Description * <span style={{color:'#8fa3b8',fontWeight:400,fontSize:'.72rem'}}>(2-3 sentences using keywords people search)</span></label>
                  <textarea required value={pf.description} onChange={e=>setPf(p=>({...p,description:e.target.value}))} style={{...si,minHeight:80,resize:'vertical' as const}}
                    placeholder="e.g. Download Voter ID Form 6 PDF for new voter registration in Assam 2026. Required for citizens who have turned 18. Fill and submit at voters.eci.gov.in or local BLO office. Free download." />
                </div>

                <div className="fg">
                  <label style={{...lb,color:'#c9a227'}}>Keywords <span style={{color:'#8fa3b8',fontWeight:400,fontSize:'.72rem'}}>(exact phrases people type in Google, comma-separated)</span></label>
                  <input value={pf.keywords} onChange={e=>setPf(p=>({...p,keywords:e.target.value}))} style={si}
                    placeholder="e.g. voter id form 6 pdf assam, voter registration form assam 2026, form 6 download assam" />
                  <div style={{fontSize:'.7rem',color:'#8fa3b8',marginTop:4}}>💡 Tip: Think of what someone would type in Google to find this form.</div>
                </div>

                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
                  <div className="fg"><label style={lb}>Official Source</label><input value={pf.source} onChange={e=>setPf(p=>({...p,source:e.target.value}))} style={si} placeholder="e.g. Election Commission of India"/></div>
                  <div className="fg"><label style={lb}>File Size</label><input value={pf.fileSize} onChange={e=>setPf(p=>({...p,fileSize:e.target.value}))} style={si} placeholder="e.g. 1.2 MB"/></div>
                </div>
                <div className="fg"><label style={lb}>Number of Pages</label><input value={pf.pages} onChange={e=>setPf(p=>({...p,pages:e.target.value}))} style={{...si,maxWidth:140}} placeholder="e.g. 12"/></div>
              </div>

              <div style={{ display:'flex',justifyContent:'flex-end',gap:10,marginTop:14 }}>
                <button type="button" onClick={()=>setShowPdfModal(false)} style={bS}>Cancel</button>
                <button type="submit" style={bP}>➕ Add to Library</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ════ AFFILIATE ADD/EDIT MODAL ════ */}
      {showAffModal && (
        <div className="ovl" onClick={e=>{if(e.target===e.currentTarget)setShowAffModal(false)}}>
          <div style={{background:'#fff',borderRadius:18,width:'100%',maxWidth:640,boxShadow:'0 30px 80px rgba(0,0,0,.35)',margin:'auto',maxHeight:'90vh',overflow:'auto'}}>
            <div className="mhd">
              <h2>{editAff?'✏️ Edit Affiliate Item':'➕ Add Affiliate Item'}</h2>
              <button onClick={()=>setShowAffModal(false)} style={{width:28,height:28,borderRadius:7,background:'#f0f4f8',border:'1.5px solid #d4e0ec',cursor:'pointer'}}>✕</button>
            </div>
            <div style={{padding:'20px 24px'}}>

              {/* Tip box */}
              <div style={{background:'#c9a22718',border:'1.5px solid #c9a22744',borderRadius:9,padding:'11px 14px',marginBottom:18,fontSize:'.8rem',color:'#5a3a00',lineHeight:1.7}}>
                💡 <strong>Tip:</strong> Get your affiliate link from Testbook (testbook.com/affiliate), Adda247 (adda247.com/affiliate), or Amazon Associates (affiliate-program.amazon.in). Paste your unique link in the "Affiliate URL" field below.
              </div>

              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
                {/* Category */}
                <div className="fg">
                  <label style={lb}>Category *</label>
                  <select value={af.category} onChange={e=>setAf(p=>({...p,category:e.target.value}))} style={{...si,cursor:'pointer'}}>
                    {['Exam Preparation','Books & Study Material','Tools & Resources'].map(c=><option key={c}>{c}</option>)}
                  </select>
                </div>
                {/* Logo emoji */}
                <div className="fg">
                  <label style={lb}>Logo Emoji</label>
                  <div style={{display:'flex',gap:8,alignItems:'center'}}>
                    <div style={{width:44,height:44,borderRadius:10,background:'#f0f4f8',border:'1.5px solid #d4e0ec',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.5rem'}}>{af.logo}</div>
                    <input value={af.logo} onChange={e=>setAf(p=>({...p,logo:e.target.value}))} style={{...si,width:80,textAlign:'center' as const,fontSize:'1.2rem'}} maxLength={2}/>
                  </div>
                </div>
              </div>

              {/* Title */}
              <div className="fg">
                <label style={lb}>Title *</label>
                <input required value={af.title} onChange={e=>setAf(p=>({...p,title:e.target.value}))} style={si} placeholder="e.g. Testbook Pass — All Govt Exam Prep"/>
              </div>

              {/* Description */}
              <div className="fg">
                <label style={lb}>Description *</label>
                <textarea value={af.description} onChange={e=>setAf(p=>({...p,description:e.target.value}))} style={{...si,minHeight:70,resize:'vertical' as const}} placeholder="Short description shown on card (1–2 sentences)"/>
              </div>

              {/* Affiliate URL */}
              <div className="fg">
                <label style={{...lb,color:'#c9a227'}}>🔗 Your Affiliate URL * (most important!)</label>
                <input required type="url" value={af.link} onChange={e=>setAf(p=>({...p,link:e.target.value}))} style={{...si,borderColor:'#c9a22788',background:'#fafbf0'}} placeholder="https://testbook.com/?ref=YOUR_UNIQUE_ID"/>
                <div style={{fontSize:'.7rem',color:'#8fa3b8',marginTop:4}}>This is YOUR personal affiliate link. When someone clicks and buys, you earn commission.</div>
              </div>

              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
                <div className="fg">
                  <label style={lb}>Price</label>
                  <input value={af.price} onChange={e=>setAf(p=>({...p,price:e.target.value}))} style={si} placeholder="₹299/month"/>
                </div>
                <div className="fg">
                  <label style={lb}>Original Price (strikethrough)</label>
                  <input value={af.originalPrice} onChange={e=>setAf(p=>({...p,originalPrice:e.target.value}))} style={si} placeholder="₹999/month"/>
                </div>
              </div>

              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
                <div className="fg">
                  <label style={lb}>Badge Text</label>
                  <input value={af.badge} onChange={e=>setAf(p=>({...p,badge:e.target.value}))} style={si} placeholder="Best for Assam"/>
                </div>
                <div className="fg">
                  <label style={lb}>Commission Info</label>
                  <input value={af.commission} onChange={e=>setAf(p=>({...p,commission:e.target.value}))} style={si} placeholder="You earn ₹200–500 per referral"/>
                </div>
              </div>

              {/* Highlights */}
              <div style={{background:'#f8fbff',border:'1px solid #d4e0ec',borderRadius:10,padding:'14px',marginBottom:14}}>
                <label style={{...lb,display:'block',marginBottom:10}}>✓ Highlights (up to 4 bullet points)</label>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:9}}>
                  {(['h1','h2','h3','h4'] as const).map((k,i)=>(
                    <input key={k} value={af[k]} onChange={e=>setAf(p=>({...p,[k]:e.target.value}))} style={si} placeholder={`Highlight ${i+1} (e.g. 10,000+ Mock Tests)`}/>
                  ))}
                </div>
              </div>

              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:14}}>
                <div className="fg">
                  <label style={lb}>Button Text</label>
                  <input value={af.buttonText} onChange={e=>setAf(p=>({...p,buttonText:e.target.value}))} style={si} placeholder="Start Free Trial →"/>
                </div>
                <div className="fg">
                  <label style={lb}>Ribbon Tag</label>
                  <select value={af.tag} onChange={e=>setAf(p=>({...p,tag:e.target.value}))} style={{...si,cursor:'pointer'}}>
                    <option value="">None</option>
                    <option value="RECOMMENDED">⭐ RECOMMENDED</option>
                    <option value="POPULAR">🔥 POPULAR</option>
                    <option value="NEW">✨ NEW</option>
                  </select>
                </div>
                <div className="fg">
                  <label style={lb}>Visibility</label>
                  <select value={af.active?'active':'hidden'} onChange={e=>setAf(p=>({...p,active:e.target.value==='active'}))} style={{...si,cursor:'pointer'}}>
                    <option value="active">👁 Visible on site</option>
                    <option value="hidden">🚫 Hidden</option>
                  </select>
                </div>
              </div>

              {/* Save buttons */}
              <div style={{display:'flex',justifyContent:'flex-end',gap:10,marginTop:8}}>
                <button type="button" onClick={()=>setShowAffModal(false)} style={bS}>Cancel</button>
                <button type="button" onClick={()=>{
                  const highlights=[af.h1,af.h2,af.h3,af.h4].filter(h=>h.trim())
                  const item: AffItem = {
                    id: editAff ? editAff.id : Date.now(),
                    category:af.category, title:af.title, description:af.description,
                    badge:af.badge, logo:af.logo, price:af.price,
                    originalPrice:af.originalPrice||undefined,
                    commission:af.commission, link:af.link,
                    highlights, buttonText:af.buttonText,
                    tag:af.tag, active:af.active,
                  }
                  if(editAff) {
                    setAffiliates(affiliates.map(a=>a.id===editAff.id?item:a))
                    toast('✅ Affiliate item updated!')
                  } else {
                    setAffiliates([...affiliates, item])
                    toast('✅ Affiliate item added!')
                  }
                  setShowAffModal(false)
                }} style={{padding:'10px 22px',borderRadius:9,background:'#c9a227',color:'#0b1f33',fontWeight:900,fontSize:'.88rem',border:'none',cursor:'pointer',fontFamily:'Arial Black,sans-serif'}}>
                  {editAff?'💾 Update':'➕ Add Item'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </>
  )
}
