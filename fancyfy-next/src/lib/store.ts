"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    images: string;
    category: string;
    inStock: boolean;
}

export interface CartItem extends Product {
    count: number;
}

interface CartStore {
    items: CartItem[];
    addItem: (product: Product) => void;
    removeItem: (productId: string) => void;
    updateQuantity: (productId: string, action: "increase" | "decrease") => void;
    clearCart: () => void;
    total: () => number;
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            addItem: (product) => {
                set((state) => {
                    const existingItem = state.items.find((item) => item.id === product.id);
                    if (existingItem) {
                        return {
                            items: state.items.map((item) =>
                                item.id === product.id ? { ...item, count: item.count + 1 } : item
                            ),
                        };
                    }
                    return { items: [...state.items, { ...product, count: 1 }] };
                });
            },
            removeItem: (productId) => {
                set((state) => ({
                    items: state.items.filter((item) => item.id !== productId)
                }))
            },
            updateQuantity: (productId, action) => {
                set((state) => {
                    const existingItem = state.items.find((item) => item.id === productId);
                    if (!existingItem) return state;

                    if (action === "decrease" && existingItem.count === 1) {
                        return { items: state.items.filter((item) => item.id !== productId) };
                    }

                    return {
                        items: state.items.map((item) =>
                            item.id === productId
                                ? { ...item, count: action === "increase" ? item.count + 1 : item.count - 1 }
                                : item
                        ),
                    };
                });
            },
            clearCart: () => set({ items: [] }),
            total: () => {
                return get().items.reduce((acc, item) => acc + item.price * item.count, 0);
            },
        }),
        {
            name: "shopping-cart",
        }
    )
);
