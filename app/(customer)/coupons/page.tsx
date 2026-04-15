"use client";

import { useState } from "react";
import BottomNavBar from "@/components/bottom-nav-bar";
import Footer from "@/components/footer";
import CouponCard from "@/components/commerce/coupon-card";
import TopAppBar from "@/components/top-app-bar";
import { coupons } from "@/lib/commerce-data";

const expiredRewards = [
  { id: "expired-1", title: "Botanical Series 19%", subtitle: "September 2024", note: "Expired" },
  { id: "expired-2", title: "Solstice Celebration", subtitle: "Winter 2023", note: "Expired" },
  { id: "expired-3", title: "Loyalty Credit $25", subtitle: "Annual Reward", note: "Expired" },
] as const;

export default function CouponsPage() {
  const [section, setSection] = useState<"active" | "expired">("active");

  return (
    <>
      <TopAppBar activeHref="/coupons" />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
        <section className="mb-12">
          <p className="text-[10px] uppercase tracking-[0.24em] text-primary">Rewards archive</p>
          <h1 className="mt-4 font-heading text-5xl text-text-primary">Your Rewards Archive</h1>
          <p className="mt-4 max-w-2xl text-lg italic text-text-muted">
            A curated selection of seasonal invitations and archive benefits exclusively for our patrons.
          </p>
        </section>

        <div className="flex gap-3 border-b border-border pb-6 text-xs uppercase tracking-[0.24em] text-text-muted">
          <button type="button" onClick={() => setSection("active")} className={section === "active" ? "text-primary" : ""}>
            Active Curation
          </button>
          <button type="button" onClick={() => setSection("expired")} className={section === "expired" ? "text-primary" : ""}>
            Expired Artifacts
          </button>
        </div>

        {section === "active" ? (
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {coupons.map((coupon) => (
              <CouponCard key={coupon.id} coupon={coupon} />
            ))}
          </div>
        ) : (
          <div className="mt-10 grid gap-6">
            {expiredRewards.map((item) => (
              <div key={item.id} className="rounded-lg border border-border bg-background p-6 shadow-sm">
                <p className="text-[10px] uppercase tracking-[0.22em] text-text-muted">{item.subtitle}</p>
                <h2 className="mt-3 font-heading text-2xl text-text-primary">{item.title}</h2>
                <p className="mt-2 text-xs uppercase tracking-[0.22em] text-text-muted">{item.note}</p>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
      <BottomNavBar activeHref="/coupons" />
    </>
  );
}