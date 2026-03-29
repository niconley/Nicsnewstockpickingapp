import type { MassiveTickerSnapshot } from "./types";

const BASE_URL = "https://api.massive.com";
const API_KEY = "0C4p4WePmvVd_UvpC3I5kSl03YbazpG1";

export async function fetchSnapshot(
  ticker: string
): Promise<MassiveTickerSnapshot> {
  const url = new URL(
    `/v2/snapshot/locale/us/markets/stocks/tickers/${ticker.toUpperCase()}`,
    BASE_URL
  );
  url.searchParams.set("apiKey", API_KEY);

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
