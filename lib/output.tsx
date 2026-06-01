import React from 'react'

export interface Section {
  title: string
  content: string
}

export function parseSections(text: string): Section[] {
  const sections: Section[] = []
  let current: Section | null = null
  for (const line of text.split('\n')) {
    if (line.startsWith('## ')) {
      if (current) sections.push(current)
      current = { title: line.slice(3).replace(/^\d+\.\s*/, ''), content: '' }
    } else if (current) {
      current.content += line + '\n'
    }
  }
  if (current) sections.push(current)
  return sections
}

export function inlineBold(text: string, dark = false): string {
  const cls = dark ? 'font-semibold text-white' : 'font-semibold text-gray-900'
  return text.replace(/\*\*(.*?)\*\*/g, `<strong class="${cls}">$1</strong>`)
}

export function renderContent(text: string, dark = false): React.ReactNode[] {
  const lines = text.split('\n')
  const elements: React.ReactNode[] = []
  let listBuffer: { text: string; isQuote: boolean }[] = []
  let key = 0

  const textCls = dark ? 'text-gray-300' : 'text-gray-700'
  const boldCls = dark ? 'text-white font-semibold' : 'text-gray-900 font-semibold'
  const borderCls = dark ? 'border-accent/60' : 'border-accent/40'
  const bulletTextCls = dark ? 'text-gray-300' : 'text-gray-700'

  function flushList() {
    if (!listBuffer.length) return
    elements.push(
      <ul key={key++} className="space-y-1.5 mt-3">
        {listBuffer.map((item, i) => {
          if (item.isQuote) {
            const cleaned = item.text.replace(/^["""]+|["""]+$/g, '')
            return (
              <li key={i} className={`pl-3 border-l-2 border-accent/60 italic py-0.5 text-sm leading-relaxed ${dark ? 'text-gray-200' : 'text-gray-800'}`}>
                <span className={`not-italic mr-1 font-serif text-sm ${dark ? 'text-accent/60' : 'text-accent/50'}`}>"</span>
                <span dangerouslySetInnerHTML={{ __html: inlineBold(cleaned, dark) }} />
                <span className={`not-italic ml-1 font-serif text-sm ${dark ? 'text-accent/60' : 'text-accent/50'}`}>"</span>
              </li>
            )
          }
          return (
            <li key={i} className={`pl-3 border-l-2 ${borderCls} ${bulletTextCls} text-sm leading-relaxed py-0.5`}>
              <span dangerouslySetInnerHTML={{ __html: inlineBold(item.text, dark) }} />
            </li>
          )
        })}
      </ul>
    )
    listBuffer = []
  }

  for (const line of lines) {
    if (line.startsWith('### ')) {
      flushList()
      elements.push(
        <p key={key++} className={`text-xs font-semibold uppercase tracking-widest mt-5 mb-2 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
          {line.slice(4)}
        </p>
      )
      continue
    }
    if (line.startsWith('- ') || line.startsWith('* ')) {
      const content = line.slice(2)
      listBuffer.push({ text: content, isQuote: /^[""""]/.test(content) })
      continue
    }
    if (/^\d+\.\s/.test(line)) {
      const content = line.replace(/^\d+\.\s/, '')
      listBuffer.push({ text: content, isQuote: /^[""""]/.test(content) })
      continue
    }
    if (line.trim() === '') { flushList(); continue }
    flushList()

    const isSoloBold = line.startsWith('**') && line.endsWith('**') && line.length > 4 && !line.slice(2, -2).includes('**')
    if (isSoloBold) {
      elements.push(
        <p key={key++} className={`text-sm mt-4 ${boldCls}`}>{line.slice(2, -2)}</p>
      )
    } else if (/^[""""]/.test(line)) {
      const cleaned = line.replace(/^["""]+|["""]+$/g, '')
      elements.push(
        <blockquote key={key++} className={`pl-4 border-l-2 border-accent/60 italic text-sm leading-relaxed my-3 ${dark ? 'text-gray-200' : 'text-gray-800'}`}>
          <span className={`not-italic font-serif mr-1 ${dark ? 'text-accent/60' : 'text-accent/50'}`}>"</span>
          {cleaned}
          <span className={`not-italic font-serif ml-1 ${dark ? 'text-accent/60' : 'text-accent/50'}`}>"</span>
        </blockquote>
      )
    } else {
      elements.push(
        <p key={key++} className={`text-sm leading-relaxed mt-2 first:mt-0 ${textCls}`}
          dangerouslySetInnerHTML={{ __html: inlineBold(line, dark) }} />
      )
    }
  }
  flushList()
  return elements
}
