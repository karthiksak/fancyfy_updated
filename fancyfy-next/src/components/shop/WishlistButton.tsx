"use client";

import { Heart } from "lucide-react";
import { useWishlistStore } from "@/lib/wishlist-store";
import { useToastStore } from "@/lib/toast-store";
import { useState, useEffect } from "react";

interface WishlistButtonProps {
    product: {
        id: string;
        name: string;
        price: number;
        images: string;
        category: string;
    };
    className?: string;
}

export default function WishlistButton({ product, className = "" }: WishlistButtonProps) {
    const { toggleItem, isInWishlist } = useWishlistStore();
    const showToast = useToastStore((s) => s.showToast);
    const [mounted, setMounted] = useState(false);

    useEffect(() => { setMounted(true); }, []);

    const active = mounted && isInWishlist(product.id);

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const wasInWishlist = isInWishlist(product.id);
        toggleItem(product);
        showToast(
            wasInWishlist ? `Removed from wishlist` : `Added to wishlist ❤️`,
            wasInWishlist ? "info" : "success"
        );
    };

    return (
        <button
            onClick={handleClick}
            className={`group/heart rounded-full p-2 transition-all duration-200 ${active
                    ? "bg-pink-500 text-white shadow-lg shadow-pink-200"
                    : "bg-white/80 backdrop-blur text-gray-500 hover:bg-pink-50 hover:text-pink-500 shadow-sm"
                } ${className}`}
            aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
        >
            <Heart
                className={`w-4 h-4 transition-transform duration-200 group-hover/heart:scale-110 ${active ? "fill-white" : ""
                    }`}
            />
        </button>
    );
}
