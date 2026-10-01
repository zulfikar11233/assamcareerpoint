// SAVE AS: src/app/pdf-forms/page.tsx   (replace the whole file)
// SERVER component: no 'use client' here. The old client code now lives in PdfFormsClient.tsx.
import type { Metadata } from 'next'
import { getCollection } from '@/lib/mysql'
import { pdfSlugOf } from '@/lib/pdf-slug'
import PdfFormsClient from './PdfFormsClient'
import type { PdfListItem } from './PdfFormsClient'

export const dynamic = 'force-dynamic'

const PAGE_URL = 'https://www.assamcareerpoint-info.com/pdf-forms'
const PAGE_TITLE = 'Government PDF Forms, Syllabus & Question Papers - Free Download'
const PAGE_DESC =
  'Download free government PDF forms, application forms, syllabus, question papers, answer keys and official documents for Assam and India.'

export const metadata: Metadata = {
  title: PAGE_TITLE, // the layout adds "| Assam Career Point & Info" automatically
  description: PAGE_DESC,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    type: 'website',
    url: PAGE_URL,
    title: PAGE_TITLE,
    description: PAGE_DESC,
    siteName: 'Assam Career Point & Info',
    images: [{ url: 'https://www.assamcareerpoint-info.com/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: PAGE_TITLE,
    description: PAGE_DESC,
    images: ['https://www.assamcareerpoint-info.com/og-image.png'],
  },
}

export default async function PdfFormsPage() {
  let rows: any[] = []
  try {
    const data = await getCollection('pdfforms')
    if (Array.isArray(data)) rows = data
  } catch (err) {
    console.error('[pdf-forms list] getCollection failed:', err)
  }

  // Send the browser only what the cards need (keeps the page light)
  const forms: PdfListItem[] = rows
    .filter((f: any) => f && f.id && f.title)
    .map((f: any) => ({
      id: Number(f.id),
      title: String(f.title),
      category: String(f.category || 'Other'),
      uploadedAt: f.uploadedAt ? String(f.uploadedAt) : '',
      downloads: Number(f.downloads) || 0,
      imageUrl: f.imageUrl ? String(f.imageUrl) : '',
      href: `/pdf-forms/${pdfSlugOf(f)}`,
    }))

  return <PdfFormsClient forms={forms} />
}
