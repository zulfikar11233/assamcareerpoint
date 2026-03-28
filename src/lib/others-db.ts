// src/lib/others-db.ts
// ─── Others CMS — Shared Types & localStorage Utilities ───────────────────────

export type OthersLink = {
  id: string
  label: string
  url: string
}

export type OthersSection = {
  id: string
  title: string
  content: string
  pdfLink?: string    // Google Drive shareable link
  pdfName?: string    // Display name for the PDF button
  links: OthersLink[] // Up to 10 external links per section
}

export type OthersPost = {
  id: number
  type: 'announcement' | 'guide' | 'service'
  emoji: string
  title: string
  titleAs?: string          // Assamese title (optional)
  slug: string              // SEO slug e.g. "dee-assam-merit-list-2026"
  category?: string         // e.g. "Education", "Banking", "State Govt"
  description?: string      // Short description shown on listing page
  descriptionAs?: string    // Assamese description (optional)
  sections: OthersSection[] // Up to 10 content sections
  affiliateLink?: string    // Optional affiliate/promo link
  affiliateLinkText?: string
  published: boolean
  createdAt: string
  updatedAt?: string
  // SEO — auto-generated if left blank
  metaTitle?: string
  metaDescription?: string
}

// ─── localStorage keys ────────────────────────────────────────────────────────
const KEYS = {
  announcement: 'acp_announcements',
  guide:        'acp_guides',
  service:      'acp_services',
} as const

// ─── CRUD helpers ─────────────────────────────────────────────────────────────
export async function getOthersPostsFromServer(type: OthersPost['type']): Promise<OthersPost[]> {
  try {
    const res = await fetch(`/api/data/${type === 'announcement' ? 'announcements' : type === 'guide' ? 'guides' : 'services'}`, {
      cache: 'no-store', headers: { 'Cache-Control': 'no-cache' }
    })
    if (res.ok) {
      const data = await res.json()
      if (Array.isArray(data) && data.length > 0) return data
    }
  } catch {}
  // fallback to localStorage
  try {
    const raw = localStorage.getItem(KEYS[type])
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

export function getOthersPosts(type: OthersPost['type']): OthersPost[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(KEYS[type])
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

export async function saveOthersPosts(type: OthersPost['type'], posts: OthersPost[]): Promise<void> {
  if (typeof window === 'undefined') return
  // Save to localStorage
  localStorage.setItem(KEYS[type], JSON.stringify(posts))
  // Also save to server
  const collection = type === 'announcement' ? 'announcements' : type === 'guide' ? 'guides' : 'services'
  try {
    await fetch(`/api/data/${collection}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(posts)
    })
  } catch {}
}

export function getPostBySlug(type: OthersPost['type'], slug: string): OthersPost | null {
  return getOthersPosts(type).find(p => p.slug === slug) ?? null
}

export function getAllPublishedPosts(): OthersPost[] {
  if (typeof window === 'undefined') return []
  return [
    ...getOthersPosts('announcement'),
    ...getOthersPosts('guide'),
    ...getOthersPosts('service'),
  ].filter(p => p.published).sort((a, b) => b.id - a.id)
}

// ─── Slug generator ───────────────────────────────────────────────────────────
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
    .slice(0, 80)
}

// ─── SEO helpers ──────────────────────────────────────────────────────────────
export function getMetaTitle(post: OthersPost): string {
  return post.metaTitle || `${post.title} | Assam Career Point & Info`
}

export function getMetaDesc(post: OthersPost): string {
  return post.metaDescription || post.description ||
    `${post.title} — Latest updates from Assam Career Point & Info. Check details, important dates, and official links.`
}

export function getTypeLabel(type: OthersPost['type']): string {
  return { announcement: 'Announcement', guide: 'Documents & Guides', service: 'Public Service' }[type]
}

export function getTypePath(type: OthersPost['type']): string {
  return { announcement: 'announcements', guide: 'guides', service: 'services' }[type]
}

// ─── JSON-LD schema generator ─────────────────────────────────────────────────
export function generateJsonLd(post: OthersPost): object {
  const base = {
    '@context': 'https://schema.org',
    name: post.title,
    description: getMetaDesc(post),
    url: `https://assamcareerpoint-info.com/${getTypePath(post.type)}/${post.slug}`,
    datePublished: post.createdAt,
    dateModified: post.updatedAt || post.createdAt,
    publisher: {
      '@type': 'Organization',
      name: 'Assam Career Point & Info',
      url: 'https://assamcareerpoint-info.com',
    },
  }
  if (post.type === 'announcement') return { '@type': 'Article', ...base }
  if (post.type === 'guide')        return { '@type': 'HowTo',  ...base }
  return { '@type': 'GovernmentService', ...base }
}

// ─── Section / Link ID generators ────────────────────────────────────────────
export const newSectionId = () => `sec_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`
export const newLinkId    = () => `lnk_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`
