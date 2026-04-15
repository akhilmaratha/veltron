"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import type { CartItemData } from "@/types/commerce";

interface CartSummaryProps {
  items: CartItemData[];
  title?: string;
  showCheckoutButton?: boolean;
  checkoutLabel?: string;
  onCheckout?: () => void;
  isCheckoutLoading?: boolean;
  checkoutError?: string | null;
}

export default function CartSummary({
  items,
  title = "Order Summary",
  showCheckoutButton = true,
  checkoutLabel = "Proceed to Checkout",
  onCheckout,
  isCheckoutLoading = false,
  checkoutError = null,
}: CartSummaryProps) {
  const router = useRouter();
  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
  const shipping = subtotal > 300 ? 0 : 12;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleCheckout = () => {
    if (onCheckout) {
      onCheckout();
      return;
    }

    router.push("/checkout");
  };

  return (
    <aside className="rounded-lg bg-surface p-6 md:p-8">
      <h2 className="font-heading text-2xl text-text-primary">{title}</h2>
      <div className="mt-8 space-y-6">
        {items.length === 0 ? (
          <p className="rounded-md border border-border bg-background px-4 py-3 text-sm text-text-muted">
            Your cart is empty.
          </p>
        ) : (
          items.map((item) => (
            <div key={item.id} className="flex gap-4">
              <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded bg-background">
                <Image src={item.image} alt={item.name} fill sizes="80px" className="object-cover" />
              </div>
              <div className="flex flex-1 flex-col justify-between py-1">
                <div>
                  <p className="text-sm font-semibold text-text-primary">{item.name}</p>
                  <p className="text-xs text-text-muted">{item.variant}</p>
                </div>
                <p className="font-heading text-lg text-text-primary">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="mt-8 space-y-3 border-t border-border pt-6 text-sm">
        <div className="flex items-center justify-between text-text-muted">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between text-text-muted">
          <span>Shipping</span>
          <span>{shipping === 0 ? "Complimentary" : `$${shipping.toFixed(2)}`}</span>
        </div>
        <div className="flex items-center justify-between text-text-muted">
          <span>Estimated Tax</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between border-t border-border pt-4 text-lg text-text-primary">
          <span className="font-heading">Total</span>
          <span className="font-heading">${total.toFixed(2)}</span>
        </div>
      </div>
      {checkoutError ? (
        <p className="mt-4 rounded-md border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">
          {checkoutError}
        </p>
      ) : null}
      {showCheckoutButton ? (
        <button
          type="button"
          onClick={handleCheckout}
          disabled={isCheckoutLoading || items.length === 0}
          className="mt-8 w-full rounded-md bg-primary px-5 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-background transition hover:bg-primary/90"
        >
          {isCheckoutLoading ? "Processing..." : checkoutLabel}
        </button>
      ) : null}
    </aside>
  );
}