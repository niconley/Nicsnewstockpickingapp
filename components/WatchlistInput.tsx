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
      setValidationMsg("Tickers are 1–5 letters (e.g. AAPL, MSFT)");
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
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => {
            setValue(e.target.value.toUpperCase());
            setValidationMsg(null);
          }}
          placeholder="Enter ticker (e.g. AAPL)"
          maxLength={5}
          autoComplete="off"
          spellCheck={false}
          className="flex-1 max-w-xs bg-gray-800 text-white placeholder-gray-500 border border-gray-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors"
        >
          Add
        </button>
      </form>
      {validationMsg && (
        <p className="mt-2 text-red-400 text-sm">{validationMsg}</p>
      )}
    </div>
  );
}
