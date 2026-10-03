// SAVE AS: src/app/services/page.tsx   (replace the whole file)
// SERVER component: no 'use client'. The list is read here, on the server, so every
// link to a post is already in the HTML Google downloads (no fetch('/api/...') in the browser).
import type { Metadata } from 'next'
import { loadListItems } from '@/lib/others-list'
import OthersListClient from '@/components/OthersListClient'
import type { OtherListConfig } from '@/components/OthersListClient'

export const dynamic = 'force-dynamic'

const PAGE_URL = 'https://www.assamcareerpoint-info.com/services'
const TITLE = 'Public Services & Government Schemes in Assam'
const DESC = 'Government schemes, public services and citizen information for Assam & Northeast India.'

export const metadata: Metadata = {
  title: TITLE, // the layout adds "| Assam Career Point & Info" automatically
  description: DESC,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    type: 'website',
    url: PAGE_URL,
    title: TITLE,
    description: DESC,
    siteName: 'Assam Career Point & Info',
    images: [{ url: 'https://www.assamcareerpoint-info.com/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESC,
    images: ['https://www.assamcareerpoint-info.com/og-image.png'],
  },
}

const config: OtherListConfig = {
  path: 'services',
  label: 'Public Services',
  emoji: '\u{1F3DB}',
  color: '#8e44ad',
  heroGradient: 'linear-gradient(135deg, #1a0a2e 0%, #0b1f33 100%)',
  subtitle: 'Government schemes, public services and citizen information for Assam & Northeast India',
  placeholder: 'Search services...',
  countNoun: 'public services',
  emptyTitle: 'No services yet',
  cta: 'View service',
}

export default async function ServicesPage() {
  const posts = await loadListItems('services', 'services')
  return <OthersListClient config={config} posts={posts} />
}
