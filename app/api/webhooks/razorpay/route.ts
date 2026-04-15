import { NextResponse } from "next/server";
import { verifyRazorpayWebhookSignature } from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";

interface RazorpayWebhookPayload {
  event: string;
  created_at: number;
  entity: {
    id: string;
    entity: string;
    amount: number;
    currency: string;
    status: string;
    order_id?: string;
    [key: string]: unknown;
  };
}

export async function POST(request: Request) {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error("RAZORPAY_WEBHOOK_SECRET not configured");
    return NextResponse.json({ message: "Webhook not configured." }, { status: 500 });
  }

  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-razorpay-signature");

    if (!signature) {
      return NextResponse.json({ message: "Missing signature." }, { status: 401 });
    }

    const isValid = verifyRazorpayWebhookSignature(rawBody, signature, webhookSecret);
    if (!isValid) {
      console.warn("Invalid Razorpay webhook signature");
      return NextResponse.json({ message: "Invalid signature." }, { status: 401 });
    }

    const payload = JSON.parse(rawBody) as RazorpayWebhookPayload;
    const eventId = `razorpay_${payload.entity.id}`;

    const existingLog = await prisma.webhookLog.findUnique({
      where: { eventId },
    });

    if (existingLog) {
      return NextResponse.json({ message: "Webhook already processed." }, { status: 200 });
    }

    const eventType = payload.event;
    const referenceId = payload.entity.order_id ?? payload.entity.id;

    await prisma.webhookLog.create({
      data: {
        provider: "razorpay",
        eventId,
        eventType,
        referenceId,
        payload: rawBody,
        status: "processed",
      },
    });

    if (eventType === "payment.captured") {
      try {
        await prisma.order.updateMany({
          where: {
            razorpayOrderId: referenceId,
          },
          data: {
            paymentStatus: "paid",
            updatedAt: new Date(),
          },
        });
      } catch (error) {
        console.error("Failed to update order on payment.captured:", error);
      }
    } else if (eventType === "payment.failed") {
      try {
        await prisma.order.updateMany({
          where: {
            razorpayOrderId: referenceId,
          },
          data: {
            paymentStatus: "failed",
            updatedAt: new Date(),
          },
        });
      } catch (error) {
        console.error("Failed to update order on payment.failed:", error);
      }
    }

    return NextResponse.json({ status: "received" }, { status: 200 });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json({ message: "Webhook processing failed." }, { status: 500 });
  }
}
