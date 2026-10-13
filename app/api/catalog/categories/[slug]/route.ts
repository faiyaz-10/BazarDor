import { NextResponse } from "next/server";
import { getCategories, getProductsByCategory } from "@/lib/catalog";

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
  const categories = await getCategories();
  const category = categories.find(
    (item) =>
      item.slug === decodeURIComponent(slug) ||
      item.name === decodeURIComponent(slug),
  );
  if (!category)
    return NextResponse.json(
      { error: "ক্যাটাগরি পাওয়া যায়নি" },
      { status: 404 },
    );
  const products = await getProductsByCategory(category.slug);
  return NextResponse.json({ category, products }, { headers: cacheHeaders });
}
