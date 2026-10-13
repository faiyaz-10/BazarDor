import { Suspense } from "react";
import type { Metadata } from "next";
import AuthForm from "@/components/auth-form";
export const metadata: Metadata = { title: "সাইন ইন" };
export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="container-page py-20 text-center">লোড হচ্ছে…</div>
      }
    >
      <AuthForm mode="signin" />
    </Suspense>
  );
}
