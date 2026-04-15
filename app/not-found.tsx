import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-start justify-center px-4 py-10 sm:px-6 lg:px-8">
      <p className="text-[10px] uppercase tracking-[0.24em] text-primary">404</p>
      <h1 className="mt-4 font-heading text-5xl text-text-primary">Page Not Found</h1>
      <p className="mt-4 text-text-muted">The page you are looking for does not exist or may have moved.</p>
      <Link
        href="/"
        className="mt-8 inline-flex rounded-md bg-primary px-5 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-background"
      >
        Go Home
      </Link>
    </main>
  );
}
