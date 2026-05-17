import { useState, useCallback } from 'react'

const API_BASE = import.meta.env.VITE_API_URL || '/api'

export function useProductSearch() {
  const [state, setState] = useState({ status: 'idle', query: '', results: [], meta: null, error: null })

  const search = useCallback(async (query) => {
    const q = query.trim()
    if (!q) return
    setState(s => ({ ...s, status: 'loading', query: q, error: null }))
    try {
      const res = await fetch(`${API_BASE}/search?q=${encodeURIComponent(q)}`)
      if (!res.ok) throw new Error(`Server responded with ${res.status}`)
      const data = await res.json()
      setState({ status: 'success', query: q, results: data.results ?? [], meta: { total_results: data.total_results, sources_responded: data.sources_responded, stores_queried: data.stores_queried }, error: null })
    } catch (err) {
      setState(s => ({ ...s, status: 'error', error: err.message ?? 'Unknown error', results: [], meta: null }))
    }
  }, [])

  return { ...state, search }
}
