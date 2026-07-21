'use client'

import type { CSSProperties } from 'react'
import TiptapEditor from '@/components/editor/TiptapEditor'

type RtePreset = 'full' | 'standard' | 'simple'
interface RichTextEditorProps { value: string; onChange: (val: string) => void; preset?: RtePreset; minHeight?: number; placeholder?: string; disabled?: boolean; label?: string; labelStyle?: CSSProperties; hint?: string; draftKey?: string; clearDraftSignal?: unknown }
const heights: Record<RtePreset, number> = { full: 380, standard: 220, simple: 160 }
const labelStyle: CSSProperties = { display: 'block', fontSize: '.72rem', fontWeight: 700, color: '#5a6a7a', marginBottom: 6, letterSpacing: '.03em', textTransform: 'uppercase' }

// Compatibility adapter: existing admin forms keep their current value/onChange save flow.
export default function RichTextEditor({ value, onChange, preset = 'standard', minHeight, placeholder, disabled, label, labelStyle: customLabelStyle, hint, draftKey, clearDraftSignal }: RichTextEditorProps) {
  return <div>{label && <label style={{ ...labelStyle, ...customLabelStyle }}>{label}</label>}<TiptapEditor value={value || ''} onChange={onChange} minHeight={minHeight ?? heights[preset]} placeholder={placeholder} disabled={disabled} draftKey={draftKey} clearDraftSignal={clearDraftSignal} />{hint && <div style={{ fontSize: '.7rem', color: '#8fa3b8', marginTop: 4 }}>{hint}</div>}</div>
}
