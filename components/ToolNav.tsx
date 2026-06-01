'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { products } from '@/lib/products'

export default function ToolNav() {
  const pathname = usePathname()

  return (
    <nav className="flex items-center gap-x-0.5 flex-wrap border-t border-gray-100 pt-3 mt-2">
      {products.map((p, i) => {
        const href = p.actionUrl ?? `/products/${p.slug}`
        const isActive = pathname === href
        return (
          <span key={p.id} className="flex items-center">
            {i > 0 && <span className="text-gray-200 mx-1 text-xs">·</span>}
            <Link
              href={href}
              className={`text-xs px-1.5 py-0.5 transition-colors rounded-sm ${
                isActive
                  ? 'text-accent font-semibold'
                  : 'text-gray-400 hover:text-gray-700'
              }`}
            >
              <span className="font-mono mr-1">{p.number}</span>
              {p.name}
            </Link>
          </span>
        )
      })}
    </nav>
  )
}
