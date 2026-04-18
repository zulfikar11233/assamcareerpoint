// src/app/exams/page.tsx — SERVER COMPONENT
import { getCollection } from '@/lib/mysql'
import ExamsClient from './ExamsClient'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Competitive Exams 2026 | Assam Career Point & Info',
  description:
    'CTET, NEET, JEE, UPSC, APSC, SSC, Railway — registration dates, admit cards, results updated daily for Assam.',
  alternates: {
    canonical: 'https://www.assamcareerpoint-info.com/exams',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default async function ExamsPage() {
  const exams = (await getCollection('exams')) as any[]
  return <ExamsClient initialExams={exams} />
}