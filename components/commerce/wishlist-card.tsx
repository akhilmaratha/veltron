"use client";

import Image from "next/image";
import { X } from "lucide-react";
import type { WishlistItemData } from "@/types/commerce";
import { useCommerceStore } from "@/store/use-commerce-store";

interface WishlistCardProps {
  item: WishlistItemData;
}

export default function WishlistCard({ item }: WishlistCardProps) {
  const addToCart = useCommerceStore((state) => state.addToCart);
  const toggleWishlist = useCommerceStore((state) => state.toggleWishlist);

  return (
    <article className="group rounded-lg border border-border bg-background p-5 shadow-sm">
      <div className="relative aspect-4/5 overflow-hidden rounded-md bg-surface">
        <Image src={item.image} alt={item.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition duration-700 group-hover:scale-105" />
        <button
          type="button"
          aria-label="Remove from wishlist"
          onClick={() => toggleWishlist(item.id)}
          className="absolute right-3 top-3 rounded-full bg-background/90 p-2 text-text-primary shadow-sm transition hover:text-danger"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <p className="mt-5 text-[10px] uppercase tracking-[0.22em] text-text-muted">{item.category}</p>
      <h3 className="mt-2 font-heading text-2xl text-text-primary">{item.title}</h3>
      <p className="mt-2 text-lg text-primary">${item.price.toFixed(2)}</p>
      <button
        type="button"
        onClick={() =>
          addToCart({
            id: item.id,
            name: item.title,
            variant: item.category,
            price: item.price,
            quantity: 1,
            image: item.image,
          })
        }
        className="mt-5 w-full rounded-md bg-primary px-5 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-background transition hover:bg-primary/90"
      >
        Move to Cart
      </button>
    </article>
  );
}