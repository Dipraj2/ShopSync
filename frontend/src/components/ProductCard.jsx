import { useState } from 'react'
import StoreBadge from './StoreBadge'
import RatingStars from './RatingStars'
import { getProductGradient, getProductImage } from '../utils/productImages'

export default function ProductCard({ product, index }) {
  const { name, price, store, rating, in_stock, category, tags, id } = product
  const [colors] = useState(() => getProductGradient(name, id))
  const imageUrl = getProductImage(name, id)

  return (
    <article className="liquid-glass fade-up flex flex-col" style={{ animationDelay: `${index * 50}ms` }}>
      <div
        className="relative h-44 rounded-t-[1.25rem] overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${colors[0]}22, ${colors[1]}22)` }}
      >
        <img
          src={imageUrl}
          alt={name}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover opacity-80 transition-opacity duration-500 hover:opacity-100"
          onError={(e) => { e.target.style.display = 'none' }}
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-[rgba(6,10,22,0.85)] via-transparent to-transparent"
        />
        <div className="absolute top-3 right-3 z-10">
          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-md ${in_stock ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/20' : 'bg-red-500/20 text-red-300 border border-red-400/20'}`}>
            {in_stock ? 'In Stock' : 'Sold Out'}
          </span>
        </div>
      </div>

      <div className="flex flex-col flex-1 p-5 gap-3 relative z-10">
        <div className="flex items-center justify-between">
          <StoreBadge store={store} />
        </div>

        <h3 className="text-slate-100 font-semibold text-[13px] leading-snug line-clamp-2 min-h-[2.5rem]">
          {name}
        </h3>

        {(category || tags?.length > 0) && (
          <div className="flex flex-wrap gap-1.5">
            {category && (
              <span className="text-[9px] px-2 py-0.5 rounded-md bg-white/[0.04] text-slate-500 font-medium uppercase tracking-wider border border-white/[0.05]">
                {category}
              </span>
            )}
            {tags?.slice(0, 2).map(tag => (
              <span key={tag} className="text-[9px] px-2 py-0.5 rounded-md bg-white/[0.03] text-slate-600 border border-white/[0.03]">
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="border-t border-white/[0.05] mt-auto" />

        <div className="flex items-end justify-between gap-2">
          <div>
            {rating != null
              ? <RatingStars rating={rating} />
              : <span className="text-xs text-slate-600">No rating</span>
            }
          </div>
          <div className="text-right">
            <span className="text-xl font-bold tracking-tight" style={{ background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              \u09F3{price.toFixed(2)}
            </span>
            <span className="block text-[9px] text-slate-600 font-medium tracking-wider">BDT</span>
          </div>
        </div>
      </div>
    </article>
  )
}
