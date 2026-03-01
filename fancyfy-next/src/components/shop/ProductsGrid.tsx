"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Eye, SlidersHorizontal, ChevronDown } from "lucide-react";
import WishlistButton from "@/components/shop/WishlistButton";
import QuickViewModal from "@/components/shop/QuickViewModal";

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    images: string;
    category: string;
    inStock: boolean;
}

type SortOption = "newest" | "price-asc" | "price-desc" | "name-az";

const SORT_LABELS: Record<SortOption, string> = {
    "newest": "Newest First",
    "price-asc": "Price: Low → High",
    "price-desc": "Price: High → Low",
    "name-az": "Name: A → Z",
};

export default function ProductsGrid({ products, searchQuery = "" }: { products: Product[]; searchQuery?: string }) {
    const categories = ["All", ...Array.from(new Set(products.map((p) => p.category).filter(Boolean)))];
    const [activeCategory, setActiveCategory] = useState("All");
    const [sortBy, setSortBy] = useState<SortOption>("newest");
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 0]);
    const [priceFilterActive, setPriceFilterActive] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

    // Calculate price bounds
    const priceBounds = useMemo(() => {
        const prices = products.map((p) => p.price);
        return { min: Math.floor(Math.min(...prices)), max: Math.ceil(Math.max(...prices)) };
    }, [products]);

    // Initialize price range on first render
    useMemo(() => {
        if (!priceFilterActive && priceBounds.min !== Infinity) {
            setPriceRange([priceBounds.min, priceBounds.max]);
        }
    }, [priceBounds, priceFilterActive]);

    // Filter + sort pipeline
    const processed = useMemo(() => {
        let result = [...products];

        // Search filter
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            result = result.filter(
                (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
            );
        }

        // Category filter
        if (activeCategory !== "All") {
            result = result.filter((p) => p.category === activeCategory);
        }

        // Price filter
        if (priceFilterActive) {
            result = result.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);
        }

        // Sort
        switch (sortBy) {
            case "price-asc":
                result.sort((a, b) => a.price - b.price);
                break;
            case "price-desc":
                result.sort((a, b) => b.price - a.price);
                break;
            case "name-az":
                result.sort((a, b) => a.name.localeCompare(b.name));
                break;
            default: // newest — keep original order (already sorted by createdAt desc from server)
                break;
        }

        return result;
    }, [products, searchQuery, activeCategory, sortBy, priceRange, priceFilterActive]);

    return (
        <div>
            {/* Top bar: Category pills + Filters toggle + Sort */}
            <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
                <div className="px-4 py-3 space-y-3">
                    {/* Category pills */}
                    {categories.length > 1 && (
                        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
                            <span className="text-xs text-muted-foreground shrink-0 mr-1">Filter:</span>
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`shrink-0 text-xs font-medium px-4 py-2 rounded-full border transition-colors capitalize whitespace-nowrap ${activeCategory === cat
                                        ? "bg-gradient-to-r from-pink-500 to-violet-600 text-white border-transparent"
                                        : "hover:border-pink-300 hover:bg-pink-50 bg-white"
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Sort + price filter row */}
                    <div className="flex items-center gap-3 flex-wrap">
                        {/* Sort dropdown */}
                        <div className="relative">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as SortOption)}
                                className="appearance-none text-xs font-medium px-4 py-2 pr-8 rounded-full border bg-white hover:border-pink-300 transition-colors cursor-pointer outline-none"
                            >
                                {Object.entries(SORT_LABELS).map(([value, label]) => (
                                    <option key={value} value={value}>{label}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                        </div>

                        {/* Filter toggle */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`flex items-center gap-1.5 text-xs font-medium px-4 py-2 rounded-full border transition-colors ${showFilters ? "bg-pink-50 border-pink-300 text-pink-600" : "hover:border-pink-300 bg-white"
                                }`}
                        >
                            <SlidersHorizontal className="w-3.5 h-3.5" />
                            Price Filter
                        </button>

                        {searchQuery && (
                            <span className="text-xs text-muted-foreground">
                                Searching: <span className="font-semibold text-foreground">&quot;{searchQuery}&quot;</span>
                            </span>
                        )}
                    </div>

                    {/* Price range sliders */}
                    {showFilters && (
                        <div className="flex items-center gap-4 pt-1 pb-1">
                            <div className="flex items-center gap-2 flex-1">
                                <span className="text-xs text-muted-foreground shrink-0">₹{priceRange[0].toLocaleString("en-IN")}</span>
                                <input
                                    type="range"
                                    min={priceBounds.min}
                                    max={priceBounds.max}
                                    value={priceRange[0]}
                                    onChange={(e) => {
                                        const v = Number(e.target.value);
                                        setPriceRange([Math.min(v, priceRange[1]), priceRange[1]]);
                                        setPriceFilterActive(true);
                                    }}
                                    className="flex-1 accent-pink-500 h-1.5"
                                />
                                <input
                                    type="range"
                                    min={priceBounds.min}
                                    max={priceBounds.max}
                                    value={priceRange[1]}
                                    onChange={(e) => {
                                        const v = Number(e.target.value);
                                        setPriceRange([priceRange[0], Math.max(v, priceRange[0])]);
                                        setPriceFilterActive(true);
                                    }}
                                    className="flex-1 accent-violet-500 h-1.5"
                                />
                                <span className="text-xs text-muted-foreground shrink-0">₹{priceRange[1].toLocaleString("en-IN")}</span>
                            </div>
                            {priceFilterActive && (
                                <button
                                    onClick={() => {
                                        setPriceRange([priceBounds.min, priceBounds.max]);
                                        setPriceFilterActive(false);
                                    }}
                                    className="text-xs text-pink-500 underline shrink-0"
                                >
                                    Reset
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Products Grid */}
            <div className="container py-10 md:py-14 mx-auto px-4">
                <p className="text-sm text-muted-foreground mb-6">
                    Showing {processed.length} {activeCategory !== "All" ? `"${activeCategory}" ` : ""}products
                </p>
                {processed.length === 0 ? (
                    <div className="text-center py-24">
                        <p className="text-muted-foreground">No products found.</p>
                        <button
                            onClick={() => { setActiveCategory("All"); setPriceFilterActive(false); }}
                            className="mt-4 text-pink-500 text-sm underline"
                        >
                            Clear all filters
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                        {processed.map((product) => {
                            let imgSrc = "/placeholder.svg";
                            try { imgSrc = JSON.parse(product.images)[0] || "/placeholder.svg"; } catch { }
                            return (
                                <Card key={product.id} className="group overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-300 bg-white rounded-2xl">
                                    <Link href={`/products/${product.id}`}>
                                        <div className="aspect-square relative overflow-hidden bg-muted rounded-t-2xl">
                                            <img
                                                src={imgSrc}
                                                alt={product.name}
                                                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                                            />
                                            <div className="absolute top-2 left-2">
                                                <span className="bg-pink-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">NEW</span>
                                            </div>
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                            {/* Quick View button on hover */}
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    setQuickViewProduct(product);
                                                }}
                                                className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-white/90 backdrop-blur text-xs font-semibold px-4 py-2 rounded-full shadow-lg opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-white"
                                            >
                                                <Eye className="w-3.5 h-3.5" /> Quick View
                                            </button>
                                        </div>
                                    </Link>

                                    {/* Wishlist button */}
                                    <div className="absolute top-2 right-2 z-[5]">
                                        <WishlistButton product={product} />
                                    </div>

                                    <CardHeader className="p-3 pb-0">
                                        <Link href={`/products/${product.id}`}>
                                            <CardTitle className="text-sm font-semibold line-clamp-2 hover:text-pink-500 transition-colors leading-snug">
                                                {product.name}
                                            </CardTitle>
                                        </Link>
                                    </CardHeader>
                                    <CardContent className="p-3 pt-1.5">
                                        <p className="hidden sm:block text-xs text-muted-foreground line-clamp-1 mb-1.5">{product.description}</p>
                                        <p className="font-bold text-base md:text-lg text-pink-600">₹{product.price.toLocaleString("en-IN")}</p>
                                    </CardContent>
                                    <CardFooter className="p-3 pt-0">
                                        <Link href={`/products/${product.id}`} className="w-full">
                                            <Button className="w-full text-xs h-9 gap-1">
                                                View Details <ArrowRight className="w-3 h-3" />
                                            </Button>
                                        </Link>
                                    </CardFooter>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Quick View Modal */}
            <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
        </div>
    );
}
