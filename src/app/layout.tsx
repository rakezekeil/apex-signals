import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Noto_Sans_Khmer } from "next/font/google";
import "./globals.css";

const khmer = Noto_Sans_Khmer({
  subsets: ["khmer"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-khmer",
});

export const metadata: Metadata = {
  title: "ApexSignals — សញ្ញាចូលផ្សារ អត្រាជោគជ័យខ្ពស់",
  description:
    "ApexSignals ផ្ដល់សញ្ញាជួញដូរ (Trading Signals) សម្រាប់ Crypto, Forex និងមាស ជាមួយអត្រាជោគជ័យខ្ពស់ និងការវិភាគលម្អិត។",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="km">
      <body
        className={`${khmer.variable} bg-[#0a0e1a] text-slate-100 antialiased`}
        style={{ fontFamily: "var(--font-khmer), system-ui, sans-serif" }}
      >
        {children}
      </body>
    </html>
  );
}
