"use client";

import { useWatchlist } from "@/hooks/useWatchlist";
import { WatchlistInput } from "@/components/WatchlistInput";
import { WatchlistGrid } from "@/components/WatchlistGrid";

export default function Home() {
  const { tickers, addTicker, removeTicker, isLoaded } = useWatchlist();

  return (
    <main className="min-h-screen px-4 py-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 border-b-4 border-gray-900 pb-4">
        <h1 className="text-4xl font-black font-mono tracking-tight text-gray-900 uppercase">
          Stock Watchlist
        </h1>
        <p className="font-mono text-sm text-gray-500 mt-1">
          LIVE DATA // REFRESHES EVERY 30s // POWERED BY MASSIVE API
        </p>
      </div>

      <WatchlistInput onAdd={addTicker} existingTickers={tickers} />

      {isLoaded && (
        <WatchlistGrid tickers={tickers} onRemove={removeTicker} />
      )}
    </main>
  );
}
