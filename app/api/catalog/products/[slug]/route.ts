import { NextResponse } from "next/server";
import { getProduct } from "@/lib/catalog";

export const dynamic = "force-dynamic";
const cacheHeaders = {
  "Cache-Control":
    "public, max-age=60, s-maxage=300, stale-while-revalidate=600",
};
export async function GET(
  _request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;
  const product = await getProduct(slug);
  if (!product)
    return NextResponse.json({ error: "পণ্য পাওয়া যায়নি" }, { status: 404 });
  return NextResponse.json({ product }, { headers: cacheHeaders });
}
