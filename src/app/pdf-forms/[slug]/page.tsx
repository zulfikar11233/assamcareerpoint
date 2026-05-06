// src/app/pdf-forms/[slug]/page.tsx
import { getCollection } from '@/lib/mysql'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import PdfDetailClient from './PdfDetailClient'

type PdfForm = {
  id: number; title: string; category: string
  driveLink: string; uploadedAt: string; downloads: number; slug?: string
  imageUrl?: string   // added for OG images
}

function generateSlug(title: string, id: number) {
  return title.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim() + '-' + id
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const all = await getCollection('pdfforms') as PdfForm[]
  const form = all.find(f => (f.slug || generateSlug(f.title, f.id)) === params.slug)
  if (!form) return { title: 'PDF Not Found' }
  return {
    title: `${form.title} — Download PDF | Assam Career Point`,
    description: `Download ${form.title} PDF for free. ${form.category} document available on Assam Career Point & Info portal.`,
    openGraph: {
      title: form.title,
      description: `Free PDF download — ${form.category}`,
      images: form.imageUrl
        ? [{ url: form.imageUrl, width: 1200, height: 630, alt: form.title }]
        : [{ url: 'https://assamcareerpoint-info.com/og-default.png' }],
    },
    twitter: {
      card: 'summary_large_image',
      images: form.imageUrl ? [form.imageUrl] : [],
    },
    alternates: {
      canonical: `https://assamcareerpoint-info.com/pdf-forms/${params.slug}`,
    },
  }
}

export default async function PdfSlugPage({ params }: { params: { slug: string } }) {
  const all = await getCollection('pdfforms') as PdfForm[]
  const form = all.find(f => (f.slug || generateSlug(f.title, f.id)) === params.slug)
  if (!form) notFound()
  return <PdfDetailClient form={form} />
}