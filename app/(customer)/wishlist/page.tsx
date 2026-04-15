"use client";

import BottomNavBar from "@/components/bottom-nav-bar";
import Footer from "@/components/footer";
import TopAppBar from "@/components/top-app-bar";
import WishlistCard from "@/components/commerce/wishlist-card";
import { wishlistItems } from "@/lib/commerce-data";
import { useCommerceStore } from "@/store/use-commerce-store";

export default function WishlistPage() {
  const wishlistIds = useCommerceStore((state) => state.wishlistIds);

  const visibleItems = wishlistItems.filter((item) => wishlistIds.includes(item.id));

  return (
    <>
      <TopAppBar activeHref="/wishlist" />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
        <section className="mb-12">
          <p className="text-[10px] uppercase tracking-[0.24em] text-primary">Personal collection</p>
          <h1 className="mt-4 font-heading text-5xl text-text-primary">Your Wishlist</h1>
          <p className="mt-4 max-w-2xl text-lg italic text-text-muted">
            A curated selection of objects currently in your consideration.
          </p>
        </section>

        {visibleItems.length > 0 ? (
          <div className="grid gap-6 lg:grid-cols-3">
            {visibleItems.map((item) => (
              <WishlistCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-border bg-surface p-10 text-center text-text-muted">
            Your shelf is waiting.
          </div>
        )}
      </main>
      <Footer />
      <BottomNavBar activeHref="/wishlist" />
    </>
  );
}