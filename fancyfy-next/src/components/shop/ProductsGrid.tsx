"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    images: string;
    category: string;
    inStock: boolean;
}

export default function ProductsGrid({ products }: { products: Product[] }) {
    const categories = ["All", ...Array.from(new Set(products.map((p) => p.category).filter(Boolean)))];
    const [activeCategory, setActiveCategory] = useState("All");

    const filtered = activeCategory === "All"
        ? products
        : products.filter((p) => p.category === activeCategory);

    return (
        <div>
            {/* Category Filter Pills */}
            {categories.length > 1 && (
                <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
                    <div className="container mx-auto px-4 py-3 flex items-center gap-2 overflow-x-auto">
                        <span className="text-xs text-muted-foreground shrink-0 mr-1">Filter:</span>
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`shrink-0 text-xs font-medium px-4 py-1.5 rounded-full border transition-colors capitalize ${activeCategory === cat
                                        ? "bg-gradient-to-r from-pink-500 to-violet-600 text-white border-transparent"
                                        : "hover:border-pink-300 hover:bg-pink-50"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Products Grid */}
            <div className="container py-10 md:py-14 mx-auto px-4">
                <p className="text-sm text-muted-foreground mb-6">
                    Showing {filtered.length} {activeCategory !== "All" ? `"${activeCategory}" ` : ""}products
                </p>
                {filtered.length === 0 ? (
                    <div className="text-center py-24">
                        <p className="text-muted-foreground">No products found in this category.</p>
                        <button onClick={() => setActiveCategory("All")} className="mt-4 text-pink-500 text-sm underline">
                            View all products
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                        {filtered.map((product) => {
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
                                        </div>
                                    </Link>
                                    <CardHeader className="p-3 pb-0">
                                        <Link href={`/products/${product.id}`}>
                                            <CardTitle className="text-sm font-semibold line-clamp-2 hover:text-pink-500 transition-colors leading-snug">
                                                {product.name}
                                            </CardTitle>
                                        </Link>
                                    </CardHeader>
                                    <CardContent className="p-3 pt-1.5">
                                        <p className="text-xs text-muted-foreground line-clamp-1 mb-1.5">{product.description}</p>
                                        <p className="font-bold text-lg text-pink-600">₹{product.price.toLocaleString("en-IN")}</p>
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
        </div>
    );
}
