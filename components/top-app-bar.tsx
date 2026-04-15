"use client";

import Link from "next/link";
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
  const cartCount = useCommerceStore((state) => state.cartItems.length);

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
          <nav className="hidden items-center gap-8 md:flex">
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
        ) : (
          <span className="hidden md:block text-xs uppercase tracking-[0.2em] text-text-muted">
            Premium electronics curated for modern living
          </span>
        )}

        <Link href="/shopping-cart" className="relative rounded-md p-2 text-primary transition hover:bg-surface">
          <ShoppingBag className="h-5 w-5" />
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-background">
            {cartCount}
          </span>
        </Link>
      </div>
    </header>
  );
}