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
import { prisma } from "@/lib/prisma";

export default async function OrdersPage() {
    const orders = await prisma.order.findMany({
        orderBy: {
            createdAt: "desc",
        },
        include: {
            user: true,
            items: true,
        },
    });

    return (
        <Card>
            <CardHeader className="px-7">
                <CardTitle>Orders</CardTitle>
                <CardDescription>Recent orders from your store.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Customer</TableHead>
                            <TableHead className="hidden sm:table-cell">Type</TableHead>
                            <TableHead className="hidden sm:table-cell">Status</TableHead>
                            <TableHead className="hidden md:table-cell">Date</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.map((order) => (
                            <TableRow key={order.id} className="bg-accent">
                                <TableCell>
                                    <div className="font-medium">{order.user.name || order.user.email}</div>
                                    <div className="hidden text-sm text-muted-foreground md:inline">
                                        {order.user.email}
                                    </div>
                                </TableCell>
                                <TableCell className="hidden sm:table-cell">
                                    Sale
                                </TableCell>
                                <TableCell className="hidden sm:table-cell">
                                    {order.status === "PAID" ? (
                                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200">
                                            {order.status}
                                        </Badge>
                                    ) : (
                                        <Badge variant="secondary" className="text-xs">
                                            {order.status}
                                        </Badge>
                                    )}
                                    {order.paymentId && (
                                        <div className="text-[10px] text-muted-foreground mt-1 font-mono">
                                            {order.paymentId.replace("dummy_", "")}
                                        </div>
                                    )}
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                    {order.createdAt.toLocaleDateString()}
                                </TableCell>
                                <TableCell className="text-right">₹{order.total.toFixed(2)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
