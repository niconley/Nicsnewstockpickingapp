import type { MassivePrevCloseResponse } from "./types";

const BASE_URL = "https://api.massive.com";
const API_KEY = "0C4p4WePmvVd_UvpC3I5kSl03YbazpG1";

export async function fetchPrevClose(
  ticker: string
): Promise<MassivePrevCloseResponse> {
  const url = new URL(
    `/v2/aggs/ticker/${ticker.toUpperCase()}/prev`,
    BASE_URL
  );
  url.searchParams.set("apiKey", API_KEY);

  const res = await fetch(url.toString(), {
    headers: { Accept: "application/json" },
    next: { revalidate: 0 },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Massive API ${res.status}${body ? `: ${body}` : ""}`);
  }

  return res.json() as Promise<MassivePrevCloseResponse>;
}

export async function fetchDailyBars(
  ticker: string,
  from: string,
  to: string
): Promise<MassivePrevCloseResponse> {
  const url = new URL(
    `/v2/aggs/ticker/${ticker.toUpperCase()}/range/1/day/${from}/${to}`,
    BASE_URL
  );
  url.searchParams.set("apiKey", API_KEY);
  url.searchParams.set("adjusted", "true");
  url.searchParams.set("sort", "asc");

  const res = await fetch(url.toString(), {
    headers: { Accept: "application/json" },
    next: { revalidate: 0 },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Massive API ${res.status}${body ? `: ${body}` : ""}`);
  }

  return res.json() as Promise<MassivePrevCloseResponse>;
}
