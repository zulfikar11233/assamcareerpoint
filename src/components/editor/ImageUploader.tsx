'use client'

import { useRef, type ChangeEvent } from 'react'

export type ImageUpload = (file: File) => Promise<string>
export type ImageInsert = (file: File) => Promise<void>

export function defaultImageUpload(file: File): Promise<string> {
  const body = new FormData()
  body.append('file', file)
  return fetch('/api/upload', { method: 'POST', body, credentials: 'include' })
    .then(async response => {
      const data: unknown = await response.json()
      if (!response.ok || !data || typeof data !== 'object') throw new Error('Image upload failed.')
      const url = (data as { url?: unknown; location?: unknown }).url ?? (data as { location?: unknown }).location
      if (typeof url !== 'string') throw new Error('The upload API did not return an image URL.')
      return url
    })
}

export default function ImageUploader({ onUpload, disabled, inputId, label = 'Image' }: { onUpload: ImageInsert; disabled?: boolean; inputId?: string; label?: string }) {
  const input = useRef<HTMLInputElement>(null)
  const choose = () => input.current?.click()
  const change = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    try {
      if (file) await onUpload(file)
    } catch (error) {
      window.alert(error instanceof Error ? error.message : 'Image upload failed.')
    } finally {
      event.target.value = ''
    }
  }
  return <><button type="button" onClick={choose} disabled={disabled} aria-label="Insert image">{label}</button><input id={inputId} ref={input} type="file" accept="image/*" onChange={change} style={{ display: 'none' }} /></>
}
