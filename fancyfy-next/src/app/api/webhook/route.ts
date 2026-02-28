import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2024-06-20" as any,
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: Request) {
    const body = await req.text();
    const headersList = await headers();
    const sig = headersList.get("stripe-signature") as string;

    let event: Stripe.Event;

    try {
        if (!endpointSecret) {
            // For development without webhook secret, just trust the event type (NOT SECURE FOR PROD)
            // or strictly fail.
            // For this demo, let's assume we might rely on client-side or manual verification if webhook fails locally.
            // actually, simpler to just parse body if signature verification fails in dev environment without secret.
            event = stripe.webhooks.constructEvent(body, sig, endpointSecret!);
        } else {
            event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
        }
    } catch (err: any) {
        console.log(`Webhook signature verification failed.`, err.message);
        return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;

        const orderId = session.metadata?.orderId;

        if (orderId) {
            console.log(`Payment successful for order: ${orderId} (Session: ${session.id})`);

            // Mark the order as PAID in the database
            await prisma.order.update({
                where: { id: orderId },
                data: {
                    status: "PAID",
                    paymentId: session.payment_intent as string || session.id,
                },
            });
        } else {
            console.error("Payment successful but no orderId found in Stripe metadata.", session.id);
        }
    }

    return NextResponse.json({ received: true });
}
