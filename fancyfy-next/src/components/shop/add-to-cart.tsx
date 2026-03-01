"use client";

import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/store";
import { useToastStore } from "@/lib/toast-store";
import { useState } from "react";
import { Check } from "lucide-react";

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    images: string;
    category: string;
    inStock: boolean;
}

export function AddToCart({ product }: { product: Product }) {
    const addItem = useCartStore((state) => state.addItem);
    const showToast = useToastStore((s) => s.showToast);
    const [added, setAdded] = useState(false);

    const handleAdd = () => {
        addItem(product);
        showToast(`${product.name} added to cart! 🛒`);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    return (
        <Button onClick={handleAdd} className="w-full md:w-auto" disabled={!product.inStock}>
            {added ? (
                <>
                    <Check className="mr-2 h-4 w-4" /> Added to Cart
                </>
            ) : (
                "Add to Cart"
            )}
        </Button>
    );
}
