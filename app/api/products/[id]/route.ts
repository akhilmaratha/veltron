import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createProductSchema } from "@/lib/validators/product";

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
      id: product.id,
      name: product.name,
      sku: product.sku,
      category: product.category,
      price: product.priceCents / 100,
      stock: product.stock,
      image: product.imageUrl,
      description: product.description,
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
    if (parsed.data.category !== undefined) updateData.category = parsed.data.category;
    if (parsed.data.price !== undefined) updateData.priceCents = Math.round(parsed.data.price * 100);
    if (parsed.data.stock !== undefined) updateData.stock = parsed.data.stock;
    if (parsed.data.imageUrl !== undefined) updateData.imageUrl = parsed.data.imageUrl;
    if (parsed.data.description !== undefined) updateData.description = parsed.data.description;

    const product = await prisma.product.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      id: product.id,
      name: product.name,
      sku: product.sku,
      category: product.category,
      price: product.priceCents / 100,
      stock: product.stock,
      image: product.imageUrl,
      description: product.description,
    });
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
