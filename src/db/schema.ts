import {
  pgTable,
  serial,
  varchar,
  text,
  integer,
  numeric,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";

// ប្រភេទទីផ្សារ: crypto, forex, gold, stock
export const signals = pgTable("signals", {
  id: serial("id").primaryKey(),
  pair: varchar("pair", { length: 32 }).notNull(),
  market: varchar("market", { length: 16 }).notNull().default("crypto"),
  direction: varchar("direction", { length: 8 }).notNull(), // BUY / SELL
  entryPrice: numeric("entry_price", { precision: 18, scale: 6 }).notNull(),
  stopLoss: numeric("stop_loss", { precision: 18, scale: 6 }).notNull(),
  takeProfit1: numeric("take_profit1", { precision: 18, scale: 6 }).notNull(),
  takeProfit2: numeric("take_profit2", { precision: 18, scale: 6 }),
  takeProfit3: numeric("take_profit3", { precision: 18, scale: 6 }),
  confidence: integer("confidence").notNull().default(80), // % ភាគរយជឿជាក់
  timeframe: varchar("timeframe", { length: 16 }).notNull().default("4H"),
  status: varchar("status", { length: 16 }).notNull().default("active"), // active / closed
  result: varchar("result", { length: 16 }), // win / loss / breakeven / null
  profitPercent: numeric("profit_percent", { precision: 8, scale: 2 }),
  isPremium: boolean("is_premium").notNull().default(false),
  analysis: text("analysis"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  closedAt: timestamp("closed_at"),
});

// កំណត់ហេតុការជួញដូរ (Demo Trade Journal)
export const trades = pgTable("trades", {
  id: serial("id").primaryKey(),
  pair: varchar("pair", { length: 32 }).notNull(),
  market: varchar("market", { length: 16 }).notNull().default("crypto"),
  direction: varchar("direction", { length: 8 }).notNull(), // BUY / SELL
  account: varchar("account", { length: 16 }).notNull().default("demo"), // demo / real
  entryPrice: numeric("entry_price", { precision: 18, scale: 6 }).notNull(),
  exitPrice: numeric("exit_price", { precision: 18, scale: 6 }),
  lotSize: numeric("lot_size", { precision: 10, scale: 2 }).notNull().default("0.01"),
  result: varchar("result", { length: 16 }), // win / loss / breakeven / open
  pnl: numeric("pnl", { precision: 14, scale: 2 }), // ចំណេញ/ខាត ($)
  notes: text("notes"),
  signalId: integer("signal_id"),
  openedAt: timestamp("opened_at").notNull().defaultNow(),
  closedAt: timestamp("closed_at"),
});

export type Signal = typeof signals.$inferSelect;
export type NewSignal = typeof signals.$inferInsert;
export type Trade = typeof trades.$inferSelect;
export type NewTrade = typeof trades.$inferInsert;
