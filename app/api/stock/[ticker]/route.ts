import { NextRequest, NextResponse } from "next/server";
import { fetchSnapshot } from "@/lib/massiveApi";
import type { StockSnapshot, MassiveTickerSnapshot } from "@/lib/types";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ ticker: string }> }
) {
  const { ticker: rawTicker } = await params;
  const ticker = rawTicker.toUpperCase();

  try {
    const raw: MassiveTickerSnapshot = await fetchSnapshot(ticker);

    // Prefer last trade price; fall back to most recent minute bar close
    const price = raw.ticker.lastTrade?.p ?? raw.ticker.min?.c ?? 0;

    const snapshot: StockSnapshot = {
      ticker,
      price,
      change: raw.ticker.todaysChange,
      changePercent: raw.ticker.todaysChangePerc,
      open: raw.ticker.day.o,
      high: raw.ticker.day.h,
      low: raw.ticker.day.l,
      close: raw.ticker.day.c,
      volume: raw.ticker.day.v,
      vwap: raw.ticker.day.vw,
      prevClose: raw.ticker.prevDay.c,
      updatedAt: raw.ticker.updated,
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
