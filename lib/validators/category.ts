import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(2, "Category name is required."),
  slug: z
    .string()
    .min(2, "Category slug is required.")
    .regex(/^[a-z0-9-]+$/, "Slug must contain lowercase letters, numbers, or hyphens."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  imageUrl: z.string().url("Image URL must be valid."),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().min(0).max(999),
});

export const categoryUpdateSchema = categorySchema.partial();
