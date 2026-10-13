import Link from "next/link";
import { House } from "lucide-react";
export default function NotFound() {
  return (
    <section className="container-page grid min-h-[55vh] place-items-center py-14">
      <div className="max-w-lg text-center">
        <div
          className="mx-auto grid h-24 w-24 place-items-center rounded-[28px] bg-[#e8efdd] text-5xl"
          aria-hidden="true"
        >
          🥦
        </div>
        <p className="mt-6 text-sm font-bold tracking-[.18em] text-[#73925d]">
          404 · পৃষ্ঠা পাওয়া যায়নি
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
          দুঃখিত! পৃষ্ঠাটি খুঁজে পাওয়া যায়নি
        </h1>
        <p className="mt-3 leading-7 text-[#7a877b]">
          আপনি যে পৃষ্ঠাটি খুঁজছেন সেটি খুঁজে পাওয়া যায়নি। চলুন আবার বাজারে
          ফিরে যাই।
        </p>
        <Link href="/" className="btn-primary mt-7">
          <House size={17} /> হোম পেজে ফিরে যান
        </Link>
      </div>
    </section>
  );
}
