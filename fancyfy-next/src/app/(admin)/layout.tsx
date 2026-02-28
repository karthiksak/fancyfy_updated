import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Package2, Home, ShoppingCart, Users, LineChart, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut } from "@/auth";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();
    if (!session?.user || (session.user as any).role !== "ADMIN") {
        // Double check even with middleware
        // redirect("/login");
    }

    return (
        <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
            <div className="hidden border-r bg-muted/40 md:block">
                <div className="flex h-full max-h-screen flex-col gap-2">
                    <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                        <Link href="/" className="flex items-center gap-2 font-semibold">
                            <Package2 className="h-6 w-6" />
                            <span className="">Fancyfy Admin</span>
                        </Link>
                    </div>
                    <div className="flex-1">
                        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                            <Link
                                href="/admin"
                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                            >
                                <Home className="h-4 w-4" />
                                Dashboard
                            </Link>
                            <Link
                                href="/admin/products"
                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                            >
                                <ShoppingCart className="h-4 w-4" />
                                Products
                            </Link>
                            <Link
                                href="/admin/orders"
                                className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:text-primary"
                            >
                                <LineChart className="h-4 w-4" />
                                Orders
                            </Link>
                            <Link
                                href="/admin/users"
                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                            >
                                <Users className="h-4 w-4" />
                                Customers
                            </Link>
                        </nav>
                    </div>
                    <div className="mt-auto p-4">
                        <form
                            action={async () => {
                                "use server"
                                await signOut()
                            }}
                        >
                            <Button variant="outline" className="w-full">
                                <LogOut className="mr-2 h-4 w-4" /> Sign Out
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
            <div className="flex flex-col">
                <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
                    <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                        <Package2 className="h-5 w-5" />
                        <span className="sr-only">Toggle navigation menu</span>
                    </Button>
                    <div className="w-full flex-1">
                        <h1 className="text-lg font-semibold">Dashboard</h1>
                    </div>
                    <div className="rounded-full bg-slate-200 w-8 h-8 flex items-center justify-center">
                        {session?.user?.name?.[0] || "A"}
                    </div>
                </header>
                <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
