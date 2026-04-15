import Link from "next/link";

interface AdminCustomerDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminCustomerDetailPage({ params }: AdminCustomerDetailPageProps) {
  const { id } = await params;

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <p className="text-[10px] uppercase tracking-[0.24em] text-primary">Customer detail</p>
      <h1 className="mt-4 font-heading text-4xl text-text-primary">Customer #{id}</h1>
      <p className="mt-4 max-w-2xl text-text-muted">
        This customer detail page is scaffolded for profile data, order history, support actions, and account status controls.
      </p>

      <div className="mt-8 rounded-lg border border-border bg-background p-6 shadow-sm">
        <h2 className="font-heading text-2xl text-text-primary">Overview</h2>
        <p className="mt-3 text-sm text-text-muted">Add customer summary cards, recent orders, addresses, and payment history here.</p>
        <Link
          href="/admin/customers"
          className="mt-6 inline-flex rounded-md bg-primary px-5 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-background"
        >
          Back To Customers
        </Link>
      </div>
    </main>
  );
}
