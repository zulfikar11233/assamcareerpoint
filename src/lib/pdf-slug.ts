// SAVE AS: src/lib/pdf-slug.ts   (new file)
//
// ONE place that decides the public URL slug of a PDF form.
// Used by: the /pdf-forms listing page, the sitemap, and the [slug] detail page,
// so the link Google sees, the sitemap URL and the canonical URL are always identical.

// Same rules as the old generateSlug() in [slug]/page.tsx, so existing URLs do not change.
export function generatePdfSlug(title: string, id: number | string): string {
  const base = String(title || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
  return `${base}-pdf-download-${id}`
}

// The slug saved in the database wins (the old listing page linked to it);
// otherwise it is generated from the title and id.
export function pdfSlugOf(form: {
  id: number | string
  title?: string
  slug?: string
}): string {
  const saved = form.slug ? String(form.slug).trim() : ''
  return saved || generatePdfSlug(form.title || '', form.id)
}
