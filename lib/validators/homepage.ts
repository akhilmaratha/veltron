import { z } from "zod";

export const heroSlideSchema = z.object({
  eyebrow: z.string().min(2, "Eyebrow text is required."),
  title: z.string().min(3, "Title is required."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  ctaLabel: z.string().min(2, "CTA label is required."),
  ctaUrl: z.string().min(1, "CTA URL is required."),
  imageUrl: z.string().url("Image URL must be valid."),
  sortOrder: z.number().int().min(0).max(999),
  isActive: z.boolean().default(true),
  startsAt: z.string().datetime().optional().or(z.literal("")),
  endsAt: z.string().datetime().optional().or(z.literal("")),
});

export const heroSlideUpdateSchema = heroSlideSchema.partial();

export type HeroSlideInput = z.infer<typeof heroSlideSchema>;
