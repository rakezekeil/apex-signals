"use client";

import { useEffect, useMemo, useState } from "react";
import type { Trade } from "@/db/schema";
import { fmtPrice, marketLabels } from "@/lib/format";

type FormState = {
  pair: string;
  market: string;
  direction: string;
  account: string;
  entryPrice: string;
  exitPrice: string;
  lotSize: string;
  result: string;
  pnl: string;
  notes: string;
};

const empty: FormState = {
  pair: "",
  market: "gold",
  direction: "BUY",
  account: "demo",
  entryPrice: "",
  exitPrice: "",
  lotSize: "0.01",
  result: "open",
  pnl: "",
  notes: "",
};

export function TradeJournal() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [form, setForm] = useState<FormState>(empty);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const [filter, setFilter] = useState<"all" | "demo" | "real">("all");

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/trades");
      const data = await res.json();
      setTrades(data.trades ?? []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setErr("");
    try {
      const res = await fetch("/api/trades", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setForm(empty);
        await load();
      } else {
        setErr(data.error ?? "មានបញ្ហា");
      }
    } catch {
      setErr("មានបញ្ហាក្នុងការតភ្ជាប់");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: number) {
    await fetch(`/api/trades/${id}`, { method: "DELETE" });
    await load();
  }

  const filtered = useMemo(
    () => trades.filter((t) => filter === "all" || t.account === filter),
    [trades, filter]
  );

  const stats = useMemo(() => {
    const closed = filtered.filter((t) => t.result === "win" || t.result === "loss");
    const wins = closed.filter((t) => t.result === "win").length;
    const losses = closed.filter((t) => t.result === "loss").length;
    const totalPnl = filtered.reduce((a, t) => a + parseFloat(t.pnl ?? "0"), 0);
    return {
      total: closed.length,
      wins,
      losses,
      winRate: closed.length ? Math.round((wins / closed.length) * 1000) / 10 : 0,
      totalPnl: Math.round(totalPnl * 100) / 100,
      open: filtered.filter((t) => t.result === "open" || !t.result).length,
    };
  }, [filtered]);

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <JStat value={`${stats.winRate}%`} label="អត្រាជោគជ័យ​របស់អ្នក" sub={`${stats.wins}W / ${stats.losses}L`} accent />
        <JStat
          value={`${stats.totalPnl >= 0 ? "+" : ""}$${stats.totalPnl}`}
          label="ចំណេញ/ខាត សរុប"
          sub={stats.totalPnl >= 0 ? "កំពុងចំណេញ" : "កំពុងខាត"}
          tone={stats.totalPnl >= 0 ? "win" : "loss"}
        />
        <JStat value={`${stats.total}`} label="Trades បិទរួច" sub="សម្រាប់​វិភាគ" />
        <JStat value={`${stats.open}`} label="Trades កំពុងបើក" sub="មិនទាន់បិទ" />
      </div>

      {stats.total > 0 && stats.total < 20 && (
        <div className="rounded-xl border border-amber-400/20 bg-amber-400/5 p-4 text-sm text-amber-200/80">
          💡 អ្នកមាន {stats.total} trades បិទរួច។ ដើម្បីវាយតម្លៃ​ប្រសិទ្ធភាព​ឱ្យ​ត្រឹមត្រូវ
          អ្នកគួរ​សាក​យ៉ាងតិច <strong>30-50 trades</strong> លើ Demo មុនពេលសម្រេចចិត្ត​ប្រើ​លុយ​ពិត។
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
        {/* Form */}
        <form
          onSubmit={submit}
          className="h-fit space-y-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5"
        >
          <h3 className="font-semibold text-white">➕ បន្ថែម Trade ថ្មី</h3>

          <div className="grid grid-cols-2 gap-2">
            <Field label="គូ (Pair)">
              <input
                required
                placeholder="XAU/USD"
                value={form.pair}
                onChange={(e) => setForm({ ...form, pair: e.target.value })}
                className={inputCls}
              />
            </Field>
            <Field label="ទីផ្សារ">
              <select value={form.market} onChange={(e) => setForm({ ...form, market: e.target.value })} className={inputCls}>
                <option value="gold">មាស</option>
                <option value="crypto">គ្រីបតូ</option>
                <option value="forex">ហ្វូរិច</option>
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Field label="ទិស">
              <select value={form.direction} onChange={(e) => setForm({ ...form, direction: e.target.value })} className={inputCls}>
                <option value="BUY">ទិញ (BUY)</option>
                <option value="SELL">លក់ (SELL)</option>
              </select>
            </Field>
            <Field label="គណនី">
              <select value={form.account} onChange={(e) => setForm({ ...form, account: e.target.value })} className={inputCls}>
                <option value="demo">Demo</option>
                <option value="real">លុយពិត (Real)</option>
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Field label="តម្លៃចូល (Entry)">
              <input
                required
                type="number"
                step="any"
                placeholder="4020"
                value={form.entryPrice}
                onChange={(e) => setForm({ ...form, entryPrice: e.target.value })}
                className={inputCls}
              />
            </Field>
            <Field label="តម្លៃចេញ (Exit)">
              <input
                type="number"
                step="any"
                placeholder="4060"
                value={form.exitPrice}
                onChange={(e) => setForm({ ...form, exitPrice: e.target.value })}
                className={inputCls}
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Field label="Lot Size">
              <input
                type="number"
                step="any"
                placeholder="0.01"
                value={form.lotSize}
                onChange={(e) => setForm({ ...form, lotSize: e.target.value })}
                className={inputCls}
              />
            </Field>
            <Field label="លទ្ធផល">
              <select value={form.result} onChange={(e) => setForm({ ...form, result: e.target.value })} className={inputCls}>
                <option value="open">កំពុងបើក</option>
                <option value="win">ឈ្នះ</option>
                <option value="loss">ចាញ់</option>
                <option value="breakeven">ស្មើ</option>
              </select>
            </Field>
          </div>

          <Field label="ចំណេញ/ខាត ($) — បូក ឬ ដក">
            <input
              type="number"
              step="any"
              placeholder="ឧ. 12.50 ឬ -8.00"
              value={form.pnl}
              onChange={(e) => setForm({ ...form, pnl: e.target.value })}
              className={inputCls}
            />
          </Field>

          <Field label="កំណត់ចំណាំ (ស្រេចចិត្ត)">
            <textarea
              rows={2}
              placeholder="ហេតុផល​ចូល trade, អារម្មណ៍, មេរៀន..."
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className={inputCls}
            />
          </Field>

          {err && <p className="text-sm text-rose-400">{err}</p>}
          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-500 py-2.5 text-sm font-bold text-[#0a0e1a] transition hover:opacity-90 disabled:opacity-60"
          >
            {saving ? "កំពុងរក្សាទុក..." : "រក្សាទុក Trade"}
          </button>
        </form>

        {/* List */}
        <div>
          <div className="mb-3 flex gap-1.5">
            {(["all", "demo", "real"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                  filter === f ? "bg-cyan-400 text-[#0a0e1a]" : "bg-white/5 text-slate-300 hover:bg-white/10"
                }`}
              >
                {f === "all" ? "ទាំងអស់" : f === "demo" ? "Demo" : "លុយពិត"}
              </button>
            ))}
          </div>

          {loading ? (
            <p className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-slate-400">
              កំពុងផ្ទុក...
            </p>
          ) : filtered.length === 0 ? (
            <p className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-slate-400">
              មិនទាន់មាន trade ទេ។ បន្ថែម trade ដំបូងរបស់អ្នក​ពី demo account!
            </p>
          ) : (
            <div className="space-y-2">
              {filtered.map((t) => {
                const won = t.result === "win";
                const lost = t.result === "loss";
                const open = t.result === "open" || !t.result;
                const pnl = parseFloat(t.pnl ?? "0");
                return (
                  <div
                    key={t.id}
                    className="rounded-xl border border-white/10 bg-white/[0.03] p-4"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`rounded px-2 py-0.5 text-xs font-bold ${
                          t.direction === "BUY"
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-rose-500/10 text-rose-400"
                        }`}
                      >
                        {t.direction === "BUY" ? "▲" : "▼"} {t.pair}
                      </span>
                      <span className="text-xs text-slate-500">
                        {marketLabels[t.market] ?? t.market} · {t.account === "demo" ? "Demo" : "ពិត"} · {t.lotSize} lot
                      </span>
                      <span
                        className={`ml-auto rounded px-2 py-0.5 text-xs font-semibold ${
                          open
                            ? "bg-cyan-500/10 text-cyan-300"
                            : won
                            ? "bg-emerald-500/15 text-emerald-400"
                            : lost
                            ? "bg-rose-500/15 text-rose-400"
                            : "bg-white/10 text-slate-300"
                        }`}
                      >
                        {open ? "បើក" : won ? "ឈ្នះ" : lost ? "ចាញ់" : "ស្មើ"}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center gap-4 text-sm">
                      <span className="text-slate-400">
                        ចូល <span className="text-slate-200">{fmtPrice(t.entryPrice)}</span>
                      </span>
                      {t.exitPrice && (
                        <span className="text-slate-400">
                          ចេញ <span className="text-slate-200">{fmtPrice(t.exitPrice)}</span>
                        </span>
                      )}
                      {t.pnl !== null && (
                        <span className={`font-bold ${pnl >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                          {pnl >= 0 ? "+" : ""}${t.pnl}
                        </span>
                      )}
                      <button
                        onClick={() => remove(t.id)}
                        className="ml-auto text-xs text-slate-500 hover:text-rose-400"
                      >
                        លុប
                      </button>
                    </div>
                    {t.notes && <p className="mt-2 text-xs text-slate-500">📝 {t.notes}</p>}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const inputCls =
  "w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white placeholder-slate-600 outline-none focus:border-cyan-400/50";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs text-slate-400">{label}</span>
      {children}
    </label>
  );
}

function JStat({
  value,
  label,
  sub,
  accent,
  tone,
}: {
  value: string;
  label: string;
  sub: string;
  accent?: boolean;
  tone?: "win" | "loss";
}) {
  const color = tone === "win" ? "text-emerald-400" : tone === "loss" ? "text-rose-400" : accent ? "text-cyan-400" : "text-white";
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
      <div className={`text-3xl font-bold ${color}`}>{value}</div>
      <div className="mt-1 font-medium text-slate-200">{label}</div>
      <div className="mt-0.5 text-xs text-slate-500">{sub}</div>
    </div>
  );
}
