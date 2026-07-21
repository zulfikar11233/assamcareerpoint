'use client'

import type { JSONContent } from '@tiptap/core'
import type { Editor } from '@tiptap/react'
import type { ImageInsert } from './ImageUploader'
import TableControls from './TableControls'
import { useState } from 'react'  // <-- NEW import for emoji size state

type TablePortalBlock = { type: 'table'; rows: number; cols: number; withHeaderRow: boolean }
type ContentPortalBlock = { type: 'content'; content: JSONContent[] }
export type PortalBlock = TablePortalBlock | ContentPortalBlock

export const portalBlocks: Record<string, PortalBlock> = {
  'Vacancy table': { type: 'table', rows: 2, cols: 3, withHeaderRow: true },
  'Important dates': { type: 'table', rows: 3, cols: 2, withHeaderRow: true },
  'Important links': { type: 'table', rows: 2, cols: 2, withHeaderRow: true },
  'Salary table': { type: 'table', rows: 2, cols: 2, withHeaderRow: true },
  'Selection process': { type: 'content', content: [{ type: 'heading', attrs: { level: 3 }, content: [{ type: 'text', text: 'Selection Process' }] }, { type: 'orderedList', content: [{ type: 'listItem', content: [{ type: 'paragraph' }] }] }] },
  'Application fee': { type: 'content', content: [{ type: 'blockquote', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Application Fee', marks: [{ type: 'bold' }] }] }, { type: 'paragraph' }] }] },
  'Important notice': { type: 'content', content: [{ type: 'blockquote', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Important Notice', marks: [{ type: 'bold' }] }] }, { type: 'paragraph' }] }] },
  'FAQ': { type: 'content', content: [{ type: 'heading', attrs: { level: 3 }, content: [{ type: 'text', text: 'Frequently Asked Questions' }] }, { type: 'blockquote', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Question', marks: [{ type: 'bold' }] }] }, { type: 'paragraph', content: [{ type: 'text', text: 'Answer' }] }] }] },
  'Official notification': { type: 'content', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Official Notification', marks: [{ type: 'link', attrs: { href: '#' } }] }] }] },
  'Apply online': { type: 'content', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Apply Online', marks: [{ type: 'link', attrs: { href: '#' } }] }] }] },
  'Result': { type: 'content', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Result', marks: [{ type: 'link', attrs: { href: '#' } }] }] }] },
  'Admit card': { type: 'content', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Admit Card', marks: [{ type: 'link', attrs: { href: '#' } }] }] }] },
}

// ─────────────────────────────────────────────────────────────
// Google Drive image fix
// ─────────────────────────────────────────────────────────────
function driveImgUrl(url: string): string {
  if (!url) return ''
  const m = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || url.match(/[?&]id=([a-zA-Z0-9_-]+)/)
  if (m) return `https://lh3.googleusercontent.com/d/${m[1]}`
  return url
}

export default function Toolbar({ editor, onLink, onInsertPortalBlock, uploadImage, disabled, imageInputId }: { editor: Editor; onLink: () => void; onInsertPortalBlock: (id: string) => void; uploadImage: ImageInsert; onSource: () => void; onPreview: () => void; disabled?: boolean; imageInputId?: string }) {
  // ─── NEW: emoji size state ───
  const [emojiSize, setEmojiSize] = useState('1.5rem')

  const run = (command: () => boolean) => () => command()
  const button = (label: string, command: () => boolean, title = label) => <button type="button" title={title} aria-label={title} onClick={run(command)} disabled={disabled}>{label}</button>
  const row = { display: 'flex', flexWrap: 'wrap' as const, gap: 4, width: '100%', alignItems: 'center' }
  const menu = { position: 'relative' as const }
  const menuContent = { position: 'absolute' as const, zIndex: 10, top: 'calc(100% + 4px)', left: 0, display: 'flex', gap: 4, flexWrap: 'wrap' as const, minWidth: 200, padding: 8, border: '1px solid var(--border,#d4e0ec)', borderRadius: 6, background: 'var(--card-bg,#fff)' }

  return <div role="toolbar" aria-label="Rich text editing tools" style={{ display: 'flex', flexWrap: 'wrap', gap: 8, padding: 8, borderBottom: '1px solid var(--border,#d4e0ec)', background: 'var(--card-bg,#fff)' }}>
    <div style={row}>
      {button('Undo', () => editor.chain().focus().undo().run())}{button('Redo', () => editor.chain().focus().redo().run())}
      <select aria-label="Heading" onChange={event => { const level = Number(event.target.value); if (level) editor.chain().focus().toggleHeading({ level: level as 1|2|3|4|5|6 }).run(); else editor.chain().focus().setParagraph().run() }} defaultValue="0"><option value="0">Heading</option>{[1,2,3,4,5,6].map(level => <option key={level} value={level}>Heading H{level}</option>)}</select>
      {button('B', () => editor.chain().focus().toggleBold().run(), 'Bold')}{button('I', () => editor.chain().focus().toggleItalic().run(), 'Italic')}{button('U', () => editor.chain().focus().toggleUnderline().run(), 'Underline')}{button('S', () => editor.chain().focus().toggleStrike().run(), 'Strike')}
      <input aria-label="Text color" type="color" onChange={event => editor.chain().focus().setColor(event.target.value).run()} /><input aria-label="Highlight color" type="color" onChange={event => editor.chain().focus().toggleHighlight({ color: event.target.value }).run()} />

      <select aria-label="Font family" defaultValue="" onChange={event => { const v = event.target.value; if (v) editor.chain().focus().setFontFamily(v).run(); else editor.chain().focus().unsetFontFamily().run() }}>
        <option value="">Font</option>
        <option value="Sora, sans-serif">Sora</option>
        <option value="Nunito, sans-serif">Nunito</option>
        <option value="Arial, sans-serif">Arial</option>
        <option value="Georgia, serif">Georgia</option>
        <option value="'Times New Roman', serif">Times New Roman</option>
        <option value="'Courier New', monospace">Courier New</option>
        <option value="Verdana, sans-serif">Verdana</option>
      </select>

      <select aria-label="Font size" defaultValue="" onChange={event => { if (event.target.value) editor.chain().focus().setMark('textStyle', { fontSize: event.target.value }).run() }}><option value="">Font size</option>{['12px','14px','16px','18px','20px','24px','28px'].map(size => <option key={size}>{size}</option>)}</select>
    </div>
    <div style={row}>
      <details style={menu}><summary style={{ cursor: 'pointer' }}>Alignment ▾</summary><div style={menuContent}>{button('Left', () => editor.chain().focus().setTextAlign('left').run())}{button('Center', () => editor.chain().focus().setTextAlign('center').run())}{button('Right', () => editor.chain().focus().setTextAlign('right').run())}</div></details>
      <details style={menu}><summary style={{ cursor: 'pointer' }}>Lists ▾</summary><div style={menuContent}>{button('Bullet list', () => editor.chain().focus().toggleBulletList().run())}{button('Ordered list', () => editor.chain().focus().toggleOrderedList().run())}{button('Task list', () => editor.chain().focus().toggleTaskList().run())}</div></details>
      {button('Quote', () => editor.chain().focus().toggleBlockquote().run())}{button('Code', () => editor.chain().focus().toggleCode().run())}{button('Code block', () => editor.chain().focus().toggleCodeBlock().run())}{button('HR', () => editor.chain().focus().setHorizontalRule().run())}
    </div>
    <div style={row}>
      {/* ─── REPLACED IMAGE DROPDOWN ─── */}
      <details style={menu}><summary style={{ cursor: 'pointer' }}>Image ▾</summary><div style={{ ...menuContent, width: 320 }}>
        <button type="button" onClick={e => { const d = e.currentTarget.closest('details') as HTMLDetailsElement | null; if (d) d.open = false }} style={{ fontWeight: 700 }}>✕ Close</button>
        <div style={{ width: '100%' }} />
        <button type="button" disabled={disabled} onClick={() => { const url = window.prompt('Paste Google Drive image URL:'); if (url) editor.chain().focus().setImage({ src: driveImgUrl(url) }).run() }}>Insert image (URL)</button>
        <div style={{ width: '100%' }} />
        <span style={{ alignSelf: 'center', fontSize: '.75rem', fontWeight: 700 }}>Align:</span>
        <button type="button" onClick={() => editor.chain().focus().updateAttributes('image', { style: 'display:block;max-width:100%;height:auto;margin:1rem auto 1rem 0;' }).run()}>Left</button>
        <button type="button" onClick={() => editor.chain().focus().updateAttributes('image', { style: 'display:block;max-width:100%;height:auto;margin:1rem auto;' }).run()}>Center</button>
        <button type="button" onClick={() => editor.chain().focus().updateAttributes('image', { style: 'display:block;max-width:100%;height:auto;margin:1rem 0 1rem auto;' }).run()}>Right</button>
        <div style={{ width: '100%' }} />
        <span style={{ alignSelf: 'center', fontSize: '.75rem', fontWeight: 700 }}>Size:</span>
        <button type="button" onClick={() => editor.chain().focus().updateAttributes('image', { width: '25%' }).run()}>25%</button>
        <button type="button" onClick={() => editor.chain().focus().updateAttributes('image', { width: '50%' }).run()}>50%</button>
        <button type="button" onClick={() => editor.chain().focus().updateAttributes('image', { width: '75%' }).run()}>75%</button>
        <button type="button" onClick={() => editor.chain().focus().updateAttributes('image', { width: null }).run()}>Full</button>
        <div style={{ width: '100%' }} />
        <span style={{ alignSelf: 'center', fontSize: '.75rem', fontWeight: 700 }}>Alt text:</span>
        <button type="button" onClick={() => { const alt = window.prompt('Image alternative text', String(editor.getAttributes('image').alt || '')); if (alt !== null) editor.chain().focus().updateAttributes('image', { alt }).run() }}>✏️ Set alt text</button>
        <div style={{ width: '100%' }} />
        <button type="button" onClick={() => editor.chain().focus().deleteSelection().run()} style={{ color: '#c0392b', fontWeight: 700 }}>🗑 Remove image</button>
      </div></details>

      <TableControls editor={editor} />

      {/* ─── UPDATED LINK DROPDOWN WITH CLOSE BUTTON ─── */}
      <details style={menu}><summary style={{ cursor: 'pointer' }}>Link ▾</summary><div style={menuContent}>
        <button type="button" onClick={e => { const d = e.currentTarget.closest('details') as HTMLDetailsElement | null; if (d) d.open = false }} style={{ fontWeight: 700 }}>✕ Close</button>
        <button type="button" onClick={onLink}>Link</button>
        {button('Unlink', () => editor.chain().focus().unsetLink().run())}
      </div></details>

      {/* ─── REPLACED YOUTUBE DROPDOWN ─── */}
      <details style={menu}><summary style={{ cursor: 'pointer' }}>YouTube ▾</summary><div style={{ ...menuContent, width: 280 }}>
        <button type="button" onClick={e => { const d = e.currentTarget.closest('details') as HTMLDetailsElement | null; if (d) d.open = false }} style={{ fontWeight: 700 }}>✕ Close</button>
        <div style={{ width: '100%' }} />
        <button type="button" onClick={() => { const url = window.prompt('YouTube URL'); if (url) editor.commands.setYoutubeVideo({ src: url }) }}>Insert / Replace video</button>
        <div style={{ width: '100%' }} />
        <span style={{ alignSelf: 'center', fontSize: '.75rem', fontWeight: 700 }}>Size:</span>
        <button type="button" onClick={() => editor.chain().focus().updateAttributes('youtube', { width: 320, height: 180 }).run()}>Small</button>
        <button type="button" onClick={() => editor.chain().focus().updateAttributes('youtube', { width: 480, height: 270 }).run()}>Medium</button>
        <button type="button" onClick={() => editor.chain().focus().updateAttributes('youtube', { width: 640, height: 360 }).run()}>Large</button>
        <button type="button" onClick={() => editor.chain().focus().updateAttributes('youtube', { width: 854, height: 480 }).run()}>X-Large</button>
        <div style={{ width: '100%' }} />
        <button type="button" onClick={() => editor.chain().focus().deleteSelection().run()} style={{ color: '#c0392b', fontWeight: 700 }}>🗑 Remove video</button>
      </div></details>

      {/* ─── REPLACED EMOJI DROPDOWN ─── */}
      <details style={menu}><summary style={{ cursor: 'pointer' }}>Emoji ▾</summary><div style={{ ...menuContent, maxWidth: 280 }}>
        <button type="button" onClick={e => { const d = e.currentTarget.closest('details') as HTMLDetailsElement | null; if (d) d.open = false }} style={{ fontWeight: 700 }}>✕ Close</button>
        <div style={{ width: '100%' }} />
        <span style={{ alignSelf: 'center', fontSize: '.75rem', fontWeight: 700 }}>Size:</span>
        <select value={emojiSize} onChange={e => setEmojiSize(e.target.value)}>
          <option value="1rem">Small</option>
          <option value="1.5rem">Medium</option>
          <option value="2rem">Large</option>
          <option value="2.75rem">X-Large</option>
        </select>
        <div style={{ width: '100%' }} />
        {['😊','👍','✅','⭐','🔔','📢','📌','📅','💰','🎓','🏆','📄','🔗','📞','✉️','⚠️','❗','❓','➡️','⬅️','🟢','🔴','🟡','©','®','™','▶️','🖊️','📷','💼'].map(emoji =>
          <button key={emoji} type="button" title={emoji} aria-label={emoji}
            onClick={() => editor.chain().focus().insertContent({ type: 'text', text: emoji, marks: [{ type: 'textStyle', attrs: { fontSize: emojiSize } }] }).run()}
            style={{ fontSize: '1.1rem', padding: '4px 6px' }}>{emoji}</button>
        )}
      </div></details>
    </div>
    <div style={row}><select aria-label="Recruitment portal blocks" defaultValue="" onChange={event => { onInsertPortalBlock(event.target.value); event.target.value = '' }}><option value="">Portal Blocks ▼</option>{Object.keys(portalBlocks).map(name => <option key={name}>{name}</option>)}</select></div>
  </div>
}