// src/app/guides/[slug]/page.tsx
// ✅ SERVER COMPONENT – fetches data on the server, passes to client component
import { notFound } from 'next/navigation'
import { getPostBySlug, getMetaTitle, getMetaDesc, OthersPost } from '@/lib/others-db'
import GuideDetail from './GuideDetail'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const TYPE = 'guide'
const PATH = 'guides'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPostBySlug(TYPE, slug)
  if (!post) return { title: 'Guide Not Found' }
  return {
    title: getMetaTitle(post),
    description: getMetaDesc(post),
    alternates: {
      canonical: `https://www.assamcareerpoint-info.com/${PATH}/${post.slug}`,
    },
  }
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPostBySlug(TYPE, slug)

  if (!post) notFound()

  return <GuideDetail post={post as any} />
}