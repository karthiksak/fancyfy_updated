"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WishlistItem {
    id: string;
    name: string;
    price: number;
    images: string;
    category: string;
}

interface WishlistStore {
    items: WishlistItem[];
    toggleItem: (item: WishlistItem) => void;
    isInWishlist: (id: string) => boolean;
    removeItem: (id: string) => void;
    clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistStore>()(
    persist(
        (set, get) => ({
            items: [],
            toggleItem: (item) => {
                const exists = get().items.find((i) => i.id === item.id);
                if (exists) {
                    set({ items: get().items.filter((i) => i.id !== item.id) });
                } else {
                    set({ items: [...get().items, item] });
                }
            },
            isInWishlist: (id) => {
                return get().items.some((i) => i.id === id);
            },
            removeItem: (id) => {
                set({ items: get().items.filter((i) => i.id !== id) });
            },
            clearWishlist: () => set({ items: [] }),
        }),
        { name: "wishlist" }
    )
);
