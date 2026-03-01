import { prisma } from "@/lib/prisma";
import { ShoppingBag, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ProductsGrid from "@/components/shop/ProductsGrid";

export const dynamic = "force-dynamic";

export default async function ProductsPage({
    searchParams,
}: {
    searchParams: Promise<{ search?: string }>;
}) {
    const { search } = await searchParams;
    const products = await prisma.product.findMany({
        where: { inStock: true },
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="min-h-screen flex flex-col">
            {/* Page Hero */}
            <div className="relative bg-black text-white py-12 overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-pink-600 opacity-15 blur-3xl" />
                    <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-violet-600 opacity-15 blur-3xl" />
                </div>
                <div className="relative container mx-auto px-4 text-center">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-400/30 bg-violet-500/10 px-4 py-1 text-xs text-violet-300 font-semibold uppercase tracking-wider mb-4">
                        <Sparkles className="w-3 h-3" /> Curated Collection
                    </span>
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-white via-pink-200 to-violet-300">
                        {search ? `Results for "${search}"` : "All Products"}
                    </h1>
                    <p className="text-gray-400 text-sm">{products.length} pieces available</p>
                </div>
            </div>

            {/* Client-side filter + grid */}
            {products.length === 0 ? (
                <div className="flex-1 flex items-center justify-center py-32">
                    <div className="text-center">
                        <div className="w-20 h-20 rounded-full bg-pink-50 flex items-center justify-center mx-auto mb-4 border border-pink-100">
                            <ShoppingBag className="w-10 h-10 text-pink-300" />
                        </div>
                        <h2 className="text-xl font-semibold mb-2">No products yet</h2>
                        <p className="text-muted-foreground">Check back soon for new arrivals!</p>
                    </div>
                </div>
            ) : (
                <div className="flex-1 bg-gray-50">
                    <ProductsGrid products={products} searchQuery={search || ""} />
                </div>
            )}

            {/* Bottom CTA */}
            <section className="w-full py-12 bg-gradient-to-r from-pink-500 to-violet-600 text-white text-center">
                <div className="container px-4 mx-auto">
                    <h2 className="text-2xl font-extrabold mb-2">Can&apos;t Find What You Want?</h2>
                    <p className="text-pink-100 mb-5 text-sm">Contact us and we&apos;ll help you find the perfect piece.</p>
                    <Link href="/">
                        <Button className="bg-white text-pink-600 hover:bg-gray-100 font-bold gap-2">
                            Go to Homepage <ArrowRight className="w-4 h-4" />
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    );
}
