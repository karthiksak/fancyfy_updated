"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingCart, LineChart, Users } from "lucide-react";

const NAV_ITEMS = [
    { href: "/admin", label: "Dashboard", icon: Home, exact: true },
    { href: "/admin/products", label: "Products", icon: ShoppingCart },
    { href: "/admin/orders", label: "Orders", icon: LineChart },
    { href: "/admin/users", label: "Customers", icon: Users },
];

export default function AdminSidebar() {
    const pathname = usePathname();

    return (
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {NAV_ITEMS.map((item) => {
                const isActive = item.exact
                    ? pathname === item.href
                    : pathname.startsWith(item.href);

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${isActive
                                ? "bg-muted text-primary font-semibold"
                                : "text-muted-foreground hover:text-primary"
                            }`}
                    >
                        <item.icon className="h-4 w-4" />
                        {item.label}
                    </Link>
                );
            })}
        </nav>
    );
}
