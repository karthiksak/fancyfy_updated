"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle } from "lucide-react";

export default function NewsletterForm() {
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email.trim()) {
            setSubmitted(true);
        }
    };

    if (submitted) {
        return (
            <div className="flex items-center justify-center gap-2 text-green-400 text-sm font-semibold py-3">
                <CheckCircle className="w-5 h-5" />
                Thank you! You&apos;re now subscribed.
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full max-w-md mx-auto">
            <Input
                type="email"
                required
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 focus:border-pink-400"
            />
            <Button
                type="submit"
                className="shrink-0 bg-gradient-to-r from-pink-500 to-violet-600 hover:from-pink-600 hover:to-violet-700 border-0"
            >
                Subscribe
            </Button>
        </form>
    );
}
