"use client";

import { useWatchlist } from "@/hooks/useWatchlist";
import { WatchlistInput } from "@/components/WatchlistInput";
import { WatchlistGrid } from "@/components/WatchlistGrid";

export default function Home() {
  const { tickers, addTicker, removeTicker, isLoaded } = useWatchlist();

  return (
    <main className="min-h-screen px-4 py-10 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-1">Stock Watchlist</h1>
        <p className="text-gray-500 text-sm">
          Track your favorite stocks. Data refreshes every 30 seconds.
        </p>
      </div>

      <WatchlistInput onAdd={addTicker} existingTickers={tickers} />

      {/* Gate rendering until localStorage has been read to avoid flicker */}
      {isLoaded && (
        <WatchlistGrid tickers={tickers} onRemove={removeTicker} />
      )}
    </main>
  );
}
