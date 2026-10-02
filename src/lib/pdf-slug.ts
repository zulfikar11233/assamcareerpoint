// SAVE AS: src/lib/pdf-slug.ts   (replace the file you installed before)
//
// ONE place that decides the public URL slug of a PDF form.
// Used by: the /pdf-forms listing, the sitemap and the [slug] detail page.
//
// v2 changes (URLs of normal titles stay exactly the same):
//  - "pdf-download" is never repeated:  ...-2026-pdf-download-pdf-download-123  ->  ...-2026-pdf-download-123
//  - titles written as keyword chains ("A | B | C") use only the part before the first "|"
//  - very long slugs are cut at a word boundary (about 80 characters before the suffix)

// Collapse repeated "-pdf-download" that sits right before the numeric id.
function collapseSuffix(slug: string): string {
  return slug.replace(/(?:-pdf-download)+-(\d+)$/, '-pdf-download-$1')
}

export function generatePdfSlug(title: string, id: number | string): string {
  let base = String(title || '')
    .split('|')[0]
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/(?:-?pdf-download)+$/, '')

  if (base.length > 80) base = base.slice(0, 80).replace(/-[^-]*$/, '')
  base = base.replace(/^-+|-+$/g, '') || 'document'

  return `${base}-pdf-download-${id}`
}

// A slug saved in the database still wins (after the repeat is collapsed);
// otherwise it is generated from the title and id.
export function pdfSlugOf(form: {
  id: number | string
  title?: string
  slug?: string
}): string {
  const saved = form.slug ? collapseSuffix(String(form.slug).trim()) : ''
  return saved || generatePdfSlug(form.title || '', form.id)
}
