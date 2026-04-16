import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import BottomNavBar from "@/components/bottom-nav-bar";
import Footer from "@/components/footer";
import ProductCard from "@/components/commerce/product-card";
import TopAppBar from "@/components/top-app-bar";
import { prisma } from "@/lib/prisma";
import { getProductBySlug, homepageProducts } from "@/lib/commerce-data";

interface ProductDetailPageProps {
	params: Promise<{ slug: string }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
	const { slug } = await params;
	const databaseProduct = await prisma.product.findUnique({
		where: { slug },
	});
	const product =
		databaseProduct
			? {
				id: databaseProduct.id,
				slug: databaseProduct.slug,
				name: databaseProduct.name,
				category: databaseProduct.category,
				categoryKey: databaseProduct.category.split("/")[0].trim().toLowerCase().replace(/[^a-z0-9]+/g, "-"),
				price: databaseProduct.priceCents / 100,
				image: databaseProduct.imageUrl,
				description: databaseProduct.description,
				brand: databaseProduct.brand ?? undefined,
				badge: databaseProduct.badge ?? undefined,
				rating: databaseProduct.rating ?? undefined,
				reviewCount: databaseProduct.reviewCount ?? undefined,
				isFeatured: databaseProduct.isFeatured,
				isNewArrival: databaseProduct.isNewArrival,
				isBestseller: databaseProduct.isBestseller,
				tags: databaseProduct.tags,
			}
			: getProductBySlug(slug);

	if (!product) {
		notFound();
	}

	const related = homepageProducts
		.filter((item) => item.categoryKey === product.categoryKey && item.slug !== product.slug)
		.slice(0, 4);

	return (
		<>
			<TopAppBar activeHref="/products" />
			<main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
				<div className="grid gap-12 lg:grid-cols-[1.02fr_0.98fr]">
					<section>
						<div className="relative aspect-4/3 overflow-hidden rounded-lg border border-border bg-surface shadow-sm">
							<Image
								src={product.image}
								alt={product.name}
								fill
								priority
								sizes="(max-width: 1024px) 100vw, 54vw"
								className="object-cover"
							/>
						</div>
					</section>

					<section className="space-y-8">
						<div>
							<p className="text-[10px] uppercase tracking-[0.24em] text-primary">{product.category}</p>
							<h1 className="mt-4 font-heading text-5xl text-text-primary">{product.name}</h1>
							<p className="mt-4 max-w-xl text-lg leading-8 text-text-muted">{product.description}</p>
							<div className="mt-6 flex flex-wrap items-center gap-4">
								<span className="font-heading text-3xl text-primary">${product.price.toFixed(2)}</span>
								{product.rating ? (
									<span className="rounded-md border border-border bg-surface px-3 py-1 text-xs uppercase tracking-[0.2em] text-text-muted">
										{product.rating.toFixed(1)} rating
									</span>
								) : null}
							</div>
						</div>

						<div className="rounded-lg border border-border bg-surface p-6">
							<h2 className="font-heading text-3xl text-text-primary">Specifications</h2>
							<ul className="mt-4 space-y-2 text-sm leading-7 text-text-muted">
								{(product.tags ?? ["premium", "electronics"]).map((tag) => (
									<li key={tag} className="capitalize">
										{tag.replace(/-/g, " ")}
									</li>
								))}
							</ul>
						</div>

						<div className="flex flex-wrap gap-3">
							<Link
								href="/shopping-cart"
								className="rounded-md bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-background transition hover:bg-primary/90"
							>
								Add to Cart
							</Link>
							<Link
								href={`/products?category=${product.categoryKey}`}
								className="rounded-md border border-border bg-background px-6 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-text-primary transition hover:border-primary hover:text-primary"
							>
								More in category
							</Link>
						</div>
					</section>
				</div>

				<section className="mt-16 border-t border-border pt-12">
					<div className="flex items-end justify-between gap-4">
						<h2 className="font-heading text-3xl text-text-primary">Related Products</h2>
						<Link href="/products" className="text-xs uppercase tracking-[0.22em] text-primary">
							View all
						</Link>
					</div>
					<div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
						{related.map((item) => (
							<ProductCard key={item.id} product={item} />
						))}
					</div>
				</section>
			</main>
			<Footer />
			<BottomNavBar activeHref="/products" />
		</>
	);
}
