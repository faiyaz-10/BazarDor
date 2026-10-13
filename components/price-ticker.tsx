"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/lib/types";
import { formatBdt, formatChange } from "@/lib/format";

const defaultItems: Pick<
  Product,
  "id" | "name" | "emoji" | "price" | "unit" | "change"
>[] = [
  {
    id: "onion",
    name: "পেঁয়াজ",
    emoji: "🧅",
    price: 68,
    unit: "/কেজি",
    change: 2.1,
  },
  {
    id: "miniket",
    name: "মিনিকেট চাল",
    emoji: "🍚",
    price: 79,
    unit: "/কেজি",
    change: -2.3,
  },
  {
    id: "potato",
    name: "আলু",
    emoji: "🥔",
    price: 35,
    unit: "/কেজি",
    change: -4.5,
  },
  {
    id: "egg",
    name: "ফার্মের ডিম",
    emoji: "🥚",
    price: 150,
    unit: "/ডজন",
    change: 1.1,
  },
  {
    id: "eggplant",
    name: "বেগুন",
    emoji: "🍆",
    price: 44,
    unit: "/কেজি",
    change: 0.8,
  },
];

function compactUnit(unit: string | undefined): string {
  if (!unit) return "/কেজি";
  if (unit.startsWith("/")) return unit;
  const normalized = unit.trim();
  if (normalized.includes("কেজি")) return "/কেজি";
  if (normalized.includes("লিটার")) return "/লিটার";
  if (normalized.includes("ডজন")) return "/ডজন";
  if (normalized.includes("পিস")) return "/পিস";
  return `/${normalized.replace(/^প্রতি\s*/, "")}`;
}

export default function PriceTicker() {
  const [products, setProducts] =
    useState<
      Pick<Product, "id" | "name" | "emoji" | "price" | "unit" | "change">[]
    >(defaultItems);
  useEffect(() => {
    let cancelled = false;
    fetch("/api/catalog/products")
      .then((r) =>
        r.ok ? (r.json() as Promise<{ products: Product[] }>) : null,
      )
      .then((data) => {
        if (!cancelled && data?.products?.length)
          setProducts(data.products.slice(0, 12));
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="price-ticker" aria-label="পণ্যের দামের চলমান আপডেট">
      <div className="ticker-track">
        {[0, 1].map((copy) => (
          <div key={copy} className="ticker-group" aria-hidden={copy === 1}>
            {products.map((product) => (
              <span key={`${copy}-${product.id}`} className="ticker-item">
                <span className="ticker-emoji">{product.emoji}</span>
                <span className="ticker-name">{product.name}</span>
                <span>
                  {formatBdt(product.price)} টাকা{compactUnit(product.unit)}
                </span>
                <span
                  className={
                    product.change > 0
                      ? "ticker-change change-red"
                      : product.change < 0
                        ? "ticker-change change-green"
                        : "ticker-change change-muted"
                  }
                >
                  {formatChange(product.change)}
                </span>
                <span className="ticker-separator">•</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
