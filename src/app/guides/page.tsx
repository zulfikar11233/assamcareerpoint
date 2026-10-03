// SAVE AS: src/app/guides/page.tsx   (replace the whole file)
// SERVER component: no 'use client'. The list is read here, on the server, so every
// link to a post is already in the HTML Google downloads (no fetch('/api/...') in the browser).
import type { Metadata } from 'next'
import { loadListItems } from '@/lib/others-list'
import OthersListClient from '@/components/OthersListClient'
import type { OtherListConfig } from '@/components/OthersListClient'

export const dynamic = 'force-dynamic'

const PAGE_URL = 'https://www.assamcareerpoint-info.com/guides'
const TITLE = 'Documents & Step-by-Step Guides for Assam Residents'
const DESC = 'Step-by-step guides, how-to documents and official process guides for Assam residents.'

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
  path: 'guides',
  label: 'Documents & Guides',
  emoji: '\u{1F4CB}',
  color: '#1dbfad',
  tint: '22',
  heroGradient: 'linear-gradient(135deg, #0d2d4a 0%, #0a3d3a 100%)',
  subtitle: 'Step-by-step guides, how-to documents and official process guides for Assam residents',
  placeholder: 'Search guides...',
  countNoun: 'guides',
  emptyTitle: 'No guides yet',
  cta: 'Read guide',
}

export default async function GuidesPage() {
  const posts = await loadListItems('guides', 'guides')
  return <OthersListClient config={config} posts={posts} />
}
