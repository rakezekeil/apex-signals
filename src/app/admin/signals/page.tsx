"use client";

import { useState } from "react";
import Link from "next/link";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";

const markets = [
  { key: "gold", label: "🥇 មាស (XAU/USD)" },
  { key: "crypto", label: "គ្រីបតូ" },
  { key: "forex", label: "ហ្វូរិច" },
  { key: "stock", label: "ភាគហ៊ុន" },
];

export default function AdminSignalsPage() {
  const [form, setForm] = useState({
    pair: "XAU/USD",
    market: "gold",
    direction: "BUY",
    entryPrice: "",
    stopLoss: "",
    takeProfit1: "",
    takeProfit2: "",
    takeProfit3: "",
    confidence: "85",
    timeframe: "15M",
    isPremium: false,
    analysis: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [msg, setMsg] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMsg("");
    try {
      const res = await fetch("/api/admin/signals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setStatus("ok");
        setMsg("បន្ថែមសញ្ញាថ្មីជោគជ័យ! វានឹងបង្ហាញនៅទំព័រដើមភ្លាមៗ។");
        setForm({
          pair: "XAU/USD",
          market: "gold",
          direction: "BUY",
          entryPrice: "",
          stopLoss: "",
          takeProfit1: "",
          takeProfit2: "",
          takeProfit3: "",
          confidence: "85",
          timeframe: "15M",
          isPremium: false,
          analysis: "",
        });
      } else {
        setStatus("error");
        setMsg(data.error ?? "មានបញ្ហា");
      }
    } catch {
      setStatus("error");
      setMsg("មិនអាចតភ្ជាប់ទៅ server បាន");
    }
  }

  return (
    <>
      <NavBar />
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">⚙️ Admin — បន្ថែមសញ្ញាថ្មី</h1>
          <Link href="/" className="text-sm text-cyan-400 hover:underline">
            ← ទៅទំព័រដើម
          </Link>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <p className="mb-4 text-sm text-slate-400">
            នៅទីនេះអ្នកអាចបន្ថែមសញ្ញាថ្មីដើម្បីធ្វើឱ្យវេបសាយមិននៅជាប់។ សញ្ញាថ្មីនឹងបង្ហាញនៅផ្នែក
            &quot;សញ្ញាសកម្ម&quot; ភ្លាមៗ។
          </p>

          {status === "ok" && (
            <div className="mb-4 rounded-xl bg-emerald-500/10 p-4 text-sm font-semibold text-emerald-400">
              {msg}
            </div>
          )}
          {status === "error" && (
            <div className="mb-4 rounded-xl bg-rose-500/10 p-4 text-sm font-semibold text-rose-400">
              {msg}
            </div>
          )}

          <form onSubmit={submit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="គូ (Pair) *">
                <input
                  required
                  placeholder="XAU/USD"
                  value={form.pair}
                  onChange={(e) => setForm({ ...form, pair: e.target.value })}
                  className={inputCls}
                />
              </Field>
              <Field label="ទីផ្សារ *">
                <select
                  value={form.market}
                  onChange={(e) => setForm({ ...form, market: e.target.value })}
                  className={inputCls}
                >
                  {markets.map((m) => (
                    <option key={m.key} value={m.key}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="ទិស *">
                <select
                  value={form.direction}
                  onChange={(e) => setForm({ ...form, direction: e.target.value })}
                  className={inputCls}
                >
                  <option value="BUY">ទិញ (BUY)</option>
                  <option value="SELL">លក់ (SELL)</option>
                </select>
              </Field>
              <Field label="ស៊ុមពេល *">
                <select
                  value={form.timeframe}
                  onChange={(e) => setForm({ ...form, timeframe: e.target.value })}
                  className={inputCls}
                >
                  <option value="15M">15M</option>
                  <option value="1H">1H</option>
                  <option value="4H">4H</option>
                  <option value="1D">1D</option>
                </select>
              </Field>
              <Field label="ភាពជឿជាក់ (%) *">
                <input
                  required
                  type="number"
                  min={1}
                  max={100}
                  value={form.confidence}
                  onChange={(e) => setForm({ ...form, confidence: e.target.value })}
                  className={inputCls}
                />
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="តម្លៃចូល (Entry) *">
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
              <Field label="Stop Loss *">
                <input
                  required
                  type="number"
                  step="any"
                  placeholder="3985"
                  value={form.stopLoss}
                  onChange={(e) => setForm({ ...form, stopLoss: e.target.value })}
                  className={inputCls}
                />
              </Field>
              <Field label="Take Profit 1 *">
                <input
                  required
                  type="number"
                  step="any"
                  placeholder="4060"
                  value={form.takeProfit1}
                  onChange={(e) => setForm({ ...form, takeProfit1: e.target.value })}
                  className={inputCls}
                />
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Take Profit 2 (ស្រេចចិត្ត)">
                <input
                  type="number"
                  step="any"
                  value={form.takeProfit2}
                  onChange={(e) => setForm({ ...form, takeProfit2: e.target.value })}
                  className={inputCls}
                />
              </Field>
              <Field label="Take Profit 3 (ស្រេចចិត្ត)">
                <input
                  type="number"
                  step="any"
                  value={form.takeProfit3}
                  onChange={(e) => setForm({ ...form, takeProfit3: e.target.value })}
                  className={inputCls}
                />
              </Field>
            </div>

            <label className="flex items-center gap-2 text-sm text-slate-300">
              <input
                type="checkbox"
                checked={form.isPremium}
                onChange={(e) => setForm({ ...form, isPremium: e.target.checked })}
                className="h-4 w-4 rounded border-white/10 bg-black/30 text-cyan-400"
              />
              សញ្ញា PREMIUM
            </label>

            <Field label="ការវិភាគ / ហេតុផល">
              <textarea
                rows={3}
                value={form.analysis}
                onChange={(e) => setForm({ ...form, analysis: e.target.value })}
                className={inputCls}
              />
            </Field>

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-500 py-3 text-sm font-bold text-[#0a0e1a] transition hover:opacity-90 disabled:opacity-60"
            >
              {status === "loading" ? "កំពុងរក្សាទុក..." : "➕ បន្ថែមសញ្ញាថ្មី"}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}

const inputCls =
  "w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-white placeholder-slate-600 outline-none focus:border-cyan-400/50";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs text-slate-400">{label}</span>
      {children}
    </label>
  );
}
