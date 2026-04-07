// src/app/jobs/[slug]/page.tsx
// ✅ SERVER COMPONENT — fetches data at request time, no client JS needed
import { notFound } from 'next/navigation'
import { getCollection } from '@/lib/mysql'
import JobDetail from './JobDetail'

export const dynamic = 'force-dynamic'
export const revalidate = 0

// ── Server-side metadata generation ──────────────────────────
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const list = await getCollection('jobs') as any[]
  const job  = list.find(j => j.slug === id || String(j.id) === id)
  if (!job) return { title: 'Job Not Found' }
  return {
    title:       `${job.title} | Assam Career Point & Info`,
    description: job.description || `${job.title} — ${job.org}. Vacancy: ${job.vacancy}. Last date: ${job.lastDate}.`,
    openGraph: {
      title:       `${job.title} | Assam Career Point & Info`,
      description: job.description || '',
      url:         `https://www.assamcareerpoint-info.com/jobs/${job.slug || job.id}`,
    },
    alternates: {
      canonical: `https://www.assamcareerpoint-info.com/jobs/${job.slug || job.id}`,
    },
  }
}

export default async function JobPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const list   = await getCollection('jobs') as any[]
  const job    = list.find(j => j.slug === id || String(j.id) === id)

  if (!job) notFound()

  // Pass other jobs for "Related" sidebar (excluding current)
  const others = list
    .filter(j => String(j.id) !== String(job.id) && j.status !== 'Draft')
    .slice(0, 4)

  return <JobDetail job={job} others={others} />
}