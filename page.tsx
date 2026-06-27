import Link from "next/link";
import { notFound } from "next/navigation";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { getSignalById } from "@/lib/stats";
import { getLivePrices, getPriceForPair } from "@/lib/prices";
import { fmtPrice, timeAgo, marketLabels, marketEmoji } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function SignalDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const signalId = parseInt(id, 10);
  if (Number.isNaN(signalId)) notFound();

  const s = await getSignalById(signalId);
  if (!s) notFound();

  const prices = await getLivePrices();
  const live = getPriceForPair(prices, s.pair);

  const isBuy = s.direction === "BUY";
  const isActive = s.status === "active";
  const won = s.result === "win";

  const targets = [
    { label: "Take Profit 1", value: s.takeProfit1 },
    { label: "Take Profit 2", value: s.takeProfit2 },
    { label: "Take Profit 3", value: s.takeProfit3 },
  ].filter((t) => t.value !== null);

  return (
    <>
      <NavBar />
      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <Link href="/signals" className="text-sm text-slate-400 hover:text-cyan-400">
          ← ត្រឡប់ទៅសញ្ញាទាំងអស់
        </Link>

        <div className="mt-5 rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-6 sm:p-8">
          <div className="flex items-center gap-4">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white/5 text-2xl ring-1 ring-white/10">
              {marketEmoji[s.market] ?? "📊"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-white">{s.pair}</h1>
                {s.isPremium && (
                  <span className="rounded-full bg-amber-400/15 px-2 py-0.5 text-[11px] font-semibold text-amber-300">
                    ⭐ PREMIUM
                  </span>
                )}
              </div>
              <div className="text-sm text-slate-400">
                {marketLabels[s.market] ?? s.market} · ស៊ុមពេល {s.timeframe}
              </div>
            </div>
            <span
              className={`ml-auto rounded-xl px-4 py-2 text-base font-bold ${
                isBuy
                  ? "bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30"
                  : "bg-rose-500/15 text-rose-400 ring-1 ring-rose-500/30"
              }`}
            >
              {isBuy ? "▲ ទិញ (BUY)" : "▼ លក់ (SELL)"}
            </span>
          </div>

          {/* status */}
          <div className="mt-5 flex flex-wrap items-center gap-3">
            {isActive ? (
              <span className="flex items-center gap-1.5 rounded-lg bg-emerald-500/10 px-3 py-1.5 text-sm font-medium text-emerald-400">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                សញ្ញាសកម្ម · {timeAgo(s.createdAt)}
              </span>
            ) : (
              <span
                className={`rounded-lg px-3 py-1.5 text-sm font-bold ${
                  won ? "bg-emerald-500/15 text-emerald-400" : "bg-rose-500/15 text-rose-400"
                }`}
              >
                {won ? "✅ ឈ្នះ" : "❌ ចាញ់"} · {won ? "+" : ""}
                {s.profitPercent}%
              </span>
            )}
            <span className="rounded-lg bg-white/5 px-3 py-1.5 text-sm text-cyan-300">
              ភាពជឿជាក់ {s.confidence}%
            </span>
          </div>

          {/* Live market price */}
          {live && (
            <div className="mt-5 rounded-2xl border border-cyan-400/20 bg-cyan-500/5 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-xs text-cyan-300/80">តម្លៃផ្សារពិតបច្ចុប្បន្ន</div>
                  <div className="text-2xl font-bold text-white">${fmtPrice(live.price)}</div>
                  <div className="text-xs text-slate-500">ប្រភព៖ {live.source}</div>
                </div>
                <LivePriceStatus live={live.price} entry={parseFloat(s.entryPrice)} direction={s.direction} />
              </div>
            </div>
          )}

          {/* prices */}
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <PriceRow label="ចំណុចចូល (Entry)" value={fmtPrice(s.entryPrice)} tone="neutral" />
            <PriceRow label="Stop Loss" value={fmtPrice(s.stopLoss)} tone="loss" />
            {targets.map((t, i) => (
              <PriceRow key={i} label={t.label} value={fmtPrice(t.value)} tone="win" />
            ))}
          </div>

          {/* របៀបប្រើប្រាស់សញ្ញានេះ */}
          <div className="mt-6 rounded-2xl border border-cyan-400/20 bg-cyan-500/5 p-5">
            <div className="text-sm font-semibold text-cyan-300"> របៀបយក signal នេះទៅប្រើលើ MT5</div>
            <div className="mt-3 space-y-2 text-sm leading-relaxed text-slate-300">
              <p>
                <span className="font-semibold text-white">{s.timeframe}</span> មានន័យថា គេបាន
                វិភាគលើ <strong className="text-white">chart 4 ម៉ោង</strong> (មិនមែនរង់ចាំ 4 ម៉ោងទេ)។
              </p>
              <p>
                 <strong className="text-white">វិធី 1 — Market Order:</strong> បើតម្លៃផសារ
                ជិត {fmtPrice(s.entryPrice)} → ចុច <em>New Order → Market Execution → Buy by Market</em>។
              </p>
              <p>
                ⏳ <strong className="text-white">វិធី 2 — Pending Order:</strong> បើតម្លៃមិន
                ទាន់ដល់ → ជ្រើស <em>Buy Limit</em> ( Buy Stop) ដាក់តម្លៃ {fmtPrice(s.entryPrice)}។
              </p>
              <p>
                ️ <strong className="text-white">កុំភ្លេច:</strong> ដាក់ SL{" "}
                <span className="text-rose-300">{fmtPrice(s.stopLoss)}</span> និង TP{" "}
                <span className="text-emerald-300">{fmtPrice(s.takeProfit1)}</span> ជានិច្ច!
              </p>
            </div>
          </div>

          {/* analysis */}
          {s.analysis && (
            <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-5">
              <div className="text-sm font-semibold text-white">📝 ការវិភាគ</div>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">{s.analysis}</p>
            </div>
          )}

          <div className="mt-6 rounded-xl border border-amber-400/20 bg-amber-400/5 p-4 text-xs leading-relaxed text-amber-200/80">
            ⚠️ នេះមិនមែនជាការណែនាំវិនិយោគទេ។ សូមគ្រប់គ្រងហានិភ័យ និងវិនិយោគតែទុនដែលអ្នកអាចបាត់បង់បាន។
          </div>

          <Link
            href="/journal"
            className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-emerald-400/30 bg-emerald-500/10 py-3 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-500/20"
          >
            ️ កត់ត្រា Trade នេះលើ Demo → ទៅកាន់កំណត់ហេតុ
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}

function PriceRow({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "neutral" | "win" | "loss";
}) {
  const colors = {
    neutral: "text-slate-100",
    win: "text-emerald-300",
    loss: "text-rose-300",
  };
  return (
    <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
      <span className="text-sm text-slate-400">{label}</span>
      <span className={`text-base font-semibold ${colors[tone]}`}>{value}</span>
    </div>
  );
}

function LivePriceStatus({
  live,
  entry,
  direction,
}: {
  live: number;
  entry: number;
  direction: string;
}) {
  const diff = live - entry;
  const diffPct = (diff / entry) * 100;
  const isBuy = direction === "BUY";
  const favorable = isBuy ? diff <= 0 : diff >= 0;

  return (
    <div className={`rounded-xl px-4 py-3 text-center ${favorable ? "bg-emerald-500/10" : "bg-rose-500/10"}`}>
      <div className={`text-lg font-bold ${favorable ? "text-emerald-400" : "text-rose-400"}`}>
        {diffPct >= 0 ? "+" : ""}
        {diffPct.toFixed(2)}%
      </div>
      <div className="text-xs text-slate-400">
        {favorable
          ? isBuy
            ? "តម្លៃល្អសម្រាប់ទិញ"
            : "តម្លៃល្អសម្រាប់លក់"
          : isBuy
          ? "តម្លៃខ្ពស់ជាង Entry"
          : "តម្លៃទាបជាង Entry"}
      </div>
    </div>
  );
}


