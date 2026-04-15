"use client";

import { useState } from "react";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import BottomNavBar from "@/components/bottom-nav-bar";
import Footer from "@/components/footer";
import CartSummary from "@/components/commerce/cart-summary";
import FormField from "@/components/commerce/form-field";
import StepIndicator from "@/components/commerce/step-indicator";
import TopAppBar from "@/components/top-app-bar";
import { cartItems, shippingOptions } from "@/lib/commerce-data";
import { CheckoutFormValues, checkoutFormSchema } from "@/lib/validators/checkout";
import { useCommerceStore } from "@/store/use-commerce-store";

const checkoutSteps = [
  { id: "cart", label: "Cart" },
  { id: "shipping", label: "Shipping" },
  { id: "payment", label: "Payment" },
  { id: "confirm", label: "Confirmation" },
];

type CreateOrderResponse = {
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
  customer?: { name: string; email: string };
};

const loadRazorpayScript = async () => {
  if (typeof window === "undefined") {
    return false;
  }

  if (window.Razorpay) {
    return true;
  }

  return new Promise<boolean>((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function CheckoutPage() {
  const router = useRouter();
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const cartItemsFromStore = useCommerceStore((state) => state.cartItems);
  const effectiveCartItems = cartItemsFromStore.length > 0 ? cartItemsFromStore : cartItems;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      address: "",
      city: "",
      postalCode: "",
      country: "United Kingdom",
      shippingMethod: "standard",
    },
  });

  const selectedShipping = watch("shippingMethod");

  const checkoutMutation = useMutation({
    mutationFn: async (values: CheckoutFormValues) => {
      const response = await fetch("/api/checkout/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: effectiveCartItems,
          shippingMethod: values.shippingMethod,
          customer: {
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            address: values.address,
            city: values.city,
            postalCode: values.postalCode,
            country: values.country,
          },
        }),
      });

      const payload = (await response.json()) as {
        orderId?: string;
        amount?: number;
        currency?: string;
        keyId?: string;
        customer?: { name: string; email: string };
        message?: string;
      };

      if (!response.ok || !payload.orderId || !payload.amount || !payload.currency || !payload.keyId) {
        throw new Error(payload.message ?? "Unable to create checkout order.");
      }

      return {
        orderId: payload.orderId,
        amount: payload.amount,
        currency: payload.currency,
        keyId: payload.keyId,
        customer: payload.customer,
      } satisfies CreateOrderResponse;
    },
    onSuccess: async (orderPayload) => {
      const loaded = await loadRazorpayScript();

      if (!loaded || !window.Razorpay) {
        setCheckoutError("Razorpay client could not be initialized.");
        return;
      }

      const paymentObject = new window.Razorpay({
        key: orderPayload.keyId,
        amount: orderPayload.amount,
        currency: orderPayload.currency,
        name: "Veltron",
        description: "Technology, Refined.",
        order_id: orderPayload.orderId,
        prefill: {
          name: orderPayload.customer?.name,
          email: orderPayload.customer?.email,
        },
        handler: async (response) => {
          try {
            const verifyResponse = await fetch("/api/checkout/verify-payment", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                shippingMethod: watch("shippingMethod"),
                customer: {
                  firstName: watch("firstName"),
                  lastName: watch("lastName"),
                  email: watch("email"),
                  address: watch("address"),
                  city: watch("city"),
                  postalCode: watch("postalCode"),
                  country: watch("country"),
                },
                items: effectiveCartItems,
              }),
            });

            const verifyPayload = (await verifyResponse.json()) as {
              verified?: boolean;
              orderId?: string;
              paymentId?: string;
              message?: string;
            };

            if (!verifyResponse.ok || !verifyPayload.verified || !verifyPayload.orderId) {
              setCheckoutError(verifyPayload.message ?? "Payment verification failed.");
              return;
            }

            const query = new URLSearchParams({
              payment_id: verifyPayload.paymentId ?? response.razorpay_payment_id,
              order_id: response.razorpay_order_id,
              record_id: verifyPayload.orderId,
            });

            router.push(`/checkout/success?${query.toString()}`);
          } catch {
            setCheckoutError("Payment verification failed.");
          }
        },
        modal: {
          ondismiss: () => {
            router.push("/checkout/cancel");
          },
        },
        theme: {
          color: "#C4622D",
        },
      });

      paymentObject.open();
    },
    onError: (error) => {
      setCheckoutError(error instanceof Error ? error.message : "Unable to process checkout.");
    },
  });

  const onSubmit = (values: CheckoutFormValues) => {
    setCheckoutError(null);
    checkoutMutation.mutate(values);
  };

  return (
    <>
      <TopAppBar activeHref="/checkout" />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
        <StepIndicator steps={checkoutSteps} currentStep={1} />

        <div className="mt-12 grid gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="space-y-10">
            <div>
              <p className="text-[10px] uppercase tracking-[0.24em] text-primary">Checkout</p>
              <h1 className="mt-4 font-heading text-5xl text-text-primary">Shipping Details</h1>
              <p className="mt-4 max-w-2xl text-text-muted">
                Please provide delivery details. Our curated shipments are packaged with archival-grade materials.
              </p>
            </div>

            <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <FormField
                    id="firstName"
                    label="First Name"
                    placeholder="Julian"
                    inputProps={register("firstName")}
                  />
                  {errors.firstName ? <p className="mt-2 text-sm text-danger">{errors.firstName.message}</p> : null}
                </div>
                <div>
                  <FormField
                    id="lastName"
                    label="Last Name"
                    placeholder="Vandervall"
                    inputProps={register("lastName")}
                  />
                  {errors.lastName ? <p className="mt-2 text-sm text-danger">{errors.lastName.message}</p> : null}
                </div>
              </div>
              <div>
                <FormField
                  id="email"
                  label="Email Address"
                  type="email"
                  placeholder="you@veltron.com"
                  inputProps={register("email")}
                />
                {errors.email ? <p className="mt-2 text-sm text-danger">{errors.email.message}</p> : null}
              </div>
              <div className="grid gap-6">
                <div>
                  <FormField
                    id="address"
                    label="Delivery Address"
                    placeholder="Street address, apartment, suite"
                    inputProps={register("address")}
                  />
                  {errors.address ? <p className="mt-2 text-sm text-danger">{errors.address.message}</p> : null}
                </div>
                <div className="grid gap-6 sm:grid-cols-3">
                  <div>
                    <FormField id="city" label="City" inputProps={register("city")} />
                    {errors.city ? <p className="mt-2 text-sm text-danger">{errors.city.message}</p> : null}
                  </div>
                  <div>
                    <FormField id="postalCode" label="Postal Code" inputProps={register("postalCode")} />
                    {errors.postalCode ? <p className="mt-2 text-sm text-danger">{errors.postalCode.message}</p> : null}
                  </div>
                  <label className="block">
                    <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.22em] text-text-muted">Country</span>
                    <select
                      {...register("country")}
                      className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-text-primary outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
                    >
                      <option>United Kingdom</option>
                      <option>United States</option>
                      <option>Japan</option>
                      <option>Germany</option>
                    </select>
                    {errors.country ? <p className="mt-2 text-sm text-danger">{errors.country.message}</p> : null}
                  </label>
                </div>
              </div>

              <div>
                <h2 className="font-heading text-2xl text-text-primary">Shipping Method</h2>
                <div className="mt-6 space-y-4">
                  {shippingOptions.map((option) => {
                    const selected = selectedShipping === option.id;

                    return (
                      <label
                        key={option.id}
                        className={`flex cursor-pointer items-center gap-4 rounded-lg border p-5 transition ${
                          selected ? "border-primary bg-primary/5" : "border-border bg-background"
                        }`}
                      >
                        <input
                          type="radio"
                          checked={selected}
                          value={option.id}
                          {...register("shippingMethod")}
                          className="h-4 w-4 border-border text-primary focus:ring-primary"
                        />
                        <div>
                          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-text-primary">{option.title}</p>
                          <p className="text-xs text-text-muted">{option.description}</p>
                        </div>
                        <span className="ml-auto font-heading text-lg text-text-primary">{option.price}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <button
                  type="submit"
                  disabled={checkoutMutation.isPending || effectiveCartItems.length === 0}
                  className="rounded-md bg-primary px-8 py-4 text-xs font-semibold uppercase tracking-[0.24em] text-background transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {checkoutMutation.isPending ? "Processing..." : "Continue to Payment"}
                </button>
                <Link href="/shopping-cart" className="text-xs font-semibold uppercase tracking-[0.24em] text-text-muted transition hover:text-primary">
                  Back to Cart
                </Link>
              </div>
            </form>
          </section>

          <div className="lg:sticky lg:top-24 lg:self-start">
            <CartSummary
              items={effectiveCartItems}
              checkoutLabel="Pay with Razorpay"
              onCheckout={() => {
                void handleSubmit(onSubmit)();
              }}
              isCheckoutLoading={checkoutMutation.isPending}
              checkoutError={checkoutError}
            />
          </div>
        </div>
      </main>
      <Footer />
      <BottomNavBar activeHref="/checkout" />
    </>
  );
}