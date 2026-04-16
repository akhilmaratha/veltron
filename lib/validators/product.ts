import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(2, "Product name is required."),
  sku: z.string().min(3, "SKU is required."),
  slug: z.string().min(2, "Slug is required.").optional(),
  brand: z.string().optional(),
  category: z.string().min(2, "Category is required."),
  price: z.number().positive("Price must be greater than zero."),
  stock: z.number().int().nonnegative("Stock cannot be negative."),
  imageUrl: z.string().url("A valid image URL is required."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  badge: z.string().optional(),
  isFeatured: z.boolean().default(false),
  isNewArrival: z.boolean().default(false),
  isBestseller: z.boolean().default(false),
  rating: z.number().min(0).max(5).optional(),
  reviewCount: z.number().int().nonnegative().optional(),
  tags: z.array(z.string()).default([]),
  galleryImages: z.array(z.string().url()).default([]),
});

export type CreateProductValues = z.infer<typeof createProductSchema>;