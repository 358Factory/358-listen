'use client'

import { useState } from 'react'
import Link from 'next/link'

interface BuildForm {
  brand: string
  category: string
  vertical: string
  audienceDescription: string
  personaCount: string
}

interface Section {
  title: string
  content: string
}

interface PersonaField {
  key: string
  value: string
}

// Split streamed text into blocks on ## boundaries
function parseSections(text: string): Section[] {
  const sections: Section[] = []
  let current: Section | null = null
  for (const line of text.split('\n')) {
    if (line.startsWith('## ')) {
      if (current) sections.push(current)
      current = { title: line.slice(3).trim(), content: '' }
    } else if (current) {
      current.content += line + '\n'
    }
  }
  if (current) sections.push(current)
  return sections
}

// Parse "Name, Age — Role" title into parts
function parsePersonaTitle(title: string) {
  const dashIdx = title.indexOf(' — ')
  const nameAge = dashIdx > -1 ? title.slice(0, dashIdx).trim() : title
  const role = dashIdx > -1 ? title.slice(dashIdx + 3).trim() : ''
  return { nameAge, role }
}

// Parse **Key:** value lines into field objects
function parsePersonaFields(content: string): PersonaField[] {
  const fields: PersonaField[] = []
  let currentKey = ''
  let currentValue = ''

  for (const line of content.split('\n')) {
    const match = line.match(/^\*\*(.+?):\*\*\s*(.*)/)
    if (match) {
      if (currentKey) fields.push({ key: currentKey, value: currentValue.trim() })
      currentKey = match[1]
      currentValue = match[2]
    } else if (currentKey && line.trim()) {
      currentValue += ' ' + line.trim()
    }
  }
  if (currentKey) fields.push({ key: currentKey, value: currentValue.trim() })
  return fields
}

// Render a query response section (plain prose)
function renderQueryContent(content: string) {
  const elements: React.ReactNode[] = []
  let key = 0
  for (const line of content.split('\n')) {
    if (!line.trim()) continue
    elements.push(
      <p key={key++} className="text-sm text-gray-700 leading-relaxed mt-2 first:mt-0"
        dangerouslySetInnerHTML={{ __html: inlineBold(line) }} />
    )
  }
  return elements
}

function inlineBold(text: string) {
  return text.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>')
}

const VERTICALS = ['Marketing Communication', 'Brand & Experience', 'Products & Services']
const PERSONA_COUNTS = ['3', '4', '5']

const FIELD_LABELS: Record<string, string> = {
  'Core motivation': 'Core motivation',
  'Biggest tension': 'Biggest tension',
  'How they make decisions': 'Decision making',
  'What they respond to': 'Responds to',
  'What puts them off': 'Turned off by',
  'Their voice': 'Their voice',
}

export default function AudienceModelPage() {
  const [form, setForm] = useState<BuildForm>({
    brand: '',
    category: '',
    vertical: 'Marketing Communication',
    audienceDescription: '',
    personaCount: '3',
  })
  const [personasText, setPersonasText] = useState('')
  const [isBuilding, setIsBuilding] = useState(false)
  const [buildDone, setBuildDone] = useState(false)
  const [buildError, setBuildError] = useState('')

  const [queryInput, setQueryInput] = useState('')
  const [queryQuestion, setQueryQuestion] = useState('')
  const [queryText, setQueryText] = useState('')
  const [isQuerying, setIsQuerying] = useState(false)
  const [queryDone, setQueryDone] = useState(false)
  const [queryError, setQueryError] = useState('')
  const [queryCopied, setQueryCopied] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleBuild(e: React.FormEvent) {
    e.preventDefault()
    setIsBuilding(true)
    setPersonasText('')
    setBuildDone(false)
    setBuildError('')
    setQueryText('')
    setQueryDone(false)
    setQueryQuestion('')

    try {
      const response = await fetch('/api/personas', {
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
        setPersonasText((prev) => prev + decoder.decode(value, { stream: true }))
      }
      setBuildDone(true)
    } catch (err) {
      setBuildError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setIsBuilding(false)
    }
  }

  async function handleQuery(e: React.FormEvent) {
    e.preventDefault()
    if (!queryInput.trim()) return
    const question = queryInput.trim()
    setQueryQuestion(question)
    setQueryInput('')
    setQueryText('')
    setQueryDone(false)
    setQueryError('')
    setIsQuerying(true)

    try {
      const response = await fetch('/api/personas/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: question, personas: personasText }),
      })
      if (!response.ok) throw new Error(`Request failed: ${response.status}`)

      const reader = response.body!.getReader()
      const decoder = new TextDecoder()
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        setQueryText((prev) => prev + decoder.decode(value, { stream: true }))
      }
      setQueryDone(true)
    } catch (err) {
      setQueryError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setIsQuerying(false)
    }
  }

  async function handleCopyQuery() {
    await navigator.clipboard.writeText(`Q: ${queryQuestion}\n\n${queryText}`)
    setQueryCopied(true)
    setTimeout(() => setQueryCopied(false), 2000)
  }

  const canBuild = form.brand.trim() && form.category.trim() && form.audienceDescription.trim() && !isBuilding
  const canQuery = queryInput.trim() && !isQuerying && buildDone
  const personas = parseSections(personasText)
  const queryResponses = parseSections(queryText)

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
            ← 358 Listen
          </Link>
          <span className="text-xs text-gray-400 uppercase tracking-widest">
            04 / Synthetic Audience Model
          </span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12">

        {/* ── STEP 1 ─────────────────────────────────────── */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-mono text-gray-400 border border-gray-200 px-2 py-0.5">Step 1</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900 mb-2">
            Build the personas
          </h1>
          <p className="text-sm text-gray-500">
            Describe your target audience and paste in any research you have. The richer the input, the sharper the personas.
          </p>
        </div>

        <form onSubmit={handleBuild} className="space-y-5 mb-10">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="Vertical" required>
              <select name="vertical" value={form.vertical} onChange={handleChange} className="input">
                {VERTICALS.map((v) => <option key={v} value={v}>{v}</option>)}
              </select>
            </Field>
            <Field label="Number of personas" required>
              <select name="personaCount" value={form.personaCount} onChange={handleChange} className="input">
                {PERSONA_COUNTS.map((n) => <option key={n} value={n}>{n} personas</option>)}
              </select>
            </Field>
          </div>

          <Field label="Audience description" required>
            <textarea
              name="audienceDescription"
              value={form.audienceDescription}
              onChange={handleChange}
              placeholder="Describe your target audience — who they are, what they care about, what they struggle with. Paste in research, tensions, or language from the Audience Tension Analysis if you have it."
              required
              rows={8}
              className="input resize-y"
            />
          </Field>

          <button type="submit" disabled={!canBuild}
            className="mt-2 inline-flex items-center gap-2 bg-accent text-white text-sm font-medium px-5 py-2.5 hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed">
            {isBuilding ? (
              <>
                <span className="inline-block w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                Building personas…
              </>
            ) : (buildDone ? 'Rebuild personas →' : 'Build personas →')}
          </button>
        </form>

        {buildError && (
          <div className="border border-red-200 bg-red-50 text-red-700 text-sm px-4 py-3 mb-8">
            {buildError}
          </div>
        )}

        {/* Persona cards */}
        {isBuilding && personas.length === 0 && (
          <div className="flex items-center gap-3 text-sm text-gray-400 py-8">
            <span className="inline-block w-3 h-3 border border-gray-300 border-t-accent rounded-full animate-spin" />
            Building personas…
          </div>
        )}

        {personas.length > 0 && (
          <div className="space-y-4 mb-4">
            {personas.map((persona, i) => {
              const isLast = i === personas.length - 1
              const { nameAge, role } = parsePersonaTitle(persona.title)
              const fields = parsePersonaFields(persona.content)
              const voiceField = fields.find(f => f.key === 'Their voice')
              const otherFields = fields.filter(f => f.key !== 'Their voice')
              const isStreaming = isLast && isBuilding

              return (
                <div key={i} className="border border-gray-200">
                  {/* Persona header */}
                  <div className="flex items-start justify-between gap-4 px-5 py-4 border-b border-gray-100 bg-gray-50">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{nameAge}</p>
                      {role && <p className="text-xs text-gray-500 mt-0.5">{role}</p>}
                    </div>
                    <span className="text-xs font-mono text-gray-400 shrink-0">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>

                  {/* Fields */}
                  {otherFields.length > 0 && (
                    <div className="divide-y divide-gray-100">
                      {otherFields.map((field, j) => (
                        <div key={j} className="px-5 py-3 grid grid-cols-[140px_1fr] gap-4 items-start">
                          <dt className="text-xs font-semibold uppercase tracking-wide text-gray-400 pt-0.5 shrink-0">
                            {FIELD_LABELS[field.key] ?? field.key}
                          </dt>
                          <dd className="text-sm text-gray-700 leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: inlineBold(field.value) }} />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Quote */}
                  {voiceField && (
                    <div className="px-5 py-4 border-t border-gray-100 bg-gray-50">
                      <p className="text-sm text-gray-900 italic leading-relaxed">
                        {voiceField.value}
                      </p>
                    </div>
                  )}

                  {/* Streaming cursor on last incomplete card */}
                  {isStreaming && !voiceField && (
                    <div className="px-5 py-3">
                      <span className="inline-block w-0.5 h-4 bg-accent animate-pulse" />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* ── STEP 2 ─────────────────────────────────────── */}
        {buildDone && (
          <>
            <div className="relative my-12">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-4 text-xs font-mono text-gray-400 uppercase tracking-widest">
                  Step 2
                </span>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold tracking-tight text-gray-900 mb-2">
                Query the room
              </h2>
              <p className="text-sm text-gray-500">
                Test an idea, message, or concept. Each persona responds in character.
              </p>
            </div>

            <form onSubmit={handleQuery} className="flex gap-3 mb-8">
              <input
                type="text"
                value={queryInput}
                onChange={(e) => setQueryInput(e.target.value)}
                placeholder={`e.g. "We track your sleep so you don't have to think about it."`}
                className="input flex-1"
              />
              <button type="submit" disabled={!canQuery}
                className="shrink-0 inline-flex items-center gap-2 bg-accent text-white text-sm font-medium px-5 py-2.5 hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap">
                {isQuerying ? (
                  <span className="inline-block w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                ) : 'Ask the room →'}
              </button>
            </form>

            {queryError && (
              <div className="border border-red-200 bg-red-50 text-red-700 text-sm px-4 py-3 mb-6">
                {queryError}
              </div>
            )}

            {isQuerying && queryResponses.length === 0 && (
              <div className="flex items-center gap-3 text-sm text-gray-400 py-6">
                <span className="inline-block w-3 h-3 border border-gray-300 border-t-accent rounded-full animate-spin" />
                Asking the room…
              </div>
            )}

            {queryResponses.length > 0 && (
              <div className="space-y-3">
                {queryQuestion && (
                  <div className="flex items-start gap-3 mb-5 pb-5 border-b border-gray-100">
                    <span className="text-xs font-mono text-gray-400 shrink-0 mt-0.5">Q</span>
                    <p className="text-sm text-gray-900 font-medium">{queryQuestion}</p>
                  </div>
                )}

                {queryResponses.map((res, i) => {
                  const isLast = i === queryResponses.length - 1
                  return (
                    <div key={i} className="border border-gray-200">
                      <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-100 bg-gray-50">
                        <span className="text-xs font-mono text-gray-400">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-accent">
                          {res.title}
                        </h3>
                      </div>
                      <div className="px-5 py-4">
                        {renderQueryContent(res.content)}
                        {isLast && isQuerying && (
                          <span className="inline-block w-0.5 h-4 bg-accent animate-pulse ml-0.5 mt-2" />
                        )}
                      </div>
                    </div>
                  )
                })}

                {queryDone && (
                  <div className="flex items-center justify-end pt-1">
                    <button onClick={handleCopyQuery}
                      className="text-xs text-gray-500 hover:text-gray-900 transition-colors">
                      {queryCopied ? 'Copied ✓' : 'Copy responses'}
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
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
