"use client";

import { useState } from "react";
import Image from "next/image";
import BottomNavBar from "@/components/bottom-nav-bar";
import Footer from "@/components/footer";
import ProductCard from "@/components/commerce/product-card";
import TopAppBar from "@/components/top-app-bar";
import { featureImages, homepageProducts } from "@/lib/commerce-data";
import { useCommerceStore } from "@/store/use-commerce-store";

const productGallery = [
  featureImages.productDetailHero,
  homepageProducts[0].image,
  homepageProducts[1].image,
  homepageProducts[2].image,
] as const;

const productTabs = ["Description", "Specifications", "Shipping"] as const;

export default function ProductDetailPage() {
  const [selectedImage, setSelectedImage] = useState(productGallery[0]);
  const [activeTab, setActiveTab] = useState<(typeof productTabs)[number]>("Description");
  const [selectedFinish, setSelectedFinish] = useState("Walnut");
  const addToCart = useCommerceStore((state) => state.addToCart);

  return (
    <>
      <TopAppBar activeHref="/product-detail" />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <section>
            <div className="relative aspect-4/3 overflow-hidden rounded-lg border border-border bg-surface shadow-sm">
              <Image src={selectedImage} alt="Veltron product" fill sizes="(max-width: 1024px) 100vw, 55vw" className="object-cover" />
            </div>
            <div className="mt-4 grid grid-cols-4 gap-3">
              {productGallery.map((image) => (
                <button key={image} type="button" onClick={() => setSelectedImage(image)} className={`relative aspect-square overflow-hidden rounded-md border transition ${selectedImage === image ? "border-primary" : "border-border"}`}>
                  <Image src={image} alt="Product view" fill sizes="120px" className="object-cover" />
                </button>
              ))}
            </div>
          </section>

          <section className="space-y-8">
            <div>
              <p className="text-[10px] uppercase tracking-[0.24em] text-primary">Limited edition / Audio</p>
              <h1 className="mt-4 font-heading text-5xl text-text-primary">The Sculptural Lounge</h1>
              <p className="mt-4 max-w-xl text-lg leading-8 text-text-muted">
                A quiet centerpiece with layered materials, soft geometry, and warm acoustics.
              </p>
              <div className="mt-6 text-3xl font-heading text-primary">$3,240.00</div>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-text-muted">Finish</p>
              <div className="mt-3 flex flex-wrap gap-3">
                {["Walnut", "Ash", "Black Oak"].map((finish) => (
                  <button
                    key={finish}
                    type="button"
                    onClick={() => setSelectedFinish(finish)}
                    className={`rounded-md border px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] transition ${
                      selectedFinish === finish ? "border-primary bg-primary text-background" : "border-border bg-background text-text-primary"
                    }`}
                  >
                    {finish}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex gap-6 border-b border-border pb-4 text-xs uppercase tracking-[0.22em] text-text-muted">
                {productTabs.map((tab) => (
                  <button key={tab} type="button" onClick={() => setActiveTab(tab)} className={activeTab === tab ? "text-primary" : "text-text-muted"}>
                    {tab}
                  </button>
                ))}
              </div>
              <p className="mt-4 text-sm leading-7 text-text-muted">
                {activeTab === "Description"
                  ? "Hand-finished walnut shell with a balanced profile, designed to anchor a living room or studio with quiet presence."
                  : activeTab === "Specifications"
                    ? "Oak core, acoustic damping layers, matte oil finish, and hidden cable management."
                    : "White-glove shipping within 5-7 business days with signature delivery and installation coordination."
                }
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <button
                type="button"
                onClick={() =>
                  addToCart({
                    id: "detail-01",
                    name: "The Sculptural Lounge",
                    variant: selectedFinish,
                    price: 3240,
                    quantity: 1,
                    image: selectedImage,
                  })
                }
                className="rounded-md bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-background transition hover:bg-primary/90"
              >
                Add to Cart
              </button>
              <button type="button" className="rounded-md border border-border bg-background px-6 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-text-primary transition hover:border-primary hover:text-primary">
                Find in Store
              </button>
            </div>

            <div className="rounded-lg border border-border bg-surface p-6">
              <p className="text-xs uppercase tracking-[0.22em] text-primary">Related Objects</p>
              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                {homepageProducts.slice(0, 2).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
      <BottomNavBar activeHref="/product-detail" />
    </>
  );
}