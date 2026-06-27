import Link from "next/link";

export function NavBar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0a0e1a]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-3.5 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-cyan-400 to-emerald-500 text-lg text-[#0a0e1a]">
            ▲
          </span>
          <span className="text-lg tracking-tight text-white">
            Apex<span className="text-cyan-400">Signals</span>
          </span>
        </Link>

        <nav className="ml-auto hidden items-center gap-1 text-sm md:flex">
          <Link href="/signals" className="rounded-lg px-3 py-2 text-slate-300 transition hover:bg-white/5 hover:text-white">
            សញ្ញាទាំងអស់
          </Link>
          <Link href="/prices" className="rounded-lg px-3 py-2 text-slate-300 transition hover:bg-white/5 hover:text-white">
            តម្លៃផ្សារ
          </Link>
          <Link href="/performance" className="rounded-lg px-3 py-2 text-slate-300 transition hover:bg-white/5 hover:text-white">
            ប្រវត្តិលទ្ធផល
          </Link>
          <Link href="/journal" className="rounded-lg px-3 py-2 text-slate-300 transition hover:bg-white/5 hover:text-white">
            កំណត់ហេតុ
          </Link>
        </nav>

      </div>
    </header>
  );
}
