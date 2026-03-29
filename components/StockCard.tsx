"use client";

import { useStockData } from "@/hooks/useStockData";
import { StockCardSkeleton } from "./StockCardSkeleton";

interface Props {
  ticker: string;
  onRemove: (ticker: string) => void;
}

function formatPrice(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

function formatVolume(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString("en-US");
}

function formatChange(change: number, pct: number) {
  const sign = change >= 0 ? "+" : "";
  return `${sign}${change.toFixed(2)} (${sign}${pct.toFixed(2)}%)`;
}

export function StockCard({ ticker, onRemove }: Props) {
  const { data, status, errorMsg, retry } = useStockData(ticker);

  // First load — show skeleton
  if (status === "loading" && !data) {
    return <StockCardSkeleton />;
  }

  const isUp = (data?.change ?? 0) >= 0;
  const changeColor = isUp ? "text-green-400" : "text-red-400";
  const changeBg = isUp ? "bg-green-950" : "bg-red-950";

  return (
    <div className="relative bg-gray-900 rounded-xl border border-gray-800 p-4 shadow-lg hover:border-gray-600 transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <span className="text-sm font-bold text-white tracking-widest">{ticker}</span>
        <div className="flex items-center gap-2">
          {status === "loading" && data && (
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" title="Refreshing" />
          )}
          <button
            onClick={() => onRemove(ticker)}
            className="text-gray-500 hover:text-white text-lg leading-none transition-colors"
            aria-label={`Remove ${ticker}`}
          >
            ×
          </button>
        </div>
      </div>

      {/* Error state (no data yet) */}
      {status === "error" && !data && (
        <div className="py-4">
          <p className="text-red-400 text-sm mb-3">{errorMsg}</p>
          <div className="flex gap-2">
            <button
              onClick={retry}
              className="text-xs text-blue-400 hover:text-blue-300 underline"
            >
              Retry
            </button>
            <button
              onClick={() => onRemove(ticker)}
              className="text-xs text-gray-500 hover:text-gray-300 underline"
            >
              Remove
            </button>
          </div>
        </div>
      )}

      {/* Data */}
      {data && (
        <>
          {/* Price */}
          <div className="text-2xl font-bold text-white mb-1">
            {formatPrice(data.price)}
          </div>

          {/* Change badge */}
          <div className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full mb-4 ${changeBg} ${changeColor}`}>
            {formatChange(data.change, data.changePercent)}
          </div>

          {/* OHLC */}
          <div className="grid grid-cols-4 gap-2 mb-3">
            {(["open", "high", "low", "close"] as const).map((key) => (
              <div key={key}>
                <div className="text-xs text-gray-500 uppercase mb-0.5">
                  {key[0]}
                </div>
                <div className="text-xs text-gray-300 font-medium">
                  {formatPrice(data[key])}
                </div>
              </div>
            ))}
          </div>

          {/* Volume + VWAP */}
          <div className="text-xs text-gray-400 mb-0.5">
            Vol: <span className="text-gray-300">{formatVolume(data.volume)}</span>
          </div>
          <div className="text-xs text-gray-400 mb-2">
            VWAP: <span className="text-gray-300">{formatPrice(data.vwap)}</span>
          </div>

          {/* Prev close + timestamp */}
          <div className="border-t border-gray-800 pt-2 flex items-center justify-between">
            <span className="text-xs text-gray-500">
              Prev: {formatPrice(data.prevClose)}
            </span>
            <span className="text-xs text-gray-600">
              {new Date(data.updatedAt / 1_000_000).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </span>
          </div>

          {/* Error overlay on existing data */}
          {status === "error" && (
            <div className="mt-2 flex items-center justify-between">
              <span className="text-xs text-yellow-500">⚠ Refresh failed</span>
              <button onClick={retry} className="text-xs text-blue-400 hover:text-blue-300 underline">
                Retry
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
