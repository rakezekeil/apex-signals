import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { LivePrices } from "@/components/LivePrices";

export const dynamic = "force-dynamic";

export default function PricesPage() {
  return (
    <>
      <NavBar />
      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <h1 className="text-3xl font-bold text-white">តម្លៃផ្សារពិត 🌍</h1>
        <p className="mt-2 text-slate-400">
          តាមដានតម្លៃបច្ចុប្បន្ន Crypto, Forex និងមាស។ ទិន្នន័យធ្វើឱ្យទាន់សម័យស្វ័យប្រវត្តិរាល់ 30 វិនាទី។
        </p>
        <div className="mt-8">
          <LivePrices />
        </div>
      </main>
      <Footer />
    </>
  );
}
