import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { prisma } from "@/lib/prisma";
import { IndianRupee, ShoppingCart, Package, Users, AlertTriangle, Clock } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

const STATUS_COLORS: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
    CONFIRMED: "bg-blue-100 text-blue-800 border-blue-200",
    SHIPPED: "bg-purple-100 text-purple-800 border-purple-200",
    DELIVERED: "bg-green-100 text-green-800 border-green-200",
    CANCELLED: "bg-red-100 text-red-800 border-red-200",
    PAID: "bg-green-100 text-green-800 border-green-200",
};

export default async function AdminDashboard() {
    const [productCount, userCount, allOrders, pendingOrders, recentOrders, outOfStockProducts] =
        await Promise.all([
            prisma.product.count({ where: { inStock: true } }),
            prisma.user.count({ where: { role: "USER" } }),
            prisma.order.findMany({ select: { total: true, status: true } }),
            prisma.order.count({ where: { status: "PENDING" } }),
            prisma.order.findMany({
                take: 5,
                orderBy: { createdAt: "desc" },
                include: {
                    user: true,
                    items: { include: { product: true } },
                },
            }),
            prisma.product.findMany({ where: { inStock: false } }),
        ]);

    const totalRevenue = allOrders.reduce((sum, o) => sum + o.total, 0);
    const orderCount = allOrders.length;

    return (
        <div className="space-y-6">
            {/* Stat Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <IndianRupee className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{totalRevenue.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</div>
                        <p className="text-xs text-muted-foreground">Lifetime earnings</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                        <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{orderCount}</div>
                        <p className="text-xs text-muted-foreground">
                            {pendingOrders > 0 && (
                                <span className="text-yellow-600 font-semibold">{pendingOrders} pending</span>
                            )}
                            {pendingOrders === 0 && "All orders processed"}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Products</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{productCount}</div>
                        <p className="text-xs text-muted-foreground">In stock</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Customers</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{userCount}</div>
                        <p className="text-xs text-muted-foreground">Registered users</p>
                    </CardContent>
                </Card>
            </div>

            {/* Alerts */}
            {(pendingOrders > 0 || outOfStockProducts.length > 0) && (
                <div className="grid gap-4 md:grid-cols-2">
                    {pendingOrders > 0 && (
                        <Card className="border-yellow-200 bg-yellow-50">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-yellow-600" />
                                    Pending Orders
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-yellow-800">
                                    You have <strong>{pendingOrders}</strong> order{pendingOrders !== 1 ? "s" : ""} awaiting confirmation.{" "}
                                    <Link href="/admin/orders" className="underline font-medium">
                                        View orders →
                                    </Link>
                                </p>
                            </CardContent>
                        </Card>
                    )}
                    {outOfStockProducts.length > 0 && (
                        <Card className="border-red-200 bg-red-50">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium flex items-center gap-2">
                                    <AlertTriangle className="h-4 w-4 text-red-600" />
                                    Out of Stock
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-red-800">
                                    <strong>{outOfStockProducts.length}</strong> product{outOfStockProducts.length !== 1 ? "s are" : " is"} out of stock.{" "}
                                    <Link href="/admin/products" className="underline font-medium">
                                        Manage products →
                                    </Link>
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            )}

            {/* Recent Orders */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Recent Orders</CardTitle>
                        <CardDescription>Latest orders from your store</CardDescription>
                    </div>
                    <Link href="/admin/orders" className="text-sm text-primary underline">
                        View all →
                    </Link>
                </CardHeader>
                <CardContent>
                    {recentOrders.length === 0 ? (
                        <p className="text-center text-sm text-muted-foreground py-8">
                            No orders yet. Orders will appear here when customers place them.
                        </p>
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
                                {recentOrders.map((order) => (
                                    <TableRow key={order.id}>
                                        <TableCell>
                                            <div className="font-medium">{order.user.name || order.user.email}</div>
                                            <div className="text-xs text-muted-foreground hidden md:block">
                                                {order.user.email}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-sm text-muted-foreground">
                                                {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={`${STATUS_COLORS[order.status] || ""} text-xs`}>
                                                {order.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell">
                                            {order.createdAt.toLocaleDateString("en-IN")}
                                        </TableCell>
                                        <TableCell className="text-right font-medium">
                                            ₹{order.total.toLocaleString("en-IN")}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
