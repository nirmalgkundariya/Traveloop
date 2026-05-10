export function SkeletonCard({ className = '' }) {
  return (
    <div className={`glass-card p-5 space-y-3 ${className}`}>
      <div className="shimmer h-5 rounded-lg w-3/4" />
      <div className="shimmer h-4 rounded-lg w-1/2" />
      <div className="shimmer h-4 rounded-lg w-full" />
      <div className="shimmer h-4 rounded-lg w-2/3" />
    </div>
  )
}

export function SkeletonText({ lines = 3, className = '' }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i}
          className="shimmer h-4 rounded"
          style={{ width: `${85 - (i * 10)}%` }} />
      ))}
    </div>
  )
}

export function SkeletonStat() {
  return (
    <div className="stat-card">
      <div className="shimmer h-4 rounded w-1/2 mb-1" />
      <div className="shimmer h-8 rounded w-1/3" />
    </div>
  )
}

export function SkeletonGrid({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}
