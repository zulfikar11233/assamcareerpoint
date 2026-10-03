// SAVE AS: src/lib/others-list.ts   (new file)
// Reads one of the "others" collections on the SERVER and returns slim, ready-to-render items.
import { getCollection } from '@/lib/mysql'
import type { OtherListItem } from '@/components/OthersListClient'

export async function loadListItems(collection: string, path: string): Promise<OtherListItem[]> {
  let rows: any[] = []
  try {
    const data = await getCollection(collection)
    if (Array.isArray(data)) rows = data
  } catch (err) {
    console.error(`[${path} list] getCollection(${collection}) failed:`, err)
  }

  return rows
    .filter((p: any) => p && p.published && p.title && (p.slug || p.id))
    .sort((a: any, b: any) => Number(b.id) - Number(a.id))
    .map((p: any): OtherListItem => {
      const created = p.createdAt ? new Date(p.createdAt) : null
      return {
        id: Number(p.id),
        slug: String(p.slug || p.id),
        emoji: p.emoji ? String(p.emoji) : '',
        category: p.category ? String(p.category) : '',
        createdAt: created && !isNaN(created.getTime()) ? created.toISOString() : '',
        title: String(p.title),
        description: p.description ? String(p.description).slice(0, 600) : '',
        sectionCount: Array.isArray(p.sections) ? p.sections.length : 0,
        href: `/${path}/${encodeURIComponent(String(p.slug || p.id))}`,
      }
    })
}
