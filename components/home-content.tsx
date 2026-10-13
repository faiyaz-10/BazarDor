"use client";

import { useEffect, useMemo, useState } from "react";
import { toastOnce } from "@/lib/toast";
import type { Product } from "@/lib/types";
import ProductGrid, { ProductSkeleton } from "@/components/product-grid";
import { formatBdt } from "@/lib/format";

export default function HomeContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    fetch("/api/catalog/products")
      .then(async (response) => {
        if (!response.ok) throw new Error("পণ্যের তথ্য লোড করা যায়নি");
        return response.json() as Promise<{ products: Product[] }>;
      })
      .then((data) => {
        if (alive) setProducts(data.products || []);
      })
      .catch(() => {
        if (alive) toastOnce("error", "পণ্যের তথ্য আনতে সমস্যা হয়েছে");
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  const risers = useMemo(
    () =>
      products
        .filter((p) => p.change > 0)
        .sort((a, b) => b.change - a.change)
        .slice(0, 6),
    [products],
  );
  const fallers = useMemo(
    () =>
      products
        .filter((p) => p.change < 0)
        .sort((a, b) => a.change - b.change)
        .slice(0, 6),
    [products],
  );

  return (
    <div className="container-page home-sections">
      <section className="price-section">
        <h2 className="price-section-title">
          <span className="title-arrow up">▲</span> আজ দাম বেড়েছে
        </h2>
        {loading ? (
          <ProductSkeleton count={6} />
        ) : risers.length ? (
          <ProductGrid products={risers} />
        ) : (
          <p className="empty-prices">
            এ মুহূর্তে দাম বাড়ার তথ্য পাওয়া যায়নি।
          </p>
        )}
      </section>

      <section className="price-section">
        <h2 className="price-section-title">
          <span className="title-arrow down">▼</span> আজ দাম কমেছে
        </h2>
        {loading ? (
          <ProductSkeleton count={6} />
        ) : fallers.length ? (
          <ProductGrid products={fallers} />
        ) : (
          <p className="empty-prices">
            এ মুহূর্তে দাম কমার তথ্য পাওয়া যায়নি।
          </p>
        )}
      </section>

      <section id="সব-পণ্য" className="all-products-section">
        <div className="all-products-heading">
          <div>
            <h2 className="price-section-title">সব পণ্য</h2>
            <p className="section-subtitle">
              ছোট ছোট পণ্যের বাজারদর একসাথে দেখুন
            </p>
          </div>
          {!loading && (
            <span className="product-count">
              {formatBdt(products.length)}টি পণ্য
            </span>
          )}
        </div>
        {loading ? (
          <ProductSkeleton count={12} />
        ) : products.length ? (
          <ProductGrid products={products} />
        ) : (
          <div className="empty-prices">
            পণ্যের তথ্য পাওয়া যায়নি। কিছুক্ষণ পরে আবার চেষ্টা করুন।
          </div>
        )}
      </section>
    </div>
  );
}
