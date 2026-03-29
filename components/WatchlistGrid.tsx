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
        <div className="text-6xl mb-4">$</div>
        <p className="font-mono text-lg font-bold text-gray-600 mb-1">
          NO STOCKS YET
        </p>
        <p className="font-mono text-sm text-gray-400">
          Type a ticker above and hit + ADD
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {tickers.map((ticker) => (
        <StockCard key={ticker} ticker={ticker} onRemove={onRemove} />
      ))}
    </div>
  );
}
