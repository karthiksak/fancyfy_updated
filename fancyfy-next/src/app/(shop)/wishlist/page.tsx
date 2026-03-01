"use client";

import { useWishlistStore } from "@/lib/wishlist-store";
import { Button } from "@/components/ui/button";
import { Heart, Trash2, ArrowRight, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCartStore } from "@/lib/store";
import { useToastStore } from "@/lib/toast-store";

export default function WishlistPage() {
    const { items, removeItem, clearWishlist } = useWishlistStore();
    const addItem = useCartStore((s) => s.addItem);
    const showToast = useToastStore((s) => s.showToast);
    const [mounted, setMounted] = useState(false);

    useEffect(() => { setMounted(true); }, []);
    if (!mounted) return null;

    if (items.length === 0) {
        return (
            <div className="container py-32 text-center mx-auto px-4">
                <div className="max-w-md mx-auto">
                    <div className="w-24 h-24 rounded-full bg-pink-50 flex items-center justify-center mx-auto mb-6 border border-pink-100">
                        <Heart className="w-12 h-12 text-pink-300" />
                    </div>
                    <h1 className="text-2xl font-bold mb-3">Your wishlist is empty</h1>
                    <p className="text-muted-foreground mb-8">
                        Browse our collection and save items you love!
                    </p>
                    <Link href="/products">
                        <Button size="lg" className="gap-2">
                            Browse Products <ArrowRight className="w-4 h-4" />
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container py-8 px-4 mx-auto max-w-5xl">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">My Wishlist</h1>
                        <p className="text-muted-foreground text-sm mt-1">{items.length} saved items</p>
                    </div>
                    <Button variant="outline" onClick={clearWishlist} className="text-sm">
                        Clear All
                    </Button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {items.map((item) => {
                        let imgSrc = "/placeholder.svg";
                        try { imgSrc = JSON.parse(item.images)[0] || "/placeholder.svg"; } catch { }
                        return (
                            <div key={item.id} className="group bg-white rounded-2xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
                                <Link href={`/products/${item.id}`}>
                                    <div className="aspect-square overflow-hidden bg-muted">
                                        <img src={imgSrc} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    </div>
                                </Link>
                                <div className="p-3 space-y-2">
                                    <Link href={`/products/${item.id}`}>
                                        <h3 className="font-semibold text-sm line-clamp-2 hover:text-pink-500 transition-colors">{item.name}</h3>
                                    </Link>
                                    <p className="font-bold text-pink-600">₹{item.price.toLocaleString("en-IN")}</p>
                                    <div className="flex gap-2">
                                        <Button
                                            className="flex-1 text-xs h-8 gap-1"
                                            onClick={() => {
                                                addItem({ ...item, description: "", inStock: true });
                                                showToast(`${item.name} added to cart! 🛒`);
                                            }}
                                        >
                                            <ShoppingBag className="w-3 h-3" /> Add to Cart
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-8 w-8 text-red-400 hover:text-red-600 hover:bg-red-50 shrink-0"
                                            onClick={() => {
                                                removeItem(item.id);
                                                showToast("Removed from wishlist", "info");
                                            }}
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
