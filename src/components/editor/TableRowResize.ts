import { TableRow as BaseTableRow } from '@tiptap/extension-table-row'
import { Plugin, PluginKey } from '@tiptap/pm/state'

export const CustomTableRow = BaseTableRow.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      height: {
        default: null,
        parseHTML: (element: HTMLElement) => {
          const h = element.style.height
          return h ? parseInt(h, 10) : null
        },
        renderHTML: (attributes: { height?: number | null }) => {
          if (!attributes.height) return {}
          return { style: `height: ${attributes.height}px` }
        },
      },
    }
  },
  addProseMirrorPlugins() {
    const parentPlugins = this.parent?.() || []
    let dragging: { rowEl: HTMLElement; startY: number; startHeight: number } | null = null

    return [
      ...parentPlugins,
      new Plugin({
        key: new PluginKey('rowResize'),
        props: {
          handleDOMEvents: {
            mousemove: (view, event) => {
              if (dragging) return false
              const row = (event.target as HTMLElement).closest('tr')
              if (!row) return false
              const rect = row.getBoundingClientRect()
              const nearBottom = event.clientY > rect.bottom - 6 && event.clientY < rect.bottom + 2
              ;(view.dom as HTMLElement).style.cursor = nearBottom ? 'row-resize' : ''
              return false
            },
            mousedown: (view, event) => {
              const row = (event.target as HTMLElement).closest('tr')
              if (!row) return false
              const rect = row.getBoundingClientRect()
              const nearBottom = event.clientY > rect.bottom - 6 && event.clientY < rect.bottom + 2
              if (!nearBottom) return false

              event.preventDefault()
              dragging = { rowEl: row as HTMLElement, startY: event.clientY, startHeight: rect.height }

              const onMove = (e: MouseEvent) => {
                if (!dragging) return
                const newHeight = Math.max(28, dragging.startHeight + (e.clientY - dragging.startY))
                dragging.rowEl.style.height = `${newHeight}px`
              }
              const onUp = () => {
                if (!dragging) return
                const finalHeight = dragging.rowEl.getBoundingClientRect().height
                const pos = view.posAtDOM(dragging.rowEl, 0)
                const $pos = view.state.doc.resolve(pos)
                for (let d = $pos.depth; d > 0; d--) {
                  const node = $pos.node(d)
                  if (node.type.name === 'tableRow') {
                    const rowPos = $pos.before(d)
                    view.dispatch(view.state.tr.setNodeMarkup(rowPos, undefined, { ...node.attrs, height: Math.round(finalHeight) }))
                    break
                  }
                }
                dragging = null
                window.removeEventListener('mousemove', onMove)
                window.removeEventListener('mouseup', onUp)
              }
              window.addEventListener('mousemove', onMove)
              window.addEventListener('mouseup', onUp)
              return true
            },
          },
        },
      }),
    ]
  },
})