import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createProductSchema } from "@/lib/validators/product";

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function serializeProduct(item: {
  id: string;
  name: string;
  sku: string;
  category: string;
  priceCents: number;
  stock: number;
  imageUrl: string;
  description: string;
  slug?: string | null;
  brand?: string | null;
  badge?: string | null;
  isFeatured?: boolean | null;
  isNewArrival?: boolean | null;
  isBestseller?: boolean | null;
  rating?: number | null;
  reviewCount?: number | null;
  tags?: string[] | null;
  galleryImages?: string[] | null;
}) {
  return {
    id: item.id,
    name: item.name,
    sku: item.sku,
    slug: item.slug ?? "",
    brand: item.brand,
    category: item.category,
    price: item.priceCents / 100,
    stock: item.stock,
    image: item.imageUrl,
    description: item.description,
    badge: item.badge ?? undefined,
    isFeatured: item.isFeatured ?? false,
    isNewArrival: item.isNewArrival ?? false,
    isBestseller: item.isBestseller ?? false,
    rating: item.rating ?? undefined,
    reviewCount: item.reviewCount ?? undefined,
    tags: item.tags ?? [],
    galleryImages: item.galleryImages ?? [],
  };
}

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 100,
    });

    return NextResponse.json({
      items: products.map(serializeProduct),
    });
  } catch {
    return NextResponse.json({ message: "Unable to load products." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsed = createProductSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { message: parsed.error.issues[0]?.message ?? "Invalid request payload." },
        { status: 400 },
      );
    }

    const product = await prisma.product.create({
      data: {
        name: parsed.data.name,
        sku: parsed.data.sku,
        slug: slugify(parsed.data.slug ?? "") || slugify(parsed.data.name),
        brand: parsed.data.brand,
        category: parsed.data.category,
        priceCents: Math.round(parsed.data.price * 100),
        stock: parsed.data.stock,
        imageUrl: parsed.data.imageUrl,
        description: parsed.data.description,
        badge: parsed.data.badge,
        isFeatured: parsed.data.isFeatured,
        isNewArrival: parsed.data.isNewArrival,
        isBestseller: parsed.data.isBestseller,
        rating: parsed.data.rating,
        reviewCount: parsed.data.reviewCount,
        tags: parsed.data.tags,
        galleryImages: parsed.data.galleryImages,
      },
    });

    return NextResponse.json(
      serializeProduct(product),
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof Error && error.message.toLowerCase().includes("unique")) {
      return NextResponse.json({ message: "SKU already exists." }, { status: 409 });
    }

    return NextResponse.json({ message: "Unable to create product." }, { status: 500 });
  }
}