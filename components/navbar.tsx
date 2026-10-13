"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { LogOut, Menu, X, ChevronDown } from "lucide-react";
import { toastOnce } from "@/lib/toast";
import { authClient } from "@/lib/auth-client";
import { banglaDate } from "@/lib/format";
import logoIcon from "../assets/logo-icon.png";
import PriceTicker from "@/components/price-ticker";
import type { Category } from "@/lib/types";

const baseCategories: Category[] = [
  { name: "চাল", slug: "chal", emoji: "🍚" },
  { name: "ডাল", slug: "dal", emoji: "🫘" },
  { name: "তেল", slug: "tel", emoji: "🛢️" },
  { name: "সবজি", slug: "shobji", emoji: "🥬" },
  { name: "মাছ", slug: "machh", emoji: "🐟" },
  { name: "মাংস", slug: "mangsho", emoji: "🍗" },
  { name: "ডিম-দুধ", slug: "dim-o-dudh", emoji: "🥚" },
  { name: "মসলা", slug: "moshla", emoji: "🌶️" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>(baseCategories);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const { data: session } = authClient.useSession();

  useEffect(() => {
    const url = new URL(window.location.href);
    const signedInWith = url.searchParams.get("signedIn");
    if (
      signedInWith !== "email" &&
      signedInWith !== "google" &&
      signedInWith !== "github"
    ) {
      return;
    }

    url.searchParams.delete("signedIn");
    window.history.replaceState(
      window.history.state,
      "",
      `${url.pathname}${url.search}${url.hash}`,
    );
    toastOnce("success", "সফলভাবে সাইন ইন হয়েছে", 3200);
  }, [pathname]);

  useEffect(() => {
    if (!profileMenuOpen) return;
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      )
        setProfileMenuOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setProfileMenuOpen(false);
    };
    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [profileMenuOpen]);

  useEffect(() => {
    fetch("/api/catalog/categories")
      .then((r) =>
        r.ok ? (r.json() as Promise<{ categories: Category[] }>) : null,
      )
      .then((data) => {
        if (data?.categories?.length) {
          const preferredOrder = [
            "chal",
            "dal",
            "tel",
            "shobji",
            "machh",
            "mangsho",
            "dim-o-dudh",
            "moshla",
          ];
          const remote = data.categories
            .filter((c) => c.slug !== "all")
            .slice(0, 8);
          remote.sort((a, b) => {
            const ai = preferredOrder.indexOf(a.slug);
            const bi = preferredOrder.indexOf(b.slug);
            return (
              (ai < 0 ? preferredOrder.length : ai) -
              (bi < 0 ? preferredOrder.length : bi)
            );
          });
          setCategories(remote.length ? remote : baseCategories);
        }
      })
      .catch(() => undefined);
  }, []);

  async function signOut() {
    try {
      const result = await authClient.signOut();
      if (result.error) {
        toastOnce("error", result.error.message || "সাইন আউট করা যায়নি");
        return;
      }
      toastOnce("success", "সফলভাবে সাইন আউট হয়েছে");
      setMenuOpen(false);
      setProfileMenuOpen(false);
      router.push("/");
      router.refresh();
    } catch {
      toastOnce("error", "সাইন আউট করতে সমস্যা হয়েছে");
    }
  }

  const activeCategory = pathname.startsWith("/category/")
    ? pathname.split("/")[2]
    : "";
  const links = categories;

  return (
    <header className="site-header">
      <div className="container-page navbar-top">
        <Link href="/" className="brand-lockup" aria-label="বাজার দর হোম">
          <span className="brand-icon">
            <Image src={logoIcon} alt="" width={20} height={20} />
          </span>
          <span className="brand-copy">
            <strong>বাজার দর</strong>
            <small>{banglaDate()}</small>
          </span>
        </Link>

        <div className="auth-actions">
          {session ? (
            <div className="profile-menu-root" ref={profileMenuRef}>
              <button
                type="button"
                className="profile-menu-trigger"
                aria-label="প্রোফাইল মেনু খুলুন"
                aria-haspopup="menu"
                aria-expanded={profileMenuOpen}
                onClick={() => setProfileMenuOpen((open) => !open)}
              >
                {session.user.image && (
                  <Image
                    className="profile-avatar"
                    src={session.user.image}
                    alt=""
                    width={34}
                    height={36}
                    unoptimized
                  />
                )}
                <span className="profile-name">
                  {session.user.name?.trim() || "ব্যবহারকারী"}
                </span>
                <ChevronDown size={12} />
              </button>
              {profileMenuOpen && (
                <div
                  className="profile-dropdown"
                  role="menu"
                  aria-label="প্রোফাইল মেনু"
                >
                  <div className="profile-dropdown-identity">
                    <strong>
                      {session.user.name?.trim() || "ব্যবহারকারী"}
                    </strong>
                    <span>{session.user.email}</span>
                  </div>
                  <Link
                    href="/profile"
                    className="profile-dropdown-link"
                    role="menuitem"
                    onClick={() => setProfileMenuOpen(false)}
                  >
                    <span
                      className="profile-dropdown-person"
                      aria-hidden="true"
                    >
                      👤
                    </span>{" "}
                    আমার প্রোফাইল
                  </Link>
                  <button
                    type="button"
                    onClick={signOut}
                    className="profile-dropdown-signout"
                    role="menuitem"
                  >
                    <LogOut size={15} /> সাইন আউট
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/signin" className="signin-link">
                সাইন ইন
              </Link>
              <Link href="/signup" className="signup-link">
                সাইন আপ
              </Link>
            </>
          )}
        </div>

        <button
          className="mobile-menu-button"
          aria-label={menuOpen ? "মেনু বন্ধ করুন" : "মেনু খুলুন"}
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <div className="container-page category-nav-wrap">
        <nav aria-label="পণ্যের ক্যাটাগরি" className="category-nav">
          {links.map((category) => (
            <Link
              key={category.slug}
              href={`/category/${encodeURIComponent(category.slug)}`}
              className={`category-link ${activeCategory === category.slug ? "category-link-active" : ""}`}
            >
              <span>{category.emoji}</span>
              <span>{category.name}</span>
            </Link>
          ))}
        </nav>
      </div>

      {menuOpen && (
        <div className="mobile-menu container-page">
          <nav className="mobile-category-list">
            {links.map((category) => (
              <Link
                key={category.slug}
                onClick={() => setMenuOpen(false)}
                href={`/category/${encodeURIComponent(category.slug)}`}
              >
                {category.emoji} {category.name}
              </Link>
            ))}
          </nav>
          <div className="mobile-auth-actions">
            {session ? (
              <>
                <Link href="/profile" onClick={() => setMenuOpen(false)}>
                  আমার প্রোফাইল
                </Link>
                <button onClick={signOut}>সাইন আউট</button>
              </>
            ) : (
              <>
                <Link href="/signin" onClick={() => setMenuOpen(false)}>
                  সাইন ইন
                </Link>
                <Link href="/signup" onClick={() => setMenuOpen(false)}>
                  সাইন আপ
                </Link>
              </>
            )}
          </div>
        </div>
      )}

      <PriceTicker />
    </header>
  );
}
