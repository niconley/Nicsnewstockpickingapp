export function StockCardSkeleton() {
  return (
    <div className="retro-card animate-pulse">
      <div className="flex items-center justify-between mb-3">
        <div className="h-6 w-20 bg-gray-200 rounded" />
        <div className="h-6 w-6 bg-gray-200 rounded" />
      </div>
      <div className="h-9 w-32 bg-gray-200 rounded mb-2" />
      <div className="h-6 w-28 bg-gray-200 rounded mb-3" />
      <div className="h-28 bg-gray-100 rounded mb-3" />
      <div className="grid grid-cols-4 gap-1 bg-gray-50 border-2 border-gray-200 p-2 mb-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <div className="h-3 w-4 bg-gray-200 rounded" />
            <div className="h-3 w-12 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
      <div className="h-4 w-full bg-gray-100 rounded" />
    </div>
  );
}
