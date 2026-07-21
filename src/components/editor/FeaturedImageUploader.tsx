'use client'

import { useRef, useState, type ChangeEvent } from 'react'
import { defaultImageUpload } from './ImageUploader'

export default function FeaturedImageUploader({ value, onChange, label = 'Featured Image' }: { value: string; onChange: (url: string) => void; label?: string }) {
  const input = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const select = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    setUploading(true); setError('')
    try { onChange(await defaultImageUpload(file)) } catch (reason) { setError(reason instanceof Error ? reason.message : 'Image upload failed.') } finally { setUploading(false) }
  }
  return <div style={{ display: 'grid', gap: 8 }}><label style={{ fontWeight: 700, fontSize: '.8rem' }}>{label}</label>{value && <img src={value} alt="Featured image preview" style={{ width: '100%', maxWidth: 360, height: 'auto', borderRadius: 8, border: '1px solid var(--border,#d4e0ec)' }} />}<input ref={input} type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={select} style={{ display: 'none' }} /><div><button type="button" onClick={() => input.current?.click()} disabled={uploading}>{uploading ? 'Uploading…' : value ? 'Replace image' : 'Upload featured image'}</button>{value && <button type="button" onClick={() => onChange('')} style={{ marginLeft: 8 }}>Remove</button>}</div>{error && <p role="alert" style={{ color: '#b5202d', fontSize: 12 }}>{error}</p>}</div>
}
