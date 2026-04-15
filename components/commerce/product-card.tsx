"use client";

import Image from "next/image";
import { Heart, ShoppingCart } from "lucide-react";
import type { Product } from "@/types/commerce";
import { useCommerceStore } from "@/store/use-commerce-store";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addToCart = useCommerceStore((state) => state.addToCart);
  const toggleWishlist = useCommerceStore((state) => state.toggleWishlist);
  const wishlisted = useCommerceStore((state) => state.isWishlisted(product.id));

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-background shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative aspect-4/5 overflow-hidden bg-surface">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, 25vw"
          className="object-cover transition duration-700 group-hover:scale-105"
        />
        <button
          type="button"
          aria-label="Toggle wishlist"
          onClick={() => toggleWishlist(product.id)}
          className="absolute right-4 top-4 rounded-full bg-background/90 p-2 text-text-primary shadow-sm transition hover:text-primary"
        >
          <Heart className={`h-4 w-4 ${wishlisted ? "fill-primary text-primary" : ""}`} />
        </button>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-[10px] uppercase tracking-[0.22em] text-text-muted">{product.category}</p>
        <h3 className="mt-3 font-heading text-xl text-text-primary">{product.name}</h3>
        <p className="mt-2 text-sm leading-6 text-text-muted">{product.description}</p>
        <div className="mt-6 flex items-center justify-between gap-4">
          <span className="font-heading text-xl text-primary">${product.price.toFixed(2)}</span>
          <button
            type="button"
            onClick={() =>
              addToCart({
                id: product.id,
                name: product.name,
                variant: product.category,
                price: product.price,
                quantity: 1,
                image: product.image,
              })
            }
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-background transition hover:bg-primary/90"
          >
            <ShoppingCart className="h-4 w-4" />
            Add to Cart
          </button>
        </div>
      </div>
    </article>
  );
}