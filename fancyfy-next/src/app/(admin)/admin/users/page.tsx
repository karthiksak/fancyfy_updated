import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { prisma } from "@/lib/prisma";

export default async function UsersPage() {
    const users = await prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        include: {
            _count: {
                select: { orders: true },
            },
        },
    });

    return (
        <Card>
            <CardHeader className="px-7">
                <CardTitle>Customers</CardTitle>
                <CardDescription>All registered users on your store.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead className="hidden sm:table-cell">Role</TableHead>
                            <TableHead className="hidden md:table-cell">Orders</TableHead>
                            <TableHead className="hidden md:table-cell">Joined</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell className="font-medium">
                                    {user.name || "—"}
                                </TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell className="hidden sm:table-cell">
                                    <span className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold ${user.role === "ADMIN"
                                            ? "bg-violet-100 text-violet-800 border-violet-200"
                                            : "bg-secondary text-secondary-foreground border-transparent"
                                        }`}>
                                        {user.role}
                                    </span>
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                    {user._count.orders}
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                    {user.createdAt.toLocaleDateString("en-IN")}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {users.length === 0 && (
                    <p className="text-center text-sm text-muted-foreground py-8">
                        No users found.
                    </p>
                )}
            </CardContent>
        </Card>
    );
}
