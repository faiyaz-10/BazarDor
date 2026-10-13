import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CategoryContent from "@/components/category-content";
import { lookupCategory } from "@/lib/catalog";
export const dynamic = "force-dynamic";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const lookup = await lookupCategory(slug);
  if (lookup.status === "not-found") notFound();
  return { title: `${slug} ক্যাটাগরি` };
}
export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const lookup = await lookupCategory(slug);
  if (lookup.status === "not-found") notFound();
  if (lookup.status === "unavailable")
    throw new Error("Category data is temporarily unavailable");
  return <CategoryContent slug={lookup.category.slug} />;
}
