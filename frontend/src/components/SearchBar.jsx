import { useState } from 'react'

const SUGGESTIONS = ['laptop', 'phone', 'headphones', 'tablet', 'charger', 'monitor', 'smartwatch']

export default function SearchBar({ onSearch, isLoading }) {
  const [value, setValue] = useState('')

  const handleSubmit = (e) => { e.preventDefault(); if (value.trim()) onSearch(value.trim()) }
  const handleSuggestion = (term) => { setValue(term); onSearch(term) }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-5 flex items-center">
          <svg className="w-5 h-5 text-indigo-400 glow-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input id="search-input" type="text" value={value} onChange={e => setValue(e.target.value)}
          placeholder="Search across all stores… e.g. laptop, phone" disabled={isLoading}
          className="search-input w-full pl-14 pr-36 py-4.5 bg-[rgba(15,23,50,0.6)] border border-white/[0.08] rounded-2xl text-slate-100 placeholder-slate-500 text-base transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed backdrop-blur-xl" />
        {value && (
          <button type="button" onClick={() => setValue('')} className="absolute inset-y-0 right-28 flex items-center px-2 text-slate-500 hover:text-slate-300 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        )}
        <button id="search-button" type="submit" disabled={isLoading || !value.trim()}
          className="absolute right-2 inset-y-2 px-6 rounded-xl font-semibold text-sm bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed shadow-[0_0_24px_rgba(99,102,241,0.3)] hover:shadow-[0_0_36px_rgba(99,102,241,0.5)] hover:scale-[1.02] active:scale-[0.98]">
          {isLoading ? (<span className="flex items-center gap-2"><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>Searching</span>) : 'Search'}
        </button>
      </form>
      <div className="flex flex-wrap gap-2 mt-4 justify-center">
        <span className="text-[11px] text-slate-600 self-center mr-1">Trending:</span>
        {SUGGESTIONS.map(term => (
          <button key={term} onClick={() => handleSuggestion(term)} disabled={isLoading}
            className="text-[11px] px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06] text-slate-400 hover:text-indigo-300 hover:border-indigo-500/30 hover:bg-indigo-500/10 transition-all duration-200 disabled:opacity-30 backdrop-blur-sm">
            {term}
          </button>
        ))}
      </div>
    </div>
  )
}
