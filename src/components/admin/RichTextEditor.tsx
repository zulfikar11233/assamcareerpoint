'use client'
// src/components/admin/RichTextEditor.tsx
// ✅ Self-hosted TinyMCE — no API key needed
// ✅ Works in Next.js App Router (client-side only)
// ✅ Three presets: 'full' | 'standard' | 'simple'

import { useRef, useEffect, useState } from 'react'
import { Editor } from '@tinymce/tinymce-react'
import type { Editor as TinyMCEEditor } from 'tinymce'

type RtePreset = 'full' | 'standard' | 'simple'

interface RichTextEditorProps {
  value: string
  onChange: (val: string) => void
  preset?: RtePreset
  minHeight?: number
  placeholder?: string
  disabled?: boolean
  label?: string
  labelStyle?: React.CSSProperties
  hint?: string
}

// ── Toolbar & Plugin configs per preset ──────────────────────────────────────

const PRESETS: Record<RtePreset, { toolbar: string; plugins: string[]; height: number }> = {
  // Full — for fullDescription, selectionDetails, syllabusDetails (2000+ word content)
  full: {
    height: 380,
    plugins: [
      'lists', 'table', 'link', 'autolink',
      'searchreplace', 'visualblocks', 'wordcount',
      'image', 'charmap', 'anchor', 'code',
    ],
    toolbar:
      'undo redo | styleselect | bold italic underline | ' +
      'alignleft aligncenter alignright | ' +
      'bullist numlist | outdent indent | ' +
      'table | link | hr | removeformat | code',
  },
  // Standard — for most fields: howToApply, ageRelaxation, selectionDetails, zoneWiseVacancy, feeRefund, syllabus
  standard: {
    height: 220,
    plugins: ['lists', 'table', 'link', 'autolink'],
    toolbar:
      'bold italic | bullist numlist | table | link | removeformat',
  },
  // Simple — for Assamese fields, description, process
  simple: {
    height: 160,
    plugins: ['lists', 'link', 'autolink'],
    toolbar: 'bold italic | bullist numlist | link | removeformat',
  },
}

// ── Shared TinyMCE init settings ─────────────────────────────────────────────

function buildInit(preset: RtePreset, minHeight?: number): Record<string, unknown> {
  const cfg = PRESETS[preset]
  return {
    height: minHeight ?? cfg.height,
    plugins: cfg.plugins,
    toolbar: cfg.toolbar,
    licenseKey: 'gpl',        // ← ADD THIS LINE
    menubar: false,
    branding: false,
    promotion: false,
    statusbar: preset === 'full',
    resize: true,
    browser_spellcheck: true,
    contextmenu: false,
    // Table defaults — clean, no extra styles
    table_default_attributes: { border: '1', cellpadding: '6', cellspacing: '0' },
    table_default_styles: {
      'border-collapse': 'collapse',
      width: '100%',
    },
    // Match admin panel font
    content_style: `
      body {
        font-family: Nunito, -apple-system, sans-serif;
        font-size: 14px;
        color: #1a1a2e;
        line-height: 1.6;
        margin: 10px 14px;
      }
      table { border-collapse: collapse; width: 100%; margin: 8px 0; }
      th, td { border: 1px solid #d4e0ec; padding: 7px 10px; text-align: left; }
      th { background: #f0f4f8; font-weight: 700; color: #3a5068; }
      h2, h3 { color: #0d1b2a; }
      ul, ol { padding-left: 20px; }
      li { margin-bottom: 4px; }
      a { color: #0096b7; }
    `,
    // Paste as plain text by default — avoids messy Word/Google Docs paste
    paste_as_text: false,
    paste_word_valid_elements: 'b,strong,i,em,h2,h3,p,ul,ol,li,table,tr,th,td',
    // Prevent empty paragraphs becoming &nbsp;
    forced_root_block: 'p',
    remove_trailing_brs: true,
    // Style dropdown options
    style_formats: [
      { title: 'Heading 2', block: 'h2' },
      { title: 'Heading 3', block: 'h3' },
      { title: 'Paragraph', block: 'p' },
    ],
  }
}

// ── Label styles (matching admin panel) ──────────────────────────────────────

const defaultLb: React.CSSProperties = {
  display: 'block',
  fontSize: '0.72rem',
  fontWeight: 700,
  color: '#5a6a7a',
  marginBottom: 6,
  letterSpacing: '0.03em',
  textTransform: 'uppercase',
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function RichTextEditor({
  value,
  onChange,
  preset = 'standard',
  minHeight,
  placeholder,
  disabled = false,
  label,
  labelStyle,
  hint,
}: RichTextEditorProps) {
  const editorRef = useRef<TinyMCEEditor | null>(null)
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch — render only client-side
  useEffect(() => { setMounted(true) }, [])

  if (!mounted) {
    // Skeleton placeholder while editor loads
    const skH = minHeight ?? PRESETS[preset].height
    return (
      <div>
        {label && <label style={{ ...defaultLb, ...labelStyle }}>{label}</label>}
        <div style={{
          height: skH,
          background: '#f0f4f8',
          border: '1.5px solid #d4e0ec',
          borderRadius: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#8fa3b8',
          fontSize: '.8rem',
          fontFamily: 'Nunito, sans-serif',
        }}>
          ⏳ Loading editor…
        </div>
        {hint && <div style={{ fontSize: '.7rem', color: '#8fa3b8', marginTop: 4 }}>{hint}</div>}
      </div>
    )
  }

  return (
    <div style={{ opacity: disabled ? 0.6 : 1, pointerEvents: disabled ? 'none' : 'auto' }}>
      {label && <label style={{ ...defaultLb, ...labelStyle }}>{label}</label>}

      <div style={{ border: '1.5px solid #d4e0ec', borderRadius: 8, overflow: 'hidden' }}>
        <Editor
          tinymceScriptSrc="/tinymce/tinymce.min.js"
          onInit={(_evt, editor) => { editorRef.current = editor }}
          value={value || ''}
          onEditorChange={(content) => onChange(content)}
          disabled={disabled}
          init={{
            ...buildInit(preset, minHeight),
            placeholder: placeholder ?? '',
          }}
        />
      </div>

      {hint && (
        <div style={{ fontSize: '.7rem', color: '#8fa3b8', marginTop: 4 }}>{hint}</div>
      )}
    </div>
  )
}
