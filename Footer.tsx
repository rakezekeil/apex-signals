import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-white/10 bg-black/20">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 font-bold">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-cyan-400 to-emerald-500 text-[#0a0e1a]">
                ▲
              </span>
              <span className="text-white">
                Apex<span className="text-cyan-400">Signals</span>
              </span>
            </div>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-slate-400">
              ឧបករណ៍គ្រប់គ្រងសញ្ញាជួញដូរ (Trading Signals) ផ្ទាល់ខ្លួនសម្រាប់ Crypto,
              Forex និងមាស ជាមួយការវិភាគ និងការគ្រប់គ្រងហានិភ័យ។
            </p>
          </div>
          <div>
            <div className="text-sm font-semibold text-white">តំណភ្ជាប់</div>
            <ul className="mt-3 space-y-2 text-sm text-slate-400">
              <li><Link href="/signals" className="hover:text-cyan-400">សញ្ញាទាំងអស់</Link></li>
              <li><Link href="/prices" className="hover:text-cyan-400">តម្លៃផ្សារ</Link></li>
              <li><Link href="/performance" className="hover:text-cyan-400">ប្រវត្តិលទ្ធផល</Link></li>
              <li><Link href="/journal" className="hover:text-cyan-400">កំណត់ហេតុ</Link></li>
            </ul>
          </div>
          <div>
            <div className="text-sm font-semibold text-white">ទំនាក់ទំនង</div>
            <ul className="mt-3 space-y-2 text-sm text-slate-400">
              <li>📧 support@apexsignals.io</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-white/10 pt-6 text-xs leading-relaxed text-slate-500">
          <p className="mb-2 font-semibold text-slate-400">⚠️ ការព្រមានអំពីហានិភ័យ</p>
          ការជួញដូរមានហានិភ័យខ្ពស់ ហើយអាចបណ្ដាលឱ្យបាត់បង់ទុន។ សញ្ញាទាំងអស់គឺជាការវិភាគ
          មិនមែនជាការណែនាំវិនិយោគ (financial advice) ឡើយ។ លទ្ធផលពីមុនមិនធានាលទ្ធផលនាពេលអនាគតទេ។
          <div className="mt-3">© {new Date().getFullYear()} ApexSignals. រក្សាសិទ្ធិគ្រប់យ៉ាង។</div>
        </div>
      </div>
    </footer>
  );
}
