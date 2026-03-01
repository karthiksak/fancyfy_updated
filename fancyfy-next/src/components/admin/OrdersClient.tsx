"use client";

import { useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { ChevronDown, ChevronUp, Package } from "lucide-react";

interface OrderItem {
    id: string;
    quantity: number;
    price: number;
    product: { name: string; images: string };
}

interface Order {
    id: string;
    total: number;
    status: string;
    paymentId: string | null;
    createdAt: string;
    user: { name: string | null; email: string };
    items: OrderItem[];
}

const STATUS_OPTIONS = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"];

const STATUS_COLORS: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
    CONFIRMED: "bg-blue-100 text-blue-800 border-blue-200",
    SHIPPED: "bg-purple-100 text-purple-800 border-purple-200",
    DELIVERED: "bg-green-100 text-green-800 border-green-200",
    CANCELLED: "bg-red-100 text-red-800 border-red-200",
    PAID: "bg-green-100 text-green-800 border-green-200",
};

function OrderRow({ order: initialOrder }: { order: Order }) {
    const [order, setOrder] = useState(initialOrder);
    const [expanded, setExpanded] = useState(false);
    const [updating, setUpdating] = useState(false);

    const handleStatusChange = async (newStatus: string) => {
        setUpdating(true);
        try {
            const res = await fetch(`/api/orders/${order.id}/status`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });
            if (res.ok) {
                setOrder({ ...order, status: newStatus });
            }
        } catch (e) {
            console.error("Failed to update status:", e);
        }
        setUpdating(false);
    };

    return (
        <>
            <TableRow className="cursor-pointer hover:bg-muted/50" onClick={() => setExpanded(!expanded)}>
                <TableCell>
                    <div className="flex items-center gap-2">
                        {expanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                        <div>
                            <div className="font-medium">{order.user.name || order.user.email}</div>
                            <div className="text-xs text-muted-foreground hidden md:block">{order.user.email}</div>
                        </div>
                    </div>
                </TableCell>
                <TableCell>
                    <span className="text-sm">{order.items.length} item{order.items.length !== 1 ? "s" : ""}</span>
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                    <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(e.target.value)}
                        disabled={updating}
                        className={`text-xs font-semibold px-2.5 py-1 rounded-md border cursor-pointer outline-none ${STATUS_COLORS[order.status] || "bg-gray-100"} ${updating ? "opacity-50" : ""}`}
                    >
                        {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                    {new Date(order.createdAt).toLocaleDateString("en-IN")}
                </TableCell>
                <TableCell className="text-right font-medium">
                    ₹{order.total.toLocaleString("en-IN")}
                </TableCell>
            </TableRow>
            {expanded && (
                <TableRow>
                    <TableCell colSpan={5} className="bg-muted/30 p-0">
                        <div className="px-8 py-4 space-y-2">
                            <p className="text-xs text-muted-foreground font-medium mb-2">Order Items</p>
                            {order.items.map((item) => {
                                let imgSrc = "/placeholder.svg";
                                try { imgSrc = JSON.parse(item.product.images)[0] || "/placeholder.svg"; } catch { }
                                return (
                                    <div key={item.id} className="flex items-center gap-3 bg-white rounded-lg p-2 border">
                                        <img src={imgSrc} alt={item.product.name} className="w-10 h-10 rounded object-cover" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">{item.product.name}</p>
                                            <p className="text-xs text-muted-foreground">
                                                Qty: {item.quantity} × ₹{item.price.toLocaleString("en-IN")}
                                            </p>
                                        </div>
                                        <p className="text-sm font-semibold shrink-0">
                                            ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                                        </p>
                                    </div>
                                );
                            })}
                            {order.paymentId && (
                                <p className="text-xs text-muted-foreground mt-2">
                                    Payment Ref: <span className="font-mono">{order.paymentId}</span>
                                </p>
                            )}
                        </div>
                    </TableCell>
                </TableRow>
            )}
        </>
    );
}

export default function OrdersClient({ orders }: { orders: Order[] }) {
    return (
        <Card>
            <CardHeader className="px-7">
                <CardTitle>Orders</CardTitle>
                <CardDescription>
                    {orders.length === 0
                        ? "No orders yet. Orders will appear here when customers place them."
                        : `${orders.length} total orders`}
                </CardDescription>
            </CardHeader>
            <CardContent>
                {orders.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                            <Package className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <p className="text-muted-foreground text-sm">
                            When customers order via WhatsApp, their orders will show up here.
                        </p>
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Customer</TableHead>
                                <TableHead>Items</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="hidden md:table-cell">Date</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orders.map((order) => (
                                <OrderRow key={order.id} order={order} />
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    );
}
