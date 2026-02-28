"use client";

import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/store";
import { Trash2, ShoppingBag, ArrowRight, Plus, Minus, MessageCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const WHATSAPP_NUMBER = "917904349234"; // +91 India prefix

export default function CartPage() {
    const { items, removeItem, updateQuantity, total, clearCart } = useCartStore();
    const [mounted, setMounted] = useState(false);
    const [orderSent, setOrderSent] = useState(false);
    const router = useRouter();

    useEffect(() => { setMounted(true); }, []);
    if (!mounted) return null;

    const handleWhatsAppCheckout = () => {
        if (items.length === 0) return;

        // Build the order message
        const lines: string[] = [
            "\uD83D\uDED9\uFE0F *New Order from Fancyfy*",
            "",
            "*Order Details:*",
        ];

        items.forEach((item, i) => {
            let imgUrl = "";
            try { imgUrl = JSON.parse(item.images)[0] || ""; } catch { }

            lines.push(
                `${i + 1}. *${item.name}*`,
                `   Qty: ${item.count} \u00D7 \u20B9${item.price.toLocaleString("en-IN")} = \u20B9${(item.price * item.count).toLocaleString("en-IN")}`,
                imgUrl ? `   Image: ${imgUrl}` : "",
            );
        });

        lines.push(
            "",
            `*Total: \u20B9${total().toLocaleString("en-IN")}*`,
            "",
            "Please confirm my order. Thank you!",
        );

        const message = lines.filter(Boolean).join("\n");
        const encodedMessage = encodeURIComponent(message);
        const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

        // Open WhatsApp, clear cart, show success screen
        window.open(waUrl, "_blank");
        clearCart();
        setOrderSent(true);

        // Auto-redirect home after 4 seconds
        setTimeout(() => router.push("/"), 4000);
    };

    // Order sent success screen
    if (orderSent) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center px-4">
                <div className="text-center max-w-sm w-full bg-white rounded-3xl shadow-xl p-10 border border-green-100">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-200">
                        <CheckCircle2 className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-2xl font-extrabold mb-2">Order Sent!</h1>
                    <p className="text-muted-foreground text-sm mb-1">
                        Your order has been sent to WhatsApp.
                    </p>
                    <p className="text-muted-foreground text-sm mb-6">
                        We&apos;ll confirm and arrange delivery shortly.
                    </p>
                    <div className="flex items-center justify-center gap-2 text-green-600 text-xs font-medium mb-6">
                        <MessageCircle className="w-4 h-4" />
                        Redirecting you home in a moment...
                    </div>
                    <Link href="/">
                        <Button className="w-full gap-2">
                            Back to Home <ArrowRight className="w-4 h-4" />
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="container py-32 text-center mx-auto px-4">
                <div className="max-w-md mx-auto">
                    <div className="w-24 h-24 rounded-full bg-pink-50 flex items-center justify-center mx-auto mb-6 border border-pink-100">
                        <ShoppingBag className="w-12 h-12 text-pink-300" />
                    </div>
                    <h1 className="text-2xl font-bold mb-3">Your cart is empty</h1>
                    <p className="text-muted-foreground mb-8">
                        Looks like you haven&apos;t added anything yet.
                        Browse our collection and find something you love!
                    </p>
                    <Link href="/products">
                        <Button size="lg" className="gap-2">
                            Continue Shopping <ArrowRight className="w-4 h-4" />
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container py-8 px-4 mx-auto max-w-5xl">
                <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
                <div className="grid md:grid-cols-[1fr_340px] gap-8">

                    {/* Cart Items */}
                    <div className="space-y-4">
                        {items.map((item) => {
                            let imgSrc = "/placeholder.svg";
                            try { imgSrc = JSON.parse(item.images)[0] || "/placeholder.svg"; } catch { }
                            return (
                                <div key={item.id} className="flex items-center gap-4 border rounded-2xl p-4 bg-white shadow-sm">
                                    <Link href={`/products/${item.id}`}>
                                        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border bg-muted">
                                            <img src={imgSrc} alt={item.name} className="object-cover w-full h-full" />
                                        </div>
                                    </Link>
                                    <div className="flex-1 min-w-0">
                                        <Link href={`/products/${item.id}`}>
                                            <h3 className="font-semibold truncate hover:text-pink-500 transition-colors">{item.name}</h3>
                                        </Link>
                                        <p className="text-xs text-muted-foreground mt-0.5">₹{item.price.toLocaleString("en-IN")} each</p>
                                        <div className="flex items-center gap-1 bg-muted rounded-lg border mt-2 w-fit">
                                            <Button variant="ghost" size="icon" className="h-7 w-7"
                                                onClick={() => updateQuantity(item.id, "decrease")}>
                                                <Minus className="h-3 w-3" />
                                            </Button>
                                            <span className="text-sm font-medium w-6 text-center">{item.count}</span>
                                            <Button variant="ghost" size="icon" className="h-7 w-7"
                                                onClick={() => updateQuantity(item.id, "increase")}>
                                                <Plus className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <p className="font-bold text-lg text-pink-600">₹{(item.price * item.count).toLocaleString("en-IN")}</p>
                                        <Button variant="ghost" size="icon"
                                            className="text-red-400 hover:text-red-600 hover:bg-red-50 mt-1"
                                            onClick={() => removeItem(item.id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            );
                        })}
                        <Button variant="outline" onClick={clearCart} className="w-full mt-2 rounded-xl">
                            Clear Cart
                        </Button>
                    </div>

                    {/* Order Summary */}
                    <div>
                        <div className="rounded-2xl border bg-white p-6 shadow-sm sticky top-24">
                            <h3 className="font-semibold text-lg mb-4">Order Summary</h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                        Subtotal ({items.reduce((a, i) => a + i.count, 0)} items)
                                    </span>
                                    <span className="font-medium">₹{total().toLocaleString("en-IN")}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Shipping</span>
                                    <span className="text-green-600 font-medium">Free</span>
                                </div>
                                <div className="border-t pt-3 flex justify-between">
                                    <span className="font-bold text-base">Total</span>
                                    <span className="font-bold text-xl text-pink-600">₹{total().toLocaleString("en-IN")}</span>
                                </div>
                            </div>

                            {/* WhatsApp Checkout Button */}
                            <Button
                                className="w-full mt-5 gap-2 bg-green-500 hover:bg-green-600 text-white text-base py-6 rounded-xl font-bold"
                                size="lg"
                                onClick={handleWhatsAppCheckout}
                            >
                                <MessageCircle className="w-5 h-5" />
                                Order via WhatsApp
                            </Button>

                            <p className="text-xs text-center text-muted-foreground mt-3">
                                Tap above to send your order to us on WhatsApp
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
