'use client'

import { useState } from 'react'
import Link from 'next/link'

interface FormState {
  brand: string
  category: string
  vertical: string
  research: string
  focusArea: string
}

interface Section {
  title: string
  content: string
}

function parseSections(text: string): Section[] {
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

function renderContent(text: string) {
  const lines = text.split('\n')
  const elements: React.ReactNode[] = []
  let listBuffer: string[] = []
  let key = 0

  function flushList() {
    if (!listBuffer.length) return
    elements.push(
      <ul key={key++} className="space-y-2 mt-3">
        {listBuffer.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-gray-700 leading-relaxed">
            <span className="text-accent mt-0.5 shrink-0">—</span>
            <span dangerouslySetInnerHTML={{ __html: inlineBold(item) }} />
          </li>
        ))}
      </ul>
    )
    listBuffer = []
  }

  for (const line of lines) {
    if (line.startsWith('### ')) {
      flushList()
      elements.push(
        <p key={key++} className="text-xs font-semibold uppercase tracking-wide text-gray-500 mt-4 mb-1">
          {line.slice(4)}
        </p>
      )
      continue
    }
    if (line.startsWith('- ') || line.startsWith('* ')) {
      listBuffer.push(line.slice(2))
      continue
    }
    if (/^\d+\.\s/.test(line)) {
      listBuffer.push(line.replace(/^\d+\.\s/, ''))
      continue
    }
    if (line.trim() === '') {
      flushList()
      continue
    }
    flushList()
    const isSoloBold = line.startsWith('**') && line.endsWith('**') && line.length > 4 && !line.slice(2, -2).includes('**')
    if (isSoloBold) {
      elements.push(
        <p key={key++} className="text-sm font-semibold text-gray-900 mt-3">
          {line.slice(2, -2)}
        </p>
      )
    } else {
      // Quoted language — style differently
      const isQuote = line.startsWith('"') || line.startsWith('“')
      elements.push(
        <p key={key++}
          className={`text-sm leading-relaxed mt-2 first:mt-0 ${isQuote ? 'text-gray-900 italic pl-3 border-l-2 border-gray-200' : 'text-gray-700'}`}
          dangerouslySetInnerHTML={{ __html: inlineBold(line) }}
        />
      )
    }
  }

  flushList()
  return elements
}

function inlineBold(text: string): string {
  return text.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>')
}

const VERTICALS = ['Marketing Communication', 'Brand & Experience', 'Products & Services']

export default function TensionAnalysisPage() {
  const [form, setForm] = useState<FormState>({
    brand: '',
    category: '',
    vertical: 'Marketing Communication',
    research: '',
    focusArea: '',
  })
  const [output, setOutput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isDone, setIsDone] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setOutput('')
    setIsDone(false)
    setError('')

    try {
      const response = await fetch('/api/tension', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!response.ok) throw new Error(`Request failed: ${response.status}`)

      const reader = response.body!.getReader()
      const decoder = new TextDecoder()
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        setOutput((prev) => prev + decoder.decode(value, { stream: true }))
      }
      setIsDone(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Try again.')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const canSubmit = form.brand.trim() && form.category.trim() && form.research.trim() && !isLoading
  const sections = parseSections(output)

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
            ← 358 Listen
          </Link>
          <span className="text-xs text-gray-400 uppercase tracking-widest">
            02 / Audience Tension & Needs Analysis
          </span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-10">
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900 mb-2">
            Audience Tension & Needs Analysis
          </h1>
          <p className="text-sm text-gray-500">
            Surface what audiences signal, not just what they say. Paste your research below.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 mb-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="Brand / client name" required>
              <input type="text" name="brand" value={form.brand} onChange={handleChange}
                placeholder="e.g. Oura" required className="input" />
            </Field>
            <Field label="Category or industry" required>
              <input type="text" name="category" value={form.category} onChange={handleChange}
                placeholder="e.g. Health technology" required className="input" />
            </Field>
          </div>

          <Field label="Vertical" required>
            <select name="vertical" value={form.vertical} onChange={handleChange} className="input">
              {VERTICALS.map((v) => <option key={v} value={v}>{v}</option>)}
            </select>
          </Field>

          <Field
            label="Research input"
            hint="Required"
            required
          >
            <textarea
              name="research"
              value={form.research}
              onChange={handleChange}
              placeholder="Paste your research — interview transcripts, customer feedback, reviews, survey responses, support tickets, or any raw customer data"
              required
              rows={10}
              className="input resize-y"
            />
          </Field>

          <Field label="Focus" hint="Optional — any specific tensions or themes to investigate">
            <input type="text" name="focusArea" value={form.focusArea} onChange={handleChange}
              placeholder="e.g. sleep anxiety, premium pricing resistance, trust signals"
              className="input" />
          </Field>

          <button type="submit" disabled={!canSubmit}
            className="mt-2 inline-flex items-center gap-2 bg-accent text-white text-sm font-medium px-5 py-2.5 hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed">
            {isLoading ? (
              <>
                <span className="inline-block w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                Running analysis…
              </>
            ) : 'Run analysis →'}
          </button>
        </form>

        {error && (
          <div className="border border-red-200 bg-red-50 text-red-700 text-sm px-4 py-3 mb-8">
            {error}
          </div>
        )}

        {isLoading && sections.length === 0 && (
          <div className="flex items-center gap-3 text-sm text-gray-400 py-8">
            <span className="inline-block w-3 h-3 border border-gray-300 border-t-accent rounded-full animate-spin" />
            Reading research…
          </div>
        )}

        {sections.length > 0 && (
          <div className="space-y-4">
            {sections.map((section, i) => {
              const isLast = i === sections.length - 1
              return (
                <div key={i} className="border border-gray-200">
                  <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-100 bg-gray-50">
                    <span className="text-xs font-mono text-gray-400">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h2 className="text-xs font-bold uppercase tracking-widest text-accent">
                      {section.title}
                    </h2>
                  </div>
                  <div className="px-5 py-5">
                    {renderContent(section.content)}
                    {isLast && isLoading && (
                      <span className="inline-block w-0.5 h-4 bg-accent animate-pulse ml-0.5 mt-2" />
                    )}
                  </div>
                </div>
              )
            })}

            {isDone && (
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-gray-400">Analysis complete</span>
                <button onClick={handleCopy}
                  className="text-xs text-gray-500 hover:text-gray-900 transition-colors">
                  {copied ? 'Copied ✓' : 'Copy to clipboard'}
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="border-t border-gray-200 mt-16">
        <div className="max-w-3xl mx-auto px-6 py-6 flex items-center justify-between">
          <Link href="/" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
            ← All products
          </Link>
          <span className="text-xs text-gray-400">358 Listen</span>
        </div>
      </footer>
    </div>
  )
}

function Field({ label, hint, required, children }: {
  label: string
  hint?: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-gray-700">
        {label}
        {required && <span className="text-accent ml-0.5">*</span>}
        {hint && <span className="text-gray-400 font-normal ml-1.5">{hint}</span>}
      </label>
      {children}
    </div>
  )
}
