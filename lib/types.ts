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

// Raw shape returned by the Massive API snapshot endpoint
export interface MassiveTickerSnapshot {
  ticker: {
    todaysChange: number;
    todaysChangePerc: number;
    updated: number;
    day: { o: number; h: number; l: number; c: number; v: number; vw: number };
    prevDay: { c: number };
    lastTrade: { p: number };
    min: { c: number };
  };
  status: string;
  request_id: string;
}
