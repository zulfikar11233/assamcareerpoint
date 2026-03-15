// src/lib/results-db.ts
// ─── Results CMS — Types & localStorage Utilities ─────────────────────────────

export type ResultLink = {
  id: string
  label: string   // e.g. "Final Merit List LP"
  url: string     // actual URL
}

export type ResultSection = {
  id: string
  title: string         // e.g. "DEE Assam Merit List Details"
  content: string       // main text content
  pdfLink?: string      // Google Drive PDF link
  pdfName?: string      // button label e.g. "Download Merit List PDF"
  links: ResultLink[]   // up to 10 important links
}

export type ResultPost = {
  id: number
  emoji: string
  title: string
  titleAs?: string          // Assamese title (optional)
  slug: string              // SEO URL slug e.g. "dee-assam-merit-list-2026"
  category: string          // "Merit List" | "Answer Key" | "Cut-off Marks" | "Final Result" | "Admit Card"
  org: string               // Department / Organization e.g. "DEE Assam"
  totalPosts?: string       // e.g. "4500"
  description?: string      // short summary for listing page
  descriptionAs?: string    // Assamese description (optional)
  resultDate?: string       // ISO date when result was released
  sections: ResultSection[] // up to 10 content sections
  affiliateLink?: string
  affiliateLinkText?: string
  published: boolean
  createdAt: string
  updatedAt?: string
  // SEO
  metaTitle?: string
  metaDescription?: string
}

// ─── localStorage key ─────────────────────────────────────────────────────────
const KEY = 'acp_results'

// ─── CRUD helpers ─────────────────────────────────────────────────────────────
export function getResultPosts(): ResultPost[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

export function saveResultPosts(posts: ResultPost[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(KEY, JSON.stringify(posts))
}

export function getResultBySlug(slug: string): ResultPost | null {
  return getResultPosts().find(p => p.slug === slug) ?? null
}

export function getPublishedResults(): ResultPost[] {
  return getResultPosts()
    .filter(p => p.published)
    .sort((a, b) => b.id - a.id)
}

// ─── Slug generator ───────────────────────────────────────────────────────────
export function generateResultSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
    .slice(0, 80)
}

// ─── SEO helpers ──────────────────────────────────────────────────────────────
export function getResultMetaTitle(post: ResultPost): string {
  return post.metaTitle || `${post.title} | Assam Career Point & Info`
}

export function getResultMetaDesc(post: ResultPost): string {
  return post.metaDescription || post.description ||
    `${post.title} — Check the latest result updates from ${post.org}. Official links, cut-off marks, and merit list details on Assam Career Point & Info.`
}

// ─── JSON-LD schema (Article type for results) ────────────────────────────────
export function generateResultJsonLd(post: ResultPost): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: getResultMetaDesc(post),
    url: `https://assamcareerpoint-info.com/results/${post.slug}`,
    datePublished: post.createdAt,
    dateModified: post.updatedAt || post.createdAt,
    author: {
      '@type': 'Organization',
      name: 'Assam Career Point & Info',
      url: 'https://assamcareerpoint-info.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Assam Career Point & Info',
      url: 'https://assamcareerpoint-info.com',
    },
  }
}

// ─── ID generators ────────────────────────────────────────────────────────────
export const newResultSectionId = () => `rs_${Date.now()}_${Math.random().toString(36).slice(2,6)}`
export const newResultLinkId    = () => `rl_${Date.now()}_${Math.random().toString(36).slice(2,6)}`

// ─── Category options ─────────────────────────────────────────────────────────
export const RESULT_CATEGORIES = [
  'Merit List',
  'Final Result',
  'Answer Key',
  'Cut-off Marks',
  'Admit Card',
  'Interview List',
  'Document Verification',
  'Waiting List',
  'Other',
]
