import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { prismaModels } from "@/lib/prisma-models";
import { categoryUpdateSchema } from "@/lib/validators/category";

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
    const parsed = categoryUpdateSchema.safeParse({
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

    const updated = await prismaModels.category.update({
      where: { id },
      data: {
        name: parsed.data.name,
        slug: parsed.data.slug,
        description: parsed.data.description,
        imageUrl: parsed.data.imageUrl,
        isActive: parsed.data.isActive,
        sortOrder: parsed.data.sortOrder,
      },
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    if (error instanceof Error && error.message.toLowerCase().includes("unique")) {
      return NextResponse.json({ message: "Category slug already exists." }, { status: 409 });
    }

    return NextResponse.json({ message: "Unable to update category." }, { status: 500 });
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
    await prismaModels.category.delete({ where: { id } });

    return NextResponse.json({ message: "Deleted." }, { status: 200 });
  } catch {
    return NextResponse.json({ message: "Unable to delete category." }, { status: 500 });
  }
}
