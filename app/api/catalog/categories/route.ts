import { NextResponse } from "next/server";
import { getCategories } from "@/lib/catalog";

export const dynamic = "force-dynamic";
const cacheHeaders = {
  "Cache-Control":
    "public, max-age=60, s-maxage=300, stale-while-revalidate=600",
};
export async function GET() {
  return NextResponse.json(
    { categories: await getCategories() },
    { headers: cacheHeaders },
  );
}
