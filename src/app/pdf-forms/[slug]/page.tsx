// src/app/pdf-forms/[slug]/page.tsx
import { getCollection } from '@/lib/mysql'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { cache } from 'react'
import PdfDetailClient from './PdfDetailClient'

export const dynamic = 'force-dynamic'

type PdfForm = {
  id: number; title: string; titleAs?: string; category: string
  driveLink: string; uploadedAt?: string; downloads?: number
  slug?: string; imageUrl?: string; year?: string; pages?: string
  fileSize?: string; language?: string; source?: string; officialUrl?: string
  description?: string; descriptionAs?: string; keywords?: string
  howToFill?: string; howToFillAs?: string
}

function generateSlug(title: string, id: number) {
  const base = title.toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
  return `${base}-pdf-download-${id}`
}

// ── cache() deduplicates the MySQL call so it runs ONCE
// even though both generateMetadata and the page need it
const getAllForms = cache(async (): Promise<PdfForm[]> => {
  try {
    const data = await getCollection('pdfforms')
    return Array.isArray(data) ? data as PdfForm[] : []
  } catch (err) {
    console.error('[PDF slug] getCollection failed:', err)
    return []
  }
})

function findForm(all: PdfForm[], slug: string): PdfForm | undefined {
  const slugId = parseInt(slug.split('-').pop() || '0')
  return all.find(f =>
    f.slug === slug ||
    generateSlug(f.title, f.id) === slug ||
    f.id === slugId ||
    String(f.id) === String(slugId)  // handles string/number mismatch from MySQL
  )
}

export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const all  = await getAllForms()
  const form = findForm(all, params.slug)
  if (!form) return { title: 'PDF Not Found | Assam Career Point' }
  return {
    title: `${form.title} — Free PDF Download | Assam Career Point`,
    description: form.description ||
      `Download ${form.title} PDF for free. ${form.category} document on Assam Career Point & Info.`,
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

export default async function PdfSlugPage(
  { params }: { params: { slug: string } }
) {
  const all  = await getAllForms()   // uses cached result — no second MySQL call
  const form = findForm(all, params.slug)

  if (!form) notFound()

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "DigitalDocument",
    "name": form.title,
    "description": form.description ||
      `Download ${form.title} PDF for free. Official ${form.category} document.`,
    "url": `https://assamcareerpoint-info.com/pdf-forms/${params.slug}`,
    "datePublished": form.uploadedAt,
    "publisher": {
      "@type": "Organization",
      "name": "Assam Career Point & Info",
      "url": "https://assamcareerpoint-info.com"
    },
    "inLanguage": "en-IN",
    "encodingFormat": "application/pdf",
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home",
          "item": "https://assamcareerpoint-info.com" },
        { "@type": "ListItem", "position": 2, "name": "PDF Forms",
          "item": "https://assamcareerpoint-info.com/pdf-forms" },
        { "@type": "ListItem", "position": 3, "name": form.category,
          "item": `https://assamcareerpoint-info.com/pdf-forms?cat=${encodeURIComponent(form.category)}` },
        { "@type": "ListItem", "position": 4, "name": form.title }
      ]
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PdfDetailClient form={form} />
    </>
  )
}