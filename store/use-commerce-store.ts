"use client";

import { create } from "zustand";
import toast from "react-hot-toast";
import type { CartItemData } from "@/types/commerce";
import { cartItems, homepageProducts, wishlistItems } from "@/lib/commerce-data";

function getItemLabel(itemId: string, state: { cartItems: CartItemData[] }): string {
  const fromCart = state.cartItems.find((cartItem) => cartItem.id === itemId);
  if (fromCart) {
    return fromCart.name;
  }

  const fromCatalog = homepageProducts.find((product) => product.id === itemId);
  if (fromCatalog) {
    return fromCatalog.name;
  }

  const fromWishlistSeed = wishlistItems.find((item) => item.id === itemId);
  if (fromWishlistSeed) {
    return fromWishlistSeed.title;
  }

  return "Product";
}

interface CommerceState {
  cartItems: CartItemData[];
  wishlistIds: string[];
  addToCart: (item: CartItemData) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  toggleWishlist: (itemId: string) => void;
  isWishlisted: (itemId: string) => boolean;
}

export const useCommerceStore = create<CommerceState>((set, get) => ({
  cartItems: cartItems.map((item) => ({ ...item })),
  wishlistIds: wishlistItems.map((item) => item.id),
  addToCart: (item) =>
    set((state) => {
      const existingItem = state.cartItems.find((cartItem) => cartItem.id === item.id);

      if (existingItem) {
        toast.success(`${item.name} quantity updated in cart.`);
        return {
          cartItems: state.cartItems.map((cartItem) =>
            cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem,
          ),
        };
      }

      toast.success(`${item.name} added to cart.`);
      return { cartItems: [...state.cartItems, item] };
    }),
  removeFromCart: (itemId) =>
    set((state) => {
      const removedItem = state.cartItems.find((cartItem) => cartItem.id === itemId);

      if (removedItem) {
        toast.success(`${removedItem.name} removed from cart.`);
      }

      return {
        cartItems: state.cartItems.filter((cartItem) => cartItem.id !== itemId),
      };
    }),
  updateQuantity: (itemId, quantity) =>
    set((state) => ({
      cartItems: state.cartItems
        .map((cartItem) =>
          cartItem.id === itemId ? { ...cartItem, quantity: Math.max(quantity, 1) } : cartItem,
        )
        .filter((cartItem) => cartItem.quantity > 0),
    })),
  toggleWishlist: (itemId) =>
    set((state) => {
      const isAlreadySaved = state.wishlistIds.includes(itemId);
      const label = getItemLabel(itemId, state);

      if (isAlreadySaved) {
        toast.success(`${label} removed from wishlist.`);
      } else {
        toast.success(`${label} saved to wishlist.`);
      }

      return {
        wishlistIds: isAlreadySaved
          ? state.wishlistIds.filter((savedId) => savedId !== itemId)
          : [...state.wishlistIds, itemId],
      };
    }),
  isWishlisted: (itemId) => get().wishlistIds.includes(itemId),
}));