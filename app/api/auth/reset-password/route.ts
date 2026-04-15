import { NextResponse } from "next/server";
import { enforceRateLimit, getRateLimitIdentifier } from "@/lib/rate-limit";
import { prisma } from "@/lib/prisma";
import { hashPassword, hashResetToken } from "@/lib/password";
import { resetPasswordSchema } from "@/lib/validators/auth";

export async function POST(request: Request) {
  try {
    const rateLimit = await enforceRateLimit({
      keyPrefix: "auth-reset-password",
      identifier: getRateLimitIdentifier(request),
      limit: 10,
      windowSeconds: 15 * 60,
    });

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { message: "Too many password reset attempts. Please try again later." },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimit.retryAfterSeconds),
          },
        },
      );
    }

    const json = await request.json();
    const parsed = resetPasswordSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { message: parsed.error.issues[0]?.message ?? "Invalid request." },
        { status: 400 },
      );
    }

    const tokenHash = hashResetToken(parsed.data.token);

    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    });

    if (!resetToken || resetToken.usedAt || resetToken.expiresAt < new Date()) {
      return NextResponse.json({ message: "Reset link is invalid or expired." }, { status: 400 });
    }

    const newPasswordHash = await hashPassword(parsed.data.password);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: resetToken.userId },
        data: {
          passwordHash: newPasswordHash,
          provider: "credentials",
          updatedAt: new Date(),
        },
      }),
      prisma.passwordResetToken.update({
        where: { id: resetToken.id },
        data: {
          usedAt: new Date(),
        },
      }),
    ]);

    return NextResponse.json({ message: "Password reset successful." }, { status: 200 });
  } catch {
    return NextResponse.json({ message: "Unable to reset password." }, { status: 500 });
  }
}
