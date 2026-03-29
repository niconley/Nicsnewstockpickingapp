"use client";

import { useStockData } from "@/hooks/useStockData";
import { StockCardSkeleton } from "./StockCardSkeleton";
import { PriceChart } from "./PriceChart";

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

  if (status === "loading" && !data) {
    return <StockCardSkeleton />;
  }

  const isUp = (data?.change ?? 0) >= 0;

  return (
    <div className="retro-card group">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="retro-ticker">{ticker}</span>
          {status === "loading" && data && (
            <span className="inline-block w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
          )}
        </div>
        <button
          onClick={() => onRemove(ticker)}
          className="retro-btn-close"
          aria-label={`Remove ${ticker}`}
        >
          X
        </button>
      </div>

      {/* Error state */}
      {status === "error" && !data && (
        <div className="py-6 text-center">
          <p className="font-mono text-sm text-red-600 mb-3">{errorMsg}</p>
          <div className="flex justify-center gap-3">
            <button onClick={retry} className="retro-btn retro-btn-blue text-xs">
              RETRY
            </button>
            <button onClick={() => onRemove(ticker)} className="retro-btn retro-btn-red text-xs">
              REMOVE
            </button>
          </div>
        </div>
      )}

      {/* Data */}
      {data && (
        <>
          {/* Price + Change */}
          <div className="mb-1">
            <div className="text-3xl font-black font-mono tracking-tight text-gray-900">
              {formatPrice(data.price)}
            </div>
            <div className={`inline-block font-mono text-sm font-bold px-2 py-0.5 mt-1 border-2 ${
              isUp
                ? "text-green-700 bg-green-100 border-green-400"
                : "text-red-700 bg-red-100 border-red-400"
            }`}>
              {formatChange(data.change, data.changePercent)}
            </div>
          </div>

          {/* Chart */}
          <div className="my-3 -mx-1">
            <PriceChart data={data.chart} isUp={isUp} />
          </div>

          {/* OHLC Grid */}
          <div className="grid grid-cols-4 gap-1 mb-2 bg-gray-50 border-2 border-gray-200 p-2">
            {(["open", "high", "low", "close"] as const).map((key) => (
              <div key={key} className="text-center">
                <div className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider">
                  {key[0]}
                </div>
                <div className="text-xs font-mono font-bold text-gray-700">
                  {formatPrice(data[key])}
                </div>
              </div>
            ))}
          </div>

          {/* Volume + VWAP */}
          <div className="flex justify-between font-mono text-xs text-gray-500 mb-2">
            <span>VOL: <span className="font-bold text-gray-700">{formatVolume(data.volume)}</span></span>
            <span>VWAP: <span className="font-bold text-gray-700">{formatPrice(data.vwap)}</span></span>
          </div>

          {/* Footer */}
          <div className="border-t-2 border-dashed border-gray-200 pt-2 flex items-center justify-between font-mono text-[10px] text-gray-400">
            <span>PREV: {formatPrice(data.prevClose)}</span>
            <span>{new Date(data.updatedAt).toLocaleDateString([], {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}</span>
          </div>

          {/* Error overlay */}
          {status === "error" && (
            <div className="mt-2 flex items-center justify-between border-t-2 border-yellow-300 pt-2">
              <span className="text-xs font-mono text-yellow-600 font-bold">REFRESH FAILED</span>
              <button onClick={retry} className="retro-btn retro-btn-blue text-[10px]">
                RETRY
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
