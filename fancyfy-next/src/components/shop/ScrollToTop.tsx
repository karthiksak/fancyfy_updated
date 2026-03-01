"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export default function ScrollToTop() {
    const [show, setShow] = useState(false);

    useEffect(() => {
        const onScroll = () => setShow(window.scrollY > 400);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const scrollUp = () => window.scrollTo({ top: 0, behavior: "smooth" });

    return (
        <button
            onClick={scrollUp}
            aria-label="Scroll to top"
            className={`fixed bottom-20 right-6 z-50 w-11 h-11 rounded-full bg-gradient-to-br from-pink-500 to-violet-600 text-white shadow-lg shadow-pink-200/50 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-xl ${show ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0 pointer-events-none"
                }`}
        >
            <ArrowUp className="w-5 h-5" />
        </button>
    );
}
