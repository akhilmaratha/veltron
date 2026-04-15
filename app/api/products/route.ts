import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createProductSchema } from "@/lib/validators/product";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 100,
    });

    return NextResponse.json({
      items: products.map((item) => ({
        id: item.id,
        name: item.name,
        sku: item.sku,
        category: item.category,
        price: item.priceCents / 100,
        stock: item.stock,
        image: item.imageUrl,
      })),
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
        category: parsed.data.category,
        priceCents: Math.round(parsed.data.price * 100),
        stock: parsed.data.stock,
        imageUrl: parsed.data.imageUrl,
        description: parsed.data.description,
      },
    });

    return NextResponse.json(
      {
        id: product.id,
        name: product.name,
        sku: product.sku,
        category: product.category,
        price: product.priceCents / 100,
        stock: product.stock,
        image: product.imageUrl,
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof Error && error.message.toLowerCase().includes("unique")) {
      return NextResponse.json({ message: "SKU already exists." }, { status: 409 });
    }

    return NextResponse.json({ message: "Unable to create product." }, { status: 500 });
  }
}