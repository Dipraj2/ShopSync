const SKELETON_COUNT = 9

function SkeletonCard() {
  return (
    <div className="liquid-glass-static flex flex-col">
      <div className="skeleton h-36 rounded-t-[1.25rem] rounded-b-none" />
      <div className="p-5 flex flex-col gap-3">
        <div className="flex justify-between"><div className="skeleton h-6 w-28 rounded-full" /></div>
        <div className="flex flex-col gap-2"><div className="skeleton h-4 w-full rounded" /><div className="skeleton h-4 w-3/4 rounded" /></div>
        <div className="flex gap-2"><div className="skeleton h-5 w-14 rounded" /><div className="skeleton h-5 w-10 rounded" /></div>
        <div className="border-t border-white/[0.04]" />
        <div className="flex justify-between items-end"><div className="skeleton h-4 w-24 rounded" /><div className="skeleton h-8 w-20 rounded" /></div>
      </div>
    </div>
  )
}

export default function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array(SKELETON_COUNT).fill(0).map((_, i) => <SkeletonCard key={i} />)}
    </div>
  )
}
