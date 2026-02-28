"use client";

import { useEffect, useState } from "react";

interface MetalPrices {
    gold24k: number;
    gold22k: number;
    gold18k: number;
    silver: number;
    platinum: number;
    live: boolean;
}

const FALLBACK: MetalPrices = { gold24k: 15910, gold22k: 14573, gold18k: 11933, silver: 267, platinum: 7231, live: false };

export default function MetalTicker() {
    const [prices, setPrices] = useState<MetalPrices>(FALLBACK);

    useEffect(() => {
        fetch("/api/metal-prices")
            .then((r) => r.json())
            .then((d) => setPrices(d))
            .catch(() => { });
    }, []);

    const items = [
        { label: "GOLD 24K", value: `₹${prices.gold24k.toLocaleString("en-IN")}/g`, color: "text-yellow-400" },
        { label: "GOLD 22K", value: `₹${prices.gold22k.toLocaleString("en-IN")}/g`, color: "text-yellow-300" },
        { label: "GOLD 18K", value: `₹${prices.gold18k.toLocaleString("en-IN")}/g`, color: "text-yellow-200" },
        { label: "SILVER", value: `₹${prices.silver.toLocaleString("en-IN")}/g`, color: "text-slate-300" },
        { label: "PLATINUM", value: `₹${prices.platinum.toLocaleString("en-IN")}/g`, color: "text-cyan-300" },
    ];

    return (
        <div className="bg-black text-white py-1.5 overflow-hidden relative">
            {prices.live && (
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-green-400 font-bold z-10 hidden sm:block">
                    ● LIVE
                </span>
            )}
            <div className="flex animate-[ticker_30s_linear_infinite] whitespace-nowrap gap-12">
                {[...items, ...items, ...items].map((item, i) => (
                    <span key={i} className="inline-flex items-center gap-2 text-xs font-semibold">
                        <span className="text-gray-600">●</span>
                        <span className="text-gray-400">{item.label}</span>
                        <span className={item.color}>{item.value}</span>
                    </span>
                ))}
            </div>
        </div>
    );
}
