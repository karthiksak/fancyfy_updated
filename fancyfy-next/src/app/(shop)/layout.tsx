import { Navbar } from "@/components/shop/navbar";
import Footer from "@/components/shop/Footer";
import ScrollToTop from "@/components/shop/ScrollToTop";
import Toast from "@/components/ui/Toast";

export default function ShopLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <ScrollToTop />
            <Toast />
        </div>
    );
}
