import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { prismaModels } from "@/lib/prisma-models";
import { categorySchema } from "@/lib/validators/category";

async function ensureAdmin(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  return token?.role === "admin";
}

export async function GET(request: NextRequest) {
  try {
    if (!(await ensureAdmin(request))) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const items = await prismaModels.category.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      take: 100,
    });

    return NextResponse.json({ items }, { status: 200 });
  } catch {
    return NextResponse.json({ message: "Unable to load categories." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!(await ensureAdmin(request))) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const json = await request.json();
    const parsed = categorySchema.safeParse({
      ...json,
      sortOrder: Number(json?.sortOrder ?? 0),
      isActive: Boolean(json?.isActive),
    });

    if (!parsed.success) {
      return NextResponse.json(
        { message: parsed.error.issues[0]?.message ?? "Invalid payload." },
        { status: 400 },
      );
    }

    const category = await prismaModels.category.create({
      data: {
        name: parsed.data.name,
        slug: parsed.data.slug,
        description: parsed.data.description,
        imageUrl: parsed.data.imageUrl,
        isActive: parsed.data.isActive,
        sortOrder: parsed.data.sortOrder,
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message.toLowerCase().includes("unique")) {
      return NextResponse.json({ message: "Category slug already exists." }, { status: 409 });
    }

    return NextResponse.json({ message: "Unable to create category." }, { status: 500 });
  }
}
