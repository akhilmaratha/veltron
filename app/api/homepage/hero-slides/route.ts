import { NextResponse } from "next/server";
import { prismaModels } from "@/lib/prisma-models";

export async function GET() {
  try {
    const now = new Date();

    const slides = await prismaModels.heroSlide.findMany({
      where: {
        isActive: true,
        OR: [{ startsAt: null }, { startsAt: { lte: now } }],
        AND: [{ OR: [{ endsAt: null }, { endsAt: { gte: now } }] }],
      },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      take: 10,
    });

    return NextResponse.json(
      {
        items: slides.map((slide) => ({
          id: slide.id,
          eyebrow: slide.eyebrow,
          title: slide.title,
          description: slide.description,
          ctaLabel: slide.ctaLabel,
          href: slide.ctaUrl,
          image: slide.imageUrl,
        })),
      },
      { status: 200 },
    );
  } catch {
    return NextResponse.json({ items: [] }, { status: 200 });
  }
}
