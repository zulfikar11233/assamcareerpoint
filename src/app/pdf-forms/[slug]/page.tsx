// Server component – fetches data, generates metadata, and injects Schema.org markup
// src/app/pdf-forms/[slug]/page.tsx
import { getCollection } from '@/lib/mysql'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import PdfDetailClient from './PdfDetailClient'

// Type definition – includes optional slug and imageUrl for SEO
type PdfForm = {
  id: number;
  title: string;
  category: string;
  driveLink: string;
  uploadedAt: string;
  downloads: number;
  slug?: string;
  imageUrl?: string;   // for Open Graph image
}

// Helper: generate a clean URL slug from title + id (SEO‑optimised with -pdf-download-)
function generateSlug(title: string, id: number) {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
  return `${base}-pdf-download-${id}`
}

// Generate SEO metadata (title, description, Open Graph, Twitter card)
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

// Main page component
export default async function PdfSlugPage({ params }: { params: { slug: string } }) {
  const all = await getCollection('pdfforms') as PdfForm[]
  const form = all.find(f => (f.slug || generateSlug(f.title, f.id)) === params.slug)
  if (!form) notFound()

  // Schema.org markup (DigitalDocument + BreadcrumbList) – critical for SEO ranking
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "DigitalDocument",
    "name": form.title,
    "description": `Download ${form.title} PDF for free. Official ${form.category} document.`,
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
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://assamcareerpoint-info.com" },
        { "@type": "ListItem", "position": 2, "name": "PDF Forms", "item": "https://assamcareerpoint-info.com/pdf-forms" },
        { "@type": "ListItem", "position": 3, "name": form.category, "item": `https://assamcareerpoint-info.com/pdf-forms?cat=${encodeURIComponent(form.category)}` },
        { "@type": "ListItem", "position": 4, "name": form.title }
      ]
    }
  }

  return (
    <>
      {/* Inject JSON-LD script tag for Schema.org */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PdfDetailClient form={form} />
    </>
  )
}