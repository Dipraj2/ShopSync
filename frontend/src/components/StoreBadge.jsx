const STORE_CONFIG = {
  TechMart:    { gradient: 'from-indigo-500/20 to-blue-500/20', border: 'border-indigo-400/20', text: 'text-indigo-300', dot: 'bg-indigo-400', glow: 'rgba(99,102,241,0.2)' },
  GadgetHub:   { gradient: 'from-purple-500/20 to-pink-500/20', border: 'border-purple-400/20', text: 'text-purple-300', dot: 'bg-purple-400', glow: 'rgba(168,85,247,0.2)' },
  ElectroZone: { gradient: 'from-teal-500/20 to-cyan-500/20',   border: 'border-teal-400/20',   text: 'text-teal-300',   dot: 'bg-teal-400',   glow: 'rgba(20,184,166,0.2)' },
}

const FALLBACK = { gradient: 'from-slate-500/20 to-gray-500/20', border: 'border-slate-400/20', text: 'text-slate-300', dot: 'bg-slate-400', glow: 'rgba(148,163,184,0.15)' }

export default function StoreBadge({ store }) {
  const cfg = STORE_CONFIG[store] ?? FALLBACK
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold border bg-gradient-to-r backdrop-blur-sm ${cfg.gradient} ${cfg.border} ${cfg.text}`}
      style={{ boxShadow: `0 0 12px ${cfg.glow}` }}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {store}
    </span>
  )
}
