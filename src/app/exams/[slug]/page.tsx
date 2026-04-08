// src/app/exams/[slug]/page.tsx
import { notFound } from 'next/navigation'
import { getCollection } from '@/lib/mysql'
import ExamDetail from './ExamDetail'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params   // ✅ was { id } — folder is [slug] so must be slug
  const list = await getCollection('exams') as any[]
  const exam = list.find(e => e.slug === slug || String(e.id) === slug)
  if (!exam) return { title: 'Exam Not Found' }
  return {
    title: `${exam.title} | Assam Career Point & Info`,
    description: exam.description || `${exam.title} — Conducted by ${exam.conductedBy}. Apply by ${exam.applicationLastDate}.`,
    openGraph: {
      title: `${exam.title} | Assam Career Point & Info`,
      description: exam.description || '',
      url: `https://www.assamcareerpoint-info.com/exams/${exam.slug || exam.id}`,
    },
    alternates: {
      canonical: `https://www.assamcareerpoint-info.com/exams/${exam.slug || exam.id}`,
    },
  }
}

export default async function ExamPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params   // ✅ was { id }
  const list = await getCollection('exams') as any[]
  const exam = list.find(e => e.slug === slug || String(e.id) === slug)

  if (!exam) notFound()

  const others = list
    .filter(e => String(e.id) !== String(exam.id) && e.status !== 'Result Declared')
    .slice(0, 4)

  return <ExamDetail exam={exam} others={others} />
}