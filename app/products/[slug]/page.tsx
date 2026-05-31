import { notFound } from 'next/navigation'
import Link from 'next/link'
import { products, getProductBySlug } from '@/lib/products'
import VerticalTabs from '@/components/VerticalTabs'

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }))
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = getProductBySlug(params.slug)
  if (!product) notFound()

  const isLive = product.status === 'live'

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            ← 358 Listen
          </Link>
          <span className="text-xs font-mono text-gray-400">{product.number}</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12">
        {/* Title block */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
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
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900 mb-3">
            {product.name}
          </h1>
          <p className="text-base text-gray-700 leading-relaxed">
            {product.whatItDoes}
          </p>
        </div>

        {/* CTA */}
        <div className="mb-12">
          {isLive && product.actionUrl ? (
            <Link
              href={product.actionUrl}
              className="inline-flex items-center gap-2 bg-accent text-white text-sm font-medium px-5 py-2.5 hover:opacity-90 transition-opacity"
            >
              Run audit →
            </Link>
          ) : (
            <span className="inline-flex items-center gap-2 border border-gray-200 text-gray-400 text-sm font-medium px-5 py-2.5 cursor-not-allowed">
              Coming soon
            </span>
          )}
        </div>

        <div className="space-y-10 border-t border-gray-200 pt-10">
          {/* AI / Human two-column */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-gray-200 border border-gray-200">
            <div className="bg-white p-6">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
                What AI does
              </h2>
              <ul className="space-y-2">
                {product.aiDoes.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700 leading-relaxed">
                    <span className="text-accent mt-1 shrink-0">—</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white p-6">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
                What human does
              </h2>
              <ul className="space-y-2">
                {product.humanDoes.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700 leading-relaxed">
                    <span className="text-gray-400 mt-1 shrink-0">—</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Outputs */}
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
              Outputs
            </h2>
            <ul className="space-y-2">
              {product.outputs.map((output, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-gray-300 mt-0.5 shrink-0">—</span>
                  <span>{output}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Vertical execution tabs */}
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
              Vertical execution
            </h2>
            <VerticalTabs
              mc={product.verticalNotes.mc}
              bx={product.verticalNotes.bx}
              ps={product.verticalNotes.ps}
            />
          </div>
        </div>
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
