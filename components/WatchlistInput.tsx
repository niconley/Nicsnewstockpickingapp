"use client";

import { useState, FormEvent } from "react";

interface Props {
  onAdd: (ticker: string) => void;
  existingTickers: string[];
}

export function WatchlistInput({ onAdd, existingTickers }: Props) {
  const [value, setValue] = useState("");
  const [validationMsg, setValidationMsg] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const ticker = value.trim().toUpperCase();

    if (!ticker) return;

    if (!/^[A-Z]{1,5}$/.test(ticker)) {
      setValidationMsg("Tickers are 1-5 letters (e.g. AAPL, MSFT)");
      return;
    }

    if (existingTickers.includes(ticker)) {
      setValidationMsg(`${ticker} is already in your watchlist`);
      return;
    }

    onAdd(ticker);
    setValue("");
    setValidationMsg(null);
  };

  return (
    <div className="mb-8">
      <form onSubmit={handleSubmit} className="flex gap-3 items-center">
        <input
          type="text"
          value={value}
          onChange={(e) => {
            setValue(e.target.value.toUpperCase());
            setValidationMsg(null);
          }}
          placeholder="TICKER"
          maxLength={5}
          autoComplete="off"
          spellCheck={false}
          className="retro-input"
        />
        <button type="submit" className="retro-btn retro-btn-green">
          + ADD
        </button>
      </form>
      {validationMsg && (
        <p className="mt-2 font-mono text-sm font-bold text-red-500">{validationMsg}</p>
      )}
    </div>
  );
}
