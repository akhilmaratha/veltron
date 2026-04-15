import Link from "next/link";

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProfileOrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = await params;

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <p className="text-[10px] uppercase tracking-[0.24em] text-primary">Order detail</p>
      <h1 className="mt-4 font-heading text-4xl text-text-primary">Order #{id}</h1>
      <p className="mt-4 text-text-muted">
        This order detail page is now scaffolded and ready for backend order timeline, invoice, and shipment events.
      </p>
      <Link
        href="/profile"
        className="mt-8 inline-flex rounded-md bg-primary px-5 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-background"
      >
        Back To Profile
      </Link>
    </main>
  );
}
