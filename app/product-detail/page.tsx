import { redirect } from "next/navigation";
import { homepageProducts } from "@/lib/commerce-data";

export default function LegacyProductDetailPage() {
  const fallbackSlug = homepageProducts[0]?.slug;

  if (!fallbackSlug) {
    redirect("/products");
  }

  redirect(`/products/${fallbackSlug}`);
}
