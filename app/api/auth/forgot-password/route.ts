import { NextResponse } from "next/server";
import { sendPasswordResetEmail } from "@/lib/brevo";
import { enforceRateLimit, getRateLimitIdentifier } from "@/lib/rate-limit";
import { prisma } from "@/lib/prisma";
import { forgotPasswordSchema } from "@/lib/validators/auth";
import { generateResetToken, hashResetToken } from "@/lib/password";

const RESET_TOKEN_TTL_MINUTES = 30;

export async function POST(request: Request) {
  try {
    const rateLimit = await enforceRateLimit({
      keyPrefix: "auth-forgot-password",
      identifier: getRateLimitIdentifier(request),
      limit: 5,
      windowSeconds: 15 * 60,
    });

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { message: "Too many reset requests. Please try again later." },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimit.retryAfterSeconds),
          },
        },
      );
    }

    const json = await request.json();
    const parsed = forgotPasswordSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { message: parsed.error.issues[0]?.message ?? "Invalid request." },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: parsed.data.email },
      select: { id: true, email: true },
    });

    if (!user) {
      return NextResponse.json({ message: "If this email exists, a reset link has been sent." }, { status: 200 });
    }

    const token = generateResetToken();
    const tokenHash = hashResetToken(token);
    const expiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MINUTES * 60 * 1000);

    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt,
      },
    });

    const resetUrl = `${process.env.NEXTAUTH_URL ?? "http://localhost:3000"}/reset-password?token=${token}`;
    await sendPasswordResetEmail({
      toEmail: user.email,
      resetUrl,
    });

    return NextResponse.json(
      {
        message: "If this email exists, a reset link has been sent.",
      },
      { status: 200 },
    );
  } catch {
    return NextResponse.json({ message: "Unable to process forgot password request." }, { status: 500 });
  }
}
