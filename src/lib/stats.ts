import { db } from "@/db";
import { signals, type Signal } from "@/db/schema";
import { desc, eq, sql } from "drizzle-orm";

export async function getActiveSignals(): Promise<Signal[]> {
  return db
    .select()
    .from(signals)
    .where(eq(signals.status, "active"))
    .orderBy(desc(signals.createdAt));
}

export async function getClosedSignals(): Promise<Signal[]> {
  return db
    .select()
    .from(signals)
    .where(eq(signals.status, "closed"))
    .orderBy(desc(signals.closedAt));
}

export async function getAllSignals(): Promise<Signal[]> {
  return db.select().from(signals).orderBy(desc(signals.createdAt));
}

export async function getSignalById(id: number): Promise<Signal | undefined> {
  const rows = await db.select().from(signals).where(eq(signals.id, id)).limit(1);
  return rows[0];
}

export type PerfStats = {
  total: number;
  wins: number;
  losses: number;
  winRate: number;
  active: number;
  totalProfit: number;
  avgProfit: number;
  bestTrade: number;
};

export async function getStats(): Promise<PerfStats> {
  const closed = await getClosedSignals();
  const activeRows = await db
    .select({ c: sql<number>`count(*)` })
    .from(signals)
    .where(eq(signals.status, "active"));

  const wins = closed.filter((s) => s.result === "win").length;
  const losses = closed.filter((s) => s.result === "loss").length;
  const total = closed.length;
  const profits = closed.map((s) => parseFloat(s.profitPercent ?? "0"));
  const totalProfit = profits.reduce((a, b) => a + b, 0);
  const bestTrade = profits.length ? Math.max(...profits) : 0;

  return {
    total,
    wins,
    losses,
    winRate: total ? Math.round((wins / total) * 1000) / 10 : 0,
    active: Number(activeRows[0]?.c ?? 0),
    totalProfit: Math.round(totalProfit * 100) / 100,
    avgProfit: total ? Math.round((totalProfit / total) * 100) / 100 : 0,
    bestTrade: Math.round(bestTrade * 100) / 100,
  };
}
