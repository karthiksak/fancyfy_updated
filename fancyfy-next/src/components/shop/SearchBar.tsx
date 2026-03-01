"use client";

import { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SearchBar() {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    useEffect(() => {
        if (open && inputRef.current) inputRef.current.focus();
    }, [open]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const q = query.trim();
        if (!q) return;
        router.push(`/products?search=${encodeURIComponent(q)}`);
        setOpen(false);
        setQuery("");
    };

    return (
        <div className="relative flex items-center">
            {/* Mobile: icon toggle, Desktop: always visible */}
            <form onSubmit={handleSubmit} className="flex items-center">
                <div
                    className={`flex items-center overflow-hidden rounded-full border bg-muted/50 transition-all duration-300 ${open ? "w-48 sm:w-64 px-3" : "w-0 px-0 border-transparent sm:w-56 sm:px-3 sm:border-border"
                        }`}
                >
                    <Search className="w-4 h-4 text-muted-foreground shrink-0 hidden sm:block" />
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search products..."
                        className="flex-1 bg-transparent text-sm py-2 px-2 outline-none placeholder:text-muted-foreground min-w-0"
                    />
                    {query && (
                        <button type="button" onClick={() => setQuery("")} className="shrink-0">
                            <X className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground" />
                        </button>
                    )}
                </div>

                {/* Mobile search icon */}
                <button
                    type="button"
                    onClick={() => setOpen(!open)}
                    className="sm:hidden p-2 rounded-full hover:bg-muted transition-colors"
                >
                    {open ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
                </button>
            </form>
        </div>
    );
}
