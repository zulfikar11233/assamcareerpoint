// src/app/sitemap.xml/route.ts
import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  const base = 'https://www.assamcareerpoint-info.com'

  // Static pages
  const staticPages = [
    { url: `${base}/`,             priority: '1.0', changefreq: 'daily'   },
    { url: `${base}/govt-jobs`,    priority: '0.9', changefreq: 'daily'   },
    { url: `${base}/exams`,        priority: '0.9', changefreq: 'daily'   },
    { url: `${base}/results`,      priority: '0.8', changefreq: 'daily'   },
    { url: `${base}/information`,  priority: '0.7', changefreq: 'weekly'  },
    { url: `${base}/pdf-forms`,    priority: '0.7', changefreq: 'weekly'  },
    { url: `${base}/about-us`,     priority: '0.5', changefreq: 'monthly' },
    { url: `${base}/contact`,      priority: '0.5', changefreq: 'monthly' },
    { url: `${base}/privacy-policy`,priority:'0.3', changefreq: 'monthly' },
  ]

  // Dynamic pages from DB
  let jobs: any[] = []
  let exams: any[] = []
  let results: any[] = []
  let info: any[] = []

  try { jobs    = await query('SELECT id, updatedAt, createdAt FROM jobs    WHERE status != ?', ['Draft']) as any[] } catch {}
  try { exams   = await query('SELECT id, updatedAt, createdAt FROM exams   WHERE status != ?', ['Draft']) as any[] } catch {}
  try { results = await query('SELECT slug, updatedAt, createdAt FROM results WHERE published = 1') as any[] } catch {}
  try { info    = await query('SELECT id, updatedAt, createdAt FROM info    WHERE status != ?', ['Expired']) as any[] } catch {}

  const fmt = (d: any) => {
    try { return new Date(d).toISOString().split('T')[0] } catch { return new Date().toISOString().split('T')[0] }
  }

  const urls = [
    ...staticPages.map(p => `
    <url>
      <loc>${p.url}</loc>
      <changefreq>${p.changefreq}</changefreq>
      <priority>${p.priority}</priority>
    </url>`),
    ...jobs.map((j:any) => `
    <url>
      <loc>${base}/jobs/${j.id}</loc>
      <lastmod>${fmt(j.updatedAt||j.createdAt)}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.8</priority>
    </url>`),
    ...exams.map((e:any) => `
    <url>
      <loc>${base}/exams/${e.id}</loc>
      <lastmod>${fmt(e.updatedAt||e.createdAt)}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.8</priority>
    </url>`),
    ...results.map((r:any) => `
    <url>
      <loc>${base}/results/${r.slug}</loc>
      <lastmod>${fmt(r.updatedAt||r.createdAt)}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.7</priority>
    </url>`),
    ...info.map((i:any) => `
    <url>
      <loc>${base}/information/${i.id}</loc>
      <lastmod>${fmt(i.updatedAt||i.createdAt)}</lastmod>
      <changefreq>monthly</changefreq>
      <priority>0.6</priority>
    </url>`),
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