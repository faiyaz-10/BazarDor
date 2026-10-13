"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { toastOnce } from "@/lib/toast";
import { authClient } from "@/lib/auth-client";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (session?.user.name) setName(session.user.name);
    if (!isPending && !session) {
      router.replace("/signin?required=1");
    }
  }, [isPending, session, router]);

  async function signOut() {
    try {
      const result = await authClient.signOut();
      if (result.error) {
        toastOnce("error", result.error.message || "সাইন আউট ব্যর্থ");
        return;
      }
      toastOnce("success", "সফলভাবে সাইন আউট হয়েছে");
      router.push("/");
      router.refresh();
    } catch {
      toastOnce("error", "সাইন আউট করতে সমস্যা হয়েছে");
    }
  }

  async function updateName(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanName = name.trim();
    if (cleanName.length < 2) {
      toastOnce("error", "নাম কমপক্ষে ২ অক্ষরের হতে হবে");
      return;
    }
    setBusy(true);
    try {
      const result = await authClient.updateUser({ name: cleanName });
      if (result.error) {
        toastOnce("error", result.error.message || "তথ্য আপডেট করা যায়নি");
        return;
      }
      toastOnce("success", "প্রোফাইলের তথ্য আপডেট হয়েছে");
      router.refresh();
    } catch {
      toastOnce("error", "তথ্য আপডেট করতে সমস্যা হয়েছে");
    } finally {
      setBusy(false);
    }
  }

  if (isPending || !session) {
    return (
      <section className="profile-page profile-page-loading">
        <div className="skeleton mx-auto h-64 max-w-3xl rounded-2xl" />
      </section>
    );
  }

  const user = session.user;
  return (
    <section className="profile-page">
      <div className="profile-top-placeholder" aria-hidden="true" />
      <div className="profile-heading">
        <h1>আমার প্রোফাইল</h1>
        <p>আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন।</p>
      </div>

      <div className="profile-summary-card">
        {user.image && (
          <Image
            className="profile-large-avatar"
            src={user.image}
            alt="প্রোফাইল ছবি"
            width={80}
            height={70}
            unoptimized
          />
        )}
        <div className="profile-summary-copy">
          <h2>{user.name || "ব্যবহারকারী"}</h2>
          <p>{user.email}</p>
        </div>
        <button type="button" onClick={signOut} className="profile-signout">
          <LogOut size={15} /> সাইন আউট
        </button>
      </div>

      <div className="profile-info-card">
        <h2>তথ্য</h2>
        <form onSubmit={updateName} className="profile-update-form">
          <label htmlFor="profile-name">নাম</label>
          <input
            id="profile-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="profile-name-input"
            autoComplete="name"
            required
            minLength={2}
            maxLength={80}
          />
          <button
            type="submit"
            disabled={busy}
            className="profile-update-button"
          >
            {busy ? "আপডেট হচ্ছে…" : "আপডেট"}
          </button>
        </form>
      </div>
    </section>
  );
}
