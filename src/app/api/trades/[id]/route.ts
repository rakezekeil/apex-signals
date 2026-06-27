import { db } from "@/db";
import { trades } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const tid = parseInt(id, 10);
  if (Number.isNaN(tid)) {
    return Response.json({ ok: false, error: "ID មិនត្រឹមត្រូវ" }, { status: 400 });
  }
  await db.delete(trades).where(eq(trades.id, tid));
  return Response.json({ ok: true });
}
