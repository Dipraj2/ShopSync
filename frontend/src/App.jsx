import { useState, useRef } from 'react'
import SearchBar    from './components/SearchBar'
import ProductCard  from './components/ProductCard'
import SkeletonGrid from './components/SkeletonGrid'
import ResultsMeta  from './components/ResultsMeta'
import { useProductSearch } from './hooks/useProductSearch'

const ARCHITECTURE_STEPS = [
  { num: '01', title: 'Launch', desc: 'User submits a single search query through the unified interface.' },
  { num: '02', title: 'Fan-Out', desc: 'Backend concurrently queries 3 independent store APIs using asyncio.' },
  { num: '03', title: 'Normalize', desc: 'Divergent JSON schemas are collapsed into a single canonical format.' },
  { num: '04', title: 'Aggregate', desc: 'Results are merged, deduplicated, and sorted by price (cheapest first).' },
]

const TECH_STACK = [
  { name: 'React 19',      color: 'from-cyan-400 to-blue-500' },
  { name: 'FastAPI',        color: 'from-emerald-400 to-teal-500' },
  { name: 'asyncio',        color: 'from-purple-400 to-indigo-500' },
  { name: 'httpx',          color: 'from-orange-400 to-red-500' },
  { name: 'Tailwind CSS',   color: 'from-sky-400 to-indigo-500' },
  { name: 'Vite',           color: 'from-yellow-400 to-orange-500' },
]

const FEATURES = [
  { title: 'Unified Search', desc: 'One query, multiple stores. Fan-out architecture queries all sources simultaneously.' },
  { title: 'Real-time Results', desc: 'Async concurrency ensures sub-second response times across all store APIs.' },
  { title: 'Fault Tolerant', desc: 'Graceful degradation \u2014 if a store goes offline, results from others still display.' },
  { title: 'Schema Normalization', desc: 'Handles price_usd, cost, item_price \u2014 divergent APIs unified seamlessly.' },
  { title: 'Price Sorted', desc: 'All results auto-sorted by price ascending. Best deals surface first.' },
  { title: 'Scalable Design', desc: 'Adding new stores requires just one config entry \u2014 zero frontend changes.' },
]

const STORES = [
  { name: 'TechMart',    port: 8001, schema: 'price_usd, title, id, rating (0\u20135)',     color: 'from-indigo-500 to-blue-600', abbr: 'TM' },
  { name: 'GadgetHub',   port: 8002, schema: 'cost, name, product_id, stars (0\u20135)',     color: 'from-purple-500 to-pink-600', abbr: 'GH' },
  { name: 'ElectroZone', port: 8003, schema: 'item_price, item_name, sku, score (0\u201310)', color: 'from-teal-500 to-cyan-600',   abbr: 'EZ' },
]

function HeroSection({ onScrollToSearch }) {
  return (
    <section className="relative py-20 px-4 overflow-hidden">
      <div className="absolute top-10 left-[10%] w-72 h-72 bg-indigo-500/10 rounded-full blur-[100px] glow-pulse" />
      <div className="absolute bottom-10 right-[10%] w-64 h-64 bg-purple-500/8 rounded-full blur-[90px] glow-pulse" style={{ animationDelay: '1.5s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-500/5 rounded-full blur-[120px]" />

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="flex flex-col items-center gap-8 text-center">
          <div className="liquid-glass-static inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-indigo-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 pulse-dot" />
            CSE 202 &middot; OOP Lab Project &middot; ShopSync Aggregator
          </div>

          <div className="space-y-4">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight">
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-teal-400 bg-clip-text text-transparent">
                ShopSync
              </span>
              <br />
              <span className="text-slate-200 text-3xl sm:text-4xl lg:text-5xl font-bold">
                Multi-Store Product Aggregator
              </span>
            </h1>
            <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Shoppers waste time jumping between different stores. ShopSync breaks the pull of isolated
              e-commerce platforms &mdash; <span className="text-indigo-300 font-medium">search once</span>, and our system fans out across the network
              to deliver a <span className="text-purple-300 font-medium">unified, normalized</span>, price-sorted view of products.
            </p>
          </div>

          <div className="flex gap-4 mt-2">
            <button
              onClick={onScrollToSearch}
              className="px-8 py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-[0_0_30px_rgba(99,102,241,0.3)] hover:shadow-[0_0_50px_rgba(99,102,241,0.5)] hover:scale-105 active:scale-95 transition-all duration-300"
            >
              Try Live Search &rarr;
            </button>
            <a
              href="#architecture"
              className="px-8 py-3 rounded-xl font-semibold text-sm border border-white/10 text-slate-300 hover:bg-white/5 hover:border-white/20 transition-all duration-300 backdrop-blur-sm"
            >
              How It Works
            </a>
          </div>

          <div className="flex gap-8 mt-6">
            {[
              { value: '3', label: 'Store APIs' },
              { value: '55+', label: 'Products' },
              { value: '<200ms', label: 'Response' },
              { value: 'N+1', label: 'Scalable' },
            ].map(s => (
              <div key={s.label} className="text-center">
                <div className="text-2xl font-bold bg-gradient-to-b from-slate-100 to-slate-400 bg-clip-text text-transparent">{s.value}</div>
                <div className="text-[10px] text-slate-600 uppercase tracking-wider mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function ArchitectureSection() {
  return (
    <section id="architecture" className="py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-100 mb-3">How It Works</h2>
          <p className="text-slate-500 max-w-lg mx-auto text-sm">
            A fan-out / fan-in architecture that concurrently queries multiple heterogeneous APIs
            and normalizes the response into a single unified format.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {ARCHITECTURE_STEPS.map((step, i) => (
            <div key={step.title} className="liquid-glass-static p-6 text-center fade-up" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/15 flex items-center justify-center">
                <span className="text-lg font-black text-indigo-400">{step.num}</span>
              </div>
              <h3 className="font-semibold text-slate-200 text-sm mb-2">{step.title}</h3>
              <p className="text-slate-500 text-xs leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function FeaturesSection() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-100 mb-3">Key Features</h2>
          <p className="text-slate-500 max-w-lg mx-auto text-sm">
            Built with production-grade patterns &mdash; fault tolerance, schema normalization,
            and scalable architecture from day one.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <div key={f.title} className="liquid-glass-static p-6 fade-up" style={{ animationDelay: `${i * 80}ms` }}>
              <div className="w-10 h-10 mb-3 rounded-xl bg-gradient-to-br from-indigo-500/15 to-purple-500/15 border border-white/[0.06] flex items-center justify-center">
                <span className="text-sm font-bold text-indigo-400">{String(i + 1).padStart(2, '0')}</span>
              </div>
              <h3 className="font-semibold text-slate-200 text-sm mb-2">{f.title}</h3>
              <p className="text-slate-500 text-xs leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function StoresSection() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-100 mb-3">Connected Stores</h2>
          <p className="text-slate-500 max-w-lg mx-auto text-sm">
            Each store intentionally uses a different JSON schema to demonstrate real-world API normalization.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {STORES.map((store, i) => (
            <div key={store.name} className="liquid-glass-static p-6 fade-up" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${store.color} flex items-center justify-center text-base font-black text-white/90 shadow-lg`}>
                  {store.abbr}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-200 text-sm">{store.name}</h3>
                  <span className="text-[10px] text-slate-600 font-mono">localhost:{store.port}</span>
                </div>
              </div>
              <div className="bg-black/20 rounded-lg p-3 border border-white/[0.04]">
                <span className="text-[10px] text-slate-600 uppercase tracking-wider block mb-1">Schema</span>
                <code className="text-[11px] text-indigo-300 font-mono leading-relaxed">{store.schema}</code>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function TechStackSection() {
  return (
    <section className="py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-slate-100 mb-3">Tech Stack</h2>
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          {TECH_STACK.map((tech, i) => (
            <div key={tech.name} className="liquid-glass-static px-5 py-3 flex items-center gap-2.5 fade-up" style={{ animationDelay: `${i * 60}ms` }}>
              <span className={`w-2.5 h-2.5 rounded-full bg-gradient-to-r ${tech.color}`} />
              <span className={`text-sm font-semibold bg-gradient-to-r ${tech.color} bg-clip-text text-transparent`}>{tech.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function EmptyState({ query }) {
  return (
    <div className="flex flex-col items-center gap-4 py-16 text-center fade-up">
      <div className="w-20 h-20 rounded-2xl bg-slate-800/50 border border-white/[0.06] flex items-center justify-center">
        <svg className="w-8 h-8 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <div>
        <p className="text-slate-300 font-semibold">No products found for &quot;{query}&quot;</p>
        <p className="text-slate-600 text-sm mt-1">Try a broader term like &quot;laptop&quot; or &quot;phone&quot;</p>
      </div>
    </div>
  )
}

function ErrorState({ error }) {
  return (
    <div className="flex flex-col items-center gap-4 py-16 text-center fade-up">
      <div className="w-20 h-20 rounded-2xl bg-red-500/10 border border-red-500/15 flex items-center justify-center">
        <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
      </div>
      <div>
        <p className="text-red-400 font-semibold">Could not reach the aggregator</p>
        <p className="text-slate-600 text-sm mt-1 font-mono">{error}</p>
        <p className="text-slate-600 text-sm mt-2">
          Make sure the backend is running on <code className="text-slate-400 bg-white/[0.04] px-1.5 py-0.5 rounded border border-white/[0.06]">port 8000</code>.
        </p>
      </div>
    </div>
  )
}

export default function App() {
  const { status, query, results, meta, error, search } = useProductSearch()
  const [showLanding, setShowLanding] = useState(true)
  const searchRef = useRef(null)

  const scrollToSearch = () => {
    setShowLanding(false)
    setTimeout(() => searchRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
  }

  const handleSearch = (q) => {
    setShowLanding(false)
    search(q)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-[rgba(6,10,22,0.7)] border-b border-white/[0.05]">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
          <button onClick={() => setShowLanding(true)} className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
            <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-[10px] font-black text-white">SS</span>
            <span className="text-lg font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">ShopSync</span>
          </button>
          <div className="flex items-center gap-6">
            <a href="#architecture" className="text-xs text-slate-500 hover:text-slate-300 transition-colors hidden sm:block">Architecture</a>
            <a href="#search-section" onClick={() => setShowLanding(false)} className="text-xs text-slate-500 hover:text-slate-300 transition-colors hidden sm:block">Search</a>
            <div className="flex items-center gap-2 text-[10px] text-slate-600 border border-white/[0.06] rounded-full px-3 py-1.5 bg-white/[0.02]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot" />
              All Systems Online
            </div>
          </div>
        </div>
      </nav>

      <div className="h-14" />

      {showLanding && (
        <>
          <HeroSection onScrollToSearch={scrollToSearch} />
          <ArchitectureSection />
          <FeaturesSection />
          <StoresSection />
          <TechStackSection />
        </>
      )}

      <section id="search-section" ref={searchRef} className="py-16 px-4">
        <div className="max-w-5xl mx-auto flex flex-col items-center gap-10">
          {showLanding && (
            <div className="text-center">
              <h2 className="text-3xl font-bold text-slate-100 mb-3">Try It Live</h2>
              <p className="text-slate-500 text-sm max-w-md mx-auto">
                Search across all three connected stores in real time.
                Results are normalized and sorted by price.
              </p>
            </div>
          )}

          {!showLanding && (
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-[10px] font-black text-white">SS</span>
                <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 via-purple-400 to-teal-400 bg-clip-text text-transparent">
                  ShopSync Search
                </h1>
              </div>
              <p className="text-slate-500 text-xs">Unified product search across 3 independent stores</p>
            </div>
          )}

          <SearchBar onSearch={handleSearch} isLoading={status === 'loading'} />
        </div>
      </section>

      <main className="flex-1 px-4 pb-20">
        <div className="max-w-5xl mx-auto">
          {status === 'loading' && <SkeletonGrid />}
          {status === 'error' && <ErrorState error={error} />}
          {status === 'success' && (
            <div className="flex flex-col gap-6">
              <ResultsMeta meta={meta} query={query} />
              {results.length === 0
                ? <EmptyState query={query} />
                : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {results.map((product, i) => (
                      <ProductCard key={`${product.store}-${product.id}-${i}`} product={product} index={i} />
                    ))}
                  </div>
                )
              }
            </div>
          )}
        </div>
      </main>

      <footer className="border-t border-white/[0.04] py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-[8px] font-black text-white">SS</span>
              <span className="text-sm font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">ShopSync</span>
              <span className="text-slate-700 text-xs ml-2">CSE 202 &middot; OOP Lab Project</span>
            </div>
            <div className="flex items-center gap-6 text-[11px] text-slate-600">
              <span>React + FastAPI + asyncio</span>
              <span className="hidden sm:inline">&bull;</span>
              <span className="hidden sm:inline">Fan-out / Fan-in Architecture</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
