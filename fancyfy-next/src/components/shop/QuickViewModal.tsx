"use client";

import { X, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/store";
import { useToastStore } from "@/lib/toast-store";
import Link from "next/link";
import { useEffect } from "react";

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    images: string;
    category: string;
    inStock: boolean;
}

interface QuickViewModalProps {
    product: Product | null;
    onClose: () => void;
}

export default function QuickViewModal({ product, onClose }: QuickViewModalProps) {
    const addItem = useCartStore((s) => s.addItem);
    const showToast = useToastStore((s) => s.showToast);

    // Close on Escape key
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, [onClose]);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (product) {
            document.body.style.overflow = "hidden";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [product]);

    if (!product) return null;

    let imgSrc = "/placeholder.svg";
    try {
        imgSrc = JSON.parse(product.images)[0] || "/placeholder.svg";
    } catch { }

    const handleAddToCart = () => {
        addItem(product);
        showToast(`${product.name} added to cart! 🛒`);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-[fadeIn_200ms_ease-out]"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden animate-[slideUp_300ms_ease-out]">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/10 hover:bg-black/20 flex items-center justify-center transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>

                <div className="grid sm:grid-cols-2">
                    {/* Image */}
                    <div className="aspect-square bg-muted overflow-hidden">
                        <img
                            src={imgSrc}
                            alt={product.name}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Info */}
                    <div className="p-6 flex flex-col justify-between gap-4">
                        <div>
                            {product.category && (
                                <span className="text-xs font-semibold text-pink-500 uppercase tracking-wider">
                                    {product.category}
                                </span>
                            )}
                            <h2 className="text-lg font-bold mt-1 leading-snug">{product.name}</h2>
                            <p className="text-2xl font-extrabold text-pink-600 mt-2">
                                ₹{product.price.toLocaleString("en-IN")}
                            </p>
                            <p className="text-sm text-muted-foreground mt-3 line-clamp-3 leading-relaxed">
                                {product.description}
                            </p>
                        </div>

                        <div className="space-y-2.5">
                            <Button className="w-full gap-2" onClick={handleAddToCart}>
                                <ShoppingBag className="w-4 h-4" /> Add to Cart
                            </Button>
                            <Link href={`/products/${product.id}`} className="block">
                                <Button variant="outline" className="w-full gap-2" onClick={onClose}>
                                    View Full Details <ArrowRight className="w-4 h-4" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
