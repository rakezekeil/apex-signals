import { Pool } from "pg";

const pool = new Pool({
  connectionString: "postgresql://postgres:postgres@127.0.0.1:5432/app_db",
});

const now = Date.now();
const h = 3600 * 1000;
const m = 60 * 1000;

// សញ្ញាមាសជាច្រើនដងក្នុងមួយថ្ងៃ (15M, 1H, 4H) + crypto/forex មួយចំនួន
const signals = [
  // ===== Gold signals =====
  // Active gold signals
  {
    pair: "XAU/USD", market: "gold", direction: "BUY", entry: 4020, sl: 3985, tp1: 4060, tp2: 4095, tp3: 4140,
    conf: 91, tf: "4H", status: "active", result: null, profit: null, premium: false,
    analysis: "មាស bounce ពី support $3,985 នៅលើ chart 4H។ Bullish momentum ខ្លាំង ជាមួយ volume កើន។",
    created: now - 1 * h, closed: null,
  },
  {
    pair: "XAU/USD", market: "gold", direction: "BUY", entry: 4015, sl: 3995, tp1: 4035, tp2: 4050, tp3: 4070,
    conf: 86, tf: "1H", status: "active", result: null, profit: null, premium: false,
    analysis: "មាសធ្វើ higher low នៅ 1H។ រំពឹងថានឹងប៉ះ resistance $4,035។",
    created: now - 2 * h, closed: null,
  },
  {
    pair: "XAU/USD", market: "gold", direction: "SELL", entry: 4045, sl: 4065, tp1: 4025, tp2: 4005, tp3: 3980,
    conf: 83, tf: "1H", status: "active", result: null, profit: null, premium: false,
    analysis: "មាសប៉ះ resistance ខ្លាំងនៅ $4,045-4,050។ រង់ចាំ pullback សម្រាប់ short scalp។",
    created: now - 30 * m, closed: null,
  },
  {
    pair: "XAU/USD", market: "gold", direction: "BUY", entry: 4010, sl: 4000, tp1: 4022, tp2: 4030, tp3: null,
    conf: 80, tf: "15M", status: "active", result: null, profit: null, premium: false,
    analysis: "Scalp buy លើស៊ុម 15M នៅ support minor។",
    created: now - 10 * m, closed: null,
  },
  {
    pair: "XAU/USD", market: "gold", direction: "SELL", entry: 4042, sl: 4052, tp1: 4032, tp2: 4022, tp3: null,
    conf: 78, tf: "15M", status: "active", result: null, profit: null, premium: false,
    analysis: "15M scalp sell នៅ resistance minor រង់ចាំ reversal។",
    created: now - 5 * m, closed: null,
  },

  // Closed gold signals
  {
    pair: "XAU/USD", market: "gold", direction: "BUY", entry: 3960, sl: 3940, tp1: 3985, tp2: null, tp3: null,
    conf: 88, tf: "4H", status: "closed", result: "win", profit: 0.63, premium: false,
    analysis: "មាសឈានដល់ TP +0.63%។", created: now - 20 * h, closed: now - 16 * h,
  },
  {
    pair: "XAU/USD", market: "gold", direction: "BUY", entry: 3985, sl: 3970, tp1: 4010, tp2: null, tp3: null,
    conf: 85, tf: "1H", status: "closed", result: "win", profit: 0.63, premium: false,
    analysis: "Scalp gold buy TP +0.63%។", created: now - 18 * h, closed: now - 17 * h,
  },
  {
    pair: "XAU/USD", market: "gold", direction: "SELL", entry: 4030, sl: 4045, tp1: 4010, tp2: null, tp3: null,
    conf: 82, tf: "1H", status: "closed", result: "win", profit: 0.50, premium: false,
    analysis: "Gold short scalp +0.50%។", created: now - 14 * h, closed: now - 13 * h,
  },
  {
    pair: "XAU/USD", market: "gold", direction: "BUY", entry: 3995, sl: 3980, tp1: 4015, tp2: null, tp3: null,
    conf: 79, tf: "15M", status: "closed", result: "loss", profit: -0.38, premium: false,
    analysis: "Scalp buy ប៉ះ SL -0.38% ដោយសារ spike ភ្លាមៗ។", created: now - 12 * h, closed: now - 11.5 * h,
  },
  {
    pair: "XAU/USD", market: "gold", direction: "BUY", entry: 4005, sl: 3995, tp1: 4025, tp2: null, tp3: null,
    conf: 84, tf: "15M", status: "closed", result: "win", profit: 0.50, premium: false,
    analysis: "15M gold scalp +0.50%។", created: now - 10 * h, closed: now - 9.5 * h,
  },
  {
    pair: "XAU/USD", market: "gold", direction: "SELL", entry: 4020, sl: 4035, tp1: 4005, tp2: null, tp3: null,
    conf: 81, tf: "15M", status: "closed", result: "win", profit: 0.37, premium: false,
    analysis: "Quick short scalp +0.37%។", created: now - 8 * h, closed: now - 7.8 * h,
  },

  // ===== Crypto signals =====
  {
    pair: "BTC/USDT", market: "crypto", direction: "BUY", entry: 61800, sl: 59500, tp1: 64000, tp2: 66500, tp3: 69000,
    conf: 87, tf: "4H", status: "active", result: null, profit: null, premium: false,
    analysis: "BTC bounce ពី support $59,500។",
    created: now - 2 * h, closed: null,
  },
  {
    pair: "ETH/USDT", market: "crypto", direction: "BUY", entry: 1655, sl: 1580, tp1: 1740, tp2: 1820, tp3: 1920,
    conf: 84, tf: "1H", status: "active", result: null, profit: null, premium: false,
    analysis: "ETH bounce ពី demand zone $1,580។",
    created: now - 5 * h, closed: null,
  },

  // ===== Forex signals =====
  {
    pair: "EUR/USD", market: "forex", direction: "SELL", entry: 1.0820, sl: 1.0865, tp1: 1.0770, tp2: 1.0730, tp3: null,
    conf: 83, tf: "1H", status: "active", result: null, profit: null, premium: false,
    analysis: "EUR/USD reject resistance សំខាន់។",
    created: now - 3 * h, closed: null,
  },

  // Closed crypto/forex
  {
    pair: "BTC/USDT", market: "crypto", direction: "SELL", entry: 67500, sl: 69000, tp1: 63500, tp2: null, tp3: null,
    conf: 88, tf: "4H", status: "closed", result: "win", profit: 5.92, premium: false,
    analysis: "Short BTC TP +5.92%។", created: now - 50 * h, closed: now - 38 * h,
  },
  {
    pair: "ETH/USDT", market: "crypto", direction: "SELL", entry: 1880, sl: 1950, tp1: 1700, tp2: null, tp3: null,
    conf: 86, tf: "4H", status: "closed", result: "win", profit: 9.57, premium: false,
    analysis: "ETH short +9.57%។", created: now - 60 * h, closed: now - 48 * h,
  },
  {
    pair: "EUR/USD", market: "forex", direction: "BUY", entry: 1.0900, sl: 1.0860, tp1: 1.0960, tp2: null, tp3: null,
    conf: 79, tf: "1H", status: "closed", result: "loss", profit: -0.37, premium: false,
    analysis: "EUR buy ប៉ះ SL -0.37%។", created: now - 180 * h, closed: now - 174 * h,
  },
];

await pool.query("TRUNCATE TABLE signals RESTART IDENTITY");

for (const s of signals) {
  await pool.query(
    `INSERT INTO signals (pair, market, direction, entry_price, stop_loss, take_profit1, take_profit2, take_profit3, confidence, timeframe, status, result, profit_percent, is_premium, analysis, created_at, closed_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)`,
    [s.pair, s.market, s.direction, s.entry, s.sl, s.tp1, s.tp2, s.tp3, s.conf, s.tf, s.status, s.result, s.profit, s.premium, s.analysis, new Date(s.created), s.closed ? new Date(s.closed) : null]
  );
}

console.log("Seeded", signals.length, "signals (gold-focused, unlimited)");
await pool.end();
