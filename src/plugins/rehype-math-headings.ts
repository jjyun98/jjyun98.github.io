import type { Root, Element, ElementContent } from 'hast'
import type { VFile } from 'vfile'

/*
 * 목차(TOC)용 제목 텍스트에 수식을 $...$ 로 남긴다.
 * rehypeHeadingIds는 인라인 수식의 TeX만 이어 붙여 "\mathbf{AB}의 열"처럼 구분자가 사라진 텍스트를 만든다.
 * 이 플러그인은 rehypeHeadingIds 바로 뒤, rehypeKatex 앞에 두어 수식 부분을 $...$ 로 감싼 텍스트로 바꾼다.
 * TableOfContentsHeading.astro가 $...$ 를 KaTeX로 렌더링한다.
 */
const isMath = (node: ElementContent): node is Element => {
  if (node.type !== 'element') return false
  const cls = node.properties?.className
  return Array.isArray(cls) && cls.some((c) => String(c).startsWith('math-'))
}

const textOf = (node: ElementContent): string => {
  if (node.type === 'text') return node.value
  if (node.type !== 'element') return ''
  if (isMath(node)) return `$${node.children.map(textOf).join('')}$`
  return node.children.map(textOf).join('')
}

export default function rehypeMathHeadings() {
  return function (tree: Root, file: VFile) {
    const headings = (file.data as { astro?: { headings?: { text: string }[] } }).astro?.headings
    if (!headings?.length) return
    const found: Element[] = []
    const walk = (node: Root | ElementContent) => {
      if (node.type === 'element' && /^h[1-6]$/.test(node.tagName)) {
        found.push(node)
        return
      }
      if ('children' in node) node.children.forEach((c) => walk(c as ElementContent))
    }
    walk(tree)
    if (found.length !== headings.length) return
    found.forEach((h, i) => {
      if (h.children.some((c) => JSON.stringify(c).includes('math-'))) {
        headings[i].text = h.children.map(textOf).join('')
      }
    })
  }
}
