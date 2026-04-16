import { NextResponse } from "next/server";
import { prismaModels } from "@/lib/prisma-models";

interface CategoryRecord {
  slug: string;
  name: string;
  description: string;
  imageUrl: string;
}

export async function GET() {
  try {
    const items = await prismaModels.category.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      take: 50,
    });

    return NextResponse.json(
      {
        items: items.map((item: CategoryRecord) => ({
          key: item.slug,
          label: item.name,
          description: item.description,
          image: item.imageUrl,
        })),
      },
      { status: 200 },
    );
  } catch {
    return NextResponse.json({ items: [] }, { status: 200 });
  }
}
