import { Suspense } from "react";
import type { Metadata } from "next";
import AuthForm from "@/components/auth-form";

export const metadata: Metadata = {
  title: "সাইন আপ",
};

export default function SignUpPage() {
  return (
    <Suspense
      fallback={
        <div className="container-page py-20 text-center">লোড হচ্ছে…</div>
      }
    >
      <AuthForm mode="signup" />
    </Suspense>
  );
}
