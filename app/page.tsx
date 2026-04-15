import Image from "next/image";
import Link from "next/link";
import BottomNavBar from "@/components/bottom-nav-bar";
import Footer from "@/components/footer";
import ProductCard from "@/components/commerce/product-card";
import TopAppBar from "@/components/top-app-bar";
import { featureImages, homepageProducts } from "@/lib/commerce-data";

export default function Home() {
  return (
    <>
      <TopAppBar activeHref="/" />
      <main className="overflow-hidden">
        <section className="relative overflow-hidden border-b border-border bg-surface px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="max-w-2xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">
                Premium electronics collection
              </p>
              <h1 className="mt-5 max-w-xl font-heading text-5xl leading-[0.95] text-text-primary sm:text-6xl lg:text-7xl">
                Precision design for the modern home.
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-text-muted">
                A premium electronics store shaped by quiet materials, functional details,
                and a warm editorial point of view.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/product-listing"
                  className="rounded-md bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-background transition hover:bg-primary/90"
                >
                  Shop Collection
                </Link>
                <Link
                  href="/shopping-cart"
                  className="rounded-md border border-border bg-background px-6 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-text-primary transition hover:border-primary hover:text-primary"
                >
                  View Cart
                </Link>
              </div>
            </div>
            <div className="relative min-h-104 overflow-hidden rounded-lg border border-border bg-background shadow-sm lg:min-h-136">
              <Image
                src={featureImages.hero}
                alt="Minimal electronic product composition"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover"
              />
            </div>
          </div>
        </section>

        <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-7">
                <h2 className="font-heading text-4xl text-text-primary sm:text-5xl">
                  Designed with restraint.
                </h2>
                <div className="mt-6 h-px w-24 bg-border" />
                <p className="mt-6 max-w-2xl text-lg leading-8 text-text-muted">
                  Every object in Veltron is selected for clarity, tactility, and long-term
                  usefulness. The result is a store that feels premium without feeling noisy.
                </p>
              </div>
              <div className="lg:col-span-5 lg:text-right">
                <p className="text-[10px] uppercase tracking-[0.3em] text-text-muted">
                  Established 2024 — MMXXIV
                </p>
              </div>
            </div>

            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2 overflow-hidden rounded-lg border border-border bg-background shadow-sm">
                <div className="relative aspect-4/3">
                  <Image
                    src={featureImages.philosophyOne}
                    alt="Warm textured fabric in a minimalist studio"
                    fill
                    sizes="(max-width: 1024px) 100vw, 66vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <p className="text-[10px] uppercase tracking-[0.24em] text-primary">Philosophy</p>
                  <h3 className="mt-3 font-heading text-2xl text-text-primary">The tactile experience</h3>
                </div>
              </div>
              <div className="overflow-hidden rounded-lg border border-border bg-background shadow-sm">
                <div className="relative aspect-square">
                  <Image
                    src={featureImages.philosophyTwo}
                    alt="Glass and brass decor item in soft light"
                    fill
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <p className="text-[10px] uppercase tracking-[0.24em] text-primary">Apothecary</p>
                  <h3 className="mt-3 font-heading text-2xl text-text-primary">Botanical rites</h3>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.24em] text-primary">Featured</p>
                <h2 className="mt-3 font-heading text-4xl text-text-primary">The core collection</h2>
              </div>
              <Link href="/product-listing" className="text-xs uppercase tracking-[0.22em] text-primary">
                Browse all objects
              </Link>
            </div>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {homepageProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-border bg-text-primary px-4 py-16 text-background sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto flex max-w-7xl flex-col items-center text-center">
            <p className="text-[10px] uppercase tracking-[0.32em] text-primary">Correspondence</p>
            <h2 className="mt-5 max-w-2xl font-heading text-4xl sm:text-5xl">
              Quiet arrivals, delivered directly to your inbox.
            </h2>
            <form className="mt-10 flex w-full max-w-md flex-col gap-4">
              <input
                type="email"
                placeholder="Email address"
                className="rounded-md border border-border bg-transparent px-4 py-3 text-center text-sm text-background outline-none placeholder:text-background/50 focus:border-primary"
              />
              <button
                type="submit"
                className="rounded-md bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-background transition hover:bg-primary/90"
              >
                Join the Registry
              </button>
            </form>
          </div>
        </section>
      </main>
      <Footer />
      <BottomNavBar activeHref="/" />
    </>
  );
}
