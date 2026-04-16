"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { Menu, ShoppingBag } from "lucide-react";
import { useCommerceStore } from "@/store/use-commerce-store";
import { topNavigationItems } from "@/lib/commerce-data";

interface TopAppBarProps {
  activeHref?: string;
  title?: string;
  showNavigation?: boolean;
}

export default function TopAppBar({
  activeHref = "/",
  title = "Veltron",
  showNavigation = true,
}: TopAppBarProps) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [searchQuery, setSearchQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const cartCount = useCommerceStore((state) => state.cartItems.length);
  const isAuthenticated = status === "authenticated";
  const role = session?.user?.role === "admin" ? "admin" : "customer";
  const dashboardHref = role === "admin" ? "/admin" : "/user-profile";
  const profileHref = "/user-profile";

  const onSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const q = searchQuery.trim();
    router.push(q ? `/products?q=${encodeURIComponent(q)}` : "/products");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-4">
          <button aria-label="Open menu" className="rounded-md p-2 text-text-primary transition hover:bg-surface">
            <Menu className="h-5 w-5" />
          </button>
          <Link href="/" className="font-heading text-lg tracking-[0.18em] text-text-primary uppercase">
            {title}
          </Link>
        </div>

        {showNavigation ? (
          <div className="hidden items-center gap-6 md:flex">
            <form onSubmit={onSearch} className="flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-1.5">
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search products"
                className="w-44 bg-transparent text-xs text-text-primary outline-none placeholder:text-text-muted"
                aria-label="Search products"
              />
              <button type="submit" className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
                Search
              </button>
            </form>
            <nav className="flex items-center gap-6">
            {topNavigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-xs uppercase tracking-[0.2em] transition hover:text-primary ${
                  activeHref === item.href ? "text-primary" : "text-text-muted"
                }`}
              >
                {item.label}
              </Link>
            ))}
            </nav>
          </div>
        ) : (
          <span className="hidden md:block text-xs uppercase tracking-[0.2em] text-text-muted">
            Premium electronics curated for modern living
          </span>
        )}

        <div className="flex items-center gap-2">
          <div className="relative hidden md:block">
            {isAuthenticated ? (
              <>
                <button
                  type="button"
                  onClick={() => setMenuOpen((current) => !current)}
                  className="rounded-md border border-border bg-surface px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-text-primary transition hover:border-primary"
                >
                  Account
                </button>
                {menuOpen ? (
                  <div className="absolute right-0 top-12 z-50 w-48 overflow-hidden rounded-md border border-border bg-background shadow-md">
                    <Link
                      href={profileHref}
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-3 text-xs uppercase tracking-[0.18em] text-text-primary transition hover:bg-surface"
                    >
                      Profile
                    </Link>
                    <Link
                      href={dashboardHref}
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-3 text-xs uppercase tracking-[0.18em] text-text-primary transition hover:bg-surface"
                    >
                      Dashboard
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        void signOut({ callbackUrl: "/" });
                      }}
                      className="block w-full border-t border-border px-4 py-3 text-left text-xs uppercase tracking-[0.18em] text-danger transition hover:bg-surface"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : null}
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="rounded-md border border-border bg-surface px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-text-primary transition hover:border-primary"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="rounded-md bg-primary px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-background transition hover:bg-primary/90"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          <Link href="/shopping-cart" className="relative rounded-md p-2 text-primary transition hover:bg-surface">
            <ShoppingBag className="h-5 w-5" />
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-background">
              {cartCount}
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}