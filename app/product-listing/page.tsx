"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import BottomNavBar from "@/components/bottom-nav-bar";
import Footer from "@/components/footer";
import ProductCard from "@/components/commerce/product-card";
import TopAppBar from "@/components/top-app-bar";
import { homepageProducts, storefrontCategories } from "@/lib/commerce-data";
import { elasticLikeSearchProducts, type ProductSearchFilters } from "@/lib/product-search";
import type { Product } from "@/types/commerce";

const PRICE_MIN = 0;
const PRICE_MAX = 2500;

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

export default function ProductListingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";
  const initialCategory = searchParams.get("category") ?? "";

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [categories, setCategories] = useState<StorefrontCategoryRow[]>(
    storefrontCategories.map((category) => ({ ...category })),
  );
  const [catalogProducts, setCatalogProducts] = useState<Product[]>(homepageProducts);
  const [searchInput, setSearchInput] = useState(initialQuery);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialCategory ? [initialCategory] : [],
  );
  const [minPrice, setMinPrice] = useState(PRICE_MIN);
  const [maxPrice, setMaxPrice] = useState(PRICE_MAX);
  const [sortLabel, setSortLabel] = useState<ProductSearchFilters["sort"]>("relevance");

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

  const filteredProducts = useMemo(
    () =>
      elasticLikeSearchProducts(catalogProducts, searchInput, {
        categoryKeys: selectedCategories,
        minPrice,
        maxPrice,
        sort: sortLabel,
      }),
    [catalogProducts, maxPrice, minPrice, searchInput, selectedCategories, sortLabel],
  );

  const onSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = searchInput.trim();
    const params = new URLSearchParams(searchParams.toString());

    if (query) {
      params.set("q", query);
    } else {
      params.delete("q");
    }

    router.push(`/products?${params.toString()}`);
  };

  const onToggleCategory = (categoryKey: string, checked: boolean) => {
    const next = checked
      ? selectedCategories.filter((item) => item !== categoryKey)
      : [...selectedCategories, categoryKey];
    setSelectedCategories(next);

    const params = new URLSearchParams(searchParams.toString());
    if (next.length === 1) {
      params.set("category", next[0]);
    } else {
      params.delete("category");
    }
    router.push(`/products${params.toString() ? `?${params.toString()}` : ""}`);
  };

  const activeCategoryLabel =
    selectedCategories.length === 1
      ? categories.find((category) => category.key === selectedCategories[0])?.label
      : "All Categories";

  return (
    <>
      <TopAppBar activeHref="/products" />
      <main className="mx-auto max-w-7xl px-4 py-10 pb-24 sm:px-6 lg:px-8 lg:py-16 lg:pb-16">
        <div className="flex flex-col gap-10 lg:flex-row lg:gap-14">
          <aside className="lg:sticky lg:top-24 lg:w-72 lg:self-start xl:w-80">
            <div className="lg:hidden">
              <button
                type="button"
                onClick={() => setMobileFiltersOpen((current) => !current)}
                className="mb-4 rounded-md border border-border bg-background px-4 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-text-primary"
              >
                {mobileFiltersOpen ? "Hide Filters" : "Show Filters"}
              </button>
            </div>
            <div className={`${mobileFiltersOpen ? "block" : "hidden"} lg:block`}>
              <div className="rounded-lg border border-border bg-background p-6 shadow-sm">
                <h2 className="font-heading text-2xl text-text-primary">Filters</h2>
                <div className="mt-8 space-y-8">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.22em] text-text-muted">Category</p>
                    <div className="mt-4 space-y-3">
                      {categories.map((category) => {
                        const checked = selectedCategories.includes(category.key);

                        return (
                          <label key={category.key} className="flex items-center gap-3 text-sm text-text-primary">
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => onToggleCategory(category.key, checked)}
                              className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                            />
                            <span>{category.label}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] uppercase tracking-[0.22em] text-text-muted">Price</p>
                    <input
                      type="range"
                      min={PRICE_MIN}
                      max={PRICE_MAX}
                      step={50}
                      value={maxPrice}
                      onChange={(event) => setMaxPrice(Number(event.target.value))}
                      className="mt-4 w-full accent-primary"
                    />
                    <div className="mt-3 flex items-center justify-between text-xs text-text-muted">
                      <span>${minPrice}</span>
                      <span>${maxPrice}</span>
                    </div>
                  </div>

                  <div>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCategories([]);
                        setSearchInput("");
                        setMinPrice(PRICE_MIN);
                        setMaxPrice(PRICE_MAX);
                        setSortLabel("relevance");
                        router.push("/products");
                      }}
                      className="rounded-md border border-border px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-text-primary"
                    >
                      Reset filters
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          <section className="min-w-0 flex-1">
            <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.24em] text-primary">Electronics archive</p>
                <h1 className="mt-3 font-heading text-4xl text-text-primary sm:text-5xl">The Archive</h1>
                <p className="mt-3 text-sm italic text-text-muted">
                  {activeCategoryLabel} • {filteredProducts.length} products found
                </p>
              </div>
              <select
                value={sortLabel}
                onChange={(event) => setSortLabel(event.target.value as ProductSearchFilters["sort"])}
                className="w-fit rounded-md border border-border bg-background px-4 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-text-primary outline-none"
              >
                <option value="relevance">Relevance</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>

            <form onSubmit={onSearchSubmit} className="mt-6 flex flex-col gap-3 sm:flex-row">
              <input
                type="search"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Search by product name, feature, or category"
                className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm text-text-primary outline-none focus:border-primary"
              />
              <button
                type="submit"
                className="rounded-md bg-primary px-5 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-background"
              >
                Search
              </button>
            </form>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {filteredProducts.length === 0 ? (
              <div className="mt-10 rounded-lg border border-border bg-surface p-8 text-center">
                <p className="font-heading text-2xl text-text-primary">No matching products</p>
                <p className="mt-2 text-sm text-text-muted">Try a broader term or remove a filter.</p>
                <Link href="/products" className="mt-4 inline-block text-xs uppercase tracking-[0.22em] text-primary">
                  Reset to all products
                </Link>
              </div>
            ) : null}

            <div className="mt-16 flex items-center justify-center gap-4 text-xs uppercase tracking-[0.22em] text-text-muted">
              <span className="text-primary">1</span>
              <span>2</span>
              <span>3</span>
              <span>4</span>
            </div>
          </section>
        </div>
      </main>
      <Footer />
      <BottomNavBar activeHref="/products" />
    </>
  );
}