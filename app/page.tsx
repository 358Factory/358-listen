import Link from 'next/link'
import { products } from '@/lib/products'

export default function HomePage() {
  // Pad to 6 cells so the grid always looks complete
  const cells = [...products, null]

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-6 flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
              358 Listen
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Replace assumptions with evidence.
            </p>
          </div>
          <span className="text-xs text-gray-400 uppercase tracking-widest hidden sm:block">
            Helsinki
          </span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="mb-10">
          <p className="text-sm text-gray-500 uppercase tracking-widest mb-2">
            Intelligence products
          </p>
          <h2 className="text-xl font-medium text-gray-900">
            Strategic tools for creative work that doesn&apos;t guess.
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cells.map((product, idx) => {
            if (!product) {
              return (
                <div
                  key="placeholder"
                  className="border border-dashed border-gray-200 p-6 flex flex-col gap-4"
                >
                  <span className="text-xs font-mono text-gray-300">—</span>
                  <div className="flex-1">
                    <p className="text-sm text-gray-400 leading-relaxed">
                      More intelligence products in development.
                    </p>
                  </div>
                </div>
              )
            }

            const isLive = product.status === 'live'
            const href = isLive && product.actionUrl
              ? product.actionUrl
              : `/products/${product.slug}`
            const cta = isLive ? (product.ctaLabel ?? 'Open →') : 'View details →'

            return (
              <Link
                key={product.id}
                href={href}
                className={`group block border transition-all duration-150 hover:-translate-y-0.5 ${
                  isLive
                    ? 'border-l-[3px] border-l-accent border-t border-r border-b border-gray-200 hover:border-gray-300 hover:border-l-accent'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="p-6 flex flex-col gap-4 h-full">
                  <div className="flex items-start justify-between gap-4">
                    <span className="text-xs font-mono text-gray-400">
                      {product.number}
                    </span>
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full border ${
                        isLive
                          ? 'border-accent text-accent'
                          : 'border-gray-300 text-gray-400'
                      }`}
                    >
                      {isLive ? 'Live' : 'Coming soon'}
                    </span>
                  </div>

                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-gray-900 mb-1">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  <span className={`text-xs font-medium transition-colors ${isLive ? 'text-accent' : 'text-gray-400'}`}>
                    {cta}
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </main>

      <footer className="border-t border-gray-200 mt-24">
        <div className="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
          <span className="text-xs text-gray-400">© 2026 358</span>
          <span className="text-xs text-gray-400">Helsinki</span>
        </div>
      </footer>
    </div>
  )
}
