'use client'

import React, { useState } from 'react'
import type { Section } from '@/lib/output'
import { renderContent } from '@/lib/output'

interface Props {
  sections: Section[]
  isLoading: boolean
  isDone: boolean
  rawOutput: string
  onStartNew: () => void
  loadingLabel?: string
}

export default function OutputDisplay({
  sections,
  isLoading,
  isDone,
  rawOutput,
  onStartNew,
  loadingLabel = 'Generating…',
}: Props) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(rawOutput)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // While streaming: all sections in body order
  // When done: last section becomes hero, rest are body cards
  const heroSection = isDone && sections.length > 0 ? sections[sections.length - 1] : null
  const bodySections = isDone ? sections.slice(0, -1) : sections

  if (!isLoading && sections.length === 0) return null

  return (
    <div className="mt-10">
      {/* Spinner before first section arrives */}
      {isLoading && sections.length === 0 && (
        <div className="flex items-center gap-3 text-sm text-gray-400 py-8">
          <span className="inline-block w-3 h-3 border border-gray-300 border-t-accent rounded-full animate-spin" />
          {loadingLabel}
        </div>
      )}

      {/* Actions — shown when done */}
      {isDone && (
        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={handleCopy}
            className="text-xs font-medium text-gray-600 hover:text-gray-900 border border-gray-200 hover:border-gray-400 px-3 py-1.5 transition-colors"
          >
            {copied ? 'Copied ✓' : 'Copy all'}
          </button>
          <button
            onClick={onStartNew}
            className="text-xs font-medium text-gray-600 hover:text-gray-900 border border-gray-200 hover:border-gray-400 px-3 py-1.5 transition-colors"
          >
            Start new
          </button>
        </div>
      )}

      {/* Hero card — strategic recommendation (last section, shown when done) */}
      {heroSection && (
        <div className="bg-[#0A0A0A] p-8 mb-4 animate-card-enter">
          <p className="text-xs font-bold uppercase tracking-widest text-accent mb-5">
            {heroSection.title}
          </p>
          <div className="text-base font-medium leading-relaxed">
            {renderContent(heroSection.content, true)}
          </div>
        </div>
      )}

      {/* Body section cards */}
      <div className="space-y-3">
        {bodySections.map((section, i) => {
          const isStreamingThis = !isDone && isLoading && i === bodySections.length - 1
          const bg = i % 2 === 0 ? 'bg-white' : 'bg-[#FAFAFA]'
          const padded = String(i + 1).padStart(2, '0')

          return (
            <div
              key={section.title}
              className={`border border-gray-200 ${bg} animate-card-enter`}
            >
              {/* Card header with watermark number */}
              <div className="relative flex items-center gap-3 px-5 py-3.5 border-b border-gray-100 overflow-hidden">
                <span className="text-xs font-mono text-gray-400 relative z-10">{padded}</span>
                <h2 className="text-xs font-bold uppercase tracking-widest text-accent relative z-10">
                  {section.title}
                </h2>
                <span
                  aria-hidden
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-7xl font-black text-gray-900/[0.035] select-none pointer-events-none leading-none"
                >
                  {padded}
                </span>
              </div>

              <div className="px-5 py-5">
                {renderContent(section.content)}
                {isStreamingThis && (
                  <span className="inline-block w-0.5 h-4 bg-accent animate-pulse ml-0.5 mt-2" />
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
