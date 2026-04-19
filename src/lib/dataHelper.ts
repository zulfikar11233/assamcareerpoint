// src/lib/dataHelper.ts
// Helper functions to save and load data from the server
// Use these in admin pages to save, and in public pages to load

// ── SEO Slug Generator ────────────────────────────────────────────
export function generateSlug(title: string, id: number): string {
  const slug = title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')      // remove special chars like &, *, #
    .replace(/[\s_]+/g, '-')       // spaces → hyphens
    .replace(/-+/g, '-')           // multiple hyphens → single
    .replace(/^-+|-+$/g, '')       // trim leading/trailing hyphens
    .slice(0, 80)                  // max 80 chars
  return `${slug}-${id}`           // append ID to guarantee uniqueness
}

// ── Countdown Target Date (fixes UTC vs IST timezone bug) ─────────
// PROBLEM: new Date('2026-04-20') is parsed as UTC midnight = 05:30 AM IST
//          This causes countdown to show ~9 hrs instead of ~24+ hrs
// SOLUTION: Append T + local time to force local (IST) parsing
//
// Usage:
//   Jobs:   getTargetDate(job.lastDate, job.lastDateTime)
//   Exams:  getTargetDate(exam.applicationLastDate)
//   Exams:  getTargetDate(exam.examDate, exam.examTime)
//   Info:   getTargetDate(item.lastDate)
//   Any:    getTargetDate(someDate, someTimeString)
//
export function getTargetDate(dateStr?: string | null, timeStr?: string | null): Date {
  if (!dateStr) return new Date()

  // Default to end of day 23:59 if no time provided
  let time = '23:59'

  if (timeStr) {
    // Extract HH:MM from strings like "23:59 Hrs", "9:30 AM – 12:00 PM", "23:59"
    const match = timeStr.match(/(\d{1,2}):(\d{2})/)
    if (match) {
      time = `${match[1].padStart(2, '0')}:${match[2]}`
    }
  }

  // Handles both ISO format (2026-04-20) and other formats
  // Appending T + time forces JS to parse as LOCAL time, not UTC
  const normalized = dateStr.trim().slice(0, 10) // ensure YYYY-MM-DD
  return new Date(`${normalized}T${time}:00`)
}

// ── Save data to server ───────────────────────────────────────────
export async function saveToServer(collection: string, data: unknown[]): Promise<boolean> {
  try {
    const res = await fetch(`/api/data/${collection}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    return res.ok
  } catch {
    console.error(`Failed to save ${collection} to server`)
    return false
  }
}

// ── Load data from server ─────────────────────────────────────────
export async function loadFromServer<T>(collection: string): Promise<T[]> {
  try {
    const res = await fetch(`/api/data/${collection}`)
    if (!res.ok) return []
    return await res.json()
  } catch {
    console.error(`Failed to load ${collection} from server`)
    return []
  }
}

// ── Sync: Copy localStorage data to server (run once from admin) ──
// This migrates your existing localStorage data to the server
export async function migrateLocalStorageToServer(): Promise<void> {
  const collections = [
    { key: 'acp_jobs_v6',       name: 'jobs'          },
    { key: 'acp_exams_v6',      name: 'exams'         },
    { key: 'acp_info_v6',       name: 'info'          },
    { key: 'acp_pdfforms_v6',   name: 'pdfforms'      },
    { key: 'acp_affiliate_v1',  name: 'affiliate'     },
    { key: 'acp_settings_v1',   name: 'settings'      },
    { key: 'acp_results',       name: 'results'       },
    { key: 'acp_announcements', name: 'announcements' },
    { key: 'acp_guides',        name: 'guides'        },
    { key: 'acp_services',      name: 'services'      },
  ]
  for (const col of collections) {
    const raw = localStorage.getItem(col.key)
    if (raw) {
      try {
        const data = JSON.parse(raw)
        if (Array.isArray(data) && data.length > 0) {
          await saveToServer(col.name, data)
          console.log(`✅ Migrated ${col.name}: ${data.length} items`)
        }
      } catch {
        console.error(`Failed to migrate ${col.key}`)
      }
    }
  }
}
