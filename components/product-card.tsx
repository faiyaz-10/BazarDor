import Link from "next/link";
import type { Product } from "@/lib/types";
import { formatBdt, formatChange } from "@/lib/format";

export default function ProductCard({ product }: { product: Product }) {
  const changeClass =
    product.change > 0
      ? "change-badge change-up"
      : product.change < 0
        ? "change-badge change-down"
        : "change-badge change-flat";

  return (
    <Link
      href={`/product/${encodeURIComponent(product.slug || product.id)}`}
      className="product-card"
      aria-label={`${product.name} এর বিস্তারিত দাম দেখুন`}
    >
      <div className="product-card-top">
        <span className="product-emoji" role="img" aria-label={product.name}>
          {product.emoji}
        </span>
        <span className="product-name-wrap">
          <span className="product-name">{product.name}</span>
          <span className="product-unit">{product.unit}</span>
        </span>
      </div>
      <div className="product-price-row">
        <div className="product-price-copy">
          <span className="today-label">আজকের দাম</span>
          <span className="product-price">
            {formatBdt(product.price)} <span>টাকা</span>
          </span>
        </div>
        <span className={changeClass}>{formatChange(product.change)}</span>
      </div>
    </Link>
  );
}
