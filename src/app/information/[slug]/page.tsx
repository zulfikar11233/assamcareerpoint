// src/app/information/[slug]/page.tsx
import { notFound } from 'next/navigation'
import { getCollection } from '@/lib/mysql'
import InfoDetail from './InfoDetail'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const list = await getCollection('info') as any[]
  const item = list.find(i => i.slug === slug || String(i.id) === slug)
  if (!item) return { title: 'Not Found' }
  return {
    title: `${item.title} | Assam Career Point & Info`,
    description: item.description || `${item.title} — ${item.category}`,
    openGraph: {
      title: item.title,
      description: item.description || '',
      images: item.imageUrl
        ? [{ url: item.imageUrl, width: 1200, height: 630, alt: item.title }]
        : [{ url: 'https://assamcareerpoint-info.com/og-default.png' }],
    },
    twitter: {
      card: 'summary_large_image',
      images: item.imageUrl ? [item.imageUrl] : [],
    },
    alternates: {
      canonical: `https://www.assamcareerpoint-info.com/information/${item.slug || item.id}`,
    },
  }
}

export default async function InfoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const list = await getCollection('info') as any[]
  const item = list.find(i => i.slug === slug || String(i.id) === slug)

  if (!item) notFound()

    const others = list
    .filter(i => String(i.id) !== String(item.id) && i.status !== 'Expired')
    .slice(0, 4)

  const sameCategory = list
    .filter(i => i.category === item.category)
    .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
  const idx   = sameCategory.findIndex(i => String(i.id) === String(item.id))
  const newer = idx > 0 ? sameCategory[idx - 1] : null
  const older = idx >= 0 && idx < sameCategory.length - 1 ? sameCategory[idx + 1] : null

  return <InfoDetail item={item} others={others} newer={newer} older={older} />
}
