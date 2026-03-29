export function StockCardSkeleton() {
  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 p-4 shadow-lg animate-pulse">
      {/* Header row */}
      <div className="flex items-start justify-between mb-3">
        <div className="h-5 w-16 bg-gray-700 rounded" />
        <div className="h-5 w-5 bg-gray-700 rounded" />
      </div>
      {/* Price */}
      <div className="h-8 w-28 bg-gray-700 rounded mb-2" />
      {/* Change badge */}
      <div className="h-5 w-24 bg-gray-700 rounded mb-4" />
      {/* OHLC grid */}
      <div className="grid grid-cols-4 gap-2 mb-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-1">
            <div className="h-3 w-6 bg-gray-700 rounded" />
            <div className="h-4 w-12 bg-gray-700 rounded" />
          </div>
        ))}
      </div>
      {/* Volume row */}
      <div className="h-4 w-32 bg-gray-700 rounded mb-1" />
      <div className="h-3 w-24 bg-gray-700 rounded" />
    </div>
  );
}
