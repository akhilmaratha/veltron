import { createHmac } from "node:crypto";
import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { z } from "zod";
import { savePaidOrder } from "@/lib/order-store";

const cartItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  variant: z.string(),
  price: z.number().nonnegative(),
  quantity: z.number().int().positive(),
  image: z.string().url().optional(),
});

const verifyPaymentSchema = z.object({
  razorpayOrderId: z.string().min(1),
  razorpayPaymentId: z.string().min(1),
  razorpaySignature: z.string().min(1),
  shippingMethod: z.enum(["standard", "express"]),
  customer: z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    address: z.string(),
    city: z.string(),
    postalCode: z.string(),
    country: z.string(),
  }),
  items: z.array(cartItemSchema).min(1),
});

const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

const razorpay =
  razorpayKeyId && razorpayKeySecret
    ? new Razorpay({
        key_id: razorpayKeyId,
        key_secret: razorpayKeySecret,
      })
    : null;

export async function POST(request: Request) {
  try {
    if (!razorpay || !razorpayKeySecret) {
      return NextResponse.json(
        { message: "Razorpay is not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET." },
        { status: 500 },
      );
    }

    const json = await request.json();
    const parsed = verifyPaymentSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { message: parsed.error.issues[0]?.message ?? "Invalid verification payload." },
        { status: 400 },
      );
    }

    const payload = parsed.data;
    const expectedSignature = createHmac("sha256", razorpayKeySecret)
      .update(`${payload.razorpayOrderId}|${payload.razorpayPaymentId}`)
      .digest("hex");

    if (expectedSignature !== payload.razorpaySignature) {
      return NextResponse.json({ message: "Invalid Razorpay signature." }, { status: 400 });
    }

    const fetchedOrder = await razorpay.orders.fetch(payload.razorpayOrderId);

    const subtotal = payload.items.reduce((total, item) => total + item.price * item.quantity, 0);
    const shipping = payload.shippingMethod === "express" ? 25 : 12;
    const tax = subtotal * 0.08;
    const expectedAmount = Math.round((subtotal + shipping + tax) * 100);

    if (fetchedOrder.amount !== expectedAmount) {
      return NextResponse.json({ message: "Order amount mismatch." }, { status: 400 });
    }

    const savedOrder = await savePaidOrder({
      razorpayOrderId: payload.razorpayOrderId,
      razorpayPaymentId: payload.razorpayPaymentId,
      amount: fetchedOrder.amount,
      currency: fetchedOrder.currency,
      customer: payload.customer,
      items: payload.items.map((item) => ({
        ...item,
        image: item.image ?? "",
      })),
      shippingMethod: payload.shippingMethod,
    });

    return NextResponse.json({
      verified: true,
      orderId: savedOrder.id,
      paymentId: payload.razorpayPaymentId,
    });
  } catch {
    return NextResponse.json({ message: "Unable to verify Razorpay payment." }, { status: 500 });
  }
}