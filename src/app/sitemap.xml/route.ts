// SAVE AS: src/app/sitemap.xml/route.ts   (replace the whole file)
import { NextResponse } from 'next/server'
import { getCollection } from '@/lib/mysql'
import { pdfSlugOf } from '@/lib/pdf-slug'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const base = 'https://www.assamcareerpoint-info.com'
  const host = request.headers.get('host') || 'localhost:3000'
  const proto = host.includes('localhost') ? 'http' : 'https'
  const apiBase = `${proto}://${host}`

  // Static pages
  const staticPages = [
    { url: `${base}/`,              priority: '1.0', changefreq: 'daily'   },
    { url: `${base}/govt-jobs`,     priority: '0.9', changefreq: 'daily'   },
    { url: `${base}/exams`,         priority: '0.9', changefreq: 'daily'   },
    { url: `${base}/results`,       priority: '0.8', changefreq: 'daily'   },
    { url: `${base}/information`,   priority: '0.7', changefreq: 'weekly'  },
    { url: `${base}/pdf-forms`,     priority: '0.7', changefreq: 'weekly'  },
    { url: `${base}/about-us`,      priority: '0.5', changefreq: 'monthly' },
    { url: `${base}/contact`,       priority: '0.5', changefreq: 'monthly' },
    { url: `${base}/privacy-policy`,priority: '0.3', changefreq: 'monthly' },
  ]

  const fmt = (d: any) => {
    try { return new Date(d).toISOString().split('T')[0] } catch { return new Date().toISOString().split('T')[0] }
  }

  // Safe URL segment (slugs are already clean, this only protects odd characters)
  const seg = (v: any) => encodeURIComponent(String(v))

  // Fetch dynamic data from your own API routes
  let jobs:    any[] = []
  let exams:   any[] = []
  let results: any[] = []
  let info:    any[] = []
  let pdfs:    any[] = []

  try { const r = await fetch(`${apiBase}/api/data/jobs`,    { cache:'no-store' }); if(r.ok) jobs    = await r.json() } catch {}
  try { const r = await fetch(`${apiBase}/api/data/exams`,   { cache:'no-store' }); if(r.ok) exams   = await r.json() } catch {}
  try { const r = await fetch(`${apiBase}/api/data/results`, { cache:'no-store' }); if(r.ok) results = await r.json() } catch {}
  try { const r = await fetch(`${apiBase}/api/data/info`,    { cache:'no-store' }); if(r.ok) info    = await r.json() } catch {}

  // PDF forms: read straight from the database (same source as the PDF pages)
  try { const d = await getCollection('pdfforms'); if (Array.isArray(d)) pdfs = d } catch {}

  const urls = [
    ...staticPages.map(p => `
  <url>
    <loc>${p.url}</loc>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`),

    // Jobs: slug URL when the job has one (this is the URL the page declares as canonical)
    ...(Array.isArray(jobs) ? jobs : [])
      .filter((j:any) => j.status !== 'Draft')
      .map((j:any) => `
  <url>
    <loc>${base}/jobs/${seg(j.slug || j.id)}</loc>
    <lastmod>${fmt(j.updatedAt||j.createdAt)}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`),

    ...(Array.isArray(exams) ? exams : [])
      .filter((e:any) => e.status !== 'Draft')
      .map((e:any) => `
  <url>
    <loc>${base}/exams/${seg(e.slug || e.id)}</loc>
    <lastmod>${fmt(e.updatedAt||e.createdAt)}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`),

    ...(Array.isArray(results) ? results : [])
      .filter((r:any) => r.published)
      .map((r:any) => `
  <url>
    <loc>${base}/results/${seg(r.slug)}</loc>
    <lastmod>${fmt(r.updatedAt||r.createdAt)}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`),

    ...(Array.isArray(info) ? info : [])
      .filter((i:any) => i.status !== 'Expired')
      .map((i:any) => `
  <url>
    <loc>${base}/information/${seg(i.slug || i.id)}</loc>
    <lastmod>${fmt(i.updatedAt||i.createdAt)}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`),

    // PDF forms detail pages
    ...pdfs
      .filter((f:any) => f && f.id && f.title)
      .map((f:any) => {
        const hasDate = f.uploadedAt && !isNaN(new Date(f.uploadedAt).getTime())
        return `
  <url>
    <loc>${base}/pdf-forms/${seg(pdfSlugOf(f))}</loc>${hasDate ? `
    <lastmod>${fmt(f.uploadedAt)}</lastmod>` : ''}
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`
      }),
  ]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('')}
</urlset>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
