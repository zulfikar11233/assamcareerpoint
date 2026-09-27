'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Underline } from '@tiptap/extension-underline'
import { Link } from '@tiptap/extension-link'
import { Placeholder } from '@tiptap/extension-placeholder'
import { Table } from '@tiptap/extension-table'
import { CustomTableRow } from './TableRowResize'
import { TableHeader } from '@tiptap/extension-table-header'
import { TableCell } from '@tiptap/extension-table-cell'
import { TextStyle } from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import { Highlight } from '@tiptap/extension-highlight'
import { TextAlign } from '@tiptap/extension-text-align'
import { TaskList } from '@tiptap/extension-task-list'
import { TaskItem } from '@tiptap/extension-task-item'
import { Image } from '@tiptap/extension-image'
import { Youtube } from '@tiptap/extension-youtube'
import { FontFamily } from '@tiptap/extension-font-family'
import { mergeAttributes } from '@tiptap/core'
import { useEffect, useRef, useState } from 'react'

import Toolbar, { portalBlocks } from './Toolbar'
import LinkDialog from './LinkDialog'
import type { ImageInsert } from './ImageUploader'

// Adds a `fontSize` attribute to the standard textStyle mark, so the
// toolbar's "Font size" dropdown works without needing a separate package.
const FontSize = TextStyle.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      fontSize: {
        default: null,
        parseHTML: (element: HTMLElement) => element.style.fontSize || null,
        renderHTML: (attributes: { fontSize?: string | null }) => {
          if (!attributes.fontSize) return {}
          return { style: `font-size: ${attributes.fontSize}` }
        },
      },
    }
  },
})

// ─────────────────────────────────────────────────────────────
// 1. RESIZABLE IMAGE EXTENSION
// ─────────────────────────────────────────────────────────────
const ResizableImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      style: {
        default: null,
        parseHTML: (element: HTMLElement) => element.getAttribute('style'),
        renderHTML: () => ({}),
      },
      width: {
        default: null,
        parseHTML: (element: HTMLElement) => element.style.width || null,
        renderHTML: () => ({}),
      },
    }
  },
  renderHTML({ HTMLAttributes, node }) {
    const alignStyle = typeof node.attrs.style === 'string' ? node.attrs.style.replace(/;\s*$/, '') : ''
    const width = node.attrs.width
    const parts = [alignStyle, width ? `width: ${width}` : '', width ? 'height: auto' : ''].filter(Boolean)
    const mergedStyle = parts.length ? parts.join('; ') : undefined
    return ['img', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, mergedStyle ? { style: mergedStyle } : {})]
  },
})

// ─────────────────────────────────────────────────────────────
// 2. CUSTOM TABLE CELL EXTENSION (with border + background)
// ─────────────────────────────────────────────────────────────
const CustomTableCell = TableCell.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      borderColor: { default: null, parseHTML: (element: HTMLElement) => element.style.borderColor || null, renderHTML: () => ({}) },
      borderWidth: { default: null, parseHTML: (element: HTMLElement) => element.style.borderWidth || null, renderHTML: () => ({}) },
      borderStyle: { default: null, parseHTML: (element: HTMLElement) => element.style.borderStyle || null, renderHTML: () => ({}) },
      backgroundColor: { default: null, parseHTML: (element: HTMLElement) => element.style.backgroundColor || null, renderHTML: () => ({}) },
    }
  },
  renderHTML({ HTMLAttributes, node }) {
    const { borderColor, borderWidth, borderStyle, backgroundColor } = node.attrs
    const parts = [
      borderWidth ? `border-width: ${borderWidth}` : '',
      borderStyle ? `border-style: ${borderStyle}` : '',
      borderColor ? `border-color: ${borderColor}` : '',
      backgroundColor ? `background-color: ${backgroundColor}` : '',
    ].filter(Boolean)
    const style = parts.length ? parts.join('; ') : undefined
    return ['td', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, style ? { style } : {}), 0]
  },
})

// ─────────────────────────────────────────────────────────────
// 3. CUSTOM TABLE HEADER EXTENSION (with border + background)
// ─────────────────────────────────────────────────────────────
const CustomTableHeader = TableHeader.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      borderColor: { default: null, parseHTML: (element: HTMLElement) => element.style.borderColor || null, renderHTML: () => ({}) },
      borderWidth: { default: null, parseHTML: (element: HTMLElement) => element.style.borderWidth || null, renderHTML: () => ({}) },
      borderStyle: { default: null, parseHTML: (element: HTMLElement) => element.style.borderStyle || null, renderHTML: () => ({}) },
      backgroundColor: { default: null, parseHTML: (element: HTMLElement) => element.style.backgroundColor || null, renderHTML: () => ({}) },
    }
  },
  renderHTML({ HTMLAttributes, node }) {
    const { borderColor, borderWidth, borderStyle, backgroundColor } = node.attrs
    const parts = [
      borderWidth ? `border-width: ${borderWidth}` : '',
      borderStyle ? `border-style: ${borderStyle}` : '',
      borderColor ? `border-color: ${borderColor}` : '',
      backgroundColor ? `background-color: ${backgroundColor}` : '',
    ].filter(Boolean)
    const style = parts.length ? parts.join('; ') : undefined
    return ['th', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, style ? { style } : {}), 0]
  },
})

interface TiptapEditorProps {
  value: string
  onChange: (val: string) => void
  minHeight?: number
  placeholder?: string
  disabled?: boolean
  draftKey?: string
  clearDraftSignal?: unknown
}

export default function TiptapEditor({
  value,
  onChange,
  minHeight = 200,
  placeholder = 'Start typing…',
  disabled = false,
  draftKey,
  clearDraftSignal,
}: TiptapEditorProps) {
  const isFirstRender = useRef(true)
  const [linkOpen, setLinkOpen] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const [stats, setStats] = useState({ words: 0, chars: 0 })

  const editor = useEditor({
    immediatelyRender: false,
    editable: !disabled,
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3, 4, 5, 6] } }),
      Underline,
      FontSize,
      FontFamily,
      Color,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      TaskList,
      TaskItem.configure({ nested: true }),
      ResizableImage,
      Youtube,
      Link.configure({ openOnClick: false, autolink: true }),
      Placeholder.configure({ placeholder }),
      Table.configure({ resizable: true }),
      CustomTableRow,
      CustomTableHeader,
      CustomTableCell,
    ],
    content:
      (draftKey && typeof window !== 'undefined' && localStorage.getItem(draftKey)) ||
      value ||
      '',
        onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      onChange(html)
      const text = editor.getText()
      setStats({ words: text.trim() ? text.trim().split(/\s+/).length : 0, chars: text.length })
      if (draftKey && typeof window !== 'undefined') {
        localStorage.setItem(draftKey, html)
      }
    },
  })

  useEffect(() => {
    if (!editor) return
    const text = editor.getText()
    setStats({ words: text.trim() ? text.trim().split(/\s+/).length : 0, chars: text.length })
  }, [editor])

  // Keep editor in sync if `value` changes from outside (e.g. loading saved data on edit)
  useEffect(() => {
    if (!editor) return
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    const current = editor.getHTML()
    if (value !== current) {
      editor.commands.setContent(value || '', { emitUpdate: false })
    }
  }, [value, editor])

  // Clear the saved draft after a successful save
  useEffect(() => {
    if (draftKey && clearDraftSignal !== undefined && typeof window !== 'undefined') {
      localStorage.removeItem(draftKey)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clearDraftSignal])

  if (!editor) return null

  const handleInsertPortalBlock = (id: string) => {
    const block = portalBlocks[id]
    if (!block) return
    if (block.type === 'table') {
      editor.chain().focus().insertTable({ rows: block.rows, cols: block.cols, withHeaderRow: block.withHeaderRow }).run()
    } else {
      editor.chain().focus().insertContent(block.content).run()
    }
  }

  const handleLinkSubmit = (url: string) => {
    if (url) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
    } else {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
    }
  }

  const noopUploadImage: ImageInsert = async () => {}

    return (
    <div style={{
      position: fullscreen ? 'fixed' as const : 'relative' as const,
      top: fullscreen ? 0 : undefined, left: fullscreen ? 0 : undefined,
      right: fullscreen ? 0 : undefined, bottom: fullscreen ? 0 : undefined,
      zIndex: fullscreen ? 9999 : undefined,
      border: '1.5px solid #d4e0ec', borderRadius: fullscreen ? 0 : 8, background: '#fff',
      maxHeight: fullscreen ? '100vh' : minHeight * 2.2 + 60, overflowY: 'auto' as const
    }}>
      <div style={{ position: 'sticky', top: 0, zIndex: 20, background: '#fff', display: 'flex', alignItems: 'center' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <Toolbar
            editor={editor}
            onLink={() => setLinkOpen(true)}
            onInsertPortalBlock={handleInsertPortalBlock}
            uploadImage={noopUploadImage}
            onSource={() => {}}
            onPreview={() => {}}
            disabled={disabled}
          />
        </div>
        <button
          type="button"
          onClick={() => setFullscreen(v => !v)}
          title={fullscreen ? 'Exit fullscreen' : 'Fullscreen'}
          style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: '8px 10px', fontSize: '1rem', flexShrink: 0 }}
        >
          {fullscreen ? '✕' : '⛶'}
        </button>
      </div>

      <div
        style={{ minHeight, padding: '10px 12px', cursor: 'text' }}
        onClick={() => editor.chain().focus().run()}
      >
        <EditorContent editor={editor} />
      </div>

      <div style={{ padding: '4px 12px 8px', textAlign: 'right' as const, fontSize: '.68rem', color: '#8fa3b8', borderTop: '1px solid #f0f4f8' }}>
        {stats.words} words · {stats.chars} characters
      </div>

      <LinkDialog
        open={linkOpen}
        initialUrl={editor.isActive('link') ? String(editor.getAttributes('link').href || '') : ''}
        onClose={() => setLinkOpen(false)}
        onSubmit={handleLinkSubmit}
      />

      <style jsx global>{`
        .ProseMirror { outline: none; }
	.ProseMirror p { margin: 0 0 10px; }
	.ProseMirror p:last-child { margin-bottom: 0; }
        .ProseMirror .tableWrapper { overflow-x: auto; }
        .ProseMirror table { border-collapse: collapse; width: auto; max-width: 100%; margin: 8px 0; table-layout: fixed; }
        .ProseMirror table td, .ProseMirror table th { border: 1px solid #d4e0ec; padding: 4px 8px; position: relative; }
	.ProseMirror table td p, .ProseMirror table th p { margin: 0; }
        .ProseMirror table th { background: #f0f4f8; font-weight: 700; text-align: left; }
        .ProseMirror .column-resize-handle { position: absolute; right: -2px; top: 0; bottom: -2px; width: 4px; background-color: #00b4d8; pointer-events: none; }
        .ProseMirror.resize-cursor { cursor: col-resize; }
        .ProseMirror img { max-width: 100%; height: auto; }
        .ProseMirror blockquote { border-left: 3px solid #00b4d8; margin: 8px 0; padding: 4px 12px; color: #5a6a7a; }
        .ProseMirror pre { background: #0d1b2a; color: #e0f7fc; padding: 10px 14px; border-radius: 6px; overflow-x: auto; }
        .ProseMirror ul[data-type="taskList"] { list-style: none; padding-left: 4px; }
        .ProseMirror ul[data-type="taskList"] li { display: flex; align-items: flex-start; gap: 6px; }
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          color: #aab5c0;
          float: left;
          height: 0;
          pointer-events: none;
        }
      `}</style>
    </div>
  )
}
