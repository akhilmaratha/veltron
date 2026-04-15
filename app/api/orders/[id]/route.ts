import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateStatusSchema = z.object({
  status: z.enum(["pending", "paid", "packed", "shipped", "delivered", "failed", "refunded"]),
});

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const json = await request.json();
    const parsed = updateStatusSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Invalid status provided." },
        { status: 400 },
      );
    }

    const order = await prisma.order.update({
      where: { id },
      data: {
        paymentStatus: parsed.data.status,
        updatedAt: new Date(),
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json({
      id: order.id,
      orderId: order.razorpayOrderId,
      paymentId: order.razorpayPaymentId,
      customerName: `${order.customerFirstName} ${order.customerLastName}`,
      customerEmail: order.customerEmail,
      amount: order.amount / 100,
      currency: order.currency,
      paymentStatus: order.paymentStatus,
      shippingMethod: order.shippingMethod,
      itemCount: order.items.length,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
    });
  } catch (error) {
    if (error instanceof Error && error.message.toLowerCase().includes("not found")) {
      return NextResponse.json({ message: "Order not found." }, { status: 404 });
    }

    return NextResponse.json({ message: "Unable to update order status." }, { status: 500 });
  }
}
