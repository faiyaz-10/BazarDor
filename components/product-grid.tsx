import ProductCard from "@/components/product-card";
import type { Product } from "@/lib/types";

export function ProductSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="product-grid" aria-label="পণ্যের তথ্য লোড হচ্ছে">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="product-skeleton-card">
          <div className="skeleton-product-head">
            <div className="skeleton skeleton-icon" />
            <div className="skeleton-lines">
              <div className="skeleton skeleton-name" />
              <div className="skeleton skeleton-unit" />
            </div>
          </div>
          <div className="skeleton-price-row">
            <div className="skeleton-lines">
              <div className="skeleton skeleton-label" />
              <div className="skeleton skeleton-value" />
            </div>
            <div className="skeleton skeleton-badge" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard key={`${product.id}-${product.slug}`} product={product} />
      ))}
    </div>
  );
}
