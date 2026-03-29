import { NextRequest, NextResponse } from "next/server";
import { fetchPrevClose, fetchDailyBars } from "@/lib/massiveApi";
import type { StockSnapshot } from "@/lib/types";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ ticker: string }> }
) {
  const { ticker: rawTicker } = await params;
  const ticker = rawTicker.toUpperCase();

  try {
    // Fetch previous close and 30-day chart data in parallel
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 42); // 42 calendar days ≈ 30 trading days
    const toDate = today.toISOString().split("T")[0];
    const fromDate = thirtyDaysAgo.toISOString().split("T")[0];

    const [prevClose, dailyBars] = await Promise.all([
      fetchPrevClose(ticker),
      fetchDailyBars(ticker, fromDate, toDate),
    ]);

    if (!prevClose.results || prevClose.results.length === 0) {
      return NextResponse.json({ error: `Ticker "${ticker}" not found` }, { status: 404 });
    }

    const bar = prevClose.results[0];

    const chart = (dailyBars.results ?? []).map((b) => ({
      date: new Date(b.t).toISOString().split("T")[0],
      close: b.c,
    }));

    const snapshot: StockSnapshot = {
      ticker,
      price: bar.c,
      change: bar.c - bar.o,
      changePercent: ((bar.c - bar.o) / bar.o) * 100,
      open: bar.o,
      high: bar.h,
      low: bar.l,
      close: bar.c,
      volume: bar.v,
      vwap: bar.vw,
      prevClose: bar.o,
      updatedAt: bar.t,
      chart,
    };

    return NextResponse.json(snapshot);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";

    if (message.includes("404")) {
      return NextResponse.json({ error: `Ticker "${ticker}" not found` }, { status: 404 });
    }
    if (message.includes("429")) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
    }

    return NextResponse.json({ error: message }, { status: 502 });
  }
}
