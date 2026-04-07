// src/app/announcements/[slug]/page.tsx
// ✅ SERVER COMPONENT – fetches data on the server, passes to client component
import { notFound } from 'next/navigation'
import { getPostBySlug, getMetaTitle, getMetaDesc, OthersPost } from '@/lib/others-db'
import AnnouncementDetail from './AnnouncementDetail'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const TYPE = 'announcement'
const PATH = 'announcements'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPostBySlug(TYPE, slug)
  if (!post) return { title: 'Announcement Not Found' }
  return {
    title: getMetaTitle(post),
    description: getMetaDesc(post),
    alternates: {
      canonical: `https://www.assamcareerpoint-info.com/${PATH}/${post.slug}`,
    },
  }
}

export default async function AnnouncementPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPostBySlug(TYPE, slug)

  if (!post) notFound()

  return <AnnouncementDetail post={post} />
}