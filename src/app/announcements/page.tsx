// SAVE AS: src/app/announcements/page.tsx   (replace the whole file)
// SERVER component: no 'use client'. The list is read here, on the server, so every
// link to a post is already in the HTML Google downloads (no fetch('/api/...') in the browser).
import type { Metadata } from 'next'
import { loadListItems } from '@/lib/others-list'
import OthersListClient from '@/components/OthersListClient'
import type { OtherListConfig } from '@/components/OthersListClient'

export const dynamic = 'force-dynamic'

const PAGE_URL = 'https://www.assamcareerpoint-info.com/announcements'
const TITLE = 'Government Announcements & Official Updates for Assam'
const DESC = 'Latest government announcements, notifications and official updates for Assam & NE India.'

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
  path: 'announcements',
  label: 'Announcements',
  emoji: '\u{1F4E2}',
  color: '#e74c3c',
  heroGradient: 'linear-gradient(135deg, #0b1f33 0%, #0d2d4a 100%)',
  subtitle: 'Latest government announcements, notifications and official updates for Assam & NE India',
  placeholder: 'Search announcements...',
  countNoun: 'announcements',
  emptyTitle: 'No announcements yet',
  cta: 'Read more',
}

export default async function AnnouncementsPage() {
  const posts = await loadListItems('announcements', 'announcements')
  return <OthersListClient config={config} posts={posts} />
}
