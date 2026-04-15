import Link from "next/link";

export default function CheckoutCancelPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col items-center justify-center px-6 py-20 text-center">
      <p className="text-[10px] uppercase tracking-[0.24em] text-warning">Payment canceled</p>
      <h1 className="mt-4 font-heading text-5xl text-text-primary">Checkout Paused</h1>
      <p className="mt-4 max-w-xl text-text-muted">
        Your checkout session was canceled. No charges were made. You can review your cart and try again.
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <Link
          href="/checkout"
          className="rounded-md bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-background transition hover:bg-primary/90"
        >
          Return to Checkout
        </Link>
        <Link
          href="/shopping-cart"
          className="rounded-md border border-border bg-background px-6 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-text-primary transition hover:border-primary hover:text-primary"
        >
          Back to Cart
        </Link>
      </div>
    </main>
  );
}