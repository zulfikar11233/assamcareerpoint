'use client'
import { useEffect, useState } from 'react'

export default function LinkDialog({
  open,
  initialUrl,
  onClose,
  onSubmit,
}: {
  open: boolean
  initialUrl: string
  onClose: () => void
  onSubmit: (url: string) => void
}) {
  const [url, setUrl] = useState(initialUrl)
  useEffect(() => setUrl(initialUrl), [initialUrl, open])

  if (!open) return null

  const handleSave = () => {
    onSubmit(url)
    onClose()
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Insert link"
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.45)', zIndex: 1000, display: 'grid', placeItems: 'center' }}
      onMouseDown={onClose}
    >
      <div
        onMouseDown={event => event.stopPropagation()}
        style={{ background: 'var(--card-bg,#fff)', color: 'var(--text,#111)', padding: 18, borderRadius: 8, width: 'min(420px,90vw)' }}
      >
        <label htmlFor="tiptap-link">URL</label>
        <input
          id="tiptap-link"
          autoFocus
          value={url}
          onChange={event => setUrl(event.target.value)}
          onKeyDown={event => {
            if (event.key === 'Enter') {
              event.preventDefault()
              handleSave()
            }
          }}
          placeholder="https://example.com"
          style={{ display: 'block', width: '100%', margin: '8px 0 14px', padding: 8 }}
        />
        <button type="button" onClick={handleSave}>Save link</button>{' '}
        <button type="button" onClick={onClose}>Cancel</button>
      </div>
    </div>
  )
}