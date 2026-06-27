import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { TradeJournal } from "@/components/TradeJournal";

export const dynamic = "force-dynamic";

export default function JournalPage() {
  return (
    <>
      <NavBar />
      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <h1 className="text-3xl font-bold text-white">កំណត់ហេតុ​ការ​ជួញដូរ 📓</h1>
        <p className="mt-2 max-w-2xl text-slate-400">
          កត់ត្រា​រាល់ trade ពី <strong className="text-slate-200">Demo Account</strong> របស់អ្នក
          ដើម្បី​វាស់​អត្រា​ជោគជ័យ​ពិត​ប្រាកដ មុនពេល​សម្រេចចិត្ត​ប្រើ​លុយ​ពិត។
          ការ forward test ប្រកប​ដោយ​វិន័យ គឺជា​គន្លឹះ​ភាព​ជោគជ័យ។
        </p>

        <div className="mt-6 rounded-xl border border-cyan-400/20 bg-cyan-400/5 p-4 text-sm leading-relaxed text-cyan-100/80">
          🎯 <strong>គោលដៅ៖</strong> សាក​យ៉ាងតិច 30-50 trades លើ Demo → បើ Win Rate ស្ថិតស្ថេរ
          និង​ចំណេញ​សុទ្ធ​វិជ្ជមាន → ទើប​ចាប់ផ្ដើម​លុយ​ពិត​បន្តិច​ម្ដងៗ ដោយ​ហានិភ័យ​ត្រឹម 1-2% ក្នុង​មួយ trade។
        </div>

        <div className="mt-8">
          <TradeJournal />
        </div>
      </main>
      <Footer />
    </>
  );
}
