import Link from "next/link";
import type { Signal } from "@/db/schema";
import { fmtPrice, timeAgo, marketLabels, marketEmoji } from "@/lib/format";

export function SignalCard({ s }: { s: Signal }) {
  const isBuy = s.direction === "BUY";
  const isActive = s.status === "active";
  const won = s.result === "win";

  return (
    <Link
      href={`/signals/${s.id}`}
      className="group relative block overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-5 transition hover:border-cyan-400/40 hover:shadow-[0_8px_40px_rgba(34,211,238,0.12)]"
    >
      {s.isPremium && (
        <span className="absolute right-3 top-3 rounded-full bg-amber-400/15 px-2.5 py-0.5 text-[11px] font-semibold text-amber-300 ring-1 ring-amber-400/30">
          ⭐ PREMIUM
        </span>
      )}

      <div className="flex items-center gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-xl bg-white/5 text-lg ring-1 ring-white/10">
          {marketEmoji[s.market] ?? "📊"}
        </div>
        <div>
          <div className="text-base font-semibold text-white">{s.pair}</div>
          <div className="text-xs text-slate-400">
            {marketLabels[s.market] ?? s.market} · {s.timeframe}
          </div>
        </div>
        <span
          className={`ml-auto rounded-lg px-3 py-1 text-sm font-bold ${
            isBuy
              ? "bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30"
              : "bg-rose-500/15 text-rose-400 ring-1 ring-rose-500/30"
          }`}
        >
          {isBuy ? "▲ ទិញ" : "▼ លក់"}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-lg bg-black/20 py-2">
          <div className="text-[10px] uppercase tracking-wide text-slate-500">ចូល</div>
          <div className="text-sm font-semibold text-slate-100">{fmtPrice(s.entryPrice)}</div>
        </div>
        <div className="rounded-lg bg-rose-500/5 py-2">
          <div className="text-[10px] uppercase tracking-wide text-rose-400/70">SL</div>
          <div className="text-sm font-semibold text-rose-300">{fmtPrice(s.stopLoss)}</div>
        </div>
        <div className="rounded-lg bg-emerald-500/5 py-2">
          <div className="text-[10px] uppercase tracking-wide text-emerald-400/70">TP1</div>
          <div className="text-sm font-semibold text-emerald-300">{fmtPrice(s.takeProfit1)}</div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-20 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400"
              style={{ width: `${s.confidence}%` }}
            />
          </div>
          <span className="text-xs font-medium text-cyan-300">{s.confidence}%</span>
        </div>

        {isActive ? (
          <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-400">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            សកម្ម
          </span>
        ) : (
          <span
            className={`rounded-md px-2 py-0.5 text-xs font-bold ${
              won ? "bg-emerald-500/15 text-emerald-400" : "bg-rose-500/15 text-rose-400"
            }`}
          >
            {won ? "+" : ""}
            {s.profitPercent}%
          </span>
        )}
      </div>

      <div className="mt-2 text-[11px] text-slate-500">
        {isActive ? timeAgo(s.createdAt) : `បិទ · ${s.closedAt ? timeAgo(s.closedAt) : ""}`}
      </div>
    </Link>
  );
}
