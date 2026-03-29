"use client";

import { useState, useEffect } from "react";

const STORAGE_KEY = "stock-watchlist-v1";

export function useWatchlist() {
  const [tickers, setTickers] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Read from localStorage only on the client to avoid SSR hydration mismatch
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setTickers(JSON.parse(stored));
    } catch {
      // Corrupted storage — start fresh
    }
    setIsLoaded(true);
  }, []);

  // Persist whenever tickers change (guard against writing before hydration)
  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tickers));
  }, [tickers, isLoaded]);

  const addTicker = (raw: string) => {
    const ticker = raw.trim().toUpperCase();
    if (!ticker || tickers.includes(ticker)) return;
    setTickers((prev) => [...prev, ticker]);
  };

  const removeTicker = (ticker: string) => {
    setTickers((prev) => prev.filter((t) => t !== ticker));
  };

  return { tickers, addTicker, removeTicker, isLoaded };
}
