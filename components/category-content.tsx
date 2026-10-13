"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ChevronDown, House } from "lucide-react";
import { toastOnce } from "@/lib/toast";
import type { Category, Product } from "@/lib/types";
import { formatBdt, numericValue } from "@/lib/format";
import ProductGrid, { ProductSkeleton } from "@/components/product-grid";

const categoryEmojis: Record<string, string> = {
  shobji: "🥬",
  chal: "🍚",
  dal: "🫘",
  machh: "🐟",
  mangsho: "🍗",
  tel: "🫗",
  moshla: "🌶️",
  "dim-o-dudh": "🥚",
  "nitto-ponno": "🧺",
};

const categoryNames: Record<string, string> = {
  shobji: "সবজি",
  chal: "চাল",
  dal: "ডাল",
  machh: "মাছ",
  mangsho: "মাংস",
  tel: "তেল",
  moshla: "মসলা",
  "dim-o-dudh": "ডিম-দুধ",
  "nitto-ponno": "নিত্যপণ্য",
  all: "সব পণ্য",
};

export default function CategoryContent({ slug }: { slug: string }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);
  const [sort, setSort] = useState("default");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setLoadFailed(false);
    setProducts([]);
    setSort("default");

    Promise.all([
      fetch(`/api/catalog/products?category=${encodeURIComponent(slug)}`).then(
        (response) => {
          if (!response.ok) throw new Error("products");
          return response.json() as Promise<{ products: Product[] }>;
        },
      ),
      fetch("/api/catalog/categories").then((response) => {
        if (!response.ok) throw new Error("categories");
        return response.json() as Promise<{ categories: Category[] }>;
      }),
    ])
      .then(([productData, categoryData]) => {
        if (!alive) return;
        setProducts(productData.products || []);
        setCategories(categoryData.categories || []);
      })
      .catch(() => {
        if (alive) {
          setLoadFailed(true);
          toastOnce("error", "ক্যাটাগরির তথ্য লোড করা যায়নি");
        }
      })
      .finally(() => {
        if (alive) setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [slug, retryCount]);

  const category = categories.find(
    (item) => item.slug === slug || item.name === slug,
  );
  const productCategory = products.find(
    (product) => product.categorySlug === slug || product.slug === slug,
  );
  const isAllProducts = slug === "all" || slug === "সব-পণ্য";
  const filtered = useMemo(() => {
    if (isAllProducts) return products;
    return products.filter(
      (product) =>
        product.categorySlug === slug || product.category === category?.name,
    );
  }, [products, slug, category, isAllProducts]);

  const sorted = useMemo(() => {
    const items = [...filtered];
    if (sort === "asc") {
      items.sort((a, b) => numericValue(a.price) - numericValue(b.price));
    } else if (sort === "desc") {
      items.sort((a, b) => numericValue(b.price) - numericValue(a.price));
    } else if (slug === "chal") {
      // Keep the default rice order aligned with the supplied category reference.
      const riceOrder = [
        "swarnomashuri-rice",
        "miniket-chal",
        "najirshail-chal",
        "basmati-rice",
      ];
      items.sort((a, b) => {
        const aIndex = riceOrder.indexOf(a.slug);
        const bIndex = riceOrder.indexOf(b.slug);
        return (
          (aIndex < 0 ? riceOrder.length : aIndex) -
          (bIndex < 0 ? riceOrder.length : bIndex)
        );
      });
    }
    return items;
  }, [filtered, sort, slug]);

  const title =
    category?.name ||
    productCategory?.category ||
    categoryNames[slug] ||
    "পণ্যের ক্যাটাগরি";
  const emoji =
    category?.emoji || categoryEmojis[slug] || productCategory?.emoji || "🧺";
  return (
    <section className="category-page" aria-labelledby="category-title">
      <header className="category-summary-card">
        <span className="category-summary-emoji" role="img" aria-label={title}>
          {emoji}
        </span>
        <div className="category-summary-copy">
          <h1 id="category-title">{title}</h1>
          <p>
            {loading
              ? "পণ্যের তথ্য লোড হচ্ছে…"
              : `${formatBdt(sorted.length)}টি পণ্যের আজকের দাম ও পরিবর্তন`}
          </p>
        </div>
      </header>

      <div className="category-sort-bar">
        <label className="category-sort-control">
          <span>সাজান</span>
          <span className="category-select-wrap">
            <select
              aria-label="দাম অনুসারে সাজান"
              value={sort}
              onChange={(event) => setSort(event.target.value)}
            >
              <option value="default">ডিফল্ট</option>
              <option value="asc">দাম: কম থেকে বেশি</option>
              <option value="desc">দাম: বেশি থেকে কম</option>
            </select>
            <ChevronDown size={14} aria-hidden="true" />
          </span>
        </label>
      </div>

      <p className="category-product-count" aria-live="polite">
        {loading
          ? "পণ্যের তালিকা প্রস্তুত হচ্ছে…"
          : `মোট ${formatBdt(sorted.length)}টি পণ্য দেখানো হচ্ছে`}
      </p>

      {loading ? (
        <ProductSkeleton count={4} />
      ) : loadFailed ? (
        <div className="category-empty-state" role="alert">
          <h2>পণ্যের তথ্য লোড করা যায়নি</h2>
          <p>সংযোগে সমস্যা হতে পারে। কিছুক্ষণ পরে আবার চেষ্টা করুন।</p>
          <button
            type="button"
            className="btn-primary"
            onClick={() => setRetryCount((count) => count + 1)}
          >
            আবার চেষ্টা করুন
          </button>
        </div>
      ) : sorted.length ? (
        <ProductGrid products={sorted} />
      ) : (
        <div className="category-empty-state">
          <div className="category-empty-icon">🧺</div>
          <h2>এই ক্যাটাগরিতে পণ্য নেই</h2>
          <p>অন্য ক্যাটাগরি দেখুন অথবা হোম পেজে ফিরে যান।</p>
          <Link href="/" className="btn-primary">
            <House size={17} /> হোম পেজে ফিরে যান
          </Link>
        </div>
      )}
    </section>
  );
}
