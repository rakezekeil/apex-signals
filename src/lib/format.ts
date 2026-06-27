export function fmtPrice(v: string | number | null): string {
  if (v === null || v === undefined) return "—";
  const n = typeof v === "string" ? parseFloat(v) : v;
  if (Number.isNaN(n)) return "—";
  if (n >= 1000) return n.toLocaleString("en-US", { maximumFractionDigits: 2 });
  if (n >= 1) return n.toLocaleString("en-US", { maximumFractionDigits: 3 });
  return n.toLocaleString("en-US", { maximumFractionDigits: 5 });
}

export function timeAgo(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const diff = Date.now() - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "ឥឡូវនេះ";
  if (mins < 60) return `${mins} នាទីមុន`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} ម៉ោងមុន`;
  const days = Math.floor(hrs / 24);
  return `${days} ថ្ងៃមុន`;
}

export const marketLabels: Record<string, string> = {
  crypto: "គ្រីបតូ",
  forex: "ហ្វូរិច",
  gold: "មាស",
  stock: "ភាគហ៊ុន",
};

export const marketEmoji: Record<string, string> = {
  crypto: "₿",
  forex: "💱",
  gold: "🥇",
  stock: "📈",
};
