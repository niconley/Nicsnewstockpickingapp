"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { StockSnapshot } from "@/lib/types";

const BASE_POLL_INTERVAL_MS = 30_000;

export type FetchStatus = "idle" | "loading" | "success" | "error";

export function useStockData(ticker: string) {
  const [data, setData] = useState<StockSnapshot | null>(null);
  const [status, setStatus] = useState<FetchStatus>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pollIntervalRef = useRef(BASE_POLL_INTERVAL_MS);

  const fetchData = useCallback(async () => {
    setStatus("loading");
    try {
      const res = await fetch(`/api/stock/${encodeURIComponent(ticker)}`);

      if (res.status === 429) {
        // Rate limited — double the poll interval
        pollIntervalRef.current = Math.min(pollIntervalRef.current * 2, 5 * 60_000);
        throw new Error("Rate limit exceeded. Slowing down requests.");
      }

      if (!res.ok) {
        const body = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
        throw new Error(body.error ?? `HTTP ${res.status}`);
      }

      const snapshot: StockSnapshot = await res.json();
      setData(snapshot);
      setStatus("success");
      setErrorMsg(null);
      // Reset to base interval on success
      pollIntervalRef.current = BASE_POLL_INTERVAL_MS;
    } catch (err: unknown) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Failed to fetch data");
    }
  }, [ticker]);

  useEffect(() => {
    fetchData();

    const scheduleNext = () => {
      intervalRef.current = setTimeout(async () => {
        await fetchData();
        scheduleNext();
      }, pollIntervalRef.current);
    };

    scheduleNext();

    return () => {
      if (intervalRef.current) clearTimeout(intervalRef.current);
    };
  }, [fetchData]);

  return { data, status, errorMsg, retry: fetchData };
}
