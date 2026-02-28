"use client";

import Link from "next/link";
import { ShoppingBag, Menu, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/store";
import { useState, useEffect } from "react";

export function Navbar() {
    const items = useCartStore((state) => state.items);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between">
                <div className="flex gap-6 md:gap-10">
                    <Link href="/" className="flex items-center space-x-2">
                        <span className="inline-block font-bold text-xl bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">Fancyfy</span>
                    </Link>
                    <nav className="hidden md:flex gap-6">
                        <Link
                            href="/products"
                            className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                        >
                            Products
                        </Link>
                        <Link
                            href="/about"
                            className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                        >
                            About
                        </Link>
                    </nav>
                </div>
                <div className="flex items-center gap-4">
                    <Link href="/cart">
                        <Button variant="ghost" size="icon" className="relative">
                            <ShoppingBag className="h-5 w-5" />
                            {mounted && items.length > 0 && (
                                <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center">
                                    {items.length}
                                </span>
                            )}
                            <span className="sr-only">Cart</span>
                        </Button>
                    </Link>
                    <Link href="/login">
                        <Button variant="ghost" size="icon">
                            <User className="h-5 w-5" />
                            <span className="sr-only">Account</span>
                        </Button>
                    </Link>
                </div>
            </div>
        </header>
    );
}
