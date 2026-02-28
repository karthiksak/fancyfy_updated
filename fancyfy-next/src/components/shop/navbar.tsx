"use client";

import Link from "next/link";
import { ShoppingBag, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/store";
import { useState, useEffect } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";

export function Navbar() {
    const items = useCartStore((state) => state.items);
    const [mounted, setMounted] = useState(false);

    useEffect(() => { setMounted(true); }, []);

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 md:h-16 items-center justify-between px-4">
                {/* Logo */}
                <Link href="/" className="flex items-center space-x-2 shrink-0">
                    <span className="font-extrabold text-xl bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">
                        Fancyfy
                    </span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex gap-6">
                    <Link href="/products" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                        Products
                    </Link>
                </nav>

                {/* Right actions */}
                <div className="flex items-center gap-1">
                    {/* Dark / Light toggle */}
                    <ThemeToggle />

                    {/* Cart */}
                    <Link href="/cart">
                        <Button variant="ghost" size="icon" className="relative">
                            <ShoppingBag className="h-5 w-5" />
                            {mounted && items.length > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-pink-500 text-[10px] font-bold text-white flex items-center justify-center">
                                    {items.reduce((a, i) => a + i.count, 0)}
                                </span>
                            )}
                            <span className="sr-only">Cart</span>
                        </Button>
                    </Link>

                    {/* Account */}
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
