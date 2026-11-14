import type * as hast from 'hast'
import type { RehypePlugin } from '@astrojs/markdown-remark'
import { h } from 'hastscript'

/**
 * Wrap markdown <table> elements in a horizontally scrollable container for mobile viewports.
 */
export const rehypeTableWrapper: RehypePlugin = () => {
  function isElement(content: hast.RootContent): content is hast.Element {
    return content.type === 'element'
  }

  function transformTree(node: hast.Root | hast.Element) {
    if (!node.children) return
    node.children = node.children.map((child) => {
      if (!isElement(child)) return child
      if (child.tagName === 'table') {
        return h('div.table-wrapper', [child])
      }
      transformTree(child)
      return child
    })
  }

  return function (tree: hast.Root) {
    transformTree(tree)
  }
}

export default rehypeTableWrapper
