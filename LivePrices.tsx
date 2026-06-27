"use client";

import { useEffect, useState } from "react";
import type { LivePrice } from "@/lib/prices";
import { marketLabels } from "@/lib/format";

const REFRESH_MS = 30_000;

export function LivePrices() {
  const [prices, setPrices] = useState<LivePrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  async function loadPrices() {
    try {
      const res = await fetch("/api/prices");
      const data = await res.json();
      if (data.ok) {
        setPrices(data.prices);
        setLastUpdated(new Date());
        setError("");
      } else {
        setError(data.error ?? "មិនអាចផ្ទុកតម្លៃបាន");
      }
    } catch {
      setError("មានបញ្ហាក្នុងការតភ្ជាប់ API");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPrices();
    const id = setInterval(loadPrices, REFRESH_MS);
    return () => clearInterval(id);
  }, []);

  if (loading) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-slate-400">
        កំពុងផ្ទុកតម្លៃផ្សារពិត...
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-slate-400">
          {lastUpdated && <>ធ្វើឱ្យទាន់សម័យចុងក្រោយ៖ {lastUpdated.toLocaleTimeString("km-KH")}</>}
        </p>
        <button
          onClick={() => {
            setLoading(true);
            loadPrices();
          }}
          className="rounded-lg bg-white/5 px-3 py-1.5 text-sm text-slate-300 transition hover:bg-white/10"
        >
          🔄 Refresh
        </button>
      </div>

      {error && <p className="mb-4 rounded-lg bg-rose-500/10 p-3 text-sm text-rose-400">{error}</p>}

      <div className="overflow-hidden rounded-2xl border border-white/10">
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-left text-xs uppercase tracking-wide text-slate-400">
            <tr>
              <th className="px-4 py-3">គូ</th>
              <th className="px-4 py-3">ទីផ្សារ</th>
              <th className="px-4 py-3">តម្លៃបច្ចុប្បន្ន</th>
              <th className="px-4 py-3">ប្រែប្រួល 24H</th>
              <th className="hidden px-4 py-3 sm:table-cell">ប្រភព</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {prices.map((p) => (
              <tr key={p.pair} className="transition hover:bg-white/[0.03]">
                <td className="px-4 py-3 font-semibold text-white">{p.pair}</td>
                <td className="px-4 py-3 text-slate-400">{marketLabels[p.market] ?? p.market}</td>
                <td className="px-4 py-3 text-base font-bold text-cyan-300">
                  {fmtLivePrice(p.price)}
                </td>
                <td className="px-4 py-3">
                  {p.change24h === null ? (
                    <span className="text-slate-500">—</span>
                  ) : (
                    <span
                      className={`rounded px-2 py-0.5 text-xs font-bold ${
                        p.change24h >= 0 ? "bg-emerald-500/15 text-emerald-400" : "bg-rose-500/15 text-rose-400"
                      }`}
                    >
                      {p.change24h >= 0 ? "+" : ""}
                      {p.change24h.toFixed(2)}%
                    </span>
                  )}
                </td>
                <td className="hidden px-4 py-3 text-xs text-slate-500 sm:table-cell">{p.source}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-xs leading-relaxed text-slate-500">
        ℹ️ តម្លៃមាស (XAU/USD) ប្រើ PAXG (Paxos Gold) ជា proxy — វាតាមដានតម្លៃមាសពិតប្រកិច្ចកាលយ៉ាងជិតស្និទ្ធ។
        តម្លៃ Crypto មកពី CoinGecko ហើយ Forex មកពី live-rates.com។ ទិន្នន័យអាចមានពន្យារបន្តិច។
      </div>
    </div>
  );
}

function fmtLivePrice(n: number): string {
  if (n >= 1000) return `$${n.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
  if (n >= 1) return `$${n.toLocaleString("en-US", { maximumFractionDigits: 3 })}`;
  return `$${n.toLocaleString("en-US", { maximumFractionDigits: 5 })}`;
}
