import { z } from "zod";

export const checkoutFormSchema = z.object({
  firstName: z.string().min(2, "First name is required."),
  lastName: z.string().min(2, "Last name is required."),
  email: z.string().email("Please enter a valid email address."),
  address: z.string().min(8, "Please provide a full address."),
  city: z.string().min(2, "City is required."),
  postalCode: z.string().min(3, "Postal code is required."),
  country: z.string().min(2, "Country is required."),
  shippingMethod: z.enum(["standard", "express"]),
});

export type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;