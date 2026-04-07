// src/app/results/[slug]/page.tsx
// ✅ SERVER COMPONENT – fetches data on the server, passes to client component
import { notFound } from 'next/navigation'
import {
  getResultBySlug,
  getResultMetaTitle,
  getResultMetaDesc,
  ResultPost,
} from '@/lib/results-db'
import ResultDetail from './ResultDetail'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getResultBySlug(slug)
  if (!post) return { title: 'Result Not Found' }
  return {
    title: getResultMetaTitle(post),
    description: getResultMetaDesc(post),
    alternates: {
      canonical: `https://www.assamcareerpoint-info.com/results/${post.slug || post.id}`,
    },
  }
}

export default async function ResultPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getResultBySlug(slug)

  if (!post) notFound()

  return <ResultDetail post={post} />
}