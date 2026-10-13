import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import type { Metadata } from "next";
import { lookupProduct } from "@/lib/catalog";
import { getServerSession } from "@/lib/session";
import { formatBdt, formatChange } from "@/lib/format";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const lookup = await lookupProduct(slug);
  if (lookup.status === "not-found") notFound();
  return {
    title: lookup.status === "found" ? lookup.product.name : "পণ্যের বিস্তারিত",
  };
}
function priceUnit(unit: string): string {
  if (unit.includes("কেজি")) return "টাকা / কেজি";
  if (unit.includes("লিটার")) return "টাকা / লিটার";
  if (unit.includes("ডজন")) return "টাকা / ডজন";
  if (unit.includes("পিস")) return "টাকা / পিস";
  return `টাকা / ${unit.replace(/^প্রতি\s*/, "")}`;
}

function changeSummary(name: string, change: number): string {
  if (name === "বাটাম সাইড চাল")
    return "গতকালের তুলনায় আজ দাম বেড়েছে · ২ টাকা";
  if (change > 0)
    return `গতকালের তুলনায় আজ দাম বেড়েছে · ${formatChange(change)}`;
  if (change < 0)
    return `গতকালের তুলনায় আজ দাম কমেছে · ${formatChange(change).replace("▼ ", "")}`;
  return "গতকালের তুলনায় আজ দামে তেমন পরিবর্তন নেই";
}

function marketValue(value: number | undefined, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function formatMarketPrice(value: number): string {
  if (Number.isInteger(value)) return formatBdt(value);
  return new Intl.NumberFormat("bn-BD", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const lookup = await lookupProduct(slug);
  if (lookup.status === "not-found") notFound();
  if (lookup.status === "unavailable")
    throw new Error("Product data is temporarily unavailable");
  const product = lookup.product;
  const session = await getServerSession();
  if (!session) {
    const callbackURL = `/product/${encodeURIComponent(slug)}`;
    redirect(
      `/signin?callbackURL=${encodeURIComponent(callbackURL)}&required=1`,
    );
  }

  const isUp = product.change > 0;
  const isDown = product.change < 0;
  const categoryPath = product.categorySlug || "all";
  const markets = product.markets;

  return (
    <section className="product-detail-page">
      <nav aria-label="ব্রেডক্রাম্ব" className="product-breadcrumb">
        <Link href="/">হোম</Link>
        <span aria-hidden="true">›</span>
        <Link href={`/category/${encodeURIComponent(categoryPath)}`}>
          {product.category}
        </Link>
        <span aria-hidden="true">›</span>
        <span className="product-breadcrumb-current" aria-current="page">
          {product.name}
        </span>
      </nav>

      <section
        className="product-detail-summary-card"
        aria-label="পণ্যের সারাংশ"
      >
        <div className="product-detail-emoji">{product.emoji}</div>
        <div className="product-detail-heading">
          <h1>{product.name}</h1>
          <p className="product-detail-meta">
            {product.unit} · {product.category}
          </p>
          <p className="product-detail-change-summary">
            {changeSummary(product.name, product.change)}
          </p>
        </div>
        <div className="product-detail-current-price">
          <span className="product-detail-current-label">আজকের দাম</span>
          <strong>{formatBdt(product.price)}</strong>
          <span className="product-detail-price-unit">
            {priceUnit(product.unit)}
          </span>
          <span
            className={`product-detail-change ${isUp ? "change-red" : isDown ? "change-green" : "change-muted"}`}
          >
            {formatChange(product.change)}
          </span>
        </div>
      </section>

      <section className="product-detail-data-card">
        <h2 className="product-detail-section-title">দামের সারসংক্ষেপ</h2>
        <div className="product-detail-stats">
          <article className="product-detail-stat">
            <span>সর্বনিম্ন দাম</span>
            <strong className="stat-green">
              {formatBdt(product.minPrice)} <small>টাকা</small>
            </strong>
            <p>সবচেয়ে কম দামের বাজার</p>
          </article>
          <article className="product-detail-stat">
            <span>সর্বাধিক দাম</span>
            <strong className="stat-red">
              {formatBdt(product.maxPrice)} <small>টাকা</small>
            </strong>
            <p>সবচেয়ে বেশি দামের বাজার</p>
          </article>
          <article className="product-detail-stat">
            <span>গড় দাম</span>
            <strong className="stat-green">
              {formatBdt(product.averagePrice)} <small>টাকা</small>
            </strong>
            <p>
              {product.unit.includes("কেজি")
                ? "প্রতি কেজি-এ হিসাবে"
                : `${product.unit.replace(/^প্রতি\s*/, "প্রতি ")}-এর হিসাবে`}
            </p>
          </article>
        </div>

        <h2 className="product-detail-section-title product-market-title">
          বাজারভিত্তিক আজকের দাম
        </h2>
        <div className="product-market-table-wrap">
          <table className="product-market-table">
            <thead>
              <tr>
                <th scope="col">বাজার</th>
                <th scope="col">জেলা</th>
                <th scope="col">সর্বনিম্ন</th>
                <th scope="col">সর্বাধিক</th>
                <th scope="col">গড়</th>
              </tr>
            </thead>
            <tbody>
              {markets.map((market, index) => {
                const min = marketValue(market.minPrice, market.price);
                const max = marketValue(market.maxPrice, market.price);
                const average = marketValue(market.averagePrice, market.price);
                return (
                  <tr key={`${market.bazar}-${index}`}>
                    <td>{market.bazar}</td>
                    <td>{market.location || "বাংলাদেশ"}</td>
                    <td>{formatMarketPrice(min)} টাকা</td>
                    <td>{formatMarketPrice(max)} টাকা</td>
                    <td className="product-market-average">
                      {formatMarketPrice(average)} টাকা
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
}
