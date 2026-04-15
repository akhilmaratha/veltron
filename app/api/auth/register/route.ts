import { NextResponse } from "next/server";
import { enforceRateLimit, getRateLimitIdentifier } from "@/lib/rate-limit";
import { prisma } from "@/lib/prisma";
import { signupSchema } from "@/lib/validators/auth";
import { hashPassword } from "@/lib/password";

export async function POST(request: Request) {
  try {
    const rateLimit = await enforceRateLimit({
      keyPrefix: "auth-register",
      identifier: getRateLimitIdentifier(request),
      limit: 5,
      windowSeconds: 10 * 60,
    });

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { message: "Too many signup attempts. Please try again shortly." },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimit.retryAfterSeconds),
          },
        },
      );
    }

    const json = await request.json();
    const parsed = signupSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        {
          message: parsed.error.issues[0]?.message ?? "Invalid request.",
        },
        { status: 400 },
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: parsed.data.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email already exists." },
        { status: 409 },
      );
    }

    const passwordHash = await hashPassword(parsed.data.password);

    const user = await prisma.user.create({
      data: {
        email: parsed.data.email,
        name: parsed.data.name,
        passwordHash,
        provider: "credentials",
        role: "customer",
      },
    });

    return NextResponse.json(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return NextResponse.json(
        { message: "User with this email already exists." },
        { status: 409 },
      );
    }

    return NextResponse.json({ message: "Unable to register user." }, { status: 500 });
  }
}