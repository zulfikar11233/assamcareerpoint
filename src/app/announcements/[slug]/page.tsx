// src/app/announcements/[slug]/page.tsx
// ✅ Code is already correct — if you see 404, the data has no slug field (see note below)
import { notFound } from 'next/navigation'
import { getCollection } from '@/lib/mysql'
import AnnouncementDetail from './AnnouncementDetail'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const list = await getCollection('announcements') as any[]
  const post = list.find((p: any) => p.slug === slug || String(p.id) === slug)
  if (!post) return { title: 'Not Found' }
  return {
    title: `${post.title} | Assam Career Point & Info`,
    description: post.description || post.content?.slice(0, 160) || '',
    alternates: {
      canonical: `https://www.assamcareerpoint-info.com/announcements/${post.slug || post.id}`,
    },
  }
}

export default async function AnnouncementPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const list = await getCollection('announcements') as any[]
  const post = list.find((p: any) => p.slug === slug || String(p.id) === slug)
  if (!post) notFound()
  return <AnnouncementDetail post={post as any} />
}