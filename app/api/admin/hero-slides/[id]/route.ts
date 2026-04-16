import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { prismaModels } from "@/lib/prisma-models";
import { heroSlideUpdateSchema } from "@/lib/validators/homepage";

async function ensureAdmin(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  return token?.role === "admin";
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    if (!(await ensureAdmin(request))) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const { id } = await params;
    const json = await request.json();
    const parsed = heroSlideUpdateSchema.safeParse({
      ...json,
      sortOrder: json?.sortOrder !== undefined ? Number(json.sortOrder) : undefined,
      isActive: json?.isActive !== undefined ? Boolean(json.isActive) : undefined,
    });

    if (!parsed.success) {
      return NextResponse.json(
        { message: parsed.error.issues[0]?.message ?? "Invalid payload." },
        { status: 400 },
      );
    }

    const updated = await prismaModels.heroSlide.update({
      where: { id },
      data: {
        eyebrow: parsed.data.eyebrow,
        title: parsed.data.title,
        description: parsed.data.description,
        ctaLabel: parsed.data.ctaLabel,
        ctaUrl: parsed.data.ctaUrl,
        imageUrl: parsed.data.imageUrl,
        sortOrder: parsed.data.sortOrder,
        isActive: parsed.data.isActive,
        startsAt:
          parsed.data.startsAt !== undefined
            ? parsed.data.startsAt
              ? new Date(parsed.data.startsAt)
              : null
            : undefined,
        endsAt:
          parsed.data.endsAt !== undefined
            ? parsed.data.endsAt
              ? new Date(parsed.data.endsAt)
              : null
            : undefined,
      },
    });

    return NextResponse.json(updated, { status: 200 });
  } catch {
    return NextResponse.json({ message: "Unable to update hero slide." }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    if (!(await ensureAdmin(request))) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const { id } = await params;

    await prismaModels.heroSlide.delete({ where: { id } });

    return NextResponse.json({ message: "Deleted." }, { status: 200 });
  } catch {
    return NextResponse.json({ message: "Unable to delete hero slide." }, { status: 500 });
  }
}
