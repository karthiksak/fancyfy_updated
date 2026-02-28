"use client";

import { Suspense, useEffect } from "react";
import Link from "next/link";
import { CheckCircle, ArrowRight, ShoppingBag, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/store";
import { useSearchParams } from "next/navigation";

function SuccessContent() {
    const clearCart = useCartStore((state) => state.clearCart);
    const searchParams = useSearchParams();
    const sessionId = searchParams.get("session_id");

    useEffect(() => {
        if (sessionId) {
            clearCart();
        }
    }, [sessionId, clearCart]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-violet-50 to-white px-4">
            {/* Confetti-style decorative blobs */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-10 left-10 w-48 h-48 rounded-full bg-pink-300 opacity-10 blur-3xl" />
                <div className="absolute bottom-10 right-10 w-64 h-64 rounded-full bg-violet-300 opacity-10 blur-3xl" />
            </div>

            <div className="relative z-10 text-center max-w-md w-full bg-white rounded-3xl shadow-xl p-10 border border-gray-100">

                {/* Success Icon */}
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-200">
                    <CheckCircle className="w-10 h-10 text-white" />
                </div>

                <h1 className="text-3xl font-extrabold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-600">
                    Order Confirmed!
                </h1>
                <p className="text-muted-foreground mb-2">
                    Thank you for shopping with Fancyfy! Your order has been placed successfully.
                </p>

                {sessionId && (
                    <p className="text-xs text-muted-foreground bg-gray-50 rounded-lg px-3 py-2 mb-6 font-mono truncate border">
                        Order #{sessionId.replace("dummy_session_", "").slice(-8).toUpperCase()}
                    </p>
                )}

                {/* Star rating prompt */}
                <div className="flex items-center justify-center gap-1 mb-6">
                    <p className="text-xs text-muted-foreground mr-2">Rate your experience:</p>
                    {[1, 2, 3, 4, 5].map((s) => <Star key={s} className="w-5 h-5 text-yellow-400 fill-yellow-400 cursor-pointer hover:scale-110 transition-transform" />)}
                </div>

                <div className="space-y-3">
                    <Link href="/products" className="block w-full">
                        <Button className="w-full gap-2">
                            <ShoppingBag className="w-4 h-4" /> Continue Shopping
                        </Button>
                    </Link>
                    <Link href="/" className="block w-full">
                        <Button variant="outline" className="w-full gap-2">
                            Back to Home <ArrowRight className="w-4 h-4" />
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function SuccessPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen bg-violet-50">
                <div className="animate-pulse text-muted-foreground">Confirming your order...</div>
            </div>
        }>
            <SuccessContent />
        </Suspense>
    );
}
