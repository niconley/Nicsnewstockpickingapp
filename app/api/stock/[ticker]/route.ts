import { NextRequest, NextResponse } from "next/server";
import { fetchPrevClose } from "@/lib/massiveApi";
import type { StockSnapshot } from "@/lib/types";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ ticker: string }> }
) {
  const { ticker: rawTicker } = await params;
  const ticker = rawTicker.toUpperCase();

  try {
    const raw = await fetchPrevClose(ticker);

    if (!raw.results || raw.results.length === 0) {
      return NextResponse.json({ error: `Ticker "${ticker}" not found` }, { status: 404 });
    }

    const bar = raw.results[0];

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
