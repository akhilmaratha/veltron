import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const where: Record<string, unknown> =
      status && status !== "all" ? { paymentStatus: status } : {};

    const orders = await prisma.order.findMany({
      where,
      include: {
        items: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 100,
    });

    const formattedOrders = orders.map((order) => ({
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
    }));

    return NextResponse.json({
      items: formattedOrders,
      count: formattedOrders.length,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ message: "Unable to fetch orders." }, { status: 500 });
  }
}
