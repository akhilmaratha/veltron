import { prisma } from "@/lib/prisma";

type QueryInput = Record<string, unknown>;

interface HeroSlideRow {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  ctaLabel: string;
  ctaUrl: string;
  imageUrl: string;
  sortOrder: number;
  isActive: boolean;
  startsAt: Date | null;
  endsAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

interface CategoryRow {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

interface HeroSlideDelegateLike {
  findMany(args?: QueryInput): Promise<HeroSlideRow[]>;
  create(args: { data: QueryInput }): Promise<HeroSlideRow>;
  update(args: { where: QueryInput; data: QueryInput }): Promise<HeroSlideRow>;
  delete(args: { where: QueryInput }): Promise<HeroSlideRow>;
}

interface CategoryDelegateLike {
  findMany(args?: QueryInput): Promise<CategoryRow[]>;
  create(args: { data: QueryInput }): Promise<CategoryRow>;
  update(args: { where: QueryInput; data: QueryInput }): Promise<CategoryRow>;
  delete(args: { where: QueryInput }): Promise<CategoryRow>;
}

export const prismaModels = prisma as typeof prisma & {
  heroSlide: HeroSlideDelegateLike;
  category: CategoryDelegateLike;
};
