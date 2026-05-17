export default function ResultsMeta({ meta, query }) {
  if (!meta) return null
  const { total_results, sources_responded, stores_queried } = meta
  const failedStores = stores_queried.filter(s => !sources_responded.includes(s))

  return (
    <div className="liquid-glass-static p-4 flex flex-wrap items-center justify-between gap-3 text-sm">
      <p className="text-slate-400">
        <span className="text-slate-100 font-bold text-lg">{total_results}</span>
        {' '}result{total_results !== 1 ? 's' : ''} for{' '}
        <span className="text-indigo-300 font-medium">&quot;{query}&quot;</span>
        {' '}across{' '}
        <span className="text-slate-100 font-semibold">{sources_responded.length}</span>
        {' '}store{sources_responded.length !== 1 ? 's' : ''}
      </p>
      <div className="flex flex-wrap gap-3">
        {sources_responded.map(store => (
          <span key={store} className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/15">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot" />
            {store}
          </span>
        ))}
        {failedStores.map(store => (
          <span key={store} className="flex items-center gap-1.5 text-xs text-red-400/60 bg-red-500/10 px-2.5 py-1 rounded-full border border-red-500/15">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500/60" />
            {store} (offline)
          </span>
        ))}
      </div>
    </div>
  )
}
