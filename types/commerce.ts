export type TrendDirection = "up" | "down" | "flat";

export type OrderStatus = "Delivered" | "Processing" | "Pending" | "Shipped" | "Returned";

export type ShippingMethod = "standard" | "express";

export interface NavItem {
  label: string;
  href: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
  badge?: string;
}

export interface StatCardData {
  label: string;
  value: string;
  trend: string;
  direction: TrendDirection;
}

export interface OrderRowData {
  id: string;
  customer: string;
  product: string;
  price: string;
  status: OrderStatus;
  date: string;
  avatar: string;
}

export interface CouponData {
  id: string;
  title: string;
  description: string;
  code: string;
  expiresAt: string;
  image: string;
  featured?: boolean;
}

export interface CartItemData {
  id: string;
  name: string;
  variant: string;
  price: number;
  quantity: number;
  image: string;
}

export interface WishlistItemData {
  id: string;
  category: string;
  title: string;
  price: number;
  image: string;
}

export interface ProfilePurchaseData {
  id: string;
  title: string;
  date: string;
  value: string;
  image: string;
}

export interface ShippingOptionData {
  id: ShippingMethod;
  title: string;
  description: string;
  price: string;
}

export interface StepData {
  id: string;
  label: string;
}