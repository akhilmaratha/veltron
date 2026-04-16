import Link from "next/link";

export default function AdminSettingsPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <p className="text-[10px] uppercase tracking-[0.24em] text-primary">Admin settings</p>
      <h1 className="mt-4 font-heading text-4xl text-text-primary">Settings</h1>
      <p className="mt-4 max-w-2xl text-text-muted">
        Store configuration, shipping preferences, payment methods, notifications, and admin account controls will live here.
      </p>

      <section className="mt-10 grid gap-6 md:grid-cols-2">
        <Link href="/admin/content/homepage" className="rounded-lg border border-primary/30 bg-surface p-6 shadow-sm transition hover:border-primary">
          <h2 className="font-heading text-2xl text-text-primary">Homepage CMS</h2>
          <p className="mt-3 text-sm text-text-muted">Manage hero slides used by the storefront carousel.</p>
        </Link>
        <Link href="/admin/content/categories" className="rounded-lg border border-primary/30 bg-surface p-6 shadow-sm transition hover:border-primary">
          <h2 className="font-heading text-2xl text-text-primary">Category CMS</h2>
          <p className="mt-3 text-sm text-text-muted">Manage storefront categories used on homepage and filters.</p>
        </Link>
        {[
          "General",
          "Shipping",
          "Payment",
          "Notifications",
          "Admin Account",
        ].map((section) => (
          <div key={section} className="rounded-lg border border-border bg-background p-6 shadow-sm">
            <h2 className="font-heading text-2xl text-text-primary">{section}</h2>
            <p className="mt-3 text-sm text-text-muted">This section is scaffolded and ready for the full settings form.</p>
          </div>
        ))}
      </section>
    </main>
  );
}
