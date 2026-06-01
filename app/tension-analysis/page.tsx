'use client'

import { useState } from 'react'
import Link from 'next/link'
import ToolNav from '@/components/ToolNav'
import OutputDisplay from '@/components/OutputDisplay'
import { parseSections } from '@/lib/output'

interface FormState {
  brand: string
  category: string
  vertical: string
  research: string
  focusArea: string
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
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setIsLoading(false)
    }
  }

  function handleStartNew() {
    setOutput('')
    setIsDone(false)
    setError('')
  }

  const canSubmit = form.brand.trim() && form.category.trim() && form.research.trim() && !isLoading
  const sections = parseSections(output)

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-1">
            <Link href="/" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
              ← 358 Listen
            </Link>
          </div>
          <ToolNav />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="relative pb-8 mb-8 border-b border-gray-200 overflow-hidden">
          <span aria-hidden className="absolute right-0 top-0 text-[9rem] font-black text-gray-900/[0.035] select-none leading-none pointer-events-none">
            02
          </span>
          <div className="relative">
            <span className="text-xs font-mono text-gray-400 mb-3 block">02</span>
            <h1 className="text-2xl font-semibold tracking-tight text-gray-900 mb-2">
              Audience Tension & Needs Analysis
            </h1>
            <p className="text-sm text-gray-500">Surface what audiences signal, not just what they say.</p>
          </div>
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

          <Field label="Research input" required>
            <textarea name="research" value={form.research} onChange={handleChange}
              placeholder="Paste your research — interview transcripts, customer feedback, reviews, survey responses, support tickets, or any raw customer data"
              required rows={10} className="input resize-y" />
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
          <div className="border border-red-200 bg-red-50 text-red-700 text-sm px-4 py-3 mb-8">{error}</div>
        )}

        <OutputDisplay
          sections={sections}
          isLoading={isLoading}
          isDone={isDone}
          rawOutput={output}
          onStartNew={handleStartNew}
          loadingLabel="Reading research…"
        />
      </main>

      <footer className="border-t border-gray-200 mt-16">
        <div className="max-w-3xl mx-auto px-6 py-6 flex items-center justify-between">
          <Link href="/" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">← All products</Link>
          <span className="text-xs text-gray-400">358 Listen</span>
        </div>
      </footer>
    </div>
  )
}

function Field({ label, hint, required, children }: {
  label: string; hint?: string; required?: boolean; children: React.ReactNode
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
