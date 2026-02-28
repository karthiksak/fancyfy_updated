import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { AddToCart } from "@/components/shop/add-to-cart";
import { ShieldCheck, Truck, RefreshCw, ArrowLeft } from "lucide-react";
import Link from "next/link";
import ProductImageGallery from "@/components/shop/ProductImageGallery";

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const product = await prisma.product.findUnique({ where: { id } });

    if (!product) notFound();

    let images: string[] = [];
    try { images = JSON.parse(product.images); } catch { }
    if (images.length === 0) images = ["/placeholder.svg"];

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container px-4 py-8 md:py-12 mx-auto max-w-5xl">

                {/* Breadcrumb */}
                <Link href="/products" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-pink-500 transition-colors mb-6">
                    <ArrowLeft className="w-4 h-4" /> Back to Products
                </Link>

                <div className="grid md:grid-cols-2 gap-8 lg:gap-14">

                    {/* Interactive Image Gallery */}
                    <ProductImageGallery images={images} productName={product.name} />

                    {/* Details */}
                    <div className="flex flex-col gap-5">
                        {/* Category label */}
                        {product.category && (
                            <span className="text-xs font-semibold text-pink-500 uppercase tracking-wider">
                                {product.category}
                            </span>
                        )}

                        <h1 className="text-3xl font-extrabold leading-tight">{product.name}</h1>

                        {/* Price — real data only */}
                        <p className="text-4xl font-extrabold text-pink-600">
                            ₹{product.price.toLocaleString("en-IN")}
                        </p>

                        {/* Description */}
                        <p className="text-muted-foreground leading-relaxed">{product.description}</p>

                        {/* Stock Status */}
                        <div className="flex items-center gap-2 text-sm">
                            <span className={`w-2 h-2 rounded-full ${product.inStock ? "bg-green-500" : "bg-red-400"}`} />
                            <span className={product.inStock ? "text-green-700 font-medium" : "text-red-500 font-medium"}>
                                {product.inStock ? "In Stock — Ready to Ship" : "Out of Stock"}
                            </span>
                        </div>

                        {/* Add to Cart */}
                        <div className="mt-2">
                            <AddToCart product={product} />
                        </div>

                        {/* Trust Badges */}
                        <div className="grid grid-cols-3 gap-3 border rounded-2xl p-4 bg-white mt-2">
                            <div className="flex flex-col items-center gap-1.5 text-center">
                                <Truck className="w-5 h-5 text-violet-500" />
                                <span className="text-xs font-medium">Free Delivery</span>
                                <span className="text-[10px] text-muted-foreground">Orders ₹499+</span>
                            </div>
                            <div className="flex flex-col items-center gap-1.5 text-center">
                                <ShieldCheck className="w-5 h-5 text-violet-500" />
                                <span className="text-xs font-medium">100% Authentic</span>
                                <span className="text-[10px] text-muted-foreground">Genuine quality</span>
                            </div>
                            <div className="flex flex-col items-center gap-1.5 text-center">
                                <RefreshCw className="w-5 h-5 text-violet-500" />
                                <span className="text-xs font-medium">Easy Returns</span>
                                <span className="text-[10px] text-muted-foreground">7-day policy</span>
                            </div>
                        </div>

                        {/* Product Info */}
                        {product.category && (
                            <div className="text-sm text-muted-foreground border-t pt-4">
                                <span className="font-medium text-foreground">Category: </span>
                                {product.category}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
