import { prisma } from "@/lib/prisma";
import OrdersClient from "@/components/admin/OrdersClient";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
    const orders = await prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        include: {
            user: true,
            items: {
                include: { product: true },
            },
        },
    });

    // Serialize dates for client component
    const serialized = orders.map((o) => ({
        ...o,
        createdAt: o.createdAt.toISOString(),
        user: { name: o.user.name, email: o.user.email },
        items: o.items.map((item) => ({
            id: item.id,
            quantity: item.quantity,
            price: item.price,
            product: { name: item.product.name, images: item.product.images },
        })),
    }));

    return <OrdersClient orders={serialized} />;
}
