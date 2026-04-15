import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { z } from "zod";

const cartItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  variant: z.string(),
  price: z.number().nonnegative(),
  quantity: z.number().int().positive(),
  image: z.string().url().optional(),
});

const createOrderSchema = z.object({
  items: z.array(cartItemSchema).min(1, "Cart cannot be empty."),
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
    if (!razorpay || !razorpayKeyId) {
      return NextResponse.json(
        { message: "Razorpay is not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET." },
        { status: 500 },
      );
    }

    const json = await request.json();
    const parsed = createOrderSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { message: parsed.error.issues[0]?.message ?? "Invalid request payload." },
        { status: 400 },
      );
    }

    const subtotal = parsed.data.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
    const shipping = parsed.data.shippingMethod === "express" ? 25 : 12;
    const tax = subtotal * 0.08;
    const totalAmount = subtotal + shipping + tax;

    const currency = process.env.RAZORPAY_CURRENCY ?? "INR";
    const amountInMinorUnit = Math.round(totalAmount * 100);

    const order = await razorpay.orders.create({
      amount: amountInMinorUnit,
      currency,
      receipt: `veltron_${Date.now()}`,
      notes: {
        shippingMethod: parsed.data.shippingMethod,
        customerName: `${parsed.data.customer.firstName} ${parsed.data.customer.lastName}`,
      },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: razorpayKeyId,
      customer: {
        name: `${parsed.data.customer.firstName} ${parsed.data.customer.lastName}`,
        email: parsed.data.customer.email,
      },
    });
  } catch {
    return NextResponse.json({ message: "Unable to create Razorpay order." }, { status: 500 });
  }
}