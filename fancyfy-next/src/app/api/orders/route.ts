import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { items, total, customerName, customerPhone } = body;

        if (!items || items.length === 0) {
            return NextResponse.json({ error: "No items in order" }, { status: 400 });
        }

        // Find or create a guest user for WhatsApp orders
        const guestEmail = customerPhone
            ? `whatsapp_${customerPhone}@guest.fancyfy.in`
            : `guest_${Date.now()}@guest.fancyfy.in`;

        let user = await prisma.user.findUnique({ where: { email: guestEmail } });

        if (!user) {
            user = await prisma.user.create({
                data: {
                    email: guestEmail,
                    password: "WHATSAPP_ORDER", // Not a real login
                    name: customerName || `WhatsApp Customer`,
                    role: "USER",
                },
            });
        }

        // Create order with items
        const order = await prisma.order.create({
            data: {
                userId: user.id,
                total: total,
                status: "PENDING",
                paymentId: `wa_${Date.now()}`,
                items: {
                    create: items.map((item: { id: string; price: number; count: number }) => ({
                        productId: item.id,
                        quantity: item.count,
                        price: item.price,
                    })),
                },
            },
            include: { items: true },
        });

        return NextResponse.json({ orderId: order.id, status: "success" });
    } catch (error) {
        console.error("Order creation error:", error);
        return NextResponse.json(
            { error: "Failed to create order" },
            { status: 500 }
        );
    }
}
