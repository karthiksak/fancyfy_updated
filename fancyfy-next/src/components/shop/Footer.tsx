import Link from "next/link";
import { Instagram, Twitter, Facebook, Mail, MapPin, Phone } from "lucide-react";

const LINKS = {
    Shop: [
        { label: "All Products", href: "/products" },
        { label: "New Arrivals", href: "/products" },
        { label: "Wishlist", href: "/wishlist" },
        { label: "Cart", href: "/cart" },
    ],
    Company: [
        { label: "About Us", href: "/" },
        { label: "Contact", href: "/" },
        { label: "Privacy Policy", href: "/" },
        { label: "Terms & Conditions", href: "/" },
    ],
};

const SOCIALS = [
    { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
    { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
    { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
];

export default function Footer() {
    return (
        <footer className="bg-gray-950 text-gray-300">
            {/* Main grid */}
            <div className="container mx-auto px-4 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                {/* Brand */}
                <div className="space-y-4">
                    <Link href="/" className="inline-block">
                        <span className="font-extrabold text-2xl bg-gradient-to-r from-pink-400 to-violet-400 bg-clip-text text-transparent">
                            Fancyfy
                        </span>
                    </Link>
                    <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
                        Handpicked fashion accessories for the modern you. Premium quality, unbeatable prices.
                    </p>
                    <div className="flex gap-3 pt-1">
                        {SOCIALS.map((s) => (
                            <a
                                key={s.label}
                                href={s.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={s.label}
                                className="w-9 h-9 rounded-full bg-gray-800 hover:bg-gradient-to-br hover:from-pink-500 hover:to-violet-600 flex items-center justify-center transition-all duration-200 hover:scale-110"
                            >
                                <s.icon className="w-4 h-4 text-gray-300" />
                            </a>
                        ))}
                    </div>
                </div>

                {/* Link columns */}
                {Object.entries(LINKS).map(([title, links]) => (
                    <div key={title}>
                        <h3 className="font-semibold text-white text-sm uppercase tracking-wider mb-4">{title}</h3>
                        <ul className="space-y-2.5">
                            {links.map((l) => (
                                <li key={l.label}>
                                    <Link href={l.href} className="text-sm text-gray-400 hover:text-pink-400 transition-colors">
                                        {l.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}

                {/* Contact */}
                <div>
                    <h3 className="font-semibold text-white text-sm uppercase tracking-wider mb-4">Get in Touch</h3>
                    <ul className="space-y-3 text-sm text-gray-400">
                        <li className="flex items-start gap-2">
                            <Mail className="w-4 h-4 mt-0.5 shrink-0 text-pink-400" />
                            <span>support@fancyfy.in</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <Phone className="w-4 h-4 mt-0.5 shrink-0 text-pink-400" />
                            <span>+91 79043 49234</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-pink-400" />
                            <span>Chennai, India</span>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Bottom bar */}
            <div className="border-t border-gray-800">
                <div className="container mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-xs text-gray-500">
                        © {new Date().getFullYear()} Fancyfy Inc. All rights reserved.
                    </p>
                    <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-600">We Accept:</span>
                        <div className="flex gap-2">
                            {["UPI", "Visa", "MC", "GPay"].map((m) => (
                                <span
                                    key={m}
                                    className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-gray-800 text-gray-400 border border-gray-700"
                                >
                                    {m}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
