// src/components/MigrateButton.tsx
// Add this button to admin dashboard to migrate localStorage → server
// After clicking once, all your existing data moves to server
// Delete this component after migration is done

'use client'
import { useState } from 'react'
import { migrateLocalStorageToServer } from '@/lib/dataHelper'

export default function MigrateButton() {
  const [status, setStatus] = useState<'idle'|'running'|'done'|'error'>('idle')

  async function handleMigrate() {
    setStatus('running')
    try {
      await migrateLocalStorageToServer()
      setStatus('done')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div style={{ background:'#fff3cd',border:'2px solid #ffc107',borderRadius:12,padding:'18px 22px',marginBottom:24 }}>
      <div style={{ fontWeight:700,fontSize:'1rem',marginBottom:6 }}>
        ⚠️ Important: Migrate your data to server
      </div>
      <p style={{ fontSize:'.88rem',color:'#555',marginBottom:14 }}>
        Your existing content is stored locally. Click the button below to copy it to the server so all visitors can see it. Do this only once!
      </p>
      {status === 'idle' && (
        <button
          onClick={handleMigrate}
          style={{ background:'#e63946',color:'#fff',border:'none',borderRadius:8,padding:'10px 22px',fontWeight:700,fontSize:'.92rem',cursor:'pointer' }}
        >
          🚀 Migrate Data to Server Now
        </button>
      )}
      {status === 'running' && (
        <div style={{ color:'#0096b7',fontWeight:700 }}>⏳ Migrating... please wait...</div>
      )}
      {status === 'done' && (
        <div style={{ color:'#2e7d32',fontWeight:700 }}>
          ✅ Migration complete! All your data is now on the server. All visitors can see it now!
        </div>
      )}
      {status === 'error' && (
        <div style={{ color:'#e63946',fontWeight:700 }}>❌ Migration failed. Please try again.</div>
      )}
    </div>
  )
}
