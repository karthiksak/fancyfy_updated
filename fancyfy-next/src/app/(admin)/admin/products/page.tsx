import Link from "next/link";
import { PlusCircle, Search, Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { prisma } from "@/lib/prisma";
import { deleteProduct, toggleProductStock } from "@/app/lib/actions";

export const dynamic = "force-dynamic";

export default async function ProductsPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string }>;
}) {
    const resolvedParams = await searchParams;
    const query = resolvedParams?.q || "";

    const products = await prisma.product.findMany({
        where: {
            name: { contains: query },
        },
        orderBy: { createdAt: "desc" },
        include: {
            _count: { select: { orderItems: true } },
        },
    });

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
                <form className="ml-auto flex-1 sm:flex-initial">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            name="q"
                            placeholder="Search products..."
                            className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
                            defaultValue={query}
                        />
                    </div>
                </form>
                <Link href="/admin/products/new">
                    <Button size="sm" className="h-8 gap-1">
                        <PlusCircle className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                            Add Product
                        </span>
                    </Button>
                </Link>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Products</CardTitle>
                    <CardDescription>
                        Manage your products and view their sales performance.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {products.length === 0 ? (
                        <p className="text-center text-sm text-muted-foreground py-8">
                            No products found. Add your first product to get started.
                        </p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="hidden w-[100px] sm:table-cell">Image</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead className="hidden md:table-cell">Orders</TableHead>
                                    <TableHead className="hidden md:table-cell">Created</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {products.map((product) => {
                                    let imgSrc = "/placeholder.svg";
                                    try { imgSrc = JSON.parse(product.images)[0] || "/placeholder.svg"; } catch { }
                                    return (
                                        <TableRow key={product.id}>
                                            <TableCell className="hidden sm:table-cell">
                                                <img
                                                    alt={product.name}
                                                    className="aspect-square rounded-md object-cover"
                                                    height="64"
                                                    src={imgSrc}
                                                    width="64"
                                                />
                                            </TableCell>
                                            <TableCell className="font-medium max-w-[200px] truncate">
                                                {product.name}
                                            </TableCell>
                                            <TableCell>
                                                <form action={toggleProductStock.bind(null, product.id)}>
                                                    <button
                                                        type="submit"
                                                        className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold cursor-pointer transition-colors ${product.inStock
                                                                ? "bg-green-100 text-green-800 border-green-200 hover:bg-green-200"
                                                                : "bg-red-100 text-red-800 border-red-200 hover:bg-red-200"
                                                            }`}
                                                    >
                                                        {product.inStock ? "Active" : "Out of Stock"}
                                                    </button>
                                                </form>
                                            </TableCell>
                                            <TableCell>₹{product.price.toLocaleString("en-IN")}</TableCell>
                                            <TableCell className="hidden md:table-cell">
                                                {product._count.orderItems}
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">
                                                {product.createdAt.toLocaleDateString("en-IN")}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Link href={`/admin/products/${product.id}/edit`}>
                                                        <Button size="sm" variant="outline" className="h-8 gap-1">
                                                            <Pencil className="h-3 w-3" />
                                                            <span className="sr-only sm:not-sr-only">Edit</span>
                                                        </Button>
                                                    </Link>
                                                    <form action={deleteProduct.bind(null, product.id)}>
                                                        <Button size="sm" variant="destructive" className="h-8">Delete</Button>
                                                    </form>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
                <CardFooter>
                    <div className="text-xs text-muted-foreground">
                        Showing <strong>{products.length}</strong> products
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
