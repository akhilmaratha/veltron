"use client";

import { useState } from "react";
import BottomNavBar from "@/components/bottom-nav-bar";
import Footer from "@/components/footer";
import ProductCard from "@/components/commerce/product-card";
import TopAppBar from "@/components/top-app-bar";
import { homepageProducts } from "@/lib/commerce-data";

const listingProducts = [
  ...homepageProducts,
  {
    id: "dock-01",
    name: "Signal Dock",
    category: "Accessories / Walnut",
    price: 120,
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=900&q=80",
    description: "Low profile charging dock with a warm wood base and soft edge detail.",
  },
  {
    id: "lamp-01",
    name: "Halo Desk Lamp",
    category: "Lighting / Brass",
    price: 240,
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80",
    description: "Directional light with a satin finish and balanced articulated arm.",
  },
];

const categoryOptions = ["Audio", "Lighting", "Accessories", "Furniture"] as const;

export default function ProductListingPage() {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(["Accessories"]);
  const [sortLabel, setSortLabel] = useState("Newest");

  const filteredProducts = listingProducts.filter((product) => {
    if (selectedCategories.length === 0) {
      return true;
    }

    return selectedCategories.some((category) => product.category.includes(category));
  });

  return (
    <>
      <TopAppBar activeHref="/product-listing" />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
        <div className="flex flex-col gap-10 lg:flex-row lg:gap-14">
          <aside className="lg:w-72">
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
                      {categoryOptions.map((category) => {
                        const checked = selectedCategories.includes(category);

                        return (
                          <label key={category} className="flex items-center gap-3 text-sm text-text-primary">
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() =>
                                setSelectedCategories((current) =>
                                  checked ? current.filter((item) => item !== category) : [...current, category],
                                )
                              }
                              className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                            />
                            <span>{category}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] uppercase tracking-[0.22em] text-text-muted">Price</p>
                    <input type="range" min="0" max="1000" defaultValue="650" className="mt-4 w-full accent-primary" />
                  </div>

                  <div>
                    <p className="text-[10px] uppercase tracking-[0.22em] text-text-muted">Rating</p>
                    <button type="button" className="mt-4 text-sm text-primary">
                      4.5 and up
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          <section className="flex-1">
            <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.24em] text-primary">Electronics archive</p>
                <h1 className="mt-3 font-heading text-4xl text-text-primary sm:text-5xl">The Archive</h1>
                <p className="mt-3 text-sm italic text-text-muted">Showing {filteredProducts.length} curated objects</p>
              </div>
              <select
                value={sortLabel}
                onChange={(event) => setSortLabel(event.target.value)}
                className="w-fit rounded-md border border-border bg-background px-4 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-text-primary outline-none"
              >
                <option>Newest</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
              </select>
            </div>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

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
      <BottomNavBar activeHref="/product-listing" />
    </>
  );
}