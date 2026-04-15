import Link from "next/link";

interface CheckoutSuccessPageProps {
  searchParams: Promise<{
    record_id?: string;
    payment_id?: string;
  }>;
}

export default async function CheckoutSuccessPage({ searchParams }: CheckoutSuccessPageProps) {
  const params = await searchParams;
  const recordId = params.record_id;
  const paymentId = params.payment_id;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col items-center justify-center px-6 py-20 text-center">
      <p className="text-[10px] uppercase tracking-[0.24em] text-success">Payment successful</p>
      <h1 className="mt-4 font-heading text-5xl text-text-primary">Order Confirmed</h1>
      <p className="mt-4 max-w-xl text-text-muted">
        Your payment was completed successfully. We will start preparing your curated shipment right away.
      </p>
      {recordId ? (
        <p className="mt-4 rounded-md border border-success/30 bg-success/5 px-4 py-3 text-sm text-success">
          Order reference: {recordId}
          {paymentId ? ` | Payment: ${paymentId}` : ""}
        </p>
      ) : null}
      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <Link
          href="/"
          className="rounded-md bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-background transition hover:bg-primary/90"
        >
          Back to Home
        </Link>
        <Link
          href="/user-profile"
          className="rounded-md border border-border bg-background px-6 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-text-primary transition hover:border-primary hover:text-primary"
        >
          View Orders
        </Link>
      </div>
    </main>
  );
}