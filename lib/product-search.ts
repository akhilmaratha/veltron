import type { Product } from "@/types/commerce";

export interface ProductSearchFilters {
  categoryKeys: string[];
  minPrice: number;
  maxPrice: number;
  sort: "relevance" | "price-asc" | "price-desc" | "rating";
}

function scoreProductQuery(product: Product, query: string): number {
  if (!query) {
    return 1;
  }

  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) {
    return 1;
  }

  const tokens = normalizedQuery.split(/\s+/);
  const searchable = [
    product.name,
    product.brand ?? "",
    product.description,
    product.category,
    ...(product.tags ?? []),
  ]
    .join(" ")
    .toLowerCase();

  let score = 0;

  for (const token of tokens) {
    if (product.name.toLowerCase().startsWith(token)) {
      score += 6;
      continue;
    }

    if (product.name.toLowerCase().includes(token)) {
      score += 4;
      continue;
    }

    if (searchable.includes(token)) {
      score += 2;
    }
  }

  return score;
}

// TODO: Replace with API call backed by Elasticsearch index.
export function elasticLikeSearchProducts(
  products: Product[],
  query: string,
  filters: ProductSearchFilters,
): Product[] {
  const withScore = products
    .filter((product) => {
      const inCategory =
        filters.categoryKeys.length === 0 || filters.categoryKeys.includes(product.categoryKey);
      const inPrice = product.price >= filters.minPrice && product.price <= filters.maxPrice;
      return inCategory && inPrice;
    })
    .map((product) => ({
      product,
      score: scoreProductQuery(product, query),
    }))
    .filter((entry) => (query.trim() ? entry.score > 0 : true));

  switch (filters.sort) {
    case "price-asc":
      return withScore.sort((a, b) => a.product.price - b.product.price).map((entry) => entry.product);
    case "price-desc":
      return withScore.sort((a, b) => b.product.price - a.product.price).map((entry) => entry.product);
    case "rating":
      return withScore
        .sort((a, b) => (b.product.rating ?? 0) - (a.product.rating ?? 0))
        .map((entry) => entry.product);
    default:
      return withScore
        .sort((a, b) => b.score - a.score || (b.product.rating ?? 0) - (a.product.rating ?? 0))
        .map((entry) => entry.product);
  }
}
