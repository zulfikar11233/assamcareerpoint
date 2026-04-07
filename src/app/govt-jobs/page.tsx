// src/app/govt-jobs/page.tsx — SERVER COMPONENT
import { getCollection } from '@/lib/mysql'
import GovtJobsList from './GovtJobsList'
export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Government Jobs in Assam 2026 | Assam Career Point & Info',
  description: 'Latest Govt Jobs in Assam 2026 — APSC, Assam Police, SSC, Railway, Banking and more. Updated daily.',
  alternates: {
    canonical: 'https://www.assamcareerpoint-info.com/govt-jobs',
  },
}

export default async function GovtJobsPage() {
  const jobs = await getCollection('jobs') as any[]
  return <GovtJobsList initialJobs={jobs} />
}