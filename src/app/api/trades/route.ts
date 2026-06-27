import { db } from "@/db";
import { trades } from "@/db/schema";
import { desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  const rows = await db.select().from(trades).orderBy(desc(trades.openedAt));
  return Response.json({ trades: rows });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const pair = String(body.pair ?? "").trim().toUpperCase();
    const market = String(body.market ?? "crypto").trim();
    const direction = String(body.direction ?? "BUY").trim().toUpperCase();
    const account = String(body.account ?? "demo").trim();
    const entryPrice = parseFloat(body.entryPrice);
    const exitPriceRaw = body.exitPrice;
    const lotSize = parseFloat(body.lotSize ?? "0.01");
    const result = body.result ? String(body.result).trim() : "open";
    const pnlRaw = body.pnl;
    const notes = body.notes ? String(body.notes).trim() : null;

    if (!pair || Number.isNaN(entryPrice)) {
      return Response.json(
        { ok: false, error: "សូមបញ្ចូលគូ និងតម្លៃចូល (Entry)" },
        { status: 400 }
      );
    }

    const exitPrice =
      exitPriceRaw !== undefined && exitPriceRaw !== "" && exitPriceRaw !== null
        ? String(parseFloat(exitPriceRaw))
        : null;
    const pnl =
      pnlRaw !== undefined && pnlRaw !== "" && pnlRaw !== null
        ? String(parseFloat(pnlRaw))
        : null;

    const isClosed = result === "win" || result === "loss" || result === "breakeven";

    await db.insert(trades).values({
      pair,
      market,
      direction,
      account,
      entryPrice: String(entryPrice),
      exitPrice,
      lotSize: String(Number.isNaN(lotSize) ? 0.01 : lotSize),
      result,
      pnl,
      notes,
      signalId: body.signalId ? parseInt(body.signalId, 10) : null,
      closedAt: isClosed ? new Date() : null,
    });

    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false, error: "មានបញ្ហាក្នុងការរក្សាទុក" }, { status: 500 });
  }
}
