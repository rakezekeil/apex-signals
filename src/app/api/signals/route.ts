import { getAllSignals } from "@/lib/stats";

export const dynamic = "force-dynamic";

export async function GET() {
  const rows = await getAllSignals();
  return Response.json({ signals: rows });
}
