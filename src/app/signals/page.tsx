import { Suspense } from "react";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { SignalsExplorer } from "@/components/SignalsExplorer";
import { getAllSignals } from "@/lib/stats";

export const dynamic = "force-dynamic";

export default async function SignalsPage() {
  const signals = await getAllSignals();

  return (
    <>
      <NavBar />
      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <h1 className="text-3xl font-bold text-white">សញ្ញាជួញដូរទាំងអស់</h1>
        <p className="mt-2 text-slate-400">
          រុករកសញ្ញាសកម្ម និងប្រវត្តិលទ្ធផល តាមទីផ្សារ និងស្ថានភាព។
        </p>
        <div className="mt-8">
          <Suspense fallback={<p className="text-slate-400">កំពុងផ្ទុក...</p>}>
            <SignalsExplorer signals={signals} />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}
