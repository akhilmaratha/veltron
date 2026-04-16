"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import BottomNavBar from "@/components/bottom-nav-bar";
import Footer from "@/components/footer";
import ProductCard from "@/components/commerce/product-card";
import TopAppBar from "@/components/top-app-bar";
import {
  brandSpotlight,
  bundleOffers,
  buyingGuides,
  customerTestimonials,
  flashDeals,
  heroCampaigns,
  homepageProducts,
  storefrontCategories,
  trustHighlights,
} from "@/lib/commerce-data";
import type { Product } from "@/types/commerce";

const heroIntervalMs = 5000;
const dealsIntervalMs = 4500;

type HeroSlideCampaign = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  ctaLabel: string;
  href: string;
  image: string;
};

type StorefrontCategoryRow = {
  key: string;
  label: string;
  description: string;
  image: string;
};

type ApiProductRow = {
  id: string;
  name: string;
  slug: string;
  category: string;
  brand?: string | null;
  price: number;
  image: string;
  description: string;
  badge?: string | null;
  rating?: number | null;
  reviewCount?: number | null;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isBestseller?: boolean;
  tags?: string[];
};

function toCatalogProduct(item: ApiProductRow): Product {
  const categoryKey = item.category.split("/")[0].trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");

  return {
    id: item.id,
    slug: item.slug,
    name: item.name,
    category: item.category,
    categoryKey,
    price: item.price,
    image: item.image,
    description: item.description,
    brand: item.brand ?? undefined,
    badge: item.badge ?? undefined,
    rating: item.rating ?? undefined,
    reviewCount: item.reviewCount ?? undefined,
    isFeatured: item.isFeatured,
    isNewArrival: item.isNewArrival,
    isBestseller: item.isBestseller,
    tags: item.tags,
  };
}

export default function Home() {
  const [catalogProducts, setCatalogProducts] = useState<Product[]>(homepageProducts);
  const [categories, setCategories] = useState<StorefrontCategoryRow[]>(
    storefrontCategories.map((category) => ({ ...category })),
  );
  const [heroSlides, setHeroSlides] = useState<HeroSlideCampaign[]>(
    heroCampaigns.map((slide) => ({ ...slide })),
  );
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);
  const [activeDealIndex, setActiveDealIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<"best-sellers" | "new-arrivals">("best-sellers");

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetch("/api/categories", { cache: "no-store" });
        const payload = (await response.json()) as { items?: StorefrontCategoryRow[] };

        if (!response.ok || !payload.items || payload.items.length === 0) {
          return;
        }

        setCategories(payload.items);
      } catch {
        // Fallback keeps static categories when CMS is unavailable.
      }
    };

    void loadCategories();
  }, []);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch("/api/products", { cache: "no-store" });
        const payload = (await response.json()) as { items?: ApiProductRow[] };

        if (!response.ok || !payload.items || payload.items.length === 0) {
          return;
        }

        setCatalogProducts(payload.items.map(toCatalogProduct));
      } catch {
        // Fallback keeps static products when the catalog API is unavailable.
      }
    };

    void loadProducts();
  }, []);

  useEffect(() => {
    const loadHeroSlides = async () => {
      try {
        const response = await fetch("/api/homepage/hero-slides", { cache: "no-store" });
        const payload = (await response.json()) as {
          items?: Array<{
            id: string;
            eyebrow: string;
            title: string;
            description: string;
            ctaLabel: string;
            href: string;
            image: string;
          }>;
        };

        if (!response.ok || !payload.items || payload.items.length === 0) {
          return;
        }

        setHeroSlides(payload.items);
      } catch {
        // Fallback keeps static campaigns when CMS is unavailable.
      }
    };

    void loadHeroSlides();
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveHeroIndex((current) => (current + 1) % heroSlides.length);
    }, heroIntervalMs);

    return () => window.clearInterval(timer);
  }, [heroSlides.length]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveDealIndex((current) => (current + 1) % flashDeals.length);
    }, dealsIntervalMs);

    return () => window.clearInterval(timer);
  }, []);

  const tabbedProducts = useMemo(() => {
    const featuredProducts = catalogProducts.filter((product) => product.isFeatured || product.isBestseller);

    if (activeTab === "new-arrivals") {
      return catalogProducts
        .filter((product) => product.isNewArrival || product.badge === "New" || product.badge === "Limited")
        .slice(0, 4);
    }

    return (featuredProducts.length > 0 ? featuredProducts : catalogProducts)
      .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
      .slice(0, 4);
  }, [activeTab, catalogProducts]);

  const activeHero = heroSlides[activeHeroIndex] ?? heroCampaigns[0];

  return (
    <>
      <TopAppBar activeHref="/" />
      <main className="overflow-hidden pb-24 md:pb-0">
        <section className="border-b border-border bg-text-primary/95 px-4 py-2 text-background sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-7xl items-center justify-between text-[11px] uppercase tracking-[0.2em]">
            <span>Free shipping above $499</span>
            <Link href="/coupons" className="text-primary transition hover:opacity-80">
              View Offers
            </Link>
          </div>
        </section>

        <section className="relative overflow-hidden border-b border-border bg-surface px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.06fr_0.94fr] lg:items-center">
            <div className="max-w-2xl">
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-primary">{activeHero.eyebrow}</p>
              <h1 className="mt-4 font-heading text-5xl leading-[0.95] text-text-primary sm:text-6xl lg:text-7xl">
                {activeHero.title}
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-8 text-text-muted">{activeHero.description}</p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href={activeHero.href}
                  className="rounded-md bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-background transition hover:bg-primary/90"
                >
                  {activeHero.ctaLabel}
                </Link>
                <Link
                  href="/products"
                  className="rounded-md border border-border bg-background px-6 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-text-primary transition hover:border-primary hover:text-primary"
                >
                  Browse All Products
                </Link>
              </div>
              <div className="mt-8 flex items-center gap-2">
                {heroSlides.map((slide, index) => (
                  <button
                    key={slide.id}
                    type="button"
                    aria-label={`Go to slide ${index + 1}`}
                    onClick={() => setActiveHeroIndex(index)}
                    className={`h-2.5 rounded-full transition ${index === activeHeroIndex ? "w-8 bg-primary" : "w-2.5 bg-border"}`}
                  />
                ))}
              </div>
            </div>

            <div className="relative min-h-96 overflow-hidden rounded-lg border border-border bg-background shadow-sm lg:min-h-136">
              <Image
                src={activeHero.image}
                alt={activeHero.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 46vw"
                className="object-cover transition duration-700"
              />
            </div>
          </div>
        </section>

        <section className="border-b border-border bg-background px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.24em] text-primary">Browse by category</p>
                <h2 className="mt-3 font-heading text-4xl text-text-primary">Build your setup</h2>
              </div>
              <Link href="/products" className="text-xs uppercase tracking-[0.22em] text-primary">
                View full catalog
              </Link>
            </div>

            <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {categories.map((category) => (
                <Link
                  key={category.key}
                  href={`/products?category=${category.key}`}
                  className="group overflow-hidden rounded-lg border border-border bg-surface"
                >
                  <div className="relative aspect-4/3">
                    <Image
                      src={category.image}
                      alt={category.label}
                      fill
                      sizes="(max-width: 1024px) 100vw, 25vw"
                      className="object-cover transition duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="font-heading text-2xl text-text-primary">{category.label}</h3>
                    <p className="mt-2 text-sm leading-6 text-text-muted">{category.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-border bg-surface px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.24em] text-primary">Limited time</p>
                <h2 className="mt-3 font-heading text-4xl text-text-primary">Flash deals</h2>
              </div>
              <div className="flex items-center gap-2">
                {flashDeals.map((deal, index) => (
                  <button
                    key={deal.id}
                    type="button"
                    onClick={() => setActiveDealIndex(index)}
                    className={`h-2.5 rounded-full transition ${index === activeDealIndex ? "w-7 bg-primary" : "w-2.5 bg-border"}`}
                    aria-label={`Show deal ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {flashDeals.map((deal, index) => (
                <Link
                  key={deal.id}
                  href={deal.href}
                  className={`overflow-hidden rounded-lg border bg-background transition ${
                    index === activeDealIndex ? "border-primary shadow-md" : "border-border"
                  }`}
                >
                  <div className="relative aspect-4/3">
                    <Image src={deal.image} alt={deal.title} fill sizes="(max-width: 1024px) 100vw, 33vw" className="object-cover" />
                    <span className="absolute left-3 top-3 rounded-md bg-warning px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-background">
                      {deal.discountLabel}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-heading text-2xl text-text-primary">{deal.title}</h3>
                    <div className="mt-3 flex items-center gap-3">
                      <span className="font-heading text-2xl text-primary">${deal.price.toFixed(2)}</span>
                      <span className="text-sm text-text-muted line-through">${deal.originalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-border bg-background px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.24em] text-primary">Handpicked now</p>
                <h2 className="mt-3 font-heading text-4xl text-text-primary">Featured picks</h2>
              </div>
              <div className="flex items-center gap-2 rounded-md border border-border p-1">
                <button
                  type="button"
                  onClick={() => setActiveTab("best-sellers")}
                  className={`rounded-md px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition ${
                    activeTab === "best-sellers" ? "bg-primary text-background" : "text-text-muted"
                  }`}
                >
                  Best Sellers
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("new-arrivals")}
                  className={`rounded-md px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition ${
                    activeTab === "new-arrivals" ? "bg-primary text-background" : "text-text-muted"
                  }`}
                >
                  New Arrivals
                </button>
              </div>
            </div>

            <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {tabbedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-border bg-surface px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <p className="text-center text-[10px] uppercase tracking-[0.24em] text-primary">Shop by brand</p>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {brandSpotlight.map((brand) => (
                <Link
                  key={brand.id}
                  href={brand.href}
                  className="rounded-md border border-border bg-background px-4 py-4 text-center text-sm font-semibold uppercase tracking-[0.2em] text-text-primary transition hover:border-primary hover:text-primary"
                >
                  {brand.label}
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-border bg-background px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.24em] text-primary">Bundles</p>
                <h2 className="mt-3 font-heading text-4xl text-text-primary">Save more with setups</h2>
              </div>
              <Link href="/products" className="text-xs uppercase tracking-[0.22em] text-primary">
                Explore bundles
              </Link>
            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {bundleOffers.map((bundle) => (
                <Link key={bundle.id} href={bundle.href} className="overflow-hidden rounded-lg border border-border bg-surface">
                  <div className="relative aspect-video">
                    <Image src={bundle.image} alt={bundle.title} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
                  </div>
                  <div className="p-6">
                    <p className="text-[10px] uppercase tracking-[0.22em] text-warning">{bundle.savingsLabel}</p>
                    <h3 className="mt-3 font-heading text-3xl text-text-primary">{bundle.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-text-muted">{bundle.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-border bg-surface px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
          <div className="mx-auto max-w-7xl">
            <h2 className="font-heading text-4xl text-text-primary">Why buy from Veltron</h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {trustHighlights.map((item) => (
                <article key={item.id} className="rounded-lg border border-border bg-background p-5">
                  <h3 className="font-heading text-2xl text-text-primary">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-text-muted">{item.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-border bg-background px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.24em] text-primary">Social proof</p>
                <h2 className="mt-3 font-heading text-4xl text-text-primary">Loved by thousands</h2>
              </div>
              <span className="text-xs uppercase tracking-[0.2em] text-text-muted">4.8/5 average rating</span>
            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {customerTestimonials.map((item) => (
                <article key={item.id} className="rounded-lg border border-border bg-surface p-6">
                  <p className="text-lg leading-8 text-text-primary">&quot;{item.quote}&quot;</p>
                  <div className="mt-4 flex items-center justify-between text-sm text-text-muted">
                    <span>{item.name}</span>
                    <span>{item.rating} / 5</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-border bg-surface px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-end justify-between gap-4">
              <h2 className="font-heading text-4xl text-text-primary">Buying guides</h2>
              <Link href="/products" className="text-xs uppercase tracking-[0.2em] text-primary">
                Start shopping
              </Link>
            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {buyingGuides.map((guide) => (
                <Link key={guide.id} href={guide.href} className="overflow-hidden rounded-lg border border-border bg-background">
                  <div className="relative aspect-16/10">
                    <Image src={guide.image} alt={guide.title} fill sizes="(max-width: 1024px) 100vw, 33vw" className="object-cover" />
                  </div>
                  <div className="p-5">
                    <h3 className="font-heading text-2xl text-text-primary">{guide.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-text-muted">{guide.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-text-primary px-4 py-16 text-background sm:px-6 lg:px-8 lg:py-20">
          <div className="mx-auto max-w-7xl text-center">
            <p className="text-[10px] uppercase tracking-[0.24em] text-primary">Members only</p>
            <h2 className="mt-4 font-heading text-4xl sm:text-5xl">Get 10% off your first order</h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-background/80">
              Join Veltron Circle for early access to product drops, bundle pricing, and private restock alerts.
            </p>
            <form className="mx-auto mt-8 flex w-full max-w-xl flex-col gap-3 sm:flex-row">
              <input
                type="email"
                placeholder="Enter email address"
                className="w-full rounded-md border border-border bg-transparent px-4 py-3 text-sm text-background outline-none placeholder:text-background/50 focus:border-primary"
              />
              <button
                type="submit"
                className="rounded-md bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-background transition hover:bg-primary/90"
              >
                Join Now
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
