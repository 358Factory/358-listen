'use client'

import { useState } from 'react'

interface VerticalTabsProps {
  mc: string
  bx: string
  ps: string
}

const TABS = [
  { key: 'mc' as const, label: 'Marketing Communication', code: 'MC' },
  { key: 'bx' as const, label: 'Brand & Experience', code: 'BX' },
  { key: 'ps' as const, label: 'Products & Services', code: 'PS' },
]

export default function VerticalTabs({ mc, bx, ps }: VerticalTabsProps) {
  const [active, setActive] = useState<'mc' | 'bx' | 'ps'>('mc')

  const content = { mc, bx, ps }

  return (
    <div>
      <div className="flex border-b border-gray-200">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActive(tab.key)}
            className={`px-4 py-2.5 text-xs font-medium transition-colors whitespace-nowrap ${
              active === tab.key
                ? 'border-b-2 border-accent text-accent -mb-px'
                : 'text-gray-400 hover:text-gray-700'
            }`}
          >
            <span className="font-mono mr-1.5">{tab.code}</span>
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>
      <div className="pt-4 pb-1">
        <p className="text-sm text-gray-700 leading-relaxed">{content[active]}</p>
      </div>
    </div>
  )
}
