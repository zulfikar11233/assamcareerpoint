// src/app/guides/[slug]/page.tsx
import { notFound } from 'next/navigation'
import { getCollection } from '@/lib/mysql'
import GuideDetail from './GuideDetail'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const list = await getCollection('guides') as any[]
  const post = list.find((p: any) => p.slug === slug || String(p.id) === slug)
  if (!post) return { title: 'Not Found' }
  return {
    title: `${post.title} | Assam Career Point & Info`,
    description: post.description || post.content?.slice(0, 160) || '',
    openGraph: {
      title: post.title,
      description: post.description || '',
      images: post.imageUrl
        ? [{ url: post.imageUrl, width: 1200, height: 630, alt: post.title }]
        : [{ url: 'https://assamcareerpoint-info.com/og-default.png' }],
    },
    twitter: {
      card: 'summary_large_image',
      images: post.imageUrl ? [post.imageUrl] : [],
    },
    alternates: {
      canonical: `https://www.assamcareerpoint-info.com/guides/${post.slug || post.id}`,
    },
  }
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const list = await getCollection('guides') as any[]
  const post = list.find((p: any) => p.slug === slug || String(p.id) === slug)
  if (!post) notFound()
  return <GuideDetail post={post as any} />
}