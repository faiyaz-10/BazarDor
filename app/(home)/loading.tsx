import { ProductSkeleton } from "@/components/product-grid";

export default function Loading() {
  return (
    <div
      className="container-page py-8 sm:py-10"
      aria-label="পৃষ্ঠাটি লোড হচ্ছে"
      aria-busy="true"
    >
      <section className="skeleton mb-8 min-h-56 rounded-3xl sm:min-h-64" />
      <section className="mb-9">
        <div className="skeleton mb-5 h-7 w-52 rounded-lg" />
        <ProductSkeleton count={6} />
      </section>
      <section className="mb-9">
        <div className="skeleton mb-5 h-7 w-52 rounded-lg" />
        <ProductSkeleton count={6} />
      </section>
      <section>
        <div className="skeleton mb-3 h-7 w-40 rounded-lg" />
        <div className="skeleton mb-5 h-4 w-64 rounded-lg" />
        <ProductSkeleton count={9} />
      </section>
    </div>
  );
}
