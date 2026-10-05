"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  ApiOrder,
  ApiProduct,
  CartLine,
  CatalogResponse,
} from "@/lib/types";

export type View = { name: "home" } | { name: "product"; slug: string };

type MarketplaceState = {
  catalog: CatalogResponse | null;
  catalogLoading: boolean;
  view: View;
  cart: CartLine[];
  cartOpen: boolean;
  checkoutOpen: boolean;
  successOrder: ApiOrder | null;
  ordersOpen: boolean;
  sellerOpen: boolean;
  lastEmail: string;
  categoryFilter: string | null;
  searchQuery: string;
  sortOption: string;
  stockOnly: boolean;

  loadCatalog: () => Promise<void>;
  goHome: () => void;
  openProduct: (slug: string) => void;

  addToCart: (product: ApiProduct, qty?: number) => boolean;
  setQty: (slug: string, qty: number) => void;
  removeFromCart: (slug: string) => void;
  clearCart: () => void;

  setCartOpen: (open: boolean) => void;
  setCheckoutOpen: (open: boolean) => void;
  setSuccessOrder: (order: ApiOrder | null) => void;
  setOrdersOpen: (open: boolean) => void;
  setSellerOpen: (open: boolean) => void;
  setLastEmail: (email: string) => void;

  setCategoryFilter: (slug: string | null) => void;
  setSearchQuery: (q: string) => void;
  setSortOption: (s: string) => void;
  setStockOnly: (v: boolean) => void;
};

export const useMarketplace = create<MarketplaceState>()(
  persist(
    (set, get) => ({
      catalog: null,
      catalogLoading: true,
      view: { name: "home" },
      cart: [],
      cartOpen: false,
      checkoutOpen: false,
      successOrder: null,
      ordersOpen: false,
      sellerOpen: false,
      lastEmail: "",
      categoryFilter: null,
      searchQuery: "",
      sortOption: "popular",
      stockOnly: false,

      loadCatalog: async () => {
        set({ catalogLoading: true });
        try {
          const res = await fetch("/api/catalog", { cache: "no-store" });
          const data = (await res.json()) as CatalogResponse;
          set({ catalog: data, catalogLoading: false });
        } catch {
          set({ catalogLoading: false });
        }
      },

      goHome: () => {
        set({ view: { name: "home" } });
        if (typeof window !== "undefined") window.scrollTo({ top: 0 });
      },

      openProduct: (slug: string) => {
        set({ view: { name: "product", slug } });
        if (typeof window !== "undefined") window.scrollTo({ top: 0 });
      },

      addToCart: (product: ApiProduct, qty = 1) => {
        const cart = [...get().cart];
        const idx = cart.findIndex((l) => l.slug === product.slug);
        if (idx >= 0) {
          const nextQty = Math.min(cart[idx].quantity + qty, Math.max(product.stock, 1), 10);
          if (product.stock <= 0) return false;
          cart[idx] = { ...cart[idx], quantity: nextQty, stock: product.stock, price: product.price };
        } else {
          if (product.stock <= 0) return false;
          cart.push({
            slug: product.slug,
            title: product.title,
            emoji: product.emoji,
            gradient: product.gradient,
            price: product.price,
            oldPrice: product.oldPrice,
            stock: product.stock,
            quantity: Math.min(qty, product.stock, 10),
          });
        }
        set({ cart });
        return true;
      },

      setQty: (slug: string, qty: number) => {
        const cart = get()
          .cart.map((l) =>
            l.slug === slug
              ? { ...l, quantity: Math.max(1, Math.min(qty, Math.min(l.stock, 10))) }
              : l
          )
          .filter((l) => l.quantity > 0);
        set({ cart });
      },

      removeFromCart: (slug: string) =>
        set({ cart: get().cart.filter((l) => l.slug !== slug) }),

      clearCart: () => set({ cart: [] }),

      setCartOpen: (open: boolean) => set({ cartOpen: open }),
      setCheckoutOpen: (open: boolean) => set({ checkoutOpen: open }),
      setSuccessOrder: (order: ApiOrder | null) => set({ successOrder: order }),
      setOrdersOpen: (open: boolean) => set({ ordersOpen: open }),
      setSellerOpen: (open: boolean) => set({ sellerOpen: open }),
      setLastEmail: (email: string) => set({ lastEmail: email }),

      setCategoryFilter: (slug: string | null) => set({ categoryFilter: slug }),
      setSearchQuery: (q: string) => set({ searchQuery: q }),
      setSortOption: (s: string) => set({ sortOption: s }),
      setStockOnly: (v: boolean) => set({ stockOnly: v }),
    }),
    {
      name: "rudeusu-digiland-cart",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: (state) => ({
        cart: state.cart,
        lastEmail: state.lastEmail,
      }),
    }
  )
);

export function cartCount(cart: CartLine[]): number {
  return cart.reduce((acc, l) => acc + l.quantity, 0);
}

export function cartSubtotal(cart: CartLine[]): number {
  return Math.round(cart.reduce((acc, l) => acc + l.price * l.quantity, 0) * 100) / 100;
}

export function serviceFee(subtotal: number): number {
  return Math.round((subtotal * 0.05 + 0.3) * 100) / 100;
}

export function formatMoney(n: number): string {
  return `$${n.toFixed(2)}`;
}
