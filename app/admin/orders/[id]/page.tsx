import Link from "next/link";

interface AdminOrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminOrderDetailPage({ params }: AdminOrderDetailPageProps) {
  const { id } = await params;

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <p className="text-[10px] uppercase tracking-[0.24em] text-primary">Admin order</p>
      <h1 className="mt-4 font-heading text-4xl text-text-primary">Order #{id}</h1>
      <p className="mt-4 text-text-muted">This admin order detail page is scaffolded and ready for fulfillment actions.</p>
      <Link
        href="/admin/orders"
        className="mt-8 inline-flex rounded-md bg-primary px-5 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-background"
      >
        Back To Orders
      </Link>
    </main>
  );
}
