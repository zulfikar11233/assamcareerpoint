// src/app/results/[slug]/page.tsx
// ✅ SERVER COMPONENT – fetches from MySQL like all other detail pages
import { notFound } from 'next/navigation'
import { getCollection } from '@/lib/mysql'
import ResultDetail from './ResultDetail'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const list = await getCollection('results') as any[]
  const post = list.find((p: any) => p.slug === slug || String(p.id) === slug)
  if (!post) return { title: 'Result Not Found' }
  return {
    title: `${post.title} | Assam Career Point & Info`,
    description: post.description || `${post.title} — Result update from Assam Career Point.`,
    alternates: {
      canonical: `https://www.assamcareerpoint-info.com/results/${post.slug || post.id}`,
    },
  }
}

export default async function ResultPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const list = await getCollection('results') as any[]
  const post = list.find((p: any) => p.slug === slug || String(p.id) === slug)

  if (!post) notFound()

  return <ResultDetail post={post as any} />
}