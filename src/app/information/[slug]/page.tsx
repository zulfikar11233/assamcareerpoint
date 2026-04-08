// src/app/information/[slug]/page.tsx
import { notFound } from 'next/navigation'
import { getCollection } from '@/lib/mysql'
import InfoDetail from './InfoDetail'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params   // ✅ was { id }
  const list     = await getCollection('info') as any[]
  const item     = list.find(i => i.slug === slug || String(i.id) === slug)
  if (!item) return { title: 'Not Found' }
  return {
    title:       `${item.title} | Assam Career Point & Info`,
    description: item.description || `${item.title} — ${item.category}`,
    alternates:  { canonical: `https://www.assamcareerpoint-info.com/information/${item.slug || item.id}` },
  }
}

export default async function InfoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params   // ✅ was { id }
  const list     = await getCollection('info') as any[]
  const item     = list.find(i => i.slug === slug || String(i.id) === slug)

  if (!item) notFound()

  const others = list
    .filter(i => String(i.id) !== String(item.id) && i.status !== 'Expired')
    .slice(0, 4)

  return <InfoDetail item={item} others={others} />
}