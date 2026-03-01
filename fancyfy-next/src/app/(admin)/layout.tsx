import { auth } from "@/auth";
import Link from "next/link";
import { Package2, Home, ShoppingCart, Users, LineChart, LogOut, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut } from "@/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    return (
        <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
            {/* Desktop Sidebar */}
            <div className="hidden border-r bg-muted/40 md:block">
                <div className="flex h-full max-h-screen flex-col gap-2">
                    <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                        <Link href="/" className="flex items-center gap-2 font-semibold">
                            <Package2 className="h-6 w-6" />
                            <span>Fancyfy Admin</span>
                        </Link>
                    </div>
                    <div className="flex-1">
                        <AdminSidebar />
                    </div>
                    <div className="mt-auto p-4">
                        <form
                            action={async () => {
                                "use server";
                                await signOut();
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
                    {/* Mobile: link to admin home */}
                    <Link href="/admin" className="shrink-0 md:hidden flex items-center gap-2 font-semibold">
                        <Package2 className="h-5 w-5" />
                        <span className="text-sm">Admin</span>
                    </Link>
                    <div className="w-full flex-1">
                        {/* Mobile nav links */}
                        <nav className="flex md:hidden gap-4 text-sm">
                            <Link href="/admin" className="text-muted-foreground hover:text-foreground">Dashboard</Link>
                            <Link href="/admin/products" className="text-muted-foreground hover:text-foreground">Products</Link>
                            <Link href="/admin/orders" className="text-muted-foreground hover:text-foreground">Orders</Link>
                            <Link href="/admin/users" className="text-muted-foreground hover:text-foreground">Users</Link>
                        </nav>
                    </div>
                    <div className="rounded-full bg-slate-200 w-8 h-8 flex items-center justify-center text-sm font-medium">
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
