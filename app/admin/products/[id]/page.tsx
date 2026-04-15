import Link from "next/link";

interface AdminProductDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminProductDetailPage({ params }: AdminProductDetailPageProps) {
  const { id } = await params;

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <p className="text-[10px] uppercase tracking-[0.24em] text-primary">Admin product</p>
      <h1 className="mt-4 font-heading text-4xl text-text-primary">Product #{id}</h1>
      <p className="mt-4 text-text-muted">This product detail admin page is scaffolded and ready for edit workflows.</p>
      <Link
        href="/admin/products"
        className="mt-8 inline-flex rounded-md bg-primary px-5 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-background"
      >
        Back To Products
      </Link>
    </main>
  );
}
