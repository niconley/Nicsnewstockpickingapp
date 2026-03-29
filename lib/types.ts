export interface StockSnapshot {
  ticker: string;
  price: number;
  change: number;
  changePercent: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  vwap: number;
  prevClose: number;
  updatedAt: number;
}

export interface ApiError {
  error: string;
  status: number;
}

// Raw shape returned by /v2/aggs/ticker/{ticker}/prev
export interface MassiveAggResult {
  T: string;   // ticker
  o: number;   // open
  h: number;   // high
  l: number;   // low
  c: number;   // close
  v: number;   // volume
  vw: number;  // vwap
  t: number;   // timestamp (unix ms)
  n: number;   // number of trades
}

export interface MassivePrevCloseResponse {
  ticker: string;
  results: MassiveAggResult[];
  status: string;
  request_id: string;
  queryCount: number;
  resultsCount: number;
}

// Raw shape returned by /v3/reference/tickers/{ticker}
export interface MassiveTickerDetails {
  ticker: string;
  name: string;
  market: string;
  locale: string;
  primary_exchange: string;
  type: string;
  active: boolean;
  market_cap: number;
  branding?: {
    logo_url: string;
    icon_url: string;
  };
}

export interface MassiveTickerDetailsResponse {
  results: MassiveTickerDetails;
  status: string;
  request_id: string;
}
