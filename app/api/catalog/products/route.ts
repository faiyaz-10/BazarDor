import { NextResponse } from "next/server";
import { getProducts, getProductsByCategory } from "@/lib/catalog";

export const dynamic = "force-dynamic";
const cacheHeaders = {
  "Cache-Control":
    "public, max-age=60, s-maxage=300, stale-while-revalidate=600",
};
export async function GET(request: Request) {
  const url = new URL(request.url);
  const category = url.searchParams.get("category");
  const products = category
    ? await getProductsByCategory(category)
    : await getProducts();
  return NextResponse.json(
    { products, source: products.length ? "api-or-fallback" : "empty" },
    { headers: cacheHeaders },
  );
}
