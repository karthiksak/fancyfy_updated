import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

interface CartItem {
    id: string;
    name: string;
    price: number;
    images: string;
    count: number;
}

export async function POST(req: NextRequest) {
    try {
        if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.includes("sk_test_...")) {
            // Bypass Stripe if no real key is configured
            console.log("[DEV MODE] Bypassing Stripe due to missing/dummy keys");
            return NextResponse.json({
                sessionId: `dummy_session_${Date.now()}`,
                dummyUrl: `${req.nextUrl.origin}/success?session_id=dummy_session_${Date.now()}`
            });
        }

        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
            apiVersion: "2024-06-20" as any,
        });

        const { items } = await req.json();

        // 1. Authenticate the User
        const sessionAuth = await auth();
        if (!sessionAuth?.user?.id) {
            return NextResponse.json({ error: "Unauthorized. Please log in first." }, { status: 401 });
        }

        const userId = sessionAuth.user.id;

        // 2. Calculate Order Total
        const totalAmount = items.reduce((acc: number, item: CartItem) => acc + (item.price * item.count), 0);

        // 3. Create a PENDING Order in the database
        const dbOrder = await prisma.order.create({
            data: {
                userId,
                total: totalAmount,
                status: "PENDING",
                items: {
                    create: items.map((item: CartItem) => ({
                        productId: item.id,
                        quantity: item.count,
                        price: item.price,
                    })),
                },
            },
        });

        // 4. Map line items for Stripe Checkout

        const lineItems = items.map((item: CartItem) => ({
            price_data: {
                currency: "inr",
                product_data: {
                    name: item.name,
                    images: (() => {
                        try { return JSON.parse(item.images); } catch { return []; }
                    })(),
                },
                unit_amount: Math.round(item.price * 100), // Stripe expects paise for INR
            },
            quantity: item.count,
        }));

        const stripeSession = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: lineItems,
            mode: "payment",
            metadata: {
                orderId: dbOrder.id, // Store DB order ID in Stripe Metadata securely!
            },
            success_url: `${req.nextUrl.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.nextUrl.origin}/cart`,
        });

        return NextResponse.json({ sessionId: stripeSession.id });
    } catch (err: any) {
        console.error("Stripe checkout error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
