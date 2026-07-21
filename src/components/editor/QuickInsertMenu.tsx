'use client'

import { useEffect, useMemo, useState } from 'react'

export interface QuickInsertState { query: string; start: number; end: number; left: number; top: number }
export type QuickInsertId = 'Vacancy table' | 'Important dates' | 'Salary table' | 'Selection process' | 'Apply online' | 'Official notification' | 'FAQ' | 'Important notice' | 'youtube' | 'image' | 'table' | 'code'

const commands: { id: QuickInsertId; label: string; description: string; keywords: string }[] = [
  { id: 'Vacancy table', label: 'Vacancy Table', description: 'Post, vacancy, and qualification', keywords: 'job recruitment post' },
  { id: 'Important dates', label: 'Important Dates', description: 'Starting and last dates', keywords: 'date deadline' },
  { id: 'Salary table', label: 'Salary Table', description: 'Post and salary details', keywords: 'pay scale' },
  { id: 'Selection process', label: 'Selection Process', description: 'Numbered selection steps', keywords: 'selection exam' },
  { id: 'Apply online', label: 'Apply Online Button', description: 'Application call-to-action', keywords: 'apply link' },
  { id: 'Official notification', label: 'Official Notification', description: 'Official notification button', keywords: 'pdf notice' },
  { id: 'FAQ', label: 'FAQ', description: 'Question and answer section', keywords: 'questions' },
  { id: 'Important notice', label: 'Notice Box', description: 'Highlighted important notice', keywords: 'alert information' },
  { id: 'youtube', label: 'YouTube Video', description: 'Embed a YouTube video', keywords: 'youtube embed video' },
  { id: 'image', label: 'Image', description: 'Upload an article image', keywords: 'upload photo' },
  { id: 'table', label: 'Table', description: 'Insert a three-column table', keywords: 'grid columns rows' },
  { id: 'code', label: 'Code Block', description: 'Insert a formatted code block', keywords: 'code preformatted' },
]

export default function QuickInsertMenu({ state, onSelect, onClose }: { state: QuickInsertState | null; onSelect: (id: QuickInsertId) => void; onClose: () => void }) {
  const [active, setActive] = useState(0)
  const results = useMemo(() => { const query = state?.query.toLowerCase().trim() ?? ''; return commands.filter(command => !query || `${command.label} ${command.description} ${command.keywords}`.toLowerCase().includes(query)) }, [state?.query])
  useEffect(() => setActive(0), [state?.query])
  useEffect(() => {
    const keydown = (event: KeyboardEvent) => {
      if (!state || !results.length) return
      if (event.key === 'Escape') { event.preventDefault(); onClose() }
      if (event.key === 'ArrowDown') { event.preventDefault(); setActive(current => (current + 1) % results.length) }
      if (event.key === 'ArrowUp') { event.preventDefault(); setActive(current => (current - 1 + results.length) % results.length) }
      if (event.key === 'Enter') { event.preventDefault(); onSelect(results[active].id) }
    }
    window.addEventListener('keydown', keydown); return () => window.removeEventListener('keydown', keydown)
  }, [active, onClose, onSelect, results, state])
  if (!state) return null
  return <div role="listbox" aria-label="Quick insert commands" style={{ position: 'fixed', zIndex: 1100, left: Math.max(8, state.left), top: state.top + 8, width: 'min(340px, calc(100vw - 16px))', maxHeight: 320, overflowY: 'auto', padding: 6, border: '1px solid var(--border,#d4e0ec)', borderRadius: 8, background: 'var(--card-bg,#fff)', color: 'var(--text,#111)', boxShadow: '0 8px 24px rgba(0,0,0,.18)' }}>
    {results.length ? results.map((command, index) => <button key={command.id} type="button" role="option" aria-selected={index === active} onMouseDown={event => { event.preventDefault(); onSelect(command.id) }} style={{ display: 'block', width: '100%', textAlign: 'left', border: 0, borderRadius: 5, padding: '8px 10px', cursor: 'pointer', background: index === active ? 'var(--bg,#f0f4f8)' : 'transparent', color: 'inherit' }}><strong>{command.label}</strong><span style={{ display: 'block', fontSize: 12, opacity: .72 }}>{command.description}</span></button>) : <div style={{ padding: 10, fontSize: 13 }}>No matching command</div>}
  </div>
}
