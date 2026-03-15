// src/lib/dataHelper.ts
// Helper functions to save and load data from the server
// Use these in admin pages to save, and in public pages to load

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
