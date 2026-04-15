"use client";

import Image from "next/image";
import { Copy } from "lucide-react";
import type { CouponData } from "@/types/commerce";

interface CouponCardProps {
  coupon: CouponData;
}

export default function CouponCard({ coupon }: CouponCardProps) {
  const handleCopy = async () => {
    await navigator.clipboard.writeText(coupon.code);
  };

  return (
    <article className="overflow-hidden rounded-lg border border-border bg-background shadow-sm">
      <div className="relative h-56 bg-surface">
        <Image src={coupon.image} alt={coupon.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
      </div>
      <div className="p-6">
        <p className="text-[10px] uppercase tracking-[0.22em] text-text-muted">Limited Edition</p>
        <h3 className="mt-2 font-heading text-2xl text-text-primary">{coupon.title}</h3>
        <p className="mt-3 text-sm leading-6 text-text-muted">{coupon.description}</p>
        <div className="mt-6 flex items-center gap-3 rounded-md border border-border bg-surface px-4 py-3">
          <span className="font-mono text-sm font-semibold tracking-[0.28em] text-primary">{coupon.code}</span>
          <button
            type="button"
            onClick={handleCopy}
            className="ml-auto inline-flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-text-primary transition hover:border-primary hover:text-primary"
          >
            <Copy className="h-4 w-4" />
            Copy
          </button>
        </div>
        <p className="mt-4 text-xs uppercase tracking-[0.22em] text-text-muted">{coupon.expiresAt}</p>
      </div>
    </article>
  );
}