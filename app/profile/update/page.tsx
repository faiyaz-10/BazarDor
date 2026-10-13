"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, UserRound } from "lucide-react";
import { toastOnce } from "@/lib/toast";
import { authClient } from "@/lib/auth-client";
export default function UpdateProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    if (session?.user.name) setName(session.user.name);
    if (!isPending && !session) {
      router.replace("/signin?required=1");
    }
  }, [session, isPending, router]);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleaned = name.trim();
    if (cleaned.length < 2) {
      toastOnce("error", "নাম কমপক্ষে ২ অক্ষরের হতে হবে");
      return;
    }
    setBusy(true);
    try {
      const result = await authClient.updateUser({ name: cleaned });
      if (result.error) {
        toastOnce("error", result.error.message || "তথ্য আপডেট করা যায়নি");
        return;
      }
      toastOnce("success", "প্রোফাইলের তথ্য আপডেট হয়েছে");
      router.push("/profile");
      router.refresh();
    } catch {
      toastOnce("error", "তথ্য আপডেট করতে সমস্যা হয়েছে");
    } finally {
      setBusy(false);
    }
  }
  if (isPending || !session)
    return (
      <div className="container-page py-16">
        <div className="skeleton mx-auto h-80 max-w-xl rounded-3xl" />
      </div>
    );
  return (
    <section className="container-page py-10 sm:py-14">
      <div className="mx-auto max-w-xl">
        <Link
          href="/profile"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#718075]"
        >
          <ArrowLeft size={16} /> প্রোফাইলে ফিরে যান
        </Link>
        <div className="card-surface mt-5 p-6 sm:p-9">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#eaf1df] text-[#396443]">
            <UserRound size={22} />
          </div>
          <h1 className="mt-5 text-3xl font-bold">তথ্য আপডেট করুন</h1>
          <p className="mt-2 text-sm leading-6 text-[#7a877b]">
            আপনার প্রোফাইলে প্রদর্শিত নাম পরিবর্তন করতে নিচের ফর্মটি পূরণ করুন।
          </p>
          <form onSubmit={submit} className="mt-7 space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold">নাম</span>
              <input
                className="input-field"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="আপনার নাম লিখুন"
                required
                minLength={2}
                maxLength={80}
              />
            </label>
            <button
              type="submit"
              disabled={busy}
              className="btn-primary w-full disabled:opacity-60"
            >
              <Save size={17} />
              {busy ? "আপডেট হচ্ছে…" : "তথ্য আপডেট করুন"}
            </button>
          </form>
          <p className="mt-4 text-xs leading-5 text-[#8a9589]">
            নাম পরিবর্তনের জন্য Better Auth-এর updateUser ফাংশন ব্যবহার করা
            হয়েছে।
          </p>
        </div>
      </div>
    </section>
  );
}
