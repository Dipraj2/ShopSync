import { useState } from 'react'
import StoreBadge from './StoreBadge'
import RatingStars from './RatingStars'
import { getProductGradient, getCategoryIcon } from '../utils/productImages'

export default function ProductCard({ product, index }) {
  const { name, price, store, rating, in_stock, category, tags, id } = product
  const [colors] = useState(() => getProductGradient(name, id))
  const icon = getCategoryIcon(name)

  return (
    <article className="liquid-glass fade-up flex flex-col" style={{ animationDelay: `${index * 50}ms` }}>
      <div className="relative h-36 rounded-t-[1.25rem] overflow-hidden flex items-center justify-center"
        style={{ background: `linear-gradient(135deg, ${colors[0]}22, ${colors[1]}22)` }}>
        <div className="absolute inset-0 opacity-20"
          style={{ background: `radial-gradient(circle at 30% 40%, ${colors[0]}40, transparent 60%), radial-gradient(circle at 70% 60%, ${colors[1]}30, transparent 55%)` }} />
        <span className="text-6xl relative z-10 float-animation drop-shadow-lg" style={{ animationDelay: `${index * 200}ms` }}>{icon}</span>
        <div className="absolute top-3 right-3 z-10">
          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-md ${in_stock ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/20' : 'bg-red-500/20 text-red-300 border border-red-400/20'}`}>
            {in_stock ? '● In Stock' : '○ Sold Out'}
          </span>
        </div>
      </div>
      <div className="flex flex-col flex-1 p-5 gap-3 relative z-10">
        <div className="flex items-center justify-between"><StoreBadge store={store} /></div>
        <h3 className="text-slate-100 font-semibold text-[13px] leading-snug line-clamp-2 min-h-[2.5rem]">{name}</h3>
        {(category || tags?.length > 0) && (
          <div className="flex flex-wrap gap-1.5">
            {category && <span className="text-[9px] px-2 py-0.5 rounded-md bg-white/[0.04] text-slate-500 font-medium uppercase tracking-wider border border-white/[0.05]">{category}</span>}
            {tags?.slice(0, 2).map(tag => <span key={tag} className="text-[9px] px-2 py-0.5 rounded-md bg-white/[0.03] text-slate-600 border border-white/[0.03]">#{tag}</span>)}
          </div>
        )}
        <div className="border-t border-white/[0.05] mt-auto" />
        <div className="flex items-end justify-between gap-2">
          <div>{rating != null ? <RatingStars rating={rating} /> : <span className="text-xs text-slate-600">No rating</span>}</div>
          <div className="text-right">
            <span className="text-xl font-bold tracking-tight" style={{ background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>৳{price.toFixed(2)}</span>
            <span className="block text-[9px] text-slate-600 font-medium tracking-wider">BDT</span>
          </div>
        </div>
      </div>
    </article>
  )
}
