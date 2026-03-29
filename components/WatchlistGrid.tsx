"use client";

import { StockCard } from "./StockCard";

interface Props {
  tickers: string[];
  onRemove: (ticker: string) => void;
}

export function WatchlistGrid({ tickers, onRemove }: Props) {
  if (tickers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="text-5xl mb-4">📈</div>
        <p className="text-gray-400 text-lg font-medium mb-1">Your watchlist is empty</p>
        <p className="text-gray-600 text-sm">Add a ticker above to start tracking stocks</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {tickers.map((ticker) => (
        <StockCard key={ticker} ticker={ticker} onRemove={onRemove} />
      ))}
    </div>
  );
}
