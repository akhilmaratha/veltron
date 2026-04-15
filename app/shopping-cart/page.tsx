"use client";

import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import BottomNavBar from "@/components/bottom-nav-bar";
import Footer from "@/components/footer";
import CartSummary from "@/components/commerce/cart-summary";
import TopAppBar from "@/components/top-app-bar";
import { useCommerceStore } from "@/store/use-commerce-store";

export default function ShoppingCartPage() {
  const cartItems = useCommerceStore((state) => state.cartItems);
  const updateQuantity = useCommerceStore((state) => state.updateQuantity);
  const removeFromCart = useCommerceStore((state) => state.removeFromCart);

  return (
    <>
      <TopAppBar activeHref="/shopping-cart" />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <section>
            <p className="text-[10px] uppercase tracking-[0.24em] text-primary">Personal collection</p>
            <h1 className="mt-4 font-heading text-5xl text-text-primary">Your Selection</h1>
            <div className="mt-10 space-y-8">
              {cartItems.map((item) => (
                <article key={item.id} className="rounded-lg border border-border bg-background p-5 shadow-sm">
                  <div className="grid gap-5 sm:grid-cols-[220px_1fr]">
                    <div className="relative aspect-4/5 overflow-hidden rounded-md bg-surface">
                      <Image src={item.image} alt={item.name} fill sizes="(max-width: 768px) 100vw, 220px" className="object-cover" />
                    </div>
                    <div className="flex flex-col justify-between gap-6">
                      <div>
                        <h2 className="font-heading text-3xl text-text-primary">{item.name}</h2>
                        <p className="mt-2 text-sm uppercase tracking-[0.22em] text-text-muted">{item.variant}</p>
                        <p className="mt-4 text-2xl font-heading text-primary">${item.price.toFixed(2)}</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-4">
                        <div className="inline-flex items-center overflow-hidden rounded-md border border-border">
                          <button type="button" onClick={() => updateQuantity(item.id, item.quantity - 1)} className="flex h-10 w-10 items-center justify-center text-text-muted transition hover:bg-surface">
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="flex h-10 w-12 items-center justify-center text-sm font-semibold text-text-primary">{String(item.quantity).padStart(2, "0")}</span>
                          <button type="button" onClick={() => updateQuantity(item.id, item.quantity + 1)} className="flex h-10 w-10 items-center justify-center text-text-muted transition hover:bg-surface">
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        <button type="button" onClick={() => removeFromCart(item.id)} className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-danger">
                          <Trash2 className="h-4 w-4" />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}

              {cartItems.length === 0 ? (
                <div className="rounded-lg border border-border bg-surface p-8 text-center text-text-muted">
                  Your cart is empty.
                </div>
              ) : null}
            </div>
          </section>

          <div className="lg:sticky lg:top-24 lg:self-start">
            <CartSummary items={cartItems} />
          </div>
        </div>
      </main>
      <Footer />
      <BottomNavBar activeHref="/shopping-cart" />
    </>
  );
}