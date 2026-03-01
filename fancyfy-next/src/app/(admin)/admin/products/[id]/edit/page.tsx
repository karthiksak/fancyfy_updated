import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { updateProduct } from "@/app/lib/actions";

export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) notFound();

    let images: string[] = [];
    try { images = JSON.parse(product.images); } catch { }

    const updateWithId = updateProduct.bind(null, id);

    return (
        <form action={updateWithId}>
            <div className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4">
                <div className="flex items-center gap-4">
                    <Link href="/admin/products">
                        <Button variant="outline" size="icon" className="h-7 w-7">
                            <ChevronLeft className="h-4 w-4" />
                            <span className="sr-only">Back</span>
                        </Button>
                    </Link>
                    <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                        Edit Product
                    </h1>
                    <div className="hidden items-center gap-2 md:ml-auto md:flex">
                        <Link href="/admin/products">
                            <Button variant="outline" size="sm">Cancel</Button>
                        </Link>
                        <Button size="sm" type="submit">Save Changes</Button>
                    </div>
                </div>
                <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
                    <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                        <Card>
                            <CardHeader>
                                <CardTitle>Product Details</CardTitle>
                                <CardDescription>
                                    Update the product information below.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-6">
                                    <div className="grid gap-3">
                                        <Label htmlFor="name">Name</Label>
                                        <Input id="name" name="name" type="text" defaultValue={product.name} required />
                                    </div>
                                    <div className="grid gap-3">
                                        <Label htmlFor="description">Description</Label>
                                        <Textarea id="description" name="description" defaultValue={product.description} className="min-h-32" required />
                                    </div>
                                    <div className="grid gap-3">
                                        <Label htmlFor="price">Price (₹)</Label>
                                        <Input id="price" name="price" type="number" step="0.01" defaultValue={product.price} required />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Images</CardTitle>
                                <CardDescription>Update image URLs for this product.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4">
                                    {[0, 1, 2, 3].map((idx) => (
                                        <div key={idx} className="grid gap-2">
                                            <Label htmlFor={`image${idx + 1}`}>
                                                Image URL {idx + 1}{idx === 0 ? " (Main)" : " (Optional)"}
                                            </Label>
                                            <Input
                                                id={`image${idx + 1}`}
                                                name={`image${idx + 1}`}
                                                type="url"
                                                defaultValue={images[idx] || ""}
                                                placeholder={`https://example.com/image${idx + 1}.jpg`}
                                                required={idx === 0}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
                        <Card>
                            <CardHeader>
                                <CardTitle>Product Status</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-3">
                                    <Label htmlFor="status">Status</Label>
                                    <select
                                        id="status"
                                        name="status"
                                        defaultValue={product.inStock ? "active" : "draft"}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    >
                                        <option value="active">Active (In Stock)</option>
                                        <option value="draft">Draft (Out of Stock)</option>
                                    </select>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Category</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-3">
                                    <Label htmlFor="category">Category</Label>
                                    <Input id="category" name="category" type="text" defaultValue={product.category} required />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
                {/* Mobile save button */}
                <div className="flex items-center gap-2 md:hidden">
                    <Link href="/admin/products" className="flex-1">
                        <Button variant="outline" className="w-full">Cancel</Button>
                    </Link>
                    <Button type="submit" className="flex-1">Save Changes</Button>
                </div>
            </div>
        </form>
    );
}
