// ប្រភពតម្លៃផ្សារពិត (free public APIs)
// - Crypto: CoinGecko (https://www.coingecko.com/)
// - Forex: live-rates.com (https://www.live-rates.com/)
// - Gold proxy: PAXG (Paxos Gold) token on CoinGecko — តាមដានតម្លៃមាសយ៉ាងជិតស្និទ្ធ

const COINGECKO_IDS = [
  "bitcoin",
  "ethereum",
  "solana",
  "binancecoin",
  "ripple",
  "cardano",
  "pax-gold",
];

const PAIR_TO_ID: Record<string, string> = {
  "BTC/USDT": "bitcoin",
  "ETH/USDT": "ethereum",
  "SOL/USDT": "solana",
  "BNB/USDT": "binancecoin",
  "XRP/USDT": "ripple",
  "ADA/USDT": "cardano",
  "XAU/USD": "pax-gold",
};

export type LivePrice = {
  pair: string;
  market: "crypto" | "forex" | "gold";
  price: number;
  change24h: number | null;
  source: string;
  updatedAt: string;
};

let cache: { prices: LivePrice[]; fetchedAt: number } | null = null;
const CACHE_TTL_MS = 30_000; // 30s

async function fetchCryptoPrices(): Promise<LivePrice[]> {
  const url =
    "https://api.coingecko.com/api/v3/simple/price?" +
    new URLSearchParams({
      ids: COINGECKO_IDS.join(","),
      vs_currencies: "usd",
      include_24hr_change: "true",
    });

  const res = await fetch(url, { next: { revalidate: 30 } });
  if (!res.ok) throw new Error(`CoinGecko error: ${res.status}`);
  const data = (await res.json()) as Record<
    string,
    { usd: number; usd_24h_change?: number }
  >;

  const idToPair = Object.fromEntries(
    Object.entries(PAIR_TO_ID).map(([pair, id]) => [id, pair])
  );

  return Object.entries(data).map(([id, info]) => {
    const pair = idToPair[id] ?? id.toUpperCase();
    return {
      pair,
      market: id === "pax-gold" ? "gold" : "crypto",
      price: info.usd,
      change24h: info.usd_24h_change ?? null,
      source: id === "pax-gold" ? "CoinGecko (PAXG ≈ XAU/USD)" : "CoinGecko",
      updatedAt: new Date().toISOString(),
    };
  });
}

async function fetchForexPrices(): Promise<LivePrice[]> {
  const res = await fetch("https://www.live-rates.com/rates", {
    next: { revalidate: 30 },
  });
  if (!res.ok) throw new Error(`live-rates error: ${res.status}`);
  const data = (await res.json()) as Array<{
    currency: string;
    rate: string;
    timestamp: string;
  }>;

  const wanted = ["EUR/USD", "GBP/USD"];
  return data
    .filter((d) => wanted.includes(d.currency))
    .map((d) => ({
      pair: d.currency,
      market: "forex" as const,
      price: parseFloat(d.rate),
      change24h: null,
      source: "live-rates.com",
      updatedAt: new Date(parseInt(d.timestamp, 10)).toISOString(),
    }));
}

export async function getLivePrices(): Promise<LivePrice[]> {
  const now = Date.now();
  if (cache && now - cache.fetchedAt < CACHE_TTL_MS) {
    return cache.prices;
  }

  const [crypto, forex] = await Promise.allSettled([
    fetchCryptoPrices(),
    fetchForexPrices(),
  ]);

  const prices: LivePrice[] = [];
  if (crypto.status === "fulfilled") prices.push(...crypto.value);
  if (forex.status === "fulfilled") prices.push(...forex.value);

  // Fallback: បើមិនអាច fetch បាន ប្រើ cache ចាស់
  if (prices.length === 0 && cache) return cache.prices;

  cache = { prices, fetchedAt: now };
  return prices;
}

export function getPriceForPair(prices: LivePrice[], pair: string): LivePrice | undefined {
  return prices.find(
    (p) => p.pair.replace("/", "").toUpperCase() === pair.replace("/", "").toUpperCase()
  );
}
