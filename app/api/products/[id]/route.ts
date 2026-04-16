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

function serializeProduct(product: {
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
    id: product.id,
    name: product.name,
    sku: product.sku,
    slug: product.slug ?? "",
    brand: product.brand,
    category: product.category,
    price: product.priceCents / 100,
    stock: product.stock,
    image: product.imageUrl,
    description: product.description,
    badge: product.badge ?? undefined,
    isFeatured: product.isFeatured ?? false,
    isNewArrival: product.isNewArrival ?? false,
    isBestseller: product.isBestseller ?? false,
    rating: product.rating ?? undefined,
    reviewCount: product.reviewCount ?? undefined,
    tags: product.tags ?? [],
    galleryImages: product.galleryImages ?? [],
  };
}

const updateProductSchema = createProductSchema.partial();

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return NextResponse.json({ message: "Product not found." }, { status: 404 });
    }

    return NextResponse.json({
      ...serializeProduct(product),
    });
  } catch {
    return NextResponse.json({ message: "Unable to fetch product." }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const json = await request.json();
    const parsed = updateProductSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { message: parsed.error.issues[0]?.message ?? "Invalid request payload." },
        { status: 400 },
      );
    }

    const updateData: Record<string, unknown> = {};

    if (parsed.data.name !== undefined) updateData.name = parsed.data.name;
    if (parsed.data.sku !== undefined) updateData.sku = parsed.data.sku;
    if (parsed.data.slug !== undefined) {
      const normalizedSlug = slugify(parsed.data.slug);
      if (normalizedSlug) {
        updateData.slug = normalizedSlug;
      }
    }
    if (parsed.data.brand !== undefined) updateData.brand = parsed.data.brand;
    if (parsed.data.category !== undefined) updateData.category = parsed.data.category;
    if (parsed.data.price !== undefined) updateData.priceCents = Math.round(parsed.data.price * 100);
    if (parsed.data.stock !== undefined) updateData.stock = parsed.data.stock;
    if (parsed.data.imageUrl !== undefined) updateData.imageUrl = parsed.data.imageUrl;
    if (parsed.data.description !== undefined) updateData.description = parsed.data.description;
    if (parsed.data.badge !== undefined) updateData.badge = parsed.data.badge;
    if (parsed.data.isFeatured !== undefined) updateData.isFeatured = parsed.data.isFeatured;
    if (parsed.data.isNewArrival !== undefined) updateData.isNewArrival = parsed.data.isNewArrival;
    if (parsed.data.isBestseller !== undefined) updateData.isBestseller = parsed.data.isBestseller;
    if (parsed.data.rating !== undefined) updateData.rating = parsed.data.rating;
    if (parsed.data.reviewCount !== undefined) updateData.reviewCount = parsed.data.reviewCount;
    if (parsed.data.tags !== undefined) updateData.tags = parsed.data.tags;
    if (parsed.data.galleryImages !== undefined) updateData.galleryImages = parsed.data.galleryImages;

    const product = await prisma.product.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(serializeProduct(product));
  } catch (error) {
    if (error instanceof Error && error.message.toLowerCase().includes("unique")) {
      return NextResponse.json({ message: "SKU already exists." }, { status: 409 });
    }

    return NextResponse.json({ message: "Unable to update product." }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Product deleted." }, { status: 200 });
  } catch (error) {
    if (error instanceof Error && error.message.toLowerCase().includes("not found")) {
      return NextResponse.json({ message: "Product not found." }, { status: 404 });
    }

    return NextResponse.json({ message: "Unable to delete product." }, { status: 500 });
  }
}
