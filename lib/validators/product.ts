import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(2, "Product name is required."),
  sku: z.string().min(3, "SKU is required."),
  category: z.string().min(2, "Category is required."),
  price: z.number().positive("Price must be greater than zero."),
  stock: z.number().int().nonnegative("Stock cannot be negative."),
  imageUrl: z.string().url("A valid image URL is required."),
  description: z.string().min(10, "Description must be at least 10 characters."),
});

export type CreateProductValues = z.infer<typeof createProductSchema>;