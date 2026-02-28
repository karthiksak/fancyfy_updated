import Link from "next/link";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
    ArrowRight, Truck, ShieldCheck, RefreshCw, Headphones,
    Zap, Star, Instagram, Mail,
} from "lucide-react";
import NewsletterForm from "@/components/NewsletterForm";

export const dynamic = "force-dynamic";

const FEATURES = [
    { icon: Truck, title: "Free Delivery", desc: "On orders above ₹499" },
    { icon: ShieldCheck, title: "100% Authentic", desc: "Genuine quality products" },
    { icon: RefreshCw, title: "Easy Returns", desc: "7-day hassle-free returns" },
    { icon: Headphones, title: "24/7 Support", desc: "Always here to help" },
];

const TESTIMONIALS = [
    {
        name: "Priya S.", location: "Chennai", rating: 5,
        text: "The quality is absolutely stunning! My order arrived beautifully packaged. Will definitely order again.",
    },
    {
        name: "Amit K.", location: "Mumbai", rating: 5,
        text: "Excellent quality and super fast delivery. The earrings I bought for my wife were a huge hit!",
    },
    {
        name: "Sneha R.", location: "Bangalore", rating: 5,
        text: "Fancyfy has become my go-to for every festive season. Love the premium feel and packaging!",
    },
    {
        name: "Kavitha M.", location: "Madurai", rating: 5,
        text: "Product looks exactly like the pictures. The customer support team was very helpful. Highly recommend!",
    },
];

export default async function HomePage() {
    const featuredProducts = await prisma.product.findMany({
        take: 8,
        where: { inStock: true },
        orderBy: { createdAt: "desc" },
    });

    // Fetch distinct categories from real DB data
    const allProducts = await prisma.product.findMany({
        where: { inStock: true },
        select: { category: true },
    });
    const categories = [...new Set(allProducts.map((p: any) => p.category).filter(Boolean))];

    // Gallery-style grid uses the same products
    const galleryProducts = featuredProducts.slice(0, 6);

    return (
        <div className="flex flex-col min-h-screen">

            {/* ── Announcement Bar ── */}
            <div className="bg-gradient-to-r from-pink-500 to-violet-600 text-white text-center py-2 text-sm font-medium tracking-wide">
                🎉 Welcome to <span className="font-extrabold underline underline-offset-2">Fancyfy</span> — Free delivery on orders above ₹499!
            </div>

            {/* ── Hero ── */}
            <section className="relative w-full py-20 md:py-32 bg-black text-white overflow-hidden">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-pink-600 opacity-20 blur-3xl" />
                    <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-violet-600 opacity-20 blur-3xl" />
                </div>
                <div className="relative container px-4 md:px-6 mx-auto text-center">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-pink-500/30 bg-pink-500/10 px-4 py-1.5 text-xs text-pink-300 font-semibold uppercase tracking-wider mb-6">
                        <Zap className="w-3 h-3" /> New Collection 2025
                    </span>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-pink-200 to-violet-300 mb-6">
                        Elevate Your Style
                    </h1>
                    <p className="mx-auto max-w-2xl text-gray-400 text-lg md:text-xl mb-10">
                        <span className="text-white font-bold">Fancyfy</span> brings you handpicked fashion accessories for the modern you.
                        Premium quality, unbeatable prices.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/products">
                            <Button size="lg" className="gap-2 text-base px-8">
                                Shop Now <ArrowRight className="w-4 h-4" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── Shop by Category (from DB) ── */}
            {categories.length > 0 && (
                <section className="w-full py-10">
                    <div className="container px-4 md:px-6 mx-auto">
                        <h2 className="text-xl md:text-2xl font-bold mb-5 text-center">Shop by Category</h2>
                        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide snap-x px-1">
                            {categories.map((cat: string) => (
                                <Link key={cat} href={`/products`} className="shrink-0 snap-start">
                                    <div className="flex items-center gap-2 px-5 py-2.5 rounded-full border hover:border-pink-300 hover:bg-pink-50 transition-all cursor-pointer capitalize font-medium text-sm whitespace-nowrap">
                                        {cat}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ── New Arrivals (real products from DB) ── */}
            <section className="w-full py-12 bg-gray-50">
                <div className="container px-4 md:px-6 mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-bold">New Arrivals</h2>
                            <p className="text-muted-foreground text-sm mt-1">Fresh picks just for you</p>
                        </div>
                        <Link href="/products">
                            <Button variant="outline" size="sm" className="gap-1">
                                View All <ArrowRight className="w-3.5 h-3.5" />
                            </Button>
                        </Link>
                    </div>

                    {featuredProducts.length === 0 ? (
                        <p className="text-center text-muted-foreground py-16">
                            No products yet. Add some from the admin panel.
                        </p>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                            {featuredProducts.map((product: any) => {
                                let imgSrc = "/placeholder.svg";
                                try { imgSrc = JSON.parse(product.images)[0] || "/placeholder.svg"; } catch { }
                                return (
                                    <Card key={product.id} className="group overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow rounded-2xl">
                                        <Link href={`/products/${product.id}`}>
                                            <div className="aspect-square relative overflow-hidden bg-muted rounded-t-2xl">
                                                <img
                                                    src={imgSrc}
                                                    alt={product.name}
                                                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                                                />
                                            </div>
                                        </Link>
                                        <CardHeader className="p-3 pb-1">
                                            <Link href={`/products/${product.id}`}>
                                                <CardTitle className="text-sm font-semibold line-clamp-2 hover:text-pink-500 transition-colors">
                                                    {product.name}
                                                </CardTitle>
                                            </Link>
                                        </CardHeader>
                                        <CardContent className="p-3 pt-0">
                                            <p className="font-bold text-pink-600">₹{product.price.toLocaleString("en-IN")}</p>
                                        </CardContent>
                                        <CardFooter className="p-3 pt-0">
                                            <Link href={`/products/${product.id}`} className="w-full">
                                                <Button className="w-full h-8 text-xs">View Details</Button>
                                            </Link>
                                        </CardFooter>
                                    </Card>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>

            {/* ── Why Shop With Us ── */}
            <section className="w-full py-14">
                <div className="container px-4 md:px-6 mx-auto">
                    <h2 className="text-2xl font-bold text-center mb-10">Why Shop With Us?</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {FEATURES.map((f) => (
                            <div key={f.title} className="flex flex-col items-center text-center gap-3">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 to-violet-600 flex items-center justify-center shadow">
                                    <f.icon className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-sm">{f.title}</h3>
                                    <p className="text-xs text-muted-foreground mt-0.5">{f.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Product Gallery (links to real products) ── */}
            {galleryProducts.length > 0 && (
                <section className="w-full py-14 bg-gray-50">
                    <div className="container px-4 md:px-6 mx-auto">
                        <div className="text-center mb-8">
                            <div className="flex items-center justify-center gap-2 mb-1">
                                <Instagram className="w-5 h-5 text-pink-500" />
                                <h2 className="text-2xl font-bold">Shop the Look</h2>
                            </div>
                            <p className="text-muted-foreground text-sm">Click any image to shop that product</p>
                        </div>
                        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                            {galleryProducts.map((product: any) => {
                                let imgSrc = "/placeholder.svg";
                                try { imgSrc = JSON.parse(product.images)[0] || "/placeholder.svg"; } catch { }
                                return (
                                    <Link key={product.id} href={`/products/${product.id}`}>
                                        <div className="group aspect-square overflow-hidden rounded-xl relative bg-muted">
                                            <img src={imgSrc} alt={product.name} className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <span className="text-white text-xs font-semibold">Shop Now</span>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </section>
            )}

            {/* ── Customer Testimonials ── */}
            <section className="w-full py-16 bg-gradient-to-b from-violet-50 to-white">
                <div className="container px-4 md:px-6 mx-auto">
                    <div className="text-center mb-10">
                        <h2 className="text-2xl font-bold">What Our Customers Say</h2>
                        <p className="text-muted-foreground text-sm mt-1">Real stories from real shoppers</p>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {TESTIMONIALS.map((t) => (
                            <div key={t.name} className="flex flex-col gap-3 rounded-2xl border bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex gap-0.5">
                                    {Array.from({ length: t.rating }).map((_, i) => (
                                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                    ))}
                                </div>
                                <p className="text-sm text-muted-foreground leading-relaxed flex-1">&ldquo;{t.text}&rdquo;</p>
                                <div>
                                    <p className="font-semibold text-sm">{t.name}</p>
                                    <p className="text-xs text-muted-foreground">{t.location}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA Banner ── */}
            <section className="w-full py-16 bg-gradient-to-r from-pink-500 to-violet-600 text-white text-center">
                <div className="container px-4 mx-auto">
                    <h2 className="text-3xl font-extrabold mb-3">Shop the <span className="underline underline-offset-4">Fancyfy</span> Collection</h2>
                    <p className="text-pink-100 mb-7 max-w-lg mx-auto">
                        Browse our full range of premium fashion accessories.
                    </p>
                    <Link href="/products">
                        <Button size="lg" className="bg-white text-pink-600 hover:bg-gray-100 font-bold gap-2">
                            Shop All Products <ArrowRight className="w-4 h-4" />
                        </Button>
                    </Link>
                </div>
            </section>

            {/* ── Newsletter ── */}
            <section className="w-full py-14 bg-black text-white">
                <div className="container px-4 md:px-6 mx-auto max-w-xl text-center">
                    <Mail className="w-10 h-10 text-pink-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Stay in the <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-violet-400">Fancyfy</span> Loop</h2>
                    <p className="text-gray-400 text-sm mb-6">New arrivals and exclusive deals — straight to your inbox.</p>
                    <NewsletterForm />
                    <p className="text-xs text-gray-600 mt-4">No spam. Unsubscribe anytime.</p>
                </div>
            </section>

        </div>
    );
}
