"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import type { Signal } from "@/db/schema";
import { SignalCard } from "@/components/SignalCard";

const markets = [
  { key: "all", label: "ទាំងអស់" },
  { key: "gold", label: "🥇 មាស" },
  { key: "crypto", label: "គ្រីបតូ" },
  { key: "forex", label: "ហ្វូរិច" },
];

const statuses = [
  { key: "all", label: "ទាំងអស់" },
  { key: "active", label: "សកម្ម" },
  { key: "closed", label: "បិទរួច" },
];

export function SignalsExplorer({ signals }: { signals: Signal[] }) {
  const searchParams = useSearchParams();
  const initialMarket = searchParams.get("market") ?? "all";
  const [market, setMarket] = useState(initialMarket);
  const [status, setStatus] = useState("all");

  useEffect(() => {
    const m = searchParams.get("market");
    if (m && markets.some((x) => x.key === m)) {
      setMarket(m);
    }
  }, [searchParams]);

  const filtered = useMemo(() => {
    return signals.filter(
      (s) =>
        (market === "all" || s.market === market) &&
        (status === "all" || s.status === status)
    );
  }, [signals, market, status]);

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-4">
        <FilterGroup label="ទីផ្សារ" options={markets} value={market} onChange={setMarket} />
        <FilterGroup label="ស្ថានភាព" options={statuses} value={status} onChange={setStatus} />
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-slate-400">
          រកមិនឃើញសញ្ញាដែលត្រូវនឹងតម្រងនេះទេ។
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((s) => (
            <SignalCard key={s.id} s={s} />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { key: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <div className="mb-2 text-xs font-medium text-slate-500">{label}</div>
      <div className="flex flex-wrap gap-1.5">
        {options.map((o) => (
          <button
            key={o.key}
            onClick={() => onChange(o.key)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
              value === o.key
                ? "bg-cyan-400 text-[#0a0e1a]"
                : "bg-white/5 text-slate-300 hover:bg-white/10"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}
