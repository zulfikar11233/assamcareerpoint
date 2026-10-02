// SAVE AS: src/app/page.tsx   (replace the whole file)
// SERVER component: no 'use client'. The old homepage code now lives in HomeClient.tsx.
//
// Why: the old homepage downloaded its lists with fetch('/api/data/...') in the browser.
// robots.txt blocks /api/ for Googlebot, so Google saw "0 Jobs - No content yet".
// Now the lists are read here, on the server, and are already inside the HTML.
import type { Metadata } from 'next'
import { getCollection } from '@/lib/mysql'
import HomeClient from './HomeClient'
import type { HomeInitial } from './HomeClient'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  alternates: { canonical: 'https://www.assamcareerpoint-info.com/' },
}

async function load(name: string): Promise<any[]> {
  try {
    const data = await getCollection(name)
    return Array.isArray(data) ? data : []
  } catch (err) {
    console.error(`[home] getCollection(${name}) failed:`, err)
    return []
  }
}

const byNewest = (a: any, b: any) =>
  new Date(b?.createdAt || 0).getTime() - new Date(a?.createdAt || 0).getTime()

const notDraft = (x: any) => x && x.status !== 'Draft'

// Keeps the page light: very long text fields are cut to 1500 characters.
// The homepage only shows the first ~240 characters of any description anyway.
const KEEP_WHOLE = /image|logo|url|link|slug|href|emoji/i
function slim(row: any): any {
  const out: any = {}
  for (const [k, v] of Object.entries(row || {})) {
    out[k] = typeof v === 'string' && v.length > 1500 && !KEEP_WHOLE.test(k) ? v.slice(0, 1500) : v
  }
  return out
}

export default async function HomePage() {
  const [jobsAll, examsAll, infoAll, resultsAll, announcementsAll, guidesAll, servicesAll] =
    await Promise.all([
      load('jobs'), load('exams'), load('info'), load('results'),
      load('announcements'), load('guides'), load('services'),
    ])

  const jobsPub  = jobsAll.filter(notDraft)
  const examsPub = examsAll.filter(notDraft)
  const infoPub  = infoAll.filter(notDraft)

  // Same rules the old browser code used
  const jobsSorted = [...jobsPub].sort(byNewest)
  const liveJobs   = jobsSorted.filter((j: any) => j.status === 'Live')
  const jobs       = (liveJobs.length ? liveJobs : jobsSorted).slice(0, 8)

  const exams = [...examsPub].sort(byNewest).slice(0, 6)

  const infoSorted = [...infoPub].sort(byNewest)
  const activeInfo = infoSorted.filter((i: any) => i.status === 'Active')
  const info       = (activeInfo.length ? activeInfo : infoSorted).slice(0, 6)

  const results       = [...resultsAll].sort(byNewest).slice(0, 5)
  const announcements = [...announcementsAll].sort(byNewest).filter((a: any) => a.published !== false).slice(0, 5)
  const guides        = [...guidesAll].sort(byNewest).filter((g: any) => g.published !== false).slice(0, 5)
  const services      = [...servicesAll].sort(byNewest).filter((s: any) => s.published !== false).slice(0, 5)

  const initial: HomeInitial = {
    jobs:          jobs.map(slim),
    exams:         exams.map(slim),
    info:          info.map(slim),
    results:       results.map(slim),
    announcements: announcements.map(slim),
    guides:        guides.map(slim),
    services:      services.map(slim),
    totalJobs:     jobsPub.length,
    totalExams:    examsPub.length,
    totalInfo:     infoPub.length,
    tickerJobs:    jobsPub.filter((j: any) => j.status === 'Live').slice(0, 4).map(slim),
    tickerExams:   examsPub.slice(0, 3).map(slim),
  }

  return <HomeClient initial={initial} />
}
