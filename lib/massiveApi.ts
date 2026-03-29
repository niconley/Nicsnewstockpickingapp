import type { MassiveTickerSnapshot } from "./types";

const BASE_URL = "https://api.massive.com";

export async function fetchSnapshot(
  ticker: string,
  apiKey: string
): Promise<MassiveTickerSnapshot> {
  const url = new URL(
    `/v2/snapshot/locale/us/markets/stocks/tickers/${ticker.toUpperCase()}`,
    BASE_URL
  );
  url.searchParams.set("apiKey", apiKey);

  const res = await fetch(url.toString(), {
    headers: { Accept: "application/json" },
    // Disable Next.js fetch caching — we always want fresh data
    next: { revalidate: 0 },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Massive API ${res.status}${body ? `: ${body}` : ""}`);
  }

  return res.json() as Promise<MassiveTickerSnapshot>;
}
