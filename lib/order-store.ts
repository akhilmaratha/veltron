import { PaymentStatus, ShippingMethod as PrismaShippingMethod } from "@prisma/client";
import type { CartItemData, ShippingMethod } from "@/types/commerce";
import { prisma } from "@/lib/prisma";

export interface CheckoutCustomer {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface PersistedOrder {
  id: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  amount: number;
  currency: string;
  shippingMethod: ShippingMethod;
  customer: CheckoutCustomer;
  items: CartItemData[];
  status: "paid" | "failed" | "refunded";
  createdAt: string;
}

function toPrismaShippingMethod(method: ShippingMethod): PrismaShippingMethod {
  return method === "express" ? PrismaShippingMethod.express : PrismaShippingMethod.standard;
}

function mapOrderResult(order: {
  id: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  amount: number;
  currency: string;
  shippingMethod: PrismaShippingMethod;
  paymentStatus: PaymentStatus;
  customerFirstName: string;
  customerLastName: string;
  customerEmail: string;
  customerAddress: string;
  customerCity: string;
  customerPostalCode: string;
  customerCountry: string;
  createdAt: Date;
  items: {
    productId: string;
    name: string;
    variant: string;
    image: string | null;
    unitPrice: number;
    quantity: number;
  }[];
}): PersistedOrder {
  return {
    id: order.id,
    razorpayOrderId: order.razorpayOrderId,
    razorpayPaymentId: order.razorpayPaymentId,
    amount: order.amount,
    currency: order.currency,
    shippingMethod: order.shippingMethod,
    customer: {
      firstName: order.customerFirstName,
      lastName: order.customerLastName,
      email: order.customerEmail,
      address: order.customerAddress,
      city: order.customerCity,
      postalCode: order.customerPostalCode,
      country: order.customerCountry,
    },
    items: order.items.map((item) => ({
      id: item.productId,
      name: item.name,
      variant: item.variant,
      image: item.image ?? "",
      price: item.unitPrice / 100,
      quantity: item.quantity,
    })),
    status: order.paymentStatus,
    createdAt: order.createdAt.toISOString(),
  };
}

export async function savePaidOrder(
  order: Omit<PersistedOrder, "id" | "createdAt" | "status">,
): Promise<PersistedOrder> {
  const existingOrder = await prisma.order.findUnique({
    where: {
      razorpayPaymentId: order.razorpayPaymentId,
    },
    include: {
      items: true,
    },
  });

  if (existingOrder) {
    return mapOrderResult(existingOrder);
  }

  const createdOrder = await prisma.order.create({
    data: {
      razorpayOrderId: order.razorpayOrderId,
      razorpayPaymentId: order.razorpayPaymentId,
      amount: order.amount,
      currency: order.currency,
      shippingMethod: toPrismaShippingMethod(order.shippingMethod),
      paymentStatus: PaymentStatus.paid,
      customerFirstName: order.customer.firstName,
      customerLastName: order.customer.lastName,
      customerEmail: order.customer.email,
      customerAddress: order.customer.address,
      customerCity: order.customer.city,
      customerPostalCode: order.customer.postalCode,
      customerCountry: order.customer.country,
      items: {
        create: order.items.map((item) => {
          const unitPrice = Math.round(item.price * 100);

          return {
            productId: item.id,
            name: item.name,
            variant: item.variant,
            unitPrice,
            quantity: item.quantity,
            lineTotal: unitPrice * item.quantity,
            image: item.image,
          };
        }),
      },
    },
    include: {
      items: true,
    },
  });

  return mapOrderResult(createdOrder);
}