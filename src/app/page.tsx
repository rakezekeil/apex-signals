import Link from "next/link";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { SignalCard } from "@/components/SignalCard";
import { LivePrices } from "@/components/LivePrices";
import { getActiveSignals, getClosedSignals, getStats } from "@/lib/stats";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [active, closed, stats] = await Promise.all([
    getActiveSignals(),
    getClosedSignals(),
    getStats(),
  ]);

  const goldActive = active.filter((s) => s.market === "gold");
  const otherActive = active.filter((s) => s.market !== "gold");
  const goldClosed = closed.filter((s) => s.market === "gold").slice(0, 6);

  return (
    <>
      <NavBar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(34,211,238,0.15),transparent)]" />
        <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-16 text-center sm:px-6 sm:pt-24">
          <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-1.5 text-xs font-medium text-amber-300">
            🥇 ផ្ដោតលើមាស XAU/USD
          </span>

          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-bold leading-tight text-white sm:text-6xl">
            សញ្ញាមាស
            <span className="bg-gradient-to-r from-amber-400 to-cyan-400 bg-clip-text text-transparent">
              {" "}ច្រើនដងក្នុងមួយថ្ងៃ
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
            ទទួលបានសញ្ញាជួញដូរមាស (XAU/USD) ពីស៊ុម 15M ដល់ 4H ដោយឥតដែនកំណត់
            ជាមួយ Entry, SL និង TP ច្បាស់លាស់។
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/signals?market=gold"
              className="rounded-xl bg-gradient-to-r from-amber-400 to-cyan-500 px-6 py-3 text-sm font-bold text-[#0a0e1a] transition hover:opacity-90"
            >
              មើលសញ្ញាមាសឥឡូវនេះ →
            </Link>
            <Link
              href="/admin/signals"
              className="rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              ➕ បន្ថែមសញ្ញា
            </Link>
          </div>

          {/* Stat strip */}
          <div className="mx-auto mt-14 grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-4">
            <StatBox value={`${goldActive.length}`} label="សញ្ញាមាសសកម្ម" accent />
            <StatBox value={`${stats.winRate}%`} label="អត្រាជោគជ័យ" />
            <StatBox value={`${goldClosed.filter((s) => s.result === "win").length}`} label="មាសឈ្នះ" />
            <StatBox value={`+${stats.bestTrade}%`} label="ចំណេញល្អបំផុត" />
          </div>
        </div>
      </section>

      {/* Gold active signals */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">សញ្ញាមាសសកម្ម 🔴</h2>
            <p className="mt-1 text-sm text-slate-400">សញ្ញា XAU/USD ដែលកំពុងបើកឥឡូវនេះ</p>
          </div>
          <Link href="/signals?market=gold" className="text-sm font-medium text-amber-400 hover:underline">
            មើលមាសទាំងអស់ →
          </Link>
        </div>

        {goldActive.length === 0 ? (
          <p className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-slate-400">
            មិនមានសញ្ញាមាសសកម្មនៅពេលនេះទេ។ សូមបន្ថែមសញ្ញាថ្មីតាមរយៈ Admin។
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {goldActive.map((s) => (
              <SignalCard key={s.id} s={s} />
            ))}
          </div>
        )}
      </section>

      {/* Other active signals */}
      {otherActive.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">សញ្ញាផ្សេងទៀត</h2>
              <p className="mt-1 text-sm text-slate-400">Crypto, Forex និងទីផ្សារដទៃ</p>
            </div>
            <Link href="/signals" className="text-sm font-medium text-cyan-400 hover:underline">
              មើលទាំងអស់ →
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {otherActive.map((s) => (
              <SignalCard key={s.id} s={s} />
            ))}
          </div>
        </section>
      )}

      {/* Live prices */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">តម្លៃផ្សារពិត 🌍</h2>
            <p className="mt-1 text-sm text-slate-400">តាមដានតម្លៃមាស និងទីផ្សារដទៃជាពេលវេលាពិត</p>
          </div>
          <Link href="/prices" className="text-sm font-medium text-cyan-400 hover:underline">
            មើលទាំងអស់ →
          </Link>
        </div>
        <LivePrices />
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <h2 className="text-center text-2xl font-bold text-white">ហេតុអ្វីប្រើ ApexSignals?</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <Feature icon="🥇" title="មាសជាចម្បង" desc="សញ្ញាមាស XAU/USD ជាច្រើនដងក្នុងមួយថ្ងៃ ពី scalping 15M ដល់ swing 4H។" />
          <Feature icon="⚡" title="ភ្លាមៗ" desc="បន្ថែមសញ្ញាថ្មីបានភ្លាមៗតាមរយៈ Admin panel ផ្ទាល់ខ្លួន។" />
          <Feature icon="🛡️" title="គ្រប់គ្រងហានិភ័យ" desc="គ្រប់សញ្ញាមាន Entry, Stop Loss និង Take Profit ច្បាស់លាស់។" />
          <Feature icon="📊" title="តម្លាភាពពេញលេញ" desc="បង្ហាញលទ្ធផលទាំងឈ្នះ និងចាញ់ ដើម្បីវាស់ប្រសិទ្ធភាពពិត។" />
          <Feature icon="🌐" title="ទីផ្សារចម្រុះ" desc="គ្របដណ្ដប់មាស, Crypto, Forex តាមតម្រូវការ។" />
          <Feature icon="👨‍🏫" title="ការវិភាគលម្អិត" desc="សញ្ញានីមួយៗមានការពន្យល់ហេតុផល និងគម្រោងច្បាស់លាស់។" />
        </div>
      </section>

      {/* Recent gold results */}
      {goldClosed.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="text-2xl font-bold text-white">លទ្ធផលមាសថ្មីៗ ✅</h2>
            <Link href="/performance" className="text-sm font-medium text-cyan-400 hover:underline">
              មើលប្រវត្តិទាំងអស់ →
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {goldClosed.map((s) => (
              <SignalCard key={s.id} s={s} />
            ))}
          </div>
        </section>
      )}

      <Footer />
    </>
  );
}

function StatBox({ value, label, accent }: { value: string; label: string; accent?: boolean }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
      <div className={`text-3xl font-bold ${accent ? "text-amber-400" : "text-white"}`}>{value}</div>
      <div className="mt-1 text-xs text-slate-400">{label}</div>
    </div>
  );
}

function Feature({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-amber-400/30">
      <div className="grid h-12 w-12 place-items-center rounded-xl bg-white/5 text-2xl">{icon}</div>
      <h3 className="mt-4 font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-400">{desc}</p>
    </div>
  );
}
