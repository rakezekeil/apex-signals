import { getLivePrices } from "@/lib/prices";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const prices = await getLivePrices();
    return Response.json({ prices, ok: true });
  } catch {
    return Response.json(
      { ok: false, error: "មិនអាចទាញយកតម្លៃបច្ចុប្បន្នបានទេ" },
      { status: 500 }
    );
  }
}
