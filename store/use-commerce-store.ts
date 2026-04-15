"use client";

import { create } from "zustand";
import type { CartItemData } from "@/types/commerce";
import { cartItems, wishlistItems } from "@/lib/commerce-data";

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
        return {
          cartItems: state.cartItems.map((cartItem) =>
            cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem,
          ),
        };
      }

      return { cartItems: [...state.cartItems, item] };
    }),
  removeFromCart: (itemId) =>
    set((state) => ({
      cartItems: state.cartItems.filter((cartItem) => cartItem.id !== itemId),
    })),
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

      return {
        wishlistIds: isAlreadySaved
          ? state.wishlistIds.filter((savedId) => savedId !== itemId)
          : [...state.wishlistIds, itemId],
      };
    }),
  isWishlisted: (itemId) => get().wishlistIds.includes(itemId),
}));