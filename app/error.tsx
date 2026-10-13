"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="container-page grid min-h-[55vh] place-items-center py-14">
      <div className="max-w-lg text-center">
        <h1 className="text-3xl font-bold tracking-tight">
          তথ্য লোড করা যায়নি
        </h1>
        <p className="mt-3 leading-7 text-[#7a877b]">
          সাময়িকভাবে সার্ভারে সমস্যা হয়েছে। কিছুক্ষণ পরে আবার চেষ্টা করুন।
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <button type="button" className="btn-primary" onClick={() => reset()}>
            আবার চেষ্টা করুন
          </button>
          <Link href="/" className="btn-secondary">
            হোম পেজে ফিরে যান
          </Link>
        </div>
      </div>
    </section>
  );
}
