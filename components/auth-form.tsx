"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Github } from "lucide-react";
import { toastOnce } from "@/lib/toast";
import { authClient } from "@/lib/auth-client";

type Mode = "signin" | "signup";

function safeCallbackURL(value: string | null): string {
  if (
    !value ||
    !value.startsWith("/") ||
    value.startsWith("//") ||
    value.includes("\\") ||
    /[\u0000-\u001f]/.test(value)
  ) {
    return "/";
  }
  try {
    const destination = new URL(value, "https://bazardor.invalid");
    if (destination.origin !== "https://bazardor.invalid") return "/";
    return `${destination.pathname}${destination.search}${destination.hash}`;
  } catch {
    return "/";
  }
}

function GoogleMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 48 48" className="social-google-mark">
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z"
        transform="translate(2 2) scale(.92)"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.76 7.18l7.73 6C44.42 37.98 46.98 31.92 46.98 24.55Z"
        transform="translate(1 1) scale(.92)"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59A14.4 14.4 0 0 1 9.75 24c0-1.59.27-3.13.76-4.59l-7.98-6.19A23.9 23.9 0 0 0 0 24c0 3.87.93 7.52 2.56 10.78l7.97-6.19Z"
        transform="translate(2 2) scale(.92)"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.91-5.8l-7.73-6c-2.14 1.44-4.89 2.3-8.18 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48Z"
        transform="translate(2 2) scale(.92)"
      />
    </svg>
  );
}

export default function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const callbackURL = safeCallbackURL(searchParams.get("callbackURL"));
  const queryString = searchParams.toString();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const signup = mode === "signup";

  useEffect(() => {
    if (signup) return;
    const params = new URLSearchParams(queryString);
    let handled = false;
    if (params.get("required") === "1") {
      toastOnce("error", "এই পৃষ্ঠাটি দেখতে প্রথমে সাইন ইন করুন।");
      params.delete("required");
      handled = true;
    }
    if (params.get("registered") === "1") {
      toastOnce("success", "এখন আপনার ইমেইল ও পাসওয়ার্ড দিয়ে সাইন ইন করুন");
      params.delete("registered");
      handled = true;
    }
    if (params.has("error") || params.has("error_description")) {
      toastOnce("error", "সাইন ইন সম্পন্ন করা যায়নি। আবার চেষ্টা করুন।");
      params.delete("error");
      params.delete("error_description");
      handled = true;
    }
    if (handled) {
      const remaining = params.toString();
      router.replace(remaining ? `${pathname}?${remaining}` : pathname, {
        scroll: false,
      });
    }
  }, [pathname, queryString, router, signup]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const cleanEmail = email.trim();
    if (signup && name.trim().length < 2) {
      toastOnce("error", "নাম কমপক্ষে ২ অক্ষরের হতে হবে");
      return;
    }
    if (!cleanEmail) {
      toastOnce("error", "ইমেইল লিখুন");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      toastOnce("error", "সঠিক ইমেইল ঠিকানা লিখুন");
      return;
    }
    if (!password) {
      toastOnce("error", "পাসওয়ার্ড লিখুন");
      return;
    }
    if (password.length < 8) {
      toastOnce("error", "পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে");
      return;
    }
    if (signup && password !== confirmPassword) {
      toastOnce("error", "দুটি পাসওয়ার্ড মিলছে না");
      return;
    }

    setBusy(true);
    try {
      if (signup) {
        const result = await authClient.signUp.email({
          name: name.trim(),
          email: cleanEmail,
          password,
          callbackURL: "/",
        });
        if (result.error) {
          toastOnce(
            "error",
            result.error.message || "অ্যাকাউন্ট তৈরি করা যায়নি",
          );
          return;
        }
        router.push("/signin?registered=1");
        router.refresh();
      } else {
        const result = await authClient.signIn.email({
          email: cleanEmail,
          password,
          callbackURL,
        });
        if (result.error) {
          toastOnce(
            "error",
            result.error.message || "ইমেইল বা পাসওয়ার্ড সঠিক নয়",
          );
          return;
        }
        toastOnce("success", "সফলভাবে সাইন ইন হয়েছে", 3200);
        router.push(callbackURL);
        router.refresh();
      }
    } catch {
      toastOnce(
        "error",
        "একটি সমস্যা হয়েছে। সার্ভার ও ডাটাবেস কনফিগারেশন পরীক্ষা করুন।",
      );
    } finally {
      setBusy(false);
    }
  }

  async function social(provider: "google" | "github") {
    if (busy) return;
    setBusy(true);
    try {
      const result = await authClient.signIn.social({
        provider,
        callbackURL,
        errorCallbackURL: `/signin?callbackURL=${encodeURIComponent(callbackURL)}`,
      });
      if (result.error)
        toastOnce(
          "error",
          result.error.message || "সোশ্যাল লগইন শুরু করা যায়নি",
        );
      else
        toastOnce(
          "success",
          `${provider === "google" ? "Google" : "GitHub"} লগইন শুরু হচ্ছে…`,
        );
    } catch {
      toastOnce(
        "error",
        `${provider === "google" ? "Google" : "GitHub"} লগইনের জন্য OAuth credentials কনফিগার করুন`,
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="auth-page">
      <div className="auth-page-heading">
        <h1>{signup ? "অ্যাকাউন্ট তৈরি করুন" : "সাইন ইন"}</h1>
        <p>
          {signup
            ? "বিনা খরচে সাইন আপ করে সব বিস্তারিত দাম দেখুন।"
            : "বিস্তারিত দাম, বাজার তুলনা ও প্রোফাইল দেখতে অ্যাকাউন্টে ঢুকুন।"}
        </p>
      </div>

      <div className="auth-card">
        <form onSubmit={submit} className="auth-fields" noValidate>
          {signup && (
            <label className="auth-field-label">
              <span>নাম</span>
              <input
                className="auth-input"
                autoComplete="name"
                placeholder="যেমন: রহিম উদ্দিন"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                minLength={2}
                maxLength={80}
              />
            </label>
          )}
          <label className="auth-field-label">
            <span>ইমেইল</span>
            <input
              className="auth-input"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>
          <label className="auth-field-label">
            <span>পাসওয়ার্ড</span>
            <input
              className="auth-input"
              type="password"
              autoComplete={signup ? "new-password" : "current-password"}
              placeholder="কমপক্ষে ৮ অক্ষর"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              minLength={8}
            />
          </label>
          {signup && (
            <label className="auth-field-label">
              <span>পাসওয়ার্ড নিশ্চিত করুন</span>
              <input
                className="auth-input"
                type="password"
                autoComplete="new-password"
                placeholder="আবার লিখুন"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                required
                minLength={8}
              />
            </label>
          )}
          <button type="submit" disabled={busy} className="auth-submit">
            {busy
              ? signup
                ? "অ্যাকাউন্ট তৈরি হচ্ছে…"
                : "সাইন ইন হচ্ছে…"
              : signup
                ? "অ্যাকাউন্ট তৈরি করুন"
                : "সাইন ইন"}
          </button>
        </form>

        <div className="auth-divider">
          <span />
          অথবা
          <span />
        </div>
        <div className="auth-social-row">
          <button
            type="button"
            disabled={busy}
            onClick={() => social("google")}
            className="auth-social-button"
          >
            <GoogleMark /> <span>Google দিয়ে চালিয়ে যান</span>
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => social("github")}
            className="auth-social-button"
          >
            <Github size={16} strokeWidth={2.5} />{" "}
            <span>GitHub দিয়ে চালিয়ে যান</span>
          </button>
        </div>
        <p className="auth-switch-text">
          {signup ? "অ্যাকাউন্ট আছে?" : "অ্যাকাউন্ট নেই?"}{" "}
          <Link href={signup ? "/signin" : "/signup"}>
            {signup ? "সাইন ইন করুন" : "সাইন আপ করুন"}
          </Link>
        </p>
      </div>
      <Link href="/" className="auth-home-link">
        <ArrowLeft size={14} /> হোম পেজে ফিরে যান
      </Link>
    </section>
  );
}
