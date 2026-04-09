// src/app/information/page.tsx — SERVER COMPONENT
import { getCollection } from '@/lib/mysql'
import InformationClient from './InformationClient'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Government Information & Schemes 2026 | Assam Career Point',
  description:
    'Voter ID, PAN-Aadhaar, Government Schemes, Documents — step-by-step guides for citizens of Assam & NE India.',
  alternates: {
    canonical: 'https://www.assamcareerpoint-info.com/information',
  },
}

export default async function InformationPage() {
  const items = (await getCollection('info')) as any[]
  return <InformationClient initialItems={items} />
}