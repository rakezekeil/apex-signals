import { db } from "@/db";
import { signals } from "@/db/schema";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const pair = String(body.pair ?? "").trim().toUpperCase();
    const market = String(body.market ?? "crypto").trim();
    const direction = String(body.direction ?? "BUY").trim().toUpperCase();
    const entryPrice = String(parseFloat(body.entryPrice));
    const stopLoss = String(parseFloat(body.stopLoss));
    const takeProfit1 = String(parseFloat(body.takeProfit1));
    const takeProfit2 =
      body.takeProfit2 && body.takeProfit2 !== ""
        ? String(parseFloat(body.takeProfit2))
        : null;
    const takeProfit3 =
      body.takeProfit3 && body.takeProfit3 !== ""
        ? String(parseFloat(body.takeProfit3))
        : null;
    const confidence = parseInt(body.confidence ?? "80", 10);
    const timeframe = String(body.timeframe ?? "4H").trim();
    const isPremium = Boolean(body.isPremium);
    const analysis = body.analysis ? String(body.analysis).trim() : null;

    if (!pair || Number.isNaN(parseFloat(entryPrice)) || Number.isNaN(parseFloat(stopLoss))) {
      return Response.json(
        { ok: false, error: "សូមបញ្ចូលគូ តម្លៃចូល និង Stop Loss" },
        { status: 400 }
      );
    }

    await db.insert(signals).values({
      pair,
      market,
      direction,
      entryPrice,
      stopLoss,
      takeProfit1,
      takeProfit2,
      takeProfit3,
      confidence,
      timeframe,
      status: "active",
      isPremium,
      analysis,
    });

    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false, error: "មិនអាចបន្ថែមសញ្ញាបានទេ" }, { status: 500 });
  }
}
