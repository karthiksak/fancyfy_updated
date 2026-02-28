import Link from "next/link";
import { PlusCircle, Search } from "lucide-react";

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
import { deleteProduct } from "@/app/lib/actions";

export default async function ProductsParams({
    searchParams,
}: {
    searchParams: Promise<{ q?: string }>;
}) {
    const resolvedParams = await searchParams;
    const query = resolvedParams?.q || "";
    const products = await prisma.product.findMany({
        where: {
            name: {
                contains: query,
            },
        },
        orderBy: {
            createdAt: "desc",
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
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="hidden w-[100px] sm:table-cell">
                                    Image
                                </TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead className="hidden md:table-cell">
                                    Total Sales
                                </TableHead>
                                <TableHead className="hidden md:table-cell">
                                    Created at
                                </TableHead>
                                <TableHead>
                                    <span className="sr-only">Actions</span>
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {products.map((product) => (
                                <TableRow key={product.id}>
                                    <TableCell className="hidden sm:table-cell">
                                        <img
                                            alt="Product image"
                                            className="aspect-square rounded-md object-cover"
                                            height="64"
                                            src={JSON.parse(product.images)[0] || "/placeholder.svg"}
                                            width="64"
                                        />
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        {product.name}
                                    </TableCell>
                                    <TableCell>
                                        <span className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                                            {product.inStock ? "Active" : "Draft"}
                                        </span>
                                    </TableCell>
                                    <TableCell>₹{product.price.toFixed(2)}</TableCell>
                                    <TableCell className="hidden md:table-cell">
                                        25
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">
                                        {product.createdAt.toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                        <form action={deleteProduct.bind(null, product.id)}>
                                            <Button size="sm" variant="destructive">Delete</Button>
                                        </form>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
                <CardFooter>
                    <div className="text-xs text-muted-foreground">
                        Showing <strong>1-10</strong> of <strong>{products.length}</strong>{" "}
                        products
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
