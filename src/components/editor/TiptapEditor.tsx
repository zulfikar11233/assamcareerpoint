'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Underline } from '@tiptap/extension-underline'
import { Link } from '@tiptap/extension-link'
import { Placeholder } from '@tiptap/extension-placeholder'
import { Table } from '@tiptap/extension-table'
import { TableRow } from '@tiptap/extension-table-row'
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
      TableRow,
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
      if (draftKey && typeof window !== 'undefined') {
        localStorage.setItem(draftKey, html)
      }
    },
  })

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
    <div style={{ border: '1.5px solid #d4e0ec', borderRadius: 8, background: '#fff', maxHeight: minHeight * 2.2 + 60, overflowY: 'auto' as const }}>
      <div style={{ position: 'sticky', top: 0, zIndex: 20, background: '#fff' }}>
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

      <div style={{ minHeight, padding: '10px 12px' }}>
        <EditorContent editor={editor} />
      </div>

      <LinkDialog
        open={linkOpen}
        initialUrl={editor.isActive('link') ? String(editor.getAttributes('link').href || '') : ''}
        onClose={() => setLinkOpen(false)}
        onSubmit={handleLinkSubmit}
      />

      <style jsx global>{`
        .ProseMirror { outline: none; }
        .ProseMirror .tableWrapper { overflow-x: auto; }
        .ProseMirror table { border-collapse: collapse; width: 100%; margin: 8px 0; table-layout: fixed; }
        .ProseMirror table td, .ProseMirror table th { border: 1px solid #d4e0ec; padding: 6px 8px; position: relative; }
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