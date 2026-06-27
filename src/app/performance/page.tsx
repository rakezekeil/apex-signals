import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { getClosedSignals, getStats } from "@/lib/stats";
import { fmtPrice, marketLabels } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function PerformancePage() {
  const [closed, stats] = await Promise.all([getClosedSignals(), getStats()]);

  return (
    <>
      <NavBar />
      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <h1 className="text-3xl font-bold text-white">ប្រវត្តិលទ្ធផល 📊</h1>
        <p className="mt-2 text-slate-400">
          តម្លាភាពពេញលេញ — យើងបង្ហាញលទ្ធផលទាំងអស់ ទាំងឈ្នះ និងចាញ់។
        </p>

        {/* Big stats */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <BigStat value={`${stats.winRate}%`} label="អត្រាជោគជ័យ" sub={`${stats.wins}/${stats.total} ឈ្នះ`} accent />
          <BigStat value={`+${stats.totalProfit}%`} label="ចំណេញសរុប" sub="គ្រប់សញ្ញាបញ្ចូលគ្នា" />
          <BigStat value={`+${stats.avgProfit}%`} label="ចំណេញមធ្យម" sub="ក្នុងមួយសញ្ញា" />
          <BigStat value={`${stats.active}`} label="សញ្ញាសកម្ម" sub="កំពុងដំណើរការ" />
        </div>

        {/* Win/loss bar */}
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <div className="mb-2 flex justify-between text-sm">
            <span className="text-emerald-400">ឈ្នះ {stats.wins}</span>
            <span className="text-rose-400">ចាញ់ {stats.losses}</span>
          </div>
          <div className="flex h-3 overflow-hidden rounded-full bg-white/10">
            <div
              className="bg-gradient-to-r from-emerald-400 to-emerald-500"
              style={{ width: `${stats.winRate}%` }}
            />
            <div className="flex-1 bg-rose-500/60" />
          </div>
        </div>

        {/* Results table */}
        <div className="mt-8 overflow-hidden rounded-2xl border border-white/10">
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-left text-xs uppercase tracking-wide text-slate-400">
              <tr>
                <th className="px-4 py-3">គូ</th>
                <th className="px-4 py-3">ទីផ្សារ</th>
                <th className="px-4 py-3">ទិស</th>
                <th className="hidden px-4 py-3 sm:table-cell">ចូល</th>
                <th className="px-4 py-3 text-right">លទ្ធផល</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {closed.map((s) => {
                const won = s.result === "win";
                return (
                  <tr key={s.id} className="transition hover:bg-white/[0.03]">
                    <td className="px-4 py-3 font-medium text-white">{s.pair}</td>
                    <td className="px-4 py-3 text-slate-400">{marketLabels[s.market] ?? s.market}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded px-2 py-0.5 text-xs font-semibold ${
                          s.direction === "BUY"
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-rose-500/10 text-rose-400"
                        }`}
                      >
                        {s.direction === "BUY" ? "ទិញ" : "លក់"}
                      </span>
                    </td>
                    <td className="hidden px-4 py-3 text-slate-300 sm:table-cell">{fmtPrice(s.entryPrice)}</td>
                    <td className="px-4 py-3 text-right">
                      <span className={`font-bold ${won ? "text-emerald-400" : "text-rose-400"}`}>
                        {won ? "+" : ""}
                        {s.profitPercent}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </main>
      <Footer />
    </>
  );
}

function BigStat({
  value,
  label,
  sub,
  accent,
}: {
  value: string;
  label: string;
  sub: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
      <div className={`text-4xl font-bold ${accent ? "text-cyan-400" : "text-white"}`}>{value}</div>
      <div className="mt-2 font-medium text-slate-200">{label}</div>
      <div className="mt-0.5 text-xs text-slate-500">{sub}</div>
    </div>
  );
}
